import { createContext, lazy, Suspense, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

const BookingDialog = lazy(() => import('./BookingDialog'));
const BookingContext = createContext<{ openBooking: (trigger?: HTMLElement) => void } | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const openBooking = useCallback((element?: HTMLElement) => {
    trigger.current = element || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setHasOpened(true);
    setOpen(true);
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
    toast.success('Thanks! Your demo request has been submitted.');
  }, []);

  return <BookingContext.Provider value={{ openBooking }}>
    {children}
    {hasOpened && <Suspense fallback={<div className="booking-launch-status" role="status">Opening your demo form…</div>}>
      <BookingDialog open={open} onOpenChange={setOpen} onComplete={complete} onRestoreFocus={restoreFocus}/>
    </Suspense>}
  </BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('Booking buttons must be rendered inside BookingProvider.');
  return context;
}
