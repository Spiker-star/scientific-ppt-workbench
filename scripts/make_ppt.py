import json
import sys
from pathlib import Path

TYPES={'literature-review','weekly-meeting','conference','thesis-defense','grant-proposal'}
LAYOUTS={'research-background','research-content','technical-roadmap','mechanism-analysis','experimental-results','research-summary'}
def validate(t):
    errors=[]
    if t.get('schema')!='research-ppt-studio/task@1': errors.append('schema不支持')
    if t.get('report_type') not in TYPES: errors.append('汇报类型无效')
    if t.get('language') not in {'zh-CN','en-US','bilingual'}: errors.append('语言无效')
    if t.get('palette') not in {'A','C'}: errors.append('仅允许候选A/C，B已淘汰')
    outline=t.get('outline',[])
    if not isinstance(outline,list): return errors+['outline必须是列表']
    if t.get('slide_count')!=len(outline) or not outline: errors.append('页数与大纲不一致')
    for i,page in enumerate(outline):
        if not isinstance(page,dict): errors.append(f'第{i+1}页格式无效');continue
        if page.get('layout') not in LAYOUTS or not page.get('title'): errors.append(f'第{i+1}页缺标题或布局无效')
        if t.get('data_kind')!='synthetic' and not page.get('evidence'): errors.append(f'第{i+1}页缺少证据定位')
    if t.get('allow_paid_api') is not False: errors.append('此离线入口不支持付费API')
    return errors
if __name__=='__main__':
    task=json.loads(Path(sys.argv[1] if len(sys.argv)>1 else 'task.yaml').read_text(encoding='utf-8-sig'))
    errors=validate(task)
    print(json.dumps({'valid':not errors,'errors':errors,'outline_approved':task.get('outline_approved') is True,'next_step':'请确认逐页大纲' if not task.get('outline_approved') else '交给Codex按证据构建并逐页验收','automatic_paper_to_ppt':False},ensure_ascii=False,indent=2))
    raise SystemExit(bool(errors))
