// src/app/admin/professors/page.tsx
'use client';

import React, { useState } from 'react';
import { GraduationCap, UserCheck, UserX, BookOpen, Plus, Search, Filter, SquarePen, Trash2, Eye, X, Phone, Mail, MapPin, Calendar, User, Award, Clock } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Professor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  birth_date: string;
  nationality: string;
  address: string;
  hire_date: string;
  department: string;
  specialization: string;
  status: string;
  is_active: boolean;
  contract_type: string;
  hourly_rate: number;
  total_hours_month: number;
  courses: { name: string; program: string; students: number; hours_week: number }[];
  qualifications: string[];
  bio: string;
}

export default function ProfessorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    contract_type: '',
  });

  const stats = {
    total_professors: 85,
    active_professors: 78,
    inactive_professors: 7,
    new_this_semester: 12,
  };

  const departments = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion', 'Langues', 'Droit'];
  const contractTypes = ['CDI', 'CDD', 'Vacataire'];
  const statuses = ['Actif', 'Inactif'];

  const professors: Professor[] = [
    {
      id: 1,
      first_name: 'Karim',
      last_name: 'Benjelloun',
      email: 'k.benjelloun@igp.edu',
      phone: '+212 6 61 23 45 67',
      gender: 'Homme',
      birth_date: '1985-08-20',
      nationality: 'Marocaine',
      address: '56 Boulevard Zerktouni, Casablanca',
      hire_date: '2020-09-01',
      department: 'Développement',
      specialization: 'Full Stack Development',
      status: 'Actif',
      is_active: true,
      contract_type: 'CDI',
      hourly_rate: 350,
      total_hours_month: 48,
      courses: [
        { name: 'React.js Avancé', program: 'Master', students: 25, hours_week: 6 },
        { name: 'Node.js & Express', program: 'Master', students: 28, hours_week: 4 },
        { name: 'Introduction au Web', program: 'Licence', students: 35, hours_week: 2 },
      ],
      qualifications: ['Doctorat en Informatique', 'Certifié AWS', 'Certifié React'],
      bio: 'Expert en développement web avec 10 ans d\'expérience. Passionné par les nouvelles technologies.',
    },
    {
      id: 2,
      first_name: 'Amina',
      last_name: 'El Fassi',
      email: 'a.elfassi@igp.edu',
      phone: '+212 6 72 34 56 78',
      gender: 'Femme',
      birth_date: '1990-03-15',
      nationality: 'Marocaine',
      address: '12 Rue Ibn Batouta, Rabat',
      hire_date: '2022-01-15',
      department: 'Marketing',
      specialization: 'Marketing Digital',
      status: 'Actif',
      is_active: true,
      contract_type: 'CDI',
      hourly_rate: 400,
      total_hours_month: 36,
      courses: [
        { name: 'Marketing Digital', program: 'Licence', students: 40, hours_week: 4 },
        { name: 'Stratégie Social Media', program: 'Master', students: 22, hours_week: 5 },
      ],
      qualifications: ['Master en Marketing', 'Google Ads Certified', 'Meta Blueprint'],
      bio: 'Spécialiste en marketing digital avec expertise en SEO et publicité en ligne.',
    },
    {
      id: 3,
      first_name: 'Omar',
      last_name: 'Tazi',
      email: 'o.tazi@igp.edu',
      phone: '+212 6 55 67 89 01',
      gender: 'Homme',
      birth_date: '1978-11-30',
      nationality: 'Marocaine',
      address: '89 Avenue Mohammed VI, Marrakech',
      hire_date: '2019-09-01',
      department: 'Finance',
      specialization: 'Finance d\'Entreprise',
      status: 'Inactif',
      is_active: false,
      contract_type: 'Vacataire',
      hourly_rate: 500,
      total_hours_month: 16,
      courses: [
        { name: 'Analyse Financière', program: 'Master', students: 30, hours_week: 4 },
      ],
      qualifications: ['MBA Finance', 'CFA Level 3', 'Expert Comptable'],
      bio: 'Ancien directeur financier avec 15 ans d\'expérience en entreprise.',
    },
  ];

  const resetFilters = () => {
    setFilters({ department: '', status: '', contract_type: '' });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Gestion des Professeurs</h1>
          <p className="text-gray-500">Gérez tous les professeurs et intervenants de l'établissement.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#0D529C] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Professeurs</p>
                <p className="text-3xl font-bold text-[#0D529C]">{stats.total_professors}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#0D529C]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Corps professoral complet</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#257035] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Professeurs Actifs</p>
                <p className="text-3xl font-bold text-[#257035]">{stats.active_professors}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-[#257035]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Enseignants en activité</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-[#C1272D] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Professeurs Inactifs</p>
                <p className="text-3xl font-bold text-[#C1272D]">{stats.inactive_professors}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-[#C1272D]" />
              </div>
            </div>
            <p className="text-xs text-gray-400">En congé ou indisponibles</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 border-l-4 border-l-orange-500 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nouveaux ce Semestre</p>
                <p className="text-3xl font-bold text-orange-500">{stats.new_this_semester}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400">Recrutements récents</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D529C]">Liste des Professeurs</h2>
              <p className="text-sm text-gray-500 mt-1">Tous les professeurs enregistrés dans le système</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              <Plus className="w-4 h-4" />
              Ajouter Professeur
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, spécialisation..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Département</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les départements</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type de Contrat</label>
                  <select
                    value={filters.contract_type}
                    onChange={(e) => setFilters({ ...filters, contract_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  >
                    <option value="">Tous les contrats</option>
                    {contractTypes.map((c) => (
                      <option key={c} value={c}>{c}</option>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contrat</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {professors.map((professor) => (
                  <tr key={professor.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900 text-sm">
                      {professor.first_name} {professor.last_name}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{professor.phone}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{professor.email}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                        {professor.department}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        professor.contract_type === 'CDI' ? 'bg-[#0D529C] text-white' :
                        professor.contract_type === 'CDD' ? 'bg-orange-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {professor.contract_type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        professor.is_active
                          ? 'bg-[#257035] text-white'
                          : 'bg-[#C1272D] text-white'
                      }`}>
                        {professor.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedProfessor(professor)}
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

      {/* Professor Detail Modal */}
      {selectedProfessor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-[#0D529C]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedProfessor.first_name} {selectedProfessor.last_name}</h2>
                  <p className="text-blue-200">ID: PROF-{String(selectedProfessor.id).padStart(4, '0')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfessor(null)}
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
                    <p className="font-medium">{selectedProfessor.first_name} {selectedProfessor.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {selectedProfessor.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedProfessor.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sexe</p>
                    <p className="font-medium">{selectedProfessor.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de Naissance</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedProfessor.birth_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationalité</p>
                    <p className="font-medium">{selectedProfessor.nationality}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedProfessor.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations Professionnelles */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Informations Professionnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Département</p>
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white mt-1">
                      {selectedProfessor.department}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Spécialisation</p>
                    <p className="font-medium">{selectedProfessor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'Embauche</p>
                    <p className="font-medium">{new Date(selectedProfessor.hire_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type de Contrat</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedProfessor.contract_type === 'CDI' ? 'bg-[#0D529C] text-white' :
                      selectedProfessor.contract_type === 'CDD' ? 'bg-orange-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {selectedProfessor.contract_type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                      selectedProfessor.is_active ? 'bg-[#257035] text-white' : 'bg-[#C1272D] text-white'
                    }`}>
                      {selectedProfessor.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Qualifications</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfessor.qualifications.map((qual) => (
                      <span key={qual} className="inline-flex px-3 py-1 text-xs bg-white border border-blue-200 text-blue-700 rounded-full">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="font-medium text-gray-700 bg-white p-3 rounded-lg mt-1">{selectedProfessor.bio}</p>
                </div>
              </div>

              {/* Rémunération */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#257035] mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Rémunération & Heures
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Taux Horaire</p>
                    <p className="font-bold text-lg">{selectedProfessor.hourly_rate} MAD/h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heures ce Mois</p>
                    <p className="font-bold text-lg">{selectedProfessor.total_hours_month}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Salaire Estimé (Mois)</p>
                    <p className="font-bold text-lg text-[#257035]">
                      {(selectedProfessor.hourly_rate * selectedProfessor.total_hours_month).toLocaleString()} MAD
                    </p>
                  </div>
                </div>
              </div>

              {/* Cours Assignés */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Cours Assignés
                </h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Cours</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Programme</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Étudiants</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Heures/Semaine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProfessor.courses.map((course) => (
                        <tr key={course.name} className="border-t border-gray-100">
                          <td className="py-2 px-3 text-sm font-medium">{course.name}</td>
                          <td className="py-2 px-3 text-sm text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#0D529C] text-white">
                              {course.program}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-sm text-center font-medium">{course.students}</td>
                          <td className="py-2 px-3 text-sm text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-700">
                              {course.hours_week}h
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
      )}
    </AdminLayout>
  );
}