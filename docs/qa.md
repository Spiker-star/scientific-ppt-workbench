# Scientific QA / 科研内容审核

每个 claim 记录：slide ID、原句、中英文、来源 DOI/URL、页码/图号、原始数据路径、分析方法、审核人和 pass/fail/unverified。Every substantive claim must map to evidence.

Check sample size, denominator, units, statistical test assumptions, confidence intervals, multiple comparisons, missing data and correlation versus causation. 区分原文事实、作者推断、本项目推断；禁止虚构数值、引用或显著性。AI illustrations cannot serve as experimental evidence.

逐图核对节点、箭头、符号、图例与数据；统计图从数据生成，不用生图模型重绘数据点。检查双语术语、结论强度和限定条件一致。

Release gate: no unresolved failed or unverified scientific claims; visual review of every slide; editability spot-check of every object type; document reviewer/date/artifact hash. 未通过则保留 draft。自动结构检查不等于科学正确性或视觉审核。
