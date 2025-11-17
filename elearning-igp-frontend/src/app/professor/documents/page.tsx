// src/app/professor/documents/page.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Search, Filter, FolderOpen, File, Video, Image, X, Plus, Clock, CheckCircle } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';

interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'video' | 'image' | 'zip';
  size: string;
  course: string;
  course_code: string;
  category: 'cours' | 'tp' | 'examen' | 'correction' | 'ressource';
  uploaded_at: string;
  downloads: number;
  shared_with_students: boolean;
}

export default function ProfessorDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [newDocument, setNewDocument] = useState({
    name: '',
    course: '',
    category: 'cours',
    shared_with_students: true,
  });

  const myCourses = [
    'React.js Avancé',
    'Node.js & Express',
    'Introduction au Web',
    'JavaScript Moderne',
    'Base de données NoSQL',
  ];

  const categories = [
    { value: 'cours', label: 'Support de Cours' },
    { value: 'tp', label: 'TP / Exercices' },
    { value: 'examen', label: 'Examen' },
    { value: 'correction', label: 'Correction' },
    { value: 'ressource', label: 'Ressource' },
  ];

  const documents: Document[] = [
    {
      id: 1,
      name: 'Introduction aux Hooks React',
      type: 'pdf',
      size: '2.5 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      category: 'cours',
      uploaded_at: '2024-11-01',
      downloads: 45,
      shared_with_students: true,
    },
    {
      id: 2,
      name: 'TP - Context API et State Management',
      type: 'pdf',
      size: '1.8 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      category: 'tp',
      uploaded_at: '2024-11-05',
      downloads: 38,
      shared_with_students: true,
    },
    {
      id: 3,
      name: 'Vidéo - Performance React',
      type: 'video',
      size: '150 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      category: 'ressource',
      uploaded_at: '2024-11-08',
      downloads: 22,
      shared_with_students: true,
    },
    {
      id: 4,
      name: 'Partiel React - Novembre 2024',
      type: 'pdf',
      size: '500 KB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      category: 'examen',
      uploaded_at: '2024-11-10',
      downloads: 0,
      shared_with_students: false,
    },
    {
      id: 5,
      name: 'Correction Partiel React',
      type: 'pdf',
      size: '1.2 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      category: 'correction',
      uploaded_at: '2024-11-15',
      downloads: 0,
      shared_with_students: false,
    },
    {
      id: 6,
      name: 'Guide Express.js',
      type: 'pdf',
      size: '3.1 MB',
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      category: 'cours',
      uploaded_at: '2024-10-20',
      downloads: 52,
      shared_with_students: true,
    },
    {
      id: 7,
      name: 'TP - API REST avec JWT',
      type: 'docx',
      size: '900 KB',
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      category: 'tp',
      uploaded_at: '2024-11-02',
      downloads: 48,
      shared_with_students: true,
    },
    {
      id: 8,
      name: 'Présentation MongoDB',
      type: 'pptx',
      size: '5.2 MB',
      course: 'Base de données NoSQL',
      course_code: 'DEV-NOSQL',
      category: 'cours',
      uploaded_at: '2024-11-12',
      downloads: 18,
      shared_with_students: true,
    },
    {
      id: 9,
      name: 'Exercices JavaScript ES6+',
      type: 'pdf',
      size: '1.5 MB',
      course: 'JavaScript Moderne',
      course_code: 'DEV-JS',
      category: 'tp',
      uploaded_at: '2024-11-08',
      downloads: 35,
      shared_with_students: true,
    },
    {
      id: 10,
      name: 'Projet Final - Consignes',
      type: 'pdf',
      size: '800 KB',
      course: 'Introduction au Web',
      course_code: 'DEV-WEB',
      category: 'ressource',
      uploaded_at: '2024-11-14',
      downloads: 42,
      shared_with_students: true,
    },
  ];

  const stats = {
    total_documents: documents.length,
    total_size: '167.5 MB',
    shared_documents: documents.filter(d => d.shared_with_students).length,
    total_downloads: documents.reduce((sum, d) => sum + d.downloads, 0),
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'docx': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'pptx': return <FileText className="w-8 h-8 text-orange-500" />;
      case 'xlsx': return <FileText className="w-8 h-8 text-green-500" />;
      case 'video': return <Video className="w-8 h-8 text-purple-500" />;
      case 'image': return <Image className="w-8 h-8 text-pink-500" />;
      case 'zip': return <FolderOpen className="w-8 h-8 text-yellow-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 text-red-600';
      case 'docx': return 'bg-blue-50 text-blue-600';
      case 'pptx': return 'bg-orange-50 text-orange-600';
      case 'xlsx': return 'bg-green-50 text-green-600';
      case 'video': return 'bg-purple-50 text-purple-600';
      case 'image': return 'bg-pink-50 text-pink-600';
      case 'zip': return 'bg-yellow-50 text-yellow-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cours': return 'bg-[#0D529C] text-white';
      case 'tp': return 'bg-[#257035] text-white';
      case 'examen': return 'bg-[#C1272D] text-white';
      case 'correction': return 'bg-purple-500 text-white';
      case 'ressource': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cours': return 'Cours';
      case 'tp': return 'TP';
      case 'examen': return 'Examen';
      case 'correction': return 'Correction';
      case 'ressource': return 'Ressource';
      default: return category;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (searchTerm && !doc.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterCourse && doc.course !== filterCourse) return false;
    if (filterCategory && doc.category !== filterCategory) return false;
    if (filterType && doc.type !== filterType) return false;
    return true;
  });

  const handleUpload = () => {
    setShowUploadModal(false);
    alert('Document uploadé avec succès!');
  };

  const toggleShare = (docId: number) => {
    // Logic to toggle sharing
    alert('Partage modifié!');
  };

  const deleteDocument = (docId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      alert('Document supprimé!');
    }
  };

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Mes Documents</h1>
          <p className="text-gray-500">Gérez vos supports de cours, TPs et ressources pédagogiques.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Documents</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_documents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Espace Utilisé</p>
                <p className="text-xl font-bold text-purple-500">{stats.total_size}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Partagés</p>
                <p className="text-xl font-bold text-[#257035]">{stats.shared_documents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Téléchargements</p>
                <p className="text-xl font-bold text-orange-500">{stats.total_downloads}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                />
              </div>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Tous les cours</option>
                {myCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm rounded ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-[#0D529C] font-medium' : 'text-gray-600'
                  }`}
                >
                  Grille
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm rounded ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-[#0D529C] font-medium' : 'text-gray-600'
                  }`}
                >
                  Liste
                </button>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Documents Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(doc.type)}`}>
                      {getTypeIcon(doc.type)}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(doc.category)}`}>
                      {getCategoryLabel(doc.category)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{doc.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{doc.course}</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Taille:</span>
                      <span className="font-medium">{doc.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ajouté:</span>
                      <span className="font-medium">{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Téléchargements:</span>
                      <span className="font-medium">{doc.downloads}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Partagé:</span>
                      <button
                        onClick={() => toggleShare(doc.id)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          doc.shared_with_students ? 'bg-[#257035]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                          doc.shared_with_students ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#0D529C] transition-colors">
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#257035] transition-colors">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#C1272D] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Document</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cours</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Catégorie</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Taille</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Téléchargements</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Partagé</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${getTypeColor(doc.type)}`}>
                          {React.cloneElement(getTypeIcon(doc.type), { className: 'w-5 h-5' })}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{doc.course}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(doc.category)}`}>
                        {getCategoryLabel(doc.category)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600">{doc.size}</td>
                    <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">{doc.downloads}</td>
                    <td className="py-4 px-4 text-center">
                      {doc.shared_with_students ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[#257035]">
                          <CheckCircle className="w-4 h-4" />
                          Oui
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Non</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-[#0D529C] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-green-50 hover:text-[#257035] transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-red-50 hover:text-[#C1272D] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun document trouvé</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0D529C]">Ajouter un Document</h2>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nom du document</label>
                <input
                  type="text"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  placeholder="Ex: Introduction aux Hooks React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cours associé</label>
                <select
                  value={newDocument.course}
                  onChange={(e) => setNewDocument({ ...newDocument, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  <option value="">Sélectionner un cours</option>
                  {myCourses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Catégorie</label>
                <select
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fichier</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0D529C] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Cliquez ou glissez un fichier ici</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PPTX, XLSX, MP4 (Max 200MB)</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-600">Partager avec les étudiants</span>
                <button
                  onClick={() => setNewDocument({ ...newDocument, shared_with_students: !newDocument.shared_with_students })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    newDocument.shared_with_students ? 'bg-[#257035]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    newDocument.shared_with_students ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUpload}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700"
              >
                <Upload className="w-4 h-4" />
                Uploader
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessorLayout>
  );
}