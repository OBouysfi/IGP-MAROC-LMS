'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, TrendingUp, Award, Calendar, ChevronDown, ChevronUp, Download, BarChart3 } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { studentGradesApi, StudentGrade, CourseAverage } from '@/lib/api/student/grades';
import Swal from 'sweetalert2';

export default function StudentGradesPage() {
  const [filterCourse, setFilterCourse] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'grade' | 'course'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCourseAverages, setShowCourseAverages] = useState(true);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [courseAverages, setCourseAverages] = useState<CourseAverage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gradesData, summaryData] = await Promise.all([
        studentGradesApi.getAll(),
        studentGradesApi.getSummary(),
      ]);
      setGrades(gradesData);
      setCourseAverages(summaryData);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les notes',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const uniqueCourses = [...new Set(grades.map(g => g.course))];
  const examTypes = ['partiel', 'final', 'controle', 'tp', 'projet', 'quiz'];

  const calculateGeneralAverage = () => {
    if (courseAverages.length === 0) return '0.00';
    const totalWeighted = courseAverages.reduce((sum, ca) => sum + (ca.average * ca.coefficient), 0);
    const totalCoeff = courseAverages.reduce((sum, ca) => sum + ca.coefficient, 0);
    return totalCoeff > 0 ? (totalWeighted / totalCoeff).toFixed(2) : '0.00';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'partiel': return 'bg-[#0D529C] text-white';
      case 'final': return 'bg-[#C1272D] text-white';
      case 'controle': return 'bg-purple-500 text-white';
      case 'tp': return 'bg-[#257035] text-white';
      case 'projet': return 'bg-orange-500 text-white';
      case 'quiz': return 'bg-pink-500 text-white';
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
      case 'quiz': return 'Quiz';
      default: return type;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-[#257035] bg-green-50';
    if (grade >= 14) return 'text-[#0D529C] bg-blue-50';
    if (grade >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-[#C1272D] bg-red-50';
  };

  const getGradeBgColor = (grade: number) => {
    if (grade >= 16) return 'bg-green-500';
    if (grade >= 14) return 'bg-blue-500';
    if (grade >= 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const filteredGrades = grades
    .filter(grade => {
      if (filterCourse && grade.course !== filterCourse) return false;
      if (filterType && grade.exam_type !== filterType) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'grade') {
        comparison = a.grade - b.grade;
      } else if (sortBy === 'course') {
        comparison = a.course.localeCompare(b.course);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const stats = {
    total_grades: grades.length,
    general_average: calculateGeneralAverage(),
    highest_grade: grades.length > 0 ? Math.max(...grades.map(g => g.grade)) : 0,
    lowest_grade: grades.length > 0 ? Math.min(...grades.map(g => g.grade)) : 0,
    above_average: grades.filter(g => g.grade >= 10).length,
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#257035]"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Mes Notes</h1>
          <p className="text-gray-500">Consultez vos résultats et suivez votre progression académique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Notes</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_grades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Moyenne Générale</p>
                <p className="text-xl font-bold text-[#257035]">{stats.general_average}/20</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Meilleure Note</p>
                <p className="text-xl font-bold text-purple-500">{stats.highest_grade}/20</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Note Minimale</p>
                <p className="text-xl font-bold text-orange-500">{stats.lowest_grade}/20</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Validées</p>
                <p className="text-xl font-bold text-teal-500">{stats.above_average}/{stats.total_grades}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div
            className="p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer"
            onClick={() => setShowCourseAverages(!showCourseAverages)}
          >
            <h3 className="text-lg font-bold text-[#257035]">Moyennes par Matière</h3>
            {showCourseAverages ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {showCourseAverages && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseAverages.map((ca) => (
                  <div key={ca.course_code} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{ca.course}</p>
                        <p className="text-xs text-gray-500">{ca.course_code} • Coef. {ca.coefficient}</p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-lg font-bold rounded ${getGradeColor(ca.average)}`}>
                        {ca.average.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getGradeBgColor(ca.average)}`}
                        style={{ width: `${(ca.average / 20) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{ca.grades_count} note(s) enregistrée(s)</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
              >
                <option value="">Toutes les matières</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
              >
                <option value="">Tous les types</option>
                {examTypes.map((type) => (
                  <option key={type} value={type}>{getTypeLabel(type)}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
              >
                <option value="date">Trier par date</option>
                <option value="grade">Trier par note</option>
                <option value="course">Trier par matière</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                {sortOrder === 'desc' ? 'Décroissant' : 'Croissant'}
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Exporter PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Matière</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Évaluation</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Note</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Coef.</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{grade.course}</p>
                      <p className="text-xs text-gray-500">{grade.course_code}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-700">{grade.exam_name}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(grade.exam_type)}`}>
                      {getTypeLabel(grade.exam_type)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${getGradeColor(grade.grade)}`}>
                      {grade.grade}/{grade.max_grade}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-medium text-gray-700">{grade.coefficient}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {grade.comment ? (
                      <p className="text-sm text-gray-600 italic">{grade.comment}</p>
                    ) : (
                      <span className="text-xs text-gray-400">Aucun commentaire</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGrades.length === 0 && (
            <div className="p-12 text-center">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune note trouvée</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}