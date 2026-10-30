import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 1440, 'height': 1050}, device_scale_factor=1)
        await page.emulate_media(reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.goto('http://localhost:4200', wait_until='networkidle')
        await page.screenshot(path='/home/user/neura-cliente360/desktop.png', full_page=True)
        await page.get_by_role('button', name='Abrir conversa', exact=True).click()
        await page.get_by_role('dialog').wait_for()
        assert await page.get_by_text('Somente leitura. Envio de mensagens não disponível.').is_visible()
        await page.screenshot(path='/home/user/neura-cliente360/conversation.png')
        await page.keyboard.press('Escape')
        assert await page.get_by_role('dialog').count() == 0
        for scenario in ['A', 'B', 'C', 'D', 'E', 'F']:
            await page.get_by_label('Cenário de avaliação', exact=True).select_option(scenario)
            for tab in ['Resumo', 'Conversa', 'Dados', 'Pessoas', 'Histórico', 'Orçamentos', 'Automação']:
                await page.get_by_role('tab', name=tab).click()
                assert await page.locator('#tab-content').is_visible()
                open_button = page.get_by_role('button', name='Abrir conversa', exact=True)
                if await open_button.count():
                    assert await open_button.is_enabled() == (scenario in ['A', 'E'])
        await page.get_by_label('Cenário de avaliação', exact=True).select_option('A')
        await page.get_by_role('tab', name='Resumo').click()
        for state in ['LOADING', 'EMPTY', 'SUCCESS', 'PARTIAL', 'ERROR', 'STALE']:
            await page.get_by_label('Estado da tela', exact=True).select_option(state)
            assert await page.locator('#tab-content').is_visible()
            if state in ['LOADING', 'EMPTY', 'ERROR']:
                assert await page.get_by_role('button', name='Abrir conversa', exact=True).count() == 0
        await page.get_by_label('Estado da tela', exact=True).select_option('SUCCESS')
        await page.get_by_role('button', name='Visualização celular', exact=True).click()
        await page.screenshot(path='/home/user/neura-cliente360/phone-preview.png', full_page=True)
        await page.get_by_role('button', name='Visualização desktop', exact=True).click()
        for width in [390, 320, 768]:
            await page.set_viewport_size({'width': width, 'height': 844})
            for tab in ['Resumo', 'Conversa', 'Dados', 'Pessoas', 'Histórico', 'Orçamentos', 'Automação']:
                await page.get_by_role('tab', name=tab).click()
                overflow = await page.evaluate('document.documentElement.scrollWidth > window.innerWidth')
                assert not overflow, f'Overflow {width} {tab}'
            await page.get_by_role('tab', name='Resumo').click()
            if width == 390:
                await page.screenshot(path='/home/user/neura-cliente360/mobile.png', full_page=True)
        await page.set_viewport_size({'width': 1440, 'height': 1050})
        await page.get_by_role('tab', name='Histórico').click()
        await page.get_by_label('Filtrar histórico', exact=True).fill('rascunho')
        assert await page.locator('.timeline-item').count() == 1
        await page.get_by_role('button', name='Limpar busca', exact=True).click()
        assert await page.locator('.timeline-item').count() == 3
        assert not errors, errors
        result = {'scenarios': 6, 'tabs_each': 7, 'screen_states': 6, 'viewports': [1440, 768, 390, 320], 'runtime_errors': errors, 'conversation': 'local modal tested; blocked B/C/D/F', 'result': 'PASS'}
        Path('/home/user/neura-cliente360/verification.json').write_text(json.dumps(result, indent=2))
        print(json.dumps(result, indent=2))
        await browser.close()

asyncio.run(main())