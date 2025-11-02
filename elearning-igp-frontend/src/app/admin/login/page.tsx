'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth';
import { ROUTES } from '@/lib/constants/routes';

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

      if (response.requires_2fa) {
        router.push(`${ROUTES.VERIFY_2FA}?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
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
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Bienvenue sur LMS
          </h1>
          <p className="text-sm text-center text-gray-500 mb-2">
            Espace Administration
          </p>
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

            <Button type="submit" isLoading={isLoading}>
              Se connecter
            </Button>

            <div className="text-center">
              
                <a href={ROUTES.FORGOT_PASSWORD} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
  Mot de passe oublié ?
</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}