'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, UserCheck, UserX, BookOpen, Plus, Search, Filter, SquarePen, Trash2, Eye, EyeOff, X, Phone, Mail, MapPin, Calendar, User, Award, Clock } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { professorsApi, Professor, ProfessorStats } from '@/lib/api/admin/professors';
import Swal from 'sweetalert2';

export default function ProfessorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProfessor, setEditProfessor] = useState<Professor | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState<ProfessorStats>({
    total_professors: 0,
    active_professors: 0,
    inactive_professors: 0,
    new_this_semester: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    contract_type: '',
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
    hire_date: '',
    department: '',
    specialization: '',
    contract_type: 'CDI',
    hourly_rate: '',
    total_hours_month: '',
    qualifications: [] as string[],
    bio: '',
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
    hire_date: '',
    department: '',
    specialization: '',
    contract_type: '',
    hourly_rate: '',
    total_hours_month: '',
    qualifications: [] as string[],
    bio: '',
  });
  const [qualificationInput, setQualificationInput] = useState('');
  const [editQualificationInput, setEditQualificationInput] = useState('');

  const departments = [
    'Informatique',
    'Marketing',
    'Gestion & Finance',
    'Ressources Humaines',
    'Commerce',
    'PME / Entrepreneuriat',
    'E-Business',
    'Management Stratégique et Économique',
  ];
  
  const nationalities = [
    'Marocaine',
    'Tunisienne',
    'Libyenne',
    'Sénégalaise',
    'Ivoirienne',
    'Camerounaise',
    'Congolaise',
    'Guinéenne',
    'Ghanéenne',
    'Burkinabé',
    'Malienne',
    'Mauritanienne',
    'Nigérienne',
    'Gabonaise',
    'Française',
    'Autre'
  ];
  const contractTypes = ['CDI', 'CDD', 'Vacataire'];
  const statuses = ['Actif', 'Inactif'];

  useEffect(() => {
    fetchData();
  }, [searchTerm, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [professorsResponse, statsResponse] = await Promise.all([
        professorsApi.getAll({
          search: searchTerm,
          department: filters.department,
          contract_type: filters.contract_type,
          status: filters.status,
        }),
        professorsApi.getStats()
      ]);
      
      setProfessors(Array.isArray(professorsResponse.data.data) ? professorsResponse.data.data : []);
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

  const handleAddProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await professorsApi.create(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Professeur ajouté avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setShowAddModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        gender: '',
        birth_date: '',
        nationality: '',
        address: '',
        hire_date: '',
        department: '',
        specialization: '',
        contract_type: 'CDI',
        hourly_rate: '',
        total_hours_month: '',
        qualifications: [],
        bio: '',
      });
      setQualificationInput('');
      
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible d\'ajouter le professeur',
      });
    }
  };

  const handleEditClick = (professor: Professor) => {
    setEditProfessor(professor);
    setEditFormData({
      first_name: professor.user.first_name,
      last_name: professor.user.last_name,
      email: professor.user.email,
      phone: professor.user.phone || '',
      gender: professor.gender || '',
      birth_date: professor.birth_date ? professor.birth_date.split('T')[0] : '',
      nationality: professor.nationality || '',
      address: professor.address || '',
      hire_date: professor.hire_date ? professor.hire_date.split('T')[0] : '',
      department: professor.department || '',
      specialization: professor.specialization || '',
      contract_type: professor.contract_type || 'CDI',
      hourly_rate: professor.hourly_rate.toString(),
      total_hours_month: professor.total_hours_month.toString(),
      qualifications: professor.qualifications || [],
      bio: professor.bio || '',
    });
    setEditQualificationInput('');
  };

  const handleUpdateProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editProfessor) return;
    
    try {
      await professorsApi.update(editProfessor.id, editFormData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Professeur modifié avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setEditProfessor(null);
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de modifier le professeur',
      });
    }
  };

  const handleDelete = async (professor: Professor) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer le professeur ${professor.user.first_name} ${professor.user.last_name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await professorsApi.delete(professor.id);
        
        if (selectedProfessor?.id === professor.id) {
          setSelectedProfessor(null);
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'Le professeur a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer le professeur',
        });
      }
    }
  };

  const toggleActive = async (professor: Professor) => {
    try {
      await professorsApi.toggleActive(professor.id);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: `Professeur ${professor.user.is_active ? 'désactivé' : 'activé'} avec succès.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de modifier le statut',
      });
    }
  };

  const addQualification = () => {
    if (qualificationInput.trim()) {
      setFormData({
        ...formData,
        qualifications: [...formData.qualifications, qualificationInput.trim()]
      });
      setQualificationInput('');
    }
  };

  const removeQualification = (index: number) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter((_, i) => i !== index)
    });
  };

  const addEditQualification = () => {
    if (editQualificationInput.trim()) {
      setEditFormData({
        ...editFormData,
        qualifications: [...editFormData.qualifications, editQualificationInput.trim()]
      });
      setEditQualificationInput('');
    }
  };

  const removeEditQualification = (index: number) => {
    setEditFormData({
      ...editFormData,
      qualifications: editFormData.qualifications.filter((_, i) => i !== index)
    });
  };

  const resetFilters = () => {
    setFilters({ department: '', status: '', contract_type: '' });
    setSearchTerm('');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Gestion des Professeurs</h1>
          <p className="text-gray-500">Gérez tous les professeurs et intervenants de l'établissement.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Professeurs</p>
                <p className="text-3xl font-bold text-[#0D529C]">{stats.total_professors}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#0D529C]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Corps professoral complet</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Professeurs Actifs</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.active_professors}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Enseignants en activité</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#C1272D] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Professeurs Inactifs</p>
                <p className="text-3xl font-bold text-[#C1272D]">{stats.inactive_professors}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-[#C1272D]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">En congé ou indisponibles</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nouveaux ce Semestre</p>
                <p className="text-3xl font-bold text-orange-500">{stats.new_this_semester}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Recrutements récents</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Professeurs</h2>
              <p className="text-sm text-gray-500 mt-1">Tous les professeurs enregistrés dans le système</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Ajouter Professeur
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, spécialisation..."
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Département</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les départements</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type de Contrat</label>
                  <select
                    value={filters.contract_type}
                    onChange={(e) => setFilters({ ...filters, contract_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les contrats</option>
                    {contractTypes.map((c) => (
                      <option key={c} value={c}>{c}</option>
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
          ) : professors.filter(professor => professor.user !== null).length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aucun professeur trouvé</p>
              <p className="text-gray-400 text-sm mt-2">Commencez par ajouter votre premier professeur</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom Complet</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Téléphone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contrat</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Activer/désactiver</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {professors
                    .filter(professor => professor.user !== null)
                    .map((professor) => (
                      <tr key={professor.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                          {professor.user.first_name} {professor.user.last_name}
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">{professor.user.phone || '-'}</td>
                        <td className="py-4 px-4 text-gray-600 text-sm">{professor.user.email}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                            {professor.department || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            professor.contract_type === 'CDI' ? 'bg-[#0D529C] text-white' :
                            professor.contract_type === 'CDD' ? 'bg-orange-500 text-white' :
                            'bg-[#160e11] text-white' 
                          }`}>
                            {professor.contract_type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            professor.user.is_active
                              ? 'bg-[#257035] text-white'
                              : 'bg-[#C1272D] text-white'
                          }`}>
                            {professor.user.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <button 
                              onClick={() => toggleActive(professor)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                professor.user.is_active 
                                  ? 'bg-[#257035] focus:ring-[#257035]' 
                                  : 'bg-gray-300 focus:ring-gray-400'
                              }`}
                              title={professor.user.is_active ? 'Désactiver' : 'Activer'}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  professor.user.is_active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => setSelectedProfessor(professor)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditClick(professor)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1"
                            title="Modifier"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(professor)}
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

      {/* Add Professor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ajouter un professeur</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddProfessor} className="p-6 space-y-6">
              {/* Informations Personnelles */}
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

              {/* Informations Professionnelles */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Professionnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'Embauche</label>
                    <input
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisation</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="Ex: Full Stack Development"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de Contrat</label>
                    <select
                      value={formData.contract_type}
                      onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      {contractTypes.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taux Horaire (MAD)</label>
                    <input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures/Mois</label>
                    <input
                      type="number"
                      value={formData.total_hours_month}
                      onChange={(e) => setFormData({ ...formData, total_hours_month: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={qualificationInput}
                        onChange={(e) => setQualificationInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                        placeholder="Ajouter une qualification"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addQualification}
                        className="px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.qualifications.map((qual, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {qual}
                          <button
                            type="button"
                            onClick={() => removeQualification(index)}
                            className="text-blue-700 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      placeholder="Brève présentation du professeur..."
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

      {/* Edit Professor Modal */}
      {editProfessor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">Modifier le professeur</h2>
              <button onClick={() => setEditProfessor(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfessor} className="p-6 space-y-6">
              {/* Informations Personnelles */}
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

              {/* Informations Professionnelles */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Professionnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'Embauche</label>
                    <input
                      type="date"
                      value={editFormData.hire_date}
                      onChange={(e) => setEditFormData({ ...editFormData, hire_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                    <select
                      value={editFormData.department}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisation</label>
                    <input
                      type="text"
                      value={editFormData.specialization}
                      onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de Contrat</label>
                    <select
                      value={editFormData.contract_type}
                      onChange={(e) => setEditFormData({ ...editFormData, contract_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      {contractTypes.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taux Horaire (MAD)</label>
                    <input
                      type="number"
                      value={editFormData.hourly_rate}
                      onChange={(e) => setEditFormData({ ...editFormData, hourly_rate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures/Mois</label>
                    <input
                      type="number"
                      value={editFormData.total_hours_month}
                      onChange={(e) => setEditFormData({ ...editFormData, total_hours_month: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editQualificationInput}
                        onChange={(e) => setEditQualificationInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditQualification())}
                        placeholder="Ajouter une qualification"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addEditQualification}
                        className="px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editFormData.qualifications.map((qual, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {qual}
                          <button
                            type="button"
                            onClick={() => removeEditQualification(index)}
                            className="text-blue-700 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditProfessor(null)}
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

      {/* Professor Detail Modal - STATIC DATA */}
      {selectedProfessor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-[#0D529C]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedProfessor.user.first_name} {selectedProfessor.user.last_name}</h2>
                  <p className="text-blue-200">ID: {selectedProfessor.professor_code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfessor(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations Personnelles */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom Complet</p>
                    <p className="font-medium">{selectedProfessor.user.first_name} {selectedProfessor.user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedProfessor.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedProfessor.user.phone || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sexe</p>
                    <p className="font-medium">{selectedProfessor.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de Naissance</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {selectedProfessor.birth_date ? new Date(selectedProfessor.birth_date).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationalité</p>
                    <p className="font-medium">{selectedProfessor.nationality || '-'}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedProfessor.address || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations Professionnelles */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Informations Professionnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Département</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                      {selectedProfessor.department || '-'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Spécialisation</p>
                    <p className="font-medium">{selectedProfessor.specialization || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'Embauche</p>
                    <p className="font-medium">{selectedProfessor.hire_date ? new Date(selectedProfessor.hire_date).toLocaleDateString('fr-FR') : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type de Contrat</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedProfessor.contract_type === 'CDI' ? 'bg-[#0D529C] text-white' :
                      selectedProfessor.contract_type === 'CDD' ? 'bg-orange-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {selectedProfessor.contract_type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedProfessor.user.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                    }`}>
                      {selectedProfessor.user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                {selectedProfessor.qualifications && selectedProfessor.qualifications.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Qualifications</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfessor.qualifications.map((qual, idx) => (
                        <span key={idx} className="inline-flex px-3 py-1 text-xs bg-white border border-blue-200 text-blue-700 rounded-full">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedProfessor.bio && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Bio</p>
                    <p className="font-medium text-gray-700 bg-white p-3 rounded-lg mt-1">{selectedProfessor.bio}</p>
                  </div>
                )}
              </div>

              {/* Rémunération */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Rémunération & Heures
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Taux Horaire</p>
                    <p className="font-bold text-lg">{selectedProfessor.hourly_rate} MAD/h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heures ce Mois</p>
                    <p className="font-bold text-lg">{selectedProfessor.total_hours_month}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salaire Estimé (Mois)</p>
                    <p className="font-bold text-lg text-[#257035]">
                      {(selectedProfessor.hourly_rate * selectedProfessor.total_hours_month).toLocaleString()} MAD
                    </p>
                  </div>
                </div>
              </div>

              {/* Cours Assignés - STATIC */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Cours Assignés (Static)
                </h3>
                <p className="text-sm text-gray-500 italic">Données statiques - À implémenter avec la gestion des cours</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}