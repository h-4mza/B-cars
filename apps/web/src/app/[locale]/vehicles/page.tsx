'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@repo/shared';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Car } from 'lucide-react';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/vehicles`);
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = brandFilter === 'all' || v.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const uniqueBrands = Array.from(new Set(vehicles.map((v) => v.brand)));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#C9A84C]/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-[20%] right-0 w-[40vw] h-[40vw] bg-[#C9A84C]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Notre Flotte <span className="text-[#C9A84C] italic">Premium</span>
          </h1>
          <p className="text-lg text-gray-400">
            Découvrez notre sélection exclusive de véhicules de prestige pour votre séjour au Maroc. L'élégance et la performance à votre portée.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#C9A84C]" />
            <Input 
              placeholder="Rechercher par marque ou modèle..." 
              className="pl-12 h-14 bg-[#111111]/80 backdrop-blur-md border-white/10 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] rounded-xl shadow-xl transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={brandFilter} onValueChange={(val) => setBrandFilter(val || 'all')}>
            <SelectTrigger className="w-full md:w-[250px] h-14 bg-[#111111]/80 backdrop-blur-md border-white/10 text-white focus:ring-[#C9A84C] focus:border-[#C9A84C] rounded-xl shadow-xl">
              <SelectValue placeholder="Toutes les marques" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-white/10 text-white">
              <SelectItem value="all" className="focus:bg-[#C9A84C]/20 focus:text-white">Toutes les marques</SelectItem>
              {uniqueBrands.map((brand) => (
                <SelectItem key={brand} value={brand} className="focus:bg-[#C9A84C]/20 focus:text-white">{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-2xl bg-[#111111] border border-white/5" />
                <Skeleton className="h-6 w-2/3 bg-[#111111]" />
                <Skeleton className="h-4 w-1/3 bg-[#111111]" />
              </div>
            ))}
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-[40vh] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111111]/50 backdrop-blur-sm text-center px-4 mt-8">
            <Car className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-400 max-w-md">Nous n'avons trouvé aucun véhicule correspondant à vos critères de recherche. Essayez de modifier vos filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
}
