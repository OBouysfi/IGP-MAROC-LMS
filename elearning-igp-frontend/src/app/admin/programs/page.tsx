'use client';

import { useState, useEffect } from 'react';
import { programsApi, filieresApi, Program, Filiere, ProgramStats, FiliereStats } from '@/lib/api/admin/programs';
import { GraduationCap, BookOpen, Layers, DollarSign, Plus, Search, Edit2,SquarePen, Trash2, Eye, X, Users, Calendar, Clock } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState<'filieres' | 'programs'>('filieres');
  const [searchTerm, setSearchTerm] = useState('');
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showFiliereModal, setShowFiliereModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_filieres: 0,
    total_programs: 0,
    total_students: 0,
    total_revenue: 0,
  });

  const [filiereForm, setFiliereForm] = useState({
    name: '',
    code: '',
    description: '',
    program_ids: [] as number[],
    is_active: true,
  });

  const [programForm, setProgramForm] = useState({
    name: '',
    code: '',
    description: '',
    duration_years: 3,
    levels: [] as string[],
    inscription_fee: 0,
    monthly_fee: 0,
    requirements: [] as string[],
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'filieres') {
        const [filieresRes, filiereStatsRes, programStatsRes] = await Promise.all([
          filieresApi.getAll({ search: searchTerm }),
          filieresApi.getStats(),
          programsApi.getStats()
        ]);
        setFilieres(filieresRes.data.data);
        setStats({
          total_filieres: filiereStatsRes.data.total_filieres,
          total_programs: programStatsRes.data.total_programs,
          total_students: programStatsRes.data.total_students,
          total_revenue: programStatsRes.data.total_revenue,
        });
      } else {
        const [programsRes, programStatsRes, filiereStatsRes] = await Promise.all([
          programsApi.getAll({ search: searchTerm }),
          programsApi.getStats(),
          filieresApi.getStats()
        ]);
        setPrograms(programsRes.data.data);
        setStats({
          total_filieres: filiereStatsRes.data.total_filieres,
          total_programs: programStatsRes.data.total_programs,
          total_students: programStatsRes.data.total_students,
          total_revenue: programStatsRes.data.total_revenue,
        });
      }
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

  const handleFiliereSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedFiliere) {
        await filieresApi.update(selectedFiliere.id, filiereForm);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Filière modifiée avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      } else {
        await filieresApi.create(filiereForm);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Filière créée avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      }
      setShowFiliereModal(false);
      resetFiliereForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving filiere:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de sauvegarder la filière',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProgram) {
        await programsApi.update(selectedProgram.id, programForm);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Programme modifié avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      } else {
        await programsApi.create(programForm);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Programme créé avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      }
      setShowProgramModal(false);
      resetProgramForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving program:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de sauvegarder le programme',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleDeleteFiliere = async (filiere: Filiere) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer la filière <strong>${filiere.name}</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await filieresApi.delete(filiere.id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Filière supprimée avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting filiere:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer la filière',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const handleDeleteProgram = async (program: Program) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer le programme <strong>${program.name}</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await programsApi.delete(program.id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Programme supprimé avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting program:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer le programme',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const handleViewFiliere = async (filiere: Filiere) => {
    try {
      const response = await filieresApi.show(filiere.id);
      setSelectedFiliere(response.data.data);
    } catch (error) {
      console.error('Error fetching filiere details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les détails de la filière',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleViewProgram = async (program: Program) => {
    try {
      const response = await programsApi.show(program.id);
      setSelectedProgram(response.data.data);
    } catch (error) {
      console.error('Error fetching program details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les détails du programme',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const openEditFiliereModal = (filiere: Filiere) => {
    setSelectedFiliere(filiere);
    setFiliereForm({
      name: filiere.name,
      code: filiere.code,
      description: filiere.description || '',
      program_ids: filiere.program_ids || [],
      is_active: filiere.is_active,
    });
    setShowFiliereModal(true);
  };

  const openEditProgramModal = (program: Program) => {
    setSelectedProgram(program);
    setProgramForm({
      name: program.name,
      code: program.code,
      description: program.description || '',
      duration_years: program.duration_years,
      levels: program.levels || [],
      inscription_fee: program.inscription_fee,
      monthly_fee: program.monthly_fee,
      requirements: program.requirements || [],
      is_active: program.is_active,
    });
    setShowProgramModal(true);
  };

  const resetFiliereForm = () => {
    setFiliereForm({
      name: '',
      code: '',
      description: '',
      program_ids: [],
      is_active: true,
    });
    setSelectedFiliere(null);
  };

  const resetProgramForm = () => {
    setProgramForm({
      name: '',
      code: '',
      description: '',
      duration_years: 3,
      levels: [],
      inscription_fee: 0,
      monthly_fee: 0,
      requirements: [],
      is_active: true,
    });
    setSelectedProgram(null);
  };

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
              <button
                onClick={() => {
                  if (activeTab === 'filieres') {
                    resetFiliereForm();
                    setShowFiliereModal(true);
                  } else {
                    resetProgramForm();
                    setShowProgramModal(true);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
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
                        onClick={() => handleViewFiliere(filiere)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditFiliereModal(filiere)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFiliere(filiere)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
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
                        onClick={() => handleViewProgram(program)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditProgramModal(program)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(program)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
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

      {/* Filiere Detail Modal - KEEPING EXACT SAME DESIGN */}
      {selectedFiliere && !showFiliereModal && (
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
                      {selectedFiliere.created_at ? new Date(selectedFiliere.created_at).toLocaleDateString('fr-FR') : '-'}
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

      {/* Program Detail Modal - KEEPING EXACT SAME DESIGN */}
      {selectedProgram && !showProgramModal && (
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

      {/* Filiere Add/Edit Modal */}
      {/* Filiere Add/Edit Modal - UPDATE */}
{showFiliereModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
        <h2 className="text-xl font-bold">{selectedFiliere ? 'Modifier Filière' : 'Ajouter Filière'}</h2>
        <button onClick={() => { setShowFiliereModal(false); resetFiliereForm(); }} className="p-2 hover:bg-white/20 rounded-lg">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleFiliereSubmit} className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations Générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={filiereForm.name}
                onChange={(e) => setFiliereForm({ ...filiereForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                type="text"
                required
                value={filiereForm.code}
                onChange={(e) => setFiliereForm({ ...filiereForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={filiereForm.description}
              onChange={(e) => setFiliereForm({ ...filiereForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
            />
          </div>
        </div>

        {/* NOUVELLE SECTION - Programmes */}
        <div className="bg-purple-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-purple-600 mb-4">Programmes Associés</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner les programmes *
            </label>
            <div className="space-y-2">
              {programs.map((program) => (
                <label
                  key={program.id}
                  className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-500 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filiereForm.program_ids.includes(program.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFiliereForm({
                          ...filiereForm,
                          program_ids: [...filiereForm.program_ids, program.id]
                        });
                      } else {
                        setFiliereForm({
                          ...filiereForm,
                          program_ids: filiereForm.program_ids.filter(id => id !== program.id)
                        });
                      }
                    }}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-900">{program.name}</span>
                    <span className="ml-2 text-xs text-gray-500">({program.code})</span>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {program.duration_years} ans
                  </span>
                </label>
              ))}
            </div>
            {filiereForm.program_ids.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Vous devez sélectionner au moins un programme</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#0D529C] mb-4">Statut</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="filiere_is_active"
              checked={filiereForm.is_active}
              onChange={(e) => setFiliereForm({ ...filiereForm, is_active: e.target.checked })}
              className="w-4 h-4 text-[#0D529C] border-gray-300 rounded focus:ring-[#0D529C]"
            />
            <label htmlFor="filiere_is_active" className="ml-2 text-sm text-gray-700">
              Filière active
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => { setShowFiliereModal(false); resetFiliereForm(); }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={filiereForm.program_ids.length === 0}
            className="px-6 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedFiliere ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

  {/* Program Add/Edit Modal */}
  {showProgramModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#257035] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold">{selectedProgram ? 'Modifier Programme' : 'Ajouter Programme'}</h2>
          <button onClick={() => { setShowProgramModal(false); resetProgramForm(); }} className="p-2 hover:bg-white/20 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleProgramSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#257035] mb-4">Informations Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={programForm.name}
                  onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  required
                  value={programForm.code}
                  onChange={(e) => setProgramForm({ ...programForm, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (années) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={programForm.duration_years}
                  onChange={(e) => setProgramForm({ ...programForm, duration_years: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0D529C] mb-4">Frais de Scolarité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais d'Inscription (MAD) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={programForm.inscription_fee}
                  onChange={(e) => setProgramForm({ ...programForm, inscription_fee: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensualité (MAD) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={programForm.monthly_fee}
                  onChange={(e) => setProgramForm({ ...programForm, monthly_fee: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-orange-600 mb-4">Niveaux</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ajouter des niveaux</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="level_input"
                  placeholder="Ex: 1ère année"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setProgramForm({
                          ...programForm,
                          levels: [...programForm.levels, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('level_input') as HTMLInputElement;
                    if (input.value.trim()) {
                      setProgramForm({
                        ...programForm,
                        levels: [...programForm.levels, input.value.trim()]
                      });
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {programForm.levels.map((level, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm"
                  >
                    {level}
                    <button
                      type="button"
                      onClick={() => {
                        setProgramForm({
                          ...programForm,
                          levels: programForm.levels.filter((_, i) => i !== index)
                        });
                      }}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-purple-600 mb-4">Conditions d'Admission</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ajouter une condition</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="requirement_input"
                  placeholder="Ex: Baccalauréat ou équivalent"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        setProgramForm({
                          ...programForm,
                          requirements: [...programForm.requirements, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('requirement_input') as HTMLInputElement;
                    if (input.value.trim()) {
                      setProgramForm({
                        ...programForm,
                        requirements: [...programForm.requirements, input.value.trim()]
                      });
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {programForm.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="flex-1 text-sm text-gray-700">{req}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProgramForm({
                          ...programForm,
                          requirements: programForm.requirements.filter((_, i) => i !== index)
                        });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#257035] mb-4">Statut</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="program_is_active"
                checked={programForm.is_active}
                onChange={(e) => setProgramForm({ ...programForm, is_active: e.target.checked })}
                className="w-4 h-4 text-[#257035] border-gray-300 rounded focus:ring-[#257035]"
              />
              <label htmlFor="program_is_active" className="ml-2 text-sm text-gray-700">
                Programme actif
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setShowProgramModal(false); resetProgramForm(); }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {selectedProgram ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
    </AdminLayout>
  );
}