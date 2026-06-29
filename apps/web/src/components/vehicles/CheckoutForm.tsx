'use client';

import { useState } from 'react';
import { 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export function CheckoutForm({ reservationId }: { reservationId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/reservations/${reservationId}?payment_success=true`,
      },
    });

    if (error) {
      toast.error(error.message || 'Une erreur est survenue');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement className="mb-6" />
      
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-4">
        <Lock className="h-3 w-3" />
        <span>Paiement sécurisé par Stripe. Vos données sont chiffrées.</span>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#1B2B5E] h-14 text-lg font-bold hover:bg-[#1B2B5E]/90"
      >
        {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
      </Button>
    </form>
  );
}
