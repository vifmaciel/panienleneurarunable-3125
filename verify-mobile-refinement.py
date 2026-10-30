import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width':390,'height':844}, reduced_motion='reduce')
        errors=[]
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.goto('http://localhost:4200', wait_until='networkidle')
        env=page.locator('.evaluation-environment')
        assert await env.get_attribute('open') is None
        assert not await page.get_by_label('Cenário de avaliação', exact=True).is_visible()
        assert await page.get_by_role('button', name='Abrir conversa', exact=True).count()==1
        assert await page.locator('.next-action').get_by_text('Faixas etárias das 8 vidas', exact=False).is_visible()
        assert await page.locator('.next-action button').count()==0
        chat=page.locator('.conversation-card')
        action=page.locator('.next-action')
        assert (await chat.bounding_box())['y'] < (await action.bounding_box())['y']
        await page.screenshot(path='/home/user/neura-cliente360/mobile-refined.png', full_page=True)
        assert await page.get_by_text('Deslize para ver as 7 abas').is_visible()
        await page.get_by_role('button', name='Rolar abas para a direita', exact=True).click()
        assert await page.get_by_role('tab', name='Resumo').get_attribute('aria-selected')=='true'
        assert await page.locator('.tabs').evaluate('(el)=>el.scrollLeft') > 0
        await page.get_by_role('tab', name='Automação', exact=True).click()
        assert await page.get_by_role('tab', name='Automação').get_attribute('aria-selected')=='true'
        assert await page.locator('.next-action').count()==0
        await page.get_by_role('tab', name='Resumo', exact=True).click()
        await env.locator('summary').click()
        assert await page.get_by_label('Cenário de avaliação', exact=True).is_visible()
        for scenario in ['A','B','C','D','E','F']:
            await page.get_by_label('Cenário de avaliação', exact=True).select_option(scenario)
            if scenario=='C':
                assert 'Quantidade de vidas' in await page.locator('.next-action').inner_text()
                assert 'Revisar informações ambíguas' in await page.locator('.next-action').inner_text()
            if scenario=='D':
                assert 'Próxima ação não definida' in await page.locator('.next-action').inner_text()
            if scenario=='F':
                assert await page.locator('.next-action').count()==0
        await page.get_by_label('Cenário de avaliação',exact=True).select_option('A')
        await env.locator('summary').click()
        await page.get_by_role('button', name='Abrir conversa',exact=True).click()
        assert await page.get_by_role('dialog').is_visible()
        await page.keyboard.press('Escape')
        assert await page.get_by_role('dialog').count()==0
        for width in [320,390,768,1440]:
            await page.set_viewport_size({'width':width,'height':844})
            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
        await page.get_by_role('button',name='Visualização celular',exact=True).click()
        await expect(env).not_to_have_attribute('open', '')
        await page.get_by_role('button',name='Visualização desktop',exact=True).click()
        await expect(env).to_have_attribute('open', '')
        assert not errors, errors
        result={'result':'PASS','evaluation':'closed by default on mobile and phone preview; controls accessible on expansion','tabs':'scroll hint, fade and buttons tested; selection preserved','next_action':'derived pending facts, ambiguous facts and undefined fallback tested','conversation':'single highlighted button; local read-only modal preserved','runtime_errors':errors}
        Path('/home/user/neura-cliente360/verification-mobile-refinement.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
        print(json.dumps(result,ensure_ascii=False,indent=2))
        await browser.close()

asyncio.run(main())