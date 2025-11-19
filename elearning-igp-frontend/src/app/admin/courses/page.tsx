'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Award, Plus, Search, Filter, SquarePen, Trash2, Eye, X, Calendar, User, Video } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { coursesApi, Course, CourseStats } from '@/lib/api/admin/courses';
import { professorsApi } from '@/lib/api/admin/professors';
import Swal from 'sweetalert2';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [stats, setStats] = useState<CourseStats>({
    total_courses: 0,
    active_courses: 0,
    completed_courses: 0,
    total_hours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    program: '',
    filiere: '',
    status: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    program: '',
    level: '',
    filiere: '',
    professor_id: '',
    students_count: '0',
    max_students: '30',
    hours_total: '0',
    hours_completed: '0',
    start_date: '',
    end_date: '',
    schedule: [] as { day: string; time: string; room: string }[],
    status: 'À venir',
    materials: [] as string[],
    credits: '0',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    code: '',
    description: '',
    program: '',
    level: '',
    filiere: '',
    professor_id: '',
    students_count: '',
    max_students: '',
    hours_total: '',
    hours_completed: '',
    start_date: '',
    end_date: '',
    schedule: [] as { day: string; time: string; room: string }[],
    status: '',
    materials: [] as string[],
    credits: '',
  });
  const [scheduleInput, setScheduleInput] = useState({ day: '', time: '', room: '' });
  const [editScheduleInput, setEditScheduleInput] = useState({ day: '', time: '', room: '' });
  const [materialInput, setMaterialInput] = useState('');
  const [editMaterialInput, setEditMaterialInput] = useState('');

  const programs = ['DEUG', 'Licence', 'Master'];
  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion', 'Langues', 'Droit'];
  const statuses = ['À venir', 'En cours', 'Terminé'];
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    fetchData();
    fetchProfessors();
  }, [searchTerm, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesResponse, statsResponse] = await Promise.all([
        coursesApi.getAll({
          search: searchTerm,
          program: filters.program,
          filiere: filters.filiere,
          status: filters.status,
        }),
        coursesApi.getStats()
      ]);
      
      setCourses(Array.isArray(coursesResponse.data.data) ? coursesResponse.data.data : []);
      setStats(statsResponse.data.data || statsResponse.data);
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les données',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await professorsApi.getAll({ status: 'Actif' });
      setProfessors(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erreur chargement professeurs:', error);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await coursesApi.create(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Cours ajouté avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setShowAddModal(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        program: '',
        level: '',
        filiere: '',
        professor_id: '',
        students_count: '0',
        max_students: '30',
        hours_total: '0',
        hours_completed: '0',
        start_date: '',
        end_date: '',
        schedule: [],
        status: 'À venir',
        materials: [],
        credits: '0',
      });
      setScheduleInput({ day: '', time: '', room: '' });
      setMaterialInput('');
      
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible d\'ajouter le cours',
      });
    }
  };

  const handleEditClick = (course: Course) => {
    setEditCourse(course);
    setEditFormData({
      name: course.name,
      code: course.code,
      description: course.description || '',
      program: course.program || '',
      level: course.level || '',
      filiere: course.filiere || '',
      professor_id: course.professor?.id.toString() || '',
      students_count: course.students_count.toString(),
      max_students: course.max_students.toString(),
      hours_total: course.hours_total.toString(),
      hours_completed: course.hours_completed.toString(),
      start_date: course.start_date ? course.start_date.split('T')[0] : '',
      end_date: course.end_date ? course.end_date.split('T')[0] : '',
      schedule: course.schedule || [],
      status: course.status || 'À venir',
      materials: course.materials || [],
      credits: course.credits.toString(),
    });
    setEditScheduleInput({ day: '', time: '', room: '' });
    setEditMaterialInput('');
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editCourse) return;
    
    try {
      await coursesApi.update(editCourse.id, editFormData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Cours modifié avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setEditCourse(null);
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de modifier le cours',
      });
    }
  };

  const handleDelete = async (course: Course) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer le cours "${course.name}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await coursesApi.delete(course.id);
        
        if (selectedCourse?.id === course.id) {
          setSelectedCourse(null);
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'Le cours a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer le cours',
        });
      }
    }
  };

  const addSchedule = () => {
    if (scheduleInput.day && scheduleInput.time && scheduleInput.room) {
      setFormData({
        ...formData,
        schedule: [...formData.schedule, scheduleInput]
      });
      setScheduleInput({ day: '', time: '', room: '' });
    }
  };

  const removeSchedule = (index: number) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index)
    });
  };

  const addEditSchedule = () => {
    if (editScheduleInput.day && editScheduleInput.time && editScheduleInput.room) {
      setEditFormData({
        ...editFormData,
        schedule: [...editFormData.schedule, editScheduleInput]
      });
      setEditScheduleInput({ day: '', time: '', room: '' });
    }
  };

  const removeEditSchedule = (index: number) => {
    setEditFormData({
      ...editFormData,
      schedule: editFormData.schedule.filter((_, i) => i !== index)
    });
  };

  const addMaterial = () => {
    if (materialInput.trim()) {
      setFormData({
        ...formData,
        materials: [...formData.materials, materialInput.trim()]
      });
      setMaterialInput('');
    }
  };

  const removeMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    });
  };

  const addEditMaterial = () => {
    if (editMaterialInput.trim()) {
      setEditFormData({
        ...editFormData,
        materials: [...editFormData.materials, editMaterialInput.trim()]
      });
      setEditMaterialInput('');
    }
  };

  const removeEditMaterial = (index: number) => {
    setEditFormData({
      ...editFormData,
      materials: editFormData.materials.filter((_, i) => i !== index)
    });
  };

  const resetFilters = () => {
    setFilters({ program: '', filiere: '', status: '' });
    setSearchTerm('');
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
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
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
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun cours trouvé</p>
              <p className="text-gray-400 text-sm mt-2">Commencez par ajouter votre premier cours</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Programme</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiants</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Progression</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
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
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {course.professor ? course.professor.name : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white w-fit">
                            {course.program || '-'}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white w-fit">
                            {course.filiere || '-'}
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
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(course)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1"
                          title="Modifier"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
{showAddModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ajouter un cours</h2>
        <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleAddCourse} className="p-6 space-y-6">
        {/* Informations de Base */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations de Base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Cours *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code du Cours *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: DEV-M2-REACT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Description détaillée du cours..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Détails Académiques */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#0D529C] mb-4">Détails Académiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {programs.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <input
                type="text"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                placeholder="Ex: 2ème année"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <select
                value={formData.filiere}
                onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {filieres.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
              <select
                value={formData.professor_id}
                onChange={(e) => setFormData({ ...formData, professor_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.user.first_name} {prof.user.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crédits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Capacité & Heures */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#257035] mb-4">Capacité & Heures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Étudiants Inscrits</label>
              <input
                type="number"
                value={formData.students_count}
                onChange={(e) => setFormData({ ...formData, students_count: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité Maximum</label>
              <input
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heures Totales</label>
              <input
                type="number"
                value={formData.hours_total}
                onChange={(e) => setFormData({ ...formData, hours_total: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heures Complétées</label>
              <input
                type="number"
                value={formData.hours_completed}
                onChange={(e) => setFormData({ ...formData, hours_completed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Début</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Fin</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Emploi du Temps */}
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-600 mb-4">Emploi du Temps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
              <select
                value={scheduleInput.day}
                onChange={(e) => setScheduleInput({ ...scheduleInput, day: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
              <input
                type="text"
                value={scheduleInput.time}
                onChange={(e) => setScheduleInput({ ...scheduleInput, time: e.target.value })}
                placeholder="Ex: 09:00 - 12:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <input
                type="text"
                value={scheduleInput.room}
                onChange={(e) => setScheduleInput({ ...scheduleInput, room: e.target.value })}
                placeholder="Ex: Salle A12"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addSchedule}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Ajouter Créneau
          </button>
          {formData.schedule.length > 0 && (
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Jour</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Horaire</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Salle</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.schedule.map((slot, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-2 px-3 text-sm">{slot.day}</td>
                      <td className="py-2 px-3 text-sm">{slot.time}</td>
                      <td className="py-2 px-3 text-sm">{slot.room}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeSchedule(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Matériels Pédagogiques */}
        <div className="bg-orange-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-orange-600 mb-4">Matériels Pédagogiques</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
              placeholder="Ex: Slides PDF, Projets GitHub..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
            />
            <button
              type="button"
              onClick={addMaterial}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.materials.map((material, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-orange-200 text-orange-700 rounded-full text-sm">
                {material}
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-orange-700 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Edit Course Modal */}
{editCourse && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
        <h2 className="text-2xl font-bold">Modifier le cours</h2>
        <button onClick={() => setEditCourse(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleUpdateCourse} className="p-6 space-y-6">
        {/* Informations de Base */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations de Base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Cours *</label>
              <input
                type="text"
                required
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code du Cours *</label>
              <input
                type="text"
                required
                value={editFormData.code}
                onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Détails Académiques */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#0D529C] mb-4">Détails Académiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
              <select
                value={editFormData.program}
                onChange={(e) => setEditFormData({ ...editFormData, program: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {programs.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <input
                type="text"
                value={editFormData.level}
                onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <select
                value={editFormData.filiere}
                onChange={(e) => setEditFormData({ ...editFormData, filiere: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {filieres.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
              <select
                value={editFormData.professor_id}
                onChange={(e) => setEditFormData({ ...editFormData, professor_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.user.first_name} {prof.user.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crédits</label>
              <input
                type="number"
                value={editFormData.credits}
                onChange={(e) => setEditFormData({ ...editFormData, credits: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Capacité & Heures */}
        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#257035] mb-4">Capacité & Heures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Étudiants Inscrits</label>
              <input
                type="number"
                value={editFormData.students_count}
                onChange={(e) => setEditFormData({ ...editFormData, students_count: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité Maximum</label>
              <input
                type="number"
                value={editFormData.max_students}
                onChange={(e) => setEditFormData({ ...editFormData, max_students: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heures Totales</label>
              <input
                type="number"
                value={editFormData.hours_total}
                onChange={(e) => setEditFormData({ ...editFormData, hours_total: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heures Complétées</label>
              <input
                type="number"
                value={editFormData.hours_completed}
                onChange={(e) => setEditFormData({ ...editFormData, hours_completed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Début</label>
              <input
                type="date"
                value={editFormData.start_date}
                onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Fin</label>
              <input
                type="date"
                value={editFormData.end_date}
                onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Emploi du Temps */}
        <div className="bg-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-600 mb-4">Emploi du Temps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
              <select
                value={editScheduleInput.day}
                onChange={(e) => setEditScheduleInput({ ...editScheduleInput, day: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
              <input
                type="text"
                value={editScheduleInput.time}
                onChange={(e) => setEditScheduleInput({ ...editScheduleInput, time: e.target.value })}
                placeholder="Ex: 09:00 - 12:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <input
                type="text"
                value={editScheduleInput.room}
                onChange={(e) => setEditScheduleInput({ ...editScheduleInput, room: e.target.value })}
                placeholder="Ex: Salle A12"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addEditSchedule}
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Ajouter Créneau
          </button>
          {editFormData.schedule.length > 0 && (
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Jour</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Horaire</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Salle</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {editFormData.schedule.map((slot, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-2 px-3 text-sm">{slot.day}</td>
                      <td className="py-2 px-3 text-sm">{slot.time}</td>
                      <td className="py-2 px-3 text-sm">{slot.room}</td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeEditSchedule(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Matériels Pédagogiques */}
        <div className="bg-orange-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-orange-600 mb-4">Matériels Pédagogiques</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={editMaterialInput}
              onChange={(e) => setEditMaterialInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditMaterial())}
              placeholder="Ex: Slides PDF, Projets GitHub..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
            />
            <button
              type="button"
              onClick={addEditMaterial}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {editFormData.materials.map((material, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-orange-200 text-orange-700 rounded-full text-sm">
                {material}
                <button
                  type="button"
                  onClick={() => removeEditMaterial(index)}
                  className="text-orange-700 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setEditCourse(null)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Course Detail Modal */}
{selectedCourse && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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
          <p className="text-gray-700">{selectedCourse.description || 'Aucune description disponible'}</p>
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
                {selectedCourse.program || '-'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Filière</p>
              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                {selectedCourse.filiere || '-'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Niveau</p>
              <p className="font-medium">{selectedCourse.level || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de Début</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {selectedCourse.start_date ? new Date(selectedCourse.start_date).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de Fin</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {selectedCourse.end_date ? new Date(selectedCourse.end_date).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Heures Totales</p>
              <p className="font-medium">{selectedCourse.hours_total}h</p>
            </div>
          </div>
        </div>

        {/* Professeur */}
        {selectedCourse.professor && (
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Professeur Responsable
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{selectedCourse.professor.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedCourse.professor.email}</p>
              </div>
            </div>
          </div>
        )}

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
        {selectedCourse.schedule && selectedCourse.schedule.length > 0 && (
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
        )}

        {/* Matériels */}
        {selectedCourse.materials && selectedCourse.materials.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Matériels Pédagogiques</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCourse.materials.map((material, index) => (
                <span key={index} className="inline-flex px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg">
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </AdminLayout>
  );
}