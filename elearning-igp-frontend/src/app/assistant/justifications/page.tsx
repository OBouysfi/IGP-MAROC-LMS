'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, CheckCircle, XCircle, Eye, Download, Calendar, User, Filter, Clock } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';
import { assistantJustificationApi, Justification, Group } from '@/lib/api/assistant/justifications';
import Swal from 'sweetalert2';

export default function AssistantJustificationsPage() {
  const [justifications, setJustifications] = useState<Justification[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGroup, setFilterGroup] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJustification, setSelectedJustification] = useState<Justification | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchJustifications();
  }, [filterStatus, filterGroup]);

  const fetchGroups = async () => {
    try {
      const data = await assistantJustificationApi.getGroups();
      setGroups(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les groupes',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const fetchJustifications = async () => {
    try {
      setLoading(true);
      const data = await assistantJustificationApi.getAll(filterStatus || undefined, filterGroup || undefined);
      setJustifications(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les justificatifs',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveJustification = async (id: number) => {
    try {
      await assistantJustificationApi.approve(id, reviewComment);
      
      Swal.fire({
        icon: 'success',
        title: 'Approuvé',
        text: 'Justificatif approuvé avec succès',
        confirmButtonColor: '#257035',
      });

      setSelectedJustification(null);
      setReviewComment('');
      fetchJustifications();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible d\'approuver le justificatif',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const rejectJustification = async (id: number) => {
    if (!reviewComment) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez ajouter un commentaire pour le rejet',
        confirmButtonColor: '#C1272D',
      });
      return;
    }

    try {
      await assistantJustificationApi.reject(id, reviewComment);
      
      Swal.fire({
        icon: 'success',
        title: 'Rejeté',
        text: 'Justificatif rejeté avec succès',
        confirmButtonColor: '#257035',
      });

      setSelectedJustification(null);
      setReviewComment('');
      fetchJustifications();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de rejeter le justificatif',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const downloadDocument = async (id: number, filename: string) => {
    try {
      const blob = await assistantJustificationApi.download(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de télécharger le document',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const filteredJustifications = justifications.filter(justif => {
    if (searchTerm && !justif.student_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: justifications.length,
    pending: justifications.filter(j => j.status === 'pending').length,
    approved: justifications.filter(j => j.status === 'approved').length,
    rejected: justifications.filter(j => j.status === 'rejected').length,
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1272D]"></div>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Gestion des Justificatifs</h1>
          <p className="text-gray-500">Validez ou rejetez les justificatifs d'absence soumis par les étudiants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En attente</p>
                <p className="text-xl font-bold text-orange-500">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Approuvés</p>
                <p className="text-xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Rejetés</p>
                <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
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
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
            <select
              value={filterGroup || ''}
              onChange={(e) => setFilterGroup(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
            >
              <option value="">Tous les groupes</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiant</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Absence</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Raison</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Document</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJustifications.map((justif) => (
                <tr key={justif.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{justif.student_name}</p>
                      <p className="text-xs text-gray-500">{justif.group}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-900">{new Date(justif.absence_date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-xs text-gray-500">{justif.absence_course}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{justif.reason}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={() => downloadDocument(justif.id, justif.document_name)}
                      className="inline-flex items-center gap-1 text-sm text-[#0D529C] hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      {justif.document_name}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(justif.status)}`}>
                      {getStatusLabel(justif.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedJustification(justif)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#C1272D] text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredJustifications.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun justificatif trouvé</p>
            </div>
          )}
        </div>
      </div>

      {selectedJustification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#C1272D] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Détails du Justificatif</h2>
                <button
                  onClick={() => setSelectedJustification(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Informations Étudiant</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Nom</p>
                    <p className="font-medium">{selectedJustification.student_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Groupe</p>
                    <p className="font-medium">{selectedJustification.group}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{selectedJustification.student_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Soumis le</p>
                    <p className="font-medium">{new Date(selectedJustification.submitted_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-bold text-[#C1272D] mb-3">Détails de l'Absence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedJustification.absence_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cours</p>
                    <p className="font-medium">{selectedJustification.absence_course}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Motif</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedJustification.reason}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Pièce Justificative</h3>
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#0D529C]" />
                    <span className="font-medium text-[#0D529C]">{selectedJustification.document_name}</span>
                  </div>
                  <button 
                    onClick={() => downloadDocument(selectedJustification.id, selectedJustification.document_name)}
                    className="flex items-center gap-1 px-3 py-1 bg-[#0D529C] text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              </div>

              {selectedJustification.status !== 'pending' && (
                <div className={`rounded-lg p-4 ${
                  selectedJustification.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <h3 className={`font-bold mb-2 ${
                    selectedJustification.status === 'approved' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {selectedJustification.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                  </h3>
                  <p className="text-sm text-gray-600">Par: {selectedJustification.reviewed_by}</p>
                  <p className="text-sm text-gray-600">Le: {new Date(selectedJustification.reviewed_at!).toLocaleString('fr-FR')}</p>
                  {selectedJustification.comment && (
                    <p className="text-sm text-gray-700 mt-2 italic">"{selectedJustification.comment}"</p>
                  )}
                </div>
              )}

              {selectedJustification.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Commentaire (obligatoire pour rejet)</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Ajoutez un commentaire..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveJustification(selectedJustification.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approuver
                    </button>
                    <button
                      onClick={() => rejectJustification(selectedJustification.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Rejeter
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedJustification(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AssistantLayout>
  );
}