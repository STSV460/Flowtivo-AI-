import { randomUUID } from 'node:crypto';
import { inquirySchema, forwardToWebhook } from './contact.mjs';
import { readMailConfig, smtpTransport, enquiryEmail, CONTACT_RECIPIENT } from './mail.mjs';
import site from '../src/data/site.json' with { type:'json' };

const reply = (status, body, headers = {}) => Response.json(body, {
  status, headers:{ 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'X-Robots-Tag':'noindex', ...headers },
});
const unavailable = `We could not send your enquiry. Please try again or email ${site.email} directly.`;

export function createBurstLimiter({ limit = 5, windowMs = 600000, maxKeys = 5000, now = Date.now } = {}) {
  const entries = new Map();
  return key => {
    const time = now();
    for (const [id, entry] of entries) if (entry.expires <= time) entries.delete(id);
    let entry = entries.get(key);
    if (!entry) {
      if (entries.size >= maxKeys) return Math.ceil(windowMs / 1000);
      entry = { count:0, expires:time + windowMs }; entries.set(key, entry);
    }
    if (entry.count >= limit) return Math.max(1, Math.ceil((entry.expires - time) / 1000));
    entry.count++; return 0;
  };
}

export function createServerlessContactHandler({ config = readMailConfig(), transport, limit = createBurstLimiter() } = {}) {
  return async function contact(request) {
    if (request.method !== 'POST') return reply(405, { error:'Use POST to submit an enquiry.' }, { Allow:'POST' });
    const origin = request.headers.get('origin');
    if (origin) {
      try {
        if (new URL(origin).host !== new URL(request.url).host) return reply(403, { error:'Request not allowed.' });
      } catch { return reply(403, { error:'Request not allowed.' }); }
    }
    if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, { error:'Expected JSON.' });
    if (Number(request.headers.get('content-length')) > 16000) return reply(413, { error:'Message too large.' });
    let payload;
    try {
      const reader = request.body?.getReader();
      const chunks = []; let size = 0;
      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 16000) { await reader.cancel(); return reply(413, { error:'Message too large.' }); }
          chunks.push(Buffer.from(value));
        }
      }
      payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch { return reply(400, { error:'Invalid request.' }); }
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) return reply(400, { error:'Please check your details and try again.', fields:parsed.error.flatten().fieldErrors });
    if (!transport && !config.enabled) return reply(503, { error:unavailable });
    // Vercel overwrites X-Forwarded-For at its trusted edge. This bounded,
    // per-instance burst limit supplements platform protection; it is not global.
    const address = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim().slice(0, 64);
    const retryAfter = limit(address);
    if (retryAfter) return reply(429, { error:'Too many enquiries. Please wait a few minutes or email us directly.' }, { 'Retry-After':String(retryAfter) });

    const sender = transport || smtpTransport(config);
    const data = parsed.data;
    const inquiry = { ...data, company_size:data.companySize, id:randomUUID(), created_at:new Date().toISOString() };
    try {
      // Vercel has no persistent SQLite disk or always-running queue worker.
      // Acknowledge only after the SMTP provider accepts the fixed recipient.
      const result = await sender.sendMail(enquiryEmail(inquiry, config.from));
      if (!result.accepted?.some(address => String(address).toLowerCase() === CONTACT_RECIPIENT)) {
        const error = new Error('Recipient not accepted'); error.code = 'RECIPIENT_REJECTED'; throw error;
      }
      void forwardToWebhook(data);
      return reply(201, { success:true, message:'Your enquiry has been received.' });
    } catch (error) {
      const code = String(error.code || 'MAIL_ERROR').replace(/[^A-Z0-9_-]/gi, '').slice(0, 50);
      console.error(`Contact delivery failed (${code}).`);
      return reply(503, { error:unavailable });
    } finally { sender.close?.(); }
  };
}
