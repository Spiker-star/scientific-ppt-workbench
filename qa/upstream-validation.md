# Upstream validation / 上游实测报告

Date: 2026-11-17. Host: Windows, Python 3.14.7. No packages/fonts installed, no provider calls made. Downloaded complete archives from codeload.github.com at the locked commits into the sibling .audit directory. Source archives are not redistributed in this public repository.

## Results / 结果

| Check | PaperBanana | Academic Figure Skills |
|---|---|---|
| Fixed commit | 9ceea039be86dd40294361856a4b7bf097d9e2b7 | 73545d2f2227b03a185c8834709c7808ada5b0cb |
| Full pinned file verification | 99/99 matching Git blob IDs | 112/112 matching Git blob IDs |
| Python AST syntax | No syntax errors | No syntax errors |
| Root license text | Apache-2.0 | MIT |
| CLI / selected tests | --help passes; figure-size 7/7 and generation-options 9/9 pass | 75 tests: 66 passed, 5 failed, 4 skipped |
| Full pack validator | Not run / not applicable | Fails: 14 absolute-path diagnostics in 7 shipped specs |
| Actual image/PPTX pipeline | Not run | Not run |

File SHA-256 inventory: upstream-file-verification.json. Verification only covers files listed in the lock, not third-party dependencies, dataset rights or scientific correctness. Syntax/CLI checks do not prove inference works.

## Windows findings / 兼容性

Academic failures: test_invalid_filesystem_string_returns_diagnostic, test_output_outside_workspace_fails, test_recent_conversation_reference_is_valid, test_valid_spec_passes, test_unregistered_top_level_skill_is_rejected. Diagnostics show POSIX absolute paths rejected under Windows; one assertion expects forward slashes. These are platform/fixture failures, not evidence that all semantic validation is broken. Three symlink tests skipped due to local privilege restrictions; the font-dependent PPTX output test skipped because fc-list found no fonts.

Running fig-pptx/scripts/pick_font.py --style technical stops because fc-list is unavailable. compose_pptx.py also uses fc-list/fc-match. Python-pptx is absent. Pillow and NumPy exist locally. Therefore the native Windows PPTX path is not validated or ready as shipped. Recommend a separately reviewed Linux/WSL environment with fontconfig, or a documented Windows font adapter. Do not silently bypass the font gate.

PaperBanana requirements.txt targets Python 3.12; current 3.14 is not that tested target. Present locally: Pillow, NumPy, Matplotlib. Missing top-level runtime dependencies include google-genai, openai, anthropic, httpx, gradio, streamlit, aiofiles, tqdm, json-repair, pyyaml, huggingface_hub, pyarrow. Requirements are ranges, not a reproducible transitive dependency lock. A successful --help only exercises imports deferred from runtime.

## Adoption constraints / 接入约束

PaperBanana root LICENSE and run.py header say Apache-2.0; skill/SKILL.md says MIT-0. Treat that declaration as inconsistent metadata, not permission to relicense root modules. README additionally contains patent/commercial-use statements; license-scope review remains necessary before redistribution/commercial adoption.

PaperBanana skill/run.py relies on root utils, agents, configuration and potentially retrieval datasets. Keep the full reviewed repository. --retrieval-setting none avoids the retrieval path only if the locked implementation confirms that branch; it does not establish that every pipeline mode is dataset-free.

utils/plot_execution.py executes model-produced Python through exec(). No plot-generated code was executed here. A separate worker process alone is not a security boundary. Keep initial real-provider trial on task=diagram in an isolated environment without unrelated files or credentials.

Academic fig-pptx/scripts/pick_font.py can invoke sudo apt-get install fonts-comic-neue in comic mode. That branch was not executed. This project requires explicit approval for package/font installation. The upstream fig-pptx produces editable text with raster layers; it does not promise all-native editable diagrams. academic-pptx-skill remains excluded.

## Reproduce / 复现

Run from each extracted pinned repository, with no provider credentials required:

```powershell
# PaperBanana
python skill/run.py --help
python -m unittest discover -s tests -p test_skill_run_figure_size.py -v
python -m unittest discover -s tests -p test_legacy_generation_options.py -v
# Academic Figure Skills
python scripts/validate_skill_pack.py
python -m unittest discover -s tests -v
python fig-pptx/scripts/pick_font.py --style technical
```

From the workbench, run `python qa/verify_upstream.py` to recheck the sibling .audit downloads against skills.lock.json. Source files were not patched to make the tests pass.

## Next acceptance gate / 下一步

1. Approve an isolated Python 3.12 environment and review/pin the resolved dependency graph before installation. Downloading or installing a Python runtime has not been authorized or performed here.
2. Choose the provider and a small cost limit. Neither OPENROUTER_API_KEY nor GOOGLE_API_KEY is configured in the current process. Configure secrets locally; never send or commit them. Account subscription does not establish access to these provider APIs.
3. Use a short paraphrase of the MFI mechanism (not the whole PDF), one candidate, zero critic rounds and task=diagram for an initial real-provider test. Read the selected provider's current pricing before approval; no price has been estimated here.
4. Inspect output semantics against the paper. For Academic Figure Skills, first repair/document the Windows/Linux environment choice, then separately test rendering, audit and PPTX composition.

Current decision: source completeness PASS; partial offline checks PASS; Windows readiness FAIL/PARTIAL; real-provider generation UNVERIFIED. Do not label either upstream pipeline fully deployed.
