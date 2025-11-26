'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ClipboardList, Video, Calendar, Clock, TrendingUp, Award, FileText, CheckCircle, AlertTriangle, PlayCircle } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { studentDashboardApi, DashboardData } from '@/lib/api/student/dashboard';
import Swal from 'sweetalert2';

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await studentDashboardApi.getStats();
      setDashboardData(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger le dashboard',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return 'text-[#257035] bg-green-50';
    if (grade >= 14) return 'text-[#0D529C] bg-blue-50';
    if (grade >= 10) return 'text-orange-600 bg-orange-50';
    return 'text-[#C1272D] bg-red-50';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#C1272D] text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-[#257035] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Urgent';
      case 'medium': return 'Moyen';
      case 'low': return 'Faible';
      default: return priority;
    }
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

  if (!dashboardData) return null;

  const { stats, today_schedule, upcoming_sessions, recent_grades, my_courses, recent_resources, pending_tasks } = dashboardData;

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Bonjour! 👋</h1>
          <p className="text-gray-500">Voici un aperçu de votre parcours académique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Mes Cours</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_courses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Moyenne</p>
                <p className="text-xl font-bold text-[#257035]">{stats.average_grade}/20</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Présence</p>
                <p className="text-xl font-bold text-purple-500">{stats.attendance_rate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sessions à venir</p>
                <p className="text-xl font-bold text-orange-500">{stats.upcoming_sessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Travaux en attente</p>
                <p className="text-xl font-bold text-[#C1272D]">{stats.pending_assignments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cours terminés</p>
                <p className="text-xl font-bold text-teal-500">{stats.completed_courses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#257035]">Emploi du temps aujourd'hui</h3>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              {today_schedule.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Pas de cours prévu aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {today_schedule.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-[#257035]">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-bold text-[#257035]">{schedule.time.split(' - ')[0]}</p>
                          <p className="text-xs text-gray-500">{schedule.time.split(' - ')[1]}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{schedule.course}</p>
                          <p className="text-sm text-gray-500">{schedule.professor} • {schedule.room}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        schedule.type === 'Cours' ? 'bg-[#0D529C] text-white' : 'bg-purple-500 text-white'
                      }`}>
                        {schedule.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#257035]">Mes Cours</h3>
                <button className="text-sm text-[#257035] hover:underline">Voir tout</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {my_courses.slice(0, 4).map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.professor}</p>
                      </div>
                      <span className="text-sm font-bold text-[#257035]">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-[#257035] to-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Prochain cours: {new Date(course.next_class).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#257035]">Notes Récentes</h3>
                <button className="text-sm text-[#257035] hover:underline">Voir toutes</button>
              </div>
              <div className="space-y-3">
                {recent_grades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{grade.course}</p>
                      <p className="text-xs text-gray-500">{grade.exam} • {new Date(grade.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded ${getGradeColor(grade.grade)}`}>
                      {grade.grade}/{grade.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#257035]">Sessions Live à venir</h3>
              </div>
              <div className="space-y-3">
                {upcoming_sessions.map((session) => (
                  <div key={session.id} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">{session.course}</p>
                      <span className="text-xs text-orange-600 font-medium">
                        {new Date(session.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{session.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{session.time}</span>
                      <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition-colors">
                        <PlayCircle className="w-3 h-3" />
                        Rejoindre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#257035]">Travaux en attente</h3>
                <span className="w-6 h-6 bg-[#C1272D] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pending_tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {pending_tasks.map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{task.course}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600 font-medium">
                        Deadline: {new Date(task.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#257035]">Ressources Récentes</h3>
                <button className="text-sm text-[#257035] hover:underline">Voir tout</button>
              </div>
              <div className="space-y-3">
                {recent_resources.map((resource) => (
                  <div key={resource.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#0D529C]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                      <p className="text-xs text-gray-500">{resource.course}</p>
                    </div>
                    <span className="text-xs text-gray-400">{resource.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}