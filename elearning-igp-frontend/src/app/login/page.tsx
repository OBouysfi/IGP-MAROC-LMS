// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth';
import { ROUTES } from '@/lib/constants/routes';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });

  // src/app/login/page.tsx - Modifier handleLogin

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await authApi.login({
      email: formData.email,
      password: formData.password,
      role: formData.role as 'student' | 'professor' | 'assistant',
    });

    // ========== SI 2FA EST REQUIS ==========
    if (response.requires_2fa) {
      router.push(`${ROUTES.VERIFY_2FA}?email=${encodeURIComponent(formData.email)}`);
      return;
    }

    // ========== SI PAS DE 2FA → CONNEXION DIRECTE ==========
    // Stocker le token et les infos user
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    // Rediriger selon le rôle
    const role = response.user.role;
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'professor') {
      router.push('/professor/dashboard');
    } else if (role === 'student') {
      router.push('/student/dashboard');
    } else if (role === 'assistant') {
      router.push('/assistant/dashboard');
    } else {
      // Fallback
      router.push('/dashboard');
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erreur de connexion');
  } finally {
    setIsLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
  <div 
    className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
    style={{ backgroundImage: "url('/images/login-hero.jpg')" }}
    >    

   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-blue-700/60 to-blue-800/60"></div>
    <div className="relative z-10 w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 relative">
            <Image 
              src="/images/logo_igp.png"
              alt="IGP Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Bienvenue sur LMS
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Accédez à votre plateforme d'apprentissage IGP
        </p>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="votre.email@igp.edu"
              icon={<Mail size={20} />}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              label="Mot de passe"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Select
              name="role"
              label="Sélectionner le rôle"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'student', label: 'Étudiant' },
                { value: 'professor', label: 'Professeur' },
                { value: 'assistant', label: 'Assistant' },
              ]}
            />

            <Button 
              type="submit" 
              isLoading={isLoading}
              className="bg-gradient-to-r from-[#1e5ba8] to-[#3d7fc4] hover:from-red-600 hover:to-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300"
            >
              Se connecter
            </Button>

            <div className="text-center">
              <Link href={ROUTES.FORGOT_PASSWORD} className="text-blue-600 hover:text-red-600 text-sm font-medium transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
          </form>
        )}

        {activeTab === 'signup' && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              L'inscription sera bientôt disponible
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.REGISTER)}
            >
              En savoir plus
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}