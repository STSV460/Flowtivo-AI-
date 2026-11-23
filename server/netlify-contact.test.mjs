import { test } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { localSmtp } from './testing/smtp.mjs';
import { createNetlifyContactHandler } from './netlify-contact.mjs';
import { createBurstLimiter } from './vercel-contact.mjs';
import { CONTACT_RECIPIENT } from './mail.mjs';

const valid = { name:'Netlify Test', email:'visitor@example.test', company:'Example Company', companySize:'1000+', department:'Operations', message:'Synthetic Netlify adapter test. No external email.', consent:true, website:'' };
const config = { enabled:true, from:'site@example.test' };
const request = (forwarded = 'spoofed') => new Request('https://flowtivoai.website/api/contact', { method:'POST', headers:{ 'content-type':'application/json', origin:'https://flowtivoai.website', 'x-forwarded-for':forwarded }, body:JSON.stringify(valid) });

test('Netlify adapter preserves request body and delivers only to business email through local SMTP', async () => {
  const smtp = await localSmtp();
  const transport = nodemailer.createTransport({ host:'127.0.0.1', port:smtp.port, secure:false, ignoreTLS:true });
  const handler = createNetlifyContactHandler({ config, transport });
  try {
    const response = await handler(request(), { ip:'192.0.2.1' });
    assert.equal(response.status, 201);
    assert.deepEqual(smtp.messages[0].recipients, ['automation@flowtivoai.website']);
    assert.match(smtp.messages[0].body, /Reply-To: Netlify Test <visitor@example.test>/);
    assert.ok(smtp.messages[0].body.includes(valid.message));
    smtp.rejectNext();
    assert.equal((await handler(request(), { ip:'192.0.2.1' })).status, 503);
  } finally { transport.close(); await smtp.close(); }
});

test('Netlify limiter trusts runtime IP despite forged forwarding headers and fails closed without context', async () => {
  let sends = 0;
  const handler = createNetlifyContactHandler({ config, limit:createBurstLimiter({ limit:1 }), transport:{ async sendMail(){ sends++; return { accepted:[CONTACT_RECIPIENT] }; } } });
  assert.equal((await handler(request('attacker-a'), { ip:'192.0.2.1' })).status, 201);
  assert.equal((await handler(request('attacker-b'), { ip:'192.0.2.1' })).status, 429);
  assert.equal((await handler(request('attacker-a'), { ip:'192.0.2.2' })).status, 201);
  assert.equal((await handler(request('attacker-a'))).status, 201);
  assert.equal((await handler(request('attacker-b'))).status, 429);
  assert.equal(sends, 3);
});
