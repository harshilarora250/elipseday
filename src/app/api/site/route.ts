import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { updateSite } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');

  const allowed = ['name', 'tagline', 'statusText', 'copyright', 'navCtaText'];
  const obj: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) obj[k] = String(body[k] ?? '');
  }
  await updateSite(obj);
  return ok({ site: obj });
}
