from playwright.sync_api import sync_playwright
from pathlib import Path
Path("artifacts").mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1050},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:5173');page.wait_for_timeout(500);page.screenshot(path='artifacts/login-az.png',full_page=True)
 page.get_by_role('button',name='EN',exact=True).click()
 page.get_by_role('button',name='Student workspace',exact=True).click();page.get_by_role('button',name='Enter demo workspace',exact=True).click()
 assert page.get_by_role('heading',name='Keep moving forward, Aylin.').is_visible()
 page.screenshot(path='artifacts/student-en.png',full_page=True)
 page.get_by_role('button',name='Learning library',exact=True).click();assert page.locator('.resource-card').count()==3
 page.locator('.bookmark-button').first.click();page.locator('.resource-card .button').first.click()
 assert page.get_by_role('dialog').is_visible()
 with page.expect_download() as dl: page.get_by_role('button',name='Download (.txt)',exact=True).click()
 assert dl.value.suggested_filename.endswith('.txt')
 page.get_by_role('button',name='Mark as read',exact=True).click()
 page.get_by_role('button',name='My assignments',exact=True).click();page.get_by_role('button',name='Open assignment',exact=True).first.click()
 page.locator('textarea').fill('Online learning opens access to education. For example, people can study from home. Clear feedback and a regular schedule help learners improve their skills and confidence.')
 page.get_by_role('button',name='Submit response',exact=True).click();assert page.get_by_text('Submitted',exact=True).count()>0
 page.get_by_role('button',name='Sign out',exact=True).click();page.get_by_role('button',name='Teacher workspace',exact=True).click();page.get_by_role('button',name='Enter demo workspace').click()
 assert page.get_by_role('heading',name='Guide their next success, Nigar.').is_visible()
 page.screenshot(path='artifacts/teacher-en.png',full_page=True)
 page.get_by_role('button',name='Assignments & feedback',exact=True).click()
 row=page.locator('.submission-row').filter(has_text='Aylin Məmmədova');assert row.count()==1;row.get_by_role('button',name='Review',exact=True).click()
 page.locator('input[type=number]').fill('91');page.locator('textarea').fill('A clear argument with good examples. Develop your conclusion further.');page.get_by_role('button',name='Save assessment',exact=True).click()
 page.get_by_role('button',name='Learning resources',exact=True).click();page.get_by_role('button',name='Add resource',exact=True).click()
 page.locator('[name=titleAz]').fill('Yeni oxu materialı');page.locator('[name=titleEn]').fill('New reading resource');page.locator('[name=bodyAz]').fill('Bu, tələbələr üçün əlavə edilmiş yeni nümunə dərs materialıdır.');page.locator('[name=bodyEn]').fill('This is a new fictional lesson resource prepared for students.');page.get_by_role('button',name='Publish resource').click()
 assert page.get_by_role('heading',name='New reading resource',exact=True).is_visible()
 page.get_by_role('button',name='Attendance',exact=True).click();page.locator('tbody tr').filter(has_text='Aylin Məmmədova').get_by_role('button',name='Absent',exact=True).click();page.get_by_role('button',name='Save attendance',exact=True).click();assert page.get_by_text('Saved',exact=True).is_visible()
 page.get_by_role('button',name='Post announcement',exact=True).click();page.locator('textarea').fill('Please prepare your essay outline for our next class.');page.get_by_role('dialog').get_by_role('button',name='Post announcement',exact=True).click()
 page.get_by_role('button',name='Sign out',exact=True).click();page.get_by_role('button',name='Student workspace',exact=True).click();page.get_by_role('button',name='Enter demo workspace').click()
 assert page.get_by_text('Please prepare your essay outline for our next class.',exact=True).is_visible()
 page.get_by_role('button',name='My progress',exact=True).click();assert page.get_by_text('91/100',exact=True).count()>0;assert page.get_by_text('A clear argument with good examples. Develop your conclusion further.',exact=True).is_visible()
 page.get_by_role('button',name='Learning library',exact=True).click();assert page.locator('.resource-card').count()==4
 page.get_by_role('button',name='Sign out',exact=True).click();page.get_by_role('button',name='Admin workspace',exact=True).click();page.get_by_role('button',name='Enter demo workspace').click();page.screenshot(path='artifacts/admin-en.png',full_page=True)
 page.get_by_role('button',name='Students',exact=True).click();page.get_by_role('button',name='Add student',exact=True).click();page.locator('[name=name]').fill('Aysu Demo');page.locator('[name=email]').fill('aysu@example.com');page.get_by_role('button',name='Add student',exact=True).last.click();page.get_by_role('searchbox',name='Search name, ID, or program…').fill('Aysu Demo');assert page.locator('tbody tr').count()==1
 for name in ['Courses & groups','Schedule','Team','Finance','Reports']:
  page.get_by_role('button',name=name,exact=True).click();assert page.locator('main h1').count()==1
 with page.expect_download() as dl:page.get_by_role('button',name='Export report',exact=True).click()
 assert dl.value.suggested_filename.endswith('.csv')
 for role,menu in {'admin':['Overview','Students','Courses & groups','Schedule','Team','Finance','Reports'],'student':['My dashboard','Learning library','My assignments','My schedule','My progress'],'teacher':['Teaching overview','My groups','My students','Attendance','Assignments & feedback','Learning resources']}.items():
  page.goto('http://localhost:5173/#/login/'+role);page.get_by_role('button',name='Enter demo workspace').click()
  for name in menu:
   page.get_by_role('button',name=name,exact=True).click();assert page.locator('main h1').count()==1
  page.get_by_role('button',name='AZ',exact=True).click();page.wait_for_timeout(100)
  page.screenshot(path=f'artifacts/{role}-az.png',full_page=True)
  page.get_by_role('button',name='EN',exact=True).click()
  for width in [320,768,1024,1440]:
   page.set_viewport_size({'width':width,'height':1000});page.wait_for_timeout(100)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow {role} {width}'
   page.screenshot(path=f'/tmp/{role}-{width}.png',full_page=True)
  page.set_viewport_size({'width':1440,'height':1050})
 assert not errors, errors
 print('PASS: all three logins; separate role navigation; AZ/EN; student submission → teacher review → student grade; material publishing; attendance; announcements; new student; exports; all module pages; responsive 320/768/1024/1440. No JS errors.')
 b.close()
