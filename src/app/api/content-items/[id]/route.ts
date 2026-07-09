import { requireAuth, ok, bad, readJson } from '@/lib/api';
import {
  updateContentItem,
  deleteContentItem,
  getContentItems,
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
  await updateContentItem({
    id,
    platform: String(body.platform ?? ''),
    name: String(body.name ?? ''),
    description: String(body.description ?? ''),
    url: String(body.url ?? ''),
    linkText: String(body.linkText ?? 'Open ↗'),
    visible: body.visible !== false,
    order: Number(body.order) || 0,
  });
  return ok({ items: await getContentItems(true) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAuth();
  if (guard) return guard;
  const id = Number((await params).id);
  if (!id) return bad('Missing id');
  await deleteContentItem(id);
  return ok({ items: await getContentItems(true) });
}
