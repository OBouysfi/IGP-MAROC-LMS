// src/app/professor/students/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Eye, Mail, X, BookOpen, TrendingUp, AlertTriangle, CheckCircle, Award, Loader2 } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';
import { professorStudentsApi, Student, StudentsStats } from '@/lib/api/professor/students';
import Swal from 'sweetalert2';

export default function ProfessorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentsStats | null>(null);
  const [myCourses, setMyCourses] = useState<string[]>([]);
  const [myGroups, setMyGroups] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedCourse, selectedGroup, allStudents]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, statsRes, coursesRes, groupsRes] = await Promise.all([
        professorStudentsApi.getStudents(),
        professorStudentsApi.getStats(),
        professorStudentsApi.getMyCourses(),
        professorStudentsApi.getMyGroups(),
      ]);
      setAllStudents(studentsRes.data.data);
      setFilteredStudents(studentsRes.data.data);
      setStats(statsRes.data.data);
      setMyCourses(coursesRes.data.data);
      setMyGroups(groupsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement des données',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...allStudents];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search)
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter(student => 
        student.courses.includes(selectedCourse)
      );
    }

    if (selectedGroup) {
      filtered = filtered.filter(student => 
        student.group === selectedGroup
      );
    }

    setFilteredStudents(filtered);
  };

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

  if (loading) {
    return (
      <ProfessorLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D529C]" />
        </div>
      </ProfessorLayout>
    );
  }

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Mes Étudiants</h1>
          <p className="text-gray-500">Suivez la performance et la présence de vos étudiants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Étudiants</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats?.total || 0}</p>
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
                <p className="text-xl font-bold text-[#257035]">{stats?.excellent || 0}</p>
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
                <p className="text-xl font-bold text-[#0D529C]">{stats?.good || 0}</p>
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
                <p className="text-xl font-bold text-orange-500">{stats?.average || 0}</p>
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
                <p className="text-xl font-bold text-[#C1272D]">{stats?.at_risk || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
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

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl z-10">
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

              {selectedStudent.grades.length > 0 && (
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
              )}

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