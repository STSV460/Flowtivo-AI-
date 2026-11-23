import nodemailer from 'nodemailer';
import site from '../src/data/site.json' with { type:'json' };

export const CONTACT_RECIPIENT = site.email;

export function readMailConfig(env = process.env) {
  const host = env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(env.SMTP_PORT || 465);
  const user = env.SMTP_USER || 'pvshariharan324@gmail.com';
  const password = host === 'smtp.gmail.com' ? (env.SMTP_PASS || '').replace(/\s/g, '') : (env.SMTP_PASS || '');
  return {
    enabled: Boolean(user && password),
    from: env.MAIL_FROM || user,
    options: {
      host, port, secure: port === 465, requireTLS: port !== 465,
      auth: { user, pass: password },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
      disableFileAccess: true, disableUrlAccess: true,
      logger: false, debug: false,
    },
  };
}

export function smtpTransport(config) { return nodemailer.createTransport(config.options); }

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
const singleLine = value => String(value).replace(/[\r\n]+/g, ' ');

export function enquiryEmail(inquiry, from) {
  const fields = [
    ['Full name', inquiry.name],
    ['Work email', inquiry.email],
    ['Phone', inquiry.phone || 'Not provided'],
    ['Company', inquiry.company],
    ['Company website', inquiry.company_website || inquiry.companyWebsite || 'Not provided'],
    ['Country', inquiry.country || 'Not provided'],
    ['Job title', inquiry.job_title || inquiry.jobTitle || 'Not provided'],
    ['Company size', `${inquiry.company_size || inquiry.companySize} employees`],
    ['Department', inquiry.department],
    ['Expected timeline', inquiry.timeline || 'Exploring'],
    ['Approximate budget', inquiry.budget || 'Undetermined'],
    ['Existing tools / stack', inquiry.existing_tools || inquiry.existingTools || 'Not specified'],
    ['Message', inquiry.message],
    ['Consent', 'Granted'],
    ['Received (UTC)', inquiry.created_at],
    ['Enquiry reference', inquiry.id],
  ];
  const rows = fields.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #e5e7eb;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('');
  return {
    from: { name: 'Flowtivo AI Website', address: from },
    to: CONTACT_RECIPIENT,
    replyTo: { name: singleLine(inquiry.name), address: inquiry.email },
    subject: `New Enterprise Enquiry — ${singleLine(inquiry.company)} (${singleLine(inquiry.company_size || inquiry.companySize)})`,
    messageId: `<flowtivo-enquiry-${inquiry.id}-${inquiry.created_at.replace(/[^0-9]/g, '')}@${from.split('@')[1] || 'flowtivo.local'}>`,
    text: `New website enterprise enquiry\n\n${fields.map(([label, value]) => `${label}: ${value}`).join('\n\n')}\n\nReply to this email to contact the sender.`,
    html: `<div style="font-family:Arial,sans-serif;color:#172033;max-width:720px"><h1 style="font-size:24px">New Flowtivo AI Enterprise Enquiry</h1><p>A prospective client submitted the enterprise qualification form.</p><table style="width:100%;border-collapse:collapse">${rows}</table><p>Reply to this email to contact the sender.</p></div>`,
    disableFileAccess: true, disableUrlAccess: true,
  };
}

export function createMailQueue(database, { config = readMailConfig(), transport } = {}) {
  const ready = Boolean(transport || config.enabled);
  const sender = transport || (ready ? smtpTransport(config) : null);
  let running = null, stopped = false, timer;
  const maxAttempts = 6;
  const pending = database.prepare(`SELECT inquiries.*, email_deliveries.attempts FROM email_deliveries
    JOIN inquiries ON inquiries.id = email_deliveries.inquiry_id
    WHERE email_deliveries.status = 'pending' AND next_attempt_at <= ? ORDER BY inquiries.id LIMIT 20`);
  const claim = database.prepare(`UPDATE email_deliveries SET status = 'sending', attempts = attempts + 1, last_attempt_at = ?
    WHERE inquiry_id = ? AND status = 'pending' AND next_attempt_at <= ?`);
  const sent = database.prepare(`UPDATE email_deliveries SET status = 'sent', sent_at = CURRENT_TIMESTAMP, provider_message_id = ?, last_error = NULL WHERE inquiry_id = ?`);
  const failed = database.prepare(`UPDATE email_deliveries SET status = ?, next_attempt_at = ?, last_error = ? WHERE inquiry_id = ?`);
  const reclaim = database.prepare(`UPDATE email_deliveries SET status = 'pending' WHERE status = 'sending' AND last_attempt_at < ?`);

  async function processPending() {
    if (!ready || stopped) return;
    const now = Date.now();
    // Recover a job abandoned by a stopped process; never reclaim an active send.
    reclaim.run(now - 120000);
    for (const inquiry of pending.all(now)) {
      if (stopped || !claim.run(Date.now(), inquiry.id, Date.now()).changes) continue;
      try {
        const result = await sender.sendMail(enquiryEmail(inquiry, config.from));
        if (!result.accepted?.some(address => String(address).toLowerCase() === CONTACT_RECIPIENT)) {
          const error = new Error('Recipient was not accepted'); error.code = 'RECIPIENT_REJECTED'; throw error;
        }
        sent.run(result.messageId || '', inquiry.id);
      } catch (error) {
        const attempts = inquiry.attempts + 1;
        const status = attempts >= maxAttempts ? 'failed' : 'pending';
        const delay = Math.min(60000 * 2 ** (attempts - 1), 3600000);
        // Store error codes only: no SMTP credentials, message content or raw responses.
        const code = String(error.code || 'MAIL_ERROR').replace(/[^A-Z0-9_-]/gi, '').slice(0, 50);
        failed.run(status, Date.now() + delay, code, inquiry.id);
        console.error(`Enquiry ${inquiry.id}: email ${status === 'failed' ? 'needs attention' : 'queued for retry'} (${code}).`);
      }
    }
  }
  function flush() {
    if (!running) running = processPending().finally(() => { running = null; });
    return running;
  }
  function kick() { void flush().catch(() => console.error('Email queue processing failed; saved enquiries remain in SQLite.')); }
  if (ready) { timer = setInterval(kick, 10000); timer.unref(); kick(); }
  return {
    ready, kick, flush,
    async close() { stopped = true; clearInterval(timer); await running; sender?.close?.(); },
  };
}
