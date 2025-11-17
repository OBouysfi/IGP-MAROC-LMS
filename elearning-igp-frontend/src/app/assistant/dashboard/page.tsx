// src/app/assistant/dashboard/page.tsx
'use client';

import React from 'react';
import { UserCheck, UserX, Clock, FileText, AlertTriangle, TrendingUp, Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';

export default function AssistantDashboard() {
  const stats = {
    total_students: 450,
    present_today: 412,
    absent_today: 38,
    late_today: 15,
    pending_justifications: 12,
    absence_rate: 8.4,
    justified_absences: 24,
    unjustified_absences: 14,
  };

  const todayAbsences = [
    { id: 1, student: 'Youssef Mansouri', group: 'DEV-M2-A', course: 'React.js Avancé', time: '09:00 - 12:00', status: 'non_justifiée' },
    { id: 2, student: 'Rachid Tazi', group: 'DEV-M2-A', course: 'React.js Avancé', time: '09:00 - 12:00', status: 'justifiée' },
    { id: 3, student: 'Salma Idrissi', group: 'DEV-L1-A', course: 'Introduction au Web', time: '10:00 - 13:00', status: 'en_attente' },
    { id: 4, student: 'Mohamed Alaoui', group: 'DEV-M1-A', course: 'JavaScript Moderne', time: '14:00 - 17:00', status: 'non_justifiée' },
    { id: 5, student: 'Fatima Zahra', group: 'DEV-M2-A', course: 'Node.js & Express', time: '14:00 - 17:00', status: 'en_attente' },
  ];

  const pendingJustifications = [
    { id: 1, student: 'Salma Idrissi', date: '2024-11-15', reason: 'Certificat médical', document: 'certificat_medical.pdf' },
    { id: 2, student: 'Fatima Zahra', date: '2024-11-16', reason: 'Raison familiale', document: 'justificatif.pdf' },
    { id: 3, student: 'Ahmed Benali', date: '2024-11-14', reason: 'Rendez-vous administratif', document: 'convocation.pdf' },
  ];

  const topAbsentStudents = [
    { id: 1, name: 'Mohamed Alaoui', group: 'DEV-M1-A', absences: 12, hours: 36 },
    { id: 2, name: 'Youssef Mansouri', group: 'DEV-M2-A', absences: 10, hours: 30 },
    { id: 3, name: 'Khadija Amrani', group: 'DEV-L2-A', absences: 8, hours: 24 },
    { id: 4, name: 'Rachid Tazi', group: 'DEV-M2-A', absences: 7, hours: 21 },
    { id: 5, name: 'Omar Tazi', group: 'DEV-L1-A', absences: 6, hours: 18 },
  ];

  const weeklyStats = [
    { day: 'Lun', absences: 32, rate: 7.1 },
    { day: 'Mar', absences: 28, rate: 6.2 },
    { day: 'Mer', absences: 45, rate: 10.0 },
    { day: 'Jeu', absences: 35, rate: 7.8 },
    { day: 'Ven', absences: 38, rate: 8.4 },
  ];

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

  return (
    <AssistantLayout>
      <div className="p-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Bonjour, Sara! 👋</h1>
          <p className="text-gray-500">Voici le résumé des absences et présences du jour.</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Présents Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">{stats.present_today}</p>
                <p className="text-xs text-gray-400">sur {stats.total_students} étudiants</p>
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
                <p className="text-2xl font-bold text-[#C1272D]">{stats.absent_today}</p>
                <p className="text-xs text-gray-400">{stats.absence_rate}% du total</p>
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
                <p className="text-2xl font-bold text-orange-500">{stats.late_today}</p>
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
                <p className="text-2xl font-bold text-[#0D529C]">{stats.pending_justifications}</p>
                <p className="text-xs text-gray-400">À traiter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Absences Justifiées</p>
                <p className="text-3xl font-bold">{stats.justified_absences}</p>
                <p className="text-xs opacity-75">Ce mois</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Absences Non Justifiées</p>
                <p className="text-3xl font-bold">{stats.unjustified_absences}</p>
                <p className="text-xs opacity-75">Ce mois</p>
              </div>
              <XCircle className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#0D529C] to-blue-600 rounded-lg p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Taux de Présence</p>
                <p className="text-3xl font-bold">{(100 - stats.absence_rate).toFixed(1)}%</p>
                <p className="text-xs opacity-75">Ce mois</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Today's Absences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Absences */}
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
                    {todayAbsences.map((absence) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-[#C1272D] hover:underline">
                  Voir toutes les absences →
                </button>
              </div>
            </div>

            {/* Weekly Stats Chart */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#C1272D] mb-4">Absences cette semaine</h3>
              <div className="flex items-end justify-between h-48 gap-4">
                {weeklyStats.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '160px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#C1272D] to-red-400 rounded-t transition-all duration-500"
                        style={{ height: `${(day.absences / 50) * 100}%` }}
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

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending Justifications */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#C1272D]">Justificatifs à Traiter</h3>
                <span className="w-6 h-6 bg-[#C1272D] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingJustifications.length}
                </span>
              </div>
              <div className="space-y-3">
                {pendingJustifications.map((justif) => (
                  <div key={justif.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">{justif.student}</p>
                      <span className="text-xs text-gray-500">{new Date(justif.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{justif.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#0D529C]">📎 {justif.document}</span>
                      <div className="flex gap-1">
                        <button className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                          ✓
                        </button>
                        <button className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                          ✗
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-[#C1272D] hover:underline">
                Voir tous les justificatifs →
              </button>
            </div>

            {/* Top Absent Students */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-[#C1272D]">Étudiants à Surveiller</h3>
              </div>
              <div className="space-y-3">
                {topAbsentStudents.map((student, index) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}