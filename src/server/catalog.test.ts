import { describe, expect, it, vi } from 'vitest';
import { createPlaceRepository, getPlaces } from './catalog';
import catalog from './places.json';

describe('place repository', () => {
    it('serves the bundled catalog by default', async () => {
        expect(await createPlaceRepository({}).list()).toEqual(catalog);
        expect(await getPlaces()).toEqual(catalog);
    });
    it('maps relative media to external storage and preserves absolute URLs', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValue(
                    Response.json([{ ...catalog[0], music: ['https://other.example/music.ogg'] }]),
                ),
        );
        const places = await createPlaceRepository({
            catalogUrl: 'https://cms.example/places.json',
            mediaBaseUrl: 'https://cdn.example/wow/',
        }).list();
        expect(places[0].view[0]).toBe(
            'https://cdn.example/wow/stormwind-park/view/stormwind-park-1.jpg',
        );
        expect(places[0].music[0]).toBe('https://other.example/music.ogg');
        expect(String(vi.mocked(fetch).mock.calls[0][0])).toBe('https://cms.example/places.json');
        expect(vi.mocked(fetch).mock.calls[0][1]?.cache).toBe('no-store');
    });
    it('rejects failed or malformed remote data', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
        await expect(
            createPlaceRepository({ catalogUrl: 'https://cms.example/' }).list(),
        ).rejects.toThrow('500');
        vi.mocked(fetch).mockResolvedValue(Response.json([]));
        await expect(
            createPlaceRepository({ catalogUrl: 'https://cms.example/' }).list(),
        ).rejects.toThrow('Catalog');
    });
    it('requires HTTPS for external sources', async () => {
        await expect(
            createPlaceRepository({ catalogUrl: 'http://cms.example/' }).list(),
        ).rejects.toThrow('HTTPS');
        await expect(
            createPlaceRepository({ mediaBaseUrl: 'http://cdn.example/' }).list(),
        ).rejects.toThrow('HTTPS');
    });
    it('uses versioned local media but leaves external storage URLs unchanged', async () => {
        vi.stubEnv('NEXT_PUBLIC_ASSET_VERSION', 'test-version');
        try {
            const local = await createPlaceRepository({}).list();
            expect(local[0].view[0]).toBe(
                '/media/v-test-version/stormwind-park/view/stormwind-park-1.jpg',
            );
            const external = await createPlaceRepository({
                mediaBaseUrl: 'https://cdn.example/',
            }).list();
            expect(external[0].view[0]).toBe(
                'https://cdn.example/stormwind-park/view/stormwind-park-1.jpg',
            );
        } finally {
            vi.unstubAllEnvs();
        }
    });
});
