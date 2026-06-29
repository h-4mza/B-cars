'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, FileText, CreditCard, ShieldCheck } from 'lucide-react';

const faqs = [
  {
    category: 'Documents',
    icon: <FileText className="w-5 h-5" />,
    items: [
      {
        id: 'permis',
        question: 'Quel type de permis de conduire est requis ?',
        answer: 'Un permis de conduire valide depuis au moins 1 an est requis. Si votre permis n\'est pas en alphabet romain, un permis de conduire international est nécessaire en plus de votre permis national.'
      },
      {
        id: 'identite',
        question: 'Quelles pièces d\'identité dois-je fournir ?',
        answer: 'Vous devez présenter une carte d\'identité nationale ou un passeport en cours de validité. Le document doit être au nom du conducteur principal.'
      },
      {
        id: 'voucher',
        question: 'Dois-je imprimer mon bon de réservation ?',
        answer: 'Non, vous pouvez simplement présenter votre e-voucher sur votre smartphone au moment de la prise en charge du véhicule.'
      }
    ]
  },
  {
    category: 'Paiement & Caution',
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        id: 'paiement',
        question: 'Quels moyens de paiement sont acceptés ?',
        answer: 'Nous acceptons les cartes de crédit (Visa, MasterCard), les paiements en espèces (MAD, EUR) à l\'agence, et les virements bancaires pour les réservations à l\'avance.'
      },
      {
        id: 'caution',
        question: 'Comment fonctionne la caution ?',
        answer: 'Une pré-autorisation est effectuée sur votre carte de crédit lors de la prise en charge. Le montant dépend de la catégorie du véhicule. La carte doit impérativement être au nom du conducteur principal.'
      }
    ]
  },
  {
    category: 'Assurance & Couverture',
    icon: <ShieldCheck className="w-5 h-5" />,
    items: [
      {
        id: 'assurance',
        question: 'Que couvre l\'assurance de base ?',
        answer: 'L\'assurance de base (CDW) couvre les dommages causés au véhicule avec une franchise. Elle inclut également la responsabilité civile (RC) et la protection contre le vol.'
      },
      {
        id: 'franchise',
        question: 'Puis-je racheter la franchise ?',
        answer: 'Oui, vous pouvez souscrire à notre assurance Super CDW lors de la réservation ou au comptoir pour réduire la franchise à 0.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>('permis');

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 font-sans text-[#cccccc] selection:bg-[#C9A84C]/30 relative overflow-hidden">
      
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#111111] border border-[#C9A84C]/30 mb-6 shadow-[0_0_20px_rgba(201,168,76,0.1)]">
            <HelpCircle className="w-8 h-8 text-[#C9A84C]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">Questions Fréquentes</h1>
          <p className="text-gray-400">Trouvez rapidement les réponses à vos questions concernant la location.</p>
        </div>

        <div className="space-y-12">
          {faqs.map((category, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
                <span className="text-[#C9A84C]">{category.icon}</span>
                {category.category}
              </h2>
              
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div 
                    key={item.id} 
                    id={item.id}
                    className={`bg-[#111111] border rounded-xl overflow-hidden transition-colors duration-300 ${
                      openId === item.id ? 'border-[#C9A84C]/50 shadow-[0_0_15px_rgba(201,168,76,0.1)]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(openId === item.id ? null : item.id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className={`font-medium ${openId === item.id ? 'text-[#C9A84C]' : 'text-white'}`}>
                        {item.question}
                      </span>
                      {openId === item.id ? (
                        <ChevronUp className="w-5 h-5 text-[#C9A84C]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {openId === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-2 pt-4">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-[#111111] rounded-2xl border border-white/10 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#C9A84C]/5" />
          <div className="relative z-10">
            <h3 className="text-2xl font-serif text-white font-bold mb-2">Vous avez d'autres questions ?</h3>
            <p className="text-gray-400 mb-6">Notre équipe est disponible 7j/7 pour vous accompagner.</p>
            <a href="https://wa.me/212600000000" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#C9A84C] text-[#0a0a0a] rounded-sm font-bold hover:bg-[#F5D078] transition-colors">
              Contactez-nous sur WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
