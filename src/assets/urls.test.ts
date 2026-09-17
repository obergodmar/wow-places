import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { getAssetVersion } from '../../scripts/asset-version';
import { assetUrl } from './urls';

afterEach(() => vi.unstubAllEnvs());

it('versions local media and fonts without changing external asset URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_ASSET_VERSION', 'test-version');
    expect(assetUrl('/media/ui/border.png')).toBe('/media/v-test-version/ui/border.png');
    expect(assetUrl('/fonts/font.woff2')).toBe('/fonts/v-test-version/font.woff2');
    expect(assetUrl('https://cdn.example/media/scene.jpg')).toBe(
        'https://cdn.example/media/scene.jpg',
    );
});

it('changes the asset version when file contents change, even with the same filename and size', () => {
    const root = mkdtempSync(join(tmpdir(), 'wow-asset-version-'));
    try {
        mkdirSync(join(root, 'media'));
        mkdirSync(join(root, 'fonts'));
        const file = join(root, 'media', 'scene.jpg');
        writeFileSync(file, 'first');
        const original = getAssetVersion(root);
        expect(getAssetVersion(root)).toBe(original);
        writeFileSync(file, 'other');
        expect(getAssetVersion(root)).not.toBe(original);
    } finally {
        rmSync(root, { recursive: true });
    }
});
