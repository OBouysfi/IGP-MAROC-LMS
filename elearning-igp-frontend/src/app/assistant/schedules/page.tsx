'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Users, Filter } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';
import { assistantScheduleApi, ScheduleEvent, Group, Professor } from '@/lib/api/assistant/schedules';
import Swal from 'sweetalert2';

export default function AssistantSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [filterGroup, setFilterGroup] = useState<number | null>(null);
  const [filterProfessor, setFilterProfessor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    fetchGroups();
    fetchProfessors();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [filterGroup, filterProfessor]);

  const fetchGroups = async () => {
    try {
      const data = await assistantScheduleApi.getGroups();
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

  const fetchProfessors = async () => {
    try {
      const data = await assistantScheduleApi.getProfessors();
      setProfessors(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les professeurs',
        confirmButtonColor: '#C1272D',
      });
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await assistantScheduleApi.getAll(filterGroup || undefined, filterProfessor || undefined);
      setSchedules(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les emplois du temps',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + weekOffset * 7);

    const dates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-[#0D529C] border-[#0D529C]';
      case 'tp': return 'bg-[#257035] border-[#257035]';
      case 'td': return 'bg-purple-500 border-purple-500';
      case 'examen': return 'bg-[#C1272D] border-[#C1272D]';
      default: return 'bg-gray-500 border-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cours': return 'Cours';
      case 'tp': return 'TP';
      case 'td': return 'TD';
      case 'examen': return 'Examen';
      default: return type;
    }
  };

  const stats = {
    total_sessions: schedules.length,
    total_groups: new Set(schedules.map(s => s.group)).size,
    total_professors: new Set(schedules.map(s => s.professor)).size,
    total_students: schedules.reduce((sum, s) => sum + s.students_count, 0),
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
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Emplois du Temps</h1>
          <p className="text-gray-500">Consultez les emplois du temps de tous les groupes et professeurs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Séances/Semaine</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_sessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Groupes</p>
                <p className="text-xl font-bold text-[#257035]">{stats.total_groups}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Professeurs</p>
                <p className="text-xl font-bold text-purple-500">{stats.total_professors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Étudiants concernés</p>
                <p className="text-xl font-bold text-orange-500">{stats.total_students}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h3 className="font-bold text-lg text-[#C1272D]">
                  {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - {weekDates[5].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                {currentWeek === 0 && (
                  <span className="text-xs text-[#C1272D] font-medium">Semaine actuelle</span>
                )}
              </div>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-4">
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
              <select
                value={filterProfessor || ''}
                onChange={(e) => setFilterProfessor(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
              >
                <option value="">Tous les professeurs</option>
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.id}>{prof.name}</option>
                ))}
              </select>
              <button
                onClick={() => setCurrentWeek(0)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Aujourd'hui
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-sm font-medium text-gray-700">Légende:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#0D529C] rounded"></div>
              <span className="text-sm text-gray-600">Cours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#257035] rounded"></div>
              <span className="text-sm text-gray-600">TP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">TD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#C1272D] rounded"></div>
              <span className="text-sm text-gray-600">Examen</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {days.map((day) => {
            const dayEvents = schedules.filter(e => e.day === day);
            if (dayEvents.length === 0) return null;

            return (
              <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-[#C1272D] text-white px-6 py-3">
                  <h3 className="font-bold">{day}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {dayEvents
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((event) => (
                      <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-16 rounded ${getTypeColor(event.type)}`}></div>
                            <div>
                              <h4 className="font-bold text-gray-900">{event.course}</h4>
                              <p className="text-sm text-gray-500">{event.course_code}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{event.start_time} - {event.end_time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{event.room}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{event.professor}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{event.students_count} étudiants</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                              {event.group}
                            </span>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${getTypeColor(event.type)}`}>
                              {getTypeLabel(event.type)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {schedules.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune séance trouvée avec ces filtres</p>
          </div>
        )}
      </div>
    </AssistantLayout>
  );
}