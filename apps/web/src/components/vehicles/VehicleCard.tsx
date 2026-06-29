import { Vehicle } from '@repo/shared';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Fuel, Gauge, Settings2 } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] bg-[#111111]/80 backdrop-blur-md border-white/10 group hover:-translate-y-2">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0a]">
        {vehicle.images[0] ? (
          <>
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-600 italic font-light">
            Aucune image
          </div>
        )}
        <Badge 
          className="absolute right-3 top-3 bg-[#C9A84C]/90 text-[#0a0a0a] backdrop-blur-md border-none font-bold text-sm px-3 py-1.5 shadow-lg"
          variant="secondary"
        >
          {vehicle.pricePerDay} MAD<span className="text-xs font-normal opacity-80">/jour</span>
        </Badge>
      </div>
      
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white tracking-wide">
            {vehicle.brand} <span className="font-light text-[#C9A84C]">{vehicle.model}</span>
          </CardTitle>
          <span className="text-sm font-bold text-gray-500">{vehicle.year}</span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-3">
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#0a0a0a] border border-white/5 space-y-1 group-hover:border-[#C9A84C]/20 transition-colors">
            <Fuel className="h-4 w-4 text-[#C9A84C]" />
            <span className="font-medium">{vehicle.fuel}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#0a0a0a] border border-white/5 space-y-1 group-hover:border-[#C9A84C]/20 transition-colors">
            <Settings2 className="h-4 w-4 text-[#C9A84C]" />
            <span className="font-medium">{vehicle.transmission === 'AUTOMATIC' ? 'Auto' : 'Manuelle'}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#0a0a0a] border border-white/5 space-y-1 group-hover:border-[#C9A84C]/20 transition-colors">
            <Gauge className="h-4 w-4 text-[#C9A84C]" />
            <span className="font-medium">{vehicle.mileage}km</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-white/5 p-5">
        <Link 
          href={`/vehicles/${vehicle.id}`}
          className={cn(buttonVariants({ variant: "outline" }), "w-full border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0a0a0a] transition-all duration-300 font-bold tracking-widest uppercase text-xs h-12")}
        >
          Voir les détails
        </Link>
      </CardFooter>
    </Card>
  );
}
