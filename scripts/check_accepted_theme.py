import hashlib,json
from pathlib import Path
r=Path(__file__).resolve().parents[1]
d=r/'themes/research-framework-fusion/1.0.0'
for name,expected in json.loads((d/'manifest.json').read_text()).items():
    assert hashlib.sha256((d/name).read_bytes()).hexdigest()==expected, 'Accepted theme changed: '+name
print('accepted theme hashes verified')
