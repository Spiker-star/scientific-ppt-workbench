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
  text(s,`${String(d.page_index).padStart(2,'0')} / ${String(d.total_pages).padStart(2,'0')}`,{x:8.6,y:5.30,w:1.0,h:0.31},11,{align:'right',color:C.muted,objectName:'metadata:page'});
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

function conclusion(s,d){text(s,d.studio_conclusion,{x:.42,y:4.87,w:9.16,h:.43},18,{bold:true,color:C.navy,align:'center',objectName:'support:conclusion'});}
function heading(s,v,x,y,w){text(s,v,{x,y,w,h:.43},18,{bold:true,color:C.blue,objectName:'support:module'});}
function body(s,v,x,y,w,h=.65){text(s,v,{x,y,w,h},16,{objectName:'body:explanation'});}
function panelImage(s,d,i,box){image(s,d.__figurePaths[i],box,d.figures[i].alt_text);}
function arrow(s,x,y,w=.3){s.addShape('chevron',{x,y,w,h:.23,fill:{color:C.cyan},line:{color:C.cyan,transparency:100}});}
function evidence(p,s,d){
 const n=d.figures.length,w=(9.16-.28*(n-1))/n;
 d.figures.forEach((f,i)=>{const x=.42+i*(w+.28); heading(s,f.title,x,1.92,w);panelImage(s,d,i,{x,y:2.45,w,h:1.85});text(s,f.caption,{x,y:4.36,w,h:.4},12,{color:C.muted,objectName:'metadata:caption'});});
}
function overview(p,s,d){
 heading(s,'对象：H-MFI / α-Al₂O₃ 催化膜',.42,1.98,9.16);
 panelImage(s,d,0,{x:2.4,y:2.5,w:5.2,h:1.83});
 body(s,'间二甲苯异构化',.42,2.84,2,.48);arrow(s,2.08,3.02);
 body(s,'对二甲苯优先移出',7.8,2.84,1.78,.8);
 text(s,'C. Zhang 等 · Journal of Membrane Science 389 (2012) 451–458',{x:.42,y:4.39,w:9.16,h:.35},13,{color:C.muted,align:'center',objectName:'metadata:paper'});
}
function contrast(p,s,d){
 d.blocks.forEach((b,i)=>{const x=.42+i*4.76;heading(s,b.title,x,2,4.4);body(s,b.body,x,2.58,4.4,.85);line(s,x,3.57,4.4);body(s,b.detail,x,3.81,4.4,.85);});
}
function roadmap(p,s,d){
 const w=2.08;
 d.blocks.forEach((b,i)=>{const x=.42+i*2.36;heading(s,b.title,x,2.05,w);line(s,x,2.57,w,C.cyan,2);body(s,b.body,x,2.83,w,.9);text(s,b.detail,{x,y:3.96,w,h:.7},13,{color:C.muted,objectName:'metadata:method'});if(i<3)arrow(s,x+2.1,3.14,.2);});
}
function acid(p,s,d){
 heading(s,'NH₃-TPD：核壳颗粒酸性',.42,1.96,4.4);
 panelImage(s,d,0,{x:.5,y:2.49,w:4.2,h:1.85});
 const x=5.15;heading(s,'催化对照：300 °C',x,1.96,4.43);
 s.addTable([['颗粒样品','转化率 / 选择性'],['纯硅 MFI','未检出异构化产物'],['α-Al₂O₃','未检出异构化产物'],['核壳颗粒','0.6% / 100%']],{x,y:2.55,w:4.43,h:1.65,fontFace:FONT,fontSize:16,color:C.ink,border:{type:'solid',color:C.rule,pt:.6},margin:.035,autoFit:false,colW:[1.55,2.88]});
 text(s,'颗粒实验：0.2 g；He 20 mL/min；MX 分压 0.26 kPa',{x:.42,y:4.43,w:9.16,h:.35},12,{color:C.muted,objectName:'metadata:conditions'});
}
function model(p,s,d){
 panelImage(s,d,0,{x:2.0,y:1.98,w:6,h:2.7});
 heading(s,'低铝表层',.42,2.26,1.6);text(s,'择形分离',{x:.42,y:2.76,w:1.6,h:.4},14,{color:C.muted,objectName:'support:layer'});
 heading(s,'含铝区域',8.0,2.26,1.6);text(s,'提供催化位点',{x:8,y:2.76,w:1.6,h:.4},14,{color:C.muted,objectName:'support:layer'});
}
function temperature(p,s,d){
 panelImage(s,d,0,{x:.55,y:1.94,w:5.1,h:2.77});
 heading(s,'270 °C → 390 °C',6.05,2.05,3.5);
 body(s,'MX 转化率\n6.5% → 10.7%',6.05,2.68,3.5,.8);
 body(s,'PX 选择性\n92.1% → 80.1%',6.05,3.68,3.5,.8);
}
function coupled(p,s,d){
 d.figures.forEach((f,i)=>{const x=.42+i*3.13;heading(s,f.title,x,1.94,2.92);panelImage(s,d,i,{x,y:2.49,w:2.92,h:1.82});});
 const x=6.8;heading(s,'膜贡献 / %',x,1.94,2.78);
 s.addTable([['温度 / °C','膜贡献'],['270','40.1'],['300','37.8'],['330','34.1'],['360','30.2'],['390','26.1']],{x,y:2.49,w:2.78,h:1.85,fontFace:FONT,fontSize:16,color:C.ink,border:{type:'solid',color:C.rule,pt:.5},margin:.015,autoFit:false});
 text(s,'膜贡献 = 渗透侧 PX / 两侧总 PX；不是产率增幅',{x:.42,y:4.41,w:9.16,h:.35},13,{color:C.muted,objectName:'metadata:definition'});
}
function operating(p,s,d){
 heading(s,'进料流量：选择性与产率权衡',.42,1.94,4.5);
 panelImage(s,d,0,{x:.42,y:2.48,w:4.5,h:1.88});
 heading(s,'吹扫流量：同条件对照',5.15,1.94,4.43);
 s.addChart(p.ChartType.line,[{name:'PX 产率 / %',labels:['10','20','40','60'],values:[6.4,6.7,6.8,7.0]}],{x:5.15,y:2.44,w:4.43,h:1.93,showLegend:false,chartColors:[C.blue],showTitle:false,showValue:true,dataLabelFormatCode:'0.0',dataLabelPosition:'t',dataLabelFontSize:12,showCatName:false,catAxisLabelFontFace:FONT,catAxisLabelFontSize:11,valAxisLabelFontSize:11,valAxisMinVal:0,valAxisMaxVal:8,valAxisMajorUnit:2,showCatAxisTitle:true,catAxisTitle:'吹扫流量 / (mL/min)',showValAxisTitle:true,valAxisTitle:'PX 产率 / %',catAxisTitleFontSize:11,valAxisTitleFontSize:11,showMarker:true,lineSize:2,valGridLine:{color:C.rule,width:.5},showBorder:false,chartArea:{fill:{color:'FFFFFF'},line:{color:'FFFFFF',transparency:100}}});
 text(s,'300 °C；左：吹扫 20 mL/min；右：进料 20 mL/min（Table 5）',{x:.42,y:4.44,w:9.16,h:.35},12,{color:C.muted,objectName:'metadata:conditions'});
}
function summary(p,s,d){
 d.blocks.forEach((b,i)=>{const x=.42+(i%2)*4.76,y=1.96+Math.floor(i/2)*1.4;heading(s,b.title,x,y,4.4);body(s,b.body,x,y+.47,4.4,.75);});
}
exports.render=(p,s,d)=>{
 if(d.paper_layout==='comparison'){
   const frozen=require('../themes/research-studio-unified/1.0.0/renderer.cjs');
   const proxy=new Proxy(s,{get(target,key){if(key==='addText')return (v,o)=>{if(o.objectName==='metadata:page')v=`${String(d.page_index).padStart(2,'0')} / 12`;if(o.objectName==='metadata:section')v=d.section;return target.addText(v,o);};const v=target[key];return typeof v==='function'?v.bind(target):v;}});
   frozen.render(p,proxy,{...d,studio_layout:'salvinia-matched-conversion'});return;
 }
 base(s,d,d.section);
 const dispatch={overview,contrast,roadmap,evidence,acid,model,temperature,coupled,operating,summary};
 if(!dispatch[d.paper_layout])throw Error('Unsupported paper layout '+d.paper_layout);
 dispatch[d.paper_layout](p,s,d);conclusion(s,d);footer(s,d,d.page_index);
};
