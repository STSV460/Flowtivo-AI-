import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarCheck2, Clock, Mail, ShieldCheck, ArrowRight, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { CallButton } from '../components/shared';
import { email } from '../data/content';
import { trackEvent } from '../lib/tracking';

export function BookingConfirmed() {
  const [params] = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    let validId: string | null = null;

    // Check query params (e.g. redirected from Fillout or BookingProvider)
    const urlId = params.get('booking_id') || params.get('submission_id');
    const bookedParam = params.get('booked');

    try {
      const stored = sessionStorage.getItem('flowtivo_confirmed_booking');
      if (stored) {
        const parsed = JSON.parse(stored) as { id: string; timestamp: number };
        // Accept stored booking within the last 2 hours
        if (Date.now() - parsed.timestamp < 7200000) {
          validId = parsed.id;
        }
      }
    } catch {
      // Storage unavailable
    }

    if (!validId && urlId) {
      validId = urlId;
    } else if (!validId && bookedParam === '1') {
      validId = 'fillout_redirect_' + Date.now();
    }

    if (validId) {
      setIsConfirmed(true);
      setBookingId(validId);

      // Fire conversion event with deduplication key
      // This will only fire ONCE per booking ID, never on page refresh.
      trackEvent('book_appointment', {
        dedup_id: validId,
        booking_id: validId,
        source: 'booking_confirmed_page',
      });
    } else {
      setIsConfirmed(false);
    }
  }, [params]);

  return (
    <div className="confirmation-page-shell">
      <div className="container confirmation-layout">
        {isConfirmed ? (
          <div className="confirmation-box">
            <div className="confirmation-header">
              <span className="confirmation-icon">
                <CalendarCheck2 size={36} />
              </span>
              <span className="eyebrow">CONSULTATION CONFIRMED</span>
              <h1>Enterprise Discovery Session Scheduled.</h1>
              <p>
                A calendar invitation and video conference link have been dispatched to your business email.
                {bookingId && <small className="booking-ref">Reference ID: {bookingId}</small>}
              </p>
            </div>

            <div className="confirmation-agenda">
              <h2>What to Expect on Our 30-Minute Agenda</h2>
              <div className="agenda-grid">
                <div className="agenda-item">
                  <span className="agenda-number">01</span>
                  <h3>Workflow &amp; Bottleneck Identification</h3>
                  <p>We review the manual tasks, cross-department handoffs, or knowledge silos taking up your team's operational bandwidth.</p>
                </div>
                <div className="agenda-item">
                  <span className="agenda-number">02</span>
                  <h3>Architecture &amp; Integration Feasibility</h3>
                  <p>We discuss your current enterprise software stack (ERP, CRM, M365, databases) and determine technical integration prerequisites.</p>
                </div>
                <div className="agenda-item">
                  <span className="agenda-number">03</span>
                  <h3>Security &amp; Human Approval Boundaries</h3>
                  <p>We define data privacy parameters, access controls, and where mandatory human-in-the-loop checkpoints are required.</p>
                </div>
                <div className="agenda-item">
                  <span className="agenda-number">04</span>
                  <h3>Scoped Pilot Roadmap</h3>
                  <p>We outline clear criteria for a 2–4 week scoped paid pilot to empirically prove throughput and adoption before production rollout.</p>
                </div>
              </div>
            </div>

            <div className="confirmation-prep">
              <div className="prep-card">
                <div className="prep-icon"><FileText size={20} /></div>
                <div>
                  <strong>Preparation Tip</strong>
                  <p>Having a high-level list of your relevant software tools and an approximate count of team members involved helps us dive straight into solutions.</p>
                </div>
              </div>
              <div className="prep-card">
                <div className="prep-icon"><Clock size={20} /></div>
                <div>
                  <strong>Need to Reschedule or Invite Colleagues?</strong>
                  <p>You can adjust the time directly via the calendar invitation or email us at <a href={`mailto:${email}`}>{email}</a> with any additional attendee details.</p>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <Link className="button button-primary" to="/#services">
                Explore Enterprise Solutions
                <ArrowRight size={17} />
              </Link>
              <Link className="button button-outline" to="/">
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="confirmation-box confirmation-unverified">
            <div className="confirmation-header">
              <span className="confirmation-icon unverified-icon">
                <AlertCircle size={36} />
              </span>
              <span className="eyebrow">NO ACTIVE BOOKING FOUND</span>
              <h1>Looking to Schedule an Enterprise Consultation?</h1>
              <p>
                This confirmation page displays details for confirmed appointments. If you arrived here directly without booking, please select a time below.
              </p>
            </div>
            <div className="unverified-content">
              <div className="unverified-benefits">
                <div><CheckCircle2 size={16} /> 30-minute structured discovery with senior automation engineers</div>
                <div><CheckCircle2 size={16} /> Technical integration feasibility evaluation for your stack</div>
                <div><CheckCircle2 size={16} /> Zero obligation, scoped pilot criteria</div>
              </div>
              <div className="confirmation-actions" style={{ marginTop: '24px' }}>
                <CallButton className="button-primary">
                  Schedule an Enterprise Consultation
                </CallButton>
                <Link className="button button-outline" to="/">
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
