import { createContext, lazy, Suspense, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trackEvent } from '../lib/tracking';

const BookingDialog = lazy(() => import('./BookingDialog'));
const BookingContext = createContext<{ openBooking: (trigger?: HTMLElement) => void } | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const openBooking = useCallback((element?: HTMLElement) => {
    trigger.current = element || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setHasOpened(true);
    setOpen(true);
    // Track secondary engagement: booking initiation
    trackEvent('booking_started', {
      trigger_text: element?.innerText?.slice(0, 50) || 'Direct CTA',
    }, false);
  }, []);

  const restoreFocus = useCallback(() => {
    const previous = trigger.current;
    if (previous?.isConnected && previous.getClientRects().length) previous.focus({ preventScroll: true });
    else {
      const menu = document.querySelector<HTMLElement>('.menu-toggle');
      const fallback = menu?.getClientRects().length ? menu : document.querySelector<HTMLElement>('.nav-inner > a');
      fallback?.focus({ preventScroll: true });
    }
  }, []);

  const complete = useCallback(() => {
    setOpen(false);
    const bookingId = 'bk_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    try {
      sessionStorage.setItem('flowtivo_confirmed_booking', JSON.stringify({
        id: bookingId,
        timestamp: Date.now(),
        source: 'fillout_embed',
      }));
    } catch {
      // ignore storage limitations
    }
    toast.success('Consultation booked! Redirecting to confirmation...');
    navigate(`/booking-confirmed?booking_id=${bookingId}`);
  }, [navigate]);

  return <BookingContext.Provider value={{ openBooking }}>
    {children}
    {hasOpened && <Suspense fallback={<div className="booking-launch-status" role="status">Opening consultation scheduler…</div>}>
      <BookingDialog open={open} onOpenChange={setOpen} onComplete={complete} onRestoreFocus={restoreFocus}/>
    </Suspense>}
  </BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('Booking buttons must be rendered inside BookingProvider.');
  return context;
}
