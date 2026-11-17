# Offline acceptance / 无 API 离线验收

## Decision / 结论

PASS for isolated environment, adapted Academic Figure Skills validation/composition, bilingual native PPTX generation and file-level editing roundtrips. PaperBanana live inference remains UNVERIFIED, with no provider dependencies installed and no paid calls made.

Deliverable: output/offline-bilingual-local.pptx. Two matching pages, Chinese and English. White background, restrained blue hierarchy, ample whitespace and explicitly synthetic data. Nature/Science-inspired, not an official publisher template.

## Environment isolation / 环境隔离

- Python 3.12.12 under .runtime/python, virtualenv .venv312; include-system-site-packages=false and user site disabled.
- System Python still reports 3.14.7. No global package installation, registry registration or persistent PATH change performed.
- uv 0.9.5 downloaded locally, archive SHA-256: 515dc53d7553f1357d0abc1f70acd921fbb9e30230b1d9a08737236daa6ee920.
- requirements-win-py312.lock generated before installation, then installed with --require-hashes and --only-binary :all:. Seven packages: fonttools 4.58.5, lxml 6.1.3, numpy 2.2.6, pillow 11.3.0, python-pptx 1.0.2, typing-extensions 4.16.0, xlsxwriter 3.3.1. These are the minimal offline test dependencies, not the full PaperBanana runtime.

## Academic Figure Skills adapter / Windows 适配

The pinned originals stay unchanged in the sibling .audit directory. compat/prepare_academic.py verifies their locked Git object IDs, then creates an ignored disposable copy under .compat-upstream. Original LICENSE is retained in that copy. academic-adapter-changes.json records relative paths and pre/post SHA-256 hashes, including the added Windows font adapter.

- Native Windows font discovery via existing TTF/OTF/TTC files replaces fc-list/fc-match. Microsoft YaHei is present and selected for technical bilingual text. No fonts installed.
- Automatic comic font installation is disabled with an explicit error.
- Example specs and test fixtures use actual Windows absolute paths. Production workspace containment and symlink guards are unchanged. One diagnostic-path test normalizes separators.
- Adapted pack validation: PASS, zero errors/warnings.
- Adapted upstream suite: 75 tests, 72 passed, 3 skipped because symlink creation privileges are unavailable. The previously skipped font/composition test now passes.
- Actual upstream compose_pptx.py CLI executed using a local two-language text layout fixture, created a two-slide PPTX and PNG previews; readback verified both languages. No model-generated image layers or scientific interpretation was tested by this fixture.

## PaperBanana offline scope

In Python 3.12.12, figure-size tests 7/7 and generation-options tests 9/9 pass. No full pipeline run claimed. Dataset/provider/UI dependencies were deliberately not installed because no API or inference is needed for this acceptance test.

## Editable PPTX evidence / 可编辑性

Final artifact uses the bundled first-party Artifact Tool builder, separately from the upstream composer smoke test. python-pptx is used for upstream execution and read/edit/reopen verification, not for authoring the final presentation.

- Two slides, 12 non-empty native text objects, three native diagram blocks and one native chart per slide.
- Diagram blocks and arrows remain native slide objects.
- Two embedded XLSX workbooks contain the literal synthetic chart data A=5%, B=8%, C=11%. These are new data snapshots, not original research workbooks.
- Both language versions use the same values and category order.
- Package structure, slide geometry, declared font family, chart cache/workbook references and first-party re-import checks passed.
- A private test copy changed the Chinese title, moved a named native shape and replaced chart values with 6/9/12. Reopen confirmed all edits and confirmed the English chart stayed 5/8/11. Final deliverable was not modified by that test.
- Final bytes rendered after workbook packaging; both previews visually inspected, with no observed clipping or overlap.
- File SHA-256 and machine-readable results: offline-editability.json.

PowerPoint desktop application opening/rendering was NOT tested. File-level editing and structural validation do not prove behavior in every presentation application. Symlink protection tests remain partially unverified due to host permissions.

## Reproduce / 复现

From repository root in Windows PowerShell:

```powershell
# Downloads only fixed public tools/sources; installs solely into project .venv312.
./env/bootstrap-offline.ps1 -FetchUpstreams
$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONPATH = (Join-Path $PWD '.compat-upstream/academic-73545d2f2227b03a185c8834709c7808ada5b0cb/fig-pptx/scripts')
./.venv312/Scripts/python.exe .compat-upstream/academic-73545d2f2227b03a185c8834709c7808ada5b0cb/scripts/validate_skill_pack.py
./.venv312/Scripts/python.exe -m unittest discover -s .compat-upstream/academic-73545d2f2227b03a185c8834709c7808ada5b0cb/tests -v
./.venv312/Scripts/python.exe tests/upstream_composer_smoke.py
```

For the final builder, ask Codex to load the bundled workspace dependencies and set process-only RUNTIME_NODE_MODULES, RUNTIME_PYTHON and PRESENTATIONS_SKILL_DIR to the returned packages/Python and installed presentations skill directory. No npm installation is required. Then:

```powershell
node slides/build-offline-local.mjs output/rebuilt-demo.pptx
./.venv312/Scripts/python.exe tests/test_editable_pptx.py output/rebuilt-demo.pptx
```

Choose a new output name on every rebuild: the finalizer intentionally refuses overwrites. Runtime libraries are supplied by Codex, not portable npm dependencies. This is a reproducible Codex-local path; an independent non-Codex machine requires another reviewed authoring runtime. The Python 3.12 offline upstream tests do not depend on that Node runtime.

## API boundary

ChatGPT Plus does not include separately billed OpenAI API usage. A Plus subscription is not an OpenRouter/Google API credential. No credentials were requested, stored or used. Official source: https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus . Some participating tools may support separately approved ChatGPT sign-in allowance sharing; that does not establish support in this locked PaperBanana version and was not configured here.
