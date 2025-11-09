'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { ROUTES } from '@/lib/constants/routes';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
  { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#0D529C] text-white">
        
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-blue-700">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image 
            src="/images/logo_igp.png"
            alt="IGP Logo"
            fill
            className="object-contain p-1"
            priority
            />
        </div>
        <div>
            <h1 className="font-bold text-lg">IGP Maroc</h1>
            <p className="text-xs text-blue-200">Admin Portal</p>
        </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#094a87] text-white shadow-md'
                    : 'text-white/80 hover:bg-[#094a87]/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-[#094a87]/50 hover:text-white transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0D529C] text-white rounded-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Mobile */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#0D529C] text-white z-50 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b border-blue-700">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#0D529C]" />
              </div>
              <div>
                <h1 className="font-bold text-lg">University LMS</h1>
                <p className="text-xs text-blue-200">Admin Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#094a87] text-white shadow-md'
                        : 'text-white/80 hover:bg-[#094a87]/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-blue-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-[#094a87]/50 hover:text-white transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}