import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAdminData } from '@/lib/content';
import AdminApp from '@/components/admin/AdminApp';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const loggedIn = await getSession();
  if (!loggedIn) redirect('/admin/login');

  const data = await getAdminData();

  return <AdminApp initial={data} />;
}
