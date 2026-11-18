# 稳定主题真实论文流程

已完成一次用户批准大纲驱动的 12 页中文真实论文测试。本次没有调用付费服务，没有安装新依赖，也没有修改冻结主题。

任务仍使用 `scripts/make_ppt.py`，选择 `theme: research-studio-unified`、`theme_version: 1.0.0`，并明确 `outline_approved: true`。只有用户明确确认当前大纲后才能设置该字段。任务需有原 PDF 路径与 SHA-256、`renderer_outline`（相对项目根目录）、页数、语言与证据定位。

渲染内容文件使用固定版本 presentation-skill 的大纲结构，另加 `paper_layout`、`studio_style_version: paper-v1`、`page_index`、`total_pages`、图像资产与证据说明。布局在 `layouts/stable-paper-layouts.cjs`，继承已验收的页面规范；第九页直接复用冻结图表渲染器。内容源和私有数据在 `qa/private/`，不发布公开仓库。

```powershell
.venv312/Scripts/python.exe scripts/check_stable_theme.py
.venv312/Scripts/python.exe scripts/make_ppt.py qa/private/my-paper/task.yaml --build --output output/my-paper-v1.pptx
```

输出必须是尚不存在的项目内 PPTX。构建前核对主题完整性、原 PDF 哈希、页数、资产完整性；拒绝未经批准的大纲，拒绝覆盖旧文件。不会回退到旧六布局原型。依赖沿用既有隔离环境与版本锁定文件。新电脑需先按现有安装说明部署上游完整 bundle 和隔离依赖。

原生图表必须来自可准确读取的原文数值；曲线原图不凭肉眼采样伪造。原图保留坐标、图例、单位、比例尺。保持实验对象、条件、分母和解释边界。

生成后运行内容与编辑回读检查，逐页渲染检查。`scripts/validate/office_open_export.ps1` 可在有 PowerPoint 的 Windows 上只读打开原稿、导出逐页 PNG、另存一次性副本后重新打开；不关闭用户已有演示文稿。`full_paper_editability.py` 是本次 MFI 个案的精确数值回归，不可直接用于其他论文假装验收。

已验证：该 MFI 个案的 12 页源文件构建、PowerPoint 16.0 实际打开/另存/再打开、逐页 PNG、原生文本/形状/图表/表格编辑回读、共同页面规范一致性。尚未证明：任意论文无人审稿的一键生成、英文/双语全流程、PaperBanana 在线生成、每个原图内部可编辑。

上游 finalize 仍因当前缺少 soffice 返回失败。报告保留原始结果，并将 Office 实机验证单列；构建入口的成功返回表示本地内容与几何检查通过，不冒充全部上游检查成功。
