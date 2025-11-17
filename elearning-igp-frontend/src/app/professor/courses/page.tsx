// src/app/professor/courses/page.tsx
'use client';

import React, { useState } from 'react';
import { BookOpen, Users, Clock, Calendar, Eye, FileText, Video, Plus, Search, Filter, X, PlayCircle, Upload, FolderOpen } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';

interface CourseResource {
  id: number;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  size: string;
  uploaded_at: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  group: string;
  filiere: string;
  program: string;
  total_students: number;
  total_hours: number;
  completed_hours: number;
  progress: number;
  schedule: string;
  room: string;
  next_class: string;
  average_attendance: number;
  resources: CourseResource[];
}

export default function ProfessorCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'resources' | 'students'>('info');

  const courses: Course[] = [
    {
      id: 1,
      name: 'React.js Avancé',
      code: 'DEV-REACT',
      description: 'Maîtrise des concepts avancés de React.js incluant les Hooks, Context API, Redux, et optimisation des performances.',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      total_students: 25,
      total_hours: 48,
      completed_hours: 32,
      progress: 67,
      schedule: 'Lundi & Mercredi 09:00-12:00',
      room: 'Salle A12',
      next_class: '2024-11-18',
      average_attendance: 92,
      resources: [
        { id: 1, name: 'Introduction aux Hooks', type: 'pdf', size: '2.5 MB', uploaded_at: '2024-11-01' },
        { id: 2, name: 'Vidéo - Context API', type: 'video', size: '150 MB', uploaded_at: '2024-11-05' },
        { id: 3, name: 'TP - Redux Toolkit', type: 'document', size: '1.2 MB', uploaded_at: '2024-11-10' },
      ],
    },
    {
      id: 2,
      name: 'Node.js & Express',
      code: 'DEV-NODE',
      description: 'Développement backend avec Node.js et Express, création d\'APIs RESTful, authentification et base de données.',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      total_students: 28,
      total_hours: 36,
      completed_hours: 18,
      progress: 50,
      schedule: 'Mardi & Jeudi 14:00-17:00',
      room: 'Lab Info 1',
      next_class: '2024-11-19',
      average_attendance: 88,
      resources: [
        { id: 4, name: 'Setup Node.js Environment', type: 'pdf', size: '1.8 MB', uploaded_at: '2024-10-20' },
        { id: 5, name: 'Express Middleware Guide', type: 'document', size: '900 KB', uploaded_at: '2024-11-02' },
      ],
    },
    {
      id: 3,
      name: 'Introduction au Web',
      code: 'DEV-WEB',
      description: 'Fondamentaux du développement web: HTML5, CSS3, JavaScript ES6+, responsive design.',
      group: 'DEV-L1-A',
      filiere: 'Développement',
      program: 'Licence',
      total_students: 35,
      total_hours: 40,
      completed_hours: 32,
      progress: 80,
      schedule: 'Vendredi 09:00-13:00',
      room: 'Amphi B',
      next_class: '2024-11-22',
      average_attendance: 95,
      resources: [
        { id: 6, name: 'HTML5 Basics', type: 'pdf', size: '3.2 MB', uploaded_at: '2024-09-15' },
        { id: 7, name: 'CSS Flexbox & Grid', type: 'pdf', size: '2.8 MB', uploaded_at: '2024-10-01' },
        { id: 8, name: 'JavaScript Fundamentals', type: 'video', size: '200 MB', uploaded_at: '2024-10-15' },
      ],
    },
    {
      id: 4,
      name: 'JavaScript Moderne',
      code: 'DEV-JS',
      description: 'ES6+, programmation asynchrone, Promises, async/await, modules et bonnes pratiques.',
      group: 'DEV-L2-A',
      filiere: 'Développement',
      program: 'Licence',
      total_students: 30,
      total_hours: 32,
      completed_hours: 14,
      progress: 44,
      schedule: 'Mercredi 14:00-18:00',
      room: 'Salle C5',
      next_class: '2024-11-20',
      average_attendance: 90,
      resources: [
        { id: 9, name: 'ES6 Features Overview', type: 'pdf', size: '1.5 MB', uploaded_at: '2024-11-08' },
      ],
    },
    {
      id: 5,
      name: 'Base de données NoSQL',
      code: 'DEV-NOSQL',
      description: 'MongoDB, modélisation de données, requêtes avancées, indexation et agrégation.',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      total_students: 22,
      total_hours: 24,
      completed_hours: 8,
      progress: 33,
      schedule: 'Jeudi 09:00-12:00',
      room: 'Lab Info 2',
      next_class: '2024-11-21',
      average_attendance: 86,
      resources: [],
    },
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'document': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'link': return <FolderOpen className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'from-[#257035] to-green-400';
    if (progress >= 50) return 'from-[#0D529C] to-blue-400';
    if (progress >= 25) return 'from-orange-500 to-orange-300';
    return 'from-[#C1272D] to-red-400';
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Mes Cours</h1>
          <p className="text-gray-500">Gérez vos cours, ressources et suivez la progression.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Cours</p>
                <p className="text-xl font-bold text-[#0D529C]">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Étudiants</p>
                <p className="text-xl font-bold text-[#257035]">{courses.reduce((sum, c) => sum + c.total_students, 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Heures Complétées</p>
                <p className="text-xl font-bold text-purple-500">{courses.reduce((sum, c) => sum + c.completed_hours, 0)}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Ressources</p>
                <p className="text-xl font-bold text-orange-500">{courses.reduce((sum, c) => sum + c.resources.length, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, code ou groupe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-[#0D529C] to-blue-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{course.name}</h3>
                    <p className="text-blue-200 text-sm">{course.code}</p>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-white/20">
                    {course.group}
                  </span>
                </div>
              </div>

              {/* Course Body */}
              <div className="p-4 space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression</span>
                    <span className="text-sm font-bold text-[#0D529C]">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${getProgressColor(course.progress)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{course.completed_hours}h / {course.total_hours}h</p>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{course.total_students} étudiants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Prochain: {new Date(course.next_class).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#257035]">{course.average_attendance}%</p>
                    <p className="text-xs text-gray-500">Présence</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-500">{course.resources.length}</p>
                    <p className="text-xs text-gray-500">Ressources</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-500">{course.room}</p>
                    <p className="text-xs text-gray-500">Salle</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Détails
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
                  <PlayCircle className="w-4 h-4" />
                  Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                  <p className="text-blue-200">{selectedCourse.code} • {selectedCourse.group}</p>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'info'
                      ? 'border-[#0D529C] text-[#0D529C]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Informations
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'resources'
                      ? 'border-[#0D529C] text-[#0D529C]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ressources ({selectedCourse.resources.length})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'students'
                      ? 'border-[#0D529C] text-[#0D529C]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Étudiants ({selectedCourse.total_students})
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#0D529C] mb-3">Description du Cours</h3>
                    <p className="text-gray-700">{selectedCourse.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#0D529C]">{selectedCourse.total_students}</p>
                      <p className="text-xs text-gray-600">Étudiants</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[#257035]">{selectedCourse.average_attendance}%</p>
                      <p className="text-xs text-gray-600">Présence Moyenne</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-purple-500">{selectedCourse.completed_hours}h</p>
                      <p className="text-xs text-gray-600">Heures Complétées</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-orange-500">{selectedCourse.progress}%</p>
                      <p className="text-xs text-gray-600">Progression</p>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations de Planification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Programme</p>
                        <p className="font-medium">{selectedCourse.program}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Filière</p>
                        <p className="font-medium">{selectedCourse.filiere}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Horaire</p>
                        <p className="font-medium">{selectedCourse.schedule}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Salle</p>
                        <p className="font-medium">{selectedCourse.room}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Prochain Cours</p>
                        <p className="font-medium">{new Date(selectedCourse.next_class).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Heures Totales</p>
                        <p className="font-medium">{selectedCourse.total_hours}h</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0D529C]">Ressources du Cours</h3>
                    <button
                      onClick={() => setShowAddResourceModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Ajouter Ressource
                    </button>
                  </div>

                  {selectedCourse.resources.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune ressource ajoutée</p>
                      <button
                        onClick={() => setShowAddResourceModal(true)}
                        className="mt-4 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ajouter une ressource
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedCourse.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-4">
                            {getResourceIcon(resource.type)}
                            <div>
                              <p className="font-medium text-gray-900">{resource.name}</p>
                              <p className="text-xs text-gray-500">{resource.size} • Ajouté le {new Date(resource.uploaded_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-[#0D529C] hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-[#C1272D] hover:bg-red-50 rounded-lg transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0D529C]">Liste des Étudiants</h3>
                    <span className="text-sm text-gray-500">{selectedCourse.total_students} étudiants inscrits</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">La liste complète des étudiants est disponible dans</p>
                    <button className="mt-4 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Voir Mes Étudiants
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Ajouter une Ressource</h2>
                <button onClick={() => setShowAddResourceModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nom de la ressource</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  placeholder="Ex: Introduction aux Hooks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="pdf">PDF</option>
                  <option value="video">Vidéo</option>
                  <option value="document">Document</option>
                  <option value="link">Lien externe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fichier</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0D529C] transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cliquez ou glissez un fichier ici</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, PPT, MP4 (Max 100MB)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description (optionnel)</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Décrivez la ressource..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowAddResourceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700">
                <Upload className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessorLayout>
  );
}