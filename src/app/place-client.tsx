'use client';
import dynamic from 'next/dynamic';
import type { Place } from '../domain/places';

// Audio, image dragging and browser language detection need a mounted browser.
const Experience = dynamic(() => import('../experience'), { ssr: false });
export function PlaceClient({ places }: { places: Place[] }) {
    return <Experience places={places} />;
}
