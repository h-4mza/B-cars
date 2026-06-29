'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  FileText, 
  Check, 
  X, 
  Download, 
  User,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/documents/pending`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        toast.error('Session expirée, veuillez vous reconnecter.');
        window.location.href = '/fr/auth/login';
      } else {
        toast.error('Erreur de chargement');
        setDocuments([]);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/admin/documents/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isVerified }),
      });

      if (!response.ok) throw new Error();
      
      toast.success(isVerified ? 'Document validé' : 'Document refusé');
      fetchDocuments();
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const handleDownload = (id: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/documents/${id}/download`, '_blank');
  };

  const filteredDocs = documents.filter(doc => 
    doc.user.email.toLowerCase().includes(search.toLowerCase()) || 
    doc.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Validation des Documents</h1>
            <p className="text-gray-400 mt-1">Vérifiez les pièces d'identité soumises par les clients.</p>
          </div>
          <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 px-4 py-1.5 text-sm font-bold shadow-[0_0_15px_rgba(201,168,76,0.1)]">
            {documents.length} En attente
          </Badge>
        </div>

        <Card className="bg-[#111111]/80 backdrop-blur-md border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <CardHeader className="border-b border-white/5 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-bold text-white tracking-wide">Documents récents</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Rechercher un client..." 
                  className="pl-10 h-10 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            {loading ? (
              <div className="p-12 text-center text-gray-500 italic">Chargement des données...</div>
            ) : filteredDocs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#0a0a0a]/50">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="pl-6 text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Date d'envoi</TableHead>
                      <TableHead className="text-gray-400">Sécurité</TableHead>
                      <TableHead className="text-right pr-6 text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.map((doc) => (
                      <TableRow key={doc.id} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 rounded-lg bg-[#0a0a0a] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold">
                              {doc.user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white">{doc.user.email}</span>
                              <span className="text-xs text-gray-500">ID: {doc.userId.slice(0, 8)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-300">{doc.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-400">
                          {format(new Date(doc.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            AES-256
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-9 bg-[#0a0a0a] border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                              onClick={() => handleDownload(doc.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-9 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
                              onClick={() => handleVerify(doc.id, true)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="h-9 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/20"
                              onClick={() => handleVerify(doc.id, false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-[#0a0a0a] rounded-full border border-white/10 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Tout est à jour !</h3>
                <p className="text-gray-400 mt-1">Aucun document en attente de validation.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
