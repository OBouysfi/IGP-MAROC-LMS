'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Calendar,
  FileText,
  UserX,
  FolderOpen,
  DollarSign,
  GraduationCap,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  User,
  Bell
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { adminProfileApi } from '@/lib/api/admin/profile';
import { ROUTES } from '@/lib/constants/routes';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { name: 'Programmes', icon: GraduationCap, path: '/admin/programs' },
  { name: 'Groupes', icon: Users, path: '/admin/groups' },
  { name: 'Étudiants', icon: Users, path: '/admin/students' },
  { name: 'Professeurs', icon: GraduationCap, path: '/admin/professors' },
  { name: 'Cours', icon: BookOpen, path: '/admin/courses' },
  { name: 'Planning', icon: Calendar, path: '/admin/schedule' },
  { name: 'Examens', icon: FileText, path: '/admin/exams' },
  { name: 'Absences', icon: UserX, path: '/admin/attendance' },
  { name: 'Validation Pointages', icon: CheckCircle, path: '/admin/professor-attendance' },
  { name: 'Documents', icon: FolderOpen, path: '/admin/documents' },
  { name: 'Paie', icon: DollarSign, path: '/admin/payroll' },
  // { name: 'Support', icon: MessageSquare, path: '/admin/support' },
  { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { name: 'Paramètres', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
  } | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await adminProfileApi.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push(ROUTES.ADMIN_LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      router.push(ROUTES.ADMIN_LOGIN);
    }
  };

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
              <p className="text-[11px] text-blue-200">Admin Portal</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                title={!isSidebarOpen ? item.name : undefined}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-[#094a87] text-white'
                    : 'text-white/80 hover:bg-[#094a87]/50 hover:text-white'
                } ${!isSidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium truncate">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-blue-700">
          <button
            onClick={handleLogout}
            title={!isSidebarOpen ? 'Déconnexion' : undefined}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-[#094a87]/50 hover:text-white transition-all duration-200 text-sm ${!isSidebarOpen ? 'justify-center' : ''}`}
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
                <p className="text-[11px] text-blue-200">Admin Portal</p>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      isActive
                        ? 'bg-[#094a87] text-white'
                        : 'text-white/80 hover:bg-[#094a87]/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-blue-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-[#094a87]/50 hover:text-white transition-all duration-200 text-sm"
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
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-9 h-9 bg-[#0D529C] rounded-full flex items-center justify-center overflow-hidden">
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
                    {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Super Admin
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        router.push('/admin/profile');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={18} />
                      Mon Profil
                    </button>
                    <button
                      onClick={() => {
                        router.push('/admin/settings');
                        setIsProfileDropdownOpen(false);
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
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}