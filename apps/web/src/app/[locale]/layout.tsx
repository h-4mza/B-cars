import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AuthGuard from "@/components/layout/AuthGuard";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Playfair_Display, Tajawal } from 'next/font/google';
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: "Location Voiture Maroc - Premium Rental Service",
  description: "Réservez votre véhicule haut de gamme au Maroc.",
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const tajawal = Tajawal({ subsets: ['arabic'], weight: ['300', '400', '500', '700', '800'], variable: '--font-tajawal' });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${playfair.variable} ${tajawal.variable} font-sans bg-[#0a0a0a] text-[#cccccc] selection:bg-[#C9A84C]/30`}>
        <NextIntlClientProvider messages={messages}>
          <AuthGuard>
            {children}
          </AuthGuard>
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
