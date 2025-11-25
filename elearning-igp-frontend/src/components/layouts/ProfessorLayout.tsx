// src/components/layouts/ProfessorLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardList, 
  Video,
  Calendar,
  FileText,
  Bell,
  Menu,
  X,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';

interface ProfessorLayoutProps {
  children: React.ReactNode;
}

export default function ProfessorLayout({ children }: ProfessorLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/professor/dashboard' },
    { name: 'Mes Cours', icon: BookOpen, path: '/professor/courses' },
    { name: 'Mes Étudiants', icon: Users, path: '/professor/students' },
    { name: 'Saisie des Notes', icon: ClipboardList, path: '/professor/grades' },
    { name: 'Sessions Live', icon: Video, path: '/professor/sessions' },
    { name: 'Emploi du Temps', icon: Calendar, path: '/professor/schedule' },
    { name: 'Mes Documents', icon: FileText, path: '/professor/documents' },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const notifications = [
    { id: 1, message: 'Nouvelle session planifiée pour React.js', time: 'Il y a 10 min', read: false },
    { id: 2, message: '5 étudiants ont soumis leurs devoirs', time: 'Il y a 1h', read: false },
    { id: 3, message: 'Rappel: Saisie des notes avant le 20/11', time: 'Il y a 3h', read: true },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex lg:flex-col bg-[#0D529C] text-white transition-all duration-300 ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}>
        <div className={`flex items-center gap-3 p-5 border-b border-blue-700 ${!isSidebarOpen ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0">
            <Image 
              src="/images/logo_igp.png"
              alt="IGP Logo"
              fill
              sizes="40px"
              className="object-contain p-1"
              priority
            />
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="font-bold text-base">IGP Maroc</h1>
              <p className="text-[11px] text-blue-200">Espace Professeur</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                title={!isSidebarOpen ? item.name : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-white text-[#0D529C] shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700'
                } ${!isSidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-blue-700 space-y-1.5">
          <Link
            href="/professor/settings"
            title={!isSidebarOpen ? 'Paramètres' : undefined}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 hover:bg-blue-700 transition-all duration-200 text-sm ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Paramètres</span>}
          </Link>
          <button 
            onClick={handleLogout}
            title={!isSidebarOpen ? 'Déconnexion' : undefined}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 hover:bg-red-600 transition-all duration-200 text-sm ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#0D529C] text-white z-50 flex flex-col">
            <div className="flex items-center gap-3 p-5 border-b border-blue-700">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                <Image 
                  src="/images/logo_igp.png"
                  alt="IGP Logo"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <h1 className="font-bold text-base">IGP Maroc</h1>
                <p className="text-[11px] text-blue-200">Espace Professeur</p>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      isActive
                        ? 'bg-white text-[#0D529C] shadow-lg'
                        : 'text-blue-100 hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-blue-700 space-y-1.5">
              <Link
                href="/professor/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 hover:bg-blue-700 transition-all duration-200 text-sm"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Paramètres</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-blue-100 hover:bg-red-600 transition-all duration-200 text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:block">
              <h2 className="text-xl font-bold text-gray-800">
                {menuItems.find(item => item.path === pathname)?.name || 'Espace Professeur'}
              </h2>
              <p className="text-sm text-gray-500">Bienvenue, Prof. Karim Benjelloun</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#C1272D] rounded-full"></span>
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                            !notif.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center">
                      <button className="text-sm text-[#0D529C] hover:underline">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-9 h-9 bg-[#0D529C] rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Karim Benjelloun</p>
                  <p className="text-xs text-gray-500">Professeur</p>
                </div>
                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <Link
                      href="/professor/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={18} />
                      Mon Profil
                    </Link>
                    <Link
                      href="/professor/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={18} />
                      Paramètres
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100 w-full"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}