'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants/routes';

function VerifyTwoFactorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const { login } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push(ROUTES.LOGIN);
    }
  }, [email, router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = pastedData.split('');
    
    if (newCode.every((char) => /^\d$/.test(char))) {
      setCode([...newCode, ...Array(6 - newCode.length).fill('')]);
      inputRefs.current[Math.min(newCode.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const codeString = code.join('');
    
    if (codeString.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.verifyTwoFactor({
        email,
        code: codeString,
      });

      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        
        // Redirect based on role
        const userRole = response.user.roles[0]?.slug;
        if (userRole === 'admin') {
          router.push(ROUTES.ADMIN_DASHBOARD);
        } else if (userRole === 'professor') {
          router.push(ROUTES.PROFESSOR_DASHBOARD);
        } else {
          router.push(ROUTES.STUDENT_DASHBOARD);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code invalide');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      await authApi.resendTwoFactor(email);
      setTimer(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Back Button */}
          <button
            onClick={() => router.push(ROUTES.LOGIN)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Vérification 2FA
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Entrez le code à 6 chiffres envoyé à<br />
            <span className="font-medium text-gray-800">{email}</span>
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 animate-shake">
              {error}
            </div>
          )}

          {/* Code Inputs */}
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Vous pouvez renvoyer le code dans{' '}
                <span className="font-bold text-blue-600">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isResending ? 'animate-spin' : ''} />
                Renvoyer le code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            isLoading={isLoading}
            disabled={code.join('').length !== 6}
          >
            Vérifier le code
          </Button>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Vous n'avez pas reçu le code ? Vérifiez vos spams ou{' '}
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              renvoyez-le
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyTwoFactorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    }>
      <VerifyTwoFactorContent />
    </Suspense>
  );
}