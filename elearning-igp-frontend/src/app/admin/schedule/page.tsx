// src/app/admin/schedule/page.tsx
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, GraduationCap, MapPin, Filter, Download, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface ScheduleSlot {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  course: string;
  course_code: string;
  professor: string;
  group: string;
  room: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
}

export default function SchedulePage() {
  const [viewType, setViewType] = useState<'group' | 'professor' | 'room'>('group');
  const [selectedGroup, setSelectedGroup] = useState('DEV-M2-A');
  const [selectedProfessor, setSelectedProfessor] = useState('Karim Benjelloun');
  const [selectedRoom, setSelectedRoom] = useState('Lab Info 2');
  const [currentWeek, setCurrentWeek] = useState('11-15 Nov 2024');

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const groups = ['DEV-M2-A', 'DEV-M2-B', 'COM-L3-A', 'COM-L3-B', 'MKT-M1-A', 'FIN-L2-A'];
  const professors = ['Karim Benjelloun', 'Amina El Fassi', 'Omar Tazi', 'Hassan Alami', 'Nadia Fassi'];
  const rooms = ['Lab Info 1', 'Lab Info 2', 'Salle A12', 'Salle B5', 'Salle C5', 'Amphi A', 'Amphi B'];

  const scheduleByGroup: ScheduleSlot[] = [
    { id: 1, day: 'Lundi', start_time: '09:00', end_time: '12:00', course: 'React.js Avancé', course_code: 'DEV-REACT', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'tp' },
    { id: 2, day: 'Lundi', start_time: '14:00', end_time: '17:00', course: 'DevOps & CI/CD', course_code: 'DEV-DEVOPS', professor: 'Hassan Alami', group: 'DEV-M2-A', room: 'Salle A12', type: 'cours' },
    { id: 3, day: 'Mardi', start_time: '09:00', end_time: '12:00', course: 'Node.js & Express', course_code: 'DEV-NODE', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 1', type: 'tp' },
    { id: 4, day: 'Mercredi', start_time: '14:00', end_time: '17:00', course: 'React.js Avancé', course_code: 'DEV-REACT', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'td' },
    { id: 5, day: 'Jeudi', start_time: '09:00', end_time: '12:00', course: 'Base de données NoSQL', course_code: 'DEV-NOSQL', professor: 'Nadia Fassi', group: 'DEV-M2-A', room: 'Salle B5', type: 'cours' },
    { id: 6, day: 'Vendredi', start_time: '10:00', end_time: '12:00', course: 'Projet Tutoré', course_code: 'DEV-PROJET', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'tp' },
  ];

  const scheduleByProfessor: ScheduleSlot[] = [
    { id: 1, day: 'Lundi', start_time: '09:00', end_time: '12:00', course: 'React.js Avancé', course_code: 'DEV-REACT', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'tp' },
    { id: 2, day: 'Mardi', start_time: '09:00', end_time: '12:00', course: 'Node.js & Express', course_code: 'DEV-NODE', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 1', type: 'tp' },
    { id: 3, day: 'Mardi', start_time: '14:00', end_time: '16:00', course: 'Introduction Web', course_code: 'DEV-WEB', professor: 'Karim Benjelloun', group: 'DEV-L1-A', room: 'Amphi A', type: 'cours' },
    { id: 4, day: 'Mercredi', start_time: '14:00', end_time: '17:00', course: 'React.js Avancé', course_code: 'DEV-REACT', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'td' },
    { id: 5, day: 'Jeudi', start_time: '09:00', end_time: '11:00', course: 'Node.js & Express', course_code: 'DEV-NODE', professor: 'Karim Benjelloun', group: 'DEV-M2-B', room: 'Lab Info 1', type: 'tp' },
    { id: 6, day: 'Vendredi', start_time: '10:00', end_time: '12:00', course: 'Projet Tutoré', course_code: 'DEV-PROJET', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'tp' },
  ];

  const scheduleByRoom: ScheduleSlot[] = [
    { id: 1, day: 'Lundi', start_time: '09:00', end_time: '12:00', course: 'React.js Avancé', course_code: 'DEV-REACT', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'tp' },
    { id: 2, day: 'Lundi', start_time: '14:00', end_time: '17:00', course: 'Python Avancé', course_code: 'DEV-PYTHON', professor: 'Hassan Alami', group: 'DEV-M1-A', room: 'Lab Info 2', type: 'tp' },
    { id: 3, day: 'Mercredi', start_time: '09:00', end_time: '12:00', course: 'JavaScript', course_code: 'DEV-JS', professor: 'Nadia Fassi', group: 'DEV-L2-A', room: 'Lab Info 2', type: 'tp' },
    { id: 4, day: 'Mercredi', start_time: '14:00', end_time: '17:00', course: 'React.js Avancé', course_code: 'DEV-REACT', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'td' },
    { id: 5, day: 'Vendredi', start_time: '10:00', end_time: '12:00', course: 'Projet Tutoré', course_code: 'DEV-PROJET', professor: 'Karim Benjelloun', group: 'DEV-M2-A', room: 'Lab Info 2', type: 'tp' },
    { id: 6, day: 'Samedi', start_time: '09:00', end_time: '13:00', course: 'Rattrapage', course_code: 'DEV-RAT', professor: 'Hassan Alami', group: 'DEV-M1-B', room: 'Lab Info 2', type: 'examen' },
  ];

  const getCurrentSchedule = () => {
    switch (viewType) {
      case 'group': return scheduleByGroup;
      case 'professor': return scheduleByProfessor;
      case 'room': return scheduleByRoom;
      default: return scheduleByGroup;
    }
  };

  const getSlotForTime = (day: string, time: string) => {
    const schedule = getCurrentSchedule();
    return schedule.find(slot => 
      slot.day === day && 
      slot.start_time <= time && 
      slot.end_time > time
    );
  };

  const getSlotDuration = (slot: ScheduleSlot) => {
    const start = parseInt(slot.start_time.split(':')[0]);
    const end = parseInt(slot.end_time.split(':')[0]);
    return end - start;
  };

  const isSlotStart = (day: string, time: string) => {
    const schedule = getCurrentSchedule();
    return schedule.some(slot => slot.day === day && slot.start_time === time);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-[#0D529C] border-[#0D529C]';
      case 'td': return 'bg-[#257035] border-[#257035]';
      case 'tp': return 'bg-purple-500 border-purple-500';
      case 'examen': return 'bg-[#C1272D] border-[#C1272D]';
      default: return 'bg-gray-500 border-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cours': return 'Cours';
      case 'td': return 'TD';
      case 'tp': return 'TP';
      case 'examen': return 'Examen';
      default: return type;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Emploi du Temps</h1>
          <p className="text-gray-500">Consultez et gérez les plannings des cours.</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* View Type Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewType('group')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'group' ? 'bg-[#0D529C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                Par Groupe
              </button>
              <button
                onClick={() => setViewType('professor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'professor' ? 'bg-[#0D529C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Par Professeur
              </button>
              <button
                onClick={() => setViewType('room')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'room' ? 'bg-[#0D529C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Par Salle
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {viewType === 'group' && (
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {groups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              )}
              {viewType === 'professor' && (
                <select
                  value={selectedProfessor}
                  onChange={(e) => setSelectedProfessor(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {professors.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              )}
              {viewType === 'room' && (
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {rooms.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              )}

              <button className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Exporter PDF
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Ajouter Créneau
              </button>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0D529C]" />
              <span className="font-medium text-gray-700">{currentWeek}</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-sm font-medium text-gray-500 w-20">
                    <Clock className="w-4 h-4 mx-auto" />
                  </th>
                  {days.map((day) => (
                    <th key={day} className="border border-gray-200 p-3 text-sm font-medium text-[#0D529C] min-w-[150px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="border border-gray-200 p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
                      {time}
                    </td>
                    {days.map((day) => {
                      const slot = getSlotForTime(day, time);
                      const isStart = isSlotStart(day, time);

                      if (slot && isStart) {
                        const duration = getSlotDuration(slot);
                        return (
                          <td
                            key={`${day}-${time}`}
                            rowSpan={duration}
                            className="border border-gray-200 p-0 relative"
                          >
                            <div className={`absolute inset-1 rounded-lg ${getTypeColor(slot.type)} text-white p-3 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}>
                              <div className="flex items-start justify-between mb-1">
                                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                                  {getTypeLabel(slot.type)}
                                </span>
                                <span className="text-xs opacity-80">
                                  {slot.start_time} - {slot.end_time}
                                </span>
                              </div>
                              <h4 className="font-bold text-sm mb-1 line-clamp-2">{slot.course}</h4>
                              <p className="text-xs opacity-90 mb-1">{slot.course_code}</p>
                              {viewType !== 'professor' && (
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {slot.professor}
                                </p>
                              )}
                              {viewType !== 'group' && (
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {slot.group}
                                </p>
                              )}
                              {viewType !== 'room' && (
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {slot.room}
                                </p>
                              )}
                            </div>
                          </td>
                        );
                      } else if (slot && !isStart) {
                        return null;
                      } else {
                        return (
                          <td
                            key={`${day}-${time}`}
                            className="border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="h-12"></div>
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg p-4 shadow-sm mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Légende</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#0D529C]"></div>
              <span className="text-sm text-gray-600">Cours Magistral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#257035]"></div>
              <span className="text-sm text-gray-600">Travaux Dirigés (TD)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-sm text-gray-600">Travaux Pratiques (TP)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#C1272D]"></div>
              <span className="text-sm text-gray-600">Examen</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Heures cette semaine</p>
                <p className="text-2xl font-bold text-[#0D529C]">17h</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Créneaux planifiés</p>
                <p className="text-2xl font-bold text-[#257035]">{getCurrentSchedule().length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Salles utilisées</p>
                <p className="text-2xl font-bold text-orange-500">4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}