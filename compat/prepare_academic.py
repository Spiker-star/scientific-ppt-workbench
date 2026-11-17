"""Apply narrow Windows adapters to a disposable copy, never the pinned source."""
import ast
import hashlib
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
PIN = '73545d2f2227b03a185c8834709c7808ada5b0cb'
SOURCE = ROOT.parent / '.audit' / ('academic-figure-skills-' + PIN)
TARGET = ROOT / '.compat-upstream' / ('academic-' + PIN)
# Verify the input before applying any adapter, preserving the upstream trust boundary.
lock = json.loads((ROOT / 'skills.lock.json').read_text(encoding='utf-8-sig'))
item = next(s for s in lock['skills'] if s['repo'] == 'Azhi-ss/academic-figure-skills')
assert item['commit'] == PIN
for entry in item['manifest']:
    raw = (SOURCE / entry['path']).read_bytes()
    blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
    if blob != entry['git_blob_sha']:
        raise RuntimeError('Pinned source mismatch: ' + entry['path'])
shutil.copytree(SOURCE, TARGET, dirs_exist_ok=True, ignore=shutil.ignore_patterns('__pycache__'))
changes = []

def write(path, text):
    old = path.read_bytes()
    path.write_text(text, encoding='utf-8')
    changes.append({'path': str(path.relative_to(TARGET)).replace('\\', '/'),
                    'before_sha256': hashlib.sha256(old).hexdigest(),
                    'after_sha256': hashlib.sha256(path.read_bytes()).hexdigest()})

def replace_functions(path, replacements):
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines(keepends=True)
    nodes = [n for n in ast.parse(text).body if isinstance(n, ast.FunctionDef) and n.name in replacements]
    for node in sorted(nodes, key=lambda n: n.lineno, reverse=True):
        lines[node.lineno - 1:node.end_lineno] = [replacements[node.name] + '\n']
    write(path, ''.join(lines))

scripts = TARGET / 'fig-pptx/scripts'
shutil.copy2(ROOT / 'compat/windows_fonts.py', scripts / 'workbench_windows_fonts.py')
changes.append({'path': 'fig-pptx/scripts/workbench_windows_fonts.py', 'before_sha256': None,
                'after_sha256': hashlib.sha256((scripts / 'workbench_windows_fonts.py').read_bytes()).hexdigest()})
replace_functions(scripts / 'compose_pptx.py', {
    '_installed_families': "def _installed_families():\n    from workbench_windows_fonts import families\n    return {f.lower() for f in families()}",
    '_match_font': "def _match_font(family):\n    from workbench_windows_fonts import match\n    return match(family)",
})
replace_functions(scripts / 'pick_font.py', {
    'installed_families': "def installed_families():\n    from workbench_windows_fonts import families\n    return families()",
    'install_comic': "def install_comic():\n    raise SystemExit('Comic Neue missing. Automatic font installation is disabled.')",
})
# Keep the same writing-system class; validate installed families rather than pretending Linux fonts exist.
pick = scripts / 'pick_font.py'
write(pick, pick.read_text(encoding='utf-8').replace('"technical": ["Liberation Sans",', '"technical": ["Microsoft YaHei", "Arial", "Liberation Sans",'))

# Adapt test fixtures to host paths. Production path guards remain untouched.
test = TARGET / 'tests/test_validation.py'
text = test.read_text(encoding='utf-8')
for old in ['/tmp/repository', '/tmp/figure_1.png', '/tmp/reference.png', '/tmp/workspace', '/tmp/outside/figure.png', '/tmp']:
    text = text.replace(json.dumps(old), 'str(Path(tempfile.gettempdir()) / ' + json.dumps('afs-fixture' + old[4:]) + ')')
text = text.replace('rogue[0].path.endswith("rogue-skill/SKILL.md")', 'rogue[0].path.replace(chr(92), "/").endswith("rogue-skill/SKILL.md")')
write(test, text)
test = TARGET / 'tests/test_figure_spec_hardening.py'
write(test, test.read_text(encoding='utf-8').replace('"/invalid/\\x00/reference.png"', 'str(workspace / "invalid\\x00reference.png")'))

for spec in (TARGET / 'docs/prompts').glob('*.spec.json'):
    data = json.loads(spec.read_text(encoding='utf-8'))
    data['workspace_root'] = str(ROOT)
    data['output_path'] = str(ROOT / 'figures' / (spec.stem + '.png'))
    write(spec, json.dumps(data, ensure_ascii=False, indent=2))

(ROOT / 'qa/academic-adapter-changes.json').write_text(json.dumps(changes, indent=2), encoding='utf-8')
print(TARGET)
