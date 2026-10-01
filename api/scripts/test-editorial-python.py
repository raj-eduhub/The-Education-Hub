"""Execute the newly authored Python answers against concrete expected outputs."""
import json, re, math
from pathlib import Path
plan=json.loads(Path('output/curriculum-review/pass-15/correction-plan.json').read_text(encoding='utf8'))
checked=0
for row in plan['changes']:
    blocks=re.findall(r'```python\n([\s\S]*?)```',row['payload'].get('answer',''))
    for code in blocks:
        printed=[]
        scope={'__builtins__':{'input':lambda *_:'5','print':lambda *a,**k:printed.append(' '.join(map(str,a))),'int':int,'range':range,'round':round,'str':str}}
        scope['members']=[{'age':16,'id':'M01'},{'age':15,'id':'M02'},{'age':17,'id':'M03'},{'age':14,'id':'M04'}]
        exec(compile(code,row['ref'],'exec'),scope)
        if 'count_passes' in scope: assert scope['count_passes']([49,50,75])==2 and scope['count_passes']([])==0
        if 'compute_bill' in scope: assert math.isclose(scope['compute_bill']([25,25],.2),57) and scope['compute_bill']([10],0)==10
        if 'compute_final_score' in scope: assert math.isclose(scope['compute_final_score']([50,50]),110) and scope['compute_final_score']([30,20])==50
        if 'square' in scope: assert printed==['The square is 25']
        if row['ref'].endswith('programming-techniques/exam-4-AQA-core'): assert printed==['31.5']
        if row['ref'].endswith('programming-techniques/exam-9-Edexcel-core'): assert printed==['M01 M03']
        if row['ref'].endswith('programming-techniques/practice-2-Edexcel-core'): assert printed==['7.88']
        if row['ref'].endswith('testing-and-defensive-design/practice-2-AQA-core'): assert printed==['Total is 15']
        checked+=1
assert checked==8, checked
print(f'PASS: {checked} corrected Python answers compile and produce expected results, including boundary cases.')
