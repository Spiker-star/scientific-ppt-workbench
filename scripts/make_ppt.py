import json
import sys
from pathlib import Path

TYPES={'literature-review','weekly-meeting','conference','thesis-defense','grant-proposal'}
LAYOUTS={'research-background','research-content','technical-roadmap','mechanism-analysis','experimental-results','research-summary'}
def validate(t):
    errors=[]
    if t.get('theme')=='research-studio-unified':
        if t.get('theme_version')!='1.0.0': errors.append('稳定主题版本必须显式锁定为1.0.0')
        try:
            from check_stable_theme import verify
            verify()
        except (ValueError, OSError, KeyError) as exc:
            errors.append('稳定主题完整性检查失败: '+str(exc))
    if t.get('schema')!='research-ppt-studio/task@1': errors.append('schema不支持')
    if t.get('report_type') not in TYPES: errors.append('汇报类型无效')
    if t.get('language') not in {'zh-CN','en-US','bilingual'}: errors.append('语言无效')
    if t.get('palette') not in {'A','C'}: errors.append('正式制作仅支持已验收A/C；B仅作历史版本')
    outline=t.get('outline',[])
    routes={'background':'research-background','content':'research-content','roadmap':'technical-roadmap','mechanism':'mechanism-analysis','results':'experimental-results','summary':'research-summary'}
    if isinstance(outline,list):
        for page in outline:
            if isinstance(page,dict) and not page.get('layout'): page['layout']=routes.get(page.get('page_type'))
    if not isinstance(outline,list): return errors+['outline必须是列表']
    if t.get('slide_count')!=len(outline) or not outline: errors.append('页数与大纲不一致')
    for i,page in enumerate(outline):
        if not isinstance(page,dict): errors.append(f'第{i+1}页格式无效');continue
        if page.get('layout') not in LAYOUTS or not page.get('title'): errors.append(f'第{i+1}页缺标题或布局无效')
        if t.get('data_kind')!='synthetic' and not page.get('evidence'): errors.append(f'第{i+1}页缺少证据定位')
    if t.get('allow_paid_api') is not False: errors.append('此离线入口不支持付费API')
    return errors
if __name__=='__main__':
    import argparse, subprocess
    parser=argparse.ArgumentParser()
    parser.add_argument('task',nargs='?',default='task.yaml')
    parser.add_argument('--build',action='store_true')
    parser.add_argument('--output')
    args=parser.parse_args()
    task_path=Path(args.task).resolve()
    task=json.loads(task_path.read_text(encoding='utf-8-sig'))
    errors=validate(task)
    if args.build and task.get('theme')=='research-studio-unified':
        if errors:
            print(json.dumps({'valid':False,'errors':errors},ensure_ascii=False)); raise SystemExit(1)
        if not args.output: parser.error('--build requires --output')
        from build_stable_paper import build
        raise SystemExit(build(task_path,args.output))
    if args.build:
        if task.get('outline_approved') is not True: errors.append('请先明确确认大纲')
        if task.get('theme')=='research-studio-unified': errors.append('稳定主题整篇论文构建适配待本次大纲确认后完成；禁止回退到旧六布局原型')
        if task.get('language')!='zh-CN': errors.append('当前六布局自动构建只验证了中文，英文/双语需Codex人工适配')
        for i,page in enumerate(task.get('outline',[])):
            if not isinstance(page,dict): continue
            need={'research-background':3,'research-content':3,'technical-roadmap':4,'mechanism-analysis':4,'experimental-results':2,'research-summary':3}.get(page.get('layout'),1)
            if not isinstance(page.get('blocks'),list) or len(page['blocks'])<need: errors.append(f'第{i+1}页至少需要{need}个内容块')
            for field in (['claim','takeaway','method'] if page.get('layout')=='technical-roadmap' else ['claim','takeaway']):
                if not isinstance(page.get(field),str) or not page[field].strip():errors.append(f'第{i+1}页缺少{field}')
            if page.get('layout')=='experimental-results':
                chart=page.get('chart',{})
                if not chart.get('unit') or len(chart.get('categories',[]))!=len(chart.get('values',[])) or not chart.get('values'):errors.append('图表缺单位或数据不完整')
    print(json.dumps({'valid':not errors,'errors':errors,'outline_approved':task.get('outline_approved') is True},ensure_ascii=False))
    if errors: raise SystemExit(1)
    if args.build:
        if not args.output: parser.error('--build requires --output')
        root=Path(__file__).resolve().parents[1]
        out=Path(args.output).resolve()
        if not out.is_relative_to(root) or out.suffix.lower()!='.pptx' or out.exists(): parser.error('输出必须为项目内尚不存在的pptx路径')
        raise SystemExit(subprocess.run(['node',str(root/'scripts/build-layout-demo.mjs'),str(out),str(task_path)]).returncode)
