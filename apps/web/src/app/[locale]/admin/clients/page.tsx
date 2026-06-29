'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchClients = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/clients`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else if (response.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter.');
        window.location.href = '/fr/auth/login';
      } else {
        toast.error('Erreur lors du chargement des clients');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Gestion des Clients</h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Consultez la liste de vos clients et leurs réservations</p>
        </div>

        <Card className="bg-[#111111] border border-white/5 shadow-none overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg flex items-center text-white font-serif">
              Tous les Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />)}
              </div>
            ) : clients.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Aucun client trouvé.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {clients.map((client) => (
                  <div key={client.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                    
                    {/* Info */}
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-[#C9A84C]" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {client.name || client.email.split('@')[0]}
                        </h3>
                        <div className="flex flex-col gap-1 text-sm text-gray-400">
                          <span className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#C9A84C]" /> {client.email}</span>
                          <span className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#C9A84C]" /> {client.phone || 'Non renseigné'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-2 min-w-[200px] text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C9A84C]" />
                        <span>Inscrit le {format(new Date(client.createdAt), 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <span className="text-white font-medium">{client.reservations?.length || 0}</span> réservations
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
