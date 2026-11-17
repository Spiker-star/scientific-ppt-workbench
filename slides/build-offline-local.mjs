import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { populate } from './build-offline-demo.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = process.env.PRESENTATIONS_SKILL_DIR;
const python = process.env.RUNTIME_PYTHON;
if (!skill || !python || !process.env.RUNTIME_NODE_MODULES) throw new Error('Set PRESENTATIONS_SKILL_DIR, RUNTIME_PYTHON and RUNTIME_NODE_MODULES from Codex bundled dependencies.');
const helpers = await import(pathToFileURL(path.join(skill, 'container_tools/runtime_helpers.mjs')).href);
const { Presentation, PresentationFile, FileBlob } = await helpers.importRuntimeModule('@oai/artifact-tool');
const { finalizePresentation } = await import(pathToFileURL(path.join(skill, 'container_tools/artifact_tool_utils.mjs')).href);
const privateDir = path.join(root, 'qa/private/local-build');
const output = path.join(root, 'output');
await fs.mkdir(privateDir, { recursive: true });
await fs.mkdir(output, { recursive: true });
const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
populate(presentation);
const candidate = path.join(privateDir, 'candidate.pptx');
await (await PresentationFile.exportPptx(presentation)).save(candidate);
const finalPath = path.resolve(process.argv[2] || path.join(output, 'offline-bilingual-local.pptx'));
const result = await finalizePresentation({
  workspaceDir: root, candidatePath: candidate, finalPath,
  pythonExecutable: python,
  integrityValidatorPath: path.join(skill, 'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(skill, 'container_tools/inspect_presentation_layout_geometry.py'),
  explicitTotalSlideCount: 2, requiredNativeChartOwnerSlides: [1, 2],
  materializeLiteralChartWorkbooks: true,
  fontPolicy: { basis: 'design', families: ['Microsoft YaHei'] },
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-heading-fit'],
  verifyArtifactToolImport: true,
  receiptPath: path.join(privateDir, 'finalization.json'),
});
// Render the finalized bytes, including embedded workbook references.
const finalized = await PresentationFile.importPptx(await FileBlob.load(finalPath));
for (const [i, slide] of finalized.slides.items.entries()) {
  const b = await finalized.export({ slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(output, `offline-bilingual-${i === 0 ? 'zh' : 'en'}.png`), new Uint8Array(await b.arrayBuffer()));
}
console.log(JSON.stringify({ finalPath: result.finalPath, sha256: result.finalSha256, slideCount: 2, chartCount: 2 }));
