import { redirect } from 'next/navigation';
import { getPlaces } from '../../../server/catalog';
import { resolvePlace } from '../../../domain/places';
import { PlaceClient } from '../../place-client';

export const dynamic = 'force-dynamic';
export default async function PlacePage({
    params,
}: {
    params: Promise<{ placeName: string; viewNumber: string }>;
}) {
    const { placeName, viewNumber } = await params;
    const places = await getPlaces();
    const { path } = resolvePlace(places, placeName, viewNumber);
    if (path !== `/${placeName}/${viewNumber}`) redirect(path);
    return <PlaceClient places={places} />;
}
