'use client';

import { useState, useEffect } from 'react';
import { attendancesApi, StudentAttendance, ProfessorAttendance, AttendanceStats, Absence } from '@/lib/api/admin/attendances';
import { coursesApi } from '@/lib/api/admin/courses';
import { UserCheck, UserX, Clock, AlertTriangle, Search, Filter, Eye, X, CheckCircle, Plus, Calendar, Users } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'students' | 'professors'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendance | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorAttendance | null>(null);
  const [showAddAbsenceModal, setShowAddAbsenceModal] = useState(false);
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [absenceToJustify, setAbsenceToJustify] = useState<Absence | null>(null);
  
  const [studentsAttendance, setStudentsAttendance] = useState<StudentAttendance[]>([]);
  const [professorsAttendance, setProfessorsAttendance] = useState<ProfessorAttendance[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    group: '',
    filiere: '',
    date_from: '',
    date_to: '',
  });

  const [absenceForm, setAbsenceForm] = useState({
    user_type: 'student',
    group_id: 0,
    department: '',
    attendable_id: 0,
    course_name: '',
    date: '',
    start_time: '09:00',
    end_time: '12:00',
    type: 'absent' as 'absent' | 'retard',
    comment: '',
  });

  const [justificationForm, setJustificationForm] = useState({
    justification: '',
    file: null as File | null,
  });

  const [groupStudents, setGroupStudents] = useState<any[]>([]);
  const [departmentProfessors, setDepartmentProfessors] = useState<any[]>([]);

  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudentsAttendance();
    } else {
      fetchProfessorsAttendance();
    }
  }, [activeTab, filters, searchTerm]);

  useEffect(() => {
    if (absenceForm.group_id > 0) {
      fetchStudentsByGroup(absenceForm.group_id);
    }
  }, [absenceForm.group_id]);

  useEffect(() => {
    if (absenceForm.department) {
      fetchProfessorsByDepartment(absenceForm.department);
    }
  }, [absenceForm.department]);

  const fetchInitialData = async () => {
    try {
      const [statsRes, groupsRes, departmentsRes, coursesRes] = await Promise.all([
        attendancesApi.getStats(),
        attendancesApi.getGroups(),
        attendancesApi.getDepartments(),
        coursesApi.getAll()
      ]);
      
      setStats(statsRes.data);
      setGroups(groupsRes.data.data);
      setDepartments(departmentsRes.data.data);
      setCourses(coursesRes.data.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les données',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const fetchStudentsAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendancesApi.getStudentsAttendance({
        search: searchTerm,
        ...filters  // ← Ceci inclut date_from et date_to
      });
      setStudentsAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching students attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessorsAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendancesApi.getProfessorsAttendance({
        search: searchTerm,
        department: filters.group // Utilise le même filtre
      });
      setProfessorsAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching professors attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByGroup = async (groupId: number) => {
    try {
      const response = await attendancesApi.getStudentsByGroup(groupId);
      setGroupStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchProfessorsByDepartment = async (department: string) => {
    try {
      const response = await attendancesApi.getProfessorsByDepartment(department);
      setDepartmentProfessors(response.data.data);
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  };

  const handleAddAbsence = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const data = {
      student_id: absenceForm.attendable_id, // ✅ Changed from attendable_id
      schedule_id: null, // Optional
      course_name: absenceForm.course_name,
      date: absenceForm.date,
      start_time: absenceForm.start_time,
      end_time: absenceForm.end_time,
      type: absenceForm.type,
      comment: absenceForm.comment,
    };

    console.log('Sending data:', data); // Debug log

    await attendancesApi.create(data);
    
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Absence enregistrée avec succès',
      confirmButtonColor: '#0D529C',
      timer: 2000,
    });
    
    setShowAddAbsenceModal(false);
    resetAbsenceForm();
    fetchInitialData();
    if (activeTab === 'students') {
      fetchStudentsAttendance();
    } else {
      fetchProfessorsAttendance();
    }
  } catch (error: any) {
    console.error('Error adding absence:', error);
    console.error('Error response:', error.response?.data); // Debug log
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.response?.data?.message || 'Impossible d\'enregistrer l\'absence',
      confirmButtonColor: '#0D529C',
    });
  }
};

  const handleJustifyAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!absenceToJustify) return;

    try {
      const formData = new FormData();
      formData.append('justification', justificationForm.justification);
      if (justificationForm.file) {
        formData.append('justification_file', justificationForm.file);
      }

      await attendancesApi.justify(absenceToJustify.id, formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Absence justifiée avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
      
      setShowJustifyModal(false);
      setAbsenceToJustify(null);
      resetJustificationForm();
      if (activeTab === 'students') {
        fetchStudentsAttendance();
      } else {
        fetchProfessorsAttendance();
      }
    } catch (error: any) {
      console.error('Error justifying absence:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de justifier l\'absence',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const openJustifyModal = (absence: Absence) => {
    setAbsenceToJustify(absence);
    setJustificationForm({
      justification: absence.justification || '',
      file: null,
    });
    setShowJustifyModal(true);
  };

  const resetAbsenceForm = () => {
    setAbsenceForm({
      user_type: 'student',
      group_id: 0,
      department: '',
      attendable_id: 0,
      course_name: '',
      date: '',
      start_time: '09:00',
      end_time: '12:00',
      type: 'absent',
      comment: '',
    });
    setGroupStudents([]);
    setDepartmentProfessors([]);
  };

  const resetJustificationForm = () => {
    setJustificationForm({
      justification: '',
      file: null,
    });
  };

  const resetFilters = () => {
    setFilters({ group: '', filiere: '', date_from: '', date_to: '' });
  };

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

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Absences & Présences</h1>
          <p className="text-gray-500">Suivez la présence des étudiants et des professeurs.</p>
        </div>

        {/* Stats Grid */}
        {stats && (
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
        )}

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
                    onClick={() => {
                      setAbsenceForm({ ...absenceForm, user_type: 'student' });
                      setShowAddAbsenceModal(true);
                    }}
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
                      <option key={g.id} value={g.id}>{g.name}</option>
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
                      {studentsAttendance.map((student) => (
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
                    onClick={() => {
                      setAbsenceForm({ ...absenceForm, user_type: 'professor' });
                      setShowAddAbsenceModal(true);
                    }}
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
                    value={filters.group}
                    onChange={(e) => setFilters({ ...filters, group: e.target.value })}
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
      {/* Add Absence Modal */}
{showAddAbsenceModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
      
      {/* HEADER */}
      <div className="p-5 border-b flex items-center justify-between bg-[#0D529C] rounded-t-2xl">
        <h2 className="text-xl font-bold text-white">Marquer une Absence</h2>
        <button
          onClick={() => {
            setShowAddAbsenceModal(false);
            resetAbsenceForm();
          }}
          className="p-2 hover:bg-white/20 rounded-lg"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleAddAbsence} className="p-6 space-y-6">

        {/* GRID PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* TYPE */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
            <select
              value={absenceForm.user_type}
              onChange={(e) =>
                setAbsenceForm({ ...absenceForm, user_type: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="student">Étudiant</option>
              <option value="professor">Professeur</option>
            </select>
          </div>

          {/* ÉTUDIANT */}
          {absenceForm.user_type === "student" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Groupe *</label>
                <select
                  required
                  value={absenceForm.group_id}
                  onChange={(e) =>
                    setAbsenceForm({
                      ...absenceForm,
                      group_id: parseInt(e.target.value),
                      attendable_id: 0,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value={0}>Sélectionner un groupe...</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Étudiant *
                </label>
                <select
                  required
                  value={absenceForm.attendable_id}
                  onChange={(e) =>
                    setAbsenceForm({
                      ...absenceForm,
                      attendable_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={!absenceForm.group_id}
                >
                  <option value={0}>Sélectionner...</option>
                  {groupStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* PROFESSEUR */}
          {absenceForm.user_type === "professor" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Département *
                </label>
                <select
                  required
                  value={absenceForm.department}
                  onChange={(e) =>
                    setAbsenceForm({
                      ...absenceForm,
                      department: e.target.value,
                      attendable_id: 0,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Sélectionner...</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Professeur *
                </label>
                <select
                  required
                  value={absenceForm.attendable_id}
                  onChange={(e) =>
                    setAbsenceForm({
                      ...absenceForm,
                      attendable_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={!absenceForm.department}
                >
                  <option value={0}>Sélectionner...</option>
                  {departmentProfessors.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* COURS */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cours *</label>
            <select
              required
              value={absenceForm.course_name}
              onChange={(e) =>
                setAbsenceForm({ ...absenceForm, course_name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Sélectionner...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE + HEURES */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Horaire *</label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="date"
                required
                value={absenceForm.date}
                onChange={(e) => setAbsenceForm({ ...absenceForm, date: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="time"
                required
                value={absenceForm.start_time}
                onChange={(e) =>
                  setAbsenceForm({ ...absenceForm, start_time: e.target.value })
                }
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="time"
                required
                value={absenceForm.end_time}
                onChange={(e) =>
                  setAbsenceForm({ ...absenceForm, end_time: e.target.value })
                }
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* TYPE ABSENCE */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type d'absence *
            </label>
            <select
              value={absenceForm.type}
              onChange={(e) =>
                setAbsenceForm({
                  ...absenceForm,
                  type: e.target.value as "absent" | "retard",
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="absent">Absent</option>
              <option value="retard">Retard</option>
            </select>
          </div>

          {/* COMMENTAIRE */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Commentaire</label>
            <textarea
              rows={3}
              value={absenceForm.comment}
              onChange={(e) =>
                setAbsenceForm({ ...absenceForm, comment: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg resize-none"
              placeholder="Ajouter un commentaire..."
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              setShowAddAbsenceModal(false);
              resetAbsenceForm();
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700"
          >
            <UserX className="w-4 h-4" />
            Marquer Absent
          </button>
        </div>
      </form>
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
                <button onClick={() => { setShowJustifyModal(false); setAbsenceToJustify(null); resetJustificationForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleJustifyAbsence} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date(absenceToJustify.date).toLocaleDateString('fr-FR')}</span></p>
                <p className="text-sm text-gray-600">Cours: <span className="font-medium">{absenceToJustify.course}</span></p>
                <p className="text-sm text-gray-600">Horaire: <span className="font-medium">{absenceToJustify.start_time} - {absenceToJustify.end_time}</span></p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Motif de justification *</label>
                <textarea
                  required
                  value={justificationForm.justification}
                  onChange={(e) => setJustificationForm({ ...justificationForm, justification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Ex: Certificat médical, convocation administrative..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Pièce justificative (optionnel)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setJustificationForm({ ...justificationForm, file: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowJustifyModal(false); setAbsenceToJustify(null); resetJustificationForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Valider Justification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}