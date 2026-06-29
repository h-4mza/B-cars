'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, Link } from '@/i18n/routing';
import { toast } from 'sonner';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      // We need to fetch /me to get user details
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/me`, {
        credentials: 'include',
      });

      if (!userResponse.ok) {
        throw new Error('Impossible de récupérer le profil');
      }

      const userData = await userResponse.json();
      setUser({
        id: userData.userId || userData.id,
        email: userData.email,
        role: userData.role,
      });
      if (userData.role !== 'ADMIN' && userData.role !== 'AGENT') {
        throw new Error('Accès refusé. Seuls les administrateurs peuvent se connecter.');
      }
      
      toast.success('Connexion réussie');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 font-sans selection:bg-[#C9A84C]/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] bg-[#C9A84C]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none" />

      <Card className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 overflow-hidden rounded-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <CardHeader className="space-y-1 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[#C9A84C] font-serif text-3xl font-bold">B</span>
              <span className="text-white text-xl tracking-widest font-semibold">CARS</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-white tracking-wide">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-gray-400 uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                {...register('email')}
                className={`w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-6 text-white focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-gray-600 ${errors.email ? 'border-red-500/50' : ''}`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-gray-400 uppercase tracking-wider">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={`w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-4 py-6 text-white focus:outline-none focus:border-[#C9A84C] transition-colors ${errors.password ? 'border-red-500/50' : ''}`}
              />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full mt-2 bg-[#C9A84C] text-[#0a0a0a] py-6 rounded-sm font-bold text-lg hover:bg-[#F5D078] hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all duration-300 relative overflow-hidden group border-none"
              disabled={isSubmitting}
            >
              <span className="relative z-10">{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
          </form>

        </CardContent>
      </Card>
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
