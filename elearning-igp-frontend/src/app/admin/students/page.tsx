'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, GraduationCap, Plus, Search, Filter, SquarePen, Trash2, Eye, EyeOff, X, Phone, Mail, MapPin, Calendar, BookOpen, CreditCard, FileText, User } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { studentsApi, Student, StudentStats } from '@/lib/api/admin/students';
import { programsApi, filieresApi } from '@/lib/api/admin/programs';
import Swal from 'sweetalert2';
import { groupsApi } from '@/lib/api/admin/groups';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [programs, setPrograms] = useState<any[]>([]);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  
  const [stats, setStats] = useState<StudentStats>({
    total_students: 0,
    active_students: 0,
    inactive_students: 0,
    new_this_month: 0,
  });
  
  const [filters, setFilters] = useState({
    filiere_id: '',
    nationality: '',
    status: '',
    program_id: '',
  });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    birth_date: '',
    nationality: '',
    address: '',
    filiere_id: '',
    program_id: '',
    level: '',
    group_ids: [] as number[],
    inscription_amount: '',
    monthly_amount: '',
  });
  
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    birth_date: '',
    nationality: '',
    address: '',
    filiere_id: '',
    program_id: '',
    level: '',
    group_ids: [] as number[],
    inscription_amount: '',
    monthly_amount: '',
  });

  const nationalities = [
    'Marocaine', 'Tunisienne', 'Libyenne', 'Sénégalaise', 'Ivoirienne',
    'Camerounaise', 'Congolaise', 'Guinéenne', 'Ghanéenne', 'Burkinabé',
    'Malienne', 'Mauritanienne', 'Nigérienne', 'Gabonaise', 'Française', 'Autre'
  ];
  
  const statuses = ['Actif', 'Inactif'];
  const levels = ['1ère année', '2ème année', '3ème année', 'Master 1', 'Master 2'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) fetchStudents();
  }, [searchTerm, filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const [studentsResponse, statsResponse, programsRes, filieresRes, groupsRes] = await Promise.all([
        studentsApi.getAll({
          search: searchTerm,
          filiere: filters.filiere_id,
          nationality: filters.nationality,
          program: filters.program_id,
          status: filters.status,
        }),
        studentsApi.getStats(),
        programsApi.getAll(),
        filieresApi.getAll(),
        groupsApi.getAll(),
      ]);
      
      setStudents(studentsResponse.data.data || studentsResponse.data || []);
      setStats(statsResponse.data.data || statsResponse.data);
      setPrograms(programsRes.data.data || []);
      setFilieres(filieresRes.data.data || []);
      setGroups(groupsRes.data.data || []);
      
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

  const fetchStudents = async () => {
    try {
      const response = await studentsApi.getAll({
        search: searchTerm,
        filiere: filters.filiere_id,
        nationality: filters.nationality,
        program: filters.program_id,
        status: filters.status,
      });
      
      setStudents(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await studentsApi.create(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Étudiant ajouté avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setShowAddModal(false);
      setFormData({
        first_name: '', last_name: '', email: '', phone: '', password: '',
        gender: '', birth_date: '', nationality: '', address: '',
        filiere_id: '', program_id: '', level: '', group_ids: [],
        inscription_amount: '', monthly_amount: '',
      });
      
      fetchStudents();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible d\'ajouter l\'étudiant',
      });
    }
  };

  const handleEditClick = (student: Student) => {
    setEditStudent(student);
    setEditFormData({
      first_name: student.user.first_name,
      last_name: student.user.last_name,
      email: student.user.email,
      phone: student.user.phone || '',
      gender: student.gender || '',
      birth_date: student.birth_date ? student.birth_date.split('T')[0] : '',
      nationality: student.nationality || '',
      address: student.address || '',
      filiere_id: '',
      program_id: '',
      level: student.level || '',
      group_ids: [],
      inscription_amount: student.inscription_amount.toString(),
      monthly_amount: student.monthly_amount.toString(),
    });
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    
    try {
      await studentsApi.update(editStudent.id, editFormData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Étudiant modifié avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setEditStudent(null);
      fetchStudents();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de modifier l\'étudiant',
      });
    }
  };

  const handleDelete = async (student: Student) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer l'étudiant ${student.user.first_name} ${student.user.last_name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await studentsApi.delete(student.id);
        
        if (selectedStudent?.id === student.id) {
          setSelectedStudent(null);
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'L\'étudiant a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchStudents();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer l\'étudiant',
        });
      }
    }
  };

  const toggleActive = async (student: Student) => {
    try {
      await studentsApi.toggleActive(student.id);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: `Étudiant ${student.user.is_active ? 'désactivé' : 'activé'} avec succès.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchStudents();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de modifier le statut',
      });
    }
  };

  const resetFilters = () => {
    setFilters({ filiere_id: '', nationality: '', status: '', program_id: '' });
    setSearchTerm('');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Gestion des Étudiants</h1>
          <p className="text-gray-500">Gérez tous les étudiants inscrits dans le système.</p>
        </div>

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
            <p className="text-xs text-gray-400">Tous les étudiants enregistrés</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Étudiants Actifs</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.active_students}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Étudiants avec accès actif</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#C1272D] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Étudiants Inactifs</p>
                <p className="text-3xl font-bold text-[#C1272D]">{stats.inactive_students}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-[#C1272D]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Comptes désactivés ou suspendus</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nouveaux ce Mois</p>
                <p className="text-3xl font-bold text-orange-500">{stats.new_this_month}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Inscriptions récentes</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Étudiants</h2>
              <p className="text-sm text-gray-500 mt-1">Tous les étudiants enregistrés dans le système</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Ajouter Étudiant
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone..."
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

          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Filtres avancés</h3>
                <button onClick={resetFilters} className="text-sm text-[#C1272D] hover:underline">
                  Réinitialiser
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Filière</label>
                  <select
                    value={filters.filiere_id}
                    onChange={(e) => setFilters({ ...filters, filiere_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Toutes les filières</option>
                    {filieres?.filter(f => f && f.id && f.name).map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nationalité</label>
                  <select
                    value={filters.nationality}
                    onChange={(e) => setFilters({ ...filters, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Toutes les nationalités</option>
                    {nationalities.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Programme</label>
                  <select
                    value={filters.program_id}
                    onChange={(e) => setFilters({ ...filters, program_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les programmes</option>
                    {programs?.filter(p => p && p.id && p.name).map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
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

          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : students.filter(student => student.user !== null).length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun étudiant trouvé</p>
              <p className="text-gray-400 text-sm mt-2">Commencez par ajouter votre premier étudiant</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom Complet</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Téléphone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Filière</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Programme</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Activer/désactiver</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(student => student.user !== null)
                    .map((student) => (
                      <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                          {student.user.first_name} {student.user.last_name}
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">{student.user.phone || '-'}</td>
                        <td className="py-4 px-4 text-gray-600 text-sm">{student.user.email}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                            {student.filiere?.name || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white">
                            {student.program?.name || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            student.user.is_active
                              ? 'bg-[#257035] text-white'
                              : 'bg-[#C1272D] text-white'
                          }`}>
                            {student.user.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button 
                            onClick={() => toggleActive(student)}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                              student.user.is_active 
                                ? 'bg-red-100 text-orange-600 hover:bg-red-500 hover:text-white' 
                                : 'bg-green-100 text-green-600 hover:bg-green-500 hover:text-white'
                            }`}
                            title={student.user.is_active ? 'Désactiver' : 'Activer'}
                          >
                            {student.user.is_active ? (
                              <UserX className="w-5 h-5" />
                            ) : (
                              <UserCheck className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-blue-500 hover:text-white transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditClick(student)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-yellow-500 hover:text-white transition-colors ml-1"
                            title="Modifier"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(student)}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ajouter un étudiant</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {nationalities.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Académiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    <select
                      value={formData.filiere_id}
                      onChange={(e) => setFormData({ ...formData, filiere_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {filieres?.filter(f => f && f.id && f.name).map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
                    <select
                      value={formData.program_id}
                      onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {programs?.filter(p => p && p.id && p.name).map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupe</label>
                    <select
                      value={formData.group_ids[0] || ''}
                      onChange={(e) => setFormData({ ...formData, group_ids: e.target.value ? [Number(e.target.value)] : [] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {groups?.filter(g => g && g.id && g.name).map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4">Finance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Inscription (MAD)</label>
                    <input
                      type="number"
                      value={formData.inscription_amount}
                      onChange={(e) => setFormData({ ...formData, inscription_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Mensuel (MAD)</label>
                    <input
                      type="number"
                      value={formData.monthly_amount}
                      onChange={(e) => setFormData({ ...formData, monthly_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
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

      {editStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">Modifier l'étudiant</h2>
              <button onClick={() => setEditStudent(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.first_name}
                      onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.last_name}
                      onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <input
                      type="date"
                      value={editFormData.birth_date}
                      onChange={(e) => setEditFormData({ ...editFormData, birth_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                    <select
                      value={editFormData.nationality}
                      onChange={(e) => setEditFormData({ ...editFormData, nationality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {nationalities.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Académiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    <select
                      value={editFormData.filiere_id}
                      onChange={(e) => setEditFormData({ ...editFormData, filiere_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {filieres?.filter(f => f && f.id && f.name).map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
                    <select
                      value={editFormData.program_id}
                      onChange={(e) => setEditFormData({ ...editFormData, program_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {programs?.filter(p => p && p.id && p.name).map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <select
                      value={editFormData.level}
                      onChange={(e) => setEditFormData({ ...editFormData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupe</label>
                    <select
                      value={editFormData.group_ids[0] || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, group_ids: e.target.value ? [Number(e.target.value)] : [] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {groups?.filter(g => g && g.id && g.name).map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4">Finance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Inscription (MAD)</label>
                    <input
                      type="number"
                      value={editFormData.inscription_amount}
                      onChange={(e) => setEditFormData({ ...editFormData, inscription_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Mensuel (MAD)</label>
                    <input
                      type="number"
                      value={editFormData.monthly_amount}
                      onChange={(e) => setEditFormData({ ...editFormData, monthly_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditStudent(null)}
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

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#0D529C]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                  </h2>
                  <p className="text-blue-200">ID: {selectedStudent.student_code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom Complet</p>
                    <p className="font-medium">
                      {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedStudent.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedStudent.user.phone || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sexe</p>
                    <p className="font-medium">{selectedStudent.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de Naissance</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {selectedStudent.birth_date
                        ? new Date(selectedStudent.birth_date).toLocaleDateString('fr-FR')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationalité</p>
                    <p className="font-medium">{selectedStudent.nationality || '-'}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedStudent.address || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'Inscription</p>
                    <p className="font-medium">
                      {selectedStudent.enrolled_date
                        ? new Date(selectedStudent.enrolled_date).toLocaleDateString('fr-FR')
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Informations Académiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Filière</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                      {selectedStudent.filiere?.name || '-'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Programme</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white mt-1">
                      {selectedStudent.program?.name || '-'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Niveau</p>
                    <p className="font-medium">{selectedStudent.level || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Groupe</p>
                    <p className="font-medium">{selectedStudent.group?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut Étudiant</p>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                        selectedStudent.user.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                      }`}
                    >
                      {selectedStudent.user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Administration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Statut du Dossier</p>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                        selectedStudent.dossier_status === 'Complet'
                          ? 'bg-[#257035] text-white'
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {selectedStudent.dossier_status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documents Fournis</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
                        selectedStudent.documents.map((doc: string, idx: number) => (
                          <span key={idx} className="inline-flex px-2 py-1 text-xs bg-gray-200 rounded">
                            {doc}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">Aucun document</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Commentaires Administratifs</p>
                    <p className="font-medium text-gray-700 bg-white p-3 rounded-lg mt-1">
                      {selectedStudent.admin_comments || 'Aucun commentaire'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Finance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Montant Inscription</p>
                    <p className="font-bold text-lg">
                      {selectedStudent.inscription_amount.toLocaleString()} MAD
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Montant Mensuel</p>
                    <p className="font-bold text-lg">
                      {selectedStudent.monthly_amount.toLocaleString()} MAD
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut Paiement</p>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                        selectedStudent.payment_status === 'À jour'
                          ? 'bg-[#257035] text-white'
                          : 'bg-[#C1272D] text-white'
                      }`}
                    >
                      {selectedStudent.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}