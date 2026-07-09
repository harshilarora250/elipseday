import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAdminData } from '@/lib/content';
import AdminApp from '@/components/admin/AdminApp';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const loggedIn = await getSession();
  if (!loggedIn) redirect('/admin/login');

  // getAdminData() seeds the DB on first call, so it always returns data.
  const data = getAdminData();

  return <AdminApp initial={data} />;
}
