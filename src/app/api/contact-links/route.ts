import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { createContactLink, getContactLinks } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  if (!String(body.label ?? '').trim()) return bad('Label is required');
  const id = createContactLink({
    label: String(body.label),
    value: String(body.value ?? ''),
    url: String(body.url ?? ''),
    visible: body.visible !== false,
  });
  return ok({ id, items: getContactLinks(true) });
}
