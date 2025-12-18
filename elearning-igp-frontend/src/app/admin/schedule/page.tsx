'use client';

import { useState, useEffect } from 'react';
import { schedulesApi, ScheduleSlot, ScheduleStats } from '@/lib/api/admin/schedules';
import { coursesApi } from '@/lib/api/admin/courses';
import { Calendar, Clock, Users, GraduationCap, MapPin, Download, ChevronLeft, ChevronRight, Plus, X, Trash2, Edit2 } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function SchedulePage() {
  const [viewType, setViewType] = useState<'group' | 'professor' | 'room'>('group');
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);
    
    const formatDate = (date: Date) => {
      return `${date.getDate()} ${date.toLocaleDateString('fr-FR', { month: 'short' })} ${date.getFullYear()}`;
    };
    
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  });  
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleSlot | null>(null);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00','19:00','20:00','21:00','22:00'];

  const [formData, setFormData] = useState({
    course_id: 0,
    group_id: 0,
    professor_id: 0,
    room: '',
    day: 'Lundi',
    start_time: '09:00',
    end_time: '12:00',
    type: 'cours' as 'cours' | 'td' | 'tp' | 'examen',
    is_recurring: true,
    notes: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading && (selectedGroup || selectedProfessor || selectedRoom)) {
      fetchSchedules();
    }
  }, [viewType, selectedGroup, selectedProfessor, selectedRoom, currentWeek]);

  const getWeekDates = () => {
    const [start] = currentWeek.split(' - ');
    const parts = start.split(' ');
    const day = parseInt(parts[0]);
    const months: any = { 'jan.': 0, 'févr.': 1, 'mars': 2, 'avr.': 3, 'mai': 4, 'juin': 5, 'juil.': 6, 'août': 7, 'sept.': 8, 'oct.': 9, 'nov.': 10, 'déc.': 11 };
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    
    const startDate = new Date(year, month, day);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5);
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  const fetchInitialData = async () => {
    try {
      const [groupsRes, professorsRes, roomsRes, coursesRes, statsRes] = await Promise.all([
        schedulesApi.getGroups(),
        schedulesApi.getProfessors(),
        schedulesApi.getRooms(),
        coursesApi.getAll(),
        schedulesApi.getStats()
      ]);
      
      setGroups(groupsRes.data.data);
      setProfessors(professorsRes.data.data);
      setRooms(roomsRes.data.data);
      setCourses(coursesRes.data.data);
      setStats(statsRes.data);
      
      let defaultGroup = null;
      let defaultProf = null;
      let defaultRoom = '';
      
      if (groupsRes.data.data.length > 0) {
        defaultGroup = groupsRes.data.data[0].id;
        setSelectedGroup(defaultGroup);
      }
      if (professorsRes.data.data.length > 0) {
        defaultProf = professorsRes.data.data[0].id;
        setSelectedProfessor(defaultProf);
      }
      if (roomsRes.data.data.length > 0) {
        defaultRoom = roomsRes.data.data[0];
        setSelectedRoom(defaultRoom);
      }
      
      await fetchSchedulesWithFilters(viewType, defaultGroup, defaultProf, defaultRoom);
      
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

  const fetchSchedulesWithFilters = async (
    view: 'group' | 'professor' | 'room',
    groupId: number | null,
    profId: number | null,
    room: string
  ) => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (view === 'group' && groupId) {
        filters.group_id = groupId;
      } else if (view === 'professor' && profId) {
        filters.professor_id = profId;
      } else if (view === 'room' && room) {
        filters.room = room;
      }
      
      const weekDates = getWeekDates();
      filters.start_date = weekDates.start;
      filters.end_date = weekDates.end;
      
      const response = await schedulesApi.getAll(filters);
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = () => {
    fetchSchedulesWithFilters(viewType, selectedGroup, selectedProfessor, selectedRoom);
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const [start] = currentWeek.split(' - ');
    const parts = start.split(' ');
    const day = parseInt(parts[0]);
    const months: any = { 'jan.': 0, 'févr.': 1, 'mars': 2, 'avr.': 3, 'mai': 4, 'juin': 5, 'juil.': 6, 'août': 7, 'sept.': 8, 'oct.': 9, 'nov.': 10, 'déc.': 11 };
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    
    const currentDate = new Date(year, month, day);
    currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 5);
    
    const formatDate = (date: Date) => {
      return `${date.getDate()} ${date.toLocaleDateString('fr-FR', { month: 'short' })} ${date.getFullYear()}`;
    };
    
    setCurrentWeek(`${formatDate(currentDate)} - ${formatDate(endDate)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const conflictCheck = await schedulesApi.checkConflicts({
        ...formData,
        schedule_id: selectedSchedule?.id
      });

      if (conflictCheck.data.has_conflicts) {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Conflits détectés',
          html: conflictCheck.data.conflicts.map((c: any) => `<p>${c.message}</p>`).join(''),
          showCancelButton: true,
          confirmButtonColor: '#C1272D',
          cancelButtonColor: '#6B7280',
          confirmButtonText: 'Créer quand même',
          cancelButtonText: 'Annuler',
        });

        if (!result.isConfirmed) return;
      }

      if (selectedSchedule) {
        await schedulesApi.update(selectedSchedule.id, formData);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Créneau modifié avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      } else {
        await schedulesApi.create(formData);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Créneau créé avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
      }
      
      setShowModal(false);
      resetForm();
      fetchSchedules();
      fetchInitialData();
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de sauvegarder le créneau',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleDelete = async (schedule: ScheduleSlot) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer ce créneau ?<br/><strong>${schedule.course.name}</strong>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await schedulesApi.delete(schedule.id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Créneau supprimé avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
        fetchSchedules();
        fetchInitialData();
      } catch (error) {
        console.error('Error deleting schedule:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de supprimer le créneau',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const openEditModal = (schedule: ScheduleSlot) => {
    setSelectedSchedule(schedule);
    setFormData({
      course_id: schedule.course.id,
      group_id: schedule.group.id,
      professor_id: schedule.professor?.id || 0,
      room: schedule.room,
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      type: schedule.type,
      is_recurring: schedule.is_recurring,
      notes: schedule.notes || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      course_id: 0,
      group_id: selectedGroup || 0,
      professor_id: 0,
      room: '',
      day: 'Lundi',
      start_time: '09:00',
      end_time: '12:00',
      type: 'cours',
      is_recurring: true,
      notes: '',
    });
    setSelectedSchedule(null);
  };

  const getSlotForTime = (day: string, time: string) => {
    return schedules.find(slot => 
      slot.day === day && 
      slot.start_time <= time && 
      slot.end_time > time
    );
  };

  const getSlotDuration = (slot: ScheduleSlot) => {
    const start = parseInt(slot.start_time.split(':')[0]);
    const end = parseInt(slot.end_time.split(':')[0]);
    return end - start;
  };

  const isSlotStart = (day: string, time: string) => {
    return schedules.some(slot => slot.day === day && slot.start_time === time);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-[#0D529C] border-[#0D529C]';
      case 'td': return 'bg-[#257035] border-[#257035]';
      case 'tp': return 'bg-purple-500 border-purple-500';
      case 'examen': return 'bg-[#C1272D] border-[#C1272D]';
      default: return 'bg-gray-500 border-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cours': return 'Cours';
      case 'td': return 'TD';
      case 'tp': return 'TP';
      case 'examen': return 'Examen';
      default: return type;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Emploi du Temps</h1>
          <p className="text-gray-500">Consultez et gérez les plannings des cours.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewType('group')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'group' ? 'bg-[#0D529C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                Par Groupe
              </button>
              <button
                onClick={() => setViewType('professor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'professor' ? 'bg-[#0D529C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Par Professeur
              </button>
              <button
                onClick={() => setViewType('room')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'room' ? 'bg-[#0D529C] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Par Salle
              </button>
            </div>

            <div className="flex items-center gap-4">
              {viewType === 'group' && groups.length > 0 && (
                <select
                  value={selectedGroup || ''}
                  onChange={(e) => setSelectedGroup(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              )}
              {viewType === 'professor' && professors.length > 0 && (
                <select
                  value={selectedProfessor || ''}
                  onChange={(e) => setSelectedProfessor(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {professors.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
              {viewType === 'room' && rooms.length > 0 && (
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {rooms.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              )}

              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter Créneau
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => changeWeek('prev')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0D529C]" />
              <span className="font-medium text-gray-700">{currentWeek}</span>
            </div>
            <button onClick={() => changeWeek('next')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-sm font-medium text-gray-500 w-20">
                    <Clock className="w-4 h-4 mx-auto" />
                  </th>
                  {days.map((day) => (
                    <th key={day} className="border border-gray-200 p-3 text-sm font-medium text-[#0D529C] min-w-[150px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="border border-gray-200 p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
                      {time}
                    </td>
                    {days.map((day) => {
                      const slot = getSlotForTime(day, time);
                      const isStart = isSlotStart(day, time);

                      if (slot && isStart) {
                        const duration = getSlotDuration(slot);
                        return (
                          <td
                            key={`${day}-${time}`}
                            rowSpan={duration}
                            className="border border-gray-200 p-0 relative"
                          >
                            <div className={`absolute inset-1 rounded-lg ${getTypeColor(slot.type)} text-white p-3 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group`}>
                              <div className="flex items-start justify-between mb-1">
                                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                                  {getTypeLabel(slot.type)}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => openEditModal(slot)}
                                    className="p-1 bg-white/20 hover:bg-white/30 rounded"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(slot)}
                                    className="p-1 bg-white/20 hover:bg-white/30 rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs opacity-80 mb-1">
                                {slot.start_time} - {slot.end_time}
                              </div>
                              <h4 className="font-bold text-sm mb-1 line-clamp-2">{slot.course.name}</h4>
                              <p className="text-xs opacity-90 mb-1">{slot.course.code}</p>
                              {viewType !== 'professor' && slot.professor && (
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {slot.professor.name}
                                </p>
                              )}
                              {viewType !== 'group' && (
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {slot.group.name}
                                </p>
                              )}
                              {viewType !== 'room' && (
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {slot.room}
                                </p>
                              )}
                            </div>
                          </td>
                        );
                      } else if (slot && !isStart) {
                        return null;
                      } else {
                        return (
                          <td
                            key={`${day}-${time}`}
                            className="border border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="h-12"></div>
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Légende</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#0D529C]"></div>
              <span className="text-sm text-gray-600">Cours Magistral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#257035]"></div>
              <span className="text-sm text-gray-600">Travaux Dirigés (TD)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-sm text-gray-600">Travaux Pratiques (TP)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#C1272D]"></div>
              <span className="text-sm text-gray-600">Examen</span>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#0D529C]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Heures cette semaine</p>
                  <p className="text-2xl font-bold text-[#0D529C]">{stats.total_hours_week}h</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#257035]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Créneaux planifiés</p>
                  <p className="text-2xl font-bold text-[#257035]">{stats.total_schedules}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salles utilisées</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.rooms_used}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedSchedule ? 'Modifier Créneau' : 'Ajouter Créneau'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations du Cours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cours *</label>
                    <select
                      required
                      value={formData.course_id}
                      onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value={0}>Sélectionner un cours</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupe *</label>
                    <select
                      required
                      value={formData.group_id}
                      onChange={(e) => setFormData({ ...formData, group_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value={0}>Sélectionner un groupe</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
                    <select
                      value={formData.professor_id}
                      onChange={(e) => setFormData({ ...formData, professor_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value={0}>Non assigné</option>
                      {professors.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="cours">Cours Magistral</option>
                      <option value="td">Travaux Dirigés (TD)</option>
                      <option value="tp">Travaux Pratiques (TP)</option>
                      <option value="examen">Examen</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Horaire et Lieu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jour *</label>
                    <select
                      required
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salle *</label>
                    <input
                      type="text"
                      required
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                      placeholder="Ex: Lab Info 2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure début *</label>
                    <input
                      type="time"
                      required
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin *</label>
                    <input
                      type="time"
                      required
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#257035] mb-4">Options</h3>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_recurring}
                      onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                      className="w-4 h-4 text-[#257035] border-gray-300 rounded focus:ring-[#257035]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Créneau récurrent (chaque semaine)</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notes ou commentaires..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedSchedule ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}