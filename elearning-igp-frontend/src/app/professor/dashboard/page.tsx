// src/app/professor/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, ClipboardList, Video, Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, PlayCircle, Loader2 } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';
import { professorDashboardApi, DashboardData } from '@/lib/api/professor/dashboard';
import Swal from 'sweetalert2';

export default function ProfessorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'professor') {
        router.replace('/login');
        return;
      }
    } catch (e) {
      router.replace('/login');
      return;
    }

    fetchDashboard();
  }, [router]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await professorDashboardApi.getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement du dashboard',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
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
      <ProfessorLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D529C]" />
        </div>
      </ProfessorLayout>
    );
  }

  if (!data) return null;

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Bonjour, Professeur! 👋</h1>
          <p className="text-gray-500">Voici un aperçu de votre activité aujourd'hui.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Mes Cours</p>
                <p className="text-xl font-bold text-[#0D529C]">{data.stats.total_courses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Étudiants</p>
                <p className="text-xl font-bold text-[#257035]">{data.stats.total_students}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Notes en attente</p>
                <p className="text-xl font-bold text-orange-500">{data.stats.pending_grades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sessions à venir</p>
                <p className="text-xl font-bold text-purple-500">{data.stats.upcoming_sessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Heures ce mois</p>
                <p className="text-xl font-bold text-[#C1272D]">{data.stats.hours_this_month}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Présence moy.</p>
                <p className="text-xl font-bold text-teal-500">{data.stats.average_attendance}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#0D529C]">Emploi du temps aujourd'hui</h3>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              {data.today_schedule.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Pas de cours prévu aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.today_schedule.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-[#0D529C]">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-bold text-[#0D529C]">{schedule.time.split(' - ')[0]}</p>
                          <p className="text-xs text-gray-500">{schedule.time.split(' - ')[1]}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{schedule.course}</p>
                          <p className="text-sm text-gray-500">{schedule.group} • {schedule.room}</p>
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
                <h3 className="text-lg font-bold text-[#0D529C]">Mes Cours</h3>
                <button onClick={() => router.push('/professor/courses')} className="text-sm text-[#0D529C] hover:underline">Voir tout</button>
              </div>
              <div className="space-y-4">
                {data.my_courses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.code} • {course.students} étudiants</p>
                      </div>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#0D529C] to-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Prochain cours: {new Date(course.next_class).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#0D529C]">Sessions Live à venir</h3>
                <button onClick={() => router.push('/professor/sessions')} className="text-sm text-[#0D529C] hover:underline">Planifier</button>
              </div>
              <div className="space-y-3">
                {data.upcoming_sessions.map((session) => (
                  <div key={session.id} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">{session.course}</p>
                      <span className="text-xs text-purple-600 font-medium">
                        {new Date(session.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{session.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{session.students_registered} inscrits</span>
                      <button className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white rounded-lg text-xs hover:bg-purple-600 transition-colors">
                        <PlayCircle className="w-3 h-3" />
                        Démarrer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#0D529C]">Tâches en attente</h3>
                <span className="w-6 h-6 bg-[#C1272D] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {data.pending_tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {data.pending_tasks.map((task) => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-gray-500">
                        Deadline: {new Date(task.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0D529C] mb-4">Activité récente</h3>
              <div className="space-y-4">
                {data.recent_activity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-[#257035]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.course} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProfessorLayout>
  );
}