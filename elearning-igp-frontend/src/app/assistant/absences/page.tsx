// src/app/assistant/absences/page.tsx
'use client';

import React, { useState } from 'react';
import { UserCheck, UserX, Search, Filter, Calendar, Clock, Save, CheckCircle, XCircle, Users } from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';

interface Student {
  id: number;
  name: string;
  email: string;
  group: string;
  status: 'present' | 'absent' | 'late' | 'excused' | null;
}

interface CourseSession {
  id: number;
  course: string;
  course_code: string;
  professor: string;
  group: string;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  students: Student[];
}

export default function AssistantAbsencesPage() {
  const [selectedSession, setSelectedSession] = useState<CourseSession | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterGroup, setFilterGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);

  const groups = ['DEV-M2-A', 'DEV-M1-A', 'DEV-L2-A', 'DEV-L1-A'];

  const sessions: CourseSession[] = [
    {
      id: 1,
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      group: 'DEV-M2-A',
      date: '2024-11-18',
      start_time: '09:00',
      end_time: '12:00',
      room: 'Salle A12',
      students: [
        { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@student.igp.edu', group: 'DEV-M2-A', status: 'present' },
        { id: 2, name: 'Youssef Mansouri', email: 'youssef.mansouri@student.igp.edu', group: 'DEV-M2-A', status: 'absent' },
        { id: 3, name: 'Khadija Amrani', email: 'khadija.amrani@student.igp.edu', group: 'DEV-M2-A', status: 'present' },
        { id: 4, name: 'Rachid Tazi', email: 'rachid.tazi@student.igp.edu', group: 'DEV-M2-A', status: 'late' },
        { id: 5, name: 'Salma Idrissi', email: 'salma.idrissi@student.igp.edu', group: 'DEV-M2-A', status: null },
        { id: 6, name: 'Mohamed Alaoui', email: 'mohamed.alaoui@student.igp.edu', group: 'DEV-M2-A', status: null },
        { id: 7, name: 'Fatima Zahra', email: 'fatima.zahra@student.igp.edu', group: 'DEV-M2-A', status: 'present' },
      ],
    },
    {
      id: 2,
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      group: 'DEV-M2-A',
      date: '2024-11-18',
      start_time: '14:00',
      end_time: '17:00',
      room: 'Lab Info 1',
      students: [
        { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@student.igp.edu', group: 'DEV-M2-A', status: null },
        { id: 2, name: 'Youssef Mansouri', email: 'youssef.mansouri@student.igp.edu', group: 'DEV-M2-A', status: null },
        { id: 3, name: 'Khadija Amrani', email: 'khadija.amrani@student.igp.edu', group: 'DEV-M2-A', status: null },
      ],
    },
    {
      id: 3,
      course: 'JavaScript Moderne',
      course_code: 'DEV-JS',
      professor: 'Karim Benjelloun',
      group: 'DEV-L2-A',
      date: '2024-11-18',
      start_time: '10:00',
      end_time: '13:00',
      room: 'Salle C5',
      students: [
        { id: 8, name: 'Omar Tazi', email: 'omar.tazi@student.igp.edu', group: 'DEV-L2-A', status: null },
        { id: 9, name: 'Laila Bennani', email: 'laila.bennani@student.igp.edu', group: 'DEV-L2-A', status: null },
      ],
    },
  ];

  const filteredSessions = sessions.filter(session => {
    if (filterGroup && session.group !== filterGroup) return false;
    if (selectedDate && session.date !== selectedDate) return false;
    return true;
  });

  const openAttendance = (session: CourseSession) => {
    setSelectedSession(session);
    const initialData: { [key: number]: string } = {};
    session.students.forEach(student => {
      initialData[student.id] = student.status || '';
    });
    setAttendanceData(initialData);
    setHasChanges(false);
  };

  const updateAttendance = (studentId: number, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status,
    }));
    setHasChanges(true);
  };

  const saveAttendance = () => {
    setHasChanges(false);
    alert('Présences enregistrées avec succès!');
  };

  const markAllPresent = () => {
    if (!selectedSession) return;
    const newData: { [key: number]: string } = {};
    selectedSession.students.forEach(student => {
      newData[student.id] = 'present';
    });
    setAttendanceData(newData);
    setHasChanges(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700 border-green-300';
      case 'absent': return 'bg-red-100 text-red-700 border-red-300';
      case 'late': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'excused': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const stats = {
    total_sessions: filteredSessions.length,
    completed: filteredSessions.filter(s => s.students.every(st => st.status !== null)).length,
    pending: filteredSessions.filter(s => s.students.some(st => st.status === null)).length,
  };

  return (
    <AssistantLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C1272D] mb-2">Gestion des Absences</h1>
          <p className="text-gray-500">Marquez les présences et absences par séance de cours.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Séances du jour</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_sessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Complétées</p>
                <p className="text-xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En attente</p>
                <p className="text-xl font-bold text-orange-500">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Groupe</label>
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
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const presentCount = session.students.filter(s => s.status === 'present').length;
            const absentCount = session.students.filter(s => s.status === 'absent').length;
            const pendingCount = session.students.filter(s => s.status === null).length;
            const isComplete = pendingCount === 0;

            return (
              <div key={session.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                isComplete ? 'border-green-200' : 'border-orange-200'
              }`}>
                <div className={`p-4 text-white ${
                  isComplete ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-[#C1272D] to-red-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                      isComplete ? 'bg-green-700' : 'bg-red-700'
                    }`}>
                      {isComplete ? 'Complété' : 'En attente'}
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {session.group}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{session.course}</h3>
                  <p className="text-sm opacity-90">{session.professor}</p>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{session.start_time} - {session.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{session.students.length} étudiants</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-lg font-bold text-green-600">{presentCount}</p>
                      <p className="text-xs text-gray-500">Présents</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-lg font-bold text-red-600">{absentCount}</p>
                      <p className="text-xs text-gray-500">Absents</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <p className="text-lg font-bold text-orange-600">{pendingCount}</p>
                      <p className="text-xs text-gray-500">En attente</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => openAttendance(session)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    Marquer les présences
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune séance trouvée pour cette date</p>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#C1272D] text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedSession.course}</h2>
                  <p className="text-red-200">
                    {selectedSession.group} • {selectedSession.start_time} - {selectedSession.end_time} • {selectedSession.room}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white">
                      Non sauvegardé
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C1272D] focus:border-transparent"
                />
              </div>
              <button
                onClick={markAllPresent}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Tous présents
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {selectedSession.students
                  .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C1272D] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateAttendance(student.id, 'present')}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            attendanceData[student.id] === 'present'
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                          }`}
                        >
                          Présent
                        </button>
                        <button
                          onClick={() => updateAttendance(student.id, 'absent')}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            attendanceData[student.id] === 'absent'
                              ? 'bg-red-500 text-white border-red-500'
                              : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => updateAttendance(student.id, 'late')}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            attendanceData[student.id] === 'late'
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          Retard
                        </button>
                        <button
                          onClick={() => updateAttendance(student.id, 'excused')}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            attendanceData[student.id] === 'excused'
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          Excusé
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  {Object.values(attendanceData).filter(v => v).length} / {selectedSession.students.length} marqués
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  onClick={saveAttendance}
                  disabled={!hasChanges}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasChanges
                      ? 'bg-[#C1272D] text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AssistantLayout>
  );
}