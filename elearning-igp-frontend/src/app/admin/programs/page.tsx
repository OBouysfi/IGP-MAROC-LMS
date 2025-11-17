// src/app/admin/programs/page.tsx
'use client';

import React, { useState } from 'react';
import { GraduationCap, BookOpen, Layers, DollarSign, Plus, Search, SquarePen, Trash2, Eye, X, Users, Calendar, Clock } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Filiere {
  id: number;
  name: string;
  code: string;
  description: string;
  programs: string[];
  total_students: number;
  total_courses: number;
  is_active: boolean;
  created_at: string;
}

interface Program {
  id: number;
  name: string;
  code: string;
  duration_years: number;
  levels: string[];
  inscription_fee: number;
  monthly_fee: number;
  total_students: number;
  total_groups: number;
  requirements: string[];
  is_active: boolean;
}

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState<'filieres' | 'programs'>('filieres');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const stats = {
    total_filieres: 6,
    total_programs: 2,
    total_students: 1250,
    total_revenue: 2850000,
  };

  const filieres: Filiere[] = [
    {
      id: 1,
      name: 'Développement Informatique',
      code: 'DEV',
      description: 'Formation complète en développement web, mobile et logiciel. Maîtrise des langages modernes et des frameworks populaires.',
      programs: ['Master', 'Licence'],
      total_students: 285,
      total_courses: 12,
      is_active: true,
      created_at: '2020-09-01',
    },
    {
      id: 2,
      name: 'Commerce International',
      code: 'COM',
      description: 'Formation en commerce international, négociation, import/export et gestion des échanges commerciaux.',
      programs: ['Master', 'Licence'],
      total_students: 320,
      total_courses: 10,
      is_active: true,
      created_at: '2020-09-01',
    },
    {
      id: 3,
      name: 'Marketing Digital',
      code: 'MKT',
      description: 'Stratégies marketing digitales, SEO, réseaux sociaux, publicité en ligne et analyse de données.',
      programs: ['Master', 'Licence'],
      total_students: 195,
      total_courses: 8,
      is_active: true,
      created_at: '2021-09-01',
    },
    {
      id: 4,
      name: 'Finance et Comptabilité',
      code: 'FIN',
      description: 'Gestion financière, analyse comptable, audit, contrôle de gestion et fiscalité.',
      programs: ['Master', 'Licence'],
      total_students: 245,
      total_courses: 11,
      is_active: true,
      created_at: '2020-09-01',
    },
    {
      id: 5,
      name: 'Ressources Humaines',
      code: 'RH',
      description: 'Management des ressources humaines, recrutement, formation, droit du travail et gestion des talents.',
      programs: ['Master'],
      total_students: 125,
      total_courses: 7,
      is_active: true,
      created_at: '2022-09-01',
    },
    {
      id: 6,
      name: 'Gestion des Entreprises',
      code: 'GES',
      description: 'Management général, stratégie d\'entreprise, gestion de projet et entrepreneuriat.',
      programs: ['Licence'],
      total_students: 80,
      total_courses: 9,
      is_active: false,
      created_at: '2021-09-01',
    },
  ];

  const programs: Program[] = [
    {
      id: 1,
      name: 'Master',
      code: 'M',
      duration_years: 2,
      levels: ['1ère année', '2ème année'],
      inscription_fee: 5000,
      monthly_fee: 2500,
      total_students: 520,
      total_groups: 18,
      requirements: ['Licence ou équivalent (Bac+3)', 'Dossier de candidature', 'Entretien de motivation', 'Test de niveau'],
      is_active: true,
    },
    {
      id: 2,
      name: 'Licence',
      code: 'L',
      duration_years: 3,
      levels: ['1ère année', '2ème année', '3ème année'],
      inscription_fee: 4500,
      monthly_fee: 2000,
      total_students: 730,
      total_groups: 24,
      requirements: ['Baccalauréat ou équivalent', 'Dossier de candidature', 'Test d\'admission'],
      is_active: true,
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Filières & Programmes</h1>
          <p className="text-gray-500">Gérez les filières d'études et les programmes académiques.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Filières</p>
                <p className="text-3xl font-bold text-[#0D529C]">{stats.total_filieres}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#0D529C]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Domaines d'études</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Programmes</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.total_programs}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Master & Licence</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-purple-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Étudiants</p>
                <p className="text-3xl font-bold text-purple-500">{stats.total_students}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Tous programmes confondus</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Revenus Annuels</p>
                <p className="text-3xl font-bold text-orange-500">{(stats.total_revenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">MAD</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('filieres')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'filieres'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Filières ({filieres.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'programs'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Programmes ({programs.length})
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Search & Add */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Rechercher ${activeTab === 'filieres' ? 'une filière' : 'un programme'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                <Plus className="w-4 h-4" />
                Ajouter {activeTab === 'filieres' ? 'Filière' : 'Programme'}
              </button>
            </div>

            {/* Filières Tab */}
            {activeTab === 'filieres' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filieres.map((filiere) => (
                  <div
                    key={filiere.id}
                    className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-all ${
                      filiere.is_active ? 'border-gray-200' : 'border-red-200 bg-red-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex px-2 py-1 text-xs font-bold rounded bg-[#0D529C] text-white">
                            {filiere.code}
                          </span>
                          {!filiere.is_active && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#C1272D] text-white">
                              Inactif
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900">{filiere.name}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{filiere.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Étudiants</span>
                        <span className="font-medium">{filiere.total_students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Cours</span>
                        <span className="font-medium">{filiere.total_courses}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Programmes</span>
                        <div className="flex gap-1">
                          {filiere.programs.map((p) => (
                            <span key={p} className="inline-flex px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-700">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedFiliere(filiere)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex px-3 py-1 text-sm font-bold rounded bg-[#257035] text-white">
                            {program.name}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                            Code: {program.code}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Durée: {program.duration_years} ans</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-[#257035]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Frais d'Inscription</p>
                        <p className="font-bold text-[#0D529C]">{program.inscription_fee.toLocaleString()} MAD</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Mensualité</p>
                        <p className="font-bold text-[#257035]">{program.monthly_fee.toLocaleString()} MAD</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Étudiants inscrits</span>
                        <span className="font-medium">{program.total_students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Groupes</span>
                        <span className="font-medium">{program.total_groups}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Niveaux</span>
                        <div className="flex gap-1">
                          {program.levels.map((l) => (
                            <span key={l} className="inline-flex px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Conditions d'admission</p>
                      <ul className="space-y-1">
                        {program.requirements.slice(0, 3).map((req) => (
                          <li key={req} className="text-xs text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#257035] rounded-full" />
                            {req}
                          </li>
                        ))}
                        {program.requirements.length > 3 && (
                          <li className="text-xs text-gray-400">+{program.requirements.length - 3} autres...</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedProgram(program)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filiere Detail Modal */}
      {selectedFiliere && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{selectedFiliere.name}</h2>
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded bg-white/20">
                    {selectedFiliere.code}
                  </span>
                </div>
                <p className="text-blue-200">Filière d'études</p>
              </div>
              <button
                onClick={() => setSelectedFiliere(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Description</h3>
                <p className="text-gray-700">{selectedFiliere.description}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Statistiques</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-[#0D529C] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#0D529C]">{selectedFiliere.total_students}</p>
                    <p className="text-xs text-gray-500">Étudiants</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <BookOpen className="w-6 h-6 text-[#257035] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#257035]">{selectedFiliere.total_courses}</p>
                    <p className="text-xs text-gray-500">Cours</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <GraduationCap className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-500">{selectedFiliere.programs.length}</p>
                    <p className="text-xs text-gray-500">Programmes</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-orange-500">
                      {new Date(selectedFiliere.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-500">Créée le</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4">Programmes Disponibles</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedFiliere.programs.map((p) => (
                    <span key={p} className="inline-flex px-4 py-2 text-sm font-semibold rounded-lg bg-[#257035] text-white">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                  selectedFiliere.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                }`}>
                  {selectedFiliere.is_active ? 'Filière Active' : 'Filière Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#257035] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">Programme {selectedProgram.name}</h2>
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded bg-white/20">
                    {selectedProgram.code}
                  </span>
                </div>
                <p className="text-green-200">Durée: {selectedProgram.duration_years} ans</p>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4">Frais de Scolarité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-l-[#0D529C]">
                    <p className="text-sm text-gray-500 mb-1">Frais d'Inscription</p>
                    <p className="text-2xl font-bold text-[#0D529C]">{selectedProgram.inscription_fee.toLocaleString()} MAD</p>
                    <p className="text-xs text-gray-400">Payable une fois à l'inscription</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-l-[#257035]">
                    <p className="text-sm text-gray-500 mb-1">Mensualité</p>
                    <p className="text-2xl font-bold text-[#257035]">{selectedProgram.monthly_fee.toLocaleString()} MAD</p>
                    <p className="text-xs text-gray-400">10 mois par année académique</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Statistiques</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-[#0D529C] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#0D529C]">{selectedProgram.total_students}</p>
                    <p className="text-xs text-gray-500">Étudiants</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Layers className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-500">{selectedProgram.total_groups}</p>
                    <p className="text-xs text-gray-500">Groupes</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-500">{selectedProgram.duration_years}</p>
                    <p className="text-xs text-gray-500">Années</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-600 mb-4">Niveaux</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProgram.levels.map((level) => (
                    <span key={level} className="inline-flex px-4 py-2 text-sm font-semibold rounded-lg bg-orange-500 text-white">
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-4">Conditions d'Admission</h3>
                <ul className="space-y-2">
                  {selectedProgram.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}