'use client';

import { useState, useEffect } from 'react';
import { groupsApi, Group, GroupStats } from '@/lib/api/admin/groups';
import { Plus ,SquarePen, Trash2, Search, Filter, Eye, X, Users, BookOpen, Calendar, GraduationCap, User } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Swal from 'sweetalert2';
import { programsApi, filieresApi } from '@/lib/api/admin/programs';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [stats, setStats] = useState<GroupStats>({ total_groups: 0, active_groups: 0, avg_students: 0, total_students: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [filters, setFilters] = useState({ program_id: '', filiere_id: '', level: '' });
  const [programs, setPrograms] = useState<any[]>([]);
  const [filieres, setFilieres] = useState<any[]>([]);
  const levels = ['1ère année', '2ème année', '3ème année', 'Master 1', 'Master 2'];

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    program_id: '',
    filiere_id: '',
    level: '',
    max_students: 30,
    delegate: '',
    delegate_email: '',
    schedule: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) fetchGroups();
  }, [filters, searchTerm]);

  const fetchInitialData = async () => {
  try {
    setLoading(true);

    const [groupsRes, statsRes, programsRes, filieresRes] = await Promise.all([
      groupsApi.getAll({ ...filters, search: searchTerm }),
      groupsApi.getStats(),
      programsApi.getAll(),
      filieresApi.getAll(),
    ]);

    setGroups(groupsRes.data.data);
    setStats(statsRes.data);
    setPrograms(programsRes.data.data || []);
    setFilieres(filieresRes.data.data || []);
  } catch (error) {
    console.error('Error:', error);
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

  const fetchGroups = async () => {
    try {
      const groupsRes = await groupsApi.getAll({ ...filters, search: searchTerm });
      setGroups(groupsRes.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedGroup) {
        await groupsApi.update(selectedGroup.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Groupe modifié avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      } else {
        await groupsApi.create(formData);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Groupe créé avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      }
      setShowModal(false);
      resetForm();
      fetchGroups();
    } catch (error: any) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de sauvegarder le groupe',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleDelete = async (group: Group) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer le groupe <strong>${group.name}</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await groupsApi.delete(group.id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Groupe supprimé avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
        fetchGroups();
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer le groupe',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const handleView = async (group: Group) => {
    try {
      const response = await groupsApi.show(group.id);
      setSelectedGroup(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les détails',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const openEditModal = (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      code: group.code,
      // program_id: group.program_id?.toString() || '',
      program_id: group.program?.toString() || '',
      filiere_id: group.filiere_id?.toString() || '',
      level: group.level,
      max_students: group.max_students,
      delegate: group.delegate || '',
      delegate_email: group.delegate_email || '',
      schedule: group.schedule || [],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      program_id: '',
      filiere_id: '',
      level: '',
      max_students: 30,
      delegate: '',
      delegate_email: '',
      schedule: [],
    });
    setSelectedGroup(null);
  };

  const resetFilters = () => {
    setFilters({ program_id: '', filiere_id: '', level: '' });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Gestion des Groupes</h1>
          <p className="text-gray-500">Gérez les classes et groupes d'étudiants.</p>
        </div>

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

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Groupes</h2>
              <p className="text-sm text-gray-500 mt-1">Tous les groupes et classes</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Créer Groupe
            </button>
          </div>

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
                    value={filters.program_id}
                    onChange={(e) => setFilters({ ...filters, program_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les programmes</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Filière</label>
                  <select
                    value={filters.filiere_id}
                    onChange={(e) => setFilters({ ...filters, filiere_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Toutes les filières</option>
                    {filieres.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
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

          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : (
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
                          <span className="text-sm font-medium">{group.students_count || 0}/{group.max_students}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{group.courses_count || 0} cours</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleView(group)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(group)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-yellow-500 hover:text-white transition-colors ml-1"
                        >
                        <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(group)}
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
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedGroup ? 'Modifier Groupe' : 'Créer Groupe'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programme *</label>
                    <select
                      required
                      value={formData.program_id}
                      onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière *</label>
                    <select
                      required
                      value={formData.filiere_id}
                      onChange={(e) => setFormData({ ...formData, filiere_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {filieres.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      {levels.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacité Max *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.max_students}
                      onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Délégué de Classe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Délégué</label>
                    <input
                      type="text"
                      value={formData.delegate}
                      onChange={(e) => setFormData({ ...formData, delegate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email du Délégué</label>
                    <input
                      type="email"
                      value={formData.delegate_email}
                      onChange={(e) => setFormData({ ...formData, delegate_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedGroup ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{selectedGroup.name}</h2>
                  <span className="inline-flex px-3 py-1 text-xs font-bold rounded bg-white/20">
                    {selectedGroup.code}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setShowDetailModal(false); setSelectedGroup(null); }}
                className="p-2 hover:bg-white/20 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                    <p className="font-medium">{selectedGroup.students?.length || 0} / {selectedGroup.max_students} étudiants</p>
                  </div>
                </div>
                {selectedGroup.delegate && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Délégué de Classe</p>
                    <p className="font-medium">{selectedGroup.delegate}</p>
                    <p className="text-xs text-gray-500">{selectedGroup.delegate_email}</p>
                  </div>
                )}
              </div>

              {selectedGroup.students && selectedGroup.students.length > 0 && (
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
              )}

              {selectedGroup.courses && selectedGroup.courses.length > 0 && (
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
                          <tr key={course.id} className="border-t border-gray-100">
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
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}