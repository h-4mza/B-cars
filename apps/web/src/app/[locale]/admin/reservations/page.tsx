'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Clock, Car, Eye, Phone, Mail, MapPin, CreditCard, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const { user } = useAuthStore();

  const fetchReservations = async () => {
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/admin/reservations`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter.');
        window.location.href = '/fr/auth/login';
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch reservations:', errorText);
        toast.error('Erreur de chargement des réservations: ' + response.status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/reservations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success(`Statut mis à jour vers ${newStatus}`);
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</span>;
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmé</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><XCircle className="w-3 h-3" /> Annulé</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/10 text-gray-500 border border-gray-500/20 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Gestion des Réservations</h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Traitez et validez les réservations des clients</p>
        </div>

        <Card className="bg-[#111111] border border-white/5 shadow-none overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg flex items-center text-white font-serif">
              Toutes les Réservations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />)}
              </div>
            ) : reservations.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Aucune réservation trouvée.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors">
                    
                    {/* Client & Car info */}
                    <div className="flex items-start gap-6">
                      <div className="h-16 w-16 bg-[#0a0a0a] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                        {(() => {
                          try {
                            const imgs = reservation.vehicle?.images ? JSON.parse(reservation.vehicle.images) : [];
                            if (imgs && imgs.length > 0) {
                              return <img src={imgs[0]} alt="Car" className="h-full w-full object-cover" />;
                            }
                          } catch (e) {}
                          return <Car className="h-8 w-8 text-gray-600" />;
                        })()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-white">
                            {reservation.vehicle?.brand} {reservation.vehicle?.model}
                          </h3>
                          {getStatusBadge(reservation.status)}
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                          Client: <span className="text-gray-300">{reservation.user?.name || reservation.user?.email}</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Ref: {reservation.id.slice(0,8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Dates & Price */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Du:</span>
                        <span className="text-white font-medium">{format(new Date(reservation.startDate), 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Au:</span>
                        <span className="text-white font-medium">{format(new Date(reservation.endDate), 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-white/10">
                        <span className="text-gray-500">Total:</span>
                        <span className="text-[#C9A84C] font-bold">{reservation.totalPrice} MAD</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Button 
                        onClick={() => setSelectedReservation(reservation)}
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold tracking-wider text-xs px-6 transition-all"
                      >
                        <Eye className="w-4 h-4 mr-2 text-[#C9A84C]" />
                        Détails
                      </Button>
                      {reservation.status === 'PENDING' && (
                        <>
                          <Button 
                            onClick={() => handleUpdateStatus(reservation.id, 'CONFIRMED')}
                            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-emerald-950 border border-emerald-500/30 font-bold tracking-wider text-xs px-6 transition-all"
                          >
                            Accepter
                          </Button>
                          <Button 
                            onClick={() => handleUpdateStatus(reservation.id, 'CANCELLED')}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-red-950 border border-red-500/30 font-bold tracking-wider text-xs px-6 transition-all"
                          >
                            Refuser
                          </Button>
                        </>
                      )}
                      
                      {reservation.status === 'CONFIRMED' && (
                        <Button 
                          onClick={() => handleUpdateStatus(reservation.id, 'COMPLETED')}
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-blue-950 border border-blue-500/30 font-bold tracking-wider text-xs px-6 transition-all"
                        >
                          Terminer
                        </Button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
        <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-[600px] font-sans">
          <DialogHeader className="border-b border-white/5 pb-4">
            <DialogTitle className="text-xl font-serif text-white flex items-center justify-between">
              Détails de la réservation
              {selectedReservation && getStatusBadge(selectedReservation.status)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {/* Client Info */}
              <div className="space-y-4">
                <h4 className="text-[#C9A84C] text-sm font-bold uppercase tracking-wider mb-2 flex items-center border-b border-white/5 pb-2">
                  <User className="w-4 h-4 mr-2" /> Informations Client
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-gray-300 flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Nom Complet</span>
                    <span className="font-medium">{selectedReservation.user?.name || selectedReservation.user?.email.split('@')[0]}</span>
                  </p>
                  <p className="text-sm text-gray-300 flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Email</span>
                    <span className="font-medium flex items-center"><Mail className="w-3 h-3 mr-2 text-[#C9A84C]" />{selectedReservation.user?.email}</span>
                  </p>
                  <p className="text-sm text-gray-300 flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Téléphone</span>
                    <span className="font-medium flex items-center"><Phone className="w-3 h-3 mr-2 text-[#C9A84C]" />{selectedReservation.user?.phone || 'Non renseigné'}</span>
                  </p>
                  <p className="text-sm text-gray-300 flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Age du conducteur</span>
                    <span className="font-medium">{selectedReservation.driverAge || '25+'}</span>
                  </p>
                  <p className="text-sm text-gray-300 flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Pays de résidence</span>
                    <span className="font-medium">{selectedReservation.driverCountry || 'MA'}</span>
                  </p>
                </div>
              </div>

              {/* Reservation Info */}
              <div className="space-y-4">
                <h4 className="text-[#C9A84C] text-sm font-bold uppercase tracking-wider mb-2 flex items-center border-b border-white/5 pb-2">
                  <Car className="w-4 h-4 mr-2" /> Informations Réservation
                </h4>
                <div className="space-y-3">
                  <p className="text-sm text-gray-300 flex flex-col">
                    <span className="text-gray-500 text-xs mb-1">Véhicule</span>
                    <span className="font-medium text-white">{selectedReservation.vehicle?.brand} {selectedReservation.vehicle?.model}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-300 flex flex-col">
                      <span className="text-gray-500 text-xs mb-1">Prise en charge</span>
                      <span className="font-medium">{format(new Date(selectedReservation.startDate), 'dd MMM yyyy', { locale: fr })}</span>
                      <span className="text-xs text-[#C9A84C] mt-0.5">{selectedReservation.pickupTime || '10:00'}</span>
                    </p>
                    <p className="text-sm text-gray-300 flex flex-col">
                      <span className="text-gray-500 text-xs mb-1">Retour</span>
                      <span className="font-medium">{format(new Date(selectedReservation.endDate), 'dd MMM yyyy', { locale: fr })}</span>
                      <span className="text-xs text-[#C9A84C] mt-0.5">{selectedReservation.returnTime || '10:00'}</span>
                    </p>
                  </div>
                  
                  {selectedReservation.options && Object.keys(JSON.parse(selectedReservation.options)).length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-gray-500 text-xs mb-1 block">Options incluses</span>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(selectedReservation.options).hasGps && <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">GPS</span>}
                        {JSON.parse(selectedReservation.options).hasBabySeat && <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">Siège Bébé</span>}
                        {JSON.parse(selectedReservation.options).hasExtraDriver && <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">Conducteur Ad.</span>}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 mt-3 border-t border-white/10">
                    <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded-lg border border-white/5">
                      <span className="text-gray-400 text-xs font-bold uppercase">Prix Total</span>
                      <span className="text-[#C9A84C] font-bold text-lg">{selectedReservation.totalPrice} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
