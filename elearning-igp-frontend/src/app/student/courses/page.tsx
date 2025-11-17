// src/app/student/courses/page.tsx
'use client';

import React, { useState } from 'react';
import { BookOpen, User, Clock, Calendar, FileText, Video, ChevronRight, Search, Filter, Star, PlayCircle, Download } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';

interface Course {
  id: number;
  name: string;
  code: string;
  professor: string;
  professor_email: string;
  description: string;
  credits: number;
  semester: string;
  progress: number;
  total_hours: number;
  completed_hours: number;
  next_class: string;
  next_class_room: string;
  grade_average: number | null;
  resources_count: number;
  sessions_count: number;
  color: string;
}

interface CourseModule {
  id: number;
  title: string;
  completed: boolean;
  duration: string;
}

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);

  const courses: Course[] = [
    {
      id: 1,
      name: 'React.js Avancé',
      code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      description: 'Maîtrisez les concepts avancés de React.js incluant les hooks personnalisés, Context API, Redux, et les patterns de performance.',
      credits: 6,
      semester: 'S3',
      progress: 67,
      total_hours: 45,
      completed_hours: 30,
      next_class: '2024-11-18 09:00',
      next_class_room: 'Salle A12',
      grade_average: 16.5,
      resources_count: 12,
      sessions_count: 3,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      name: 'Node.js & Express',
      code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      description: 'Développement backend avec Node.js et Express. API REST, authentification JWT, bases de données et déploiement.',
      credits: 6,
      semester: 'S3',
      progress: 50,
      total_hours: 45,
      completed_hours: 22,
      next_class: '2024-11-19 14:00',
      next_class_room: 'Lab Info 1',
      grade_average: 15.0,
      resources_count: 8,
      sessions_count: 2,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 3,
      name: 'Base de données NoSQL',
      code: 'DEV-NOSQL',
      professor: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      description: 'Introduction aux bases de données NoSQL avec MongoDB. Modélisation, requêtes, agrégation et optimisation.',
      credits: 4,
      semester: 'S3',
      progress: 33,
      total_hours: 30,
      completed_hours: 10,
      next_class: '2024-11-21 09:00',
      next_class_room: 'Lab Info 2',
      grade_average: 18.0,
      resources_count: 6,
      sessions_count: 1,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 4,
      name: 'JavaScript Moderne',
      code: 'DEV-JS',
      professor: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      description: 'ES6+, programmation fonctionnelle, asynchrone, modules et outils modernes de développement JavaScript.',
      credits: 4,
      semester: 'S3',
      progress: 44,
      total_hours: 30,
      completed_hours: 13,
      next_class: '2024-11-20 14:00',
      next_class_room: 'Salle C5',
      grade_average: 14.0,
      resources_count: 10,
      sessions_count: 2,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 5,
      name: 'DevOps & CI/CD',
      code: 'DEV-OPS',
      professor: 'Hassan Alami',
      professor_email: 'h.alami@igp.edu',
      description: 'Introduction aux pratiques DevOps, intégration continue, déploiement continu, Docker et Kubernetes.',
      credits: 4,
      semester: 'S3',
      progress: 25,
      total_hours: 30,
      completed_hours: 8,
      next_class: '2024-11-22 10:00',
      next_class_room: 'Salle B3',
      grade_average: null,
      resources_count: 5,
      sessions_count: 0,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 6,
      name: 'Architecture Microservices',
      code: 'DEV-MICRO',
      professor: 'Omar Tazi',
      professor_email: 'o.tazi@igp.edu',
      description: 'Conception et implémentation d\'architectures microservices. Patterns, communication inter-services et scalabilité.',
      credits: 4,
      semester: 'S3',
      progress: 15,
      total_hours: 30,
      completed_hours: 5,
      next_class: '2024-11-23 08:00',
      next_class_room: 'Salle A8',
      grade_average: null,
      resources_count: 4,
      sessions_count: 1,
      color: 'from-red-500 to-red-600',
    },
  ];

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

  const openCourseDetail = (course: Course) => {
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

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Mes Cours</h1>
          <p className="text-gray-500">Consultez vos cours, votre progression et vos ressources pédagogiques.</p>
        </div>

        {/* Stats */}
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

        {/* Search */}
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
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

              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Professor */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{course.professor}</p>
                    <p className="text-xs text-gray-500">{course.professor_email}</p>
                  </div>
                </div>

                {/* Progress */}
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

                {/* Stats */}
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

                {/* Next Class */}
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
              </div>

              {/* Actions */}
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

      {/* Course Detail Modal */}
      {showCourseDetail && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
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
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedCourse.description}</p>
              </div>

              {/* Progress & Stats */}
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
                    {selectedCourse.grade_average !== null ? `${selectedCourse.grade_average}/20` : 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Basée sur les évaluations</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Crédits</h4>
                  <div className="text-3xl font-bold text-purple-600">{selectedCourse.credits} ECTS</div>
                  <p className="text-sm text-gray-600 mt-2">Semestre {selectedCourse.semester}</p>
                </div>
              </div>

              {/* Modules */}
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

              {/* Quick Actions */}
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