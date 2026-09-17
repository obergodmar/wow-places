import 'server-only';
import { cache } from 'react';
import { parsePlaces, type Place } from '../domain/places';
import bundledPlaces from './places.json';

/** Read boundary for a future database/CMS repository. No browser credentials or write API. */
export interface PlaceRepository {
    list(): Promise<Place[]>;
}

export function createPlaceRepository(config: {
    catalogUrl?: string;
    mediaBaseUrl?: string;
}): PlaceRepository {
    return {
        async list() {
            let data: unknown = bundledPlaces;
            if (config.catalogUrl) {
                const url = new URL(config.catalogUrl);
                if (url.protocol !== 'https:') throw new Error('PLACES_CATALOG_URL must use HTTPS');
                const response = await fetch(url, {
                    cache: 'no-store',
                    signal: AbortSignal.timeout(10_000),
                });
                if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
                data = await response.json();
            }
            const places = parsePlaces(data);
            if (!config.mediaBaseUrl) return places;
            const base = new URL(config.mediaBaseUrl);
            if (base.protocol !== 'https:') throw new Error('MEDIA_BASE_URL must use HTTPS');
            const resolve = (url: string) =>
                url.startsWith('/media/')
                    ? `${base.href.replace(/\/$/, '')}/${url.slice('/media/'.length)}`
                    : url;
            return parsePlaces(
                places.map((place) => ({
                    ...place,
                    preview: place.preview.map(resolve),
                    view: place.view.map(resolve),
                    music: place.music.map(resolve),
                })),
            );
        },
    };
}

export const getPlaces = cache(() =>
    createPlaceRepository({
        catalogUrl: process.env.PLACES_CATALOG_URL,
        mediaBaseUrl: process.env.MEDIA_BASE_URL,
    }).list(),
);
