'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Globe, Camera, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { studentSettingsApi, ProfileData, NotificationSettings, Preferences } from '@/lib/api/student/settings';
import Swal from 'sweetalert2';

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [loading, setLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    group: '',
    student_id: '',
    bio: '',
    linkedin: '',
    github: '',
  });

  const [security, setSecurity] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    two_factor_enabled: false,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_new_grade: true,
    email_new_resource: true,
    email_session_reminder: true,
    email_deadline_reminder: true,
    push_new_grade: true,
    push_session_start: true,
    push_new_document: true,
    push_announcements: true,
  });

  const [preferences, setPreferences] = useState<Preferences>({
    language: 'fr',
    timezone: 'Africa/Casablanca',
    date_format: 'DD/MM/YYYY',
    theme: 'light',
    email_frequency: 'immediate',
  });

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
    fetchPreferences();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentSettingsApi.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await studentSettingsApi.getNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await studentSettingsApi.getPreferences();
      setPreferences(response.data.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await studentSettingsApi.uploadAvatar(file);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Photo de profil mise à jour',
          confirmButtonColor: '#257035',
          timer: 2000,
        });
        fetchProfile();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.response?.data?.message || 'Erreur lors de l\'upload',
          confirmButtonColor: '#257035',
        });
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      await studentSettingsApi.updateProfile(profile);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Profil mis à jour avec succès',
        confirmButtonColor: '#257035',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la mise à jour',
        confirmButtonColor: '#257035',
      });
    }
  };

  const handleChangePassword = async () => {
    if (security.new_password !== security.confirm_password) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas',
        confirmButtonColor: '#257035',
      });
      return;
    }
    if (security.new_password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le mot de passe doit contenir au moins 8 caractères',
        confirmButtonColor: '#257035',
      });
      return;
    }

    try {
      await studentSettingsApi.changePassword({
        current_password: security.current_password,
        new_password: security.new_password,
        new_password_confirmation: security.confirm_password,
      });
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Mot de passe modifié avec succès',
        confirmButtonColor: '#257035',
        timer: 2000,
      });
      setSecurity({ ...security, current_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors du changement de mot de passe',
        confirmButtonColor: '#257035',
      });
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await studentSettingsApi.updateNotifications(notifications);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Préférences de notifications sauvegardées',
        confirmButtonColor: '#257035',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la sauvegarde',
        confirmButtonColor: '#257035',
      });
    }
  };

  const handleSavePreferences = async () => {
    try {
      await studentSettingsApi.updatePreferences(preferences);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Préférences sauvegardées',
        confirmButtonColor: '#257035',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la sauvegarde',
        confirmButtonColor: '#257035',
      });
    }
  };

  const handleToggle2FA = async () => {
    try {
      await studentSettingsApi.toggle2FA();
      setSecurity({ ...security, two_factor_enabled: !security.two_factor_enabled });
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: security.two_factor_enabled ? '2FA désactivée' : '2FA activée',
        confirmButtonColor: '#257035',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur',
        confirmButtonColor: '#257035',
      });
    }
  };

  const getInitials = () => {
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Préférences', icon: Globe },
  ];

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#257035]" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Paramètres</h1>
          <p className="text-gray-500">Gérez votre profil et vos préférences.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#257035] text-[#257035]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#257035]">Informations Personnelles</h3>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 bg-[#257035] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {getInitials()}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#0D529C] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                      <Camera className="w-4 h-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Photo de Profil</h4>
                    <p className="text-sm text-gray-500">JPG, PNG ou GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-[#257035] mb-3">Informations Académiques</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Matricule</p>
                      <p className="font-medium text-gray-900">{profile.student_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Groupe</p>
                      <p className="font-medium text-gray-900">{profile.group}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Académique</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date de Naissance</label>
                    <input
                      type="date"
                      value={profile.date_of_birth}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Parlez-nous de vous..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">LinkedIn (optionnel)</label>
                    <input
                      type="url"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">GitHub (optionnel)</label>
                    <input
                      type="url"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#257035]">Sécurité du Compte</h3>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Changer le Mot de Passe</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe actuel</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={security.current_password}
                          onChange={(e) => setSecurity({ ...security, current_password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nouveau mot de passe</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={security.new_password}
                          onChange={(e) => setSecurity({ ...security, new_password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Confirmer le mot de passe</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={security.confirm_password}
                          onChange={(e) => setSecurity({ ...security, confirm_password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Modifier le Mot de Passe
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Authentification à Deux Facteurs</h4>
                      <p className="text-sm text-gray-500">Sécurisez davantage votre compte</p>
                    </div>
                    <button
                      onClick={handleToggle2FA}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        security.two_factor_enabled ? 'bg-[#257035]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        security.two_factor_enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  {security.two_factor_enabled && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">✓ L'authentification à deux facteurs est activée</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#257035]">Préférences de Notifications</h3>
                  <button
                    onClick={handleSaveNotifications}
                    className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Notifications par Email</h4>
                  <div className="space-y-4">
                    {[
                      { key: 'email_new_grade', label: 'Nouvelle note disponible', desc: 'Recevoir un email quand une note est publiée' },
                      { key: 'email_new_resource', label: 'Nouvelle ressource', desc: 'Recevoir un email quand un document est ajouté' },
                      { key: 'email_session_reminder', label: 'Rappel de session live', desc: 'Recevoir un rappel avant les sessions' },
                      { key: 'email_deadline_reminder', label: 'Rappel de deadlines', desc: 'Recevoir un rappel avant les dates limites' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof NotificationSettings] })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key as keyof NotificationSettings] ? 'bg-[#257035]' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Notifications Push</h4>
                  <div className="space-y-4">
                    {[
                      { key: 'push_new_grade', label: 'Nouvelle note', desc: 'Notification immédiate' },
                      { key: 'push_session_start', label: 'Début de session', desc: '10 min avant le début' },
                      { key: 'push_new_document', label: 'Nouveau document', desc: 'Notification instantanée' },
                      { key: 'push_announcements', label: 'Annonces importantes', desc: 'Communications de l\'administration' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof NotificationSettings] })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key as keyof NotificationSettings] ? 'bg-[#257035]' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#257035]">Préférences Générales</h3>
                  <button
                    onClick={handleSavePreferences}
                    className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Langue</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Fuseau Horaire</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    >
                      <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
                      <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Format de Date</label>
                    <select
                      value={preferences.date_format}
                      onChange={(e) => setPreferences({ ...preferences, date_format: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Thème</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Fréquence des Emails</h4>
                  <div>
                    <select
                      value={preferences.email_frequency}
                      onChange={(e) => setPreferences({ ...preferences, email_frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                    >
                      <option value="immediate">Immédiat</option>
                      <option value="daily">Résumé quotidien</option>
                      <option value="weekly">Résumé hebdomadaire</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Choisissez à quelle fréquence vous souhaitez recevoir les emails récapitulatifs.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}