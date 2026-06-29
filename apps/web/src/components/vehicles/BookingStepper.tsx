'use client';

import { usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Calendar, Settings2, UserCheck, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  { label: 'Dates', icon: Calendar, path: 'dates' },
  { label: 'Options', icon: Settings2, path: 'options' },
  { label: 'Infos', icon: UserCheck, path: 'info' },
  { label: 'Paiement', icon: CreditCard, path: 'payment' },
  { label: 'Finit', icon: CheckCircle, path: 'confirmation' },
];

export function BookingStepper() {
  const pathname = usePathname();

  return (
    <div className="mb-10 w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isActive = pathname.includes(step.path);
          const isCompleted = steps.findIndex(s => pathname.includes(s.path)) > i;

          return (
            <div key={step.path} className="relative flex flex-1 flex-col items-center">
              {/* Line */}
              {i !== 0 && (
                <div className={cn(
                  "absolute left-[-50%] top-5 h-0.5 w-full -translate-y-1/2 bg-gray-200",
                  (isActive || isCompleted) && "bg-[#C9A84C]"
                )} />
              )}
              
              {/* Circle */}
              <div className={cn(
                "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all",
                isActive && "border-[#C9A84C] text-[#C9A84C] ring-4 ring-[#C9A84C]/10",
                isCompleted && "border-[#C9A84C] bg-[#C9A84C] text-white",
                !isActive && !isCompleted && "border-gray-200 text-gray-400"
              )}>
                <step.icon className="h-5 w-5" />
              </div>
              
              <span className={cn(
                "mt-2 text-xs font-medium lg:text-sm",
                isActive ? "text-[#1B2B5E]" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
