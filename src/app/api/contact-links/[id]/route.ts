import { requireAuth, ok, bad, readJson } from '@/lib/api';
import {
  updateContactLink,
  deleteContactLink,
  getContactLinks,
} from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number((await params).id);
  if (!id) return bad('Missing id');
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  updateContactLink({
    id,
    label: String(body.label ?? ''),
    value: String(body.value ?? ''),
    url: String(body.url ?? ''),
    visible: body.visible !== false,
    order: Number(body.order) || 0,
  });
  return ok({ items: getContactLinks(true) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number((await params).id);
  if (!id) return bad('Missing id');
  deleteContactLink(id);
  return ok({ items: getContactLinks(true) });
}
