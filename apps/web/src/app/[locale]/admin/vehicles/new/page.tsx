'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AddVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    fuel: 'DIESEL',
    transmission: 'MANUAL',
    pricePerDay: 300,
    category: 'ECONOMY',
    mileage: 0,
    deposit: 5000
  });

  const { token } = useAuthStore();
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value.toString());
      });
      
      images.forEach(image => {
        form.append('images', image);
      });

      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/vehicles`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
        body: form,
      });
      
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }
      
      toast.success('Véhicule ajouté avec succès');
      router.push('/admin/vehicles');
    } catch (error: any) {
      console.error(error);
      toast.error('Erreur lors de l\'ajout du véhicule: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'pricePerDay' ? Number(value) : value
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/admin/vehicles">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Nouveau Véhicule</h1>
            <p className="text-gray-400 mt-1">Ajoutez un nouveau véhicule à votre catalogue.</p>
          </div>
        </div>

        <Card className="bg-[#111111] border-white/10 shadow-xl">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white">Informations du véhicule</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Marque</label>
                  <Input required name="brand" value={formData.brand} onChange={handleChange} className="bg-[#0a0a0a] border-white/10 text-white focus:border-[#C9A84C]" placeholder="Ex: Renault" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Modèle</label>
                  <Input required name="model" value={formData.model} onChange={handleChange} className="bg-[#0a0a0a] border-white/10 text-white focus:border-[#C9A84C]" placeholder="Ex: Clio 5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Immatriculation</label>
                  <Input required name="licensePlate" value={formData.licensePlate} onChange={handleChange} className="bg-[#0a0a0a] border-white/10 text-white focus:border-[#C9A84C]" placeholder="Ex: 12345-A-1" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Année</label>
                  <Input required type="number" name="year" value={formData.year} onChange={handleChange} className="bg-[#0a0a0a] border-white/10 text-white focus:border-[#C9A84C]" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Carburant</label>
                  <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full h-10 px-3 py-2 rounded-md bg-[#0a0a0a] border border-white/10 text-white focus:border-[#C9A84C] focus:outline-none">
                    <option value="DIESEL">Diesel</option>
                    <option value="ESSENCE">Essence</option>
                    <option value="HYBRID">Hybride</option>
                    <option value="ELECTRIC">Électrique</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Boîte de vitesse</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full h-10 px-3 py-2 rounded-md bg-[#0a0a0a] border border-white/10 text-white focus:border-[#C9A84C] focus:outline-none">
                    <option value="MANUAL">Manuelle</option>
                    <option value="AUTOMATIC">Automatique</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Catégorie</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full h-10 px-3 py-2 rounded-md bg-[#0a0a0a] border border-white/10 text-white focus:border-[#C9A84C] focus:outline-none">
                    <option value="ECONOMY">Économique</option>
                    <option value="COMPACT">Compacte</option>
                    <option value="SEDAN">Berline</option>
                    <option value="SUV">SUV</option>
                    <option value="LUXURY">Luxe</option>
                    <option value="VAN">Utilitaire</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Prix / Jour (MAD)</label>
                  <Input required type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} className="bg-[#0a0a0a] border-white/10 text-white focus:border-[#C9A84C]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Photos du véhicule</label>
                <Input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImages(Array.from(e.target.files));
                    }
                  }}
                  className="bg-[#0a0a0a] border-white/10 text-white focus:border-[#C9A84C] file:bg-[#C9A84C] file:text-black file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:font-semibold cursor-pointer" 
                />
                <p className="text-xs text-gray-500">Vous pouvez sélectionner plusieurs images (maximum 5).</p>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button type="submit" disabled={loading} className="bg-[#C9A84C] hover:bg-[#F5D078] text-[#0a0a0a] font-bold px-8">
                  {loading ? 'Enregistrement...' : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer le véhicule
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
