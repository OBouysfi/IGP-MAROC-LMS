'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { studentSettingsApi } from '@/lib/api/student/settings';
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    student?: {
      student_code?: string;
      group?: {
        name?: string;
      };
    };
  } | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await studentSettingsApi.getProfile();
      setUserProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const menuItems = [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'Mes Cours', icon: BookOpen, path: '/student/courses' },
    { name: 'Mes Notes', icon: ClipboardList, path: '/student/grades' },
    { name: 'Sessions Live', icon: Video, path: '/student/sessions' },
    { name: 'Emploi du Temps', icon: Calendar, path: '/student/schedule' },
    { name: 'Mes Documents', icon: FolderOpen, path: '/student/documents' },
    { name: 'Ressources', icon: FileText, path: '/student/resources' },
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
    { id: 1, message: 'Nouvelle note disponible en React.js', time: 'Il y a 30 min', read: false },
    { id: 2, message: 'Session live dans 1 heure - Node.js', time: 'Il y a 1h', read: false },
    { id: 3, message: 'Document ajouté par Prof. Benjelloun', time: 'Il y a 3h', read: true },
  ];

  const displayName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Étudiant';
  const displayGroup = userProfile?.student?.group?.name || '';

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#257035] text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-green-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
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
                <div>
                  <h1 className="font-bold text-lg">IGP Maroc</h1>
                  <p className="text-xs text-green-200">Espace Étudiant</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto relative overflow-hidden flex-shrink-0">
                <Image 
                  src="/images/logo_igp.png"
                  alt="IGP Logo"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  priority
                />
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
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

        <div className="p-4 border-t border-green-600 flex-shrink-0">
          <Link
            href="/student/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Paramètres</span>}
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-red-600 transition-colors w-full mt-2"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-9 h-9 bg-[#257035] rounded-full flex items-center justify-center overflow-hidden">
                    {userProfile?.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} className="text-white" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {displayGroup}
                    </p>
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
                      <button
                        onClick={() => {
                          router.push('/student/profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={18} />
                        Mon Profil
                      </button>
                      <button
                        onClick={() => {
                          router.push('/student/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings size={18} />
                        Paramètres
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut size={18} />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

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