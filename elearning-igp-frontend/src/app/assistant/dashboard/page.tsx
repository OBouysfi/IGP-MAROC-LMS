'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, FileText, AlertTriangle, TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';
import { assistantDashboardApi } from '@/lib/api/assistant/dashboard';
import Swal from 'sweetalert2';

export default function AssistantDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [todayAbsences, setTodayAbsences] = useState<any[]>([]);
  const [pendingJustifications, setPendingJustifications] = useState<any[]>([]);
  const [topAbsentStudents, setTopAbsentStudents] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, absencesRes, justifsRes, topStudentsRes, weeklyRes] = await Promise.all([
        assistantDashboardApi.getStats(),
        assistantDashboardApi.getTodayAbsences(),
        assistantDashboardApi.getPendingJustifications(),
        assistantDashboardApi.getTopAbsentStudents(),
        assistantDashboardApi.getWeeklyStats(),
      ]);

      setStats(statsRes.data);
      setTodayAbsences(absencesRes.data);
      setPendingJustifications(justifsRes.data);
      setTopAbsentStudents(topStudentsRes.data);
      setWeeklyStats(weeklyRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement du dashboard',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'justifiée': return 'bg-green-100 text-green-700';
      case 'non_justifiée': return 'bg-red-100 text-red-700';
      case 'en_attente': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'justifiée': return 'Justifiée';
      case 'non_justifiée': return 'Non justifiée';
      case 'en_attente': return 'En attente';
      default: return status;
    }
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#C1272D]" />
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Bonjour! 👋</h1>
          <p className="text-gray-500">Voici le résumé des absences et présences du jour.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Présents Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">{stats.present_today || 0}</p>
                <p className="text-xs text-gray-400">sur {stats.total_students || 0} étudiants</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Absents Aujourd'hui</p>
                <p className="text-2xl font-bold text-[#C1272D]">{stats.absent_today || 0}</p>
                <p className="text-xs text-gray-400">{stats.absence_rate || 0}% du total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Retards</p>
                <p className="text-2xl font-bold text-orange-500">{stats.late_today || 0}</p>
                <p className="text-xs text-gray-400">Aujourd'hui</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Justificatifs en attente</p>
                <p className="text-2xl font-bold text-[#0D529C]">{stats.pending_justifications || 0}</p>
                <p className="text-xs text-gray-400">À traiter</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Absences Justifiées</p>
                <p className="text-3xl font-bold">{stats.justified_absences || 0}</p>
                <p className="text-xs opacity-75">Ce mois</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Absences Non Justifiées</p>
                <p className="text-3xl font-bold">{stats.unjustified_absences || 0}</p>
                <p className="text-xs opacity-75">Ce mois</p>
              </div>
              <XCircle className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#0D529C] to-blue-600 rounded-lg p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Taux de Présence</p>
                <p className="text-3xl font-bold">{(100 - (stats.absence_rate || 0)).toFixed(1)}%</p>
                <p className="text-xs opacity-75">Ce mois</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#C1272D]">Absences du Jour</h3>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Étudiant</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Groupe</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Cours</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Horaire</th>
                      <th className="text-center py-2 px-3 text-sm font-medium text-gray-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAbsences.length > 0 ? todayAbsences.map((absence) => (
                      <tr key={absence.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-900 text-sm">{absence.student}</p>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-600">{absence.group}</td>
                        <td className="py-3 px-3 text-sm text-gray-600">{absence.course}</td>
                        <td className="py-3 px-3 text-sm text-gray-600">{absence.time}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(absence.status)}`}>
                            {getStatusLabel(absence.status)}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          Aucune absence aujourd'hui
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <button 
                  onClick={() => window.location.href = '/assistant/absences'}
                  className="text-sm text-[#C1272D] hover:underline"
                >
                  Voir toutes les absences →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#C1272D] mb-[50px]">Absences cette semaine</h3>
              <div className="flex items-end justify-between h-48 gap-4 mt-5">
                {weeklyStats.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '160px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#C1272D] to-red-400 rounded-t transition-all duration-500"
                        style={{ height: `${Math.min((day.absences / 50) * 100, 100)}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                          {day.absences}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-2">{day.day}</p>
                    <p className="text-xs text-gray-400">{day.rate}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#C1272D]">Justificatifs à Traiter</h3>
                <span className="w-6 h-6 bg-[#C1272D] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingJustifications.length}
                </span>
              </div>
              <div className="space-y-3">
                {pendingJustifications.length > 0 ? pendingJustifications.map((justif) => (
                  <div key={justif.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">{justif.student}</p>
                      <span className="text-xs text-gray-500">{new Date(justif.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{justif.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#0D529C]">📎 {justif.document}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">Aucun justificatif en attente</p>
                )}
              </div>
              <button 
                onClick={() => window.location.href = '/assistant/justifications'}
                className="w-full mt-4 text-sm text-[#C1272D] hover:underline"
              >
                Voir tous les justificatifs →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-[#C1272D]">Étudiants à Surveiller</h3>
              </div>
              <div className="space-y-3">
                {topAbsentStudents.length > 0 ? topAbsentStudents.map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < 3 ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.group}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#C1272D] text-sm">{student.absences} abs.</p>
                      <p className="text-xs text-gray-500">{student.hours}h</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">Aucun étudiant à surveiller</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}