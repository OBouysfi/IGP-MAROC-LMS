// src/app/admin/attendance/page.tsx
'use client';

import React, { useState } from 'react';
import { UserCheck, UserX, Clock, AlertTriangle, Search, Filter, Eye, X, CheckCircle, Plus, Calendar, Users } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Absence {
  id: number;
  date: string;
  course: string;
  start_time: string;
  end_time: string;
  type: 'absent' | 'retard' | 'justifié';
  justification: string | null;
  justified_at: string | null;
}

interface StudentAttendance {
  id: number;
  student_name: string;
  student_email: string;
  group: string;
  filiere: string;
  total_absences: number;
  total_retards: number;
  justified_absences: number;
  attendance_rate: number;
  absences: Absence[];
}

interface ProfessorAttendance {
  id: number;
  professor_name: string;
  professor_email: string;
  department: string;
  total_absences: number;
  total_retards: number;
  justified_absences: number;
  attendance_rate: number;
  absences: Absence[];
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'students' | 'professors'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendance | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorAttendance | null>(null);
  const [showAddAbsenceModal, setShowAddAbsenceModal] = useState(false);
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [absenceToJustify, setAbsenceToJustify] = useState<Absence | null>(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filters, setFilters] = useState({
    group: '',
    filiere: '',
    date_from: '',
    date_to: '',
  });

  const [justificationText, setJustificationText] = useState('');

  const stats = {
    total_students: 1250,
    present_today: 1180,
    absent_today: 45,
    late_today: 25,
    global_attendance_rate: 94.4,
  };

  const groups = ['DEV-M2-A', 'DEV-M1-A', 'DEV-L3-A', 'COM-L3-B', 'MKT-M1-A', 'FIN-M1-A', 'FIN-L2-A'];
  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const departments = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion', 'Langues', 'Droit'];

  const studentsAttendance: StudentAttendance[] = [
    {
      id: 1,
      student_name: 'Ahmed Benali',
      student_email: 'ahmed.benali@student.igp.edu',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      total_absences: 3,
      total_retards: 2,
      justified_absences: 2,
      attendance_rate: 95,
      absences: [
        { id: 1, date: '2024-11-10', course: 'React.js Avancé', start_time: '09:00', end_time: '12:00', type: 'absent', justification: 'Certificat médical', justified_at: '2024-11-11' },
        { id: 2, date: '2024-11-08', course: 'Node.js & Express', start_time: '14:00', end_time: '17:00', type: 'retard', justification: null, justified_at: null },
        { id: 3, date: '2024-11-05', course: 'DevOps & CI/CD', start_time: '09:00', end_time: '12:00', type: 'justifié', justification: 'Convocation administrative', justified_at: '2024-11-06' },
      ],
    },
    {
      id: 2,
      student_name: 'Fatima Zahra',
      student_email: 'fatima.zahra@student.igp.edu',
      group: 'COM-L3-B',
      filiere: 'Commerce',
      total_absences: 8,
      total_retards: 5,
      justified_absences: 3,
      attendance_rate: 78,
      absences: [
        { id: 4, date: '2024-11-12', course: 'Marketing Digital', start_time: '14:00', end_time: '17:00', type: 'absent', justification: null, justified_at: null },
        { id: 5, date: '2024-11-11', course: 'Droit des Affaires', start_time: '09:00', end_time: '12:00', type: 'absent', justification: null, justified_at: null },
        { id: 6, date: '2024-11-09', course: 'Communication', start_time: '14:00', end_time: '16:00', type: 'retard', justification: null, justified_at: null },
      ],
    },
    {
      id: 3,
      student_name: 'Youssef Mansouri',
      student_email: 'youssef.mansouri@student.igp.edu',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      total_absences: 1,
      total_retards: 0,
      justified_absences: 1,
      attendance_rate: 98,
      absences: [
        { id: 7, date: '2024-11-07', course: 'Base de données NoSQL', start_time: '09:00', end_time: '12:00', type: 'justifié', justification: 'Rendez-vous médical', justified_at: '2024-11-08' },
      ],
    },
    {
      id: 4,
      student_name: 'Sara Idrissi',
      student_email: 'sara.idrissi@student.igp.edu',
      group: 'FIN-L2-A',
      filiere: 'Finance',
      total_absences: 0,
      total_retards: 1,
      justified_absences: 0,
      attendance_rate: 99,
      absences: [
        { id: 8, date: '2024-11-13', course: 'Comptabilité', start_time: '09:00', end_time: '11:00', type: 'retard', justification: null, justified_at: null },
      ],
    },
    {
      id: 5,
      student_name: 'Mohamed Alaoui',
      student_email: 'mohamed.alaoui@student.igp.edu',
      group: 'MKT-M1-A',
      filiere: 'Marketing',
      total_absences: 12,
      total_retards: 8,
      justified_absences: 4,
      attendance_rate: 65,
      absences: [
        { id: 9, date: '2024-11-14', course: 'Stratégie Marketing', start_time: '14:00', end_time: '17:00', type: 'absent', justification: null, justified_at: null },
        { id: 10, date: '2024-11-13', course: 'Analyse de Marché', start_time: '09:00', end_time: '12:00', type: 'absent', justification: null, justified_at: null },
        { id: 11, date: '2024-11-12', course: 'Communication Digitale', start_time: '14:00', end_time: '16:00', type: 'retard', justification: null, justified_at: null },
      ],
    },
  ];

