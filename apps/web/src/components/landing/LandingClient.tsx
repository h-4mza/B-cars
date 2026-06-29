'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useBookingStore } from '@/store/useBookingStore';
import { 
  ShieldCheck, 
  Clock, 
  Car, 
  CreditCard, 
  Sparkles, 
  Award, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  MessageCircle,
  Star
} from 'lucide-react';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  pricePerDay: string | number;
  transmission: string;
  images: string[];
}

export default function LandingClient() {
  const locale = useLocale();
  const t = useTranslations('Landing');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const router = useRouter();
  const { setVehicleId, setDates } = useBookingStore();

  useEffect(() => {
    // Fetch vehicles from API
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/vehicles`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch vehicles:', err));
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Simulate loading screen
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="text-[#C9A84C] font-serif text-6xl font-bold mb-4">B</div>
          <div className="text-white tracking-widest text-xl">CARS</div>
          <motion.div 
            className="w-48 h-1 bg-white/10 mt-8 rounded-full overflow-hidden"
          >
            <motion.div 
              className="h-full bg-[#C9A84C]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#cccccc] font-sans selection:bg-[#C9A84C]/30 overflow-hidden">
      
      {/* NAVBAR */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#C9A84C]/20 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A84C] font-serif text-3xl font-bold">B</span>
              <span className="text-white text-xl tracking-widest font-semibold">CARS</span>
            </div>
            <span className="text-[10px] text-gray-400 tracking-wider">Kaouthara Bour Cars</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm hover:text-[#C9A84C] transition-colors">{t('navHome')}</a>
            <a href="#fleet" className="text-sm hover:text-[#C9A84C] transition-colors">{t('navFleet')}</a>
            <a href="#features" className="text-sm hover:text-[#C9A84C] transition-colors">{t('navServices')}</a>
            <a href="#contact" className="text-sm hover:text-[#C9A84C] transition-colors">{t('navContact')}</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium bg-white/5 rounded-full px-3 py-1 border border-white/10">
              <Link href="/ar" className={locale === 'ar' ? 'text-[#C9A84C]' : 'hover:text-white'}>AR</Link>
              <span className="text-gray-600">|</span>
              <Link href="/fr" className={locale === 'fr' ? 'text-[#C9A84C]' : 'hover:text-white'}>FR</Link>
              <span className="text-gray-600">|</span>
              <Link href="/en" className={locale === 'en' ? 'text-[#C9A84C]' : 'hover:text-white'}>EN</Link>
            </div>
            <Link href="/auth/login" className="flex items-center gap-2 text-sm text-white hover:text-[#C9A84C] transition-colors ml-4 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
            <Link href="/reservation" className="bg-[#C9A84C] text-[#0a0a0a] px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-[#F5D078] hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all duration-300 relative overflow-hidden group">
              <span className="relative z-10">{t('bookNow')}</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#0a0a0a] pt-24 px-6 md:hidden flex flex-col gap-6"
          >
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white">{t('navHome')}</a>
            <a href="#fleet" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white">{t('navFleet')}</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white">{t('navServices')}</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white">{t('navContact')}</a>
            
            <div className="flex gap-4 mt-8 border-t border-white/10 pt-8">
              <Link href="/ar" className={`text-lg ${locale === 'ar' ? 'text-[#C9A84C]' : 'text-white'}`}>AR</Link>
              <Link href="/fr" className={`text-lg ${locale === 'fr' ? 'text-[#C9A84C]' : 'text-white'}`}>FR</Link>
              <Link href="/en" className={`text-lg ${locale === 'en' ? 'text-[#C9A84C]' : 'text-white'}`}>EN</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#C9A84C]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-[#C9A84C]/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen" />
        </div>

        <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C9A84C]/30 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-sm font-medium text-[#C9A84C] tracking-wide uppercase">{t('premiumLabel')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-bold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-tajawal), var(--font-playfair), serif' }}
          >
            {t('heroTitle')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <Link href="/reservation" className="bg-[#C9A84C] text-[#0a0a0a] px-10 py-4 rounded-sm font-bold text-lg hover:bg-[#F5D078] hover:shadow-[0_0_20px_rgba(201,168,76,0.5)] transition-all duration-300 relative overflow-hidden group">
              <span className="relative z-10">{t('bookNow')}</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium tracking-wide"
          >
            <div className="flex items-center gap-2"><ShieldCheck className="text-[#C9A84C] w-5 h-5" /> {t('featureInsurance')}</div>
            <div className="flex items-center gap-2"><Clock className="text-[#C9A84C] w-5 h-5" /> {t('featureService')}</div>
            <div className="flex items-center gap-2"><Car className="text-[#C9A84C] w-5 h-5" /> {t('featureMultiple')}</div>
          </motion.div>
        </div>

        {/* Bottom fade line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-[#C9A84C] text-sm tracking-widest uppercase mb-2">{t('whyChooseUs')}</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white font-bold" style={{ fontFamily: 'var(--font-tajawal), var(--font-playfair)' }}>{t('whyChooseUsTitle')}</h3>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: ShieldCheck, title: t('featureInsurance') },
              { icon: Clock, title: t('featureService') },
              { icon: Car, title: t('featureMultiple') },
              { icon: CreditCard, title: t('featurePrice') },
              { icon: Sparkles, title: t('featureNew') },
              { icon: Award, title: t('featurePro') },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                className="group p-8 rounded-xl bg-[#111111]/80 backdrop-blur-md border border-white/5 hover:border-[#C9A84C]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.1)] flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                <feature.icon className="w-12 h-12 text-[#C9A84C] mb-6 relative z-10" />
                <h4 className="text-xl font-bold text-white mb-2 relative z-10" style={{ fontFamily: 'var(--font-tajawal)' }}>{feature.title}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FLEET SECTION */}
      <section id="fleet" className="py-24 bg-[#111111] relative border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-[#C9A84C] text-sm tracking-widest uppercase mb-2">{t('ourCollection')}</h2>
              <h3 className="text-4xl font-serif text-white font-bold" style={{ fontFamily: 'var(--font-tajawal), var(--font-playfair)' }}>{t('fleetTitle')}</h3>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
              <button className="text-sm px-4 py-2 text-white border-b-2 border-[#C9A84C]">{t('filterAll')}</button>
              <button className="text-sm px-4 py-2 text-gray-500 hover:text-white transition-colors border-b-2 border-transparent hover:border-white/20">{t('filterEconomy')}</button>
              <button className="text-sm px-4 py-2 text-gray-500 hover:text-white transition-colors border-b-2 border-transparent hover:border-white/20">{t('filterSUV')}</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.slice(0, 6).map((car, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 hover:border-[#C9A84C]/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(201,168,76,0.15)] flex flex-col"
              >
                <div className="h-48 bg-gradient-to-b from-white/5 to-transparent relative flex items-center justify-center overflow-hidden">
                  {car.images && car.images[0] ? (
                    <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                  ) : (
                    <Car className="w-24 h-24 text-gray-700 group-hover:text-[#C9A84C]/40 transition-colors duration-500" />
                  )}
                  <div className="absolute top-4 right-4 bg-[#C9A84C] text-[#0a0a0a] text-xs font-bold px-3 py-1 rounded-sm z-10">
                    Premium
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-2xl font-serif text-white mb-2">{car.brand} {car.model}</h4>
                  <div className="flex gap-4 text-xs text-gray-400 mb-6 border-b border-white/10 pb-4">
                    <span className="flex items-center gap-1"><Car className="w-3 h-3 text-[#C9A84C]" /> 5 {t('seats')}</span>
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#C9A84C]" /> {car.transmission}</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <span className="text-[#C9A84C] text-2xl font-bold">{car.pricePerDay}</span>
                      <span className="text-gray-500 text-sm"> {t('dhPerDay')}</span>
                    </div>
                    <Link href="/reservation" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-[#0a0a0a] transition-all">
                      →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            {vehicles.length === 0 && (
              <div className="col-span-3 text-center text-gray-500 py-12">
                No vehicles available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-[#C9A84C] text-sm tracking-widest uppercase mb-2">{t('simpleProcess')}</h2>
            <h3 className="text-4xl font-serif text-white font-bold" style={{ fontFamily: 'var(--font-tajawal), var(--font-playfair)' }}>{t('howItWorksTitle')}</h3>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start gap-8 relative max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#C9A84C]/10 via-[#C9A84C]/50 to-[#C9A84C]/10 z-0" />
            
            {[
              { num: "01", title: t('step1Title'), desc: t('step1Desc') },
              { num: "02", title: t('step2Title'), desc: t('step2Desc') },
              { num: "03", title: t('step3Title'), desc: t('step3Desc') }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex-1 flex flex-col items-center text-center relative z-10 w-full"
              >
                <div className="w-24 h-24 rounded-full bg-[#111111] border border-[#C9A84C]/30 flex items-center justify-center text-3xl font-serif text-[#C9A84C] mb-6 shadow-[0_0_20px_rgba(201,168,76,0.1)]">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-gray-400 text-sm max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#111111] relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[#C9A84C] text-sm tracking-widest uppercase mb-2">{t('testimonialsSubtitle')}</h2>
            <h3 className="text-4xl font-serif text-white font-bold" style={{ fontFamily: 'var(--font-tajawal), var(--font-playfair)' }}>{t('testimonialsTitle')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#0a0a0a] p-8 rounded-xl border border-white/5 relative">
              <div className="text-4xl text-[#C9A84C]/20 absolute top-4 right-6 font-serif">"</div>
              <div className="flex gap-1 mb-4 text-[#C9A84C]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">"Great service! The car was brand new and very clean. The staff was professional and the booking process was extremely smooth."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div>
                  <h5 className="text-white text-sm font-bold">Ahmed M.</h5>
                  <span className="text-gray-500 text-xs">Casablanca</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0a0a0a] p-8 rounded-xl border border-white/5 relative">
              <div className="text-4xl text-[#C9A84C]/20 absolute top-4 right-6 font-serif">"</div>
              <div className="flex gap-1 mb-4 text-[#C9A84C]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">"أفضل شركة كراء تعاملت معها. سيارات ممتازة وخدمة في المستوى المطلوب. أنصح بها بشدة!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div>
                  <h5 className="text-white text-sm font-bold">Khalid B.</h5>
                  <span className="text-gray-500 text-xs">Rabat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#C9A84C]/5 blur-3xl opacity-50 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-[#C9A84C] text-sm tracking-widest uppercase mb-2">{t('contactSubtitle')}</h2>
            <h3 className="text-4xl font-serif text-white font-bold" style={{ fontFamily: 'var(--font-tajawal), var(--font-playfair)' }}>Nous Contacter</h3>
          </div>

          <div className="bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Left: Contact Info */}
              <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10">
                  <p className="text-gray-400 mb-10 max-w-sm text-lg">{t('contactDesc')}</p>
                  
                  <div className="space-y-8">
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-[#0a0a0a] transition-all">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('phone')}</div>
                        <div className="text-white font-medium text-lg">+212 600-000000</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-[#0a0a0a] transition-all">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">WhatsApp</div>
                        <div className="text-white font-medium text-lg">+212 600-000000</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-[#0a0a0a] transition-all">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('locationLabel')}</div>
                        <div className="text-white font-medium text-lg">Casablanca, Morocco</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Map/Image Area */}
              <div className="bg-[#0a0a0a] relative min-h-[300px] flex flex-col items-center justify-center p-12 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1539604169736-e8cb372bfda0?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                
                <div className="relative z-10 mt-auto">
                  <h4 className="text-2xl font-serif text-white font-bold mb-4">Prêt à partir ?</h4>
                  <p className="text-gray-400 mb-8 text-sm max-w-[250px] mx-auto">Réservez dès maintenant et profitez de notre flotte premium.</p>
                  <Link href="/reservation" className="inline-block bg-[#C9A84C] text-[#0a0a0a] px-8 py-3 rounded-sm font-bold hover:bg-[#F5D078] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all">
                    Aller à la Réservation
                  </Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0a0a] py-12 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#C9A84C] font-serif text-2xl font-bold">B</span>
                <span className="text-white text-lg tracking-widest font-semibold">CARS</span>
              </div>
              <span className="text-xs text-gray-500">Kaouthara Bour Cars</span>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-[#C9A84C] transition-colors">Instagram</a>
              <a href="#" className="text-gray-500 hover:text-[#C9A84C] transition-colors">Facebook</a>
              <a href="#" className="text-gray-500 hover:text-[#C9A84C] transition-colors">WhatsApp</a>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/5 text-center flex flex-col md:flex-row justify-between text-xs text-gray-600">
            <p>© 2025 B CARS – Kaouthara Bour Cars. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0 flex gap-4 justify-center">
              <a href="#" className="hover:text-gray-400">Terms of Service</a>
              <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#C9A84C] rounded-full flex items-center justify-center text-[#0a0a0a] shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-110 transition-transform z-50 group">
        <MessageCircle className="w-6 h-6" />
        <div className="absolute inset-0 rounded-full border border-[#C9A84C] animate-ping opacity-75" />
      </a>
      
      {/* SHIMMER ANIMATION STYLES */}
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
