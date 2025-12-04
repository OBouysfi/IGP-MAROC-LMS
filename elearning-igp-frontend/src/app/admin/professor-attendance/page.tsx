'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Search, Filter, Eye, Users, Calendar } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { professorAttendanceApi, ProfessorAttendanceLog, ProfessorAttendanceStats, Professor } from '@/lib/api/admin/professor-attendance';
import Swal from 'sweetalert2';

export default function ProfessorAttendancePage() {
  const [logs, setLogs] = useState<ProfessorAttendanceLog[]>([]);
  const [stats, setStats] = useState<ProfessorAttendanceStats | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
  const [selectedLog, setSelectedLog] = useState<ProfessorAttendanceLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    professor_id: '',
    status: '',
    date_from: '',
    date_to: '',
    type: '',
  });

  useEffect(() => {
    fetchData();
    fetchProfessors();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes] = await Promise.all([
        professorAttendanceApi.getStats(),
        professorAttendanceApi.getAll(filters as any),
      ]);

      setStats(statsRes.data);
      setLogs(logsRes.data.data);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les données',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const res = await professorAttendanceApi.getProfessors();
      setProfessors(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleValidate = async (logIds: number[]) => {
    try {
      await professorAttendanceApi.validate(logIds);

      Swal.fire({
        icon: 'success',
        title: 'Validé',
        text: `${logIds.length} pointage(s) validé(s)`,
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });

      setSelectedLogs([]);
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de valider',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleReject = async (logId: number) => {
    const { value: reason } = await Swal.fire({
      title: 'Rejeter le pointage',
      input: 'textarea',
      inputLabel: 'Raison du rejet',
      inputPlaceholder: 'Ex: Pointage en dehors des horaires...',
      showCancelButton: true,
      confirmButtonText: 'Rejeter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#C1272D',
      inputValidator: (value) => {
        if (!value) {
          return 'Vous devez indiquer une raison!';
        }
      },
    });

    if (reason) {
      try {
        await professorAttendanceApi.reject(logId, reason);

        Swal.fire({
          icon: 'success',
          title: 'Rejeté',
          text: 'Pointage rejeté avec succès',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });

        fetchData();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.response?.data?.message || 'Impossible de rejeter',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const toggleSelectLog = (logId: number) => {
    setSelectedLogs((prev) =>
      prev.includes(logId) ? prev.filter((id) => id !== logId) : [...prev, logId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLogs.length === logs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(logs.map((log) => log.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700';
      case 'absent':
        return 'bg-red-100 text-red-700';
      case 'late':
        return 'bg-orange-100 text-orange-700';
      case 'early_leave':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      case 'late':
        return 'Retard';
      case 'early_leave':
        return 'Départ anticipé';
      default:
        return status;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'session_live':
        return 'bg-orange-500 text-white';
      case 'cours':
        return 'bg-blue-500 text-white';
      case 'td':
        return 'bg-purple-500 text-white';
      case 'tp':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Validation Pointages Professeurs</h1>
          <p className="text-gray-500">Validez les pointages des professeurs pour autoriser le paiement</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#0D529C]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Pointages</p>
                  <p className="text-lg font-bold text-[#0D529C]">{stats.total_logs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#257035]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Validés</p>
                  <p className="text-lg font-bold text-[#257035]">{stats.validated}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">En attente</p>
                  <p className="text-lg font-bold text-orange-500">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-[#C1272D]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Absences</p>
                  <p className="text-lg font-bold text-[#C1272D]">{stats.absences}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Heures Totales</p>
                  <p className="text-lg font-bold text-purple-500">{stats.total_hours}h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-800">Liste des Pointages</h2>
              {selectedLogs.length > 0 && (
                <button
                  onClick={() => handleValidate(selectedLogs)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Valider la sélection ({selectedLogs.length})
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select
                value={filters.professor_id}
                onChange={(e) => setFilters({ ...filters, professor_id: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D529C]"
              >
                <option value="">Tous les professeurs</option>
                {professors.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D529C]"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="validated">Validés</option>
                <option value="absent">Absences</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D529C]"
              >
                <option value="">Tous les types</option>
                <option value="cours">Cours</option>
                <option value="td">TD</option>
                <option value="tp">TP</option>
                <option value="session_live">Session Live</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Plus de filtres
              </button>
            </div>

            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date début</label>
                    <input
                      type="date"
                      value={filters.date_from}
                      onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date fin</label>
                    <input
                      type="date"
                      value={filters.date_to}
                      onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedLogs.length === logs.length && logs.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Arrivée</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Départ</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Heures</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Validation</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(log.id)}
                          onChange={() => toggleSelectLog(log.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-4 px-4 text-sm">{log.date}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{log.professor.name}</p>
                          <p className="text-xs text-gray-500">{log.professor.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{log.course.name}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTypeBadge(log.type)}`}>
                          {log.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-semibold">{log.clock_in || '-'}</td>
                      <td className="py-4 px-4 text-center text-sm font-semibold">{log.clock_out || '-'}</td>
                      <td className="py-4 px-4 text-center text-sm font-bold text-[#0D529C]">{log.hours_worked}h</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(log.status)}`}>
                          {getStatusLabel(log.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {log.rejected ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3" />
                            Rejeté
                          </span>
                        ) : log.validated ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            Validé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-700">
                            <AlertTriangle className="w-3 h-3" />
                            En attente
                          </span>
                        )}
                      </td>
                     <td className="py-4 px-4">
                   <div className="flex items-center justify-end gap-2">
                      {log.rejected ? (
                        <div className="text-right">
                          <p className="text-xs text-red-600 font-semibold">Rejeté</p>
                          <p className="text-xs text-gray-500">{log.rejection_reason}</p>
                        </div>
                      ) : !log.validated ? (
                        <>
                          <button
                            onClick={() => handleValidate([log.id])}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Valider"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(log.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-green-600">✓ Validé</span>
                      )}
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                         </div>
                  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

     {/* Detail Modal */}
{selectedLog && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
      <div className="p-6 border-b bg-[#0D529C] rounded-t-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Détails du Pointage</h2>
          <button
            onClick={() => setSelectedLog(null)}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Professeur</p>
            <p className="font-semibold">{selectedLog.professor.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{selectedLog.professor.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-semibold">{selectedLog.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cours</p>
            <p className="font-semibold">{selectedLog.course.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Groupe</p>
            <p className="font-semibold">{selectedLog.group.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getTypeBadge(selectedLog.type)}`}>
              {selectedLog.type.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Heure d'arrivée</p>
            <p className="font-semibold text-lg">{selectedLog.clock_in || 'Non pointé'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Heure de départ</p>
            <p className="font-semibold text-lg">{selectedLog.clock_out || 'Non pointé'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Heures travaillées</p>
            <p className="font-semibold text-lg text-[#0D529C]">{selectedLog.hours_worked}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Heures prévues</p>
            <p className="font-semibold text-lg">{selectedLog.hours_scheduled}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(selectedLog.status)}`}>
              {getStatusLabel(selectedLog.status)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Lieu</p>
            <p className="font-semibold">{selectedLog.location}</p>
          </div>
        </div>

        {/* ✅ AJOUT - Notes (affiche toujours) */}
        {selectedLog.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Notes</p>
            <p className="text-sm">{selectedLog.notes}</p>
          </div>
        )}

        {/* ✅ MODIFIÉ - Statut validation */}
        {selectedLog.rejected ? (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-semibold text-red-700">Pointage rejeté</p>
            </div>
            <p className="text-sm text-red-600">{selectedLog.rejection_reason}</p>
          </div>
        ) : selectedLog.validated ? (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-700">✓ Validé le {selectedLog.validated_at}</p>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-semibold text-orange-700">En attente de validation</p>
            </div>
          </div>
        )}

        {/* ✅ MODIFIÉ - Boutons d'action */}
        {!selectedLog.validated && !selectedLog.rejected && (
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => {
                handleValidate([selectedLog.id]);
                setSelectedLog(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Valider
            </button>
            <button
              onClick={() => {
                handleReject(selectedLog.id);
                setSelectedLog(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#C1272D] text-white rounded-lg hover:bg-red-700"
            >
              <XCircle className="w-4 h-4" />
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </AdminLayout>
  );
}