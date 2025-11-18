'use client';

import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Camera,
  Save,
  Eye,
  EyeOff,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { adminProfileApi } from '@/lib/api/admin/profile';

export default function AdminProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar: null as string | null,
    two_factor_enabled: false,
    email_verified_at: null as string | null,
    created_at: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await adminProfileApi.getProfile();
      setProfileData(response.data);
    } catch (error: any) {
      console.error('Error response:', error.response?.data);
      setMessage({ type: 'error', text: 'Erreur lors du chargement du profil' });
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setMessage(null);
      try {
        const response = await adminProfileApi.updateAvatar(file);
        setProfileData(prev => ({ ...prev, avatar: response.data.avatar }));
        setMessage({ type: 'success', text: 'Photo de profil mise à jour' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Erreur lors du téléchargement de l\'image' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await adminProfileApi.updateProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone || ''
      });
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setIsLoading(false);
      return;
    }

    try {
      await adminProfileApi.updatePassword(passwordData);
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const toggle2FA = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await adminProfileApi.toggle2FA();
      setProfileData(prev => ({ ...prev, two_factor_enabled: response.data.two_factor_enabled }));
      setMessage({ type: 'success', text: response.message });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification 2FA' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D529C]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et sécurité</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h2>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-[#0D529C] flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {profileData.first_name?.[0]}{profileData.last_name?.[0]}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAvatarClick}
                    disabled={isLoading}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-[#0D529C] rounded-full flex items-center justify-center text-white hover:bg-[#094a87] transition-colors shadow-lg disabled:opacity-50"
                  >
                    <Camera size={18} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-gray-900">
                    {profileData.first_name} {profileData.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">Super Administrateur</p>
                </div>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Membre depuis {new Date(profileData.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {profileData.email_verified_at ? (
                      <>
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-green-600">Email vérifié</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-orange-500" />
                        <span className="text-orange-600">Email non vérifié</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield size={16} className={profileData.two_factor_enabled ? 'text-green-500' : 'text-gray-400'} />
                    <span className={profileData.two_factor_enabled ? 'text-green-600' : 'text-gray-500'}>
                      2FA {profileData.two_factor_enabled ? 'activé' : 'désactivé'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info & Security */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={profileData.phone || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0D529C] text-white rounded-lg hover:bg-[#094a87] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h2>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0D529C] text-white rounded-lg hover:bg-[#094a87] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                    Changer le mot de passe
                  </button>
                </div>
              </form>
            </div>

            {/* 2FA Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentification à deux facteurs (2FA)</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">
                    {profileData.two_factor_enabled 
                      ? 'La 2FA est actuellement activée sur votre compte'
                      : 'Activez la 2FA pour sécuriser votre compte'
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Un code sera envoyé à votre email lors de chaque connexion
                  </p>
                </div>
                <button
                  onClick={toggle2FA}
                  disabled={isLoading}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    profileData.two_factor_enabled
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    profileData.two_factor_enabled ? 'Désactiver' : 'Activer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}