# Scientific PPT Workbench / 科研 PPT 工作台

中英文科研叙事、可追溯证据与可编辑 PPTX。Bilingual scientific storytelling, traceable evidence and editable PowerPoint.

状态 / Status: 独立 Python 3.12 环境与离线双语 PPTX 测试已通过。Academic Figure Skills 在隔离副本中完成 Windows 适配与本地合成测试。PaperBanana 的真实 API 生图尚未验证。

Offline bilingual authoring and editability tests pass. No paid model calls. See [latest acceptance report](qa/offline-validation.md), [test deck](output/offline-bilingual-local.pptx), [Chinese preview](output/offline-bilingual-zh.png) and [English preview](output/offline-bilingual-en.png).

Start/reproduce: [isolated setup](env/bootstrap-offline.ps1), [hashed dependency lock](env/requirements-win-py312.lock), [local builder](slides/build-offline-local.mjs). Older validation documents retain historical findings; the latest acceptance report describes the adapted current state.

## Structure / 目录
- content/: briefs, outlines, bilingual terminology / 简报、大纲、术语
- figures/: original figure sources and provenance / 图源与溯源
- slides/: editable PPTX and source / 可编辑演示文稿及源文件
- qa/: claim evidence tables and review reports / 证据表及审核
- docs/: design, QA, deployment and collaboration / 规范与部署

Start with [design](docs/design.md), [QA](docs/qa.md), [workflow](docs/workflow.md), [deployment](docs/deployment.md).


## Research PPT Studio 工作入口

新增 [中文使用教程](docs/user-guide-zh.md)、[任务交接文件](task.yaml) 与 [本地任务检查](scripts/make_ppt.py)。A/C为候选主题，B不再用于新稿。当前仍需确认大纲与逐页审稿，不宣称一键论文到PPT已实现。私人参考稿与论文图像仅保留在本地。
