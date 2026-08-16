"use client";
import { AdminDashboard } from '@/views/AdminDashboard';

import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  return <AdminDashboard setActiveTab={(tab: string) => {
    if (tab === 'dashboard') router.push('/admin');
    else router.push(`/admin/${tab}`);
  }} />;
}
