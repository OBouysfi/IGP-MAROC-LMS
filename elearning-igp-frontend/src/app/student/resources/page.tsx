// src/app/student/resources/page.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Search, BookOpen, Video, Link2, Globe, Star, Clock, Filter, Play } from 'lucide-react';
import StudentLayout from '@/components/layouts/StudentLayout';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'video' | 'tutorial' | 'documentation' | 'tool' | 'book';
  course: string;
  course_code: string;
  professor: string;
  url: string;
  is_external: boolean;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  duration: string;
  rating: number;
  views: number;
  added_at: string;
  tags: string[];
}

export default function StudentResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  const resources: Resource[] = [
    {
      id: 1,
      title: 'React Documentation Officielle',
      description: 'Documentation complète et officielle de React. Inclut les guides, tutoriels et références API.',
      type: 'documentation',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      url: 'https://react.dev',
      is_external: true,
      difficulty: 'intermédiaire',
      duration: '-',
      rating: 5,
      views: 156,
      added_at: '2024-11-01',
      tags: ['React', 'Documentation', 'Officiel'],
    },
    {
      id: 2,
      title: 'Tutoriel Hooks Personnalisés',
      description: 'Apprenez à créer vos propres hooks React pour réutiliser la logique entre composants.',
      type: 'tutorial',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      url: 'https://youtube.com/watch?v=example',
      is_external: true,
      difficulty: 'avancé',
      duration: '45 min',
      rating: 4.8,
      views: 89,
      added_at: '2024-11-10',
      tags: ['React', 'Hooks', 'Custom Hooks'],
    },
    {
      id: 3,
      title: 'Express.js - Guide de Démarrage',
      description: 'Guide complet pour démarrer avec Express.js. Configuration, routing et middlewares.',
      type: 'article',
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      url: 'https://expressjs.com/guide',
      is_external: true,
      difficulty: 'débutant',
      duration: '20 min',
      rating: 4.5,
      views: 124,
      added_at: '2024-11-05',
      tags: ['Express', 'Node.js', 'Backend'],
    },
    {
      id: 4,
      title: 'MongoDB University - Cours Gratuit',
      description: 'Formation gratuite MongoDB par les créateurs. Certification incluse.',
      type: 'tutorial',
      course: 'Base de données NoSQL',
      course_code: 'DEV-NOSQL',
      professor: 'Karim Benjelloun',
      url: 'https://university.mongodb.com',
      is_external: true,
      difficulty: 'intermédiaire',
      duration: '10h',
      rating: 4.9,
      views: 78,
      added_at: '2024-11-08',
      tags: ['MongoDB', 'NoSQL', 'Certification'],
    },
    {
      id: 5,
      title: 'JavaScript.info - Le Tutorial Moderne',
      description: 'Le guide le plus complet sur JavaScript moderne. ES6+, async/await, et plus.',
      type: 'book',
      course: 'JavaScript Moderne',
      course_code: 'DEV-JS',
      professor: 'Karim Benjelloun',
      url: 'https://javascript.info',
      is_external: true,
      difficulty: 'débutant',
      duration: '-',
      rating: 5,
      views: 203,
      added_at: '2024-10-28',
      tags: ['JavaScript', 'ES6', 'Tutorial'],
    },
    {
      id: 6,
      title: 'Docker - Vidéo Introduction',
      description: 'Introduction complète à Docker : images, containers, volumes et networking.',
      type: 'video',
      course: 'DevOps & CI/CD',
      course_code: 'DEV-OPS',
      professor: 'Hassan Alami',
      url: 'https://youtube.com/watch?v=docker',
      is_external: true,
      difficulty: 'débutant',
      duration: '1h30',
      rating: 4.7,
      views: 95,
      added_at: '2024-11-12',
      tags: ['Docker', 'DevOps', 'Containers'],
    },
    {
      id: 7,
      title: 'Postman - Outil de Test API',
      description: 'Outil gratuit pour tester vos APIs REST. Indispensable pour le développement backend.',
      type: 'tool',
      course: 'Node.js & Express',
      course_code: 'DEV-NODE',
      professor: 'Karim Benjelloun',
      url: 'https://postman.com',
      is_external: true,
      difficulty: 'débutant',
      duration: '-',
      rating: 4.8,
      views: 167,
      added_at: '2024-11-03',
      tags: ['API', 'Testing', 'Outil'],
    },
    {
      id: 8,
      title: 'Redux Toolkit - Guide Officiel',
      description: 'La façon moderne de faire du Redux. Simplifiez votre state management.',
      type: 'documentation',
      course: 'React.js Avancé',
      course_code: 'DEV-REACT',
      professor: 'Karim Benjelloun',
      url: 'https://redux-toolkit.js.org',
      is_external: true,
      difficulty: 'avancé',
      duration: '-',
      rating: 4.6,
      views: 112,
      added_at: '2024-11-14',
      tags: ['Redux', 'State Management', 'React'],
    },
    {
      id: 9,
      title: 'GitHub Actions - CI/CD Automatisé',
      description: 'Automatisez vos workflows de développement avec GitHub Actions.',
      type: 'article',
      course: 'DevOps & CI/CD',
      course_code: 'DEV-OPS',
      professor: 'Hassan Alami',
      url: 'https://docs.github.com/actions',
      is_external: true,
      difficulty: 'intermédiaire',
      duration: '30 min',
      rating: 4.5,
      views: 68,
      added_at: '2024-11-11',
      tags: ['GitHub', 'CI/CD', 'Automation'],
    },
    {
      id: 10,
      title: 'Microservices Patterns',
      description: 'Les patterns essentiels pour architecturer des applications microservices.',
      type: 'book',
      course: 'Architecture Microservices',
      course_code: 'DEV-MICRO',
      professor: 'Omar Tazi',
      url: 'https://microservices.io/patterns',
      is_external: true,
      difficulty: 'avancé',
      duration: '-',
      rating: 4.9,
      views: 54,
      added_at: '2024-11-09',
      tags: ['Microservices', 'Architecture', 'Patterns'],
    },
  ];

  const uniqueCourses = [...new Set(resources.map(r => r.course))];
  const resourceTypes = [
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Vidéo' },
    { value: 'tutorial', label: 'Tutoriel' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'tool', label: 'Outil' },
    { value: 'book', label: 'Livre/Guide' },
  ];

  const stats = {
    total_resources: resources.length,
    videos: resources.filter(r => r.type === 'video').length,
    tutorials: resources.filter(r => r.type === 'tutorial').length,
    total_views: resources.reduce((sum, r) => sum + r.views, 0),
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'video': return <Video className="w-6 h-6 text-red-500" />;
      case 'tutorial': return <Play className="w-6 h-6 text-purple-500" />;
      case 'documentation': return <BookOpen className="w-6 h-6 text-green-500" />;
      case 'tool': return <Link2 className="w-6 h-6 text-orange-500" />;
      case 'book': return <BookOpen className="w-6 h-6 text-yellow-600" />;
      default: return <Globe className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'video': return 'bg-red-50 text-red-600 border-red-200';
      case 'tutorial': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'documentation': return 'bg-green-50 text-green-600 border-green-200';
      case 'tool': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'book': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Article';
      case 'video': return 'Vidéo';
      case 'tutorial': return 'Tutoriel';
      case 'documentation': return 'Documentation';
      case 'tool': return 'Outil';
      case 'book': return 'Livre/Guide';
      default: return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-100 text-green-700';
      case 'intermédiaire': return 'bg-orange-100 text-orange-700';
      case 'avancé': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const filteredResources = resources.filter(resource => {
    if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) && !resource.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterCourse && resource.course !== filterCourse) return false;
    if (filterType && resource.type !== filterType) return false;
    if (filterDifficulty && resource.difficulty !== filterDifficulty) return false;
    return true;
  });

  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <StudentLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#257035] mb-2">Ressources Pédagogiques</h1>
          <p className="text-gray-500">Explorez les ressources complémentaires recommandées par vos professeurs.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#0D529C]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Ressources</p>
                <p className="text-xl font-bold text-[#0D529C]">{stats.total_resources}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Vidéos</p>
                <p className="text-xl font-bold text-red-500">{stats.videos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tutoriels</p>
                <p className="text-xl font-bold text-purple-500">{stats.tutorials}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-[#257035]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Vues</p>
                <p className="text-xl font-bold text-[#257035]">{stats.total_views}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une ressource..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
            >
              <option value="">Tous les types</option>
              {resourceTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#257035] focus:border-transparent"
            >
              <option value="">Tous les niveaux</option>
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`p-4 border-b ${getTypeColor(resource.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(resource.type)}
                    <span className="font-medium text-sm">{getTypeLabel(resource.type)}</span>
                  </div>
                  {resource.is_external && (
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-bold text-gray-900 line-clamp-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-[#257035]">{resource.course}</p>
                  <p className="text-xs text-gray-500">Par {resource.professor}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                  {resource.duration !== '-' && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{resource.duration}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderStars(resource.rating)}
                    <span className="text-xs text-gray-500 ml-1">({resource.rating})</span>
                  </div>
                  <span className="text-xs text-gray-500">{resource.views} vues</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="inline-flex px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => openResource(resource.url)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#257035] text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Accéder à la ressource
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune ressource trouvée</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}