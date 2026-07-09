import { NextResponse } from 'next/server';
import { getSession } from './auth';

// Wraps an authenticated route handler. Returns 401 when no valid session.
export async function requireAuth(): Promise<NextResponse | null> {
  const ok = await getSession();
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export function ok(data: unknown = { ok: true }) {
  return NextResponse.json(data);
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function readJson<T = Record<string, unknown>>(
  req: Request
): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
