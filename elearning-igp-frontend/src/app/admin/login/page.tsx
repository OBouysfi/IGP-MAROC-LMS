'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth';
import { ROUTES } from '@/lib/constants/routes';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // Vérifier si l'utilisateur est un admin
      if (response.user && response.user.role !== 'admin' && response.user.role !== 'super-admin') {
        setError('Accès refusé. Cet espace est réservé aux administrateurs.');
        setIsLoading(false);
        return;
      }

      // Si 2FA est requis, rediriger vers la page de vérification
      if (response.requires_2fa) {
        router.push(`${ROUTES.VERIFY_2FA}?email=${encodeURIComponent(formData.email)}&redirect=admin`);
      } else {
        // Si 2FA désactivé, connexion directe
        localStorage.setItem('auth_token', response.token || '');
        localStorage.setItem('user', JSON.stringify(response.user));
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      
      // Messages d'erreur personnalisés
      if (errorMessage.includes('incorrect') || errorMessage.includes('invalide')) {
        setError('Email ou mot de passe incorrect.');
      } else if (errorMessage.includes('désactivé')) {
        setError('Votre compte est désactivé. Contactez un administrateur.');
      } else if (errorMessage.includes('verrouillé')) {
        setError('Votre compte est verrouillé. Contactez un administrateur.');
      } else {
        setError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
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

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Espace Administration
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Accédez à votre plateforme d'administration IGP
          </p>

          {/* Login Form */}
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
              placeholder="admin@igp.edu"
              icon={<Mail size={20} />}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="text-center">
              <a 
                href={ROUTES.FORGOT_PASSWORD} 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </form>

          {/* Footer - Autres espaces */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-3">
              Vous n'êtes pas administrateur ?
            </p>
            <div className="flex justify-center gap-2 text-sm">
              <a 
                href={ROUTES.PROFESSOR_LOGIN || '/login'} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Espace Professeur
              </a>
              <span className="text-gray-400">|</span>
              <a 
                href={ROUTES.LOGIN} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Espace Étudiant
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}