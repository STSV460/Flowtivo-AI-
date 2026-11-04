import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(35).regex(/^[+\d\s().-]*$/).optional().default(''),
  company: z.string().trim().min(2).max(150),
  companySize: z.enum(['50-100', '100-250', '250-500', '1000+']),
  department: z.enum(['HR', 'Finance', 'Sales', 'Customer Support', 'Operations', 'Company-wide']),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(),
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
    (name, email, phone, company, company_size, department, message, consent)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)`);

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
      return json(response, 503, { error: 'Message delivery is temporarily unavailable. Please email pvshariharan324@gmail.com directly.' });
    }
    const data = parsed.data;
    try {
      database.exec('BEGIN IMMEDIATE');
      try {
        const result = insert.run(data.name, data.email, data.phone, data.company, data.companySize, data.department, data.message);
        queue.run(result.lastInsertRowid);
        database.exec('COMMIT');
      } catch (error) { database.exec('ROLLBACK'); throw error; }
      delivery.kick();
      return json(response, 201, { success: true, message: 'Your enquiry has been received.' });
    } catch {
      return json(response, 503, { error: 'We could not save your enquiry. Please try again or email pvshariharan324@gmail.com.' });
    }
  };
}
