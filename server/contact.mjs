import { z } from 'zod';
import site from '../src/data/site.json' with { type:'json' };

export const WEBHOOK_URL = process.env.ENQUIRY_WEBHOOK_URL || 'https://jey.ije.mybluehost.me/webhook/c3e348d2-c233-4d71-b076-b3c57529c961';

export async function forwardToWebhook(data, webhookUrl = WEBHOOK_URL) {
  if (!webhookUrl) return;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: data.company,
      companyWebsite: data.companyWebsite || '',
      country: data.country || '',
      jobTitle: data.jobTitle || '',
      companySize: data.companySize,
      department: data.department,
      message: data.message,
      existingTools: data.existingTools || '',
      timeline: data.timeline || '',
      budget: data.budget || '',
      consent: true,
      submittedAt: new Date().toISOString(),
      source: 'Flowtivo AI Website Enquiry Form',
      // Convenience aliases for n8n workflows
      full_name: data.name,
      work_email: data.email,
      company_name: data.company,
      company_website: data.companyWebsite || '',
      job_title: data.jobTitle || '',
      company_size: data.companySize,
      role_of_interest: data.department,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Flowtivo-AI-LeadForwarder/1.0',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    console.log(`[Webhook] Forwarded enquiry to ${webhookUrl} (status: ${response.status})`);
  } catch (err) {
    console.error(`[Webhook] Could not forward to ${webhookUrl}:`, err.message);
  }
}

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(35).regex(/^[+\d\s().-]*$/).optional().default(''),
  company: z.string().trim().min(2).max(150),
  companyWebsite: z.string().trim().max(255).optional().default(''),
  country: z.string().trim().max(100).optional().default(''),
  jobTitle: z.string().trim().max(120).optional().default(''),
  companySize: z.enum(['1-999', '1000-4999', '5000-9999', '10000-49999', '50000+', '50-100', '100-250', '250-500', '1000+']),
  department: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(4000),
  existingTools: z.string().trim().max(500).optional().default(''),
  timeline: z.string().trim().max(50).optional().default('exploring'),
  budget: z.string().trim().max(50).optional().default('undetermined'),
  website: z.string().max(0).optional(),
  bot_field: z.string().max(0).optional(),
  consent: z.literal(true),
});

export function json(response, status, body, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  response.end(JSON.stringify(body));
}

export function createContactHandler(database, delivery) {
  const insert = database.prepare(`INSERT INTO inquiries
    (name, email, phone, company, company_website, country, job_title, company_size, department, message, existing_tools, timeline, budget, consent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`);

  const queue = database.prepare('INSERT INTO email_deliveries (inquiry_id) VALUES (?)');

  return async function contact(request, response) {
    if (request.method !== 'POST') {
      return json(response, 405, { error: 'Use POST to submit an enquiry.' }, { Allow: 'POST' });
    }
    if (request.headers.origin) {
      try {
        if (new URL(request.headers.origin).host !== request.headers.host) {
          return json(response, 403, { error: 'Request not allowed.' });
        }
      } catch {
        return json(response, 403, { error: 'Request not allowed.' });
      }
    }
    if (!request.headers['content-type']?.startsWith('application/json')) {
      return json(response, 415, { error: 'Expected JSON.' });
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      // Drain oversized requests without retaining their body in memory.
      if (size <= 16000) chunks.push(chunk);
    }
    if (size > 16000) return json(response, 413, { error: 'Message too large.' });
    let payload;
    try {
      payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return json(response, 400, { error: 'Invalid request.' });
    }
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      return json(response, 400, {
        error: 'Please check your details and try again.',
        fields: parsed.error.flatten().fieldErrors,
      });
    }
    if (!delivery.ready) {
      return json(response, 503, { error: `Message delivery is temporarily unavailable. Please email ${site.email} directly.` });
    }
    const data = parsed.data;
    try {
      database.exec('BEGIN IMMEDIATE');
      try {
        const result = insert.run(
          data.name,
          data.email,
          data.phone,
          data.company,
          data.companyWebsite,
          data.country,
          data.jobTitle,
          data.companySize,
          data.department,
          data.message,
          data.existingTools,
          data.timeline,
          data.budget
        );
        queue.run(result.lastInsertRowid);
        database.exec('COMMIT');
      } catch (error) { database.exec('ROLLBACK'); throw error; }
      delivery.kick();
      // Forward to external webhook asynchronously
      void forwardToWebhook(data);
      return json(response, 201, { success: true, message: 'Your enquiry has been received.' });
    } catch {
      return json(response, 503, { error: `We could not save your enquiry. Please try again or email ${site.email}.` });
    }
  };
}
