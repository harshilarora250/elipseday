import crypto from 'node:crypto';
import { extname } from 'node:path';
import { requireAuth, ok, bad } from '@/lib/api';
import { getSupabase } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (guard) return guard;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad('Expected multipart form data');
  }
  const file = form.get('file');
  if (!(file instanceof File)) return bad('No file provided');

  if (!ALLOWED.includes(file.type)) {
    return bad('Unsupported image type');
  }
  if (file.size > MAX_BYTES) {
    return bad('File too large (max 4MB)');
  }

  const ext = extname(file.name) || '.png';
  const safeName = crypto.randomUUID() + ext;
  const bytes = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(safeName, bytes, { contentType: file.type, upsert: false });

  if (error) {
    return bad(`Upload failed: ${error.message}`, 500);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
  return ok({ url: data.publicUrl });
}
