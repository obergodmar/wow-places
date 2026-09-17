import { expect, test, type Locator } from '@playwright/test';

async function expectInsideViewport(locator: Locator) {
    await expect(locator).toBeInViewport({ ratio: 1 });
    const bounds = await locator.boundingBox();
    const viewport = locator.page().viewportSize()!;
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
}

for (const locale of ['en-US', 'ru-RU']) {
    test.describe(locale, () => {
        test.use({ locale });

        for (const viewport of [
            { width: 320, height: 480 },
            { width: 393, height: 672 },
            { width: 844, height: 320 },
        ]) {
            test(`help and bottom panel fit ${viewport.width}×${viewport.height}`, async ({
                page,
            }) => {
                await page.setViewportSize(viewport);
                await page.goto('/stormwind-park/0');
                const dialog = page.locator('.dialog-modal');
                const close = page.getByRole('button', { name: 'Close help', exact: true });
                const views = page.locator('.panel--bottom > button');
                await expect(dialog).toHaveCSS('opacity', '1');
                await expectInsideViewport(dialog);
                await expectInsideViewport(close);
                await expectInsideViewport(views);
                await close.click();
                await expect(dialog).toHaveCount(0);
                await views.click();
                await expect(page.locator('.panel--bottom')).toHaveCSS('bottom', '0px');
                await expectInsideViewport(page.locator('.panel--bottom'));
                await expectInsideViewport(views);
                await page.getByRole('button', { name: 'help', exact: true }).click();
                await expect(dialog).toHaveCSS('opacity', '1');
                await expectInsideViewport(dialog);
                await expectInsideViewport(close);

                // Browser controls and orientation changes reduce the available height.
                await page.setViewportSize({ ...viewport, height: viewport.height - 60 });
                await expect(page.locator('.main')).toHaveCSS(
                    'height',
                    `${viewport.height - 60}px`,
                );
                await expectInsideViewport(dialog);
                await expectInsideViewport(close);
                const content = page.locator('.dialog-modal-content');
                expect(
                    await content.evaluate((element) => element.scrollWidth <= element.clientWidth),
                ).toBe(true);
                await content.evaluate((element) => {
                    element.scrollTop = element.scrollHeight;
                });
                expect(
                    await content.evaluate(
                        (element) =>
                            Math.abs(
                                element.scrollHeight - element.clientHeight - element.scrollTop,
                            ) <= 1,
                    ),
                ).toBe(true);
                await close.click();
                await expect(dialog).toHaveCount(0);
                await expectInsideViewport(views);
                await views.click();
                await expect(page.locator('.panel--bottom')).not.toHaveClass(/shown/);
                await expectInsideViewport(views);
            });
        }
    });
}
