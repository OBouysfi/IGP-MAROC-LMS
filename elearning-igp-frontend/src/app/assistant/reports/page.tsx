// src/app/assistant/reports/page.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Download, Calendar, Users, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';

export default function AssistantReportsPage() {
  const [reportType, setReportType] = useState('monthly');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-11');
  const [generatingReport, setGeneratingReport] = useState(false);

  const groups = ['DEV-M2-A', 'DEV-M1-A', 'DEV-L2-A', 'DEV-L1-A'];

  const monthlyStats = {
    total_absences: 156,
    justified: 98,
    unjustified: 58,
    total_delays: 45,
    absence_rate: 8.2,
    top_absent_course: 'JavaScript Moderne',
    most_absent_day: 'Mercredi',
  };

  const groupStats = [
    { group: 'DEV-M2-A', absences: 42, rate: 7.5, students: 25 },
    { group: 'DEV-M1-A', absences: 38, rate: 6.8, students: 28 },
    { group: 'DEV-L2-A', absences: 45, rate: 9.0, students: 30 },
    { group: 'DEV-L1-A', absences: 31, rate: 5.5, students: 35 },
  ];

  const recentReports = [
    { id: 1, name: 'Rapport Mensuel - Octobre 2024', type: 'monthly', date: '2024-11-01', size: '2.4 MB' },
    { id: 2, name: 'Rapport Groupe DEV-M2-A', type: 'group', date: '2024-10-28', size: '1.8 MB' },
    { id: 3, name: 'Rapport Hebdomadaire S45', type: 'weekly', date: '2024-10-25', size: '1.2 MB' },
    { id: 4, name: 'Rapport Mensuel - Septembre 2024', type: 'monthly', date: '2024-10-01', size: '2.1 MB' },
  ];

  const generateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      alert('Rapport généré avec succès! Le téléchargement va commencer.');
    }, 2000);
  };

  return (
    <AssistantLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Rapports & Statistiques</h1>
          <p className="text-gray-500">Générez des rapports détaillés sur les absences et présences.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Absences ce mois</p>
                <p className="text-xl font-bold text-[#C1272D]">{monthlyStats.total_absences}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Justifiées</p>
                <p className="text-xl font-bold text-green-600">{monthlyStats.justified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Taux d'absence</p>
                <p className="text-xl font-bold text-orange-500">{monthlyStats.absence_rate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Retards</p>
                <p className="text-xl font-bold text-[#0D529C]">{monthlyStats.total_delays}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generate Report */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#C1272D] mb-4">Générer un Rapport</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type de rapport</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                  >
                    <option value="daily">Rapport Journalier</option>
                    <option value="weekly">Rapport Hebdomadaire</option>
                    <option value="monthly">Rapport Mensuel</option>
                    <option value="group">Rapport par Groupe</option>
                    <option value="student">Rapport Étudiant Individuel</option>
                  </select>
                </div>

                {reportType === 'group' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Groupe</label>
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                    >
                      <option value="">Sélectionner un groupe</option>
                      {groups.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Période</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Le rapport inclura:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Liste complète des absences</li>
                    <li>✓ Statistiques par jour/semaine</li>
                    <li>✓ Taux de présence global</li>
                    <li>✓ Absences justifiées vs non justifiées</li>
                    <li>✓ Étudiants avec le plus d'absences</li>
                    <li>✓ Graphiques et visualisations</li>
                  </ul>
                </div>

                <button
                  onClick={generateReport}
                  disabled={generatingReport}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    generatingReport
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#C1272D] text-white hover:bg-red-700'
                  }`}
                >
                  {generatingReport ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Générer le Rapport PDF
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Group Statistics */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#C1272D] mb-4">Statistiques par Groupe</h3>
              <div className="space-y-4">
                {groupStats.map((stat) => (
                  <div key={stat.group} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{stat.group}</p>
                        <p className="text-xs text-gray-500">{stat.students} étudiants</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#C1272D]">{stat.absences} absences</p>
                        <p className="text-xs text-gray-500">Taux: {stat.rate}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#C1272D] to-red-400 h-3 rounded-full"
                        style={{ width: `${stat.rate * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#C1272D] mb-4">Rapports Récents</h3>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#C1272D]" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                          <p className="text-xs text-gray-500">{new Date(report.date).toLocaleDateString('fr-FR')}</p>
                          <p className="text-xs text-gray-400">{report.size}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-[#0D529C]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#C1272D] mb-4">Informations Clés</h3>
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Jour le plus absent</p>
                  <p className="font-bold text-[#C1272D]">{monthlyStats.most_absent_day}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Cours le plus touché</p>
                  <p className="font-bold text-orange-600">{monthlyStats.top_absent_course}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Non justifiées</p>
                  <p className="font-bold text-[#0D529C]">{monthlyStats.unjustified} absences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}