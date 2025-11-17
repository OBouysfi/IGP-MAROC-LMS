// src/app/assistant/delays/page.tsx
'use client';

import React, { useState } from 'react';
import { Clock, Search, User, Calendar, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';

interface Delay {
  id: number;
  student_name: string;
  student_email: string;
  group: string;
  course: string;
  date: string;
  scheduled_time: string;
  arrival_time: string;
  delay_minutes: number;
  justified: boolean;
  reason: string;
}

export default function AssistantDelaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const delays: Delay[] = [
    {
      id: 1,
      student_name: 'Rachid Tazi',
      student_email: 'rachid.tazi@student.igp.edu',
      group: 'DEV-M2-A',
      course: 'React.js Avancé',
      date: '2024-11-18',
      scheduled_time: '09:00',
      arrival_time: '09:25',
      delay_minutes: 25,
      justified: false,
      reason: '',
    },
    {
      id: 2,
      student_name: 'Salma Idrissi',
      student_email: 'salma.idrissi@student.igp.edu',
      group: 'DEV-M2-A',
      course: 'Node.js & Express',
      date: '2024-11-17',
      scheduled_time: '14:00',
      arrival_time: '14:15',
      delay_minutes: 15,
      justified: true,
      reason: 'Problème de transport',
    },
    {
      id: 3,
      student_name: 'Mohamed Alaoui',
      student_email: 'mohamed.alaoui@student.igp.edu',
      group: 'DEV-M1-A',
      course: 'JavaScript Moderne',
      date: '2024-11-16',
      scheduled_time: '10:00',
      arrival_time: '10:40',
      delay_minutes: 40,
      justified: false,
      reason: '',
    },
    {
      id: 4,
      student_name: 'Khadija Amrani',
      student_email: 'khadija.amrani@student.igp.edu',
      group: 'DEV-L2-A',
      course: 'Base de données NoSQL',
      date: '2024-11-15',
      scheduled_time: '09:00',
      arrival_time: '09:10',
      delay_minutes: 10,
      justified: true,
      reason: 'Rendez-vous médical',
    },
    {
      id: 5,
      student_name: 'Omar Tazi',
      student_email: 'omar.tazi@student.igp.edu',
      group: 'DEV-L1-A',
      course: 'Introduction au Web',
      date: '2024-11-14',
      scheduled_time: '14:00',
      arrival_time: '14:30',
      delay_minutes: 30,
      justified: false,
      reason: '',
    },
  ];

  const groups = ['DEV-M2-A', 'DEV-M1-A', 'DEV-L2-A', 'DEV-L1-A'];

  const stats = {
    total_delays: delays.length,
    justified: delays.filter(d => d.justified).length,
    unjustified: delays.filter(d => !d.justified).length,
    average_delay: Math.round(delays.reduce((sum, d) => sum + d.delay_minutes, 0) / delays.length),
  };

  const filteredDelays = delays.filter(delay => {
    if (searchTerm && !delay.student_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterGroup && delay.group !== filterGroup) return false;
    if (filterDate && delay.date !== filterDate) return false;
    return true;
  });

  const getDelayColor = (minutes: number) => {
    if (minutes <= 10) return 'bg-yellow-100 text-yellow-700';
    if (minutes <= 20) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const markAsJustified = (id: number) => {
    alert('Retard marqué comme justifié');
  };

  return (
    <AssistantLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Gestion des Retards</h1>
          <p className="text-gray-500">Suivez et gérez les retards des étudiants.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Retards</p>
                <p className="text-xl font-bold text-orange-500">{stats.total_delays}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Justifiés</p>
                <p className="text-xl font-bold text-green-600">{stats.justified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Non Justifiés</p>
                <p className="text-xl font-bold text-red-600">{stats.unjustified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Retard Moyen</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.average_delay} min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
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
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
            >
              <option value="">Tous les groupes</option>
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
            />
          </div>
        </div>

        {/* Delays Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiant</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Heure Prévue</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Arrivée</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Retard</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDelays.map((delay) => (
                <tr key={delay.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{delay.student_name}</p>
                      <p className="text-xs text-gray-500">{delay.group}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{delay.course}</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">
                    {new Date(delay.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">
                    {delay.scheduled_time}
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-medium text-orange-600">
                    {delay.arrival_time}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getDelayColor(delay.delay_minutes)}`}>
                      +{delay.delay_minutes} min
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {delay.justified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        Justifié
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        <AlertTriangle className="w-3 h-3" />
                        Non justifié
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {!delay.justified && (
                      <button
                        onClick={() => markAsJustified(delay.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Justifier
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDelays.length === 0 && (
            <div className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun retard trouvé</p>
            </div>
          )}
        </div>
      </div>
    </AssistantLayout>
  );
}