'use client';

import React, { useState } from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp, SquarePen, Trash2, Plus } from 'lucide-react';

export default function DashboardPage() {
  const [users] = useState([
    { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@igp.ma', role: 'Étudiant', status: 'Actif' },
    { id: 2, name: 'Dr. Fatima Zahra', email: 'f.zahra@igp.ma', role: 'Professeur', status: 'Actif' },
    { id: 3, name: 'Youssef El Amrani', email: 'y.elamrani@igp.ma', role: 'Étudiant', status: 'Actif' },
    { id: 4, name: 'Prof. Mohammed Idrissi', email: 'm.idrissi@igp.ma', role: 'Professeur', status: 'Actif' }
  ]);

  return (
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
              <p className="text-3xl font-bold text-[#0D529C]">1,245</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0D529C]" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Étudiants actifs</p>
          <p className="text-xs text-orange-500 mt-1">+12% depuis le mois dernier</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Cours</p>
              <p className="text-3xl font-bold text-[#0D529C]">87</p>
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
              <p className="text-3xl font-bold text-[#0D529C]">52</p>
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
              <p className="text-3xl font-bold text-[#0D529C]">87%</p>
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
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0D529C]">Utilisateurs Récents</h2>
            <p className="text-sm text-gray-500 mt-1">Derniers utilisateurs inscrits dans le système</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="w-4 h-4" />
            Ajouter Utilisateur
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-y border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rôle</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 px-4 text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Professeur' 
                        ? 'bg-[#0D529C] text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 text-gray-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}