'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'student' | 'professor' | 'assistant' | 'admin';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('🔒 ProtectedRoute - Vérification pour role:', allowedRole);
    
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    console.log('🔒 Token:', token ? 'EXISTS' : 'MISSING');
    console.log('🔒 User:', userStr);

    if (!token || !userStr) {
      console.log('❌ Pas de token/user - Redirection login');
      router.push(allowedRole === 'admin' ? '/admin/login' : '/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log('🔒 User role:', user.role);
      console.log('🔒 Allowed role:', allowedRole);
      
      if (user.role !== allowedRole) {
        console.log('❌ Role incorrect - Redirection login');
        router.push(allowedRole === 'admin' ? '/admin/login' : '/login');
      } else {
        console.log('✅ Role correct - Accès autorisé');
        setIsChecking(false);
      }
    } catch (e) {
      console.log('❌ Erreur parse user - Redirection login');
      router.push(allowedRole === 'admin' ? '/admin/login' : '/login');
    }
  }, [router, allowedRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Vérification...</div>
      </div>
    );
  }

  return <>{children}</>;
}