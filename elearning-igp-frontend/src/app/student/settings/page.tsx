// src/app/student/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { User, Lock, Bell, Globe, Camera, Save, Eye, EyeOff } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    first_name: 'Ahmed',
    last_name: 'Benali',
    email: 'ahmed.benali@student.igp.edu',
    phone: '+212 6 98 76 54 32',
    date_of_birth: '2000-05-15',
    address: 'Casablanca, Maroc',
    group: 'DEV-M2-A',
    student_id: 'STU-2024-001',
    bio: 'Étudiant passionné par le développement web et les nouvelles technologies.',
    linkedin: '',
    github: 'https://github.com/ahmedbenali',
  });

  const [security, setSecurity] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    two_factor_enabled: false,
  });

  const [notifications, setNotifications] = useState({
    email_new_grade: true,
    email_new_resource: true,
    email_session_reminder: true,
    email_deadline_reminder: true,
    push_new_grade: true,
    push_session_start: true,
    push_new_document: true,
    push_announcements: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Africa/Casablanca',
    date_format: 'DD/MM/YYYY',
    theme: 'light',
    email_frequency: 'immediate',
  });

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Préférences', icon: Globe },
  ];

  const handleSaveProfile = () => {
    alert('Profil mis à jour avec succès!');
  };

  const handleChangePassword = () => {
    if (security.new_password !== security.confirm_password) {
      alert('Les mots de passe ne correspondent pas!');
      return;
    }
    if (security.new_password.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères!');
      return;
    }
    alert('Mot de passe modifié avec succès!');
    setSecurity({ ...security, current_password: '', new_password: '', confirm_password: '' });
  };

  const handleSaveNotifications = () => {
    alert('Préférences de notifications sauvegardées!');
  };

  const handleSavePreferences = () => {
    alert('Préférences sauvegardées!');
  };

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Paramètres</h1>
          <p className="text-gray-500">Gérez votre profil et vos préférences.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
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
            {/* Profile Tab */}
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

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#257035] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      AB
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0D529C] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Photo de Profil</h4>
                    <p className="text-sm text-gray-500">JPG, PNG ou GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Student Info (Read-only) */}
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

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#257035]">Sécurité du Compte</h3>

                {/* Change Password */}
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

                {/* Two Factor */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Authentification à Deux Facteurs</h4>
                      <p className="text-sm text-gray-500">Sécurisez davantage votre compte</p>
                    </div>
                    <button
                      onClick={() => setSecurity({ ...security, two_factor_enabled: !security.two_factor_enabled })}
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

            {/* Notifications Tab */}
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

                {/* Email Notifications */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Notifications par Email</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouvelle note disponible</p>
                        <p className="text-xs text-gray-500">Recevoir un email quand une note est publiée</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_new_grade: !notifications.email_new_grade })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_new_grade ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_new_grade ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouvelle ressource</p>
                        <p className="text-xs text-gray-500">Recevoir un email quand un document est ajouté</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_new_resource: !notifications.email_new_resource })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_new_resource ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_new_resource ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Rappel de session live</p>
                        <p className="text-xs text-gray-500">Recevoir un rappel avant les sessions</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_session_reminder: !notifications.email_session_reminder })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_session_reminder ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_session_reminder ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Rappel de deadlines</p>
                        <p className="text-xs text-gray-500">Recevoir un rappel avant les dates limites</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_deadline_reminder: !notifications.email_deadline_reminder })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_deadline_reminder ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_deadline_reminder ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Notifications Push</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouvelle note</p>
                        <p className="text-xs text-gray-500">Notification immédiate</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_new_grade: !notifications.push_new_grade })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_new_grade ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_new_grade ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Début de session</p>
                        <p className="text-xs text-gray-500">10 min avant le début</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_session_start: !notifications.push_session_start })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_session_start ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_session_start ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouveau document</p>
                        <p className="text-xs text-gray-500">Notification instantanée</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_new_document: !notifications.push_new_document })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_new_document ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_new_document ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Annonces importantes</p>
                        <p className="text-xs text-gray-500">Communications de l'administration</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_announcements: !notifications.push_announcements })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_announcements ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_announcements ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
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