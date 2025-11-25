'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Search, Filter, FolderOpen, File, Video, Image, X, Plus, Clock, CheckCircle, Loader2 } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';
import { professorDocumentsApi, Document, DocumentsStats, CourseOption } from '@/lib/api/professor/documents';
import Swal from 'sweetalert2';

export default function ProfessorDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentsStats | null>(null);
  const [myCourses, setMyCourses] = useState<CourseOption[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [newDocument, setNewDocument] = useState({
    name: '',
    course_id: 0,
    category: 'cours',
    shared_with_students: true,
  });

  const categories = [
    { value: 'cours', label: 'Support de Cours' },
    { value: 'tp', label: 'TP / Exercices' },
    { value: 'examen', label: 'Examen' },
    { value: 'correction', label: 'Correction' },
    { value: 'ressource', label: 'Ressource' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, filterCourse, filterCategory, filterType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [documentsRes, statsRes, coursesRes] = await Promise.all([
        professorDocumentsApi.getDocuments(),
        professorDocumentsApi.getStats(),
        professorDocumentsApi.getMyCourses(),
      ]);
      setDocuments(documentsRes.data.data);
      setStats(statsRes.data.data);
      setMyCourses(coursesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement des données',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const documentsRes = await professorDocumentsApi.getDocuments({ 
        search: searchTerm,
        course: filterCourse, 
        category: filterCategory,
        type: filterType
      });
      setDocuments(documentsRes.data.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!newDocument.name) {
        setNewDocument({ ...newDocument, name: e.target.files[0].name.split('.')[0] });
      }
    }
  };

  const handleUpload = async () => {
    if (!newDocument.name || !newDocument.course_id || !selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez remplir tous les champs obligatoires',
        confirmButtonColor: '#0D529C',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', newDocument.name);
      formData.append('course_id', newDocument.course_id.toString());
      formData.append('category', newDocument.category);
      formData.append('shared_with_students', newDocument.shared_with_students ? '1' : '0');
      formData.append('file', selectedFile);

      await professorDocumentsApi.uploadDocument(formData);

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Document uploadé avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });

      setShowUploadModal(false);
      setSelectedFile(null);
      setNewDocument({
        name: '',
        course_id: 0,
        category: 'cours',
        shared_with_students: true,
      });
      fetchData();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de l\'upload',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleShare = async (docId: number) => {
    try {
      await professorDocumentsApi.toggleShare(docId);
      fetchDocuments();
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Statut de partage modifié',
        confirmButtonColor: '#0D529C',
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la modification',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const deleteDocument = async (docId: number) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce document?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C1272D',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      await professorDocumentsApi.deleteDocument(docId);
      fetchData();
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Document supprimé avec succès',
        confirmButtonColor: '#0D529C',
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la suppression',
        confirmButtonColor: '#0D529C',
      });
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await professorDocumentsApi.downloadDocument(doc.id);
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Error downloading:', error);
    }
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

  if (loading) {
    return (
      <ProfessorLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D529C]" />
        </div>
      </ProfessorLayout>
    );
  }

  return (
    <ProfessorLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Mes Documents</h1>
          <p className="text-gray-500">Gérez vos supports de cours, TPs et ressources pédagogiques.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Documents</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats?.total_documents || 0}</p>
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
                <p className="text-xl font-bold text-purple-500">{stats?.total_size || '0 MB'}</p>
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
                <p className="text-xl font-bold text-[#257035]">{stats?.shared_documents || 0}</p>
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
                <p className="text-xl font-bold text-orange-500">{stats?.total_downloads || 0}</p>
              </div>
            </div>
          </div>
        </div>

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
                  <option key={course.id} value={course.name}>{course.name}</option>
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

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((doc) => (
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
                  <button 
                    onClick={() => doc.file_url && window.open(doc.file_url, '_blank')}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#0D529C] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#257035] transition-colors"
                  >
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
                {documents.map((doc) => (
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
                      <button 
                        onClick={() => doc.file_url && window.open(doc.file_url, '_blank')}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-[#0D529C] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-green-50 hover:text-[#257035] transition-colors"
                      >
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

        {documents.length === 0 && (
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Nom du document *</label>
                <input
                  type="text"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                  placeholder="Ex: Introduction aux Hooks React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cours associé *</label>
                <select
                  value={newDocument.course_id}
                  onChange={(e) => setNewDocument({ ...newDocument, course_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D529C] focus:border-transparent"
                >
                  <option value={0}>Sélectionner un cours</option>
                  {myCourses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Catégorie *</label>
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Fichier *</label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0D529C] transition-colors cursor-pointer block">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">
                    {selectedFile ? selectedFile.name : 'Cliquez ou glissez un fichier ici'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PPTX, XLSX, MP4 (Max 200MB)</p>
                </label>
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
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Uploader
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessorLayout>
  );
}