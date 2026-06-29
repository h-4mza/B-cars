'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit,
  Settings2,
  Gauge,
  Fuel
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Vehicle } from '@repo/shared';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { token } = useAuthStore();
  const fetchVehicles = async () => {
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/vehicles`);
      const data = await response.json();
      setVehicles(Array.isArray(data) ? data : (data.results || []));
    } catch (error) {
      toast.error('Erreur lors du chargement de la flotte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
    
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/vehicles/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include'
      });
      if (!response.ok) throw new Error();
      toast.success('Véhicule supprimé');
      fetchVehicles();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.brand.toLowerCase().includes(search.toLowerCase()) || 
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.licensePlate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Gestion de la Flotte</h1>
            <p className="text-gray-400 mt-1">Ajoutez, modifiez ou retirez des véhicules de votre catalogue.</p>
          </div>
          <Link href="/admin/vehicles/new">
            <Button className="bg-[#C9A84C] hover:bg-[#F5D078] text-[#0a0a0a] font-bold h-11 px-6 shadow-[0_0_15px_rgba(201,168,76,0.2)] transition-all">
              <Plus className="mr-2 h-5 w-5" />
              Nouveau Véhicule
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111111]/80 backdrop-blur-md border-white/10 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 flex items-center space-x-4 relative z-10">
              <div className="p-3 bg-[#0a0a0a] border border-[#C9A84C]/20 rounded-xl">
                <Car className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Flotte</p>
                <h3 className="text-2xl font-bold text-white">{vehicles.length}</h3>
              </div>
            </CardContent>
          </Card>
          {/* Add more small stat cards if needed */}
        </div>

        <Card className="bg-[#111111]/80 backdrop-blur-md border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <CardHeader className="border-b border-white/5 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-bold text-white tracking-wide">Véhicules Référencés</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Marque, modèle ou plaque..." 
                  className="pl-10 h-11 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            {loading ? (
              <div className="p-12 text-center text-gray-500 italic">Chargement des données...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#0a0a0a]/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="pl-6 text-gray-400">Véhicule</TableHead>
                      <TableHead className="text-gray-400">Immatriculation</TableHead>
                      <TableHead className="text-gray-400">Caractéristiques</TableHead>
                      <TableHead className="text-gray-400">Prix/Jour</TableHead>
                      <TableHead className="text-gray-400">Statut</TableHead>
                      <TableHead className="text-right pr-6 text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((v) => (
                      <TableRow key={v.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-20 rounded-lg bg-[#0a0a0a] overflow-hidden relative border border-white/10">
                              {v.images[0] ? (
                                <img src={v.images[0]} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Car className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white">{v.brand} {v.model}</span>
                              <span className="text-xs text-[#C9A84C]">{v.year}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs border-[#C9A84C]/30 text-gray-300 bg-[#0a0a0a]">
                            {v.licensePlate}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium">
                            <span className="flex items-center"><Fuel className="h-3 w-3 mr-1 text-[#C9A84C]" /> {v.fuel}</span>
                            <span className="flex items-center"><Settings2 className="h-3 w-3 mr-1 text-[#C9A84C]" /> {v.transmission === 'AUTOMATIC' ? 'BVA' : 'BVM'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-white">
                          {v.pricePerDay} MAD
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            v.status === 'AVAILABLE' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }>
                            {v.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                              onClick={() => handleDelete(v.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
