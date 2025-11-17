// src/app/student/schedule/page.tsx
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, BookOpen, Video } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';

interface ScheduleEvent {
  id: number;
  course: string;
  course_code: string;
  professor: string;
  type: 'cours' | 'tp' | 'td' | 'examen' | 'session_live';
  day: string;
  start_time: string;
  end_time: string;
  room: string;
}

export default function StudentSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

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

  const schedule: ScheduleEvent[] = [
    {
      id: 1,
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      type: 'cours',
      day: 'Lundi',
      start_time: '09:00',
      end_time: '12:00',
      room: 'Salle A12',
    },
    {
      id: 2,
      course: 'DevOps & CI/CD',
      course_code: 'DEV-OPS',
      professor: 'Hassan Alami',
      type: 'cours',
      day: 'Lundi',
      start_time: '14:00',
      end_time: '16:00',
      room: 'Salle B3',
    },
    {
      id: 3,
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      type: 'tp',
      day: 'Mardi',
      start_time: '09:00',
      end_time: '12:00',
      room: 'Lab Info 1',
    },
    {
      id: 4,
      course: 'Architecture Microservices',
      course_code: 'DEV-MICRO',
      professor: 'Omar Tazi',
      type: 'cours',
      day: 'Mardi',
      start_time: '14:00',
      end_time: '17:00',
      room: 'Salle A8',
    },
    {
      id: 5,
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      type: 'td',
      day: 'Mercredi',
      start_time: '09:00',
      end_time: '11:00',
      room: 'Salle C2',
    },
    {
      id: 6,
      course: 'JavaScript Moderne',
      course_code: 'DEV-JS',
      professor: 'Karim Benjelloun',
      type: 'cours',
      day: 'Mercredi',
      start_time: '14:00',
      end_time: '18:00',
      room: 'Salle C5',
    },
    {
      id: 7,
      course: 'Base de données NoSQL',
      course_code: 'DEV-NOSQL',
      professor: 'Karim Benjelloun',
      type: 'tp',
      day: 'Jeudi',
      start_time: '09:00',
      end_time: '12:00',
      room: 'Lab Info 2',
    },
    {
      id: 8,
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      type: 'cours',
      day: 'Jeudi',
      start_time: '14:00',
      end_time: '16:00',
      room: 'Salle B8',
    },
    {
      id: 9,
      course: 'DevOps & CI/CD',
      course_code: 'DEV-OPS',
      professor: 'Hassan Alami',
      type: 'tp',
      day: 'Vendredi',
      start_time: '09:00',
      end_time: '12:00',
      room: 'Lab Info 3',
    },
    {
      id: 10,
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      type: 'session_live',
      day: 'Vendredi',
      start_time: '16:00',
      end_time: '17:30',
      room: 'En ligne',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-[#0D529C] border-[#0D529C]';
      case 'tp': return 'bg-[#257035] border-[#257035]';
      case 'td': return 'bg-purple-500 border-purple-500';
      case 'examen': return 'bg-[#C1272D] border-[#C1272D]';
      case 'session_live': return 'bg-orange-500 border-orange-500';
      default: return 'bg-gray-500 border-gray-500';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-blue-50 border-l-4 border-[#0D529C]';
      case 'tp': return 'bg-green-50 border-l-4 border-[#257035]';
      case 'td': return 'bg-purple-50 border-l-4 border-purple-500';
      case 'examen': return 'bg-red-50 border-l-4 border-[#C1272D]';
      case 'session_live': return 'bg-orange-50 border-l-4 border-orange-500';
      default: return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cours': return 'Cours';
      case 'tp': return 'TP';
      case 'td': return 'TD';
      case 'examen': return 'Examen';
      case 'session_live': return 'Session Live';
      default: return type;
    }
  };

  const getEventsForDayAndTime = (day: string, time: string) => {
    return schedule.filter(event => {
      if (event.day !== day) return false;
      const eventStart = parseInt(event.start_time.split(':')[0]);
      const slotTime = parseInt(time.split(':')[0]);
      return eventStart === slotTime;
    });
  };

  const getEventHeight = (event: ScheduleEvent) => {
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
    live_sessions: schedule.filter(s => s.type === 'session_live').length,
  };

  const todayEvents = schedule.filter(event => {
    const today = new Date();
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return event.day === dayNames[today.getDay()];
  });

  const nextEvent = todayEvents.find(event => {
    const now = new Date();
    const [hours, minutes] = event.start_time.split(':').map(Number);
    const eventTime = new Date();
    eventTime.setHours(hours, minutes, 0);
    return eventTime > now;
  });

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Mon Emploi du Temps</h1>
          <p className="text-gray-500">Consultez votre planning de cours hebdomadaire.</p>
        </div>

        {/* Stats */}
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

        {/* Today's Schedule Alert */}
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

        {/* Calendar Controls */}
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

        {/* Legend */}
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
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Session Live</span>
            </div>
          </div>
        </div>

        {/* Calendar View */}
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

        {/* List View */}
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
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${getTypeColor(event.type)}`}>
                                {getTypeLabel(event.type)}
                              </span>
                              {event.type === 'session_live' && (
                                <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition-colors">
                                  <Video className="w-3 h-3" />
                                  Rejoindre
                                </button>
                              )}
                            </div>
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