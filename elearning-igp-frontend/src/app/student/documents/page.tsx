// src/app/student/documents/page.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Download, Eye, Search, FolderOpen, File, Video, Image, Calendar, User, Filter } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';

interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'video' | 'image' | 'zip';
  size: string;
  course: string;
  course_code: string;
  professor: string;
  category: 'cours' | 'tp' | 'correction' | 'ressource';
  uploaded_at: string;
  downloads: number;
  is_new: boolean;
}

export default function StudentDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const documents: Document[] = [
    {
      id: 1,
      name: 'Introduction aux Hooks React',
      type: 'pdf',
      size: '2.5 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      category: 'cours',
      uploaded_at: '2024-11-15',
      downloads: 45,
      is_new: true,
    },
    {
      id: 2,
      name: 'TP - Context API et State Management',
      type: 'pdf',
      size: '1.8 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      category: 'tp',
      uploaded_at: '2024-11-14',
      downloads: 38,
      is_new: true,
    },
    {
      id: 3,
      name: 'Vidéo - Performance React',
      type: 'video',
      size: '150 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      category: 'ressource',
      uploaded_at: '2024-11-12',
      downloads: 22,
      is_new: false,
    },
    {
      id: 4,
      name: 'Correction Partiel React',
      type: 'pdf',
      size: '1.2 MB',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      category: 'correction',
      uploaded_at: '2024-11-10',
      downloads: 52,
      is_new: false,
    },
    {
      id: 5,
      name: 'Guide Express.js Complet',
      type: 'pdf',
      size: '3.1 MB',
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      category: 'cours',
      uploaded_at: '2024-11-08',
      downloads: 48,
      is_new: false,
    },
    {
      id: 6,
      name: 'TP - API REST avec JWT',
      type: 'docx',
      size: '900 KB',
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      category: 'tp',
      uploaded_at: '2024-11-13',
      downloads: 35,
      is_new: true,
    },
    {
      id: 7,
      name: 'Présentation MongoDB',
      type: 'pptx',
      size: '5.2 MB',
      course: 'Base de données NoSQL',
      course_code: 'DEV-NOSQL',
      professor: 'Karim Benjelloun',
      category: 'cours',
      uploaded_at: '2024-11-11',
      downloads: 18,
      is_new: false,
    },
    {
      id: 8,
      name: 'Exercices JavaScript ES6+',
      type: 'pdf',
      size: '1.5 MB',
      course: 'JavaScript Moderne',
      course_code: 'DEV-JS',
      professor: 'Karim Benjelloun',
      category: 'tp',
      uploaded_at: '2024-11-09',
      downloads: 42,
      is_new: false,
    },
    {
      id: 9,
      name: 'Docker - Guide Débutant',
      type: 'pdf',
      size: '2.8 MB',
      course: 'DevOps & CI/CD',
      course_code: 'DEV-OPS',
      professor: 'Hassan Alami',
      category: 'cours',
      uploaded_at: '2024-11-07',
      downloads: 25,
      is_new: false,
    },
    {
      id: 10,
      name: 'TP Docker Compose',
      type: 'pdf',
      size: '1.1 MB',
      course: 'DevOps & CI/CD',
      course_code: 'DEV-OPS',
      professor: 'Hassan Alami',
      category: 'tp',
      uploaded_at: '2024-11-14',
      downloads: 20,
      is_new: true,
    },
    {
      id: 11,
      name: 'Architecture Microservices - Slides',
      type: 'pptx',
      size: '4.5 MB',
      course: 'Architecture Microservices',
      course_code: 'DEV-MICRO',
      professor: 'Omar Tazi',
      category: 'cours',
      uploaded_at: '2024-11-06',
      downloads: 15,
      is_new: false,
    },
    {
      id: 12,
      name: 'Correction TP MongoDB',
      type: 'pdf',
      size: '800 KB',
      course: 'Base de données NoSQL',
      course_code: 'DEV-NOSQL',
      professor: 'Karim Benjelloun',
      category: 'correction',
      uploaded_at: '2024-11-05',
      downloads: 30,
      is_new: false,
    },
  ];

  const uniqueCourses = [...new Set(documents.map(d => d.course))];
  const categories = [
    { value: 'cours', label: 'Support de Cours' },
    { value: 'tp', label: 'TP / Exercices' },
    { value: 'correction', label: 'Correction' },
    { value: 'ressource', label: 'Ressource' },
  ];

  const stats = {
    total_documents: documents.length,
    new_documents: documents.filter(d => d.is_new).length,
    total_downloads: documents.reduce((sum, d) => sum + d.downloads, 0),
    courses_count: uniqueCourses.length,
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
      case 'correction': return 'bg-purple-500 text-white';
      case 'ressource': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cours': return 'Cours';
      case 'tp': return 'TP';
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

  const downloadDocument = (docId: number) => {
    alert('Téléchargement démarré!');
  };

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Mes Documents</h1>
          <p className="text-gray-500">Accédez aux supports de cours, TPs et ressources partagés par vos professeurs.</p>
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
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Nouveaux</p>
                <p className="text-xl font-bold text-[#257035]">{stats.new_documents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Téléchargements</p>
                <p className="text-xl font-bold text-purple-500">{stats.total_downloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Matières</p>
                <p className="text-xl font-bold text-orange-500">{stats.courses_count}</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Documents Alert */}
        {stats.new_documents > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#257035] rounded-full animate-pulse"></div>
              <span className="font-medium text-[#257035]">
                {stats.new_documents} nouveau(x) document(s) ajouté(s) récemment
              </span>
            </div>
          </div>
        )}

        {/* Filters */}
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
                />
              </div>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
              >
                <option value="">Toutes les matières</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-[#257035] font-medium' : 'text-gray-600'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-[#257035] font-medium' : 'text-gray-600'
                }`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>

        {/* Documents Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
                {doc.is_new && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#257035] text-white animate-pulse">
                      Nouveau
                    </span>
                  </div>
                )}
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
                  <p className="text-sm text-[#257035] font-medium mb-1">{doc.course}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <User className="w-3 h-3" />
                    <span>{doc.professor}</span>
                  </div>
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
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#0D529C] transition-colors">
                    <Eye className="w-4 h-4" />
                    Aperçu
                  </button>
                  <button
                    onClick={() => downloadDocument(doc.id)}
                    className="flex items-center gap-1 text-sm text-white bg-[#257035] px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Matière</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Professeur</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Catégorie</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Taille</th>
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                            {doc.is_new && (
                              <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded bg-[#257035] text-white">
                                Nouveau
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{doc.course}</p>
                      <p className="text-xs text-gray-500">{doc.course_code}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{doc.professor}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(doc.category)}`}>
                        {getCategoryLabel(doc.category)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600">{doc.size}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-[#0D529C] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadDocument(doc.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white bg-[#257035] hover:bg-green-700 transition-colors ml-2"
                      >
                        <Download className="w-4 h-4" />
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
    </StudentLayout>
  );
}