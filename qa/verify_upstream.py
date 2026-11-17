"""Verify downloaded pinned sources against Git object IDs; never install/run them."""
import ast
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
lock = json.loads((ROOT / 'skills.lock.json').read_text(encoding='utf-8-sig'))
results = []
for item in lock['skills']:
    source = ROOT.parent / '.audit' / (item['repo'].split('/')[-1] + '-' + item['commit'])
    missing, mismatched, syntax = [], [], []
    files = []
    for entry in item['manifest']:
        path = source / entry['path']
        if not path.is_file():
            missing.append(entry['path'])
            continue
        data = path.read_bytes()
        git_sha = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        if git_sha != entry['git_blob_sha']:
            mismatched.append(entry['path'])
        files.append({'path': entry['path'], 'sha256': hashlib.sha256(data).hexdigest()})
        if path.suffix == '.py':
            try:
                ast.parse(data, filename=entry['path'])
            except SyntaxError as exc:
                syntax.append({'path': entry['path'], 'error': str(exc)})
    results.append({'repo': item['repo'], 'commit': item['commit'], 'missing': missing,
                    'mismatched': mismatched, 'syntax_errors': syntax, 'files': files})
output = ROOT / 'qa' / 'upstream-file-verification.json'
output.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps([{k: v for k, v in r.items() if k != 'files'} | {'verified_files': len(r['files'])} for r in results]))
raise SystemExit(any(r['missing'] or r['mismatched'] or r['syntax_errors'] for r in results))
