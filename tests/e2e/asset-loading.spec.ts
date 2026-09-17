import { expect, test } from '@playwright/test';

test('preloads the selected scene and UI assets before JavaScript runs', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
        const page = await context.newPage();
        const requests: string[] = [];
        page.on('request', (request) => requests.push(request.url()));
        const response = await page.goto('http://127.0.0.1:3000/halls-of-valor/1');
        // React can emit high-priority hints as HTTP Link headers instead of DOM elements.
        expect(response?.headers().link).toContain(
            '/halls-of-valor/view/halls-of-valor-2.jpg>; rel=preload; as="image"; fetchpriority="high"',
        );
        for (const suffix of ['/halls-of-valor/view/halls-of-valor-2.jpg', '/font-0.woff2']) {
            await expect.poll(() => requests.some((url) => url.endsWith(suffix))).toBe(true);
        }
        await expect(page.locator('link[rel="preload"][href$="/ui/border.png"]')).toHaveCount(1);
        await expect(page.locator('link[rel="preload"][href$="/ui/plug.png"]')).toHaveCount(1);
        expect(response?.headers().link).toContain('as="font"; crossorigin=""');
        await expect(page.locator('.main')).toHaveCount(0);
    } finally {
        await context.close();
    }
});

test('serves versioned assets with immutable caching and preserves audio ranges', async ({
    request,
}) => {
    const catalog = await (await request.get('/api/places')).json();
    const scene = catalog[0].view[0] as string;
    expect(scene).toMatch(/^\/media\/v-[a-f0-9]{20}\//);
    const prefix = scene.split('/').slice(0, 3).join('/');
    for (const path of [scene, `${prefix}/ui/border.png`, `${prefix}/ui/plug.png`]) {
        const response = await request.get(path);
        expect(response.status()).toBe(200);
        expect(response.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
        expect(response.headers()['content-type']).toMatch(/^image\//);
    }
    const font = await request.get(`/fonts/${prefix.split('/')[2]}/font-0.woff2`);
    expect(font.status()).toBe(200);
    expect(font.headers()['cache-control']).toContain('immutable');
    const original = await request.get('/media/ui/border.png');
    expect(original.headers()['cache-control']).not.toContain('immutable');
    const audio = await request.get(catalog[0].music[0], { headers: { Range: 'bytes=0-31' } });
    expect(audio.status()).toBe(206);
    expect((await audio.body()).length).toBe(32);
});

test('reuses the preloaded border and placeholder when opening Places', async ({ page }) => {
    await page.goto('/stormwind-park/0');
    await expect(page.locator('.view-background')).toHaveClass(/loaded/);
    await page.waitForFunction(() =>
        ['border.png', 'plug.png'].every((name) =>
            performance
                .getEntriesByType('resource')
                .some((entry) => entry.name.endsWith(`/ui/${name}`)),
        ),
    );
    await page.getByRole('button', { name: 'Close help', exact: true }).click();
    await page.getByRole('button', { name: 'Places', exact: true }).click();
    await expect(page.locator('.preview').first()).toBeVisible();
    const resources = await page.evaluate(() =>
        performance.getEntriesByType('resource').map((entry) => entry.name),
    );
    for (const name of ['border.png', 'plug.png']) {
        expect(resources.filter((url) => url.endsWith(`/ui/${name}`))).toHaveLength(1);
    }
});
