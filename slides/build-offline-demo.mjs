// Run populate(presentation) in Codex Artifact Session or a bundled Artifact Tool client.
// All numbers below are synthetic, not extracted from a research paper.
export const demoData = { categories: ['A', 'B', 'C'], values: [5, 8, 11] };
export function populate(presentation) {
  presentation.theme.defaultFont = 'Microsoft YaHei';
  for (const lang of ['zh', 'en']) {
    const zh = lang === 'zh';
    const s = presentation.slides.add();
    s.background.fill = '#FFFFFF';
    function text(name, value, x, y, w, h, size = 24, color = '#172B4D', bold = false) {
      const a = s.shapes.add({ name, geometry: 'textbox', position: { left: x, top: y, width: w, height: h }, fill: 'none', line: { fill: 'none', width: 0 } });
      a.text = value;
      a.text.style = { fontFamily: 'Microsoft YaHei', fontSize: size, color, bold };
      return a;
    }
    text('slide-title', zh ? '催化与分离耦合：示例膜反应器' : 'Coupled catalysis and separation', 48, 32, 1180, 60, 39, '#172B4D', true);
    text('data-disclosure', zh ? '合成示例数据，仅用于流程演示，不代表论文实验结果' : 'Synthetic demonstration data, not experimental findings', 50, 106, 1180, 40, 25, '#687B8D');
    text('mechanism-heading', zh ? '概念结构' : 'Conceptual structure', 50, 181, 570, 45, 29, '#0072B2', true);
    function node(name, label, x, y, w, h, fill) {
      s.shapes.add({ name, geometry: 'rect', position: { left: x, top: y, width: w, height: h }, fill, line: { fill: '#B3C8D9', width: 1 } });
      text(name + '-label', label, x + 18, y + 20, w - 36, h - 30, 24);
    }
    node('feed', zh ? 'MX 进料' : 'MX feed', 52, 273, 194, 90, '#F1F5F8');
    node('catalysis', zh ? '酸位点\n异构化' : 'Acid sites\nIsomerization', 306, 256, 270, 124, '#E8F2FA');
    node('separation', zh ? '选择性透过\nPX 移出' : 'Selective permeation\nPX removal', 306, 440, 304, 124, '#EAF5F0');
    text('reaction-flow', '→', 253, 290, 46, 50, 32, '#0072B2', true);
    text('permeation-flow', '↓', 419, 383, 50, 50, 32, '#0072B2', true);
    text('support-note', zh ? 'α-Al₂O₃ 支撑体承载 MFI 膜层' : 'MFI layer on an α-Al₂O₃ support', 52, 595, 565, 45, 23, '#526477');
    text('chart-heading', zh ? '示例 MX 转化率' : 'Example MX conversion', 687, 181, 550, 45, 29, '#0072B2', true);
    s.charts.add('bar', {
      name: 'native-conversion-chart',
      position: { left: 680, top: 246, width: 544, height: 345 },
      categories: demoData.categories,
      series: [{ name: zh ? '转化率 (%)' : 'Conversion (%)', values: demoData.values, fill: '#0072B2' }],
      hasLegend: false,
      barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 120 },
      dataLabels: { showValue: true, position: 'outEnd', textStyle: { fontSize: 21, fontFamily: 'Microsoft YaHei' } },
      xAxis: { textStyle: { fontSize: 20, fontFamily: 'Microsoft YaHei' } },
      yAxis: { minimumScale: 0, maximumScale: 12, majorUnit: 4, numberFormatCode: '0', textStyle: { fontSize: 17, fontFamily: 'Microsoft YaHei' }, majorGridlines: { fill: '#DFE6ED', width: 1 } },
    });
    text('units', zh ? '纵轴：转化率 (%)    横轴：示例条件 A / B / C' : 'Y: conversion (%)    X: example conditions A / B / C', 690, 596, 540, 57, 20, '#526477');
    text('concept-citation', zh ? '结构概念参考：Zhang et al., J. Membr. Sci. 389 (2012) 451–458。示意不按比例。' : 'Concept: Zhang et al., J. Membr. Sci. 389 (2012) 451–458. Schematic not to scale.', 52, 671, 1180, 28, 16, '#687B8D');
    s.speakerNotes.text = `Language: ${lang}. Synthetic data: A=5%, B=8%, C=11%. Values are an author-created fixture, not paper measurements. Concept reference: DOI 10.1016/j.memsci.2011.11.013. Native text, shapes and chart intended for editing. Nature/Science-inspired visual direction is not an official publisher template. No AI provider called. Shared data supports translation parity.`;
  }
}
