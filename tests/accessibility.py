from playwright.sync_api import sync_playwright
from pathlib import Path
Path("artifacts").mkdir(exist_ok=True)
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));violations=[]
 pages={'admin':['overview','students','groups','schedule','team','finance','reports'],'student':['overview','materials','assignments','schedule','results'],'teacher':['overview','groups','students','attendance','assignments','materials']}
 for role,sections in pages.items():
  page.set_viewport_size({'width':1440,'height':1000});page.goto('http://localhost:5173/#/login/'+role);page.get_by_role('button',name='Demo panelə daxil ol').click()
  for section in sections:
   page.goto('http://localhost:5173/#/'+role+'/'+section);page.wait_for_timeout(70)
   page.add_script_tag(path='node_modules/axe-core/axe.min.js');result=page.evaluate('''async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})''')
   for violation in result['violations']:violations.append((role,section,violation['id'],[(n['html'][:120],n['failureSummary'][:170]) for n in violation['nodes'][:6]]))
   for width in [320,768,1024,1440]:
    page.set_viewport_size({'width':width,'height':1000});page.wait_for_timeout(25)
    if page.evaluate('document.documentElement.scrollWidth>innerWidth'):
     page.screenshot(path=f'artifacts/overflow-{role}-{section}-{width}.png',full_page=True);raise AssertionError((role,section,width))
  print(role,'pages checked',flush=True)
 # Login checks including contrast and mobile.
 page.goto('http://localhost:5173/#/login/student');page.add_script_tag(path='node_modules/axe-core/axe.min.js');r=page.evaluate('''async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})''');violations.extend([('login','student',v['id'],[(n['html'][:120],n['failureSummary'][:170]) for n in v['nodes']]) for v in r['violations']])
 for w in [320,768,1024,1440]:
  page.set_viewport_size({'width':w,'height':1000});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('login',w)
 print('A11Y',json.dumps(violations,ensure_ascii=False));assert not violations,violations;assert not errors,errors;b.close();print('PASS: all 18 pages at 4 widths and automated WCAG 2.1 AA checks.')
