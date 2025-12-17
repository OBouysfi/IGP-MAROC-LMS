'use client';

import React, { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { usersApi, User } from '@/lib/api/users';
import { dashboardApi } from '@/lib/api/dashboard';
import AdminLayout from '@/components/layouts/AdminLayout';

interface DashboardStats {
  total_students: number;
  active_students: number;
  total_professors: number;
  total_courses: number;
  completion_rate: number;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_students: 0,
    active_students: 0,
    total_professors: 0,
    total_courses: 0,
    completion_rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        usersApi.getAll(),
        dashboardApi.getStats()
      ]);
      
      setUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (user: User) => {
    if (!user.roles || user.roles.length === 0) return 'Étudiant';
    const role = user.roles[0].name;
    if (role === 'admin' || role === 'super-admin') return 'Admin';
    if (role === 'professor') return 'Professeur';
    if (role === 'assistant') return 'Assistant';
    return 'Étudiant';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Tableau de Bord Admin</h1>
        <p className="text-gray-500">Bienvenue ! Voici un aperçu de votre système.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Étudiants</p>
              <p className="text-3xl font-bold text-[#0D529C]">{stats.total_students}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0D529C]" />
            </div>
          </div>
          <p className="text-xs text-gray-400">{stats.active_students} étudiants actifs</p>
          <p className="text-xs text-orange-500 mt-1">+12% depuis le mois dernier</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Cours</p>
              <p className="text-3xl font-bold text-[#0D529C]">{stats.total_courses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#0D529C]" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Cours actifs</p>
          <p className="text-xs text-orange-500 mt-1">+5 nouveaux cours</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Professeurs</p>
              <p className="text-3xl font-bold text-[#0D529C]">{stats.total_professors}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Professeurs actifs</p>
          <p className="text-xs text-orange-500 mt-1">+3 ce semestre</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Taux de Complétion</p>
              <p className="text-3xl font-bold text-[#0D529C]">{stats.completion_rate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#0D529C]" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Complétion moyenne des cours</p>
          <p className="text-xs text-orange-500 mt-1">+4% d'amélioration</p>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0D529C]">Utilisateurs Récents</h2>
            <p className="text-sm text-gray-500 mt-1">Derniers utilisateurs inscrits dans le système</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date d'inscription</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rôle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{user.email}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {formatDate(user.created_at)}
                    </td>
                   <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        getRoleName(user) === 'Professeur' 
                          ? 'bg-[#0D529C] text-white'
                          : getRoleName(user) === 'Admin'
                          ? 'bg-[#000] text-white'
                          : getRoleName(user) === 'Assistant'
                          ? 'bg-[#C1272D] text-white'
                          : 'bg-[#c68a0a] text-white'
                      }`}>
                        {getRoleName(user)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-[#257035] text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}