// src/app/professor/courses/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Calendar, Eye, FileText, Video, Plus, Search, Filter, X, PlayCircle, Upload, FolderOpen, Loader2 } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';
import { professorCoursesApi, Course, CourseResource, CoursesStats } from '@/lib/api/professor/courses';
import Swal from 'sweetalert2';

export default function ProfessorCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'resources' | 'students'>('info');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CoursesStats | null>(null);
  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'pdf' as 'pdf' | 'video' | 'document' | 'link',
    file: null as File | null,
    url: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, statsRes] = await Promise.all([
        professorCoursesApi.getCourses({ search: searchTerm }),
        professorCoursesApi.getStats(),
      ]);
      setCourses(coursesRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement des données',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const formData = new FormData();
    formData.append('name', resourceForm.name);
    formData.append('type', resourceForm.type);
    
    if (resourceForm.type === 'link') {
      formData.append('url', resourceForm.url);
    } else if (resourceForm.file) {
      formData.append('file', resourceForm.file);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner un fichier',
        confirmButtonColor: '#0D529C',
      });
      return;
    }
    
    if (resourceForm.description) {
      formData.append('description', resourceForm.description);
    }

    setUploading(true);
    try {
      await professorCoursesApi.uploadResource(selectedCourse.id, formData);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Ressource ajoutée avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      setShowAddResourceModal(false);
      setResourceForm({ name: '', type: 'pdf', file: null, url: '', description: '' });
      
      const courseRes = await professorCoursesApi.getCourse(selectedCourse.id);
      setSelectedCourse(courseRes.data.data);
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de l\'ajout de la ressource',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!selectedCourse) return;

    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Voulez-vous vraiment supprimer cette ressource ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      await professorCoursesApi.deleteResource(selectedCourse.id, resourceId);
      Swal.fire({
        icon: 'success',
        title: 'Supprimé',
        text: 'Ressource supprimée avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      
      const courseRes = await professorCoursesApi.getCourse(selectedCourse.id);
      setSelectedCourse(courseRes.data.data);
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la suppression',
        confirmButtonColor: '#0D529C',
      });
    }
  };

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

  if (loading) {
    return (
      <ProfessorLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D529C]" />
        </div>
      </ProfessorLayout>
    );
  }

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Mes Cours</h1>
          <p className="text-gray-500">Gérez vos cours, ressources et suivez la progression.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Cours</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats?.total_courses || 0}</p>
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
                <p className="text-xl font-bold text-[#257035]">{stats?.total_students || 0}</p>
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
                <p className="text-xl font-bold text-purple-500">{stats?.completed_hours || 0}h</p>
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
                <p className="text-xl font-bold text-orange-500">{stats?.total_resources || 0}</p>
              </div>
            </div>
          </div>
        </div>

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

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun cours trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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

                <div className="p-4 space-y-4">
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
                      <span className="text-gray-600">Prochain: {course.next_class ? new Date(course.next_class).toLocaleDateString('fr-FR') : '-'}</span>
                    </div>
                  </div>

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
        )}
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl z-10">
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
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#0D529C] mb-3">Description du Cours</h3>
                    <p className="text-gray-700">{selectedCourse.description}</p>
                  </div>

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
                        <p className="font-medium">{selectedCourse.next_class ? new Date(selectedCourse.next_class).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '-'}</p>
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
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-[#0D529C] hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteResource(resource.id)}
                              className="p-2 text-[#C1272D] hover:bg-red-50 rounded-lg transition-colors"
                            >
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
            <form onSubmit={handleUploadResource} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nom de la ressource</label>
                <input
                  type="text"
                  required
                  value={resourceForm.name}
                  onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  placeholder="Ex: Introduction aux Hooks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                <select
                  value={resourceForm.type}
                  onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Vidéo</option>
                  <option value="document">Document</option>
                  <option value="link">Lien externe</option>
                </select>
              </div>
              
              {resourceForm.type === 'link' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">URL</label>
                  <input
                    type="url"
                    required
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fichier</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0D529C] transition-colors">
                    <input
                      type="file"
                      required
                      onChange={(e) => setResourceForm({ ...resourceForm, file: e.target.files?.[0] || null })}
                      className="hidden"
                      id="file-upload"
                      accept={
                        resourceForm.type === 'pdf' ? '.pdf' :
                        resourceForm.type === 'video' ? 'video/*' :
                        '.doc,.docx,.ppt,.pptx,.xls,.xlsx'
                      }
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {resourceForm.file ? resourceForm.file.name : 'Cliquez ou glissez un fichier ici'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {resourceForm.type === 'pdf' ? 'PDF' : 
                         resourceForm.type === 'video' ? 'MP4, AVI, MOV' : 
                         'DOC, PPT, XLS'} (Max 100MB)
                      </p>
                    </label>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description (optionnel)</label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Décrivez la ressource..."
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProfessorLayout>
  );
}