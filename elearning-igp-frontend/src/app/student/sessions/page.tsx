'use client';

import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Users, PlayCircle, CheckCircle, X, User, Bell, ExternalLink } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { studentSessionsApi, StudentSession } from '@/lib/api/student/sessions';
import Swal from 'sweetalert2';

export default function StudentSessionsPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [showSessionDetail, setShowSessionDetail] = useState<StudentSession | null>(null);
  const [showJoinModal, setShowJoinModal] = useState<StudentSession | null>(null);
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await studentSessionsApi.getAll();
      setSessions(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les sessions',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (sessionId: number) => {
    try {
      const response = await studentSessionsApi.join(sessionId);
      window.open(response.room_url, '_blank');
      setShowJoinModal(null);
      fetchSessions();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de rejoindre la session',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const uniqueCourses = [...new Set(sessions.map(s => s.course))];

  const stats = {
    upcoming: sessions.filter(s => s.status === 'planifiée').length,
    live_now: sessions.filter(s => s.status === 'en_cours').length,
    completed: sessions.filter(s => s.status === 'terminée').length,
    registered: sessions.filter(s => s.is_registered && s.status === 'planifiée').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planifiée': return 'bg-[#0D529C] text-white';
      case 'en_cours': return 'bg-[#257035] text-white animate-pulse';
      case 'terminée': return 'bg-gray-500 text-white';
      case 'annulée': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planifiée': return 'À venir';
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

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const sessionDate = new Date(date);
    const diffTime = sessionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#257035]"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Sessions Live</h1>
          <p className="text-gray-500">Participez aux sessions en direct et accédez aux enregistrements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">À venir</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En direct</p>
                <p className="text-xl font-bold text-[#257035]">{stats.live_now}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Mes inscriptions</p>
                <p className="text-xl font-bold text-purple-500">{stats.registered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Terminées</p>
                <p className="text-xl font-bold text-gray-500">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {stats.live_now > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#257035] rounded-full animate-pulse"></div>
                <span className="font-medium text-[#257035]">
                  {stats.live_now} session(s) en cours maintenant!
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
            >
              <option value="">Tous les cours</option>
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="planifiée">À venir</option>
              <option value="en_cours">En cours</option>
              <option value="terminée">Terminée</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const daysUntil = getDaysUntil(session.date);

            return (
              <div key={session.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow ${
                session.status === 'en_cours' ? 'border-[#257035] border-2' : 'border-gray-200'
              }`}>
                <div className={`p-4 text-white ${
                  session.status === 'en_cours'
                    ? 'bg-gradient-to-r from-[#257035] to-green-500'
                    : session.status === 'terminée'
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600'
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

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-700">{session.professor}</span>
                  </div>

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
                        {session.participants_count}/{session.max_participants} participants
                      </span>
                    </div>
                  </div>

                  {session.status === 'planifiée' && daysUntil > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-[#0D529C]">
                        Dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {session.recording_available && (
                    <div className="bg-purple-50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-purple-600 font-medium">📹 Enregistrement disponible</span>
                    </div>
                  )}

                  {session.status === 'planifiée' && (
                    <div className={`flex items-center gap-2 p-2 rounded ${
                      session.is_registered ? 'bg-green-50' : 'bg-orange-50'
                    }`}>
                      {session.is_registered ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#257035]" />
                          <span className="text-xs font-medium text-[#257035]">Inscrit</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-medium text-orange-600">Non inscrit</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                  {session.status === 'en_cours' && (
                    <button
                      onClick={() => setShowJoinModal(session)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors animate-pulse"
                    >
                      <Video className="w-4 h-4" />
                      Rejoindre maintenant
                    </button>
                  )}

                  {session.status === 'planifiée' && (
                    <button
                      onClick={() => setShowJoinModal(session)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Préparer ma participation
                    </button>
                  )}

                  {session.status === 'terminée' && (
                    <>
                      {session.recording_available ? (
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                          <Video className="w-4 h-4" />
                          Voir l'enregistrement
                        </button>
                      ) : (
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed">
                          <CheckCircle className="w-4 h-4" />
                          Session terminée
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => setShowSessionDetail(session)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune session trouvée</p>
          </div>
        )}
      </div>

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#257035]">Rejoindre la Session</h2>
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
                <p className="text-sm text-gray-500 mt-1">Par {showJoinModal.professor}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-[#257035] mb-2">Avant de rejoindre</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Connexion internet stable</li>
                  <li>✓ Micro et caméra fonctionnels</li>
                  <li>✓ Environnement calme</li>
                </ul>
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
                onClick={() => joinSession(showJoinModal.id)}
                className="flex items-center gap-2 px-6 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4" />
                Ouvrir Jitsi Meet
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}