await artifactSession.run(async ({presentation,session})=>{
const s=presentation.slides.add(); s.background.fill='#FFFFFF';
const t=(text,x,y,w,h,size=24,color='#172B4D',bold=false)=>{const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=text;a.text.style={fontFamily:'Microsoft YaHei',fontSize:size,color,bold};return a;};
t('催化 MFI 沸石膜：高对二甲苯选择性，转化率仍受限',48,30,1180,62,36,'#172B4D',true);
t('α-Al₂O₃ 支撑体供铝，H⁺ 交换使膜兼具异构化与选择性分离功能',50,103,1170,44,24,'#526477');
t('催化与分离紧密相邻',50,181,610,42,28,'#0072B2',true);
const box=(label,x,y,w,h,fill)=>{const a=s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'#B8C6D3',width:1}});t(label,x+12,y+16,w-24,h-20,22);};
box('进料：间二甲苯 MX',52,258,260,76,'#F1F5F8');
box('α-Al₂O₃ 支撑体',52,370,260,95,'#EDF1F4');
box('富 Al 的催化区\nH⁺ 酸位点促异构化',348,258,270,105,'#E8F2FA');
box('低 Al 的分离区\n优先透过对二甲苯 PX',348,395,270,105,'#EAF5F0');
t('→',311,275,40,44,30,'#0072B2',true);t('↓',456,357,45,40,30,'#0072B2',true);
t('供铝形成可交换骨架',54,478,270,44,19,'#526477');
t('概念重绘，依据原文 Fig. 4 与 §3.1–3.2',52,545,590,36,17,'#6C7A89');
t('270 °C 实测表现',712,181,490,42,28,'#0072B2',true);
t('92.1%',712,243,270,85,64,'#0072B2',true);
t('PX 总选择性',715,328,380,35,23);
t('6.5%',1010,257,225,68,48,'#D55E00',true);
t('MX 转化率',1015,328,220,35,23);
t('进料 / 吹扫 He 均为 20 mL/min',714,382,510,36,21,'#526477');
t('解释：产物 PX 就近移出反应区\n限制：盘式膜活性位点数量有限',714,441,520,90,23);
t('研究启示：需同时匹配催化位点密度与膜分离能力',52,602,1180,45,26,'#172B4D',true);
t('Zhang et al., Journal of Membrane Science 389 (2012) 451–458. DOI: 10.1016/j.memsci.2011.11.013',52,667,1180,26,15,'#6C7A89');
s.speakerNotes.text='来源：用户本地 PDF。92.1% 与 6.5%：摘要、印刷页455 Table 2 及 Fig.5正文。选择性为渗透侧与截留侧合并产品口径，不是渗透液纯度。20 mL/min：Fig.5图注。结构与机制：印刷页453–455，Fig.4。活性位点限制：印刷页457结论。示意图为概念重绘，不按比例，不代表微观结构直接观测。未执行 PaperBanana 或 Academic Figure Skills，此试点验证仓库内容规范与内置制作流程。';
},{artifactType:'presentation'});

