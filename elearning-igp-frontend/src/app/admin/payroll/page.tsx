// src/app/admin/payroll/page.tsx
'use client';

import React, { useState } from 'react';
import { DollarSign, Clock, Users, CheckCircle, Search, Filter, Eye, Download, X, Calendar, FileText, CreditCard, TrendingUp, Printer } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface ProfessorPayroll {
  id: number;
  professor_name: string;
  professor_email: string;
  department: string;
  contract_type: string;
  hourly_rate: number;
  hours_worked: number;
  bonus: number;
  deductions: number;
  gross_salary: number;
  net_salary: number;
  payment_status: 'payé' | 'en_attente' | 'en_cours';
  payment_date: string | null;
  payment_reference: string | null;
  payment_method: string | null;
  bank_info: string;
  courses_details: { course: string; hours: number; group: string }[];
}

interface PaymentHistory {
  id: number;
  month: string;
  year: number;
  professor_name: string;
  amount: number;
  payment_date: string;
  reference: string;
}

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<ProfessorPayroll | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedForPayment, setSelectedForPayment] = useState<number[]>([]);
  const [paymentToConfirm, setPaymentToConfirm] = useState<ProfessorPayroll | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('Novembre');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    contract_type: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    payment_reference: '',
    payment_method: 'virement',
    comment: '',
  });

  const stats = {
    total_to_pay: 425000,
    total_hours: 1250,
    professors_count: 85,
    paid_count: 72,
    pending_count: 13,
  };

  const departments = ['Développement', 'Commerce', 'Marketing', 'Finance', 'RH', 'Gestion', 'Langues', 'Droit'];
  const contractTypes = ['CDI', 'CDD', 'Vacataire'];
  const paymentStatuses = ['Payé', 'En attente', 'En cours'];
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const paymentMethods = [
    { value: 'virement', label: 'Virement Bancaire' },
    { value: 'cheque', label: 'Chèque' },
    { value: 'especes', label: 'Espèces' },
  ];

  const [payrolls, setPayrolls] = useState<ProfessorPayroll[]>([
    {
      id: 1,
      professor_name: 'Karim Benjelloun',
      professor_email: 'k.benjelloun@igp.edu',
      department: 'Développement',
      contract_type: 'CDI',
      hourly_rate: 350,
      hours_worked: 48,
      bonus: 500,
      deductions: 0,
      gross_salary: 17300,
      net_salary: 17300,
      payment_status: 'payé',
      payment_date: '2024-11-05',
      payment_reference: 'VIR-2024-11-001',
      payment_method: 'virement',
      bank_info: 'BMCE ****1234',
      courses_details: [
        { course: 'React.js Avancé', hours: 24, group: 'DEV-M2-A' },
        { course: 'Node.js & Express', hours: 16, group: 'DEV-M2-A' },
        { course: 'Introduction Web', hours: 8, group: 'DEV-L1-A' },
      ],
    },
    {
      id: 2,
      professor_name: 'Amina El Fassi',
      professor_email: 'a.elfassi@igp.edu',
      department: 'Marketing',
      contract_type: 'CDI',
      hourly_rate: 400,
      hours_worked: 36,
      bonus: 0,
      deductions: 0,
      gross_salary: 14400,
      net_salary: 14400,
      payment_status: 'en_attente',
      payment_date: null,
      payment_reference: null,
      payment_method: null,
      bank_info: 'Attijariwafa ****5678',
      courses_details: [
        { course: 'Marketing Digital', hours: 16, group: 'COM-L3-B' },
        { course: 'Stratégie Social Media', hours: 20, group: 'MKT-M1-A' },
      ],
    },
    {
      id: 3,
      professor_name: 'Omar Tazi',
      professor_email: 'o.tazi@igp.edu',
      department: 'Finance',
      contract_type: 'Vacataire',
      hourly_rate: 500,
      hours_worked: 16,
      bonus: 0,
      deductions: 0,
      gross_salary: 8000,
      net_salary: 8000,
      payment_status: 'en_attente',
      payment_date: null,
      payment_reference: null,
      payment_method: null,
      bank_info: 'CIH ****9012',
      courses_details: [
        { course: 'Analyse Financière', hours: 16, group: 'FIN-M1-A' },
      ],
    },
    {
      id: 4,
      professor_name: 'Hassan Alami',
      professor_email: 'h.alami@igp.edu',
      department: 'Développement',
      contract_type: 'CDI',
      hourly_rate: 380,
      hours_worked: 40,
      bonus: 200,
      deductions: 0,
      gross_salary: 15400,
      net_salary: 15400,
      payment_status: 'en_attente',
      payment_date: null,
      payment_reference: null,
      payment_method: null,
      bank_info: 'BMCE ****3456',
      courses_details: [
        { course: 'DevOps & CI/CD', hours: 20, group: 'DEV-M2-A' },
        { course: 'Python Avancé', hours: 20, group: 'DEV-M1-A' },
      ],
    },
    {
      id: 5,
      professor_name: 'Nadia Fassi',
      professor_email: 'n.fassi@igp.edu',
      department: 'Développement',
      contract_type: 'CDD',
      hourly_rate: 320,
      hours_worked: 28,
      bonus: 0,
      deductions: 0,
      gross_salary: 8960,
      net_salary: 8960,
      payment_status: 'en_attente',
      payment_date: null,
      payment_reference: null,
      payment_method: null,
      bank_info: 'BP ****7890',
      courses_details: [
        { course: 'Base de données NoSQL', hours: 12, group: 'DEV-M2-A' },
        { course: 'JavaScript', hours: 16, group: 'DEV-L2-A' },
      ],
    },
  ]);

  const paymentHistory: PaymentHistory[] = [
    { id: 1, month: 'Octobre', year: 2024, professor_name: 'Karim Benjelloun', amount: 16800, payment_date: '2024-10-05', reference: 'VIR-2024-10-001' },
    { id: 2, month: 'Octobre', year: 2024, professor_name: 'Amina El Fassi', amount: 14400, payment_date: '2024-10-05', reference: 'VIR-2024-10-002' },
    { id: 3, month: 'Octobre', year: 2024, professor_name: 'Hassan Alami', amount: 15200, payment_date: '2024-10-05', reference: 'VIR-2024-10-003' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'payé': return 'bg-[#257035] text-white';
      case 'en_attente': return 'bg-orange-500 text-white';
      case 'en_cours': return 'bg-[#0D529C] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'payé': return 'Payé';
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      default: return status;
    }
  };

  const resetFilters = () => {
    setFilters({ department: '', status: '', contract_type: '' });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const unpaidIds = payrolls.filter(p => p.payment_status === 'en_attente').map(p => p.id);
      setSelectedForPayment(unpaidIds);
    } else {
      setSelectedForPayment([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedForPayment([...selectedForPayment, id]);
    } else {
      setSelectedForPayment(selectedForPayment.filter(i => i !== id));
    }
  };

  const openPaymentModal = (payroll: ProfessorPayroll) => {
    setPaymentToConfirm(payroll);
    setPaymentForm({
      payment_date: new Date().toISOString().split('T')[0],
      payment_reference: `VIR-${selectedYear}-${months.indexOf(selectedMonth) + 1}-${String(payroll.id).padStart(3, '0')}`,
      payment_method: 'virement',
      comment: '',
    });
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (paymentToConfirm) {
      setPayrolls(payrolls.map(p => {
        if (p.id === paymentToConfirm.id) {
          return {
            ...p,
            payment_status: 'payé' as const,
            payment_date: paymentForm.payment_date,
            payment_reference: paymentForm.payment_reference,
            payment_method: paymentForm.payment_method,
          };
        }
        return p;
      }));
      setShowPaymentModal(false);
      setPaymentToConfirm(null);
      setShowReceiptModal(true);
    }
  };

  const confirmMultiplePayments = () => {
    const reference_base = `VIR-${selectedYear}-${months.indexOf(selectedMonth) + 1}`;
    setPayrolls(payrolls.map(p => {
      if (selectedForPayment.includes(p.id)) {
        return {
          ...p,
          payment_status: 'payé' as const,
          payment_date: new Date().toISOString().split('T')[0],
          payment_reference: `${reference_base}-${String(p.id).padStart(3, '0')}`,
          payment_method: 'virement',
        };
      }
      return p;
    }));
    setSelectedForPayment([]);
  };

  const generateReceipt = (payroll: ProfessorPayroll) => {
    setPaymentToConfirm(payroll);
    setShowReceiptModal(true);
  };

  const unpaidPayrolls = payrolls.filter(p => p.payment_status === 'en_attente');
  const selectedTotal = payrolls
    .filter(p => selectedForPayment.includes(p.id))
    .reduce((sum, p) => sum + p.net_salary, 0);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Paie des Professeurs</h1>
          <p className="text-gray-500">Gérez les paiements et les fiches de paie des enseignants.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total à Payer</p>
                <p className="text-lg font-bold text-[#0D529C]">{(stats.total_to_pay / 1000).toFixed(0)}K MAD</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
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

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Professeurs</p>
                <p className="text-lg font-bold text-orange-500">{stats.professors_count}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Payés</p>
                <p className="text-lg font-bold text-[#257035]">{payrolls.filter(p => p.payment_status === 'payé').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#C1272D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">En Attente</p>
                <p className="text-lg font-bold text-[#C1272D]">{unpaidPayrolls.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'current'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Paie du Mois
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-[#0D529C] text-[#0D529C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Historique
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'current' && (
              <>
                {/* Month Selector & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    {selectedForPayment.length > 0 && (
                      <button
                        onClick={confirmMultiplePayments}
                        className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Payer Sélectionnés ({selectedForPayment.length})
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Exporter
                    </button>
                  </div>
                </div>

                {/* Selected Summary */}
                {selectedForPayment.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-800">{selectedForPayment.length} professeur(s) sélectionné(s)</p>
                        <p className="text-sm text-orange-600">Total à payer: <span className="font-bold">{selectedTotal.toLocaleString()} MAD</span></p>
                      </div>
                      <button
                        onClick={() => setSelectedForPayment([])}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, département..."
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
                        <label className="block text-sm font-medium text-gray-600 mb-1">Statut Paiement</label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                        >
                          <option value="">Tous les statuts</option>
                          {paymentStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payroll Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedForPayment.length === unpaidPayrolls.length && unpaidPayrolls.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4 text-[#0D529C] border-gray-300 rounded focus:ring-[#0D529C]"
                          />
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Département</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Heures</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Taux/h</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Net à Payer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Statut</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls.map((payroll) => (
                        <tr key={payroll.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            {payroll.payment_status === 'en_attente' && (
                              <input
                                type="checkbox"
                                checked={selectedForPayment.includes(payroll.id)}
                                onChange={(e) => handleSelectOne(payroll.id, e.target.checked)}
                                className="w-4 h-4 text-[#0D529C] border-gray-300 rounded focus:ring-[#0D529C]"
                              />
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{payroll.professor_name}</p>
                              <p className="text-xs text-gray-500">{payroll.professor_email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                              {payroll.department}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-medium">{payroll.hours_worked}h</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm">{payroll.hourly_rate} MAD</span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-bold text-[#257035]">{payroll.net_salary.toLocaleString()} MAD</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(payroll.payment_status)}`}>
                              {getStatusLabel(payroll.payment_status)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedPayroll(payroll)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors"
                              title="Voir détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {payroll.payment_status === 'payé' && (
                              <button
                                onClick={() => generateReceipt(payroll)}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#0D529C] hover:text-white transition-colors ml-1"
                                title="Générer reçu"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            )}
                            {payroll.payment_status === 'en_attente' && (
                              <button
                                onClick={() => openPaymentModal(payroll)}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#257035] hover:text-white transition-colors ml-1"
                                title="Marquer comme payé"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Summary */}
                <div className="mt-6 bg-[#0D529C] rounded-lg p-6 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-blue-200 text-sm">Total Heures</p>
                      <p className="text-2xl font-bold">{payrolls.reduce((sum, p) => sum + p.hours_worked, 0)}h</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Total Brut</p>
                      <p className="text-2xl font-bold">{payrolls.reduce((sum, p) => sum + p.gross_salary, 0).toLocaleString()} MAD</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Total Net à Payer</p>
                      <p className="text-2xl font-bold">{payrolls.reduce((sum, p) => sum + p.net_salary, 0).toLocaleString()} MAD</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Reste à Payer</p>
                      <p className="text-2xl font-bold">{unpaidPayrolls.reduce((sum, p) => sum + p.net_salary, 0).toLocaleString()} MAD</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0D529C]">Historique des Paiements</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Exporter Historique
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Référence</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Période</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Montant</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date Paiement</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <span className="inline-flex px-2 py-1 text-xs font-mono bg-gray-100 rounded">
                              {payment.reference}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-900 text-sm">{payment.professor_name}</td>
                          <td className="py-4 px-4 text-gray-600 text-sm">{payment.month} {payment.year}</td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-bold text-[#257035]">{payment.amount.toLocaleString()} MAD</span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-black hover:bg-[#C1272D] hover:text-white transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && paymentToConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Confirmer le Paiement</h2>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Professeur</p>
                <p className="font-bold text-[#0D529C]">{paymentToConfirm.professor_name}</p>
                <p className="text-2xl font-bold text-[#257035] mt-2">{paymentToConfirm.net_salary.toLocaleString()} MAD</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date de Paiement</label>
                <input
                  type="date"
                  value={paymentForm.payment_date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Référence de Paiement</label>
                <input
                  type="text"
                  value={paymentForm.payment_reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Méthode de Paiement</label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {paymentMethods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Commentaire (optionnel)</label>
                <textarea
                  value={paymentForm.comment}
                  onChange={(e) => setPaymentForm({ ...paymentForm, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmPayment}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Confirmer le Paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && paymentToConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Reçu de Paiement</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4" />
                    Télécharger PDF
                  </button>
                  <button onClick={() => setShowReceiptModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-8 bg-white" id="receipt">
              {/* Header with Logo */}
              <div className="flex items-center justify-between border-b-2 border-[#0D529C] pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#0D529C] rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                    IGP
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#0D529C]">IGP Maroc</h1>
                    <p className="text-sm text-gray-600">Institut de Gestion et de Perfectionnement</p>
                    <p className="text-xs text-gray-500">123 Boulevard Mohammed V, Casablanca</p>
                    <p className="text-xs text-gray-500">Tél: +212 5 22 12 34 56 | Email: contact@igp.edu</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-800">REÇU DE PAIEMENT</h2>
                  <p className="text-sm text-gray-600">N°: {paymentToConfirm.payment_reference || 'VIR-2024-11-XXX'}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(paymentToConfirm.payment_date || new Date()).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Beneficiary Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">BÉNÉFICIAIRE</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom Complet</p>
                    <p className="font-medium">{paymentToConfirm.professor_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{paymentToConfirm.professor_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Département</p>
                    <p className="font-medium">{paymentToConfirm.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type de Contrat</p>
                    <p className="font-medium">{paymentToConfirm.contract_type}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-4">DÉTAILS DU PAIEMENT - {selectedMonth} {selectedYear}</h3>
                <table className="w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-2 px-4 border-b text-sm">Description</th>
                      <th className="text-center py-2 px-4 border-b text-sm">Quantité</th>
                      <th className="text-right py-2 px-4 border-b text-sm">Taux</th>
                      <th className="text-right py-2 px-4 border-b text-sm">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentToConfirm.courses_details.map((course, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 text-sm">{course.course} ({course.group})</td>
                        <td className="py-2 px-4 text-center text-sm">{course.hours}h</td>
                        <td className="py-2 px-4 text-right text-sm">{paymentToConfirm.hourly_rate} MAD/h</td>
                        <td className="py-2 px-4 text-right text-sm font-medium">{(course.hours * paymentToConfirm.hourly_rate).toLocaleString()} MAD</td>
                      </tr>
                    ))}
                    {paymentToConfirm.bonus > 0 && (
                      <tr className="border-b">
                        <td className="py-2 px-4 text-sm">Prime / Bonus</td>
                        <td className="py-2 px-4 text-center text-sm">-</td>
                        <td className="py-2 px-4 text-right text-sm">-</td>
                        <td className="py-2 px-4 text-right text-sm font-medium text-[#257035]">+{paymentToConfirm.bonus.toLocaleString()} MAD</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="py-3 px-4 text-right font-bold">TOTAL HEURES</td>
                      <td className="py-3 px-4 text-right font-bold">{paymentToConfirm.hours_worked}h</td>
                    </tr>
                    <tr className="bg-[#0D529C] text-white">
                      <td colSpan={3} className="py-3 px-4 text-right font-bold">MONTANT NET À PAYER</td>
                      <td className="py-3 px-4 text-right font-bold text-lg">{paymentToConfirm.net_salary.toLocaleString()} MAD</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Method */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Méthode de Paiement</p>
                    <p className="font-medium capitalize">{paymentToConfirm.payment_method || 'Virement Bancaire'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Compte Bancaire</p>
                    <p className="font-medium">{paymentToConfirm.bank_info}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Référence</p>
                    <p className="font-medium font-mono">{paymentToConfirm.payment_reference || 'VIR-2024-11-XXX'}</p>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="flex justify-between items-end mt-12">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Reçu par:</p>
                  <div className="border-t border-gray-400 w-48 pt-2">
                    <p className="text-sm font-medium">{paymentToConfirm.professor_name}</p>
                    <p className="text-xs text-gray-500">Signature</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 border-2 border-[#0D529C] rounded-lg flex items-center justify-center mb-2">
                    <div className="text-center">
                      <p className="text-xs text-[#0D529C] font-bold">CACHET</p>
                      <p className="text-xs text-[#0D529C]">IGP MAROC</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">Émis par:</p>
                  <div className="border-t border-gray-400 w-48 pt-2">
                    <p className="text-sm font-medium">Direction Administrative</p>
                    <p className="text-xs text-gray-500">Signature & Cachet</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">Ce document est un reçu officiel de paiement émis par IGP Maroc.</p>
                <p className="text-xs text-gray-500">Pour toute question, contactez: paie@igp.edu | +212 5 22 12 34 56</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Detail Modal */}
      {selectedPayroll && !showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0D529C] text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedPayroll.professor_name}</h2>
                <p className="text-blue-200">{selectedPayroll.professor_email}</p>
              </div>
              <button onClick={() => setSelectedPayroll(null)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Fiche de Paie - {selectedMonth} {selectedYear}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span>Heures Travaillées</span>
                    <span className="font-medium">{selectedPayroll.hours_worked}h</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Taux Horaire</span>
                    <span className="font-medium">{selectedPayroll.hourly_rate} MAD/h</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Salaire de Base</span>
                    <span className="font-medium">{(selectedPayroll.hours_worked * selectedPayroll.hourly_rate).toLocaleString()} MAD</span>
                  </div>
                  {selectedPayroll.bonus > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Bonus</span>
                      <span className="font-medium text-[#257035]">+{selectedPayroll.bonus} MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 bg-[#257035] text-white rounded-lg px-4">
                    <span className="font-bold">NET À PAYER</span>
                    <span className="font-bold text-xl">{selectedPayroll.net_salary.toLocaleString()} MAD</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0D529C] mb-4">Détail des Cours</h3>
                <table className="w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-2 px-3 text-xs">Cours</th>
                      <th className="text-left py-2 px-3 text-xs">Groupe</th>
                      <th className="text-center py-2 px-3 text-xs">Heures</th>
                      <th className="text-right py-2 px-3 text-xs">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.courses_details.map((course, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2 px-3 text-sm">{course.course}</td>
                        <td className="py-2 px-3 text-sm">{course.group}</td>
                        <td className="py-2 px-3 text-sm text-center">{course.hours}h</td>
                        <td className="py-2 px-3 text-sm text-right">{(course.hours * selectedPayroll.hourly_rate).toLocaleString()} MAD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2">
                {selectedPayroll.payment_status === 'payé' && (
                  <button
                    onClick={() => {
                      setPaymentToConfirm(selectedPayroll);
                      setSelectedPayroll(null);
                      setShowReceiptModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D529C] text-white rounded-lg hover:bg-blue-700"
                  >
                    <Printer className="w-4 h-4" />
                    Générer Reçu
                  </button>
                )}
                {selectedPayroll.payment_status === 'en_attente' && (
                  <button
                    onClick={() => {
                      setPaymentToConfirm(selectedPayroll);
                      setSelectedPayroll(null);
                      openPaymentModal(selectedPayroll);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marquer comme Payé
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}