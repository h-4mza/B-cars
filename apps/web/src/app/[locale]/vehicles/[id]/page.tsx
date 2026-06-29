'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Car, Check, ShieldCheck, FileText, Info, Settings2, Users, Wind, Zap, Star } from 'lucide-react';
import { Link } from '@/i18n/routing';

function VehicleDetails() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/vehicles/${id}`);
        const data = await res.json();
        setVehicle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVehicle();
  }, [id]);

  if (loading) return <div className="text-center py-32 text-gray-400">Chargement des détails...</div>;
  if (!vehicle) return <div className="text-center py-32 text-gray-400">Véhicule introuvable.</div>;

  let totalDays = 1;
  if (pickupDate && returnDate) {
    const msDiff = new Date(returnDate).getTime() - new Date(pickupDate).getTime();
    totalDays = Math.ceil(msDiff / (1000 * 3600 * 24));
    if (totalDays <= 0 || isNaN(totalDays)) totalDays = 1;
  }
  
  const totalPrice = Number(vehicle.pricePerDay) * totalDays;

  const includedFeatures = [
    { icon: '🛣️', label: vehicle.mileagePolicy === 'UNLIMITED' ? 'Kilométrage illimité' : `${vehicle.mileageLimit} km inclus` },
    { icon: '🛡️', label: `Couverture dommages collision (CDW) — Caution: ${vehicle.depositAmount} MAD` },
    { icon: '🔒', label: 'Protection vol' },
    { icon: '🔧', label: 'Assistance routière 24h/24' },
    { icon: '📜', label: 'Responsabilité civile (RC)' },
  ];

  const requiredDocuments = [
    { icon: '🪪', title: 'Permis de conduire', description: 'Permis valide au nom du conducteur principal', link: '/faq#permis' },
    { icon: '🌐', title: 'Pièce d\'identité', description: 'Passeport ou autre document d\'identité valide', link: '/faq#identite' },
    { icon: '💳', title: 'Carte bancaire', description: 'Carte de crédit au nom du conducteur pour la caution', link: '/faq#paiement' },
    { icon: '📱', title: 'Bon de réservation', description: 'Confirmation imprimée ou e-voucher sur smartphone', link: '/faq#voucher' },
  ];

  return (
    <div className="pb-32">
      {/* Sticky Header Bottom on Mobile, Top on Desktop */}
      <div className="fixed bottom-0 md:top-20 md:bottom-auto left-0 w-full bg-[#111111]/95 backdrop-blur-md border-t md:border-b border-white/10 p-4 z-40 shadow-2xl">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {vehicle.images?.[0] ? (
              <img src={vehicle.images[0]} alt={vehicle.brand} className="w-16 hidden md:block object-contain" />
            ) : (
              <Car className="w-8 h-8 text-gray-500 hidden md:block" />
            )}
            <div>
              <p className="text-xs text-gray-400">Total pour {totalDays} jours</p>
              <p className="text-xl font-bold text-[#C9A84C]">{totalPrice} MAD</p>
            </div>
          </div>
          <Link 
            href={`/booking/${id}/options?pickupDate=${pickupDate}&returnDate=${returnDate}`}
            className="px-8 py-3 bg-[#C9A84C] text-[#0a0a0a] font-bold rounded-sm hover:bg-[#F5D078] transition-colors"
          >
            Continuer
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8 md:mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl -mr-20 -mt-20" />
              
              <h1 className="text-4xl font-serif font-bold text-white mb-2">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-gray-400 mb-8">ou similaire {vehicle.category?.toLowerCase()}</p>

              <div className="flex justify-center mb-10 h-64 relative">
                {vehicle.images?.[0] ? (
                  <img src={vehicle.images[0]} alt={vehicle.brand} className="h-full object-contain drop-shadow-2xl z-10" />
                ) : (
                  <Car className="w-32 h-32 text-gray-600 z-10" />
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0a0a0a] p-6 rounded-xl border border-white/5 relative z-10">
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <Car className="w-5 h-5 text-[#C9A84C] mb-2" />
                  <span className="text-sm font-bold text-white">{vehicle.category}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <Settings2 className="w-5 h-5 text-[#C9A84C] mb-2" />
                  <span className="text-sm font-bold text-white">{vehicle.transmission === 'AUTOMATIC' ? 'Auto' : 'Manuelle'}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <Users className="w-5 h-5 text-[#C9A84C] mb-2" />
                  <span className="text-sm font-bold text-white">{vehicle.seats} places</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <Wind className="w-5 h-5 text-[#C9A84C] mb-2" />
                  <span className="text-sm font-bold text-white">Climatisation</span>
                </div>
              </div>
            </div>

            {/* Included in Offer */}
            <div className="bg-[#111111] rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="text-[#C9A84C]" /> Inclus dans votre offre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {includedFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0a0a0a]/50 p-4 rounded-lg border border-green-900/30">
                    <span className="text-xl">{f.icon}</span>
                    <span className="text-sm text-green-100">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-[#111111] rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                <Info className="text-[#C9A84C]" /> Politique d'annulation
              </h3>
              <div className="bg-green-950/30 border border-green-900/50 p-6 rounded-xl">
                <p className="text-green-400 font-medium flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 shrink-0" />
                  Remboursement complet si annulation 48h avant la prise en charge. Profitez d'une flexibilité totale pour votre voyage.
                </p>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-[#111111] rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="text-[#C9A84C]" /> Que faut-il pour récupérer la voiture ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requiredDocuments.map((doc, i) => (
                  <div key={i} className="bg-[#0a0a0a]/50 p-5 rounded-xl border border-blue-900/30">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-950/50 flex items-center justify-center text-xl">
                        {doc.icon}
                      </div>
                      <h4 className="font-bold text-blue-100">{doc.title}</h4>
                    </div>
                    <p className="text-sm text-blue-200/70 mb-3 ml-13">{doc.description}</p>
                    <Link href={doc.link} className="text-xs text-[#C9A84C] hover:underline ml-13">En savoir plus →</Link>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Rating Box */}
            <div className="bg-[#111111] rounded-2xl border border-white/10 p-6">
              <h4 className="font-bold text-white mb-6 flex items-center justify-between">
                <span>Note Fournisseur</span>
                <span className="bg-[#C9A84C] text-[#0a0a0a] px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                  {vehicle.rating} <Star className="w-3 h-3 fill-current" />
                </span>
              </h4>
              
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">B CARS Premium</div>
                  <div className="text-xs text-gray-400">Basé sur {vehicle.reviewCount} avis</div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>Rapport qualité/prix</span>
                    <span className="font-bold">8.3</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-[#C9A84C] h-1.5 rounded-full" style={{width: '83%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>Propreté</span>
                    <span className="font-bold">8.7</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-[#C9A84C] h-1.5 rounded-full" style={{width: '87%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span>Personnel</span>
                    <span className="font-bold">8.1</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-[#C9A84C] h-1.5 rounded-full" style={{width: '81%'}}></div></div>
                </div>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-[#111111] rounded-2xl border border-white/10 p-6">
              <h4 className="font-bold text-white mb-6">Résumé du voyage</h4>
              
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-[#C9A84C]/30">
                  <div className="absolute w-3 h-3 bg-[#C9A84C] rounded-full -left-[7px] top-1" />
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Prise en charge</p>
                  <p className="text-white font-bold">{pickupDate || 'Date non sélectionnée'}</p>
                  <p className="text-sm text-gray-400">10:00</p>
                </div>
                
                <div className="relative pl-6 border-l-2 border-transparent">
                  <div className="absolute w-3 h-3 bg-white/20 border-2 border-[#111111] rounded-full -left-[7px] top-1" />
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Retour</p>
                  <p className="text-white font-bold">{returnDate || 'Date non sélectionnée'}</p>
                  <p className="text-sm text-gray-400">10:00</p>
                </div>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}

export default function VehicleDetailsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 font-sans selection:bg-[#C9A84C]/30 text-white">
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Chargement...</div>}>
        <VehicleDetails />
      </Suspense>
    </div>
  );
}
