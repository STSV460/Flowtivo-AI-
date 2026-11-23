import { test } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { localSmtp } from './testing/smtp.mjs';
import { createServerlessContactHandler, createBurstLimiter } from './vercel-contact.mjs';
import { CONTACT_RECIPIENT } from './mail.mjs';

const valid = { name:'Vercel Test', email:'visitor@example.test', phone:'+91 9000000000', company:'Example Enterprise', companySize:'10000-49999', department:'Operations', companyWebsite:'https://enterprise.example.test', country:'United Kingdom', jobTitle:'Head of Digital Transformation', existingTools:'Salesforce, SAP', timeline:'immediate', budget:'50k-plus', message:'Synthetic contact delivery test with no external email.', consent:true, website:'' };
const config = { enabled:true, from:'site@example.test' };
const request = (body = valid, headers = {}) => new Request('https://flowtivoai.website/api/contact', { method:'POST', headers:{ 'Content-Type':'application/json', Origin:'https://flowtivoai.website', ...headers }, body:typeof body === 'string' ? body : JSON.stringify(body) });

test('Vercel contact acknowledges only after real SMTP accepts the fixed recipient', async () => {
  const smtp = await localSmtp();
  const transport = nodemailer.createTransport({ host:'127.0.0.1', port:smtp.port, secure:false, ignoreTLS:true });
  const handler = createServerlessContactHandler({ config, transport });
  try {
    const response = await handler(request());
    assert.equal(response.status, 201);
    assert.equal((await response.json()).success, true);
    assert.equal(smtp.messages.length, 1);
    assert.deepEqual(smtp.messages[0].recipients, [CONTACT_RECIPIENT]);
    assert.match(smtp.messages[0].body, /Reply-To: Vercel Test <visitor@example.test>/);
    for (const field of [valid.name, valid.email, valid.phone, valid.company, valid.companySize, valid.department, valid.companyWebsite, valid.country, valid.jobTitle, 'Consent: Granted']) assert.ok(smtp.messages[0].body.includes(field), field);
    smtp.rejectNext();
    const rejected = await handler(request());
    assert.equal(rejected.status, 503);
    assert.equal((await rejected.json()).success, undefined);
  } finally { transport.close(); await smtp.close(); }
});

test('Vercel contact rejects malformed, oversized and cross-origin requests before sending', async () => {
  let sends = 0;
  const handler = createServerlessContactHandler({ config, transport:{ async sendMail(){ sends++; return { accepted:[CONTACT_RECIPIENT] }; } } });
  for (const [payload, headers, status] of [['{',{},400], [valid,{ Origin:'https://attacker.test' },403], [valid,{ 'Content-Type':'text/plain' },415], [{ ...valid, message:'x'.repeat(17000) },{},413], [valid,{ 'Content-Length':'17000' },413]]) assert.equal((await handler(request(payload, headers))).status, status);
  assert.equal(sends, 0);
  assert.equal((await handler(new Request('https://flowtivoai.website/api/contact'))).status, 405);
});

test('Vercel validation blocks invalid consent, email, honeypot and collection values', async () => {
  const handler = createServerlessContactHandler({ config, transport:{ async sendMail(){ throw new Error('Must not send'); } } });
  for (const payload of [{}, { ...valid, consent:false }, { ...valid, email:'invalid' }, { ...valid, website:'spam' }, { ...valid, name:['bad'] }, { ...valid, companySize:'1-10' }]) assert.equal((await handler(request(payload))).status, 400);
});

test('missing SMTP credentials and recipient rejection never produce false success', async () => {
  const disabled = createServerlessContactHandler({ config:{ enabled:false } });
  assert.equal((await disabled(request())).status, 503);
  const rejected = createServerlessContactHandler({ config, transport:{ async sendMail(){ return { accepted:[] }; } } });
  const response = await rejected(request());
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
});

test('enquiry email escapes visitor HTML and ignores attacker-selected recipients', async () => {
  let mail;
  const handler = createServerlessContactHandler({ config, transport:{ async sendMail(value){ mail=value; return { accepted:[CONTACT_RECIPIENT] }; } } });
  const response = await handler(request({ ...valid, name:'<script>alert(1)</script>', message:'<img src=x onerror=alert(1)>', to:'attacker@example.test', attachments:[{ path:'/etc/passwd' }] }));
  assert.equal(response.status, 201);
  assert.equal(mail.to, CONTACT_RECIPIENT);
  assert.ok(!mail.html.includes('<script>'));
  assert.ok(mail.html.includes('&lt;img'));
  assert.equal(mail.attachments, undefined);
  assert.equal(mail.disableFileAccess, true);
  assert.equal(mail.disableUrlAccess, true);
});

test('contact burst protection returns Retry-After and stops additional email sends', async () => {
  let sends = 0;
  const handler = createServerlessContactHandler({ config, limit:createBurstLimiter({ limit:2 }), transport:{ async sendMail(){ sends++; return { accepted:[CONTACT_RECIPIENT] }; } } });
  assert.equal((await handler(request())).status, 201);
  assert.equal((await handler(request())).status, 201);
  const limited = await handler(request());
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
  assert.equal(sends, 2);
});

test('bounded burst limiter expires windows and fails closed at capacity', () => {
  let now = 0;
  const limit = createBurstLimiter({ limit:1, maxKeys:1, windowMs:1000, now:()=>now });
  assert.equal(limit('client-a'), 0);
  assert.equal(limit('client-a'), 1);
  assert.equal(limit('client-b'), 1);
  now = 1001;
  assert.equal(limit('client-b'), 0);
});
