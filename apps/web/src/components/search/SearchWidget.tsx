'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { MapPin, Calendar, Clock, User, Tag, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Location {
  id: string;
  name: string;
  type: string;
  city: string;
}

export function SearchWidget() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [vehicleType, setVehicleType] = useState<'car' | 'van'>('car');
  const [sameReturnLocation, setSameReturnLocation] = useState(true);
  const [showPromo, setShowPromo] = useState(false);
  
  const [formData, setFormData] = useState({
    pickupLocationId: '',
    returnLocationId: '',
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
    driverAge: '25+',
    driverCountry: 'MA',
    promoCode: ''
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/locations`)
      .then(res => res.json())
      .then(data => setLocations(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickupLocationId || !formData.pickupDate || !formData.returnDate) {
      alert("Veuillez remplir les informations obligatoires (Lieu, Dates).");
      return;
    }
    
    const query = new URLSearchParams();
    query.set('pickupLocationId', formData.pickupLocationId);
    query.set('returnLocationId', sameReturnLocation ? formData.pickupLocationId : formData.returnLocationId);
    query.set('pickupDate', formData.pickupDate);
    query.set('pickupTime', formData.pickupTime);
    query.set('returnDate', formData.returnDate);
    query.set('returnTime', formData.returnTime);
    query.set('driverAge', formData.driverAge);
    query.set('driverCountry', formData.driverCountry);
    if (vehicleType === 'van') query.set('category', 'VAN');
    if (formData.promoCode) query.set('promoCode', formData.promoCode);
    
    router.push(`/vehicles/search?${query.toString()}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m of ['00', '30']) {
      timeOptions.push(`${h.toString().padStart(2, '0')}:${m}`);
    }
  }

  return (
    <div className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(201,168,76,0.1)] w-full max-w-5xl mx-auto relative z-20">
      
      {/* Switcher */}
      <div className="flex gap-2 mb-6">
        <button 
          type="button"
          onClick={() => setVehicleType('car')}
          className={cn("flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300", 
            vehicleType === 'car' ? "bg-[#C9A84C] text-[#0a0a0a]" : "bg-white/5 text-gray-400 hover:text-white"
          )}
        >
          🚗 Voitures
        </button>
        <button 
          type="button"
          onClick={() => setVehicleType('van')}
          className={cn("flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300", 
            vehicleType === 'van' ? "bg-[#C9A84C] text-[#0a0a0a]" : "bg-white/5 text-gray-400 hover:text-white"
          )}
        >
          🚐 Utilitaires
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pickup Location */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Lieu de départ</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
              <select 
                value={formData.pickupLocationId}
                onChange={e => handleInputChange('pickupLocationId', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
              >
                <option value="">Sélectionnez un lieu...</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Return Location Toggle & Select */}
          <div className="space-y-2 flex flex-col justify-end">
            {!sameReturnLocation ? (
              <>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Lieu de retour</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select 
                    value={formData.returnLocationId}
                    onChange={e => handleInputChange('returnLocationId', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
                  >
                    <option value="">Sélectionnez un lieu...</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="h-[52px] flex items-center">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn("w-5 h-5 rounded flex items-center justify-center border transition-colors", sameReturnLocation ? "bg-[#C9A84C] border-[#C9A84C]" : "bg-[#0a0a0a] border-white/20 group-hover:border-[#C9A84C]")}>
                    {sameReturnLocation && <Check className="w-3.5 h-3.5 text-[#0a0a0a]" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={sameReturnLocation} onChange={() => setSameReturnLocation(!sameReturnLocation)} />
                  <span className="text-sm text-gray-300">Retour dans la même agence</span>
                </label>
              </div>
            )}
            
            {!sameReturnLocation && (
              <button type="button" onClick={() => setSameReturnLocation(true)} className="text-xs text-[#C9A84C] hover:underline self-start mt-1">
                Retour dans la même agence ?
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pickup Date */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date de départ</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
              <input 
                type="date" 
                value={formData.pickupDate}
                onChange={e => handleInputChange('pickupDate', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Heure</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
              <select 
                value={formData.pickupTime}
                onChange={e => handleInputChange('pickupTime', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
              >
                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date de retour</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
              <input 
                type="date" 
                value={formData.returnDate}
                onChange={e => handleInputChange('returnDate', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
          </div>

          {/* Return Time */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Heure</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
              <select 
                value={formData.returnTime}
                onChange={e => handleInputChange('returnTime', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
              >
                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          {/* Driver Age */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Âge du conducteur</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select 
                value={formData.driverAge}
                onChange={e => handleInputChange('driverAge', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
              >
                <option value="18-21">18-21 ans</option>
                <option value="22+">22+ ans</option>
                <option value="25+">25+ ans</option>
                <option value="30+">30+ ans</option>
              </select>
            </div>
          </div>

          {/* Driver Country */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pays de résidence</label>
            <select 
              value={formData.driverCountry}
              onChange={e => handleInputChange('driverCountry', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
            >
              <option value="MA">Maroc</option>
              <option value="FR">France</option>
              <option value="BE">Belgique</option>
              <option value="ES">Espagne</option>
              <option value="US">États-Unis</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          {/* Promo code toggle/input */}
          <div className="space-y-2">
            {!showPromo ? (
              <button type="button" onClick={() => setShowPromo(true)} className="flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#F5D078] transition-colors py-3.5">
                <Tag className="w-4 h-4" /> J'ai un code promo
              </button>
            ) : (
              <>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Code promo</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
                  <input 
                    type="text" 
                    value={formData.promoCode}
                    onChange={e => handleInputChange('promoCode', e.target.value)}
                    placeholder="Ex: SUMMER25"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#C9A84C] uppercase"
                  />
                </div>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#C9A84C] text-[#0a0a0a] rounded-lg py-3.5 font-bold text-lg hover:bg-[#F5D078] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Rechercher
          </button>
        </div>
      </form>
    </div>
  );
}
