import { z } from 'zod';
import { getDb } from '../../../db';
import { inquiries } from '../../../db/schema';
const schema = z.object({
 name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254),
 phone: z.string().trim().max(35).regex(/^[+\d\s().-]*$/).optional().default(''),
 company: z.string().trim().min(2).max(150), companySize: z.enum(['50-100', '100-250', '250-500']),
 department: z.enum(['HR','Finance','Sales','Customer Support','Operations','Company-wide']),
 message: z.string().trim().min(10).max(4000), website: z.string().max(0).optional(),
 consent: z.literal(true),
});
export async function POST(request: Request) {
 const origin = request.headers.get('origin');
 if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Request not allowed.' }, { status: 403 });
 if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Expected JSON.' }, { status: 415 });
 if (Number(request.headers.get('content-length') || 0) > 16000) return Response.json({ error: 'Message too large.' }, { status: 413 });
 try {
  const raw = await request.text();
  if (raw.length > 16000) return Response.json({ error: 'Message too large.' }, { status: 413 });
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return Response.json({ error: 'Please check your details and try again.', fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const { website: _website, consent: _consent, ...data } = parsed.data;
  await getDb().insert(inquiries).values(data);
  return Response.json({ success: true, message: 'Your enquiry has been received.' }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
 } catch {
  return Response.json({ error: 'We could not save your enquiry. Please try again or email pvshariharan324@gmail.com.' }, { status: 503 });
 }
}
