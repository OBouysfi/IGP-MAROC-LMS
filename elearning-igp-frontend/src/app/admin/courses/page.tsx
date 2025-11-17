// src/app/admin/courses/page.tsx
'use client';

import React, { useState } from 'react';
import { BookOpen, Users, Clock, Award, Plus, Search, Filter, SquarePen, Trash2, Eye, X, Calendar, User, Video } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  program: string;
  level: string;
  filiere: string;
  professor: string;
  professor_email: string;
  students_count: number;
  max_students: number;
  hours_total: number;
  hours_completed: number;
  start_date: string;
  end_date: string;
  schedule: { day: string; time: string; room: string }[];
  status: string;
  is_active: boolean;
  materials: string[];
  completion_rate: number;
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filters, setFilters] = useState({
    program: '',
    filiere: '',
    status: '',
  });

  const stats = {
    total_courses: 45,
    active_courses: 38,
    completed_courses: 7,
    total_hours: 2850,
  };

  const programs = ['Master', 'Licence'];
  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const statuses = ['En cours', 'Terminé', 'À venir'];

  const courses: Course[] = [
    {
      id: 1,
      name: 'React.js Avancé',
      code: 'DEV-M2-REACT',
      description: 'Maîtrisez React.js avec les hooks, le state management, et les patterns avancés. Ce cours couvre Redux, Context API, et les meilleures pratiques de développement.',
      program: 'Master',
      level: '2ème année',
      filiere: 'Développement',
      professor: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      students_count: 25,
      max_students: 30,
      hours_total: 48,
      hours_completed: 32,
      start_date: '2024-09-15',
      end_date: '2024-12-20',
      schedule: [
        { day: 'Lundi', time: '09:00 - 12:00', room: 'Salle A12' },
        { day: 'Mercredi', time: '14:00 - 17:00', room: 'Lab Info 2' },
      ],
      status: 'En cours',
      is_active: true,
      materials: ['Slides PDF', 'Projets GitHub', 'Quiz en ligne', 'Vidéos enregistrées'],
      completion_rate: 67,
    },
    {
      id: 2,
      name: 'Marketing Digital',
      code: 'MKT-L3-DIG',
      description: 'Stratégies de marketing digital incluant SEO, SEM, réseaux sociaux, et analytics. Apprenez à créer et gérer des campagnes digitales efficaces.',
      program: 'Licence',
      level: '3ème année',
      filiere: 'Marketing',
      professor: 'Amina El Fassi',
      professor_email: 'a.elfassi@igp.edu',
      students_count: 40,
      max_students: 45,
      hours_total: 36,
      hours_completed: 36,
      start_date: '2024-09-01',
      end_date: '2024-11-30',
      schedule: [
        { day: 'Mardi', time: '10:00 - 12:00', room: 'Amphi B' },
        { day: 'Jeudi', time: '14:00 - 16:00', room: 'Salle C5' },
      ],
      status: 'Terminé',
      is_active: false,
      materials: ['Études de cas', 'Templates', 'Certifications Google'],
      completion_rate: 100,
    },
    {
      id: 3,
      name: 'Analyse Financière',
      code: 'FIN-M1-ANA',
      description: 'Techniques d\'analyse financière pour l\'évaluation des entreprises. Ratios financiers, états financiers, et prise de décision.',
      program: 'Master',
      level: '1ère année',
      filiere: 'Finance',
      professor: 'Omar Tazi',
      professor_email: 'o.tazi@igp.edu',
      students_count: 30,
      max_students: 35,
      hours_total: 42,
      hours_completed: 28,
      start_date: '2024-10-01',
      end_date: '2025-01-15',
      schedule: [
        { day: 'Vendredi', time: '09:00 - 13:00', room: 'Salle F3' },
      ],
      status: 'En cours',
      is_active: true,
      materials: ['Excel Templates', 'Cas pratiques', 'Bloomberg Access'],
      completion_rate: 67,
    },
    {
      id: 4,
      name: 'Node.js & Express',
      code: 'DEV-M2-NODE',
      description: 'Développement backend avec Node.js et Express. APIs RESTful, authentification, bases de données, et déploiement.',
      program: 'Master',
      level: '2ème année',
      filiere: 'Développement',
      professor: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      students_count: 28,
      max_students: 30,
      hours_total: 36,
      hours_completed: 24,
      start_date: '2024-09-15',
      end_date: '2024-12-15',
      schedule: [
        { day: 'Mardi', time: '14:00 - 16:00', room: 'Lab Info 1' },
        { day: 'Jeudi', time: '09:00 - 11:00', room: 'Lab Info 1' },
      ],
      status: 'En cours',
      is_active: true,
      materials: ['Documentation API', 'Projets GitHub', 'Postman Collections'],
      completion_rate: 67,
    },
    {
      id: 5,
      name: 'Droit des Affaires',
      code: 'COM-L2-DROIT',
      description: 'Fondamentaux du droit commercial et des sociétés. Contrats, responsabilités, et réglementations.',
      program: 'Licence',
      level: '2ème année',
      filiere: 'Commerce',
      professor: 'Nadia Alami',
      professor_email: 'n.alami@igp.edu',
      students_count: 58,
      max_students: 60,
      hours_total: 30,
      hours_completed: 0,
      start_date: '2025-01-15',
      end_date: '2025-04-30',
      schedule: [
        { day: 'Lundi', time: '14:00 - 16:00', room: 'Amphi A' },
        { day: 'Mercredi', time: '10:00 - 12:00', room: 'Amphi A' },
      ],
      status: 'À venir',
      is_active: false,
      materials: ['Code de commerce', 'Études de cas juridiques'],
      completion_rate: 0,
    },
  ];

  const resetFilters = () => {
    setFilters({ program: '', filiere: '', status: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-[#257035] text-white';
      case 'Terminé': return 'bg-[#0D529C] text-white';
      case 'À venir': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Gestion des Cours</h1>
          <p className="text-gray-500">Gérez tous les cours et formations de l'établissement.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <p className="text-xs text-gray-400">Cours dans le système</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cours Actifs</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.active_courses}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">En cours actuellement</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-purple-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cours Terminés</p>
                <p className="text-3xl font-bold text-purple-500">{stats.completed_courses}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Ce semestre</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Heures Totales</p>
                <p className="text-3xl font-bold text-orange-500">{stats.total_hours}h</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Heures d'enseignement</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Cours</h2>
              <p className="text-sm text-gray-500 mt-1">Tous les cours disponibles</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <Plus className="w-4 h-4" />
              Ajouter Cours
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, code, professeur..."
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
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Programme</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiants</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Progression</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.code}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{course.professor}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white w-fit">
                          {course.program}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white w-fit">
                          {course.filiere}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{course.students_count}/{course.max_students}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">{course.hours_completed}h/{course.hours_total}h</span>
                          <span className="text-xs font-medium">{course.completion_rate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#257035] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.completion_rate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedCourse(course)}
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

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{selectedCourse.name}</h2>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCourse.status)}`}>
                    {selectedCourse.status}
                  </span>
                </div>
                <p className="text-blue-200">Code: {selectedCourse.code}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Description du Cours
                </h3>
                <p className="text-gray-700">{selectedCourse.description}</p>
              </div>

              {/* Informations Générales */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Informations Générales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Programme</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white mt-1">
                      {selectedCourse.program}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Filière</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                      {selectedCourse.filiere}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Niveau</p>
                    <p className="font-medium">{selectedCourse.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de Début</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedCourse.start_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de Fin</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedCourse.end_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heures Totales</p>
                    <p className="font-medium">{selectedCourse.hours_total}h</p>
                  </div>
                </div>
              </div>

              {/* Professeur */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Professeur Responsable
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-medium">{selectedCourse.professor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedCourse.professor_email}</p>
                  </div>
                </div>
              </div>

              {/* Étudiants & Progression */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Étudiants & Progression
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Étudiants Inscrits</p>
                    <p className="font-bold text-lg">{selectedCourse.students_count} / {selectedCourse.max_students}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heures Complétées</p>
                    <p className="font-bold text-lg">{selectedCourse.hours_completed}h / {selectedCourse.hours_total}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taux de Complétion</p>
                    <p className="font-bold text-lg text-[#257035]">{selectedCourse.completion_rate}%</p>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${selectedCourse.completion_rate}%` }}
                  />
                </div>
              </div>

              {/* Emploi du Temps */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Emploi du Temps
                </h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Jour</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Horaire</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Salle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourse.schedule.map((slot, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-2 px-3 text-sm font-medium">{slot.day}</td>
                          <td className="py-2 px-3 text-sm">{slot.time}</td>
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

              {/* Matériels */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Matériels Pédagogiques</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.materials.map((material) => (
                    <span key={material} className="inline-flex px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}