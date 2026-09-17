import { getPlaces } from '../../../server/catalog';
export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        return Response.json(await getPlaces(), { headers: { 'Cache-Control': 'no-store' } });
    } catch {
        return Response.json({ error: 'Catalog unavailable' }, { status: 503 });
    }
}
