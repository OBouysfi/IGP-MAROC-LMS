// src/app/professor/sessions/page.tsx
'use client';

import React, { useState } from 'react';
import { Video, Users, Calendar, Clock, Plus, Play, X, Eye, Link2, Copy, CheckCircle, Settings, Mic, MicOff, VideoOff, Monitor } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';

interface Session {
  id: number;
  title: string;
  course: string;
  course_code: string;
  group: string;
  description: string;
  date: string;
  start_time: string;
  duration: string;
  status: 'planifiée' | 'en_cours' | 'terminée' | 'annulée';
  max_participants: number;
  registered_participants: number;
  joined_participants: number;
  room_url: string;
  recording_enabled: boolean;
  chat_enabled: boolean;
}

export default function ProfessorSessionsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSessionDetail, setShowSessionDetail] = useState<Session | null>(null);
  const [showJoinModal, setShowJoinModal] = useState<Session | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const [newSession, setNewSession] = useState({
    title: '',
    course: '',
    group: '',
    description: '',
    date: '',
    start_time: '',
    duration: '60',
    max_participants: 50,
    recording_enabled: true,
    chat_enabled: true,
  });

  const myCourses = [
    { name: 'React.js Avancé', code: 'DEV-REACT', groups: ['DEV-M2-A'] },
    { name: 'Node.js & Express', code: 'DEV-NODE', groups: ['DEV-M2-A'] },
    { name: 'Introduction au Web', code: 'DEV-WEB', groups: ['DEV-L1-A'] },
    { name: 'JavaScript Moderne', code: 'DEV-JS', groups: ['DEV-L2-A'] },
    { name: 'Base de données NoSQL', code: 'DEV-NOSQL', groups: ['DEV-M2-A'] },
  ];

  const sessions: Session[] = [
    {
      id: 1,
      title: 'Hooks Avancés et Performance',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      group: 'DEV-M2-A',
      description: 'Exploration des hooks personnalisés, useCallback, useMemo et optimisation des performances React.',
      date: '2024-11-18',
      start_time: '10:00',
      duration: '90',
      status: 'planifiée',
      max_participants: 30,
      registered_participants: 22,
      joined_participants: 0,
      room_url: 'https://meet.jit.si/IGP-REACT-SESSION-001',
      recording_enabled: true,
      chat_enabled: true,
    },
    {
      id: 2,
      title: 'API REST et Authentification JWT',
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      group: 'DEV-M2-A',
      description: 'Création d\'une API REST complète avec authentification JWT et middleware de sécurité.',
      date: '2024-11-20',
      start_time: '14:00',
      duration: '120',
      status: 'planifiée',
      max_participants: 35,
      registered_participants: 25,
      joined_participants: 0,
      room_url: 'https://meet.jit.si/IGP-NODE-SESSION-002',
      recording_enabled: true,
      chat_enabled: true,
    },
    {
      id: 3,
      title: 'Introduction à Flexbox et Grid',
      course: 'Introduction au Web',
      course_code: 'DEV-WEB',
      group: 'DEV-L1-A',
      description: 'Maîtrise des layouts modernes avec CSS Flexbox et Grid.',
      date: '2024-11-15',
      start_time: '09:00',
      duration: '60',
      status: 'terminée',
      max_participants: 40,
      registered_participants: 35,
      joined_participants: 32,
      room_url: 'https://meet.jit.si/IGP-WEB-SESSION-003',
      recording_enabled: true,
      chat_enabled: true,
    },
    {
      id: 4,
      title: 'Promises et Async/Await',
      course: 'JavaScript Moderne',
      course_code: 'DEV-JS',
      group: 'DEV-L2-A',
      description: 'Programmation asynchrone en JavaScript avec Promises et async/await.',
      date: '2024-11-22',
      start_time: '14:00',
      duration: '90',
      status: 'planifiée',
      max_participants: 35,
      registered_participants: 18,
      joined_participants: 0,
      room_url: 'https://meet.jit.si/IGP-JS-SESSION-004',
      recording_enabled: false,
      chat_enabled: true,
    },
    {
      id: 5,
      title: 'Session de Questions/Réponses',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      group: 'DEV-M2-A',
      description: 'Session ouverte pour répondre aux questions sur le projet final.',
      date: '2024-11-16',
      start_time: '16:00',
      duration: '60',
      status: 'en_cours',
      max_participants: 30,
      registered_participants: 20,
      joined_participants: 15,
      room_url: 'https://meet.jit.si/IGP-REACT-QA-005',
      recording_enabled: false,
      chat_enabled: true,
    },
  ];

  const stats = {
    total_sessions: sessions.length,
    upcoming: sessions.filter(s => s.status === 'planifiée').length,
    live_now: sessions.filter(s => s.status === 'en_cours').length,
    completed: sessions.filter(s => s.status === 'terminée').length,
    total_participants: sessions.reduce((sum, s) => sum + s.registered_participants, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planifiée': return 'bg-[#0D529C] text-white';
      case 'en_cours': return 'bg-[#257035] text-white animate-pulse';
      case 'terminée': return 'bg-gray-500 text-white';
      case 'annulée': return 'bg-[#C1272D] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planifiée': return 'Planifiée';
      case 'en_cours': return '🔴 En direct';
      case 'terminée': return 'Terminée';
      case 'annulée': return 'Annulée';
      default: return status;
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filterStatus && session.status !== filterStatus) return false;
    if (filterCourse && session.course !== filterCourse) return false;
    return true;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateSession = () => {
    // Logic to create session
    setShowCreateModal(false);
    alert('Session créée avec succès!');
  };

  const startSession = (session: Session) => {
    setShowJoinModal(session);
  };

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Sessions Live</h1>
          <p className="text-gray-500">Planifiez et gérez vos sessions de cours en ligne avec Jitsi Meet.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Sessions</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_sessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">À venir</p>
                <p className="text-xl font-bold text-orange-500">{stats.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En Direct</p>
                <p className="text-xl font-bold text-[#257035]">{stats.live_now}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Terminées</p>
                <p className="text-xl font-bold text-gray-500">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Participants</p>
                <p className="text-xl font-bold text-purple-500">{stats.total_participants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-4">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Tous les cours</option>
                {myCourses.map((course) => (
                  <option key={course.code} value={course.name}>{course.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="planifiée">Planifiée</option>
                <option value="en_cours">En cours</option>
                <option value="terminée">Terminée</option>
              </select>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Session
            </button>
          </div>
        </div>

        {/* Live Session Alert */}
        {stats.live_now > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#257035] rounded-full animate-pulse"></div>
              <span className="font-medium text-[#257035]">
                {stats.live_now} session(s) en cours actuellement
              </span>
            </div>
            <button className="text-sm text-[#257035] hover:underline">
              Voir les sessions live
            </button>
          </div>
        )}

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow ${
              session.status === 'en_cours' ? 'border-[#257035] border-2' : 'border-gray-200'
            }`}>
              {/* Header */}
              <div className={`p-4 text-white ${
                session.status === 'en_cours' 
                  ? 'bg-gradient-to-r from-[#257035] to-green-500' 
                  : 'bg-gradient-to-r from-[#0D529C] to-blue-600'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusColor(session.status)}`}>
                    {getStatusLabel(session.status)}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {session.duration} min
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{session.title}</h3>
                <p className="text-sm opacity-90">{session.course}</p>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{session.start_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {session.status === 'en_cours' 
                        ? `${session.joined_participants}/${session.registered_participants} connectés`
                        : `${session.registered_participants}/${session.max_participants} inscrits`
                      }
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center gap-3">
                  {session.recording_enabled && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Enregistrement
                    </span>
                  )}
                  {session.chat_enabled && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">
                      Chat activé
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setShowSessionDetail(session)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Détails
                </button>
                {session.status === 'planifiée' && (
                  <button
                    onClick={() => startSession(session)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Démarrer
                  </button>
                )}
                {session.status === 'en_cours' && (
                  <button
                    onClick={() => startSession(session)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors text-sm animate-pulse"
                  >
                    <Video className="w-4 h-4" />
                    Rejoindre
                  </button>
                )}
                {session.status === 'terminée' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Terminée
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune session trouvée</p>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Créer une Session Live</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Titre de la session</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  placeholder="Ex: Hooks Avancés et Performance"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cours</label>
                  <select
                    value={newSession.course}
                    onChange={(e) => setNewSession({ ...newSession, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Sélectionner un cours</option>
                    {myCourses.map((course) => (
                      <option key={course.code} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Groupe</label>
                  <select
                    value={newSession.group}
                    onChange={(e) => setNewSession({ ...newSession, group: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Sélectionner un groupe</option>
                    <option value="DEV-M2-A">DEV-M2-A</option>
                    <option value="DEV-M1-A">DEV-M1-A</option>
                    <option value="DEV-L1-A">DEV-L1-A</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Décrivez le contenu de la session..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Heure</label>
                  <input
                    type="time"
                    value={newSession.start_time}
                    onChange={(e) => setNewSession({ ...newSession, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Durée (min)</label>
                  <select
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre max de participants</label>
                <input
                  type="number"
                  value={newSession.max_participants}
                  onChange={(e) => setNewSession({ ...newSession, max_participants: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Options de la session</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Activer l'enregistrement</span>
                  <button
                    onClick={() => setNewSession({ ...newSession, recording_enabled: !newSession.recording_enabled })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      newSession.recording_enabled ? 'bg-[#257035]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      newSession.recording_enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Activer le chat</span>
                  <button
                    onClick={() => setNewSession({ ...newSession, chat_enabled: !newSession.chat_enabled })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      newSession.chat_enabled ? 'bg-[#257035]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      newSession.chat_enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateSession}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Créer la Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {showSessionDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{showSessionDetail.title}</h2>
                  <p className="text-blue-200">{showSessionDetail.course} • {showSessionDetail.group}</p>
                </div>
                <button onClick={() => setShowSessionDetail(null)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-3">Description</h3>
                <p className="text-gray-700">{showSessionDetail.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Calendar className="w-6 h-6 text-[#0D529C] mx-auto mb-2" />
                  <p className="text-sm font-medium">{new Date(showSessionDetail.date).toLocaleDateString('fr-FR')}</p>
                  <p className="text-xs text-gray-500">Date</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">{showSessionDetail.start_time}</p>
                  <p className="text-xs text-gray-500">Heure</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Video className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">{showSessionDetail.duration} min</p>
                  <p className="text-xs text-gray-500">Durée</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-[#257035] mx-auto mb-2" />
                  <p className="text-sm font-medium">{showSessionDetail.registered_participants}/{showSessionDetail.max_participants}</p>
                  <p className="text-xs text-gray-500">Inscrits</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-3">Lien de la Session</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={showSessionDetail.room_url}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(showSessionDetail.room_url)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? 'Copié!' : 'Copier'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSessionDetail(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                {showSessionDetail.status !== 'terminée' && (
                  <button
                    onClick={() => {
                      setShowSessionDetail(null);
                      startSession(showSessionDetail);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
                  >
                    <Play className="w-4 h-4" />
                    {showSessionDetail.status === 'en_cours' ? 'Rejoindre' : 'Démarrer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Session Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Rejoindre la Session</h2>
                <button onClick={() => setShowJoinModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#257035] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{showJoinModal.title}</h3>
                <p className="text-sm text-gray-500">{showJoinModal.course}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Vérifiez vos paramètres</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Microphone</span>
                  </div>
                  <span className="text-xs text-[#257035] font-medium">Activé</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Caméra</span>
                  </div>
                  <span className="text-xs text-[#257035] font-medium">Activée</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Partage d'écran</span>
                  </div>
                  <span className="text-xs text-gray-500">Disponible</span>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  <strong>Note:</strong> Vous serez redirigé vers Jitsi Meet dans un nouvel onglet.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowJoinModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  window.open(showJoinModal.room_url, '_blank');
                  setShowJoinModal(null);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                Lancer la Session
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessorLayout>
  );
}