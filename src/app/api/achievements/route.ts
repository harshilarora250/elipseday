import { requireAuth, ok, bad, readJson } from '@/lib/api';
import { createAchievement, getAchievements } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;
  const body = await readJson<Record<string, unknown>>(req);
  if (!body) return bad('Invalid JSON');
  if (!String(body.title ?? '').trim()) return bad('Title is required');
  const id = await createAchievement({
    year: String(body.year ?? ''),
    title: String(body.title),
    description: String(body.description ?? ''),
    visible: body.visible !== false,
  });
  return ok({ id, items: await getAchievements(true) });
}
