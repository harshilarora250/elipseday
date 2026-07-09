import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { createContentItem, getContentItems } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  if (!String(body.name ?? '').trim()) return bad('Name is required');
  const id = await createContentItem({
    platform: String(body.platform ?? ''),
    name: String(body.name),
    description: String(body.description ?? ''),
    url: String(body.url ?? ''),
    linkText: String(body.linkText ?? 'Open ↗'),
    visible: body.visible !== false,
  });
  return ok({ id, items: await getContentItems(true) });
}
