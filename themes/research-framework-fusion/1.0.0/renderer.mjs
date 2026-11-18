export function populate(p,task){
p.theme.defaultFont='Microsoft YaHei';
const palettes={A:['#173F6F','#EAF0F7','#A64145'],B:['#245F68','#EDF5F4','#AD7132'],C:['#3D4C78','#EEF0F8','#785985']};
const [ink,pale,accent]=palettes[task.palette];
for(let index=0;index<3;index++){
const s=p.slides.add();s.background.fill='#FFFFFF';
const text=(v,x,y,w,h,size=22,b=false,color=ink)=>{const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=v;a.text.style={fontFamily:'Microsoft YaHei',fontSize:size,bold:b,color};return a;};
const rect=(x,y,w,h,fill=pale)=>s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:ink,width:1}});
const header=(v,x,y,w)=>{rect(x,y,w,38,ink);text(v,x+12,y+3,w-24,32,23,true,'#FFFFFF');};
const arrow=(x,y,w=34,h=22)=>s.shapes.add({geometry:'rightArrow',position:{left:x,top:y,width:w,height:h},fill:accent,line:{fill:accent,width:0}});
const cell=(v,x,y,w,h)=>{rect(x,y,w,h);text(v,x+12,y+10,w-24,h-20,21);};
const chart=(x,y,w,h)=>s.charts.add('bar',{position:{left:x,top:y,width:w,height:h},categories:['对照','方案Ⅰ','方案Ⅱ'],series:[{name:'模拟转化率 (%)',values:[5,8,11],fill:ink}],hasLegend:false,barOptions:{direction:'column'},dataLabels:{showValue:true,position:'outEnd',textStyle:{fontSize:20,fontFamily:'Microsoft YaHei'}}});
const titles=['研究背景与科学问题','研究内容与技术路线','实验结果与机制分析'];
text(`${index+1}  ${titles[index]}`,40,20,1195,58,34,true);rect(40,85,1200,2,ink);
text('模拟课题：催化膜中活性位点与选择性传质的协同设计',42,107,1190,45,24,true);
if(index===0){
header('反应与分离的空间矛盾',40,178,360);text('目标产物生成后仍可能继续转化\n催化位点与分离通道需要匹配',52,234,335,84,22);
cell('传统构型\n催化床与分离单元分离',52,339,330,83);cell('结构变量\n膜厚、位点位置与通道连通性',52,447,330,83);
arrow(414,337,45,28);header('可检验的膜内分区假设',485,178,755);
const layers=[['选择性通道：产物向外移出',pale],['反应区域：活性位点参与异构化',ink],['多孔支撑：提供机械支撑与进料路径',pale]];
layers.forEach(([label,fill],i)=>{rect(520,254+i*81,660,65,fill);text(label,543,268+i*81,615,40,23,true,i===1?'#FFFFFF':ink);});
text('结构示意，非显微实测图；箭头仅表达假设路径',520,513,660,29,17);
rect(485,554,755,44,accent);text('科学问题：位点分布如何影响反应与传质的竞争？',499,560,725,34,22,true,'#FFFFFF');
}else if(index===1){
const heads=['任务一 结构设计','任务二 性能评价','任务三 机制检验'];
for(let i=0;i<3;i++){const x=40+i*410;header(heads[i],x,178,380);rect(x,216,380,255,'#FFFFFF');
text(['膜厚与位点分布\n设置结构对照','转化率与选择性\n同步记录跨膜通量','反应 / 传质解耦\n设置停留时间对照'][i],x+17,236,345,66,22);
if(i===0){for(let k=0;k<3;k++){rect(x+25,327+k*30,330,19,k===1?ink:pale);}text('分区厚度与界面位置可调',x+25,432,330,29,19);}else if(i===1){chart(x+15,314,350,143);}else{cell('反应控制',x+22,330,150,62);arrow(x+177,350,25,18);cell('传质控制',x+210,330,150,62);text('比较条件保持一致',x+30,428,320,30,20);}}
header('问题—方法—证据对应',40,497,1200);const labels=['结构参数','表征证据','性能响应','机制边界'];labels.forEach((v,i)=>{cell(v,52+i*303,550,260,49);if(i<3)arrow(318+i*303,564,27,18);});
}else{
header('主结果：模拟转化率对比 (%)',40,178,713);chart(54,231,685,310);text('统一条件的合成示例，无误差条，不作统计推断',57,552,680,30,18);
header('机制链与待验证因素',778,178,462);cell('位点可及性\n影响有效反应速率',794,233,430,77);cell('产物移出\n改变局部停留时间',794,335,430,77);cell('替代解释\n缺陷通道、吸附及副反应',794,437,430,77);
text('边界：趋势不等于因果，需独立对照验证',793,548,432,44,21,true,accent);
}
rect(40,624,1200,49,ink);text(['研究切入点：将结构分区与催化、传质证据对应，而非预设性能提升','技术路线：结构变量 → 表征与性能 → 对照验证 → 机制修正','示例结论：评价选择性时同时报告转化率、通量及可替代解释'][index],55,631,1170,37,22,true,'#FFFFFF');
text('全部数据与结构均为模拟教学示例，不代表真实论文实验结论',42,686,1190,25,15);
s.speakerNotes.text=JSON.stringify({synthetic:true,palette:task.palette,data:[5,8,11],layout:titles[index],scientific_claims:'hypotheses only'});
}}
