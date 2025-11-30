'use client';

import { useState, useEffect } from 'react';
import { examsApi, Exam, ExamStats } from '@/lib/api/admin/exams';
import { coursesApi, Course } from '@/lib/api/admin/courses';
import { groupsApi, Group } from '@/lib/api/admin/groups';
import { FileText, CheckCircle, Clock, AlertTriangle, Search, Filter, Eye, Download, X, Users, Calendar, Award, TrendingUp, BarChart3, Plus, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<'exams' | 'grades'>('exams');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [filiereStats, setFiliereStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    status: '',
    filiere: '',
    type: '',
  });

  const [formData, setFormData] = useState({
    course_id: '',
    group_id: '',
    professor_id: '',
    type: 'partiel',
    date: '',
    time: '',
    duration: '',
    room: '',
    coefficient: '',
  });

  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const examTypes = ['partiel', 'final', 'rattrapage', 'controle'];
  const statuses = ['planifié', 'en_cours', 'terminé', 'notes_saisies', 'validé'];

  useEffect(() => {
    fetchData();
    fetchFormData();
  }, [filters, searchTerm]);

  const fetchFormData = async () => {
    try {
      const [coursesRes, groupsRes] = await Promise.all([
        coursesApi.getAll(),
        groupsApi.getAll(),
      ]);
      
      const coursesData = coursesRes.data.data || coursesRes.data;
      const groupsData = groupsRes.data.data || groupsRes.data;
      
      setCourses(coursesData);
      setGroups(groupsData);
      
      // Extraire les professeurs uniques des cours
      const uniqueProfessors = coursesData
        .filter((course: Course) => course.professor)
        .map((course: Course) => course.professor)
        .filter((prof: any, index: number, self: any[]) => 
          index === self.findIndex((p: any) => p.id === prof.id)
        );
      
      setProfessors(uniqueProfessors);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, statsRes, filiereStatsRes] = await Promise.all([
        examsApi.getAll({ ...filters, search: searchTerm }),
        examsApi.getStats(),
        examsApi.getStatsByFiliere()
      ]);
      
      setExams(examsRes.data.data || examsRes.data);
      setStats(statsRes.data);
      setFiliereStats(filiereStatsRes.data.data || filiereStatsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les données',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await examsApi.create(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Examen créé avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de créer l\'examen',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      course_id: '',
      group_id: '',
      professor_id: '',
      type: 'partiel',
      date: '',
      time: '',
      duration: '',
      room: '',
      coefficient: '',
    });
  };

  const handleViewExam = async (exam: Exam) => {
    try {
      const response = await examsApi.show(exam.id);
      setSelectedExam(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching exam details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les détails',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleValidateGrades = async (examId: number) => {
    const result = await Swal.fire({
      title: 'Valider les notes',
      text: 'Êtes-vous sûr de vouloir valider ces notes ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#257035',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await examsApi.validateGrades(examId);
        Swal.fire({
          icon: 'success',
          title: 'Validé',
          text: 'Les notes ont été validées avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
        fetchData();
        setSelectedExam(null);
      } catch (error) {
        console.error('Error validating grades:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de valider les notes',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const handleDelete = async (exam: Exam) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer cet examen ?<br/><strong>${exam.course.name}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await examsApi.delete(exam.id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Examen supprimé avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting exam:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer l\'examen',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const resetFilters = () => {
    setFilters({ status: '', filiere: '', type: '' });
  };

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

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Examens & Notes</h1>
          <p className="text-gray-500">Consultez les examens planifiés et validez les notes saisies par les professeurs.</p>
        </div>

        {/* Stats Grid */}
        {stats && (
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
                  <p className="text-xl font-bold text-[#0D529C]">{stats.global_average?.toFixed(1) || '-'}/20</p>
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
                  <p className="text-xl font-bold text-[#257035]">{stats.global_pass_rate?.toFixed(1) || '-'}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
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
                            <option key={s} value={s}>{getStatusLabel(s)}</option>
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
                            <option key={t} value={t}>{getTypeLabel(t)}</option>
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
                              <p className="font-medium text-gray-900 text-sm">{exam.course.name}</p>
                              <p className="text-xs text-gray-500">{exam.course.code}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{exam.professor?.name || '-'}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                              {exam.group.name}
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
                                {exam.pass_rate.toFixed(0)}%
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
                              onClick={() => handleViewExam(exam)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#0D529C] hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {exam.status === 'notes_saisies' && (
                              <button
                                onClick={() => handleValidateGrades(exam.id)}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#257035] hover:text-white transition-colors ml-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(exam)}
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
              </>
            )}

            {activeTab === 'grades' && (
              <div className="space-y-6">
                {filiereStats.map((filiere) => (
                  <div key={filiere.filiere} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#0D529C]">{filiere.filiere}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-[#0D529C]">
                          {filiere.avg_grade ? parseFloat(filiere.avg_grade).toFixed(1) : '-'}
                        </p>
                        <p className="text-xs text-gray-500">Moyenne Générale</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-[#257035]">
                          {filiere.avg_pass_rate ? parseFloat(filiere.avg_pass_rate).toFixed(0) : '-'}%
                        </p>
                        <p className="text-xs text-gray-500">Taux de Réussite</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-orange-500">
                          {filiere.total_exams}
                        </p>
                        <p className="text-xs text-gray-500">Examens</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-purple-500">-</p>
                        <p className="text-xs text-gray-500">Étudiants</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-xl font-bold">Planifier un Examen</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cours <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un cours</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Groupe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.group_id}
                    onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un groupe</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professeur <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.professor_id}
                    onChange={(e) => setFormData({ ...formData, professor_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un professeur</option>
                    {professors.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'examen <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  >
                    {examTypes.map((type) => (
                      <option key={type} value={type}>
                        {getTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 2h00"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Salle A101"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coefficient <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="5"
                    placeholder="ex: 2"
                    value={formData.coefficient}
                    onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> L'examen sera créé avec le statut "Planifié". 
                  Les étudiants seront notifiés automatiquement.
                </p>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Planifier l'Examen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exam Detail Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{selectedExam.course.name}</h2>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedExam.type)}`}>
                    {getTypeLabel(selectedExam.type)}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedExam.status)}`}>
                    {getStatusLabel(selectedExam.status)}
                  </span>
                </div>
                <p className="text-blue-200">{selectedExam.course.code} • {selectedExam.group.name}</p>
              </div>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations de l'Examen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Professeur</p>
                    <p className="font-medium">{selectedExam.professor?.name || '-'}</p>
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
                      <p className="text-2xl font-bold text-purple-500">{selectedExam.pass_rate?.toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">Réussite</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-orange-500">{selectedExam.graded_students}/{selectedExam.total_students}</p>
                      <p className="text-xs text-gray-500">Notés</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedExam.grades && selectedExam.grades.length > 0 && (
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
                                grade.status === 'validé' ? 'bg-[#257035] text-white' : 'bg-orange-500 text-white'
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

              {selectedExam.status === 'notes_saisies' && (
                <div className="flex items-center justify-end gap-4">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Demander Correction
                  </button>
                  <button
                    onClick={() => handleValidateGrades(selectedExam.id)}
                    className="flex items-center gap-2 px-6 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
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