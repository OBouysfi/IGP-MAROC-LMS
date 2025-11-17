// src/app/admin/support/page.tsx
'use client';

import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Plus, Search, Filter, Eye, Reply, X, User, Calendar } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Ticket {
  id: number;
  subject: string;
  message: string;
  user_name: string;
  user_email: string;
  user_role: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  responses: { author: string; message: string; date: string; is_admin: boolean }[];
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
  });

  const stats = {
    total_tickets: 156,
    open_tickets: 23,
    in_progress: 18,
    resolved: 115,
  };

  const categories = ['Technique', 'Pédagogique', 'Administratif', 'Finance', 'Autre'];
  const priorities = ['Haute', 'Moyenne', 'Basse'];
  const statuses = ['Ouvert', 'En cours', 'Résolu', 'Fermé'];

  const tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Impossible d\'accéder au cours React.js',
      message: 'Bonjour, je n\'arrive pas à accéder au cours React.js Avancé. Quand je clique sur le lien, j\'ai une erreur 403. Pouvez-vous m\'aider svp?',
      user_name: 'Ahmed Benali',
      user_email: 'ahmed.benali@igp.edu',
      user_role: 'Étudiant',
      category: 'Technique',
      priority: 'Haute',
      status: 'Ouvert',
      created_at: '2024-11-10T09:30:00',
      updated_at: '2024-11-10T09:30:00',
      responses: [],
    },
    {
      id: 2,
      subject: 'Demande de report d\'examen',
      message: 'Suite à un problème de santé, je souhaite reporter mon examen de Marketing Digital prévu le 15 novembre. J\'ai un certificat médical à fournir.',
      user_name: 'Fatima Zahra',
      user_email: 'fatima.zahra@igp.edu',
      user_role: 'Étudiant',
      category: 'Pédagogique',
      priority: 'Moyenne',
      status: 'En cours',
      created_at: '2024-11-09T14:15:00',
      updated_at: '2024-11-10T10:00:00',
      responses: [
        {
          author: 'Admin Support',
          message: 'Bonjour Fatima, merci de nous envoyer votre certificat médical par email. Nous transmettrons votre demande au département pédagogique.',
          date: '2024-11-10T10:00:00',
          is_admin: true,
        },
      ],
    },
    {
      id: 3,
      subject: 'Problème de paiement mensualité',
      message: 'J\'ai effectué le virement pour ma mensualité d\'octobre mais elle n\'apparaît pas dans mon espace. Référence: VIR2024OCT123',
      user_name: 'Mohamed Alaoui',
      user_email: 'mohamed.alaoui@igp.edu',
      user_role: 'Étudiant',
      category: 'Finance',
      priority: 'Haute',
      status: 'Résolu',
      created_at: '2024-11-08T11:00:00',
      updated_at: '2024-11-09T16:30:00',
      responses: [
        {
          author: 'Admin Support',
          message: 'Bonjour Mohamed, nous vérifions avec le service comptabilité. Pouvez-vous nous fournir une copie du reçu de virement?',
          date: '2024-11-08T14:00:00',
          is_admin: true,
        },
        {
          author: 'Mohamed Alaoui',
          message: 'Voici le reçu en pièce jointe.',
          date: '2024-11-08T15:30:00',
          is_admin: false,
        },
        {
          author: 'Admin Support',
          message: 'Merci! Le paiement a été validé et votre compte est maintenant à jour.',
          date: '2024-11-09T16:30:00',
          is_admin: true,
        },
      ],
    },
    {
      id: 4,
      subject: 'Besoin d\'accès Jitsi Meet',
      message: 'Je suis nouveau professeur et je n\'ai pas encore reçu mes accès pour créer des sessions Jitsi Meet avec mes étudiants.',
      user_name: 'Karim Benjelloun',
      user_email: 'k.benjelloun@igp.edu',
      user_role: 'Professeur',
      category: 'Technique',
      priority: 'Moyenne',
      status: 'Ouvert',
      created_at: '2024-11-10T08:00:00',
      updated_at: '2024-11-10T08:00:00',
      responses: [],
    },
    {
      id: 5,
      subject: 'Attestation d\'inscription',
      message: 'Bonjour, j\'ai besoin d\'une attestation d\'inscription pour mon dossier de visa. Merci de me la fournir rapidement.',
      user_name: 'Sara Idrissi',
      user_email: 'sara.idrissi@igp.edu',
      user_role: 'Étudiant',
      category: 'Administratif',
      priority: 'Basse',
      status: 'Fermé',
      created_at: '2024-11-05T10:00:00',
      updated_at: '2024-11-06T09:00:00',
      responses: [
        {
          author: 'Admin Support',
          message: 'Votre attestation est prête. Vous pouvez la récupérer au secrétariat ou nous pouvons vous l\'envoyer par email.',
          date: '2024-11-06T09:00:00',
          is_admin: true,
        },
      ],
    },
  ];

  const resetFilters = () => {
    setFilters({ category: '', priority: '', status: '' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-[#C1272D] text-white';
      case 'Moyenne': return 'bg-orange-500 text-white';
      case 'Basse': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ouvert': return 'bg-[#C1272D] text-white';
      case 'En cours': return 'bg-orange-500 text-white';
      case 'Résolu': return 'bg-[#257035] text-white';
      case 'Fermé': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleReply = () => {
    if (replyMessage.trim() && selectedTicket) {
      console.log('Reply sent:', replyMessage);
      setReplyMessage('');
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Support & Tickets</h1>
          <p className="text-gray-500">Gérez les demandes d'assistance des étudiants et professeurs.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Tickets</p>
                <p className="text-3xl font-bold text-[#0D529C]">{stats.total_tickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#0D529C]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Tous les tickets créés</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#C1272D] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tickets Ouverts</p>
                <p className="text-3xl font-bold text-[#C1272D]">{stats.open_tickets}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#C1272D]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">En attente de traitement</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">En Cours</p>
                <p className="text-3xl font-bold text-orange-500">{stats.in_progress}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Tickets en traitement</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Résolus</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Tickets traités avec succès</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Tickets</h2>
              <p className="text-sm text-gray-500 mt-1">Toutes les demandes d'assistance</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <Plus className="w-4 h-4" />
              Créer Ticket
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par sujet, utilisateur..."
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Catégorie</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Priorité</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Toutes les priorités</option>
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sujet</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Utilisateur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Catégorie</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Priorité</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                      #{String(ticket.id).padStart(4, '0')}
                    </td>
                    <td className="py-4 px-4 text-gray-900 text-sm max-w-xs truncate">
                      {ticket.subject}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{ticket.user_name}</p>
                        <p className="text-xs text-gray-500">{ticket.user_role}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
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

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">Ticket #{String(selectedTicket.id).padStart(4, '0')}</h2>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <p className="text-blue-200">{selectedTicket.subject}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations Ticket */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Utilisateur</p>
                    <p className="font-medium">{selectedTicket.user_name}</p>
                    <p className="text-xs text-gray-500">{selectedTicket.user_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rôle</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white mt-1">
                      {selectedTicket.user_role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Créé le</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedTicket.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Original */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Message Original</h3>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>

              {/* Conversation */}
              {selectedTicket.responses.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0D529C] mb-4">Conversation</h3>
                  <div className="space-y-4">
                    {selectedTicket.responses.map((response, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          response.is_admin
                            ? 'bg-[#0D529C] text-white ml-8'
                            : 'bg-white border border-gray-200 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className={`font-medium text-sm ${response.is_admin ? 'text-blue-200' : 'text-gray-600'}`}>
                            {response.author}
                          </p>
                          <p className={`text-xs ${response.is_admin ? 'text-blue-200' : 'text-gray-500'}`}>
                            {new Date(response.date).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <p className={response.is_admin ? 'text-white' : 'text-gray-700'}>{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Répondre */}
              {selectedTicket.status !== 'Fermé' && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
                    <Reply className="w-5 h-5" />
                    Répondre
                  </h3>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Tapez votre réponse ici..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent resize-none"
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="En cours">Marquer: En cours</option>
                        <option value="Résolu">Marquer: Résolu</option>
                        <option value="Fermé">Marquer: Fermé</option>
                      </select>
                    </div>
                    <button
                      onClick={handleReply}
                      disabled={!replyMessage.trim()}
                      className="flex items-center gap-2 px-6 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Reply className="w-4 h-4" />
                      Envoyer
                    </button>
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