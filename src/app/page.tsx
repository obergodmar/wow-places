import { redirect } from 'next/navigation';
import { getPlaces } from '../server/catalog';

export const dynamic = 'force-dynamic';
export default async function Home() {
    const places = await getPlaces();
    redirect(`/${places[0].name}/0`);
}
