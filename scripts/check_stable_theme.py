"""Verify immutable studio theme snapshots without third-party dependencies."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def verify(directory=None):
    directory = Path(directory) if directory else ROOT / 'themes/research-studio-unified/1.0.0'
    manifest = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
    for name, expected in manifest['sha256'].items():
        file = (directory / name).resolve()
        if not file.is_relative_to(directory.resolve()):
            raise ValueError('Manifest path escapes theme directory')
        if hashlib.sha256(file.read_bytes()).hexdigest() != expected:
            raise ValueError('Frozen theme changed: ' + name)
    return manifest

if __name__ == '__main__':
    print(json.dumps({'valid':True,'theme':verify()['theme']},ensure_ascii=False))
