// src/app/admin/exams/page.tsx
'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle, Clock, AlertTriangle, Search, Filter, Eye, Download, X, Users, Calendar, Award, TrendingUp, BarChart3 } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Exam {
  id: number;
  course: string;
  course_code: string;
  professor: string;
  group: string;
  filiere: string;
  program: string;
  type: 'partiel' | 'final' | 'rattrapage' | 'controle';
  date: string;
  time: string;
  duration: string;
  room: string;
  total_students: number;
  graded_students: number;
  average: number | null;
  min_grade: number | null;
  max_grade: number | null;
  pass_rate: number | null;
  status: 'planifié' | 'en_cours' | 'terminé' | 'notes_saisies' | 'validé';
  grades: { student: string; grade: number; status: string }[];
}

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<'exams' | 'grades'>('exams');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    filiere: '',
    type: '',
  });

  const stats = {
    total_exams: 156,
    upcoming_exams: 23,
    pending_grades: 12,
    validated_grades: 121,
    global_average: 13.8,
    global_pass_rate: 78.5,
  };

  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const examTypes = ['Partiel', 'Final', 'Rattrapage', 'Contrôle Continu'];
  const statuses = ['Planifié', 'En cours', 'Terminé', 'Notes saisies', 'Validé'];

  const exams: Exam[] = [
    {
      id: 1,
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      type: 'partiel',
      date: '2024-11-20',
      time: '09:00',
      duration: '2h',
      room: 'Salle A12',
      total_students: 25,
      graded_students: 25,
      average: 14.2,
      min_grade: 8.5,
      max_grade: 18.5,
      pass_rate: 88,
      status: 'validé',
      grades: [
        { student: 'Ahmed Benali', grade: 16.5, status: 'Validé' },
        { student: 'Youssef Mansouri', grade: 14.0, status: 'Validé' },
        { student: 'Khadija Amrani', grade: 18.5, status: 'Validé' },
        { student: 'Rachid Tazi', grade: 8.5, status: 'Rattrapage' },
        { student: 'Salma Idrissi', grade: 15.0, status: 'Validé' },
      ],
    },
    {
      id: 2,
      course: 'Marketing Digital',
      course_code: 'MKT-DIG',
      professor: 'Amina El Fassi',
      group: 'COM-L3-B',
      filiere: 'Commerce',
      program: 'Licence',
      type: 'final',
      date: '2024-11-25',
      time: '14:00',
      duration: '3h',
      room: 'Amphi B',
      total_students: 40,
      graded_students: 38,
      average: 13.5,
      min_grade: 7.0,
      max_grade: 17.5,
      pass_rate: 82,
      status: 'notes_saisies',
      grades: [
        { student: 'Fatima Zahra', grade: 17.5, status: 'Validé' },
        { student: 'Omar Benjelloun', grade: 14.0, status: 'Validé' },
        { student: 'Laila Tazi', grade: 12.5, status: 'Validé' },
        { student: 'Mehdi Alaoui', grade: 7.0, status: 'Rattrapage' },
      ],
    },
    {
      id: 3,
      course: 'Analyse Financière',
      course_code: 'FIN-ANA',
      professor: 'Omar Tazi',
      group: 'FIN-M1-A',
      filiere: 'Finance',
      program: 'Master',
      type: 'partiel',
      date: '2024-11-28',
      time: '10:00',
      duration: '2h30',
      room: 'Salle F3',
      total_students: 30,
      graded_students: 0,
      average: null,
      min_grade: null,
      max_grade: null,
      pass_rate: null,
      status: 'planifié',
      grades: [],
    },
    {
      id: 4,
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      type: 'controle',
      date: '2024-11-15',
      time: '09:00',
      duration: '1h30',
      room: 'Lab Info 1',
      total_students: 28,
      graded_students: 28,
      average: 15.1,
      min_grade: 10.0,
      max_grade: 19.0,
      pass_rate: 100,
      status: 'validé',
      grades: [
        { student: 'Ahmed Benali', grade: 17.0, status: 'Validé' },
        { student: 'Youssef Mansouri', grade: 15.5, status: 'Validé' },
        { student: 'Khadija Amrani', grade: 19.0, status: 'Validé' },
      ],
    },
    {
      id: 5,
      course: 'Droit des Affaires',
      course_code: 'COM-DROIT',
      professor: 'Nadia Alami',
      group: 'COM-L2-A',
      filiere: 'Commerce',
      program: 'Licence',
      type: 'rattrapage',
      date: '2024-12-10',
      time: '14:00',
      duration: '2h',
      room: 'Amphi A',
      total_students: 15,
      graded_students: 0,
      average: null,
      min_grade: null,
      max_grade: null,
      pass_rate: null,
      status: 'planifié',
      grades: [],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planifié': return 'bg-blue-500 text-white';
      case 'en_cours': return 'bg-orange-500 text-white';
      case 'terminé': return 'bg-gray-500 text-white';
      case 'notes_saisies': return 'bg-purple-500 text-white';
      case 'validé': return 'bg-[#257035] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planifié': return 'Planifié';
      case 'en_cours': return 'En cours';
      case 'terminé': return 'Terminé';
      case 'notes_saisies': return 'Notes saisies';
      case 'validé': return 'Validé';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'partiel': return 'bg-[#0D529C] text-white';
      case 'final': return 'bg-[#C1272D] text-white';
      case 'rattrapage': return 'bg-orange-500 text-white';
      case 'controle': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'partiel': return 'Partiel';
      case 'final': return 'Final';
      case 'rattrapage': return 'Rattrapage';
      case 'controle': return 'Contrôle';
      default: return type;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-[#257035] bg-green-50';
    if (grade >= 14) return 'text-blue-600 bg-blue-50';
    if (grade >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-[#C1272D] bg-red-50';
  };

  const resetFilters = () => {
    setFilters({ status: '', filiere: '', type: '' });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Examens & Notes</h1>
          <p className="text-gray-500">Consultez les examens planifiés et validez les notes saisies par les professeurs.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Examens</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_exams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">À venir</p>
                <p className="text-xl font-bold text-orange-500">{stats.upcoming_exams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En attente</p>
                <p className="text-xl font-bold text-purple-500">{stats.pending_grades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Validés</p>
                <p className="text-xl font-bold text-[#257035]">{stats.validated_grades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Moyenne Générale</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.global_average}/20</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Taux de Réussite</p>
                <p className="text-xl font-bold text-[#257035]">{stats.global_pass_rate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('exams')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'exams'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Examens ({exams.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('grades')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'grades'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Résultats par Filière
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'exams' && (
              <>
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par cours, professeur, groupe..."
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
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Exporter
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
                        <label className="block text-sm font-medium text-gray-600 mb-1">Statut</label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        >
                          <option value="">Tous les statuts</option>
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
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
                        <label className="block text-sm font-medium text-gray-600 mb-1">Type d'examen</label>
                        <select
                          value={filters.type}
                          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        >
                          <option value="">Tous les types</option>
                          {examTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Exams Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Groupe</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Moyenne</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Réussite</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam) => (
                        <tr key={exam.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{exam.course}</p>
                              <p className="text-xs text-gray-500">{exam.course_code}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{exam.professor}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                              {exam.group}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(exam.type)}`}>
                              {getTypeLabel(exam.type)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <div>
                              <p className="font-medium">{new Date(exam.date).toLocaleDateString('fr-FR')}</p>
                              <p className="text-xs text-gray-500">{exam.time} • {exam.duration}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {exam.average !== null ? (
                              <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${getGradeColor(exam.average)}`}>
                                {exam.average.toFixed(1)}/20
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {exam.pass_rate !== null ? (
                              <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${
                                exam.pass_rate >= 80 ? 'text-[#257035] bg-green-50' : 
                                exam.pass_rate >= 60 ? 'text-orange-600 bg-orange-50' : 
                                'text-[#C1272D] bg-red-50'
                              }`}>
                                {exam.pass_rate}%
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                              {getStatusLabel(exam.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedExam(exam)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {exam.status === 'notes_saisies' && (
                              <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#257035] hover:text-white transition-colors ml-1">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'grades' && (
              <div className="space-y-6">
                {/* Résultats par Filière */}
                {filieres.slice(0, 4).map((filiere) => (
                  <div key={filiere} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#0D529C]">{filiere}</h3>
                      <button className="text-sm text-[#0D529C] hover:underline">Voir détails</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-[#0D529C]">
                          {filiere === 'Développement' ? '14.8' : filiere === 'Commerce' ? '13.5' : filiere === 'Marketing' ? '14.2' : '13.9'}
                        </p>
                        <p className="text-xs text-gray-500">Moyenne Générale</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-[#257035]">
                          {filiere === 'Développement' ? '85%' : filiere === 'Commerce' ? '78%' : filiere === 'Marketing' ? '82%' : '76%'}
                        </p>
                        <p className="text-xs text-gray-500">Taux de Réussite</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-purple-500">
                          {filiere === 'Développement' ? '285' : filiere === 'Commerce' ? '320' : filiere === 'Marketing' ? '195' : '245'}
                        </p>
                        <p className="text-xs text-gray-500">Étudiants</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-orange-500">
                          {filiere === 'Développement' ? '12' : filiere === 'Commerce' ? '10' : filiere === 'Marketing' ? '8' : '11'}
                        </p>
                        <p className="text-xs text-gray-500">Examens ce Semestre</p>
                      </div>
                    </div>
                    {/* Mini Chart */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Distribution des notes</p>
                      <div className="flex items-end gap-1 h-16">
                        {[5, 12, 25, 35, 18, 5].map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-gradient-to-t from-[#0D529C] to-blue-400 rounded-t"
                            style={{ height: `${value * 2}%` }}
                            title={`${['0-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-20'][index]}: ${value}%`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0-8</span>
                        <span>8-10</span>
                        <span>10-12</span>
                        <span>12-14</span>
                        <span>14-16</span>
                        <span>16+</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exam Detail Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{selectedExam.course}</h2>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedExam.type)}`}>
                    {getTypeLabel(selectedExam.type)}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedExam.status)}`}>
                    {getStatusLabel(selectedExam.status)}
                  </span>
                </div>
                <p className="text-blue-200">{selectedExam.course_code} • {selectedExam.group}</p>
              </div>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations Examen */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations de l'Examen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Professeur</p>
                    <p className="font-medium">{selectedExam.professor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Heure</p>
                    <p className="font-medium">{new Date(selectedExam.date).toLocaleDateString('fr-FR')} à {selectedExam.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Durée</p>
                    <p className="font-medium">{selectedExam.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salle</p>
                    <p className="font-medium">{selectedExam.room}</p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              {selectedExam.average !== null && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0D529C] mb-4">Statistiques des Résultats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#0D529C]">{selectedExam.average?.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">Moyenne</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#257035]">{selectedExam.max_grade}</p>
                      <p className="text-xs text-gray-500">Note Max</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#C1272D]">{selectedExam.min_grade}</p>
                      <p className="text-xs text-gray-500">Note Min</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-purple-500">{selectedExam.pass_rate}%</p>
                      <p className="text-xs text-gray-500">Réussite</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-orange-500">{selectedExam.graded_students}/{selectedExam.total_students}</p>
                      <p className="text-xs text-gray-500">Notés</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Liste des Notes */}
              {selectedExam.grades.length > 0 && (
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#257035]">Notes des Étudiants</h3>
                    <button className="flex items-center gap-2 px-3 py-1 bg-[#257035] text-white rounded-lg text-sm hover:bg-green-700">
                      <Download className="w-4 h-4" />
                      Exporter PV
                    </button>
                  </div>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Étudiant</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Note</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedExam.grades.map((grade, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="py-2 px-3 text-sm font-medium">{grade.student}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${getGradeColor(grade.grade)}`}>
                                {grade.grade.toFixed(1)}/20
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                grade.status === 'Validé' ? 'bg-[#257035] text-white' : 'bg-orange-500 text-white'
                              }`}>
                                {grade.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedExam.status === 'notes_saisies' && (
                <div className="flex items-center justify-end gap-4">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Demander Correction
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    Valider les Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}