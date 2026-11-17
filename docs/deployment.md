# Deployment / 部署与上游审计

2026-11-17: connected account Spiker-star; approved target scientific-ppt-workbench, public. Git 2.56.0, Python 3.14.7, Node 24.22.3. gh absent; Git author unset; GH_TOKEN/GITHUB_TOKEN absent. Connector has no create-repository operation. Public API rate-limited; direct clones failed. No dependency installed or upstream code executed.

## Verified identity / 上游身份
- https://github.com/dwzhu-pku/PaperBanana : connector metadata Apache-2.0; skill/ is the advertised agent skill. README includes patent/commercial-use statements; review those alongside the license before adoption.
- https://github.com/Azhi-ss/academic-figure-skills : connector metadata MIT; current README v4.3.0 names fig-analyze, fig-draw, fig-pptx. fig-pptx documents python-pptx, pillow, numpy. This is distinct from academic-pptx-skill, which is excluded entirely.

Metadata and README are not a full license/bundle audit. Commit pins, license text, recursive references and file hashes remain pending; do not treat main or a version badge as a lock. No upstream source is vendored here.

## Reproducible adoption gate / 可复现接入
1. Fetch each full repository in an isolated audit directory. Record `git rev-parse HEAD` as a 40-character commit in skills.lock.json; checkout that commit detached.
2. Read LICENSE/NOTICE and any subdirectory licenses. Inventory every file in the selected skill directories, including scripts, references, assets and relative references outside each directory. Record SHA-256 hashes. Reject missing files or incompatible restrictions.
3. Review scripts and dependency manifests without running them. Select a supported Python version in a separate virtual environment; Python 3.14 compatibility is unverified. Pin transitive dependencies and hashes before installation; keep credentials outside the repository.
4. Install complete reviewed skill folders, not just SKILL.md. Codex bundled installer syntax (replace placeholders only after audit):

```powershell
python C:/Users/HP/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo dwzhu-pku/PaperBanana --ref <COMMIT_SHA> --path skill --name paperbanana
python C:/Users/HP/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo Azhi-ss/academic-figure-skills --ref <COMMIT_SHA> --path fig-analyze fig-draw fig-pptx
```

These commands are a deployment template, not executed or certified complete. Verify external references before using installer directory selection. Installed skills become available on a subsequent turn. Upstream advertises `npx skills add Azhi-ss/academic-figure-skills -g --all`; it follows moving upstream content and may download tooling, so it is not the locked deployment path.

## Remote bootstrap / 远程初始化
Create an empty public repository under Spiker-star named scientific-ppt-workbench using an authenticated GitHub browser session (do not initialize README remotely). Configure your actual Git author locally; then:

```powershell
git add .
git commit -m 'Initialize bilingual scientific PPT workbench'
git remote add origin https://github.com/Spiker-star/scientific-ppt-workbench.git
git push -u origin main
```

Run inside this repository only. Authenticate through the normal credential manager. Verify the remote exists and visibility is public before claiming deployment complete. Enable review rules after push. Pending: remote creation, push, full bundle audit, commit pins and installation verification.

## 最新状态 / Latest status
Remote confirmed public, with connector push permission. Commits and complete repository Git blob manifests are pinned in skills.lock.json. Full dependency/script review and installation remain pending. Blob hashes are Git object IDs, not SHA-256 hashes.

PaperBanana SKILL.md advertises MIT-0, whereas repository metadata reports Apache-2.0. Resolve scope before redistribution. The skill executes skill/run.py from the repository root and depends on root requirements.txt and other modules. The directory-only install command above is insufficient as a standalone runtime deployment: retain the full pinned repository. Do not execute it until dependency review is complete.

Academic Figure Skills root LICENSE text verified MIT. Preserve complete fig-analyze, fig-draw and fig-pptx directories with scripts/references/assets. fig-pptx can attempt automatic font installation: this project forbids automatic package/font installation without explicit authorization. Text is editable, but background/framework/icons may be raster images. Strict object editability requires native PowerPoint reconstruction.

No dependencies installed, no upstream scripts executed, no generation smoke test completed. Remote documentation initialization does not imply generator readiness.
