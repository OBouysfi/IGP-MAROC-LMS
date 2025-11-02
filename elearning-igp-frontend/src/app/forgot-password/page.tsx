// src/app/forgot-password/page.tsx
'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // TODO: Implement forgot password API call

    setTimeout(() => {
      setMessage('Un lien de réinitialisation a été envoyé à votre email');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Link
            href={ROUTES.LOGIN}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </Link>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Mot de passe oublié ?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="votre.email@igp.edu"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" isLoading={isLoading}>
              Envoyer le lien
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}