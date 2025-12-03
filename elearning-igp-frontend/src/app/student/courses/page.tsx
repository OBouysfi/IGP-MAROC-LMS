'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, User, Clock, Calendar, FileText, Video, ChevronRight, Search, Star, PlayCircle } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { studentCoursesApi, StudentCourse } from '@/lib/api/student/courses';
import Swal from 'sweetalert2';

interface CourseModule {
  id: number;
  title: string;
  completed: boolean;
  duration: string;
}

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await studentCoursesApi.getAll();
      setCourses(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les cours',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const courseModules: CourseModule[] = [
    { id: 1, title: 'Introduction à React', completed: true, duration: '3h' },
    { id: 2, title: 'JSX et Components', completed: true, duration: '4h' },
    { id: 3, title: 'Props et State', completed: true, duration: '5h' },
    { id: 4, title: 'Lifecycle et useEffect', completed: true, duration: '4h' },
    { id: 5, title: 'Hooks personnalisés', completed: true, duration: '6h' },
    { id: 6, title: 'Context API', completed: true, duration: '5h' },
    { id: 7, title: 'Redux et State Management', completed: false, duration: '8h' },
    { id: 8, title: 'Performance et Optimisation', completed: false, duration: '6h' },
    { id: 9, title: 'Testing React', completed: false, duration: '4h' },
  ];

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.professor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCourseDetail = (course: StudentCourse) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-400';
    if (grade >= 16) return 'text-[#257035]';
    if (grade >= 14) return 'text-[#0D529C]';
    if (grade >= 10) return 'text-orange-600';
    return 'text-[#C1272D]';
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
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Mes Cours</h1>
          <p className="text-gray-500">Consultez vos cours, votre progression et vos ressources pédagogiques.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Cours</p>
                <p className="text-xl font-bold text-[#0D529C]">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Heures complétées</p>
                <p className="text-xl font-bold text-[#257035]">
                  {courses.reduce((sum, c) => sum + c.completed_hours, 0)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Crédits ECTS</p>
                <p className="text-xl font-bold text-purple-500">
                  {courses.reduce((sum, c) => sum + c.credits, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Ressources</p>
                <p className="text-xl font-bold text-orange-500">
                  {courses.reduce((sum, c) => sum + c.resources_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un cours, professeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-r ${course.color} p-4 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs opacity-90">{course.code}</p>
                    <h3 className="font-bold text-lg">{course.name}</h3>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-white/20">
                    {course.credits} ECTS
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{course.professor}</p>
                    <p className="text-xs text-gray-500">{course.professor_email}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression</span>
                    <span className="text-sm font-bold text-[#257035]">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#257035] to-green-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.completed_hours}h / {course.total_hours}h
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className={`text-lg font-bold ${getGradeColor(course.grade_average)}`}>
                      {course.grade_average !== null ? course.grade_average : '--'}
                    </p>
                    <p className="text-xs text-gray-500">Moyenne</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-[#0D529C]">{course.resources_count}</p>
                    <p className="text-xs text-gray-500">Ressources</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-orange-500">{course.sessions_count}</p>
                    <p className="text-xs text-gray-500">Sessions</p>
                  </div>
                </div>

                {course.next_class && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-[#257035]" />
                      <span className="text-xs font-medium text-[#257035]">Prochain cours</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {new Date(course.next_class).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(course.next_class).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {course.next_class_room}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => openCourseDetail(course)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accéder au cours
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun cours trouvé</p>
          </div>
        )}
      </div>

      {showCourseDetail && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${selectedCourse.color} p-6 text-white rounded-t-2xl`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">{selectedCourse.code}</p>
                  <h2 className="text-2xl font-bold mb-2">{selectedCourse.name}</h2>
                  <p className="text-sm opacity-90">{selectedCourse.professor}</p>
                </div>
                <button
                  onClick={() => setShowCourseDetail(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6 rotate-45" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedCourse.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-medium text-[#257035] mb-2">Progression</h4>
                  <div className="text-3xl font-bold text-[#257035] mb-2">{selectedCourse.progress}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#257035] h-3 rounded-full"
                      style={{ width: `${selectedCourse.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedCourse.completed_hours}h / {selectedCourse.total_hours}h
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-[#0D529C] mb-2">Moyenne actuelle</h4>
                  <div className={`text-3xl font-bold ${getGradeColor(selectedCourse.grade_average)}`}>
                    {selectedCourse.grade_average !== null ? `${selectedCourse.grade_average}/20` : ' - '}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Basée sur les évaluations</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Crédits</h4>
                  <div className="text-3xl font-bold text-purple-600">{selectedCourse.credits} ECTS</div>
                  <p className="text-sm text-gray-600 mt-2">Semestre {selectedCourse.semester}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Modules du cours</h3>
                <div className="space-y-2">
                  {courseModules.map((module) => (
                    <div
                      key={module.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        module.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          module.completed ? 'bg-[#257035] text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {module.completed ? '✓' : module.id}
                        </div>
                        <span className={`font-medium ${module.completed ? 'text-[#257035]' : 'text-gray-700'}`}>
                          {module.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{module.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FileText className="w-5 h-5" />
                  Ressources ({selectedCourse.resources_count})
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Video className="w-5 h-5" />
                  Sessions Live ({selectedCourse.sessions_count})
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors">
                  <PlayCircle className="w-5 h-5" />
                  Continuer le cours
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}