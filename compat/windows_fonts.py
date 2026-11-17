"""Read Windows font files without fontconfig or installing fonts."""
from functools import lru_cache
from pathlib import Path
import os
from fontTools.ttLib import TTFont, TTCollection

@lru_cache(maxsize=1)
def font_map():
    roots = [Path(os.environ.get('WINDIR', 'C:/Windows')) / 'Fonts',
             Path(os.environ.get('LOCALAPPDATA', '')) / 'Microsoft/Windows/Fonts']
    result = {}
    for root in roots:
        if not root.is_dir():
            continue
        for path in sorted(root.iterdir()):
            if path.suffix.lower() not in {'.ttf', '.otf', '.ttc'}:
                continue
            try:
                collection = TTCollection(path, lazy=True) if path.suffix.lower() == '.ttc' else None
                fonts = collection.fonts if collection else [TTFont(path, lazy=True)]
                for font in fonts:
                    for name in font['name'].names:
                        if name.nameID in {1, 16}:
                            family = name.toUnicode().strip()
                            if family:
                                result.setdefault(family.lower(), (family, str(path)))
                if collection:
                    collection.close()
                else:
                    fonts[0].close()
            except Exception:
                continue
    return result

def families():
    return [value[0] for value in font_map().values()]

def match(family):
    value = font_map().get((family or '').lower())
    return value[1] if value else None
