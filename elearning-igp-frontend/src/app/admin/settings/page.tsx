// src/app/admin/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { Settings, Users, Shield, Key, Mail, Lock, Save, Plus, SquarePen, Trash2, Eye, X, Check, Building, Globe } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  last_login: string;
  is_active: boolean;
  created_at: string;
}

interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  users_count: number;
  permissions: string[];
}

interface Permission {
  id: number;
  name: string;
  slug: string;
  module: string;
  description: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'admins' | 'roles' | 'permissions' | 'email' | 'security'>('general');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    school_name: 'IGP Maroc',
    school_email: 'contact@igp.edu',
    school_phone: '+212 5 22 12 34 56',
    school_address: '123 Boulevard Mohammed V, Casablanca',
    academic_year: '2024-2025',
    website: 'https://www.igp.edu',
    timezone: 'Africa/Casablanca',
    language: 'fr',
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: 'noreply@igp.edu',
    smtp_password: '••••••••••••',
    from_name: 'IGP Maroc',
    from_email: 'noreply@igp.edu',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    enable_2fa: true,
    session_timeout: 30,
    max_login_attempts: 5,
    password_min_length: 8,
    require_uppercase: true,
    require_numbers: true,
    require_special: true,
  });

  const admins: Admin[] = [
    { id: 1, name: 'Super Admin', email: 'admin@igp.edu', role: 'Super Admin', last_login: '2024-11-15 10:30', is_active: true, created_at: '2024-01-01' },
    { id: 2, name: 'Mohammed Alami', email: 'm.alami@igp.edu', role: 'Admin', last_login: '2024-11-14 16:45', is_active: true, created_at: '2024-03-15' },
    { id: 3, name: 'Fatima Bennis', email: 'f.bennis@igp.edu', role: 'Admin', last_login: '2024-11-10 09:00', is_active: false, created_at: '2024-06-01' },
  ];

  const roles: Role[] = [
    {
      id: 1,
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Accès complet à toutes les fonctionnalités',
      users_count: 1,
      permissions: ['all'],
    },
    {
      id: 2,
      name: 'Admin',
      slug: 'admin',
      description: 'Gestion des utilisateurs et du contenu',
      users_count: 2,
      permissions: ['users.view', 'users.create', 'users.edit', 'courses.view', 'courses.create', 'courses.edit', 'students.view', 'students.create', 'students.edit'],
    },
    {
      id: 3,
      name: 'Professeur',
      slug: 'professor',
      description: 'Gestion des cours et des notes',
      users_count: 85,
      permissions: ['courses.view', 'courses.edit', 'grades.view', 'grades.create', 'grades.edit', 'students.view'],
    },
    {
      id: 4,
      name: 'Étudiant',
      slug: 'student',
      description: 'Accès aux cours et aux ressources',
      users_count: 1250,
      permissions: ['courses.view', 'grades.view', 'documents.view', 'documents.upload'],
    },
  ];

  const permissionModules = [
    {
      module: 'Utilisateurs',
      permissions: [
        { id: 1, name: 'Voir les utilisateurs', slug: 'users.view', module: 'users', description: 'Consulter la liste des utilisateurs' },
        { id: 2, name: 'Créer un utilisateur', slug: 'users.create', module: 'users', description: 'Ajouter un nouvel utilisateur' },
        { id: 3, name: 'Modifier un utilisateur', slug: 'users.edit', module: 'users', description: 'Éditer les informations utilisateur' },
        { id: 4, name: 'Supprimer un utilisateur', slug: 'users.delete', module: 'users', description: 'Supprimer un utilisateur' },
      ],
    },
    {
      module: 'Cours',
      permissions: [
        { id: 5, name: 'Voir les cours', slug: 'courses.view', module: 'courses', description: 'Consulter les cours' },
        { id: 6, name: 'Créer un cours', slug: 'courses.create', module: 'courses', description: 'Ajouter un nouveau cours' },
        { id: 7, name: 'Modifier un cours', slug: 'courses.edit', module: 'courses', description: 'Éditer un cours' },
        { id: 8, name: 'Supprimer un cours', slug: 'courses.delete', module: 'courses', description: 'Supprimer un cours' },
      ],
    },
    {
      module: 'Étudiants',
      permissions: [
        { id: 9, name: 'Voir les étudiants', slug: 'students.view', module: 'students', description: 'Consulter les étudiants' },
        { id: 10, name: 'Créer un étudiant', slug: 'students.create', module: 'students', description: 'Inscrire un étudiant' },
        { id: 11, name: 'Modifier un étudiant', slug: 'students.edit', module: 'students', description: 'Éditer un étudiant' },
        { id: 12, name: 'Supprimer un étudiant', slug: 'students.delete', module: 'students', description: 'Supprimer un étudiant' },
      ],
    },
    {
      module: 'Notes',
      permissions: [
        { id: 13, name: 'Voir les notes', slug: 'grades.view', module: 'grades', description: 'Consulter les notes' },
        { id: 14, name: 'Saisir les notes', slug: 'grades.create', module: 'grades', description: 'Ajouter des notes' },
        { id: 15, name: 'Modifier les notes', slug: 'grades.edit', module: 'grades', description: 'Éditer les notes' },
        { id: 16, name: 'Valider les notes', slug: 'grades.validate', module: 'grades', description: 'Valider les notes saisies' },
      ],
    },
    {
      module: 'Documents',
      permissions: [
        { id: 17, name: 'Voir les documents', slug: 'documents.view', module: 'documents', description: 'Consulter les documents' },
        { id: 18, name: 'Uploader des documents', slug: 'documents.upload', module: 'documents', description: 'Ajouter des documents' },
        { id: 19, name: 'Valider les documents', slug: 'documents.validate', module: 'documents', description: 'Valider les documents' },
        { id: 20, name: 'Supprimer des documents', slug: 'documents.delete', module: 'documents', description: 'Supprimer des documents' },
      ],
    },
  ];

  const tabs = [
    { id: 'general', name: 'Général', icon: Building },
    { id: 'admins', name: 'Administrateurs', icon: Users },
    { id: 'roles', name: 'Rôles', icon: Shield },
    { id: 'permissions', name: 'Permissions', icon: Key },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Sécurité', icon: Lock },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Paramètres</h1>
          <p className="text-gray-500">Configurez les paramètres système et gérez les accès.</p>
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
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Informations Générales</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nom de l'établissement</label>
                    <input
                      type="text"
                      value={generalSettings.school_name}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, school_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Année Académique</label>
                    <input
                      type="text"
                      value={generalSettings.academic_year}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, academic_year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={generalSettings.school_email}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, school_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={generalSettings.school_phone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, school_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={generalSettings.school_address}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, school_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Site Web</label>
                    <input
                      type="url"
                      value={generalSettings.website}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Fuseau Horaire</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
                      <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Langue</label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#0D529C] transition-colors cursor-pointer">
                      <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Cliquez pour changer le logo</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admins Tab */}
            {activeTab === 'admins' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Administrateurs</h3>
                  <button
                    onClick={() => setShowAddAdmin(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter Admin
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rôle</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dernière Connexion</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900 text-sm">{admin.name}</td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{admin.email}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              admin.role === 'Super Admin' ? 'bg-purple-500 text-white' : 'bg-[#0D529C] text-white'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{admin.last_login}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              admin.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                            }`}>
                              {admin.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Rôles & Permissions</h3>
                  <button
                    onClick={() => setShowAddRole(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Créer Rôle
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roles.map((role) => (
                    <div key={role.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900">{role.name}</h4>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white">
                          {role.users_count} utilisateurs
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Permissions ({role.permissions.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 5).map((perm) => (
                            <span key={perm} className="inline-flex px-2 py-1 text-xs bg-white border border-gray-200 rounded">
                              {perm}
                            </span>
                          ))}
                          {role.permissions.length > 5 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-200 rounded">
                              +{role.permissions.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelectedRole(role)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                          <SquarePen className="w-4 h-4" />
                        </button>
                        {role.slug !== 'super_admin' && (
                          <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Toutes les Permissions</h3>
                </div>

                {permissionModules.map((module) => (
                  <div key={module.module} className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-[#0D529C] mb-4">{module.module}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.permissions.map((permission) => (
                        <div key={permission.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                              <span className="inline-flex px-2 py-0.5 text-xs bg-gray-100 rounded mt-1">
                                {permission.slug}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-[#257035] rounded-full"></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Configuration Email (SMTP)</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Serveur SMTP</label>
                    <input
                      type="text"
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Port SMTP</label>
                    <input
                      type="text"
                      value={emailSettings.smtp_port}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Utilisateur SMTP</label>
                    <input
                      type="text"
                      value={emailSettings.smtp_user}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_user: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe SMTP</label>
                    <input
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nom d'expéditeur</label>
                    <input
                      type="text"
                      value={emailSettings.from_name}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email d'expéditeur</label>
                    <input
                      type="email"
                      value={emailSettings.from_email}
                      onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Mail className="w-4 h-4" />
                    Tester la Configuration
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Paramètres de Sécurité</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Authentification</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Activer 2FA</p>
                          <p className="text-xs text-gray-500">Authentification à deux facteurs par email</p>
                        </div>
                        <button
                          onClick={() => setSecuritySettings({ ...securitySettings, enable_2fa: !securitySettings.enable_2fa })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            securitySettings.enable_2fa ? 'bg-[#257035]' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            securitySettings.enable_2fa ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Timeout Session (minutes)</label>
                        <input
                          type="number"
                          value={securitySettings.session_timeout}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, session_timeout: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Tentatives max de connexion</label>
                        <input
                          type="number"
                          value={securitySettings.max_login_attempts}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, max_login_attempts: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Politique de Mot de Passe</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Longueur minimale</label>
                        <input
                          type="number"
                          value={securitySettings.password_min_length}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">Exiger majuscules</p>
                        <button
                          onClick={() => setSecuritySettings({ ...securitySettings, require_uppercase: !securitySettings.require_uppercase })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            securitySettings.require_uppercase ? 'bg-[#257035]' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            securitySettings.require_uppercase ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">Exiger chiffres</p>
                        <button
                          onClick={() => setSecuritySettings({ ...securitySettings, require_numbers: !securitySettings.require_numbers })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            securitySettings.require_numbers ? 'bg-[#257035]' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            securitySettings.require_numbers ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">Exiger caractères spéciaux</p>
                        <button
                          onClick={() => setSecuritySettings({ ...securitySettings, require_special: !securitySettings.require_special })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            securitySettings.require_special ? 'bg-[#257035]' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            securitySettings.require_special ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Ajouter un Administrateur</h2>
                <button onClick={() => setShowAddAdmin(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nom complet</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={() => setShowAddAdmin(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button className="px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Detail Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedRole.name}</h2>
                <p className="text-blue-200">{selectedRole.description}</p>
              </div>
              <button onClick={() => setSelectedRole(null)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-[#0D529C] mb-4">Permissions Assignées</h3>
              <div className="space-y-4">
                {permissionModules.map((module) => (
                  <div key={module.module} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{module.module}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {module.permissions.map((perm) => (
                        <div key={perm.id} className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${
                            selectedRole.permissions.includes(perm.slug) || selectedRole.permissions.includes('all')
                              ? 'bg-[#257035] text-white'
                              : 'bg-gray-200'
                          }`}>
                            {(selectedRole.permissions.includes(perm.slug) || selectedRole.permissions.includes('all')) && (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700">{perm.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}