import AdminLayout from '@/components/layouts/AdminLayout';
import { ReactNode } from 'react';

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}