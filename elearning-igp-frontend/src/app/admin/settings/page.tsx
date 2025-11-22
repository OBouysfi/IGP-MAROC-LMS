
'use client';

import { useState, useEffect } from 'react';
import { settingsApi, GeneralSettings, AdminUser, Role, SecuritySettings, Session, LoginLog, LoginAttempt, LockedUser, SessionsStats } from '@/lib/api/admin/settings';
import { Settings, Users, Shield, Lock, Save, Plus, SquarePen, Trash2, X, Building, Globe, Monitor, Smartphone, LogOut, AlertTriangle, CheckCircle, XCircle, Clock, Unlock, Activity } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'admins' | 'roles' | 'security' | 'sessions'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    school_name: '',
    school_email: '',
    school_phone: '',
    school_address: '',
    academic_year: '',
    website: '',
    timezone: 'Africa/Casablanca',
    language: 'fr',
    logo: null,
  });

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enable_2fa: true,
    session_timeout: 30,
    max_login_attempts: 5,
    password_min_length: 8,
    require_uppercase: true,
    require_numbers: true,
    require_special: true,
  });

  // Sessions data
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [lockedUsers, setLockedUsers] = useState<LockedUser[]>([]);
  const [sessionsStats, setSessionsStats] = useState<SessionsStats | null>(null);
  const [sessionsSubTab, setSessionsSubTab] = useState<'active' | 'logs' | 'attempts' | 'locked'>('active');

  // Modal states
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showEditAdmin, setShowEditAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [adminForm, setAdminForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'assistant',
  });

  const tabs = [
    { id: 'general', name: 'Général', icon: Building },
    { id: 'admins', name: 'Administrateurs', icon: Users },
    { id: 'roles', name: 'Rôles', icon: Shield },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'sessions', name: 'Sessions', icon: Monitor },
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, sessionsSubTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'general':
          const generalRes = await settingsApi.getGeneral();
          setGeneralSettings(generalRes.data.data);
          break;
        case 'admins':
          const adminsRes = await settingsApi.getAdmins();
          setAdmins(adminsRes.data.data);
          break;
        case 'roles':
          const rolesRes = await settingsApi.getRoles();
          setRoles(rolesRes.data.data);
          break;
        case 'security':
          const securityRes = await settingsApi.getSecurity();
          setSecuritySettings(securityRes.data.data);
          break;
        case 'sessions':
          const statsRes = await settingsApi.getSessionsStats();
          setSessionsStats(statsRes.data.data);
          
          if (sessionsSubTab === 'active') {
            const sessionsRes = await settingsApi.getSessions();
            setSessions(sessionsRes.data.data);
          } else if (sessionsSubTab === 'logs') {
            const logsRes = await settingsApi.getLoginLogs();
            setLoginLogs(logsRes.data.data);
          } else if (sessionsSubTab === 'attempts') {
            const attemptsRes = await settingsApi.getLoginAttempts();
            setLoginAttempts(attemptsRes.data.data);
          } else if (sessionsSubTab === 'locked') {
            const lockedRes = await settingsApi.getLockedUsers();
            setLockedUsers(lockedRes.data.data);
          }
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== GENERAL ====================
  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await settingsApi.updateGeneral(generalSettings);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Paramètres enregistrés avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de l\'enregistrement',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await settingsApi.uploadLogo(file);
      setGeneralSettings({ ...generalSettings, logo: res.data.data.path });
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Logo mis à jour',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'upload',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  // ==================== ADMINS ====================
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsApi.createAdmin(adminForm);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Utilisateur créé avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      setShowAddAdmin(false);
      resetAdminForm();
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la création',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const data: any = {
        first_name: adminForm.first_name,
        last_name: adminForm.last_name,
        email: adminForm.email,
        role: adminForm.role,
      };
      if (adminForm.password) {
        data.password = adminForm.password;
      }

      await settingsApi.updateAdmin(selectedAdmin.id, data);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Utilisateur mis à jour',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      setShowEditAdmin(false);
      setSelectedAdmin(null);
      resetAdminForm();
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la mise à jour',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: `Voulez-vous vraiment supprimer ${admin.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      await settingsApi.deleteAdmin(admin.id);
      Swal.fire({
        icon: 'success',
        title: 'Supprimé',
        text: 'Utilisateur supprimé avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la suppression',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    try {
      await settingsApi.toggleAdminStatus(admin.id);
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du changement de statut',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const openEditModal = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setAdminForm({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      password: '',
      role: admin.role,
    });
    setShowEditAdmin(true);
  };

  const resetAdminForm = () => {
    setAdminForm({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'admin',
    });
  };

  // ==================== SECURITY ====================
  const handleSaveSecurity = async () => {
    setSaving(true);
    try {
      await settingsApi.updateSecurity(securitySettings);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Paramètres de sécurité enregistrés',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de l\'enregistrement',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setSaving(false);
    }
  };

  // ==================== SESSIONS ====================
  const handleDestroySession = async (sessionId: string, isCurrent: boolean) => {
    if (isCurrent) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Vous ne pouvez pas terminer votre session actuelle',
        confirmButtonColor: '#0D529C',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Terminer la session',
      text: 'Voulez-vous vraiment terminer cette session ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Terminer',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      await settingsApi.destroySession(sessionId);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Session terminée',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la terminaison',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleDestroyAllSessions = async () => {
    const result = await Swal.fire({
      title: 'Terminer toutes les sessions',
      text: 'Cela déconnectera tous les utilisateurs sauf vous',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Terminer tout',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      await settingsApi.destroyAllSessions();
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Toutes les sessions ont été terminées',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la terminaison',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleUnlockUser = async (userId: number) => {
    try {
      await settingsApi.unlockUser(userId);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Utilisateur déverrouillé',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du déverrouillage',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const getRoleColor = (color: string) => {
    switch (color) {
      case 'purple': return 'bg-purple-500';
      case 'blue': return 'bg-[#0D529C]';
      case 'green': return 'bg-[#257035]';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': case '2fa_verified': return 'bg-[#257035] text-white';
      case 'failed': case 'locked': return 'bg-[#C1272D] text-white';
      case '2fa_sent': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Succès';
      case 'failed': return 'Échoué';
      case '2fa_sent': return '2FA Envoyé';
      case '2fa_verified': return '2FA Vérifié';
      case 'locked': return 'Verrouillé';
      default: return status;
    }
  };

  const getDeviceIcon = (device: string) => {
    return device === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;
  };

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
            {/* ==================== GENERAL TAB ==================== */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Informations Générales</h3>
                  <button
                    onClick={handleSaveGeneral}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
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
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#0D529C] transition-colors cursor-pointer block">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Cliquez pour changer le logo</p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== ADMINS TAB ==================== */}
            {activeTab === 'admins' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Administrateurs & Assistants</h3>
                  <button
                    onClick={() => { resetAdminForm(); setShowAddAdmin(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter Utilisateur
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
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${
                              admin.role === 'admin' ? 'bg-purple-500' : 'bg-[#0D529C]'
                            }`}>
                              {admin.role === 'admin' ? 'Admin' : 'Assistant'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{admin.last_login}</td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleToggleStatus(admin)}
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                admin.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                              }`}
                            >
                              {admin.is_active ? 'Actif' : 'Inactif'}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => openEditModal(admin)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#0D529C] hover:text-white transition-colors"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1"
                            >
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

            {/* ==================== ROLES TAB ==================== */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Rôles du Système</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roles.map((role) => (
                    <div key={role.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(role.color)}`}>
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{role.name}</h4>
                            <p className="text-sm text-gray-500">{role.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.color)} text-white`}>
                          {role.users_count} utilisateurs
                        </span>
                        <span className="text-xs text-gray-400">{role.slug}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== SECURITY TAB ==================== */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Paramètres de Sécurité</h3>
                  <button
                    onClick={handleSaveSecurity}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
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

            {/* ==================== SESSIONS TAB ==================== */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                {/* Stats */}
                {sessionsStats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0D529C] rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sessions Actives</p>
                          <p className="text-xl font-bold text-[#0D529C]">{sessionsStats.active_sessions}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#257035] rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Connexions Aujourd'hui</p>
                          <p className="text-xl font-bold text-[#257035]">{sessionsStats.today_logins}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tentatives Échouées</p>
                          <p className="text-xl font-bold text-orange-500">{sessionsStats.failed_attempts}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C1272D] rounded-lg flex items-center justify-center">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Comptes Verrouillés</p>
                          <p className="text-xl font-bold text-[#C1272D]">{sessionsStats.locked_users}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-2">
                  {[
                    { id: 'active', label: 'Sessions Actives', icon: Monitor },
                    { id: 'logs', label: 'Historique Connexions', icon: Clock },
                    { id: 'attempts', label: 'Tentatives', icon: AlertTriangle },
                    { id: 'locked', label: 'Comptes Verrouillés', icon: Lock },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSessionsSubTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          sessionsSubTab === tab.id
                            ? 'bg-[#0D529C] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Active Sessions */}
                {sessionsSubTab === 'active' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#0D529C]">Sessions Actives</h3>
                      <button
                        onClick={handleDestroyAllSessions}
                        className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Terminer Toutes
                      </button>
                    </div>

                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div key={session.id} className={`bg-gray-50 rounded-lg p-4 border ${session.is_current ? 'border-[#257035] bg-green-50' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${session.is_current ? 'bg-[#257035]' : 'bg-gray-200'}`}>
                                {getDeviceIcon(session.device.device)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900">{session.user_name}</p>
                                  {session.is_current && (
                                    <span className="px-2 py-0.5 text-xs bg-[#257035] text-white rounded-full">Session Actuelle</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{session.user_email}</p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                  <span>{session.device.browser} • {session.device.os}</span>
                                  <span>IP: {session.ip_address}</span>
                                  <span>Dernière activité: {session.last_activity}</span>
                                </div>
                              </div>
                            </div>
                            {!session.is_current && (
                              <button
                                onClick={() => handleDestroySession(session.id, session.is_current)}
                                className="flex items-center gap-2 px-3 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <LogOut className="w-4 h-4" />
                                Terminer
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {sessions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Aucune session active
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Login Logs */}
                {sessionsSubTab === 'logs' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#0D529C]">Historique des Connexions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Utilisateur</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">IP</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Appareil</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loginLogs.map((log) => (
                            <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <p className="font-medium text-gray-900 text-sm">{log.user_name}</p>
                                <p className="text-xs text-gray-500">{log.user_email}</p>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{log.ip_address}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  {getDeviceIcon(log.device.device)}
                                  <span>{log.device.browser} • {log.device.os}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                                  {getStatusLabel(log.status)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{log.created_at}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Login Attempts */}
                {sessionsSubTab === 'attempts' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#0D529C]">Tentatives de Connexion</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">IP</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Appareil</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Résultat</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loginAttempts.map((attempt) => (
                            <tr key={attempt.id} className="border-t border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-900 text-sm">{attempt.email}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{attempt.ip_address}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  {getDeviceIcon(attempt.device.device)}
                                  <span>{attempt.device.browser} • {attempt.device.os}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {attempt.successful ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-[#257035] text-white">
                                    <CheckCircle className="w-3 h-3" /> Succès
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-[#C1272D] text-white">
                                    <XCircle className="w-3 h-3" /> Échoué
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{attempt.attempted_at}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Locked Users */}
                {sessionsSubTab === 'locked' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#0D529C]">Comptes Verrouillés</h3>
                    <div className="space-y-3">
                      {lockedUsers.map((user) => (
                        <div key={user.id} className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Verrouillé le: {user.locked_at}</span>
                                <span>Tentatives: {user.failed_attempts}</span>
                              </div>
                              {user.locked_reason && (
                                <p className="text-sm text-[#C1272D] mt-1">Raison: {user.locked_reason}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleUnlockUser(user.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Unlock className="w-4 h-4" />
                              Déverrouiller
                            </button>
                          </div>
                        </div>
                      ))}
                      {lockedUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Aucun compte verrouillé
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                <h2 className="text-xl font-bold text-[#0D529C]">Ajouter un Utilisateur</h2>
                <button onClick={() => setShowAddAdmin(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={adminForm.first_name}
                    onChange={(e) => setAdminForm({ ...adminForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={adminForm.last_name}
                    onChange={(e) => setAdminForm({ ...adminForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Rôle *</label>
                <select
                  required
                  value={adminForm.role}
                  onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as 'admin' | 'assistant' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="assistant">Assistant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe *</label>
                <input
                  type="password"
                  required
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditAdmin && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Modifier l'Utilisateur</h2>
                <button onClick={() => { setShowEditAdmin(false); setSelectedAdmin(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={adminForm.first_name}
                    onChange={(e) => setAdminForm({ ...adminForm, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={adminForm.last_name}
                    onChange={(e) => setAdminForm({ ...adminForm, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Rôle *</label>
                <select
                  required
                  value={adminForm.role}
                  onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as 'admin' | 'assistant' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="assistant">Assistant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nouveau mot de passe (optionnel)</label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  placeholder="Laisser vide pour garder l'actuel"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditAdmin(false); setSelectedAdmin(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}