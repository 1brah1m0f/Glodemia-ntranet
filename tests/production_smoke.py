from playwright.sync_api import sync_playwright
from pathlib import Path
Path('artifacts').mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    errors=[];failed=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('requestfailed',lambda r:failed.append(r.url))
    for role in ['admin','student','teacher']:
        page.goto('http://localhost:4173/#/login/'+role)
        page.evaluate('document.fonts.ready')
        page.screenshot(path=f'artifacts/login-{role}-final.png',full_page=True)
        page.get_by_role('button',name='Demo panelə daxil ol').click()
        page.evaluate('document.fonts.ready')
        if role=='admin':
            assert page.get_by_text('15 oktyabr 2026',exact=True).is_visible()
            assert '₼' in page.locator('.stat').nth(2).inner_text()
        page.screenshot(path=f'artifacts/{role}-final.png',full_page=True)
        page.get_by_role('button',name='EN',exact=True).click()
        assert page.locator('html').get_attribute('lang')=='en'
        page.get_by_role('button',name='AZ',exact=True).click()
        page.get_by_role('button',name='Təqdimat rejimi').click()
        assert page.locator('.presentation-mode').count()==1
        if role=='admin':
            page.get_by_role('button',name='Tələbə əlavə et',exact=True).click()
            assert page.get_by_role('dialog').is_visible()
            assert page.evaluate('document.activeElement.closest("dialog")!==null')
            page.keyboard.press('Escape')
            assert page.get_by_role('dialog').count()==0
        page.set_viewport_size({'width':390,'height':844})
        page.screenshot(path=f'artifacts/{role}-mobile-final.png',full_page=True)
        page.get_by_role('button',name='Menyunu aç',exact=True).click()
        assert page.locator('.sidebar.mobile-open').is_visible()
        page.get_by_role('button',name='Menyunu bağla',exact=True).click()
        assert not page.locator('.sidebar').evaluate('(e)=>e.classList.contains("mobile-open")')
        page.set_viewport_size({'width':1440,'height':1000})
    assert not errors,errors
    assert not failed,failed
    print('PASS: production build, three entry flows, AZ/EN and Azerbaijani dates/currency, local assets, presentation mode, dialog keyboard focus/Escape, mobile drawer. No JS errors or failed asset requests.')
    browser.close()
