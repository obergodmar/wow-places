export interface Place {
    name: string;
    preview: string[];
    view: string[];
    music: string[];
}

export function parsePlaces(value: unknown): Place[] {
    if (!Array.isArray(value) || value.length === 0) throw new Error('Catalog must contain places');
    const names = new Set<string>();
    return value.map((item: unknown) => {
        if (!item || typeof item !== 'object') throw new Error('Invalid place');
        const record = item as Record<string, unknown>;
        const { name } = record;
        if (
            typeof name !== 'string' ||
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) ||
            names.has(name)
        ) {
            throw new Error('Place names must be unique URL slugs');
        }
        names.add(name);
        const media = (key: string): string[] => {
            const urls = record[key];
            if (!Array.isArray(urls) || !urls.length || !urls.every(isMediaUrl)) {
                throw new Error(`Invalid ${key} for ${name}`);
            }
            return [...urls];
        };
        const place = {
            name,
            preview: media('preview'),
            view: media('view'),
            music: media('music'),
        };
        if (place.preview.length !== place.view.length)
            throw new Error(`Mismatched previews for ${name}`);
        return place;
    });
}

function isMediaUrl(value: unknown): value is string {
    if (typeof value !== 'string' || /[\s\\'"()]/.test(value)) return false;
    if (value.startsWith('/media/') && !value.split('/').includes('..') && !/[?#%]/.test(value))
        return true;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && !url.username && !url.password;
    } catch {
        return false;
    }
}

export function resolvePlace(places: Place[], placeName?: string, viewNumber?: string) {
    const activePlace = Math.max(
        0,
        places.findIndex((place) => place.name === placeName),
    );
    const parsed = Number(viewNumber);
    const activeView = Number.isFinite(parsed)
        ? Math.min(places[activePlace].view.length - 1, Math.max(0, Math.trunc(parsed)))
        : 0;
    return { activePlace, activeView, path: `/${places[activePlace].name}/${activeView}` };
}
