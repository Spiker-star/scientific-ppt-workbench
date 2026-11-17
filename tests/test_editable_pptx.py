"""Acceptance check: edit text, shape position, and chart data, save and reopen."""
import hashlib
import json
from pathlib import Path
import sys
from zipfile import ZipFile
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.util import Inches

ROOT = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'output/offline-bilingual-local.pptx'
p = Presentation(source)
assert len(p.slides) == 2
slide_checks = []
for slide in p.slides:
    charts = [s for s in slide.shapes if s.has_chart]
    assert len(charts) == 1
    assert list(charts[0].chart.series[0].values) == [5, 8, 11]
    assert [c.label for c in charts[0].chart.plots[0].categories] == ['A', 'B', 'C']
    texts = [s for s in slide.shapes if s.has_text_frame and s.text]
    shapes = [s for s in slide.shapes if s.name == 'catalysis']
    assert len(texts) >= 10 and len(shapes) == 1
    assert any('Synthetic' in s.text or '合成示例' in s.text for s in texts)
    slide_checks.append({'text_objects': len(texts), 'native_chart_count': 1, 'data': [5, 8, 11]})
with ZipFile(source) as z:
    workbooks = [n for n in z.namelist() if n.startswith('ppt/embeddings/') and n.endswith('.xlsx')]
    assert len(workbooks) == 2

# Mutate a private copy only. This is file-level editing, not an application UI test.
first = p.slides[0]
title = next(s for s in first.shapes if s.name == 'slide-title')
title.text = 'EDIT ROUNDTRIP / 编辑回读'
shape = next(s for s in first.shapes if s.name == 'catalysis')
old_left = shape.left
shape.left = old_left + Inches(0.1)
chart = next(s.chart for s in first.shapes if s.has_chart)
data = CategoryChartData()
data.categories = ['A', 'B', 'C']
data.add_series('Changed data', [6, 9, 12])
chart.replace_data(data)
private = ROOT / 'qa/private'
private.mkdir(parents=True, exist_ok=True)
edited = private / 'edited-roundtrip.pptx'
p.save(edited)
q = Presentation(edited)
assert next(s for s in q.slides[0].shapes if s.name == 'slide-title').text == 'EDIT ROUNDTRIP / 编辑回读'
assert next(s for s in q.slides[0].shapes if s.name == 'catalysis').left == old_left + Inches(0.1)
assert list(next(s.chart for s in q.slides[0].shapes if s.has_chart).series[0].values) == [6, 9, 12]
assert list(next(s.chart for s in q.slides[1].shapes if s.has_chart).series[0].values) == [5, 8, 11]
result = {'status': 'pass', 'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
          'slide_count': 2, 'embedded_workbooks': 2, 'slides': slide_checks,
          'text_edit_roundtrip': True, 'shape_move_roundtrip': True, 'chart_data_edit_roundtrip': True,
          'powerpoint_application_test': 'not_performed'}
(ROOT / 'qa/offline-editability.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result))
