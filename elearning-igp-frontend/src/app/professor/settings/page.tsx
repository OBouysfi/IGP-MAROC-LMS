// src/app/professor/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { User, Lock, Bell, Mail, Globe, Camera, Save, Eye, EyeOff } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';

export default function ProfessorSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    first_name: 'Karim',
    last_name: 'Benjelloun',
    email: 'k.benjelloun@igp.edu',
    phone: '+212 6 12 34 56 78',
    department: 'Développement',
    specialization: 'Développement Web & Mobile',
    bio: 'Professeur spécialisé en développement web moderne avec plus de 10 ans d\'expérience. Expert React.js, Node.js et architectures cloud.',
    linkedin: 'https://linkedin.com/in/karimbenjelloun',
    github: 'https://github.com/kbenjelloun',
  });

  const [security, setSecurity] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    two_factor_enabled: false,
    session_timeout: 30,
  });

  const [notifications, setNotifications] = useState({
    email_new_student: true,
    email_grade_reminder: true,
    email_session_reminder: true,
    email_document_download: false,
    push_new_message: true,
    push_session_start: true,
    push_grade_deadline: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    timezone: 'Africa/Casablanca',
    date_format: 'DD/MM/YYYY',
    theme: 'light',
    default_session_duration: 60,
    auto_share_documents: true,
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
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Paramètres</h1>
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
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#0D529C] text-[#0D529C]'
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
                  <h3 className="text-lg font-bold text-[#0D529C]">Informations Personnelles</h3>
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
                    <div className="w-24 h-24 bg-[#0D529C] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      KB
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#257035] text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Photo de Profil</h4>
                    <p className="text-sm text-gray-500">JPG, PNG ou GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={profile.first_name}
                      onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Département</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent bg-gray-50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Spécialisation</label>
                    <input
                      type="text"
                      value={profile.specialization}
                      onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Biographie</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Décrivez votre parcours et vos domaines d'expertise..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">GitHub</label>
                    <input
                      type="url"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Sécurité du Compte</h3>
                </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent pr-10"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Confirmer le mot de passe</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={security.confirm_password}
                          onChange={(e) => setSecurity({ ...security, confirm_password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent pr-10"
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
                      className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Modifier le Mot de Passe
                    </button>
                  </div>
                </div>

                {/* Two Factor Authentication */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Authentification à Deux Facteurs</h4>
                      <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire</p>
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

                {/* Session Timeout */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Expiration de Session</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Déconnexion automatique après (minutes)</label>
                    <select
                      value={security.session_timeout}
                      onChange={(e) => setSecurity({ ...security, session_timeout: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 heure</option>
                      <option value={120}>2 heures</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Préférences de Notifications</h3>
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
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-[#0D529C]" />
                    <h4 className="font-bold text-gray-900">Notifications par Email</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouvel étudiant inscrit</p>
                        <p className="text-xs text-gray-500">Recevoir un email quand un étudiant s'inscrit à votre cours</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_new_student: !notifications.email_new_student })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_new_student ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_new_student ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Rappel de saisie des notes</p>
                        <p className="text-xs text-gray-500">Recevoir un rappel avant la deadline de saisie</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_grade_reminder: !notifications.email_grade_reminder })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_grade_reminder ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_grade_reminder ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Rappel de session live</p>
                        <p className="text-xs text-gray-500">Recevoir un rappel avant vos sessions planifiées</p>
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
                        <p className="font-medium text-gray-700">Téléchargement de documents</p>
                        <p className="text-xs text-gray-500">Recevoir un email quand un étudiant télécharge vos ressources</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_document_download: !notifications.email_document_download })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_document_download ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_document_download ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-[#0D529C]" />
                    <h4 className="font-bold text-gray-900">Notifications Push</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouveau message</p>
                        <p className="text-xs text-gray-500">Notification pour les nouveaux messages</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_new_message: !notifications.push_new_message })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_new_message ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_new_message ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Début de session</p>
                        <p className="text-xs text-gray-500">Notification 10 min avant le début d'une session</p>
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
                        <p className="font-medium text-gray-700">Deadline de notes</p>
                        <p className="text-xs text-gray-500">Notification pour les deadlines approchantes</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_grade_deadline: !notifications.push_grade_deadline })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_grade_deadline ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_grade_deadline ? 'translate-x-6' : 'translate-x-0.5'
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
                  <h3 className="text-lg font-bold text-[#0D529C]">Préférences Générales</h3>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Préférences de Cours</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Durée par défaut des sessions (minutes)</label>
                      <select
                        value={preferences.default_session_duration}
                        onChange={(e) => setPreferences({ ...preferences, default_session_duration: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 heure</option>
                        <option value={90}>1h30</option>
                        <option value={120}>2 heures</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Partager automatiquement les documents</p>
                        <p className="text-xs text-gray-500">Les nouveaux documents seront partagés par défaut avec les étudiants</p>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, auto_share_documents: !preferences.auto_share_documents })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          preferences.auto_share_documents ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          preferences.auto_share_documents ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfessorLayout>
  );
}