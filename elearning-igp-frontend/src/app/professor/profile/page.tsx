// src/app/professor/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, Calendar, MapPin, Award, BookOpen, Users, Camera, Edit2, Loader2 } from 'lucide-react';
import ProfessorLayout from '@/components/layouts/ProfessorLayout';
import { professorSettingsApi, ProfileData } from '@/lib/api/professor/settings';
import Swal from 'sweetalert2';

export default function ProfessorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    bio: '',
    linkedin: '',
    github: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await professorSettingsApi.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors du chargement du profil',
        confirmButtonColor: '#0D529C',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await professorSettingsApi.uploadAvatar(file);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Photo de profil mise à jour',
          confirmButtonColor: '#0D529C',
          timer: 2000,
        });
        fetchProfile();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.response?.data?.message || 'Erreur lors de l\'upload',
          confirmButtonColor: '#0D529C',
        });
      }
    }
  };

  const getInitials = () => {
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
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
          <h1 className="text-3xl font-bold text-[#0D529C] mb-2">Mon Profil</h1>
          <p className="text-gray-500">Consultez vos informations personnelles et professionnelles.</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-[#0D529C] to-blue-600 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center text-[#0D529C] text-4xl font-bold">
                    {getInitials()}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#257035] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors shadow-lg">
                  <Camera className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-blue-100 text-lg mb-4">{profile.specialization || 'Professeur'}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm">
                    <Briefcase className="w-4 h-4" />
                    {profile.department || 'Département'}
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/professor/settings'}
                className="flex items-center gap-2 px-6 py-3 bg-white text-[#0D529C] rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
              >
                <Edit2 className="w-4 h-4" />
                Modifier le Profil
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-[#0D529C] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                À Propos
              </h3>
              {profile.bio ? (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-gray-400 italic">Aucune biographie ajoutée</p>
              )}
            </div>

            {/* Professional Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-[#0D529C] mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Informations Professionnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#0D529C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Spécialisation</p>
                    <p className="font-semibold text-gray-900">{profile.specialization || 'Non spécifié'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Département</p>
                    <p className="font-semibold text-gray-900">{profile.department || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-[#0D529C] mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Coordonnées
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#0D529C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#257035]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(profile.linkedin || profile.github) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-[#0D529C] mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Réseaux Professionnels
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#0D529C] mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/professor/courses'}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#0D529C]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mes Cours</p>
                    <p className="text-xs text-gray-500">Gérer mes cours</p>
                  </div>
                </button>
                <button
                  onClick={() => window.location.href = '/professor/students'}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#257035]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mes Étudiants</p>
                    <p className="text-xs text-gray-500">Voir les étudiants</p>
                  </div>
                </button>
                <button
                  onClick={() => window.location.href = '/professor/schedule'}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Emploi du Temps</p>
                    <p className="text-xs text-gray-500">Consulter mon planning</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-[#0D529C] mb-4">Informations du Compte</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statut</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Actif
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rôle</span>
                  <span className="text-sm font-medium text-gray-900">Professeur</span>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-bold text-orange-700 mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contactez l'administration pour toute question ou assistance.
              </p>
              <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                Contacter le Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProfessorLayout>
  );
}