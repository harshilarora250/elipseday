import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { reorder } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = ['projects', 'achievements', 'content_items', 'contact_links', 'currently_items'];

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<{ collection?: string; ids?: number[] }>(req);
  if (!body) return bad('Invalid JSON');
  const collection = body.collection || '';
  if (!VALID.includes(collection)) return bad('Unknown collection');
  if (!Array.isArray(body.ids)) return bad('ids must be an array');
  const okReorder = reorder(collection, body.ids.map(Number).filter(Boolean));
  if (!okReorder) return bad('Reorder failed');
  return ok({ reordered: true });
}
