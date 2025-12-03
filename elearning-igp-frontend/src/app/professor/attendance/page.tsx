'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';
import { professorAttendanceApi } from '@/lib/api/professor/attendance';
import Swal from 'sweetalert2';

export default function AttendancePage() {
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);
  const [myAttendance, setMyAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_hours: 0, sessions_count: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ✅ Utiliser l'API client Laravel
      const [schedRes, attRes] = await Promise.all([
        professorAttendanceApi.getWeekSchedule(0),
        professorAttendanceApi.myAttendance(),
      ]);

      console.log('📅 Schedules reçus:', schedRes.data.data);

      setTodaySchedules(schedRes.data.data || []);
      setMyAttendance(attRes.data.data || []);
      setStats({ 
        total_hours: attRes.data.total_hours || 0,
        sessions_count: attRes.data.data?.length || 0 
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les données',
      });
    }
  };

const handleClockIn = async (scheduleId: number | string, isLiveSession: boolean = false) => {
  try {
    let payload: { schedule_id?: number; session_id?: number };

    if (isLiveSession) {
      // ✅ Extraire le vrai ID de 'live_123' → 123
      const realSessionId = typeof scheduleId === 'string' 
        ? parseInt(scheduleId.replace('live_', '')) 
        : scheduleId;
      
      payload = { session_id: realSessionId };
    } else {
      payload = { schedule_id: scheduleId as number };
    }

    await professorAttendanceApi.clockIn(payload);

    Swal.fire({
      icon: 'success',
      title: 'Pointage enregistré',
      timer: 2000,
      showConfirmButton: false,
    });
    
    fetchData();
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.response?.data?.message || 'Impossible de pointer',
    });
  }
};
  const handleClockOut = async (logId: number) => {
    try {
      await professorAttendanceApi.clockOut(logId);

      Swal.fire({
        icon: 'success',
        title: 'Sortie enregistrée',
        timer: 2000,
        showConfirmButton: false,
      });
      
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de pointer la sortie',
      });
    }
  };

  const dayMapping: { [key: string]: number } = {
    'Dimanche': 0,
    'Lundi': 1,
    'Mardi': 2,
    'Mercredi': 3,
    'Jeudi': 4,
    'Vendredi': 5,
    'Samedi': 6,
  };

  const daysOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const todayDayOfWeek = new Date().getDay();

  return (
    <ProfessorLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-[#0D529C] mb-8">Pointage</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D529C]">{stats.total_hours}h</p>
                <p className="text-sm text-gray-500">Heures ce mois</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#257035]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#257035]">{stats.sessions_count}</p>
                <p className="text-sm text-gray-500">Sessions pointées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cours cette semaine */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mes cours cette semaine</h2>
          {todaySchedules.length === 0 ? (
            <p className="text-gray-500">Aucun cours cette semaine</p>
          ) : (
            <div className="space-y-6">
              {daysOrder.map((dayName) => {
                const dayCourses = todaySchedules.filter(s => s.day === dayName);
                
                if (dayCourses.length === 0) return null;
                
                const isToday = dayMapping[dayName] === todayDayOfWeek;
                
                return (
                  <div key={dayName}>
                    <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isToday ? 'text-[#0D529C]' : 'text-gray-600'}`}>
                      {isToday && <span className="w-2 h-2 bg-[#0D529C] rounded-full"></span>}
                      {dayName}
                      {isToday && <span className="text-sm font-normal">(Aujourd'hui)</span>}
                    </h3>
                    <div className="space-y-3">
                      {dayCourses.map((schedule) => {
  const isLiveSession = schedule.type === 'session_live';
  const alreadyClocked = myAttendance.some(
    log => (isLiveSession 
      ? (log.course_id === schedule.course_id && log.type === 'session_live' && log.date === new Date().toISOString().split('T')[0])
      : (log.schedule_id === schedule.id && log.date === new Date().toISOString().split('T')[0])
    )
  );
  
  const canClock = isToday;

  return (
    <div key={schedule.id} className={`flex items-center justify-between p-4 rounded-lg ${
      isToday ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
    }`}>
      <div>
        <p className="font-semibold text-gray-900">
          {schedule.course}
          {isLiveSession && <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded">En ligne</span>}
        </p>
        <p className="text-sm text-gray-500">
          {schedule.start_time} - {schedule.end_time} • {schedule.room}
        </p>
      </div>
      
      {alreadyClocked ? (
        <span className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
          ✓ Pointé
        </span>
      ) : canClock ? (
        <button
          onClick={() => handleClockIn(schedule.id, isLiveSession)}
          className="px-6 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700"
        >
          Pointer Arrivée
        </button>
      ) : (
        <span className="px-6 py-2 bg-gray-200 text-gray-500 rounded-lg">
          Pas encore disponible
        </span>
      )}
    </div>
  );
})}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Historique */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Historique du mois</h2>
          {myAttendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun pointage ce mois-ci</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Arrivée</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Départ</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Heures</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myAttendance.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{log.date}</td>
                      <td className="py-3 px-4 text-sm">{log.course?.name || '-'}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="font-semibold">{log.clock_in}</span>
                        {log.validated && <span className="ml-2 text-xs text-green-600">🔒</span>}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="font-semibold">{log.clock_out || '-'}</span>
                        {log.validated && log.clock_out && <span className="ml-2 text-xs text-green-600">🔒</span>}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">{log.hours_worked || 0}h</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          log.validated ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {log.validated ? '✓ Validé' : '⏳ En attente'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!log.clock_out && !log.validated ? (
                          <button
                            onClick={() => handleClockOut(log.id)}
                            className="px-4 py-1 bg-[#C1272D] text-white rounded text-sm hover:bg-red-700"
                          >
                            Pointer Sortie
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            {log.validated ? '🔒 Verrouillé' : '✓ Terminé'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProfessorLayout>
  );
}