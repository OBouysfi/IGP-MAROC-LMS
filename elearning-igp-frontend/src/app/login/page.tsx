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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
        role: formData.role as 'student' | 'professor',
      });

      if (response.requires_2fa) {
        router.push(`${ROUTES.VERIFY_2FA}?email=${encodeURIComponent(formData.email)}`);
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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Bienvenue sur LMS
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Accédez à votre plateforme d'apprentissage IGP
          </p>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LogIn size={18} />
              Connexion
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'signup'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus size={18} />
              Inscription
            </button>
          </div>

          {/* Login Form */}
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
                ]}
              />

              <Button type="submit" isLoading={isLoading}>
                Se connecter
              </Button>

              <div className="text-center">
                <Link href={ROUTES.FORGOT_PASSWORD} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          )}

          {/* Register Form */}
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