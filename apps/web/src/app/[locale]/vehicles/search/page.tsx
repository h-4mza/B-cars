'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Settings2, Car, Zap, Wind, ChevronRight, Info, ThumbsUp, Filter, AlertCircle, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams as any).toString();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/vehicles/search?${query}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to search vehicles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-6 p-6 rounded-2xl bg-[#111111]/80 border border-white/10">
            <Skeleton className="w-1/3 aspect-video rounded-xl bg-white/5" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-1/3 bg-white/5" />
              <Skeleton className="h-4 w-1/4 bg-white/5" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 bg-white/5 rounded-full" />
                <Skeleton className="h-8 w-24 bg-white/5 rounded-full" />
              </div>
            </div>
            <div className="w-48 space-y-4">
              <Skeleton className="h-8 w-full bg-white/5" />
              <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.results || data.results.length === 0) {
    return (
      <div className="text-center py-20 bg-[#111111]/50 rounded-2xl border border-white/5">
        <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Aucun véhicule disponible</h3>
        <p className="text-gray-400">Aucun véhicule ne correspond à vos critères pour ces dates. Essayez de modifier votre recherche.</p>
        <Link href="/" className="inline-block mt-6 px-6 py-2 bg-[#C9A84C] text-[#0a0a0a] rounded-sm font-bold hover:bg-[#F5D078]">
          Nouvelle recherche
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.results.map((vehicle: any) => (
        <div key={vehicle.id} className="bg-[#111111]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-[#C9A84C]/30 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row">
            
            {/* Image & Quick Info */}
            <div className="w-full md:w-[35%] relative p-4 bg-[#0a0a0a]/50 flex flex-col items-center justify-center">
              {vehicle.images?.[0] ? (
                <img src={vehicle.images[0]} alt={vehicle.brand} className="w-full object-contain mb-4" />
              ) : (
                <div className="w-full h-40 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                  <Car className="w-12 h-12 text-gray-700" />
                </div>
              )}
            </div>

            {/* Middle: Details */}
            <div className="flex-1 p-6 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-white">{vehicle.brand} {vehicle.model}</h3>
                  <button className="text-gray-500 hover:text-[#C9A84C]"><Info className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-gray-400 mb-6">ou similaire {vehicle.category.toLowerCase()}</p>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-[#C9A84C]" /> {vehicle.seats} places</div>
                  <div className="flex items-center gap-2"><Settings2 className="w-4 h-4 text-[#C9A84C]" /> {vehicle.transmission === 'AUTOMATIC' ? 'Automatique' : 'Manuelle'}</div>
                  <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-[#C9A84C]" /> Climatisation</div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#C9A84C]" /> 
                    {vehicle.mileagePolicy === 'UNLIMITED' ? 'Km illimité' : `${vehicle.mileageLimit} km inclus`}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-6">
                {vehicle.badges?.map((badge: any, i: number) => {
                  let badgeClass = "bg-gray-800 text-gray-300 border-gray-700";
                  if (badge.type === 'BEST_PRICE') badgeClass = "bg-blue-900/30 text-blue-400 border-blue-900/50";
                  else if (badge.type === 'EXCELLENT') badgeClass = "bg-green-900/30 text-green-400 border-green-900/50";
                  else if (badge.type === 'LIMITED') badgeClass = "bg-orange-900/30 text-orange-400 border-orange-900/50";
                  
                  return (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-sm border ${badgeClass} font-medium flex items-center gap-1`}>
                      {badge.type === 'BEST_PRICE' && <AlertCircle className="w-3 h-3" />}
                      {badge.type === 'EXCELLENT' && <ThumbsUp className="w-3 h-3" />}
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right: Price & Action */}
            <div className="w-full md:w-[25%] p-6 bg-[#0a0a0a]/50 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10">
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Prix pour {vehicle.numberOfDays} jours</p>
                <div className="text-3xl font-bold text-[#C9A84C] mb-1">{vehicle.totalPrice} MAD</div>
                <p className="text-sm text-gray-400">({vehicle.pricePerDay} MAD/jour)</p>
              </div>

              <div className="mt-6">
                <Link 
                  href={`/vehicles/${vehicle.id}?pickupDate=${searchParams.get('pickupDate')}&returnDate=${searchParams.get('returnDate')}`}
                  className="w-full bg-[#C9A84C] text-[#0a0a0a] rounded-sm py-3 font-bold text-center hover:bg-[#F5D078] transition-colors flex items-center justify-center gap-2"
                >
                  Continuer <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 font-sans selection:bg-[#C9A84C]/30 text-white">
      <div className="container mx-auto px-6">
        
        {/* Header with Search Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-[#111111] p-4 rounded-xl border border-white/10">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Résultats de recherche</h1>
            <Suspense fallback={<div className="text-sm text-gray-500">Chargement...</div>}>
              <SearchSummary />
            </Suspense>
          </div>
          <Link href="/" className="px-4 py-2 border border-white/20 rounded text-sm hover:bg-white/5 transition-colors">
            Modifier la recherche
          </Link>
        </div>

        {/* Filters & Results Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-[#111111] rounded-xl border border-white/10 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-[#C9A84C] font-bold pb-4 border-b border-white/10">
                <Filter className="w-5 h-5" /> Filtres
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">Transmission</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-[#C9A84C] bg-black border-white/20 rounded" />
                      <span className="text-gray-300 text-sm">Automatique</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-[#C9A84C] bg-black border-white/20 rounded" />
                      <span className="text-gray-300 text-sm">Manuelle</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Caractéristiques</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-[#C9A84C] bg-black border-white/20 rounded" />
                      <span className="text-gray-300 text-sm">Climatisation</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-[#C9A84C] bg-black border-white/20 rounded" />
                      <span className="text-gray-300 text-sm">Kilométrage illimité</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="w-full lg:w-3/4">
            <Suspense fallback={<div className="text-center py-20 text-gray-500">Recherche en cours...</div>}>
              <SearchResults />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  );
}

function SearchSummary() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get('pickupDate');
  const ret = searchParams.get('returnDate');
  return (
    <p className="text-sm text-[#C9A84C]">
      {pickup ? `${pickup} → ${ret}` : 'Dates non sélectionnées'}
    </p>
  );
}
