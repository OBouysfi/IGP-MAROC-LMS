'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Users, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';
import { assistantReportApi, MonthlyStats, GroupStat, RecentReport, Group } from '@/lib/api/assistant/reports';
import Swal from 'sweetalert2';

export default function AssistantReportsPage() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [groupStats, setGroupStats] = useState<GroupStat[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [reportType, setReportType] = useState('monthly');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [generatingReport, setGeneratingReport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchGroups();
    fetchRecentReports();
  }, [selectedMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await assistantReportApi.getStats(selectedMonth);
      setMonthlyStats(data.monthly_stats);
      setGroupStats(data.group_stats);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les statistiques',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await assistantReportApi.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchRecentReports = async () => {
    try {
      const data = await assistantReportApi.getRecent();
      setRecentReports(data);
    } catch (error) {
      console.error('Error fetching recent reports:', error);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      await assistantReportApi.generate(reportType, selectedMonth, selectedGroup || undefined);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Rapport généré avec succès!',
        confirmButtonColor: '#257035',
      });
      
      fetchRecentReports();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de générer le rapport',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setGeneratingReport(false);
    }
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
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Rapports & Statistiques</h1>
          <p className="text-gray-500">Générez des rapports détaillés sur les absences et présences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Absences ce mois</p>
                <p className="text-xl font-bold text-[#C1272D]">{monthlyStats?.total_absences || 0}</p>
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
                <p className="text-xl font-bold text-green-600">{monthlyStats?.justified || 0}</p>
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
                <p className="text-xl font-bold text-orange-500">{monthlyStats?.absence_rate || 0}%</p>
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
                <p className="text-xl font-bold text-[#0D529C]">{monthlyStats?.total_delays || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      value={selectedGroup || ''}
                      onChange={(e) => setSelectedGroup(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                    >
                      <option value="">Sélectionner un groupe</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
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
                        style={{ width: `${Math.min(stat.rate * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#C1272D] mb-4">Informations Clés</h3>
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Jour le plus absent</p>
                  <p className="font-bold text-[#C1272D]">{monthlyStats?.most_absent_day || 'N/A'}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Cours le plus touché</p>
                  <p className="font-bold text-orange-600">{monthlyStats?.top_absent_course || 'N/A'}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Non justifiées</p>
                  <p className="font-bold text-[#0D529C]">{monthlyStats?.unjustified || 0} absences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}