// src/app/admin/documents/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { documentsApi, StudentDossier, DocumentStats, Document } from '@/lib/api/admin/documents';
import { FileText, CheckCircle, AlertTriangle, Clock, Upload, Search, Filter, Eye, Download, X, User, FolderOpen, FileCheck, FileX, Plus } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<StudentDossier | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dossiers, setDossiers] = useState<StudentDossier[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [requiredDocuments, setRequiredDocuments] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    status: '',
    filiere: '',
    program: '',
  });

  const [uploadForm, setUploadForm] = useState({
    student_id: 0,
    name: '',
    type: '',
    file: null as File | null,
    comment: '',
  });

  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const programs = ['Master', 'Licence'];
  const dossierStatuses = ['Complet', 'Incomplet', 'En attente'];

  useEffect(() => {
    fetchData();
  }, [filters, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, dossiersRes, requiredDocsRes] = await Promise.all([
        documentsApi.getStats(),
        documentsApi.getDossiers({ search: searchTerm, ...filters }),
        documentsApi.getRequiredDocuments()
      ]);
      
      setStats(statsRes.data);
      setDossiers(dossiersRes.data.data);
      setRequiredDocuments(requiredDocsRes.data.data);
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner un fichier',
        confirmButtonColor: '#0D529C',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('student_id', uploadForm.student_id.toString());
      formData.append('name', uploadForm.name);
      formData.append('type', uploadForm.type);
      formData.append('file', uploadForm.file);
      if (uploadForm.comment) {
        formData.append('comment', uploadForm.comment);
      }

      await documentsApi.upload(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Document uploadé avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      
      setShowUploadModal(false);
      resetUploadForm();
      fetchData();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible d\'uploader le document',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleValidate = async (documentId: number, status: 'validé' | 'rejeté') => {
    let comment = '';
    
    if (status === 'rejeté') {
      const result = await Swal.fire({
        title: 'Motif de rejet',
        input: 'textarea',
        inputLabel: 'Veuillez indiquer le motif du rejet',
        inputPlaceholder: 'Ex: Document illisible, informations manquantes...',
        showCancelButton: true,
        confirmButtonColor: '#C1272D',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Rejeter',
        cancelButtonText: 'Annuler',
        inputValidator: (value) => {
          if (!value) {
            return 'Vous devez indiquer un motif!';
          }
        }
      });

      if (!result.isConfirmed) return;
      comment = result.value;
    } else {
      const result = await Swal.fire({
        title: 'Valider le document',
        text: 'Êtes-vous sûr de vouloir valider ce document ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#257035',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Valider',
        cancelButtonText: 'Annuler',
      });

      if (!result.isConfirmed) return;
    }

    try {
      await documentsApi.validate(documentId, { status, comment });
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: status === 'validé' ? 'Document validé avec succès' : 'Document rejeté',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      
      fetchData();
      if (selectedDossier) {
        const updatedDossier = dossiers.find(d => d.id === selectedDossier.id);
        if (updatedDossier) {
          setSelectedDossier(updatedDossier);
        }
      }
    } catch (error: any) {
      console.error('Error validating document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de valider le document',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleDownload = async (documentId: number) => {
    try {
      const response = await documentsApi.download(documentId);

      const contentDisposition = response.headers['content-disposition'];
      let filename = "document";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);  // ⬅ Téléchargement direct
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de télécharger le document',
        confirmButtonColor: '#0D529C',
      });
    }
  };
  const resetUploadForm = () => {
    setUploadForm({
      student_id: 0,
      name: '',
      type: '',
      file: null,
      comment: '',
    });
  };

  const resetFilters = () => {
    setFilters({ status: '', filiere: '', program: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complet': return 'bg-[#257035] text-white';
      case 'incomplet': return 'bg-[#C1272D] text-white';
      case 'en_attente': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'complet': return 'Complet';
      case 'incomplet': return 'Incomplet';
      case 'en_attente': return 'En attente';
      default: return status;
    }
  };

  const getDocStatusColor = (status: string) => {
    switch (status) {
      case 'validé': return 'bg-[#257035] text-white';
      case 'en_attente': return 'bg-orange-500 text-white';
      case 'rejeté': return 'bg-[#C1272D] text-white';
      case 'manquant': return 'bg-gray-400 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDocStatusLabel = (status: string) => {
    switch (status) {
      case 'validé': return 'Validé';
      case 'en_attente': return 'En attente';
      case 'rejeté': return 'Rejeté';
      case 'manquant': return 'Manquant';
      default: return status;
    }
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'validé': return <FileCheck className="w-4 h-4" />;
      case 'en_attente': return <Clock className="w-4 h-4" />;
      case 'rejeté': return <FileX className="w-4 h-4" />;
      case 'manquant': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Documents & Dossiers</h1>
          <p className="text-gray-500">Gérez et validez les documents administratifs des étudiants.</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Dossiers</p>
                  <p className="text-3xl font-bold text-[#0D529C]">{stats.total_dossiers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-[#0D529C]" />
                </div>
              </div>
              <p className="text-xs text-gray-400">Dossiers étudiants</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dossiers Complets</p>
                  <p className="text-3xl font-bold text-[#257035]">{stats.complete_dossiers}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#257035]" />
                </div>
              </div>
              <p className="text-xs text-gray-400">Tous documents validés</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#C1272D] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dossiers Incomplets</p>
                  <p className="text-3xl font-bold text-[#C1272D]">{stats.incomplete_dossiers}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#C1272D]" />
                </div>
              </div>
              <p className="text-xs text-gray-400">Documents manquants</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">En Attente</p>
                  <p className="text-3xl font-bold text-orange-500">{stats.pending_validation}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-gray-400">À valider</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Dossiers Étudiants</h2>
              <p className="text-sm text-gray-500 mt-1">Suivez et validez les documents de chaque étudiant</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <Upload className="w-4 h-4" />
                Ajouter Document
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                <Download className="w-4 h-4" />
                Exporter Liste
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, groupe..."
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Statut Dossier</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les statuts</option>
                    {dossierStatuses.map((s) => (
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
              </div>
            </div>
          )}

          {/* Dossiers Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiant</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Groupe</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Programme</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Documents</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Progression</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mise à jour</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dossiers.map((dossier) => (
                  <tr key={dossier.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{dossier.student_name}</p>
                        <p className="text-xs text-gray-500">{dossier.student_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                        {dossier.group}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white w-fit">
                          {dossier.program}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white w-fit">
                          {dossier.filiere}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <span className="font-medium">{dossier.documents_validated}</span>
                        <span className="text-gray-500">/{dossier.documents_required} validés</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">{dossier.documents_provided}/{dossier.documents_required}</span>
                          <span className="text-xs font-medium">{Math.round((dossier.documents_validated / dossier.documents_required) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              dossier.dossier_status === 'complet' ? 'bg-[#257035]' :
                              dossier.dossier_status === 'en_attente' ? 'bg-orange-500' :
                              'bg-[#C1272D]'
                            }`}
                            style={{ width: `${(dossier.documents_validated / dossier.documents_required) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(dossier.dossier_status)}`}>
                        {getStatusLabel(dossier.dossier_status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {new Date(dossier.last_update).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedDossier(dossier)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dossier Detail Modal */}
      {selectedDossier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#0D529C]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDossier.student_name}</h2>
                  <p className="text-blue-200">{selectedDossier.student_email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex px-2 py-0.5 text-xs rounded bg-white/20">{selectedDossier.group}</span>
                    <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedDossier.dossier_status)}`}>
                      {getStatusLabel(selectedDossier.dossier_status)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDossier(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Progression */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Progression du Dossier</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#0D529C]">{selectedDossier.documents_provided}</p>
                    <p className="text-xs text-gray-500">Documents Fournis</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#257035]">{selectedDossier.documents_validated}</p>
                    <p className="text-xs text-gray-500">Documents Validés</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-500">
                      {selectedDossier.documents_required - selectedDossier.documents_validated}
                    </p>
                    <p className="text-xs text-gray-500">Reste à Valider</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-[#257035] to-green-400 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(selectedDossier.documents_validated / selectedDossier.documents_required) * 100}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {Math.round((selectedDossier.documents_validated / selectedDossier.documents_required) * 100)}% complété
                </p>
              </div>

              {/* Liste des Documents */}
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0D529C]">Documents du Dossier</h3>
                  <button
                    onClick={() => {
                      setUploadForm({ ...uploadForm, student_id: selectedDossier.student_id });
                      setShowUploadModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-[#0D529C] text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedDossier.documents.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          doc.status === 'validé' ? 'bg-green-50 text-[#257035]' :
                          doc.status === 'en_attente' ? 'bg-orange-50 text-orange-500' :
                          doc.status === 'rejeté' ? 'bg-red-50 text-[#C1272D]' :
                          'bg-gray-50 text-gray-400'
                        }`}>
                          {getDocStatusIcon(doc.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          {doc.uploaded_at && (
                            <p className="text-xs text-gray-500">
                              Uploadé le {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                          {doc.comment && (
                            <p className="text-xs text-[#C1272D] mt-1">{doc.comment}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getDocStatusColor(doc.status)}`}>
                          {getDocStatusLabel(doc.status)}
                        </span>
                        {doc.status === 'en_attente' && doc.id && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleValidate(doc.id!, 'validé')}
                              className="p-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleValidate(doc.id!, 'rejeté')}
                              className="p-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <FileX className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {(doc.status === 'validé' || doc.status === 'en_attente') && doc.id && (
                          <button
                            onClick={() => handleDownload(doc.id!)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {doc.status === 'manquant' && (
                          <button
                            onClick={() => {
                              setUploadForm({ ...uploadForm, student_id: selectedDossier.student_id, type: doc.type, name: doc.name });
                              setShowUploadModal(true);
                            }}
                            className="p-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {/* <div className="flex items-end justify-end">
                
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-[#0D529C] text-[#0D529C] rounded-lg hover:bg-blue-50 transition-colors">
                    Envoyer Rappel
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                    <FileText className="w-4 h-4" />
                    Générer Attestation
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Ajouter un Document</h2>
                <button
                  onClick={() => { setShowUploadModal(false); resetUploadForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Étudiant *</label>
                <select
                  required
                  value={uploadForm.student_id}
                  onChange={(e) => setUploadForm({ ...uploadForm, student_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  <option value={0}>Sélectionner un étudiant</option>
                  {dossiers.map((d) => (
                    <option key={d.id} value={d.student_id}>{d.student_name} - {d.group}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type de Document *</label>
                <select
                  required
                  value={uploadForm.type}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setUploadForm({ 
                      ...uploadForm, 
                      type: selectedType,
                      name: requiredDocuments[selectedType] || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  <option value="">Sélectionner le type</option>
                  {Object.entries(requiredDocuments).map(([key, value]) => (
                    <option key={key} value={key}>{value as string}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fichier *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Commentaire (optionnel)</label>
                <textarea
                  value={uploadForm.comment}
                  onChange={(e) => setUploadForm({ ...uploadForm, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); resetUploadForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Uploader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}