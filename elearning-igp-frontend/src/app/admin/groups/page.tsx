// src/app/admin/groups/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, BookOpen, Calendar, GraduationCap, Plus, Search, Filter, SquarePen, Trash2, Eye, X, User, Clock } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Group {
  id: number;
  name: string;
  code: string;
  program: string;
  level: string;
  filiere: string;
  academic_year: string;
  max_students: number;
  students: { id: number; name: string; email: string; is_active: boolean }[];
  courses: { name: string; professor: string; hours_week: number }[];
  schedule: { day: string; time: string; course: string; room: string }[];
  delegate: string;
  delegate_email: string;
  created_at: string;
}

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [filters, setFilters] = useState({
    program: '',
    filiere: '',
    level: '',
  });

  const stats = {
    total_groups: 42,
    avg_students: 28,
    total_students: 1176,
    active_groups: 38,
  };

  const programs = ['Master', 'Licence'];
  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const levels = ['1ère année', '2ème année', '3ème année'];

  const groups: Group[] = [
    {
      id: 1,
      name: 'Développement Master 2 - Groupe A',
      code: 'DEV-M2-A',
      program: 'Master',
      level: '2ème année',
      filiere: 'Développement',
      academic_year: '2024-2025',
      max_students: 30,
      students: [
        { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@igp.edu', is_active: true },
        { id: 2, name: 'Youssef Mansouri', email: 'youssef.mansouri@igp.edu', is_active: true },
        { id: 3, name: 'Khadija Amrani', email: 'khadija.amrani@igp.edu', is_active: true },
        { id: 4, name: 'Rachid Tazi', email: 'rachid.tazi@igp.edu', is_active: false },
        { id: 5, name: 'Salma Idrissi', email: 'salma.idrissi@igp.edu', is_active: true },
      ],
      courses: [
        { name: 'React.js Avancé', professor: 'Karim Benjelloun', hours_week: 6 },
        { name: 'Node.js & Express', professor: 'Karim Benjelloun', hours_week: 4 },
        { name: 'DevOps & CI/CD', professor: 'Hassan Alami', hours_week: 4 },
        { name: 'Base de données NoSQL', professor: 'Nadia Fassi', hours_week: 3 },
      ],
      schedule: [
        { day: 'Lundi', time: '09:00 - 12:00', course: 'React.js Avancé', room: 'Lab Info 2' },
        { day: 'Lundi', time: '14:00 - 17:00', course: 'DevOps & CI/CD', room: 'Salle A12' },
        { day: 'Mardi', time: '09:00 - 12:00', course: 'Node.js & Express', room: 'Lab Info 1' },
        { day: 'Mercredi', time: '14:00 - 17:00', course: 'React.js Avancé', room: 'Lab Info 2' },
        { day: 'Jeudi', time: '09:00 - 12:00', course: 'Base de données NoSQL', room: 'Salle B5' },
      ],
      delegate: 'Ahmed Benali',
      delegate_email: 'ahmed.benali@igp.edu',
      created_at: '2024-09-01',
    },
    {
      id: 2,
      name: 'Commerce Licence 3 - Groupe B',
      code: 'COM-L3-B',
      program: 'Licence',
      level: '3ème année',
      filiere: 'Commerce',
      academic_year: '2024-2025',
      max_students: 35,
      students: [
        { id: 6, name: 'Fatima Zahra', email: 'fatima.zahra@igp.edu', is_active: true },
        { id: 7, name: 'Omar Benjelloun', email: 'omar.benjelloun@igp.edu', is_active: true },
        { id: 8, name: 'Laila Tazi', email: 'laila.tazi@igp.edu', is_active: true },
        { id: 9, name: 'Mehdi Alaoui', email: 'mehdi.alaoui@igp.edu', is_active: true },
      ],
      courses: [
        { name: 'Marketing Digital', professor: 'Amina El Fassi', hours_week: 4 },
        { name: 'Droit des Affaires', professor: 'Nadia Alami', hours_week: 4 },
        { name: 'Comptabilité Avancée', professor: 'Said Bennani', hours_week: 3 },
      ],
      schedule: [
        { day: 'Mardi', time: '10:00 - 12:00', course: 'Marketing Digital', room: 'Amphi B' },
        { day: 'Mercredi', time: '09:00 - 12:00', course: 'Droit des Affaires', room: 'Salle C5' },
        { day: 'Jeudi', time: '14:00 - 17:00', course: 'Comptabilité Avancée', room: 'Salle D2' },
      ],
      delegate: 'Fatima Zahra',
      delegate_email: 'fatima.zahra@igp.edu',
      created_at: '2024-09-01',
    },
    {
      id: 3,
      name: 'Marketing Master 1 - Groupe A',
      code: 'MKT-M1-A',
      program: 'Master',
      level: '1ère année',
      filiere: 'Marketing',
      academic_year: '2024-2025',
      max_students: 25,
      students: [
        { id: 10, name: 'Sara Idrissi', email: 'sara.idrissi@igp.edu', is_active: true },
        { id: 11, name: 'Karim Fassi', email: 'karim.fassi@igp.edu', is_active: true },
        { id: 12, name: 'Hiba Mansouri', email: 'hiba.mansouri@igp.edu', is_active: false },
      ],
      courses: [
        { name: 'Stratégie Marketing', professor: 'Amina El Fassi', hours_week: 5 },
        { name: 'Études de Marché', professor: 'Rachid Bennani', hours_week: 4 },
        { name: 'Communication', professor: 'Leila Tazi', hours_week: 3 },
      ],
      schedule: [
        { day: 'Lundi', time: '09:00 - 12:00', course: 'Stratégie Marketing', room: 'Salle E1' },
        { day: 'Mercredi', time: '14:00 - 17:00', course: 'Études de Marché', room: 'Salle E2' },
        { day: 'Vendredi', time: '09:00 - 12:00', course: 'Communication', room: 'Amphi A' },
      ],
      delegate: 'Sara Idrissi',
      delegate_email: 'sara.idrissi@igp.edu',
      created_at: '2024-09-01',
    },
    {
      id: 4,
      name: 'Finance Licence 2 - Groupe A',
      code: 'FIN-L2-A',
      program: 'Licence',
      level: '2ème année',
      filiere: 'Finance',
      academic_year: '2024-2025',
      max_students: 40,
      students: [
        { id: 13, name: 'Amine Tazi', email: 'amine.tazi@igp.edu', is_active: true },
        { id: 14, name: 'Nour Alami', email: 'nour.alami@igp.edu', is_active: true },
        { id: 15, name: 'Yassine Benali', email: 'yassine.benali@igp.edu', is_active: true },
        { id: 16, name: 'Imane Fassi', email: 'imane.fassi@igp.edu', is_active: true },
        { id: 17, name: 'Hamza Idrissi', email: 'hamza.idrissi@igp.edu', is_active: true },
        { id: 18, name: 'Salma Bennani', email: 'salma.bennani@igp.edu', is_active: true },
      ],
      courses: [
        { name: 'Analyse Financière', professor: 'Omar Tazi', hours_week: 4 },
        { name: 'Mathématiques Financières', professor: 'Hassan Alaoui', hours_week: 4 },
        { name: 'Économie', professor: 'Fatima Bennis', hours_week: 3 },
      ],
      schedule: [
        { day: 'Mardi', time: '09:00 - 12:00', course: 'Analyse Financière', room: 'Salle F3' },
        { day: 'Jeudi', time: '09:00 - 12:00', course: 'Mathématiques Financières', room: 'Salle F4' },
        { day: 'Vendredi', time: '14:00 - 17:00', course: 'Économie', room: 'Amphi C' },
      ],
      delegate: 'Amine Tazi',
      delegate_email: 'amine.tazi@igp.edu',
      created_at: '2024-09-01',
    },
  ];

  const resetFilters = () => {
    setFilters({ program: '', filiere: '', level: '' });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Gestion des Groupes</h1>
          <p className="text-gray-500">Gérez les classes et groupes d'étudiants.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Groupes</p>
                <p className="text-3xl font-bold text-[#0D529C]">{stats.total_groups}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0D529C]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Groupes créés</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Groupes Actifs</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.active_groups}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">En cours d'année</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Moyenne Étudiants</p>
                <p className="text-3xl font-bold text-orange-500">{stats.avg_students}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Par groupe</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-purple-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Étudiants</p>
                <p className="text-3xl font-bold text-purple-500">{stats.total_students}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Dans tous les groupes</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Groupes</h2>
              <p className="text-sm text-gray-500 mt-1">Tous les groupes et classes</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <Plus className="w-4 h-4" />
              Créer Groupe
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'border-[#0D529C] bg-blue-50 text-[#0D529C]' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Filtres avancés</h3>
                <button onClick={resetFilters} className="text-sm text-[#C1272D] hover:underline">
                  Réinitialiser
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Programme</label>
                  <select
                    value={filters.program}
                    onChange={(e) => setFilters({ ...filters, program: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les programmes</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Filière</label>
                  <select
                    value={filters.filiere}
                    onChange={(e) => setFilters({ ...filters, filiere: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Toutes les filières</option>
                    {filieres.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Niveau</label>
                  <select
                    value={filters.level}
                    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les niveaux</option>
                    {levels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom du Groupe</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Filière</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Programme</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiants</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded bg-gray-100 text-gray-700">
                        {group.code}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{group.name}</p>
                        <p className="text-xs text-gray-500">{group.level}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                        {group.filiere}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white">
                        {group.program}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{group.students.length}/{group.max_students}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{group.courses.length} cours</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedGroup(group)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1">
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
      </div>

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded bg-white/20">
                    {selectedGroup.code}
                  </span>
                </div>
                <p className="text-blue-200">Année académique: {selectedGroup.academic_year}</p>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations Générales */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Informations Générales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Programme</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white mt-1">
                      {selectedGroup.program}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Filière</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                      {selectedGroup.filiere}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Niveau</p>
                    <p className="font-medium">{selectedGroup.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacité</p>
                    <p className="font-medium">{selectedGroup.students.length} / {selectedGroup.max_students} étudiants</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Délégué de Classe</p>
                  <p className="font-medium">{selectedGroup.delegate}</p>
                  <p className="text-xs text-gray-500">{selectedGroup.delegate_email}</p>
                </div>
              </div>

              {/* Liste des Étudiants */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Étudiants ({selectedGroup.students.length})
                </h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Nom</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Email</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGroup.students.map((student) => (
                        <tr key={student.id} className="border-t border-gray-100">
                          <td className="py-2 px-3 text-sm font-medium">{student.name}</td>
                          <td className="py-2 px-3 text-sm text-gray-600">{student.email}</td>
                          <td className="py-2 px-3 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              student.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                            }`}>
                              {student.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cours Assignés */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Cours Assignés ({selectedGroup.courses.length})
                </h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Cours</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Professeur</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Heures/Semaine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGroup.courses.map((course) => (
                        <tr key={course.name} className="border-t border-gray-100">
                          <td className="py-2 px-3 text-sm font-medium">{course.name}</td>
                          <td className="py-2 px-3 text-sm text-gray-600">{course.professor}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-700">
                              {course.hours_week}h
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Emploi du Temps */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Emploi du Temps
                </h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Jour</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Horaire</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Cours</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Salle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGroup.schedule.map((slot, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-2 px-3 text-sm font-medium">{slot.day}</td>
                          <td className="py-2 px-3 text-sm">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {slot.time}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-sm">{slot.course}</td>
                          <td className="py-2 px-3 text-sm">
                            <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                              {slot.room}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}