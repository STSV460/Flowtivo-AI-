import { Dialog } from 'radix-ui';
import { FilloutStandardEmbed } from '@fillout/react';
import { X, ArrowUpRight } from 'lucide-react';
import { booking } from '../data/booking';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onRestoreFocus: () => void;
};

export default function BookingDialog({ open, onOpenChange, onComplete, onRestoreFocus }: Props) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="booking-overlay"/>
      <Dialog.Content className="booking-dialog" onCloseAutoFocus={event => { event.preventDefault(); onRestoreFocus(); }}>
        <header className="booking-dialog-header">
          <div><Dialog.Title>{booking.title}</Dialog.Title><Dialog.Description>A few details to make our conversation useful.</Dialog.Description></div>
          <Dialog.Close className="booking-dialog-close" aria-label="Close demo form"><X size={20}/></Dialog.Close>
        </header>
        <div className="booking-form-scroll">
          <FilloutStandardEmbed
            filloutId={booking.formId}
            dynamicResize
            inheritParameters
            onSubmit={onComplete}
          />
        </div>
        <footer className="booking-dialog-footer"><span>Trouble loading the form?</span><a href={booking.formUrl} target="_blank" rel="noreferrer">Open it in a new tab<ArrowUpRight size={13}/></a></footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
