"""Exercise the adapted upstream composer with a local bilingual layout fixture."""
import json
from pathlib import Path
import subprocess
import sys
from pptx import Presentation

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / '.compat-upstream/academic-73545d2f2227b03a185c8834709c7808ada5b0cb/fig-pptx/scripts'
private = ROOT / 'qa/private/upstream-smoke'
private.mkdir(parents=True, exist_ok=True)
layout = {'ref_width': 1280, 'ref_height': 720, 'units': 'fraction', 'slides': []}
for title in ['中文离线合成测试', 'Offline composition test']:
    layout['slides'].append({'texts': [{'text': title, 'x': 0.06, 'y': 0.08, 'w': 0.85, 'h': 0.15,
        'size_px': 38, 'font': 'Microsoft YaHei', 'color': '#172B4D', 'bold': True}]})
input_path = private / 'layout.json'
input_path.write_text(json.dumps(layout, ensure_ascii=False), encoding='utf-8')
out = private / 'upstream-composed.pptx'
process = subprocess.run([sys.executable, str(SCRIPTS / 'compose_pptx.py'), str(input_path), str(out),
    '--preview-dir', str(private / 'preview')], capture_output=True, text=True, encoding='utf-8')
assert process.returncode == 0, process.stdout + process.stderr
p = Presentation(out)
assert len(p.slides) == 2
assert p.slides[0].shapes[0].text == '中文离线合成测试'
assert p.slides[1].shapes[0].text == 'Offline composition test'
print(json.dumps({'status': 'pass', 'upstream_composer_executed': True, 'slides': 2, 'bilingual_text_verified': True, 'ai_layers_generated': False}))
