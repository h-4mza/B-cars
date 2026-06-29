'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Calendar, 
  Users, 
  LogOut, 
  LayoutDashboard, 
  FileCheck,
  Menu,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'AGENT')) {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, user, router, isMounted]);

  if (!isMounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/logout`, {
        method: 'POST',
      });
      logout();
      router.push('/auth/login');
    } catch (error) {
      logout();
      router.push('/auth/login');
    }
  };

  const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/admin' },
    { label: 'Gestion Flotte', icon: Car, href: '/admin/vehicles' },
    { label: 'Réservations', icon: Calendar, href: '/admin/reservations' },
    { label: 'Validation Docs', icon: FileCheck, href: '/admin/documents' },
    { label: 'Clients', icon: Users, href: '/admin/clients' },
  ];

  if (!user || (user.role !== 'ADMIN' && user.role !== 'AGENT')) return null;

  return (
    <div className="flex h-screen bg-[#0a0a0a] font-sans selection:bg-[#C9A84C]/30 text-white">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform bg-[#111111] border-r border-white/5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#C9A84C]/5 to-transparent pointer-events-none" />
          <ShieldAlert className="h-8 w-8 text-[#C9A84C] mr-3 relative z-10" />
          <span className="text-xl font-serif font-bold tracking-widest text-white relative z-10">
            ADMIN
          </span>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                  isActive 
                    ? "bg-[#C9A84C] text-[#0a0a0a] shadow-[0_0_15px_rgba(201,168,76,0.2)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 relative z-10 transition-transform group-hover:scale-110", isActive ? "text-[#0a0a0a]" : "text-gray-500")} />
                <span className="relative z-10">{item.label}</span>
                {isActive && <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-white/5 p-6 bg-[#111111]">
          <div className="mb-6 flex items-center space-x-3 px-2">
            <div className="h-10 w-10 rounded-full bg-[#0a0a0a] border border-[#C9A84C]/30 flex items-center justify-center font-bold text-[#C9A84C]">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.email}</p>
              <p className="text-[10px] text-[#C9A84C] uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start space-x-3 text-gray-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-md transition-all"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-8 relative z-10">
          <button 
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-white/5 transition-colors" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-gray-400" />
          </button>

          <div className="flex items-center space-x-3 text-gray-400 text-sm hidden sm:flex">
            <BarChart3 className="h-5 w-5 text-[#C9A84C]" />
            <span className="font-medium tracking-wide uppercase text-xs">Real-time Overview</span>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-[#C9A84C]/50 text-[#C9A84C] bg-[#C9A84C]/10 px-4 py-1.5 rounded-sm font-bold tracking-widest uppercase text-[10px]">
              PROD ENV
            </Badge>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </main>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
}
