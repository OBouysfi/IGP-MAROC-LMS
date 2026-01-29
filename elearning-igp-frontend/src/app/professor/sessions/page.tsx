'use client';

import React, { useState, useEffect } from 'react';
import { Video, Users, Calendar, Clock, Plus, Play, X, Eye, Copy, CheckCircle, Loader2 } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';
import { professorSessionsApi, Session, SessionsStats, CourseOption, CreateSessionInput } from '@/lib/api/professor/sessions';
import Swal from 'sweetalert2';

export default function ProfessorSessionsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSessionDetail, setShowSessionDetail] = useState<Session | null>(null);
  const [showJoinModal, setShowJoinModal] = useState<Session | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<SessionsStats | null>(null);
  const [myCourses, setMyCourses] = useState<CourseOption[]>([]);

  const [newSession, setNewSession] = useState({
    title: '',
    course_id: 0,
    group_id: 0,
    description: '',
    session_date: '',
    start_time: '',
    duration: 60,
    max_participants: 50,
    recording_enabled: true,
    chat_enabled: true,
  });

useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchSessions();
    }
  }, [filterCourse, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessionsRes, statsRes, coursesRes] = await Promise.all([
        professorSessionsApi.getSessions(),
        professorSessionsApi.getStats(),
        professorSessionsApi.getMyCourses(),
      ]);
      setSessions(sessionsRes.data.data || []);
      setStats(statsRes.data.data || null);
      setMyCourses(coursesRes.data.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors du chargement des données',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const sessionsRes = await professorSessionsApi.getSessions({ 
        course: filterCourse, 
        status: filterStatus 
      });
      setSessions(sessionsRes.data.data || []);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors du chargement des sessions',
        confirmButtonColor: '#0D529C',
      });
    }
  };
  const handleCreateSession = async () => {
    if (!newSession.title || !newSession.course_id || !newSession.session_date || !newSession.start_time) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez remplir tous les champs obligatoires',
        confirmButtonColor: '#0D529C',
      });
      return;
    }

    setCreating(true);
    try {
      await professorSessionsApi.createSession({
        title: newSession.title,
        course_id: newSession.course_id,
        group_id: newSession.group_id,
        description: newSession.description,
        session_date: newSession.session_date,
        start_time: newSession.start_time,
        duration: newSession.duration,
        max_participants: newSession.max_participants,
        recording_enabled: newSession.recording_enabled,
        chat_enabled: newSession.chat_enabled,
      });

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Session créée avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });

      setShowCreateModal(false);
      setNewSession({
        title: '',
        course_id: 0,
        group_id: 0,
        description: '',
        session_date: '',
        start_time: '',
        duration: 60,
        max_participants: 50,
        recording_enabled: true,
        chat_enabled: true,
      });
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la création',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setCreating(false);
    }
  };

 const handleDeleteSession = async (session: Session) => {
  const result = await Swal.fire({
    title: 'Confirmer la suppression',
    text: `Voulez-vous vraiment supprimer "${session.title}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#C1272D',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  });

  if (result.isConfirmed) {
    try {
      await professorSessionsApi.deleteSession(session.id);
      Swal.fire({
        icon: 'success',
        title: 'Supprimée',
        text: 'Session supprimée avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la suppression',
        confirmButtonColor: '#0D529C',
      });
    }
  }
};
  const startSession = async (session: Session) => {
    try {
      await professorSessionsApi.startSession(session.id);
      setShowJoinModal(session);
      fetchData();
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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

  const selectedCourse = myCourses.find(c => c.id === newSession.course_id);

  if (loading) {
    return (
      <ProfessorLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D529C]" />
        </div>
      </ProfessorLayout>
    );
  }

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Sessions Live</h1>
          <p className="text-gray-500">Planifiez et gérez vos sessions de cours en ligne avec Live Meet.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Sessions</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats?.total_sessions || 0}</p>
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
                <p className="text-xl font-bold text-orange-500">{stats?.upcoming || 0}</p>
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
                <p className="text-xl font-bold text-[#257035]">{stats?.live_now || 0}</p>
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
                <p className="text-xl font-bold text-gray-500">{stats?.completed || 0}</p>
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
                <p className="text-xl font-bold text-purple-500">{stats?.total_participants || 0}</p>
              </div>
            </div>
          </div>
        </div>

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
                  <option key={course.id} value={course.name}>{course.name}</option>
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

        {stats && stats.live_now > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#257035] rounded-full animate-pulse"></div>
              <span className="font-medium text-[#257035]">
                {stats.live_now} session(s) en cours actuellement
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow ${
              session.status === 'en_cours' ? 'border-[#257035] border-2' : 'border-gray-200'
            }`}>
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

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                {/* 1. Bouton Supprimer (poubelle rouge) */}
                <button
                  onClick={() => handleDeleteSession(session)}
                  className="flex items-center justify-center px-3 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Supprimer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* 2. Bouton Détails */}
                <button
                  onClick={() => setShowSessionDetail(session)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Détails
                </button>

                {/* 3. Boutons d'action selon le statut */}
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
                  <>
                    <button
                      onClick={() => setShowJoinModal(session)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Video className="w-4 h-4" />
                      Rejoindre
                    </button>
                    
                  </>
                )}
                
              </div>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Titre de la session *</label>
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cours *</label>
                  <select
                    value={newSession.course_id}
                    onChange={(e) => setNewSession({ ...newSession, course_id: parseInt(e.target.value), group_id: 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value={0}>Sélectionner un cours</option>
                    {myCourses.map((course) => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Groupe *</label>
                  <select
                    value={newSession.group_id}
                    onChange={(e) => setNewSession({ ...newSession, group_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    disabled={!newSession.course_id}
                  >
                    <option value={0}>Sélectionner un groupe</option>
                      {selectedCourse?.groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newSession.session_date}
                    onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Heure *</label>
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
                    onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={90}>1h30</option>
                    <option value={120}>2 heures</option>
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
                disabled={creating}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Créer la Session
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {showSessionDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl z-10">
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
                    value={`https://meet.igp-maroc.com/${showSessionDetail.room_url}#config.prejoinPageEnabled=false`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`https://meet.igp-maroc.com/${showSessionDetail.room_url}#config.prejoinPageEnabled=false`)}
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
                      setShowJoinModal(showSessionDetail);
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

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  <strong>Note:</strong> Vous serez redirigé vers Live Meet dans un nouvel onglet.
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
                onClick={async () => {
                  try {
                    const response = await professorSessionsApi.getJoinUrl(showJoinModal.id);
                    console.log('Response:', response.data); // ← Ajoute ce log
                    window.open(response.data.join_url, '_blank');
                    setShowJoinModal(null);
                  } catch (error) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Erreur',
                      text: 'Impossible de rejoindre la session',
                      confirmButtonColor: '#0D529C',
                    });
                  }
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