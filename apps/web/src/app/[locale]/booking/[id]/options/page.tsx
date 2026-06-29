'use client';

import { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function BookingOptionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pickupDate = searchParams.get('pickupDate') || new Date().toISOString();
  const returnDate = searchParams.get('returnDate') || new Date(Date.now() + 86400000).toISOString();
  
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: resolvedParams.id,
          startDate: pickupDate,
          endDate: returnDate,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          pickupLocationId: 'loc_1',
          returnLocationId: 'loc_1'
        })
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la réservation');
      }

      toast.success('Réservation confirmée avec succès !');
      // Redirect to home or success page
      router.push('/fr');
      
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 text-white selection:bg-[#C9A84C]/30">
      <div className="container mx-auto px-6 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8 text-[#C9A84C]">Finaliser la réservation</h1>
        
        <form onSubmit={handleSubmit} className="bg-[#111111] p-8 rounded-2xl border border-white/10 space-y-6">
          <p className="text-gray-400 mb-6">Veuillez renseigner vos coordonnées pour confirmer la réservation sans avoir à créer de compte.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nom complet</label>
              <input
                required
                type="text"
                value={formData.guestName}
                onChange={e => setFormData({...formData, guestName: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                placeholder="Ex: Jean Dupont"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                required
                type="email"
                value={formData.guestEmail}
                onChange={e => setFormData({...formData, guestEmail: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                placeholder="Ex: jean@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Téléphone</label>
              <input
                required
                type="tel"
                value={formData.guestPhone}
                onChange={e => setFormData({...formData, guestPhone: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                placeholder="Ex: +212 600 000 000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] text-[#0a0a0a] rounded-lg py-4 font-bold text-lg hover:bg-[#F5D078] transition-colors mt-8"
          >
            {loading ? 'Traitement...' : 'Confirmer la réservation'}
          </button>
        </form>
      </div>
    </div>
  );
}
