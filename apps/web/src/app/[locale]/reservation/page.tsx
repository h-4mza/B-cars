'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Car, Calendar, User, Phone, CheckCircle, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ReservationPage() {
  const t = useTranslations('Landing'); // Reusing Landing translations or we can add new ones
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    vehicleId: ''
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/vehicles`)
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch vehicles:', err));
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.pickupDate || !bookingForm.returnDate || !bookingForm.vehicleId) {
      toast.error("Veuillez remplir les dates et sélectionner un véhicule.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: bookingForm.vehicleId,
          startDate: new Date(bookingForm.pickupDate).toISOString(),
          endDate: new Date(bookingForm.returnDate).toISOString(),
          guestName: bookingForm.fullName || 'Client',
          guestPhone: bookingForm.phone || '0000',
          guestEmail: (bookingForm.phone || 'guest') + '@location.ma',
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.message || "Erreur lors de la réservation");
        setIsSubmitting(false);
        return;
      }

      toast.success("Réservation confirmée avec succès !");
      setBookingForm({ fullName: '', phone: '', pickupDate: '', returnDate: '', vehicleId: '' });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#cccccc] font-sans selection:bg-[#C9A84C]/30 relative overflow-hidden flex items-center justify-center py-20 px-4">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-[#C9A84C]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-[#111111]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left Panel */}
          <div className="lg:col-span-2 bg-[#1a1a1a] p-10 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <div>
              <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors text-sm">
                <ChevronLeft className="w-4 h-4 mr-1" /> Retour
              </Link>
              <h2 className="text-3xl font-serif text-white font-bold mb-4">Réservez votre<br/><span className="text-[#C9A84C]">Véhicule</span></h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Remplissez les informations ci-contre pour valider votre réservation. Notre équipe vous contactera dans les plus brefs délais pour confirmer.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#C9A84C]">
                  <Car className="w-4 h-4" />
                </div>
                <span>Véhicules premium</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#C9A84C]">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span>Assurance tous risques</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:col-span-3 p-10">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Informations Personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Nom Complet</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        required
                        value={bookingForm.fullName}
                        onChange={e => setBookingForm({...bookingForm, fullName: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors" 
                        placeholder="John Doe" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="tel" 
                        required
                        value={bookingForm.phone}
                        onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors" 
                        placeholder="+212 6..." 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Détails de la Réservation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Date de retrait</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]" />
                      <input 
                        type="date" 
                        required
                        value={bookingForm.pickupDate}
                        onChange={e => setBookingForm({...bookingForm, pickupDate: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors [&::-webkit-calendar-picker-indicator]:invert-[0.8]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Date de retour</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]" />
                      <input 
                        type="date" 
                        required
                        value={bookingForm.returnDate}
                        onChange={e => setBookingForm({...bookingForm, returnDate: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors [&::-webkit-calendar-picker-indicator]:invert-[0.8]" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Véhicule choisi</label>
                  <select 
                    required
                    value={bookingForm.vehicleId}
                    onChange={e => setBookingForm({...bookingForm, vehicleId: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
                  >
                    <option value="" disabled>-- Sélectionner un véhicule --</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.brand} {v.model} - {v.pricePerDay} DH/jour</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#C9A84C] text-[#0a0a0a] py-4 rounded-lg font-bold text-lg hover:bg-[#F5D078] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 relative overflow-hidden group border-none disabled:opacity-50"
              >
                <span className="relative z-10">{isSubmitting ? 'Traitement...' : 'Confirmer la Réservation'}</span>
                {!isSubmitting && <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
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
