'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, DollarSign, Calendar, ArrowUp, ArrowDown, Download } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stats = {
    total_revenue: 2850000,
    revenue_growth: 12.5,
    total_students: 1250,
    students_growth: 8.3,
    completion_rate: 78.5,
    completion_growth: 4.2,
    active_courses: 45,
    courses_growth: 15.0,
  };

  const monthlyRevenue = [
    { month: 'Jan', amount: 220000 },
    { month: 'Fév', amount: 235000 },
    { month: 'Mar', amount: 248000 },
    { month: 'Avr', amount: 242000 },
    { month: 'Mai', amount: 258000 },
    { month: 'Juin', amount: 275000 },
    { month: 'Juil', amount: 195000 },
    { month: 'Août', amount: 180000 },
    { month: 'Sep', amount: 320000 },
    { month: 'Oct', amount: 345000 },
    { month: 'Nov', amount: 332000 },
  ];

  const enrollmentsByProgram = [
    { program: 'Master Développement', count: 285, percentage: 22.8 },
    { program: 'Licence Commerce', count: 320, percentage: 25.6 },
    { program: 'Master Marketing', count: 195, percentage: 15.6 },
    { program: 'Licence Finance', count: 245, percentage: 19.6 },
    { program: 'Master RH', count: 125, percentage: 10.0 },
    { program: 'Licence Gestion', count: 80, percentage: 6.4 },
  ];

  const topCourses = [
    { name: 'React.js Avancé', students: 89, completion: 85, rating: 4.8 },
    { name: 'Marketing Digital', students: 76, completion: 92, rating: 4.9 },
    { name: 'Analyse Financière', students: 68, completion: 78, rating: 4.6 },
    { name: 'Node.js & Express', students: 65, completion: 81, rating: 4.7 },
    { name: 'Droit des Affaires', students: 58, completion: 88, rating: 4.5 },
  ];

  const recentPayments = [
    { student: 'Ahmed Benali', amount: 2500, date: '2024-11-10', type: 'Mensualité' },
    { student: 'Fatima Zahra', amount: 2000, date: '2024-11-10', type: 'Mensualité' },
    { student: 'Youssef Mansouri', amount: 4500, date: '2024-11-09', type: 'Inscription' },
    { student: 'Sara Idrissi', amount: 2000, date: '2024-11-09', type: 'Mensualité' },
    { student: 'Omar Tazi', amount: 5000, date: '2024-11-08', type: 'Inscription' },
  ];

  const attendanceStats = [
    { day: 'Lun', present: 92, absent: 8 },
    { day: 'Mar', present: 88, absent: 12 },
    { day: 'Mer', present: 95, absent: 5 },
    { day: 'Jeu', present: 85, absent: 15 },
    { day: 'Ven', present: 78, absent: 22 },
    { day: 'Sam', present: 45, absent: 55 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount));

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Analytics & Rapports</h1>
            <p className="text-gray-500">Vue d'ensemble des performances de la plateforme.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Revenus Total</p>
                <p className="text-2xl font-bold text-[#0D529C]">{(stats.total_revenue / 1000000).toFixed(2)}M MAD</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#0D529C]" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <ArrowUp className="w-4 h-4 text-[#257035]" />
              <span className="text-[#257035] font-medium">+{stats.revenue_growth}%</span>
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Étudiants Inscrits</p>
                <p className="text-2xl font-bold text-[#257035]">{stats.total_students}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <ArrowUp className="w-4 h-4 text-[#257035]" />
              <span className="text-[#257035] font-medium">+{stats.students_growth}%</span>
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Taux de Complétion</p>
                <p className="text-2xl font-bold text-orange-500">{stats.completion_rate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <ArrowUp className="w-4 h-4 text-[#257035]" />
              <span className="text-[#257035] font-medium">+{stats.completion_growth}%</span>
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cours Actifs</p>
                <p className="text-2xl font-bold text-purple-600">{stats.active_courses}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <ArrowUp className="w-4 h-4 text-[#257035]" />
              <span className="text-[#257035] font-medium">+{stats.courses_growth}%</span>
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0D529C] mb-6">Revenus Mensuels (MAD)</h3>
            <div className="space-y-3">
              {monthlyRevenue.map((item) => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-gray-600">{item.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0D529C] to-[#3b82f6] rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        {(item.amount / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrollments by Program */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0D529C] mb-6">Inscriptions par Programme</h3>
            <div className="space-y-4">
              {enrollmentsByProgram.map((item) => (
                <div key={item.program}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.program}</span>
                    <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Courses */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0D529C] mb-4">Top Cours Populaires</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Cours</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Étudiants</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Complétion</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses.map((course, index) => (
                    <tr key={course.name} className="border-t border-gray-100">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-[#0D529C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">{course.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-sm">{course.students}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                          course.completion >= 85 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {course.completion}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm font-medium text-yellow-600">⭐ {course.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0D529C] mb-4">Paiements Récents</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Étudiant</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Type</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Montant</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-3 px-3 text-sm font-medium">{payment.student}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                          payment.type === 'Inscription' ? 'bg-[#0D529C] text-white' : 'bg-[#257035] text-white'
                        }`}>
                          {payment.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-sm font-bold text-[#257035]">
                        {payment.amount.toLocaleString()} MAD
                      </td>
                      <td className="py-3 px-3 text-right text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#0D529C] mb-6">Taux de Présence (Cette Semaine)</h3>
          <div className="flex items-end justify-between gap-4 h-48">
            {attendanceStats.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col gap-1 h-40">
                  <div
                    className="w-full bg-[#C1272D] rounded-t transition-all duration-500"
                    style={{ height: `${day.absent}%` }}
                    title={`Absents: ${day.absent}%`}
                  />
                  <div
                    className="w-full bg-[#257035] rounded-b transition-all duration-500"
                    style={{ height: `${day.present}%` }}
                    title={`Présents: ${day.present}%`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 mt-2">{day.day}</span>
                <span className="text-xs text-[#257035]">{day.present}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#257035] rounded" />
              <span className="text-sm text-gray-600">Présents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#C1272D] rounded" />
              <span className="text-sm text-gray-600">Absents</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}