'use strict';

// Source-first layout extension, called by the pinned skill's normal builder.
// Inspired by the user's Salvinia deck; no reference images, logos or text copied.
const fs = require('fs');
const C = {navy:'173D64',blue:'286FA7',cyan:'21A5C8',ink:'283B50',muted:'6D8195',rule:'D5E2EF'};
const FONT = 'Microsoft YaHei';
function text(s, value, box, size, extra={}) {
  s.addText(value,{...box,fontFace:FONT,fontSize:size,color:C.ink,margin:0,
    breakLine:false,valign:'mid',...extra});
}
function line(s,x,y,w,color=C.rule,width=0.6) {
  s.addShape('line',{x,y,w,h:0,line:{color,width}});
}
function base(s,d,section) {
  s.background = {color:'FFFFFF'};
  text(s,section,{x:0.42,y:0.16,w:9.16,h:0.34},13.5,{color:C.blue,objectName:'metadata:section'});
  text(s,d.title,{x:0.42,y:0.59,w:9.16,h:0.66},28,{bold:true,color:C.navy,objectName:'title:claim'});
  line(s,0.42,1.30,9.16);
  text(s,d.subtitle,{x:0.42,y:1.40,w:9.16,h:0.43},16,{color:C.muted,objectName:'support:subtitle'});
}
function footer(s,d,index) {
  text(s,d.sources[0],{x:0.42,y:5.30,w:8.05,h:0.31},11,{color:C.muted,objectName:'metadata:source'});
  text(s,`${String(index).padStart(2,'0')} / 03`,{x:8.6,y:5.30,w:1.0,h:0.31},11,{align:'right',color:C.muted,objectName:'metadata:page'});
  s.addNotes(d.notes || '');
}
function imageSize(file) {
  const b=fs.readFileSync(file);
  if(b.readUInt32BE(0)===0x89504e47) return [b.readUInt32BE(16),b.readUInt32BE(20)];
  throw new Error('This evidence layout requires original PNG crops.');
}
function image(s,path,box,alt) {
  const [iw,ih]=imageSize(path), scale=Math.min(box.w/iw,box.h/ih);
  const w=iw*scale,h=ih*scale;
  s.addImage({path,x:box.x+(box.w-w)/2,y:box.y+(box.h-h)/2,w,h,altText:alt});
}
function morphology(pptx,s,d) {
  base(s,d,'01  膜层结构');
  const w=2.84,gap=0.32,x0=0.42;
  d.figures.forEach((f,i)=>{
    const x=x0+i*(w+gap);
    text(s,f.title,{x,y:1.91,w,h:0.44},18,{bold:true,color:C.blue,align:'center',objectName:`support:figure-${i}`});
    image(s,d.__figurePaths[i],{x,y:2.43,w,h:1.88},f.alt_text);
    text(s,f.caption,{x:x-0.02,y:4.39,w:w+0.04,h:0.36},13,{align:'center',color:C.muted,objectName:`metadata:caption-${i}`});
  });
  text(s,d.interpretation,{x:0.42,y:4.87,w:9.16,h:0.43},18,{bold:true,color:C.navy,align:'center',objectName:'support:conclusion'});
  footer(s,d,1);
}
function matchedConversion(pptx,s,d) {
  base(s,d,'03  催化性能');
  const chart=d.chart;
  const series=chart.series.map(a=>({name:a.name,labels:chart.categories,values:a.values}));
  s.addChart(pptx.ChartType.bar,series,{
    x:0.42,y:1.94,w:9.16,h:2.12,barDir:'bar',barGrouping:'clustered',gapSizePct:110,
    showLegend:false,showTitle:false,showValue:true,showCatName:false,
    showBorder:false,chartColors:[C.blue,C.cyan],varyColors:true,
    dataLabelColor:C.navy,dataLabelFormatCode:'0.0"%"',
    dataLabelPosition:'outEnd',dataLabelFontFace:FONT,dataLabelFontSize:18,
    catAxisLabelFontFace:FONT,catAxisLabelFontSize:14,catAxisLabelColor:C.ink,
    catAxisLineShow:false,catAxisMajorTickMark:'none',catAxisMinorTickMark:'none',
    valAxisLabelFontFace:FONT,valAxisLabelFontSize:12,valAxisLabelColor:C.muted,
    valAxisMinVal:0,valAxisMaxVal:100,valAxisMajorUnit:20,
    valAxisTitle:chart.options.valAxisTitle,showValAxisTitle:true,
    valAxisLineShow:false,valAxisMajorTickMark:'none',valAxisMinorTickMark:'none',
    catAxisTitleFontFace:FONT,valAxisTitleFontFace:FONT,valAxisTitleFontSize:12,
    valGridLine:{color:'E3ECF3',width:0.5},catGridLine:{style:'none'},showPercent:false,
    chartArea:{fill:{color:'FFFFFF'},line:{color:'FFFFFF',transparency:100}},
    plotArea:{fill:{color:'FFFFFF'},line:{color:'FFFFFF',transparency:100}},
    layout:{x:0.27,y:0.05,w:0.65,h:0.70},
  });
  text(s,d.studio_condition,{x:0.42,y:4.14,w:9.16,h:0.40},14,{align:'center',color:C.muted,objectName:'support:conditions'});
  text(s,d.studio_limit,{x:0.42,y:4.53,w:9.16,h:0.28},11,{align:'center',color:C.muted,objectName:'metadata:limitation'});
  text(s,d.studio_conclusion,{x:0.42,y:4.87,w:9.16,h:0.43},18,{align:'center',bold:true,color:C.navy,objectName:'support:conclusion'});
  footer(s,d,3);
}
function mechanism(pptx,s,d) {
  base(s,d,'02  机制证据');
  const w=4.40,gap=0.36;
  d.figures.forEach((f,i)=>{
    const x=0.42+i*(w+gap);
    text(s,f.title,{x,y:1.91,w,h:0.44},18,{bold:true,color:C.blue,align:'center',objectName:`support:figure-${i}`});
    image(s,d.__figurePaths[i],{x,y:2.43,w,h:1.88},f.alt_text);
    text(s,f.caption,{x,y:4.39,w,h:0.36},13,{align:'center',color:C.muted,objectName:`metadata:caption-${i}`});
  });
  text(s,d.interpretation,{x:0.42,y:4.87,w:9.16,h:0.43},18,{bold:true,color:C.navy,align:'center',objectName:'support:conclusion'});
  footer(s,d,2);
}
exports.render = (pptx,s,d) => {
  if(d.studio_layout==='salvinia-morphology') morphology(pptx,s,d);
  else if(d.studio_layout==='salvinia-mechanism') mechanism(pptx,s,d);
  else if(d.studio_layout==='salvinia-matched-conversion') matchedConversion(pptx,s,d);
  else throw new Error(`Unsupported studio layout: ${d.studio_layout}`);
};
