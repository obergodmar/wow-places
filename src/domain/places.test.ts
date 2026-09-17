import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import catalog from '../server/places.json';
import { parsePlaces, resolvePlace } from './places';

describe('catalog', () => {
    it('preserves all eight locations and their available media', () => {
        const places = parsePlaces(catalog);
        expect(places).toHaveLength(8);
        expect(places.reduce((total, place) => total + place.view.length, 0)).toBe(50);
        for (const place of places)
            for (const url of [...place.view, ...place.preview, ...place.music]) {
                expect(existsSync(join(process.cwd(), 'public', url))).toBe(true);
            }
    });
    it.each([
        null,
        [],
        [null],
        [{ ...catalog[0], name: '../oops' }],
        [catalog[0], catalog[0]],
        [{ ...catalog[0], music: [] }],
        [{ ...catalog[0], preview: ['/media/a.jpg'] }],
    ])('rejects malformed catalog %#', (input) => {
        expect(() => parsePlaces(input)).toThrow();
    });
    it.each([
        'javascript:alert(1)',
        '//evil.example/a',
        '/media/../secret',
        '/media/%2e%2e/x',
        'https://u:p@example.com/a',
        '/media/a).jpg',
        'http://example.com/a',
    ])('rejects unsafe media %s', (url) => {
        expect(() => parsePlaces([{ ...catalog[0], music: [url] }])).toThrow();
    });
    it('accepts public HTTPS storage URLs', () => {
        expect(
            parsePlaces([{ ...catalog[0], music: ['https://cdn.example.com/music.ogg'] }])[0].music,
        ).toEqual(['https://cdn.example.com/music.ogg']);
    });
});
describe('route resolution', () => {
    it.each([
        ['-1', 0],
        ['2.9', 2],
        ['999', 8],
        ['NaN', 0],
        ['Infinity', 0],
        ['0', 0],
        ['2', 2],
    ])('normalizes view %s', (value, expected) => {
        expect(resolvePlace(catalog, 'stormwind-park', value).activeView).toBe(expected);
    });
    it('resolves known places and falls back safely for unknown ones', () => {
        expect(resolvePlace(catalog, 'boralus', '3').path).toBe('/boralus/3');
        expect(resolvePlace(catalog, 'missing').path).toBe('/stormwind-park/0');
    });
});
