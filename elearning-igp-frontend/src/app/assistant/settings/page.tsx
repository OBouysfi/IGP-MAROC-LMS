// src/app/assistant/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { User, Lock, Bell, Save, Eye, EyeOff, Camera } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';

export default function AssistantSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    first_name: 'Sara',
    last_name: 'El Amrani',
    email: 'sara.elamrani@igp.edu',
    phone: '+212 6 12 34 56 78',
    employee_id: 'ASS-2024-001',
    department: 'Scolarité',
    role: 'Assistante Administrative',
  });

  const [security, setSecurity] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [notifications, setNotifications] = useState({
    email_new_justification: true,
    email_high_absence: true,
    email_daily_report: false,
    push_new_justification: true,
    push_urgent_alerts: true,
  });

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
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

  return (
    <AssistantLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Paramètres</h1>
          <p className="text-gray-500">Gérez votre profil et vos préférences.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#C1272D] text-[#C1272D]'
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
                  <h3 className="text-lg font-bold text-[#C1272D]">Informations Personnelles</h3>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#C1272D] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      SE
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

                {/* Employee Info (Read-only) */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-medium text-[#C1272D] mb-3">Informations Professionnelles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Matricule</p>
                      <p className="font-medium text-gray-900">{profile.employee_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Département</p>
                      <p className="font-medium text-gray-900">{profile.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rôle</p>
                      <p className="font-medium text-gray-900">{profile.role}</p>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
                    <input
                      type="text"
                      value={profile.last_name}
                      onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#C1272D]">Sécurité du Compte</h3>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent pr-10"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent pr-10"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent pr-10"
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
                      className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Modifier le Mot de Passe
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#C1272D]">Préférences de Notifications</h3>
                  <button
                    onClick={handleSaveNotifications}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Notifications par Email</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouveau justificatif</p>
                        <p className="text-xs text-gray-500">Recevoir un email lors d'une nouvelle soumission</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_new_justification: !notifications.email_new_justification })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_new_justification ? 'bg-[#C1272D]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_new_justification ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Alerte absence élevée</p>
                        <p className="text-xs text-gray-500">Alerte quand un étudiant dépasse le seuil</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_high_absence: !notifications.email_high_absence })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_high_absence ? 'bg-[#C1272D]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_high_absence ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Rapport journalier</p>
                        <p className="text-xs text-gray-500">Résumé quotidien des absences</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, email_daily_report: !notifications.email_daily_report })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.email_daily_report ? 'bg-[#C1272D]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.email_daily_report ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Notifications Push</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Nouveau justificatif</p>
                        <p className="text-xs text-gray-500">Notification instantanée</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_new_justification: !notifications.push_new_justification })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_new_justification ? 'bg-[#C1272D]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_new_justification ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Alertes urgentes</p>
                        <p className="text-xs text-gray-500">Notifications importantes</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, push_urgent_alerts: !notifications.push_urgent_alerts })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications.push_urgent_alerts ? 'bg-[#C1272D]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          notifications.push_urgent_alerts ? 'translate-x-6' : 'translate-x-0.5'
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
    </AssistantLayout>
  );
}