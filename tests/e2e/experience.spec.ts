import { expect, test } from '@playwright/test';

test('loads original scene, navigates views and places, and restores browser history', async ({
    page,
}) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page).toHaveURL(/\/stormwind-park\/0$/);
    await expect(page.locator('.view-background')).toHaveClass(/loaded/);
    await expect(page.locator('.view')).toHaveCSS('background-image', /stormwind-park-1.jpg/);
    await page.getByRole('button', { name: 'Close help', exact: true }).click();
    await page.getByRole('button', { name: 'Views', exact: true }).click();
    await page.getByRole('button', { name: 'View 2', exact: true }).click();
    await expect(page).toHaveURL(/\/stormwind-park\/1$/);
    await expect(page.locator('.view')).toHaveCSS('background-image', /stormwind-park-2.jpg/);
    await page.goBack();
    await expect(page).toHaveURL(/\/stormwind-park\/0$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/stormwind-park\/1$/);
    await page.getByRole('button', { name: 'Places', exact: true }).click();
    await page.getByRole('button', { name: 'Halls Of Valor', exact: true }).click();
    await expect(page).toHaveURL(/\/halls-of-valor\/0$/);
    await expect(page.locator('.view')).toHaveCSS('background-image', /halls-of-valor-1.jpg/);
    expect(errors).toEqual([]);
});

test('settings preserve language, sound toggles and keyboard control', async ({ page }) => {
    await page.goto('/stormwind-park/0');
    await page.locator('.main').focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('.settings')).toBeVisible();
    await page.locator('.select').click();
    await page.locator('.select-item').filter({ hasText: 'Русский' }).click();
    await expect(page.getByRole('button', { name: 'Закрыть', exact: true })).toBeVisible();
    await page.locator('.checkbox').click();
    await expect(page.locator('.checkbox')).not.toHaveClass(/checked/);
    await page.locator('.range').focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.range-stick')).toHaveCSS('left', '50px');
    await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
    await expect(page.locator('.settings')).toHaveCount(0);
});

test('normalizes invalid view indexes and retains the original not-found screen', async ({
    page,
}) => {
    await page.goto('/boralus/-1');
    await expect(page).toHaveURL(/\/boralus\/0$/);
    await page.goto('/not/a/route');
    await expect(page.locator('.container-video')).toBeVisible();
    await page.locator('.dialog-box button').click();
    await expect(page).toHaveURL(/\/stormwind-park\/0$/);
});

test('exposes the server catalog and serves audio range requests', async ({ request }) => {
    const response = await request.get('/api/places');
    expect(response.ok()).toBe(true);
    const places = await response.json();
    expect(places).toHaveLength(8);
    const audio = await request.get(places[0].music[0], { headers: { Range: 'bytes=0-31' } });
    expect(audio.status()).toBe(206);
    expect((await audio.body()).length).toBe(32);
});

test('plays music, pauses with Space, preserves volume and advances tracks', async ({ page }) => {
    await page.addInitScript(() => {
        const NativeAudio = window.Audio;
        const audios: HTMLAudioElement[] = [];
        Object.assign(window, { testAudios: audios });
        window.Audio = class extends NativeAudio {
            constructor(src?: string) {
                super(src);
                audios.push(this);
            }
        };
    });
    const music = () =>
        page.evaluate(() => {
            const audios = (window as unknown as { testAudios: HTMLAudioElement[] }).testAudios;
            const audio = audios.findLast((item) => item.src.includes('/music/'));
            return audio ? { paused: audio.paused, volume: audio.volume, src: audio.src } : null;
        });
    await page.goto('/stormwind-park/0');
    await page.getByRole('button', { name: 'settings', exact: true }).click();
    await page.getByRole('slider').focus();
    await page.keyboard.press('Home');
    await expect.poll(async () => (await music())?.volume).toBe(0);
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect.poll(async () => (await music())?.paused).toBe(false);
    await page.locator('.main').focus();
    await page.keyboard.press('Space');
    await expect.poll(async () => (await music())?.paused).toBe(true);
    await page.keyboard.press('Space');
    await expect.poll(async () => (await music())?.paused).toBe(false);
    await page.evaluate(() => {
        const audios = (window as unknown as { testAudios: HTMLAudioElement[] }).testAudios;
        audios.findLast((item) => item.src.includes('/music/'))?.dispatchEvent(new Event('ended'));
    });
    await expect.poll(async () => (await music())?.volume).toBe(0);
    await expect.poll(async () => (await music())?.paused).toBe(false);
});

test('pans scenery and scrolls the view panel without leaving the scene', async ({ page }) => {
    await page.goto('/stormwind-park/0');
    await page.getByRole('button', { name: 'Close help', exact: true }).click();
    const view = page.locator('.view');
    const previous = await view.evaluate(
        (element) => (element as HTMLElement).style.backgroundPosition,
    );
    const viewport = page.viewportSize()!;
    await page.mouse.move(viewport.width / 2, viewport.height / 3);
    await page.mouse.down();
    await page.mouse.move(viewport.width / 2 + 50, viewport.height / 3 + 50, { steps: 5 });
    await page.mouse.up();
    await expect
        .poll(() => view.evaluate((element) => (element as HTMLElement).style.backgroundPosition))
        .not.toBe(previous);
    await page.getByRole('button', { name: 'Views', exact: true }).click();
    await page.locator('.panel--bottom .preview').first().hover();
    await page.mouse.wheel(0, 100);
    await expect(page.locator('.panel--bottom .panel-content')).toHaveCSS(
        'transform',
        'matrix(1, 0, 0, 1, -80, 0)',
    );
    await expect(page).toHaveURL(/\/stormwind-park\/0$/);
});
