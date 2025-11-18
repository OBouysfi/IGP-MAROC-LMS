'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'student' | 'professor' | 'assistant' | 'admin';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push(allowedRole === 'admin' ? '/admin/login' : '/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== allowedRole) {
      router.push(allowedRole === 'admin' ? '/admin/login' : '/login');
    }
  }, [router, allowedRole]);

  return <>{children}</>;
}