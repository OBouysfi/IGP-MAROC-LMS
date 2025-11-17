// src/app/professor/grades/page.tsx
'use client';

import React, { useState } from 'react';
import { ClipboardList, Search, Save, CheckCircle, AlertTriangle, X, Users, BookOpen, Calendar, Filter } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';

interface StudentGrade {
  id: number;
  student_name: string;
  student_email: string;
  grade: number | null;
  comment: string;
  status: 'saved' | 'pending' | 'empty';
}

interface Exam {
  id: number;
  course: string;
  course_code: string;
  group: string;
  type: 'partiel' | 'final' | 'controle' | 'tp' | 'projet';
  date: string;
  max_grade: number;
  coefficient: number;
  deadline: string;
  status: 'en_attente' | 'en_cours' | 'terminé' | 'validé';
  total_students: number;
  graded_students: number;
  students: StudentGrade[];
}

export default function ProfessorGradesPage() {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [grades, setGrades] = useState<{ [key: number]: { grade: number | null; comment: string } }>({});
  const [hasChanges, setHasChanges] = useState(false);

  const myCourses = [
    'React.js Avancé',
    'Node.js & Express',
    'Introduction au Web',
    'JavaScript Moderne',
    'Base de données NoSQL',
  ];

  const exams: Exam[] = [
    {
      id: 1,
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      group: 'DEV-M2-A',
      type: 'partiel',
      date: '2024-11-10',
      max_grade: 20,
      coefficient: 2,
      deadline: '2024-11-20',
      status: 'en_cours',
      total_students: 25,
      graded_students: 18,
      students: [
        { id: 1, student_name: 'Ahmed Benali', student_email: 'ahmed.benali@student.igp.edu', grade: 17.5, comment: 'Excellent travail', status: 'saved' },
        { id: 2, student_name: 'Youssef Mansouri', student_email: 'youssef.mansouri@student.igp.edu', grade: 15.0, comment: '', status: 'saved' },
        { id: 3, student_name: 'Khadija Amrani', student_email: 'khadija.amrani@student.igp.edu', grade: 19.0, comment: 'Travail exceptionnel', status: 'saved' },
        { id: 4, student_name: 'Rachid Tazi', student_email: 'rachid.tazi@student.igp.edu', grade: null, comment: '', status: 'empty' },
        { id: 5, student_name: 'Salma Idrissi', student_email: 'salma.idrissi@student.igp.edu', grade: 15.5, comment: '', status: 'saved' },
        { id: 6, student_name: 'Mohamed Alaoui', student_email: 'mohamed.alaoui@student.igp.edu', grade: null, comment: '', status: 'empty' },
        { id: 7, student_name: 'Fatima Zahra', student_email: 'fatima.zahra@student.igp.edu', grade: 14.0, comment: '', status: 'saved' },
      ],
    },
    {
      id: 2,
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      group: 'DEV-M2-A',
      type: 'tp',
      date: '2024-11-08',
      max_grade: 20,
      coefficient: 1,
      deadline: '2024-11-18',
      status: 'en_attente',
      total_students: 28,
      graded_students: 0,
      students: [
        { id: 8, student_name: 'Ahmed Benali', student_email: 'ahmed.benali@student.igp.edu', grade: null, comment: '', status: 'empty' },
        { id: 9, student_name: 'Youssef Mansouri', student_email: 'youssef.mansouri@student.igp.edu', grade: null, comment: '', status: 'empty' },
        { id: 10, student_name: 'Khadija Amrani', student_email: 'khadija.amrani@student.igp.edu', grade: null, comment: '', status: 'empty' },
      ],
    },
    {
      id: 3,
      course: 'Introduction au Web',
      course_code: 'DEV-WEB',
      group: 'DEV-L1-A',
      type: 'controle',
      date: '2024-11-12',
      max_grade: 20,
      coefficient: 1,
      deadline: '2024-11-22',
      status: 'terminé',
      total_students: 35,
      graded_students: 35,
      students: [],
    },
    {
      id: 4,
      course: 'JavaScript Moderne',
      course_code: 'DEV-JS',
      group: 'DEV-L2-A',
      type: 'projet',
      date: '2024-11-15',
      max_grade: 20,
      coefficient: 3,
      deadline: '2024-11-25',
      status: 'en_attente',
      total_students: 30,
      graded_students: 0,
      students: [],
    },
    {
      id: 5,
      course: 'Base de données NoSQL',
      course_code: 'DEV-NOSQL',
      group: 'DEV-M2-A',
      type: 'final',
      date: '2024-12-05',
      max_grade: 20,
      coefficient: 3,
      deadline: '2024-12-15',
      status: 'en_attente',
      total_students: 22,
      graded_students: 0,
      students: [],
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'partiel': return 'bg-[#0D529C] text-white';
      case 'final': return 'bg-[#C1272D] text-white';
      case 'controle': return 'bg-purple-500 text-white';
      case 'tp': return 'bg-orange-500 text-white';
      case 'projet': return 'bg-[#257035] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'partiel': return 'Partiel';
      case 'final': return 'Final';
      case 'controle': return 'Contrôle';
      case 'tp': return 'TP';
      case 'projet': return 'Projet';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-orange-500 text-white';
      case 'en_cours': return 'bg-[#0D529C] text-white';
      case 'terminé': return 'bg-[#257035] text-white';
      case 'validé': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'terminé': return 'Terminé';
      case 'validé': return 'Validé';
      default: return status;
    }
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'bg-gray-100 text-gray-400';
    if (grade >= 16) return 'bg-green-50 text-[#257035]';
    if (grade >= 14) return 'bg-blue-50 text-[#0D529C]';
    if (grade >= 10) return 'bg-orange-50 text-orange-600';
    return 'bg-red-50 text-[#C1272D]';
  };

  const openGradingModal = (exam: Exam) => {
    setSelectedExam(exam);
    const initialGrades: { [key: number]: { grade: number | null; comment: string } } = {};
    exam.students.forEach(student => {
      initialGrades[student.id] = { grade: student.grade, comment: student.comment };
    });
    setGrades(initialGrades);
    setHasChanges(false);
    setShowGradingModal(true);
  };

  const updateGrade = (studentId: number, field: 'grade' | 'comment', value: number | string | null) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const saveGrades = () => {
    setHasChanges(false);
    alert('Notes enregistrées avec succès!');
  };

  const submitGrades = () => {
    setShowGradingModal(false);
    alert('Notes soumises pour validation!');
  };

  const filteredExams = exams.filter(exam => {
    if (filterCourse && exam.course !== filterCourse) return false;
    if (filterStatus && exam.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total_exams: exams.length,
    pending: exams.filter(e => e.status === 'en_attente').length,
    in_progress: exams.filter(e => e.status === 'en_cours').length,
    completed: exams.filter(e => e.status === 'terminé' || e.status === 'validé').length,
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Saisie des Notes</h1>
          <p className="text-gray-500">Gérez et saisissez les notes de vos examens et évaluations.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Examens</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_exams}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En Attente</p>
                <p className="text-xl font-bold text-orange-500">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En Cours</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.in_progress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Terminés</p>
                <p className="text-xl font-bold text-[#257035]">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
            >
              <option value="">Tous les cours</option>
              {myCourses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="terminé">Terminé</option>
              <option value="validé">Validé</option>
            </select>
          </div>
        </div>

        {/* Exams List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const daysRemaining = getDaysRemaining(exam.deadline);
            const progressPercent = exam.total_students > 0 ? (exam.graded_students / exam.total_students) * 100 : 0;

            return (
              <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-[#0D529C] to-blue-600 p-4 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{exam.course}</h3>
                      <p className="text-blue-200 text-sm">{exam.course_code}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTypeColor(exam.type)}`}>
                      {getTypeLabel(exam.type)}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Groupe:</span>
                      <span className="font-medium">{exam.group}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(exam.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Coefficient:</span>
                      <span className="font-medium">{exam.coefficient}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progression</span>
                      <span className="text-sm font-bold">{exam.graded_students}/{exam.total_students}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          progressPercent === 100 ? 'bg-[#257035]' :
                          progressPercent > 0 ? 'bg-[#0D529C]' :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    daysRemaining <= 3 ? 'bg-red-50' :
                    daysRemaining <= 7 ? 'bg-orange-50' :
                    'bg-gray-50'
                  }`}>
                    <Calendar className={`w-4 h-4 ${
                      daysRemaining <= 3 ? 'text-[#C1272D]' :
                      daysRemaining <= 7 ? 'text-orange-500' :
                      'text-gray-500'
                    }`} />
                    <div>
                      <p className="text-xs text-gray-500">Deadline</p>
                      <p className={`text-sm font-medium ${
                        daysRemaining <= 3 ? 'text-[#C1272D]' :
                        daysRemaining <= 7 ? 'text-orange-500' :
                        'text-gray-700'
                      }`}>
                        {new Date(exam.deadline).toLocaleDateString('fr-FR')}
                        {daysRemaining > 0 && ` (${daysRemaining}j restants)`}
                        {daysRemaining <= 0 && ' (Dépassé!)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                      {getStatusLabel(exam.status)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => openGradingModal(exam)}
                    disabled={exam.status === 'validé'}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      exam.status === 'validé'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0D529C] text-white hover:bg-blue-700'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    {exam.status === 'validé' ? 'Notes Validées' : 'Saisir les Notes'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredExams.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun examen trouvé</p>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {showGradingModal && selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedExam.course}</h2>
                <p className="text-blue-200">
                  {getTypeLabel(selectedExam.type)} • {selectedExam.group} • {new Date(selectedExam.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {hasChanges && (
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white">
                    Modifications non sauvegardées
                  </span>
                )}
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Étudiant</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Note /{selectedExam.max_grade}</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Commentaire</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExam.students
                    .filter(student => 
                      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.student_email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((student) => (
                      <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0D529C] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {student.student_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{student.student_name}</p>
                              <p className="text-xs text-gray-500">{student.student_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <input
                              type="number"
                              min="0"
                              max={selectedExam.max_grade}
                              step="0.5"
                              value={grades[student.id]?.grade ?? ''}
                              onChange={(e) => updateGrade(student.id, 'grade', e.target.value ? parseFloat(e.target.value) : null)}
                              className={`w-24 px-3 py-2 text-center font-bold border rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent ${getGradeColor(grades[student.id]?.grade ?? null)}`}
                              placeholder="--"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={grades[student.id]?.comment ?? ''}
                            onChange={(e) => updateGrade(student.id, 'comment', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent text-sm"
                            placeholder="Ajouter un commentaire..."
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          {grades[student.id]?.grade !== null && grades[student.id]?.grade !== undefined ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-[#257035] text-white">
                              <CheckCircle className="w-3 h-3" />
                              Saisi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-300 text-gray-600">
                              En attente
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {Object.values(grades).filter(g => g.grade !== null && g.grade !== undefined).length} / {selectedExam.students.length} notes saisies
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={saveGrades}
                  disabled={!hasChanges}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    hasChanges
                      ? 'bg-[#0D529C] text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
                <button
                  onClick={submitGrades}
                  disabled={Object.values(grades).filter(g => g.grade !== null && g.grade !== undefined).length !== selectedExam.students.length}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    Object.values(grades).filter(g => g.grade !== null && g.grade !== undefined).length === selectedExam.students.length
                      ? 'bg-[#257035] text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Soumettre pour Validation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProfessorLayout>
  );
}