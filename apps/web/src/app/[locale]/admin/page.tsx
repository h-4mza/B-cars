'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Car, 
  Users, 
  CalendarCheck, 
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/stats`, {
          credentials: 'include'
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { 
      label: 'Chiffre d\'affaires', 
      value: `${stats?.totalRevenue || 0} MAD`, 
      icon: TrendingUp, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+12.5%',
      trendUp: true
    },
    { 
      label: 'Réservations Actives', 
      value: stats?.activeReservations || 0, 
      icon: CalendarCheck, 
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+4.2%',
      trendUp: true
    },
    { 
      label: 'Véhicules Disponibles', 
      value: `${stats?.availableVehicles || 0}/${stats?.totalVehicles || 0}`, 
      icon: Car, 
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: '-2',
      trendUp: false
    },
    { 
      label: 'Total Clients', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: '+18',
      trendUp: true
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Dashboard</h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Operational Control Center</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl bg-white/5" />)
          ) : (
            cards.map((card) => (
              <Card key={card.label} className="bg-[#111111] border border-white/5 shadow-none overflow-hidden group hover:border-[#C9A84C]/30 transition-all duration-500 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#C9A84C]/10 transition-colors" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-3 rounded-lg border", card.bg === 'bg-emerald-50' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-500' : card.bg === 'bg-blue-50' ? 'bg-blue-950/30 border-blue-900/50 text-blue-500' : card.bg === 'bg-orange-50' ? 'bg-orange-950/30 border-orange-900/50 text-orange-500' : 'bg-purple-950/30 border-purple-900/50 text-purple-500')}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div className={cn(
                      "flex items-center text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider",
                      card.trendUp ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                      {card.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {card.trend}
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{card.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#111111] border border-white/5 shadow-none">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg flex items-center justify-between text-white font-serif">
                Monthly Performance
                <Button variant="ghost" size="sm" className="text-[#C9A84C] hover:bg-[#C9A84C]/10 text-xs tracking-wider uppercase">View Details</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-64 flex items-center justify-center bg-[#0a0a0a] rounded-lg border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <p className="text-gray-600 italic text-sm relative z-10">Analytics Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#C9A84C]/20 shadow-[0_0_30px_rgba(201,168,76,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-3xl" />
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg flex items-center text-white font-serif">
                <AlertTriangle className="h-5 w-5 mr-3 text-[#C9A84C]" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 relative z-10">
              <div className="p-4 rounded-md bg-white/5 border border-white/5 hover:border-[#C9A84C]/30 transition-colors">
                <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest mb-1">Maintenance</p>
                <p className="text-sm text-gray-300">3 vehicles require immediate servicing.</p>
              </div>
              <div className="p-4 rounded-md bg-white/5 border border-white/5 hover:border-[#C9A84C]/30 transition-colors">
                <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest mb-1">Documents</p>
                <p className="text-sm text-gray-300">12 new documents pending validation.</p>
              </div>
              <Button className="w-full mt-2 bg-[#C9A84C] hover:bg-[#F5D078] text-[#0a0a0a] font-bold tracking-wide transition-all duration-300 rounded-sm">
                Take Action
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
