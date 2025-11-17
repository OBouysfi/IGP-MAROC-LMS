// src/app/admin/students/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, UserCheck, UserX, GraduationCap, Plus, Search, Filter, SquarePen, Trash2, Eye, X, Phone, Mail, MapPin, Calendar, BookOpen, CreditCard, FileText, User } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  birth_date: string;
  nationality: string;
  address: string;
  enrolled_date: string;
  filiere: string;
  program: string;
  level: string;
  group: string;
  status: string;
  is_active: boolean;
  dossier_status: string;
  documents: string[];
  admin_comments: string;
  inscription_amount: number;
  monthly_amount: number;
  payment_status: string;
  payments: { date: string; amount: number; type: string }[];
  subjects: { name: string; note: number; absences: number }[];
  average: number;
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filters, setFilters] = useState({
    filiere: '',
    nationality: '',
    status: '',
    program: '',
  });

  const stats = {
    total_students: 1250,
    active_students: 1180,
    inactive_students: 70,
    new_this_month: 45,
  };

  const filieres = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion'];
  const nationalities = ['Marocaine', 'Française', 'Sénégalaise', 'Ivoirienne', 'Tunisienne', 'Algérienne'];
  const programs = ['Master', 'Licence'];
  const statuses = ['Actif', 'Inactif'];

  const students: Student[] = [
    {
      id: 1,
      first_name: 'Ahmed',
      last_name: 'Benali',
      email: 'ahmed.benali@igp.edu',
      phone: '+212 6 12 34 56 78',
      gender: 'Homme',
      birth_date: '1998-05-15',
      nationality: 'Marocaine',
      address: '123 Rue Mohammed V, Casablanca',
      enrolled_date: '2024-09-01',
      filiere: 'Développement',
      program: 'Master',
      level: '2ème année',
      group: 'DEV-M2-A',
      status: 'Actif',
      is_active: true,
      dossier_status: 'Complet',
      documents: ['CIN', 'Diplôme Licence', 'Photos', 'Certificat médical'],
      admin_comments: 'Étudiant sérieux, dossier en règle',
      inscription_amount: 5000,
      monthly_amount: 2500,
      payment_status: 'À jour',
      payments: [
        { date: '2024-09-01', amount: 5000, type: 'Inscription' },
        { date: '2024-09-05', amount: 2500, type: 'Mensualité Septembre' },
        { date: '2024-10-05', amount: 2500, type: 'Mensualité Octobre' },
      ],
      subjects: [
        { name: 'React.js', note: 16, absences: 2 },
        { name: 'Node.js', note: 14, absences: 0 },
        { name: 'Base de données', note: 15, absences: 1 },
        { name: 'DevOps', note: 13, absences: 3 },
      ],
      average: 14.5,
    },
    {
      id: 2,
      first_name: 'Fatima',
      last_name: 'Zahra',
      email: 'fatima.zahra@igp.edu',
      phone: '+212 6 98 76 54 32',
      gender: 'Femme',
      birth_date: '1999-03-22',
      nationality: 'Marocaine',
      address: '45 Avenue Hassan II, Rabat',
      enrolled_date: '2023-09-01',
      filiere: 'Commerce',
      program: 'Licence',
      level: '3ème année',
      group: 'COM-L3-B',
      status: 'Actif',
      is_active: true,
      dossier_status: 'Complet',
      documents: ['CIN', 'Baccalauréat', 'Photos', 'Certificat médical'],
      admin_comments: 'Excellente étudiante',
      inscription_amount: 4500,
      monthly_amount: 2000,
      payment_status: 'À jour',
      payments: [
        { date: '2023-09-01', amount: 4500, type: 'Inscription' },
        { date: '2024-09-05', amount: 2000, type: 'Mensualité Septembre' },
      ],
      subjects: [
        { name: 'Marketing Digital', note: 18, absences: 0 },
        { name: 'Comptabilité', note: 16, absences: 1 },
        { name: 'Droit des affaires', note: 15, absences: 0 },
      ],
      average: 16.33,
    },
    {
      id: 3,
      first_name: 'Mohamed',
      last_name: 'Alaoui',
      email: 'mohamed.alaoui@igp.edu',
      phone: '+221 77 123 45 67',
      gender: 'Homme',
      birth_date: '2000-11-10',
      nationality: 'Sénégalaise',
      address: '78 Rue de la Liberté, Dakar',
      enrolled_date: '2024-09-01',
      filiere: 'Marketing',
      program: 'Master',
      level: '1ère année',
      group: 'MKT-M1-A',
      status: 'Suspendu',
      is_active: false,
      dossier_status: 'Incomplet',
      documents: ['Passeport', 'Diplôme Licence'],
      admin_comments: 'Manque certificat médical et photos',
      inscription_amount: 5000,
      monthly_amount: 2500,
      payment_status: 'En retard',
      payments: [
        { date: '2024-09-01', amount: 5000, type: 'Inscription' },
      ],
      subjects: [
        { name: 'Stratégie Marketing', note: 12, absences: 5 },
        { name: 'Communication', note: 11, absences: 4 },
      ],
      average: 11.5,
    },
  ];

  const resetFilters = () => {
    setFilters({ filiere: '', nationality: '', status: '', program: '' });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Gestion des Étudiants</h1>
          <p className="text-gray-500">Gérez tous les étudiants inscrits dans le système.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Étudiants</p>
                <p className="text-3xl font-bold text-[#0D529C]">{stats.total_students}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0D529C]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Tous les étudiants enregistrés</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Étudiants Actifs</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.active_students}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Étudiants avec accès actif</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#C1272D] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Étudiants Inactifs</p>
                <p className="text-3xl font-bold text-[#C1272D]">{stats.inactive_students}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-[#C1272D]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Comptes désactivés ou suspendus</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nouveaux ce Mois</p>
                <p className="text-3xl font-bold text-orange-500">{stats.new_this_month}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Inscriptions récentes</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Étudiants</h2>
              <p className="text-sm text-gray-500 mt-1">Tous les étudiants enregistrés dans le système</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <Plus className="w-4 h-4" />
              Ajouter Étudiant
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'border-[#0D529C] bg-blue-50 text-[#0D529C]' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtrer
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nationalité</label>
                  <select
                    value={filters.nationality}
                    onChange={(e) => setFilters({ ...filters, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Toutes les nationalités</option>
                    {nationalities.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Programme</label>
                  <select
                    value={filters.program}
                    onChange={(e) => setFilters({ ...filters, program: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les programmes</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Statut</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les statuts</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nom Complet</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Téléphone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Filière</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Programme</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{student.phone}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{student.email}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                        {student.filiere}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white">
                        {student.program}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        student.is_active
                          ? 'bg-[#257035] text-white'
                          : 'bg-[#C1272D] text-white'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1">
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#0D529C]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                  <p className="text-blue-200">ID: STU-{String(selectedStudent.id).padStart(5, '0')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations Personnelles */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom Complet</p>
                    <p className="font-medium">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedStudent.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedStudent.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sexe</p>
                    <p className="font-medium">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de Naissance</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedStudent.birth_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationalité</p>
                    <p className="font-medium">{selectedStudent.nationality}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedStudent.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'Inscription</p>
                    <p className="font-medium">{new Date(selectedStudent.enrolled_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              {/* Informations Académiques */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Informations Académiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Filière</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                      {selectedStudent.filiere}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Programme</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white mt-1">
                      {selectedStudent.program}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Niveau</p>
                    <p className="font-medium">{selectedStudent.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Groupe</p>
                    <p className="font-medium">{selectedStudent.group}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut Étudiant</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedStudent.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                    }`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Administration */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Administration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Statut du Dossier</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedStudent.dossier_status === 'Complet' ? 'bg-[#257035] text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {selectedStudent.dossier_status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documents Fournis</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedStudent.documents.map((doc) => (
                        <span key={doc} className="inline-flex px-2 py-1 text-xs bg-gray-200 rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Commentaires Administratifs</p>
                    <p className="font-medium text-gray-700 bg-white p-3 rounded-lg mt-1">{selectedStudent.admin_comments}</p>
                  </div>
                </div>
              </div>

              {/* Finance */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Finance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Montant Inscription</p>
                    <p className="font-bold text-lg">{selectedStudent.inscription_amount.toLocaleString()} MAD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Montant Mensuel</p>
                    <p className="font-bold text-lg">{selectedStudent.monthly_amount.toLocaleString()} MAD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut Paiement</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedStudent.payment_status === 'À jour' ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                    }`}>
                      {selectedStudent.payment_status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Historique Paiements</p>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Date</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Type</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.payments.map((payment, index) => (
                          <tr key={index} className="border-t border-gray-100">
                            <td className="py-2 px-3 text-sm">{new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                            <td className="py-2 px-3 text-sm">{payment.type}</td>
                            <td className="py-2 px-3 text-sm text-right font-medium">{payment.amount.toLocaleString()} MAD</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pédagogique */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Pédagogique
                </h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-500">Moyenne Générale</p>
                    <span className={`inline-flex px-4 py-2 text-lg font-bold rounded-lg ${
                      selectedStudent.average >= 14 ? 'bg-[#257035] text-white' : selectedStudent.average >= 10 ? 'bg-orange-500 text-white' : 'bg-[#C1272D] text-white'
                    }`}>
                      {selectedStudent.average.toFixed(2)} / 20
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Matières & Notes</p>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Matière</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Note</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Absences</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.subjects.map((subject) => (
                          <tr key={subject.name} className="border-t border-gray-100">
                            <td className="py-2 px-3 text-sm font-medium">{subject.name}</td>
                            <td className="py-2 px-3 text-sm text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                subject.note >= 14 ? 'bg-green-100 text-green-700' : subject.note >= 10 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {subject.note}/20
                              </span>
                            </td>
                            <td className="py-2 px-3 text-sm text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                                subject.absences === 0 ? 'bg-green-100 text-green-700' : subject.absences <= 2 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {subject.absences}h
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}