  const professorsAttendance: ProfessorAttendance[] = [
    {
      id: 1,
      professor_name: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      department: 'Développement',
      total_absences: 1,
      total_retards: 0,
      justified_absences: 1,
      attendance_rate: 99,
      absences: [
        { id: 12, date: '2024-11-06', course: 'React.js Avancé', start_time: '09:00', end_time: '12:00', type: 'justifié', justification: 'Formation externe', justified_at: '2024-11-05' },
      ],
    },
    {
      id: 2,
      professor_name: 'Amina El Fassi',
      professor_email: 'a.elfassi@igp.edu',
      department: 'Marketing',
      total_absences: 2,
      total_retards: 1,
      justified_absences: 2,
      attendance_rate: 97,
      absences: [
        { id: 13, date: '2024-11-11', course: 'Marketing Digital', start_time: '14:00', end_time: '17:00', type: 'justifié', justification: 'Conférence', justified_at: '2024-11-10' },
        { id: 14, date: '2024-11-08', course: 'Stratégie Social Media', start_time: '09:00', end_time: '12:00', type: 'retard', justification: null, justified_at: null },
      ],
    },
    {
      id: 3,
      professor_name: 'Omar Tazi',
      professor_email: 'o.tazi@igp.edu',
      department: 'Finance',
      total_absences: 0,
      total_retards: 0,
      justified_absences: 0,
      attendance_rate: 100,
      absences: [],
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'absent': return 'bg-[#C1272D] text-white';
      case 'retard': return 'bg-orange-500 text-white';
      case 'justifié': return 'bg-[#257035] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'absent': return 'Absent';
      case 'retard': return 'Retard';
      case 'justifié': return 'Justifié';
      default: return type;
    }
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-[#257035] bg-green-50';
    if (rate >= 75) return 'text-orange-600 bg-orange-50';
    return 'text-[#C1272D] bg-red-50';
  };

  const resetFilters = () => {
    setFilters({ group: '', filiere: '', date_from: '', date_to: '' });
  };

  const openJustifyModal = (absence: Absence) => {
    setAbsenceToJustify(absence);
    setJustificationText(absence.justification || '');
    setShowJustifyModal(true);
  };

  const confirmJustification = () => {
    // Logic to save justification
    setShowJustifyModal(false);
    setAbsenceToJustify(null);
    setJustificationText('');
  };

  const filteredStudents = studentsAttendance.filter(student => {
    if (filters.group && student.group !== filters.group) return false;
    if (filters.filiere && student.filiere !== filters.filiere) return false;
    if (searchTerm && !student.student_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Absences & Présences</h1>
          <p className="text-gray-500">Suivez la présence des étudiants et des professeurs.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Étudiants</p>
                <p className="text-lg font-bold text-[#0D529C]">{stats.total_students}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Présents Aujourd'hui</p>
                <p className="text-lg font-bold text-[#257035]">{stats.present_today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Absents Aujourd'hui</p>
                <p className="text-lg font-bold text-[#C1272D]">{stats.absent_today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Retards Aujourd'hui</p>
                <p className="text-lg font-bold text-orange-500">{stats.late_today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Taux Présence Global</p>
                <p className="text-lg font-bold text-purple-500">{stats.global_attendance_rate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'students'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Étudiants
              </button>
              <button
                onClick={() => setActiveTab('professors')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'professors'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Professeurs
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'students' && (
              <>
                {/* Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0D529C]">Présence des Étudiants</h3>
                    <p className="text-sm text-gray-500">Consultez et gérez les absences par groupe</p>
                  </div>
                  <button
                    onClick={() => setShowAddAbsenceModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Marquer Absence
                  </button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filters.group}
                    onChange={(e) => setFilters({ ...filters, group: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les groupes</option>
                    {groups.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                      showFilters ? 'border-[#0D529C] bg-blue-50 text-[#0D529C]' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Plus de filtres
                  </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-700">Filtres avancés</h3>
                      <button onClick={resetFilters} className="text-sm text-[#C1272D] hover:underline">
                        Réinitialiser
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Filière</label>
                        <select
                          value={filters.filiere}
                          onChange={(e) => setFilters({ ...filters, filiere: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        >
                          <option value="">Toutes les filières</option>
                          {filieres.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Date début</label>
                        <input
                          type="date"
                          value={filters.date_from}
                          onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Date fin</label>
                        <input
                          type="date"
                          value={filters.date_to}
                          onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiant</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Groupe</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Absences</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Retards</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Justifiées</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Taux Présence</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{student.student_name}</p>
                              <p className="text-xs text-gray-500">{student.student_email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                              {student.group}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${
                              student.total_absences > 10 ? 'text-[#C1272D] bg-red-50' :
                              student.total_absences > 5 ? 'text-orange-600 bg-orange-50' :
                              'text-gray-600 bg-gray-50'
                            }`}>
                              {student.total_absences}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex px-3 py-1 text-sm font-bold text-orange-600 bg-orange-50 rounded">
                              {student.total_retards}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex px-3 py-1 text-sm font-bold text-[#257035] bg-green-50 rounded">
                              {student.justified_absences}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${getAttendanceRateColor(student.attendance_rate)}`}>
                              {student.attendance_rate}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'professors' && (
              <>
                {/* Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#0D529C]">Présence des Professeurs</h3>
                    <p className="text-sm text-gray-500">Consultez les absences des enseignants</p>
                  </div>
                  <button
                    onClick={() => setShowAddAbsenceModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Marquer Absence
                  </button>
                </div>

                {/* Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les départements</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Professors Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Absences</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Retards</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Justifiées</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Taux Présence</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professorsAttendance.map((professor) => (
                        <tr key={professor.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{professor.professor_name}</p>
                              <p className="text-xs text-gray-500">{professor.professor_email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                              {professor.department}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex px-3 py-1 text-sm font-bold text-gray-600 bg-gray-50 rounded">
                              {professor.total_absences}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex px-3 py-1 text-sm font-bold text-orange-600 bg-orange-50 rounded">
                              {professor.total_retards}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex px-3 py-1 text-sm font-bold text-[#257035] bg-green-50 rounded">
                              {professor.justified_absences}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${getAttendanceRateColor(professor.attendance_rate)}`}>
                              {professor.attendance_rate}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedProfessor(professor)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedStudent.student_name}</h2>
                <p className="text-blue-200">{selectedStudent.group} • {selectedStudent.filiere}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#C1272D]">{selectedStudent.total_absences}</p>
                  <p className="text-xs text-gray-600">Absences</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-500">{selectedStudent.total_retards}</p>
                  <p className="text-xs text-gray-600">Retards</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#257035]">{selectedStudent.justified_absences}</p>
                  <p className="text-xs text-gray-600">Justifiées</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#0D529C]">{selectedStudent.attendance_rate}%</p>
                  <p className="text-xs text-gray-600">Taux Présence</p>
                </div>
              </div>

              {/* Absences List */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Historique des Absences</h3>
                {selectedStudent.absences.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Aucune absence enregistrée</p>
                ) : (
                  <div className="space-y-3">
                    {selectedStudent.absences.map((absence) => (
                      <div key={absence.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-sm font-bold text-[#0D529C]">
                                {new Date(absence.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </p>
                              <p className="text-xs text-gray-500">{absence.start_time} - {absence.end_time}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{absence.course}</p>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(absence.type)}`}>
                                {getTypeLabel(absence.type)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {absence.justification ? (
                              <div className="text-right">
                                <p className="text-xs text-[#257035] font-medium">Justifié</p>
                                <p className="text-xs text-gray-500">{absence.justification}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => openJustifyModal(absence)}
                                className="flex items-center gap-1 px-3 py-1 bg-[#257035] text-white rounded-lg text-xs hover:bg-green-700"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Justifier
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professor Detail Modal */}
      {selectedProfessor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedProfessor.professor_name}</h2>
                <p className="text-blue-200">{selectedProfessor.department}</p>
              </div>
              <button onClick={() => setSelectedProfessor(null)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#C1272D]">{selectedProfessor.total_absences}</p>
                  <p className="text-xs text-gray-600">Absences</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-500">{selectedProfessor.total_retards}</p>
                  <p className="text-xs text-gray-600">Retards</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#257035]">{selectedProfessor.justified_absences}</p>
                  <p className="text-xs text-gray-600">Justifiées</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#0D529C]">{selectedProfessor.attendance_rate}%</p>
                  <p className="text-xs text-gray-600">Taux Présence</p>
                </div>
              </div>

              {/* Absences List */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Historique des Absences</h3>
                {selectedProfessor.absences.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Aucune absence enregistrée</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProfessor.absences.map((absence) => (
                      <div key={absence.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-sm font-bold text-[#0D529C]">
                                {new Date(absence.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </p>
                              <p className="text-xs text-gray-500">{absence.start_time} - {absence.end_time}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{absence.course}</p>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(absence.type)}`}>
                                {getTypeLabel(absence.type)}
                              </span>
                            </div>
                          </div>
                          <div>
                            {absence.justification ? (
                              <div className="text-right">
                                <p className="text-xs text-[#257035] font-medium">Justifié</p>
                                <p className="text-xs text-gray-500">{absence.justification}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => openJustifyModal(absence)}
                                className="flex items-center gap-1 px-3 py-1 bg-[#257035] text-white rounded-lg text-xs hover:bg-green-700"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Justifier
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Absence Modal */}
      {showAddAbsenceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Marquer une Absence</h2>
                <button onClick={() => setShowAddAbsenceModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="student">Étudiant</option>
                  <option value="professor">Professeur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {activeTab === 'students' ? 'Groupe' : 'Département'}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="">Sélectionner...</option>
                  {activeTab === 'students' ? (
                    groups.map((g) => <option key={g} value={g}>{g}</option>)
                  ) : (
                    departments.map((d) => <option key={d} value={d}>{d}</option>)
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {activeTab === 'students' ? 'Étudiant' : 'Professeur'}
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="">Sélectionner...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cours</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="">Sélectionner le cours...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Type d'absence</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent">
                  <option value="absent">Absent</option>
                  <option value="retard">Retard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Commentaire (optionnel)</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowAddAbsenceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700">
                <UserX className="w-4 h-4" />
                Marquer Absent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Justify Absence Modal */}
      {showJustifyModal && absenceToJustify && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#257035]">Justifier l'Absence</h2>
                <button onClick={() => setShowJustifyModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date(absenceToJustify.date).toLocaleDateString('fr-FR')}</span></p>
                <p className="text-sm text-gray-600">Cours: <span className="font-medium">{absenceToJustify.course}</span></p>
                <p className="text-sm text-gray-600">Horaire: <span className="font-medium">{absenceToJustify.start_time} - {absenceToJustify.end_time}</span></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Motif de justification</label>
                <textarea
                  value={justificationText}
                  onChange={(e) => setJustificationText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Ex: Certificat médical, convocation administrative..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Pièce justificative (optionnel)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#257035] transition-colors cursor-pointer">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Cliquez pour ajouter un fichier</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowJustifyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmJustification}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Valider Justification
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}