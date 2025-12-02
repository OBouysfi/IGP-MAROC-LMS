'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Search, FolderOpen, File, Video, Image, Calendar, User } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';
import { studentDocumentsApi, StudentDocument } from '@/lib/api/student/documents';
import Swal from 'sweetalert2';

export default function StudentDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await studentDocumentsApi.getAll();
      setDocuments(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les documents',
        confirmButtonColor: '#C1272D',
      });
    } finally {
      setLoading(false);
    }
  };

const downloadDocument = async (docId: number, docName: string) => {
  try {
    const blob = await studentDocumentsApi.download(docId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    Swal.fire({
      icon: 'success',
      title: 'Téléchargement réussi',
      text: 'Le document a été téléchargé',
      timer: 2000,
      showConfirmButton: false,
    });
    
    fetchDocuments();
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Impossible de télécharger le document';
    Swal.fire({
      icon: 'error',
      title: 'Fichier introuvable',
      text: errorMessage,
      confirmButtonColor: '#C1272D',
    });
  }
};

  const uniqueCourses = [...new Set(documents.map(d => d.course))];
  const categories = [
    { value: 'cours', label: 'Support de Cours' },
    { value: 'tp', label: 'TP / Exercices' },
    { value: 'correction', label: 'Correction' },
    { value: 'ressource', label: 'Ressource' },
    { value: 'examen', label: 'Examen' },
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
      case 'examen': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cours': return 'Cours';
      case 'tp': return 'TP';
      case 'correction': return 'Correction';
      case 'ressource': return 'Ressource';
      case 'examen': return 'Examen';
      default: return category;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (searchTerm && !doc.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterCourse && doc.course !== filterCourse) return false;
    if (filterCategory && doc.category !== filterCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#257035]"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Mes Documents</h1>
          <p className="text-gray-500">Accédez aux supports de cours, TPs et ressources partagés par vos professeurs.</p>
        </div>

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
                  <button
                    onClick={() => downloadDocument(doc.id, doc.name)}
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
                      <button
                        onClick={() => downloadDocument(doc.id, doc.name)}
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