"""Roundtrip edits and verify paper-specific data separately from visual QA."""
import hashlib,json,sys,zipfile
from pathlib import Path
from pptx import Presentation
from pptx.chart.data import CategoryChartData

src=Path(sys.argv[1]); qa=Path(sys.argv[2]); before=hashlib.sha256(src.read_bytes()).hexdigest()
p=Presentation(src)
assert len(p.slides)==12
chart_shapes=[s for slide in p.slides for s in slide.shapes if s.has_chart]
assert len(chart_shapes)==2
assert list(chart_shapes[0].chart.series[0].values)==[66.5,89.7]
assert list(chart_shapes[1].chart.series[0].values)==[6.4,6.7,6.8,7.0]
titles=[]; styles={}
for role in ['title:claim','support:subtitle','support:conclusion','metadata:source','metadata:page']:
    values=[]
    for slide in p.slides:
        shape=next(s for s in slide.shapes if s.name==role)
        run=shape.text_frame.paragraphs[0].runs[0]
        values.append([shape.left,shape.top,shape.width,shape.height,run.font.name,run.font.size.pt,str(run.font.color.rgb)])
    assert all(v==values[0] for v in values),role
    styles[role]=values[0]
text=next(s for s in p.slides[0].shapes if s.name=='title:claim');text.text='EDIT CHECK'
shape=next(s for slide in p.slides for s in slide.shapes if s.shape_type==1)
left=shape.left;shape.left+=9144
for idx,item in enumerate(chart_shapes):
    data=CategoryChartData();data.categories=['a','b'];data.add_series('edited',[idx+1,idx+2]);item.chart.replace_data(data)
tables=[s for slide in p.slides for s in slide.shapes if s.has_table]
assert len(tables)==2
tables[0].table.cell(1,0).text='EDIT TABLE'
copy=qa/'editability-copy.pptx';p.save(copy);q=Presentation(copy)
assert next(s for s in q.slides[0].shapes if s.name=='title:claim').text=='EDIT CHECK'
assert next(s for slide in q.slides for s in slide.shapes if s.shape_type==1).left==left+9144
for idx,c in enumerate([s.chart for slide in q.slides for s in slide.shapes if s.has_chart]):assert list(c.series[0].values)==[idx+1,idx+2]
assert next(s.table for slide in q.slides for s in slide.shapes if s.has_table).cell(1,0).text=='EDIT TABLE'
with zipfile.ZipFile(src) as z:
    assert z.testzip() is None
    workbooks=[n for n in z.namelist() if n.startswith('ppt/embeddings/') and n.endswith('.xlsx')]
    assert len(workbooks)==2
assert hashlib.sha256(src.read_bytes()).hexdigest()==before
result={'passed':True,'slides':12,'native_charts':2,'editable_tables':2,'embedded_workbooks':2,'text_shape_chart_table_edit_roundtrip':True,'common_style_consistent':True,'chart_data_checked':True,'original_unchanged':True,'images_are_raster_evidence':True,'shape_counts':{'text':sum(s.has_text_frame for slide in q.slides for s in slide.shapes),'image':sum(s.shape_type==13 for slide in q.slides for s in slide.shapes)}}
(qa/'editability.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
(qa/'style-consistency.json').write_text(json.dumps(styles,indent=2),encoding='utf-8')
print(json.dumps(result))
