"""Content-first stable-theme build, keeping upstream QA failures visible."""
import hashlib,json,os,subprocess,sys
from pathlib import Path
from check_stable_theme import verify

def build(task_path,output):
    root=Path(__file__).resolve().parents[1]
    task_path=Path(task_path).resolve(); out=Path(output).resolve()
    task=json.loads(task_path.read_text(encoding='utf-8-sig'))
    if task.get('outline_approved') is not True: raise ValueError('Outline must be approved')
    if not out.is_relative_to(root) or out.suffix.lower()!='.pptx' or out.exists(): raise ValueError('Output must be a new project-local PPTX')
    verify()
    pdf=Path(task['source_pdf'])
    if hashlib.sha256(pdf.read_bytes()).hexdigest()!=task['source_sha256']: raise ValueError('Source PDF changed')
    outline=(root/task['renderer_outline']).resolve()
    data=json.loads(outline.read_text(encoding='utf-8'))
    if len(data['slides'])!=task['slide_count']: raise ValueError('Slide count differs from approved task')
    assets=[]
    for page in data['slides']:
        if page.get('studio_style_version')!='paper-v1': raise ValueError('Unknown style adapter')
        for f in page.get('figures',[]):
            path=(outline.parent/f['path']).resolve()
            if not path.is_file(): raise ValueError('Missing evidence asset: '+str(path))
            assets.append({'slide':page['page_index'],'path':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    qa=root/'qa/private'/out.stem
    if qa.exists(): raise ValueError('QA output exists; choose a new version')
    qa.mkdir(parents=True)
    (qa/'assets.json').write_text(json.dumps(assets,indent=2),encoding='utf-8')
    py=root/'.venv-presentation/Scripts/python.exe'
    finalizer=root/'.runtime/presentation-skill/scripts/finalize_quick_deck.py'
    dispatcher=finalizer.parent/'build_deck_pptxgenjs.js'
    dispatch_text=dispatcher.read_text(encoding='utf-8')
    marker='  // Stable paper content adapter v1.'
    if marker not in dispatch_text:
        target='function renderSlide(pptx, pSlide, slide, preset) {'
        if target not in dispatch_text: raise ValueError('Upstream dispatcher changed; review adapter')
        hook='\n'+marker+'\n  if (slide.studio_style_version === "paper-v1") { require('+json.dumps(str(root/'layouts/stable-paper-layouts.cjs'))+').render(pptx,pSlide,slide); return; }\n'
        dispatcher.write_text(dispatch_text.replace(target,target+hook,1),encoding='utf-8')
    env={**os.environ,'PYTHONUTF8':'1'}
    run=subprocess.run([str(py),str(finalizer),'--outline',str(outline),'--output',str(out),'--qa-dir',str(qa),'--style-preset','lab-report'],capture_output=True,env=env)
    (qa/'upstream-finalize.log').write_bytes(run.stdout+run.stderr)
    if not out.is_file(): raise RuntimeError('Upstream build failed; see '+str(qa))
    report=json.loads((qa/'qa_report.json').read_text(encoding='utf-8'))
    keys=['overflow_count','overlap_count','geometry_error_count','geometry_warning_count','design_error_count','design_warning_count','accessibility_error_count']
    counts={k:report.get(k,0) for k in keys}
    receipt={'output':str(out),'qa':str(qa),'upstream_returncode':run.returncode,'upstream_passed':False,'counts':counts,'paid_api':False,'approved':True,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
    (qa/'build-receipt.json').write_text(json.dumps(receipt,indent=2),encoding='utf-8')
    print(json.dumps(receipt,ensure_ascii=False))
    return 1 if any(counts.values()) else 0

if __name__=='__main__': raise SystemExit(build(sys.argv[1],sys.argv[2]))
