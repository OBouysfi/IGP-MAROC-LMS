'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  Video,
  Calendar,
  FileText,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
  FolderOpen
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'Mes Cours', icon: BookOpen, path: '/student/courses' },
    { name: 'Mes Notes', icon: ClipboardList, path: '/student/grades' },
    { name: 'Sessions Live', icon: Video, path: '/student/sessions' },
    { name: 'Emploi du Temps', icon: Calendar, path: '/student/schedule' },
    { name: 'Mes Documents', icon: FolderOpen, path: '/student/documents' },
    { name: 'Ressources', icon: FileText, path: '/student/resources' },
  ];

  const notifications = [
    { id: 1, message: 'Nouvelle note disponible en React.js', time: 'Il y a 30 min', read: false },
    { id: 2, message: 'Session live dans 1 heure - Node.js', time: 'Il y a 1h', read: false },
    { id: 3, message: 'Document ajouté par Prof. Benjelloun', time: 'Il y a 3h', read: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#257035] text-white transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-4 border-b border-green-600">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#257035] font-bold text-lg">IGP</span>
                </div>
                <div>
                  <h1 className="font-bold text-lg">IGP Maroc</h1>
                  <p className="text-xs text-green-200">Espace Étudiant</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto">
                <span className="text-[#257035] font-bold text-lg">IGP</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#257035] shadow-lg'
                    : 'text-green-100 hover:bg-green-600'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-600">
          <Link
            href="/student/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Paramètres</span>}
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-red-600 transition-colors w-full mt-2">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {menuItems.find(item => item.path === pathname)?.name || 'Espace Étudiant'}
                </h2>
                <p className="text-sm text-gray-500">Bienvenue, Ahmed Benali</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C1272D] text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                            !notif.read ? 'bg-green-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center">
                      <button className="text-sm text-[#257035] hover:underline">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-[#257035] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-800">Ahmed Benali</p>
                    <p className="text-xs text-gray-500">DEV-M2-A</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <Link
                      href="/student/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Mon Profil
                    </Link>
                    <Link
                      href="/student/settings"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Paramètres
                    </Link>
                    <hr className="my-1" />
                    <button className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full">
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>

      {/* Click outside to close menus */}
      {(showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
}