// src/app/professor/students/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, Search, Filter, Eye, Mail, X, BookOpen, TrendingUp, AlertTriangle, CheckCircle, Clock, Award } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';

interface StudentGrade {
  course: string;
  grade: number;
  type: string;
  date: string;
}

interface StudentAttendance {
  total_sessions: number;
  attended: number;
  absences: number;
  rate: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  group: string;
  filiere: string;
  program: string;
  photo: string;
  courses: string[];
  average: number;
  attendance: StudentAttendance;
  grades: StudentGrade[];
  status: 'excellent' | 'good' | 'average' | 'at_risk';
}

export default function ProfessorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const myCourses = [
    'React.js Avancé',
    'Node.js & Express',
    'Introduction au Web',
    'JavaScript Moderne',
    'Base de données NoSQL',
  ];

  const myGroups = ['DEV-M2-A', 'DEV-L1-A', 'DEV-L2-A'];

  const students: Student[] = [
    {
      id: 1,
      name: 'Ahmed Benali',
      email: 'ahmed.benali@student.igp.edu',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      photo: '',
      courses: ['React.js Avancé', 'Node.js & Express', 'Base de données NoSQL'],
      average: 16.5,
      attendance: { total_sessions: 24, attended: 22, absences: 2, rate: 92 },
      grades: [
        { course: 'React.js Avancé', grade: 17.5, type: 'Partiel', date: '2024-11-10' },
        { course: 'Node.js & Express', grade: 15.5, type: 'TP', date: '2024-11-08' },
        { course: 'Base de données NoSQL', grade: 16.0, type: 'Contrôle', date: '2024-11-05' },
      ],
      status: 'excellent',
    },
    {
      id: 2,
      name: 'Youssef Mansouri',
      email: 'youssef.mansouri@student.igp.edu',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      photo: '',
      courses: ['React.js Avancé', 'Node.js & Express', 'Base de données NoSQL'],
      average: 14.8,
      attendance: { total_sessions: 24, attended: 23, absences: 1, rate: 96 },
      grades: [
        { course: 'React.js Avancé', grade: 15.0, type: 'Partiel', date: '2024-11-10' },
        { course: 'Node.js & Express', grade: 14.5, type: 'TP', date: '2024-11-08' },
        { course: 'Base de données NoSQL', grade: 15.0, type: 'Contrôle', date: '2024-11-05' },
      ],
      status: 'good',
    },
    {
      id: 3,
      name: 'Khadija Amrani',
      email: 'khadija.amrani@student.igp.edu',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      photo: '',
      courses: ['React.js Avancé', 'Node.js & Express', 'Base de données NoSQL'],
      average: 18.2,
      attendance: { total_sessions: 24, attended: 24, absences: 0, rate: 100 },
      grades: [
        { course: 'React.js Avancé', grade: 19.0, type: 'Partiel', date: '2024-11-10' },
        { course: 'Node.js & Express', grade: 17.5, type: 'TP', date: '2024-11-08' },
        { course: 'Base de données NoSQL', grade: 18.0, type: 'Contrôle', date: '2024-11-05' },
      ],
      status: 'excellent',
    },
    {
      id: 4,
      name: 'Rachid Tazi',
      email: 'rachid.tazi@student.igp.edu',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      photo: '',
      courses: ['React.js Avancé', 'Node.js & Express', 'Base de données NoSQL'],
      average: 9.5,
      attendance: { total_sessions: 24, attended: 18, absences: 6, rate: 75 },
      grades: [
        { course: 'React.js Avancé', grade: 8.5, type: 'Partiel', date: '2024-11-10' },
        { course: 'Node.js & Express', grade: 10.0, type: 'TP', date: '2024-11-08' },
        { course: 'Base de données NoSQL', grade: 10.0, type: 'Contrôle', date: '2024-11-05' },
      ],
      status: 'at_risk',
    },
    {
      id: 5,
      name: 'Salma Idrissi',
      email: 'salma.idrissi@student.igp.edu',
      group: 'DEV-M2-A',
      filiere: 'Développement',
      program: 'Master',
      photo: '',
      courses: ['React.js Avancé', 'Node.js & Express', 'Base de données NoSQL'],
      average: 15.0,
      attendance: { total_sessions: 24, attended: 21, absences: 3, rate: 88 },
      grades: [
        { course: 'React.js Avancé', grade: 15.5, type: 'Partiel', date: '2024-11-10' },
        { course: 'Node.js & Express', grade: 14.5, type: 'TP', date: '2024-11-08' },
        { course: 'Base de données NoSQL', grade: 15.0, type: 'Contrôle', date: '2024-11-05' },
      ],
      status: 'good',
    },
    {
      id: 6,
      name: 'Omar Benjelloun',
      email: 'omar.benjelloun@student.igp.edu',
      group: 'DEV-L1-A',
      filiere: 'Développement',
      program: 'Licence',
      photo: '',
      courses: ['Introduction au Web'],
      average: 13.5,
      attendance: { total_sessions: 16, attended: 15, absences: 1, rate: 94 },
      grades: [
        { course: 'Introduction au Web', grade: 13.5, type: 'Partiel', date: '2024-11-12' },
      ],
      status: 'average',
    },
    {
      id: 7,
      name: 'Fatima Zahra',
      email: 'fatima.zahra@student.igp.edu',
      group: 'DEV-L2-A',
      filiere: 'Développement',
      program: 'Licence',
      photo: '',
      courses: ['JavaScript Moderne'],
      average: 12.0,
      attendance: { total_sessions: 12, attended: 10, absences: 2, rate: 83 },
      grades: [
        { course: 'JavaScript Moderne', grade: 12.0, type: 'Contrôle', date: '2024-11-14' },
      ],
      status: 'average',
    },
    {
      id: 8,
      name: 'Hassan Alaoui',
      email: 'hassan.alaoui@student.igp.edu',
      group: 'DEV-L1-A',
      filiere: 'Développement',
      program: 'Licence',
      photo: '',
      courses: ['Introduction au Web'],
      average: 16.0,
      attendance: { total_sessions: 16, attended: 16, absences: 0, rate: 100 },
      grades: [
        { course: 'Introduction au Web', grade: 16.0, type: 'Partiel', date: '2024-11-12' },
      ],
      status: 'excellent',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-[#257035] text-white';
      case 'good': return 'bg-[#0D529C] text-white';
      case 'average': return 'bg-orange-500 text-white';
      case 'at_risk': return 'bg-[#C1272D] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bon';
      case 'average': return 'Moyen';
      case 'at_risk': return 'À risque';
      default: return status;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-[#257035] bg-green-50';
    if (grade >= 14) return 'text-[#0D529C] bg-blue-50';
    if (grade >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-[#C1272D] bg-red-50';
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-[#257035]';
    if (rate >= 75) return 'text-orange-500';
    return 'text-[#C1272D]';
  };

  const filteredStudents = students.filter(student => {
    if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) && !student.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCourse && !student.courses.includes(selectedCourse)) {
      return false;
    }
    if (selectedGroup && student.group !== selectedGroup) {
      return false;
    }
    return true;
  });

  const stats = {
    total: filteredStudents.length,
    excellent: filteredStudents.filter(s => s.status === 'excellent').length,
    good: filteredStudents.filter(s => s.status === 'good').length,
    average: filteredStudents.filter(s => s.status === 'average').length,
    at_risk: filteredStudents.filter(s => s.status === 'at_risk').length,
  };

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Mes Étudiants</h1>
          <p className="text-gray-500">Suivez la performance et la présence de vos étudiants.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Étudiants</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Excellents</p>
                <p className="text-xl font-bold text-[#257035]">{stats.excellent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Bons</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.good}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Moyens</p>
                <p className="text-xl font-bold text-orange-500">{stats.average}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">À Risque</p>
                <p className="text-xl font-bold text-[#C1272D]">{stats.at_risk}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Tous les cours</option>
                {myCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Tous les groupes</option>
                {myGroups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Groupe</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Moyenne</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Présence</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0D529C] rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                          {student.group}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {student.courses.slice(0, 2).map((course) => (
                            <span key={course} className="inline-flex px-2 py-0.5 text-xs bg-blue-50 text-[#0D529C] rounded">
                              {course.split(' ')[0]}
                            </span>
                          ))}
                          {student.courses.length > 2 && (
                            <span className="inline-flex px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              +{student.courses.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${getGradeColor(student.average)}`}>
                          {student.average.toFixed(1)}/20
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-bold ${getAttendanceColor(student.attendance.rate)}`}>
                          {student.attendance.rate}%
                        </span>
                        <p className="text-xs text-gray-500">{student.attendance.absences} abs.</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                          {getStatusLabel(student.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#0D529C] hover:text-white transition-colors ml-1">
                          <Mail className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun étudiant trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0D529C] font-bold text-xl">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                    <p className="text-blue-200">{selectedStudent.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded bg-white/20">{selectedStudent.group}</span>
                      <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedStudent.status)}`}>
                        {getStatusLabel(selectedStudent.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#0D529C]">{selectedStudent.average.toFixed(1)}</p>
                  <p className="text-xs text-gray-600">Moyenne Générale</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#257035]">{selectedStudent.attendance.rate}%</p>
                  <p className="text-xs text-gray-600">Taux de Présence</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-500">{selectedStudent.attendance.absences}</p>
                  <p className="text-xs text-gray-600">Absences</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-500">{selectedStudent.courses.length}</p>
                  <p className="text-xs text-gray-600">Cours suivis</p>
                </div>
              </div>

              {/* Courses */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Cours suivis avec vous</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.courses.map((course) => (
                    <span key={course} className="inline-flex px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                      <BookOpen className="w-4 h-4 text-[#0D529C] mr-2" />
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grades History */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Historique des Notes</h3>
                <div className="space-y-3">
                  {selectedStudent.grades.map((grade, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{grade.course}</p>
                        <p className="text-xs text-gray-500">{grade.type} • {new Date(grade.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <span className={`inline-flex px-4 py-2 text-lg font-bold rounded ${getGradeColor(grade.grade)}`}>
                        {grade.grade}/20
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Details */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4">Détails de Présence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{selectedStudent.attendance.total_sessions}</p>
                    <p className="text-xs text-gray-600">Sessions Totales</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#257035]">{selectedStudent.attendance.attended}</p>
                    <p className="text-xs text-gray-600">Sessions Présentes</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-[#C1272D]">{selectedStudent.attendance.absences}</p>
                    <p className="text-xs text-gray-600">Absences</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Taux de présence</span>
                    <span className="text-sm font-bold">{selectedStudent.attendance.rate}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        selectedStudent.attendance.rate >= 90 ? 'bg-[#257035]' :
                        selectedStudent.attendance.rate >= 75 ? 'bg-orange-500' :
                        'bg-[#C1272D]'
                      }`}
                      style={{ width: `${selectedStudent.attendance.rate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="w-4 h-4" />
                  Envoyer Email
                </button>
                {selectedStudent.status === 'at_risk' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                    Signaler
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ProfessorLayout>
  );
}