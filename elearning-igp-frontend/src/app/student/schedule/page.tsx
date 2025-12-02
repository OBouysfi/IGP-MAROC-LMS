'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, BookOpen, Video } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { studentScheduleApi, StudentSchedule } from '@/lib/api/student/schedule';
import Swal from 'sweetalert2';

export default function StudentSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const [schedule, setSchedule] = useState<StudentSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const data = await studentScheduleApi.getAll();
      
      // 🔍 DEBUG: Afficher les données reçues
      console.log('📊 Données emploi du temps:', data);
      console.log('📊 Nombre de séances:', data.length);
      if (data.length > 0) {
        console.log('📊 Exemple de séance:', data[0]);
        console.log('📊 Tous les jours:', data.map(d => d.day));
        console.log('📊 Heures de début:', data.map(d => d.start_time));
        console.log('📊 Heures de fin:', data.map(d => d.end_time));
      }
      
      setSchedule(data);
    } catch (error) {
      console.error('❌ Erreur chargement emploi du temps:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger l\'emploi du temps',
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

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-blue-50 border-l-4 border-[#0D529C]';
      case 'tp': return 'bg-green-50 border-l-4 border-[#257035]';
      case 'td': return 'bg-purple-50 border-l-4 border-purple-500';
      case 'examen': return 'bg-red-50 border-l-4 border-[#C1272D]';
      default: return 'bg-gray-50 border-l-4 border-gray-500';
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

  const getEventsForDayAndTime = (day: string, time: string) => {
    const events = schedule.filter(event => {
      if (event.day !== day) return false;
      
      // Gérer différents formats de start_time
      let eventTimeStr = event.start_time;
      
      // Si c'est un timestamp complet "2025-12-02 09:00:00", extraire l'heure
      if (eventTimeStr.includes(' ')) {
        eventTimeStr = eventTimeStr.split(' ')[1];
      }
      
      // Extraire l'heure (format "09:00" ou "09:00:00")
      const eventStart = parseInt(eventTimeStr.split(':')[0]);
      const slotTime = parseInt(time.split(':')[0]);
      
      // 🔍 DEBUG détaillé
      console.log(`🔍 Comparaison ${day} ${time}:`, {
        original: event.start_time,
        extracted: eventTimeStr,
        eventStartHour: eventStart,
        slotHour: slotTime,
        match: eventStart === slotTime
      });
      
      return eventStart === slotTime;
    });
    
    // 🔍 DEBUG: Afficher les événements trouvés
    if (events.length > 0) {
      console.log(`✅ Trouvé ${events.length} événement(s) pour ${day} à ${time}:`, events);
    }
    
    return events;
  };

  const getEventHeight = (event: StudentSchedule) => {
    const start = parseInt(event.start_time.split(':')[0]);
    const end = parseInt(event.end_time.split(':')[0]);
    const duration = end - start;
    return duration * 60;
  };

  const stats = {
    total_hours: schedule.reduce((sum, event) => {
      const start = parseInt(event.start_time.split(':')[0]);
      const end = parseInt(event.end_time.split(':')[0]);
      return sum + (end - start);
    }, 0),
    total_courses: new Set(schedule.map(s => s.course)).size,
    sessions_this_week: schedule.length,
    live_sessions: 0,
  };

  const todayEvents = schedule.filter(event => {
    const today = new Date();
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const todayName = dayNames[today.getDay()];
    
    // 🔍 DEBUG
    console.log('🗓️ Jour actuel:', todayName, '| Jour événement:', event.day);
    
    return event.day === todayName;
  });

  console.log('📅 Événements aujourd\'hui:', todayEvents.length);

  const nextEvent = todayEvents.find(event => {
    const now = new Date();
    const [hours, minutes] = event.start_time.split(':').map(Number);
    const eventTime = new Date();
    eventTime.setHours(hours, minutes, 0);
    return eventTime > now;
  });

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#257035]"></div>
        </div>
      </StudentLayout>
    );
  }

  // 🔍 DEBUG: Afficher si aucune donnée
  if (schedule.length === 0) {
    return (
      <StudentLayout>
        <div className="p-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">⚠️ Aucun emploi du temps trouvé</p>
            <p className="text-yellow-600 text-sm mt-2">Vérifiez que vous êtes assigné à un groupe.</p>
            <button 
              onClick={fetchSchedule}
              className="mt-4 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-[#1d5729]"
            >
              Réessayer
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Mon Emploi du Temps</h1>
          <p className="text-gray-500">Consultez votre planning de cours hebdomadaire.</p>
        </div>

        {/* 🔍 DEBUG: Badge avec nombre de séances */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            📊 <strong>{schedule.length}</strong> séance(s) chargée(s) | 
            Jours: {[...new Set(schedule.map(s => s.day))].join(', ')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Heures/Semaine</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_hours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Matières</p>
                <p className="text-xl font-bold text-[#257035]">{stats.total_courses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Séances/Semaine</p>
                <p className="text-xl font-bold text-purple-500">{stats.sessions_this_week}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sessions Live</p>
                <p className="text-xl font-bold text-orange-500">{stats.live_sessions}</p>
              </div>
            </div>
          </div>
        </div>

        {todayEvents.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-[#257035] mb-3">📅 Aujourd'hui - {todayEvents.length} séance(s)</h3>
            <div className="flex flex-wrap gap-3">
              {todayEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                  <div className={`w-2 h-12 rounded ${getTypeColor(event.type)}`}></div>
                  <div>
                    <p className="font-medium text-sm">{event.course}</p>
                    <p className="text-xs text-gray-500">{event.start_time} - {event.end_time} • {event.room}</p>
                  </div>
                </div>
              ))}
            </div>
            {nextEvent && (
              <div className="mt-3 bg-white rounded-lg p-3 border border-green-300">
                <p className="text-sm text-[#257035]">
                  <strong>Prochain cours:</strong> {nextEvent.course} à {nextEvent.start_time} en {nextEvent.room}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentWeek(currentWeek - 1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h3 className="font-bold text-lg text-[#257035]">
                  {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - {weekDates[5].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                {currentWeek === 0 && (
                  <span className="text-xs text-[#257035] font-medium">Semaine actuelle</span>
                )}
              </div>
              <button
                onClick={() => setCurrentWeek(currentWeek + 1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentWeek(0)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Aujourd'hui
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    viewMode === 'week' ? 'bg-white shadow-sm text-[#257035] font-medium' : 'text-gray-600'
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-[#257035] font-medium' : 'text-gray-600'
                  }`}
                >
                  Liste
                </button>
              </div>
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

        {viewMode === 'week' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-20 py-3 px-2 text-sm font-medium text-gray-500 border-b border-r">Heure</th>
                    {days.map((day, index) => (
                      <th key={day} className="py-3 px-2 text-sm font-medium text-gray-700 border-b">
                        <div>{day}</div>
                        <div className="text-xs text-gray-500 font-normal">
                          {weekDates[index]?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time} className="border-b">
                      <td className="py-2 px-2 text-sm text-gray-500 border-r bg-gray-50 text-center font-medium">
                        {time}
                      </td>
                      {days.map((day) => {
                        const events = getEventsForDayAndTime(day, time);
                        return (
                          <td key={`${day}-${time}`} className="p-1 align-top h-16 border-r last:border-r-0">
                            {events.map((event) => (
                              <div
                                key={event.id}
                                className={`${getTypeBgColor(event.type)} rounded p-2 mb-1 cursor-pointer hover:shadow-md transition-shadow`}
                                style={{ minHeight: `${getEventHeight(event) - 10}px` }}
                              >
                                <p className="font-medium text-xs truncate">{event.course}</p>
                                <p className="text-xs text-gray-600">{event.start_time} - {event.end_time}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 truncate">{event.professor}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500 truncate">{event.room}</span>
                                  </div>
                                  <span className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded text-white ${getTypeColor(event.type)}`}>
                                    {getTypeLabel(event.type)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-4">
            {days.map((day) => {
              const dayEvents = schedule.filter(e => e.day === day);
              if (dayEvents.length === 0) return null;

              return (
                <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#257035] text-white px-6 py-3">
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
                                </div>
                              </div>
                            </div>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${getTypeColor(event.type)}`}>
                              {getTypeLabel(event.type)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}