// src/app/admin/documents/page.tsx
'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Clock, Upload, Search, Filter, Eye, Download, X, User, FolderOpen, FileCheck, FileX, Plus } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Document {
  id: number;
  name: string;
  type: string;
  status: 'validé' | 'en_attente' | 'rejeté' | 'manquant';
  uploaded_at: string | null;
  validated_at: string | null;
  comment: string | null;
}

interface StudentDossier {
  id: number;
  student_name: string;
  student_email: string;
  program: string;
  filiere: string;
  group: string;
  dossier_status: 'complet' | 'incomplet' | 'en_attente';
  documents_required: number;
  documents_provided: number;
  documents_validated: number;
  last_update: string;
  documents: Document[];
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<StudentDossier | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    filiere: '',
    program: '',
  });

  const stats = {
    total_dossiers: 1250,
    complete_dossiers: 1050,
    incomplete_dossiers: 142,
    pending_validation: 58,
  };

  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const programs = ['Master', 'Licence'];
  const dossierStatuses = ['Complet', 'Incomplet', 'En attente'];

  const requiredDocuments = [
    'CIN ou Passeport',
    'Photo d\'identité',
    'Diplôme ou Attestation de réussite',
    'Relevé de notes',
    'Certificat médical',
    'Attestation d\'assurance',
    'Justificatif de domicile',
    'CV',
  ];

  const dossiers: StudentDossier[] = [
    {
      id: 1,
      student_name: 'Ahmed Benali',
      student_email: 'ahmed.benali@igp.edu',
      program: 'Master',
      filiere: 'Développement',
      group: 'DEV-M2-A',
      dossier_status: 'complet',
      documents_required: 8,
      documents_provided: 8,
      documents_validated: 8,
      last_update: '2024-11-10',
      documents: [
        { id: 1, name: 'CIN', type: 'cin', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
        { id: 2, name: 'Photo d\'identité', type: 'photo', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
        { id: 3, name: 'Diplôme Licence', type: 'diplome', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 4, name: 'Relevé de notes', type: 'releve', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 5, name: 'Certificat médical', type: 'medical', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 6, name: 'Attestation assurance', type: 'assurance', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 7, name: 'Justificatif domicile', type: 'domicile', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 8, name: 'CV', type: 'cv', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
      ],
    },
    {
      id: 2,
      student_name: 'Fatima Zahra',
      student_email: 'fatima.zahra@igp.edu',
      program: 'Licence',
      filiere: 'Commerce',
      group: 'COM-L3-B',
      dossier_status: 'en_attente',
      documents_required: 8,
      documents_provided: 8,
      documents_validated: 6,
      last_update: '2024-11-12',
      documents: [
        { id: 9, name: 'CIN', type: 'cin', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
        { id: 10, name: 'Photo d\'identité', type: 'photo', status: 'en_attente', uploaded_at: '2024-11-12', validated_at: null, comment: null },
        { id: 11, name: 'Baccalauréat', type: 'diplome', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 12, name: 'Relevé de notes', type: 'releve', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 13, name: 'Certificat médical', type: 'medical', status: 'en_attente', uploaded_at: '2024-11-10', validated_at: null, comment: null },
        { id: 14, name: 'Attestation assurance', type: 'assurance', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 15, name: 'Justificatif domicile', type: 'domicile', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 16, name: 'CV', type: 'cv', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
      ],
    },
    {
      id: 3,
      student_name: 'Mohamed Alaoui',
      student_email: 'mohamed.alaoui@igp.edu',
      program: 'Master',
      filiere: 'Marketing',
      group: 'MKT-M1-A',
      dossier_status: 'incomplet',
      documents_required: 8,
      documents_provided: 5,
      documents_validated: 4,
      last_update: '2024-11-08',
      documents: [
        { id: 17, name: 'Passeport', type: 'cin', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
        { id: 18, name: 'Photo d\'identité', type: 'photo', status: 'rejeté', uploaded_at: '2024-09-01', validated_at: null, comment: 'Photo floue, veuillez en fournir une nouvelle' },
        { id: 19, name: 'Diplôme Licence', type: 'diplome', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 20, name: 'Relevé de notes', type: 'releve', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 21, name: 'Certificat médical', type: 'medical', status: 'manquant', uploaded_at: null, validated_at: null, comment: null },
        { id: 22, name: 'Attestation assurance', type: 'assurance', status: 'manquant', uploaded_at: null, validated_at: null, comment: null },
        { id: 23, name: 'Justificatif domicile', type: 'domicile', status: 'manquant', uploaded_at: null, validated_at: null, comment: null },
        { id: 24, name: 'CV', type: 'cv', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
      ],
    },
    {
      id: 4,
      student_name: 'Sara Idrissi',
      student_email: 'sara.idrissi@igp.edu',
      program: 'Licence',
      filiere: 'Finance',
      group: 'FIN-L2-A',
      dossier_status: 'complet',
      documents_required: 8,
      documents_provided: 8,
      documents_validated: 8,
      last_update: '2024-10-15',
      documents: [
        { id: 25, name: 'CIN', type: 'cin', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
        { id: 26, name: 'Photo d\'identité', type: 'photo', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
        { id: 27, name: 'Baccalauréat', type: 'diplome', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 28, name: 'Relevé de notes', type: 'releve', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-03', comment: null },
        { id: 29, name: 'Certificat médical', type: 'medical', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 30, name: 'Attestation assurance', type: 'assurance', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 31, name: 'Justificatif domicile', type: 'domicile', status: 'validé', uploaded_at: '2024-09-02', validated_at: '2024-09-04', comment: null },
        { id: 32, name: 'CV', type: 'cv', status: 'validé', uploaded_at: '2024-09-01', validated_at: '2024-09-02', comment: null },
      ],
    },
  ];

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

  const resetFilters = () => {
    setFilters({ status: '', filiere: '', program: '' });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Documents & Dossiers</h1>
          <p className="text-gray-500">Gérez et validez les documents administratifs des étudiants.</p>
        </div>

        {/* Stats Grid */}
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
                  <button className="flex items-center gap-2 px-3 py-1 bg-[#0D529C] text-white rounded-lg text-sm hover:bg-blue-700">
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
                        {doc.status === 'en_attente' && (
                          <div className="flex gap-1">
                            <button className="p-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors">
                              <FileX className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {(doc.status === 'validé' || doc.status === 'en_attente') && (
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {doc.status === 'manquant' && (
                          <button className="p-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Télécharger Tout
                </button>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-[#0D529C] text-[#0D529C] rounded-lg hover:bg-blue-50 transition-colors">
                    Envoyer Rappel
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                    <FileText className="w-4 h-4" />
                    Générer Attestation
                  </button>
                </div>
              </div>
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
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Étudiant</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="">Sélectionner un étudiant</option>
                  {dossiers.map((d) => (
                    <option key={d.id} value={d.id}>{d.student_name} - {d.group}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type de Document</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="">Sélectionner le type</option>
                  {requiredDocuments.map((doc) => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fichier</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0D529C] transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cliquez ou glissez un fichier ici</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Commentaire (optionnel)</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4" />
                Uploader
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}