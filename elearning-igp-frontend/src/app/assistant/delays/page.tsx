'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Search, User, Calendar, Filter, AlertTriangle, CheckCircle } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';
import { assistantDelayApi, Delay, Group } from '@/lib/api/assistant/delays';
import Swal from 'sweetalert2';

export default function AssistantDelaysPage() {
  const [delays, setDelays] = useState<Delay[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchDelays();
  }, [filterGroup, filterDate]);

  const fetchGroups = async () => {
    try {
      const data = await assistantDelayApi.getGroups();
      setGroups(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les groupes',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const fetchDelays = async () => {
    try {
      setLoading(true);
      const data = await assistantDelayApi.getAll(filterGroup || undefined, filterDate || undefined);
      setDelays(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les retards',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsJustified = async (id: number) => {
    try {
      await assistantDelayApi.justify(id);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Retard marqué comme justifié',
        confirmButtonColor: '#257035',
      });
      
      fetchDelays();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de justifier le retard',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const filteredDelays = delays.filter(delay => {
    if (searchTerm && !delay.student_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total_delays: delays.length,
    justified: delays.filter(d => d.justified).length,
    unjustified: delays.filter(d => !d.justified).length,
    average_delay: delays.length > 0 ? Math.round(delays.reduce((sum, d) => sum + d.delay_minutes, 0) / delays.length) : 0,
  };

  const getDelayColor = (minutes: number) => {
    if (minutes <= 10) return 'bg-yellow-100 text-yellow-700';
    if (minutes <= 20) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
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
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Gestion des Retards</h1>
          <p className="text-gray-500">Suivez et gérez les retards des étudiants.</p>
        </div>

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
              value={filterGroup || ''}
              onChange={(e) => setFilterGroup(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
            >
              <option value="">Tous les groupes</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
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