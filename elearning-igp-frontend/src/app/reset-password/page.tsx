'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth';
import Swal from 'sweetalert2';
import { ROUTES } from '@/lib/constants/routes';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (!tokenParam || !emailParam) {
      Swal.fire({
        icon: 'error',
        title: 'Lien invalide',
        text: 'Le lien de réinitialisation est invalide ou a expiré',
        confirmButtonColor: '#C1272D',
      }).then(() => {
        router.push(ROUTES.FORGOT_PASSWORD);
      });
      return;
    }
    
    setToken(tokenParam);
    setEmail(decodeURIComponent(emailParam));
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le mot de passe doit contenir au moins 8 caractères',
        confirmButtonColor: '#C1272D',
      });
      return;
    }

    if (password !== passwordConfirmation) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas',
        confirmButtonColor: '#C1272D',
      });
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({
        email,
        password,
        password_confirmation: passwordConfirmation,
        token,
      });

      await Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Votre mot de passe a été réinitialisé avec succès',
        confirmButtonColor: '#257035',
      });

      router.push(ROUTES.LOGIN);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Une erreur est survenue',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#C1272D]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600">
              Créez un nouveau mot de passe sécurisé
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              icon={<Mail size={20} />}
              value={email}
              disabled
              className="bg-gray-50"
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Nouveau mot de passe"
                placeholder="Min. 8 caractères"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showPasswordConfirmation ? 'text' : 'password'}
                label="Confirmer le mot de passe"
                placeholder="Retapez votre mot de passe"
                icon={<Lock size={20} />}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Conseils:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Au moins 8 caractères</li>
                <li>Mélangez lettres et chiffres</li>
                <li>Ajoutez des caractères spéciaux</li>
              </ul>
            </div>

            <Button type="submit" isLoading={isLoading} className="bg-[#C1272D] hover:bg-[#8B1B1F]">
              Réinitialiser le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}