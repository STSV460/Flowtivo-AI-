import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import nodemailer from 'nodemailer';
import { localSmtp } from './testing/smtp.mjs';
import { createMailQueue, CONTACT_RECIPIENT } from './mail.mjs';
import { createApp } from './app.mjs';
import { openDatabase } from './database.mjs';
import seo from '../src/data/seo.json' with { type: 'json' };
import navigation from '../src/data/navigation.json' with { type: 'json' };

let app, base, temporary, databasePath, smtp;
const testMailConfig = { enabled: true, from: 'site@example.test' };
const testTransport = () => nodemailer.createTransport({ host:'127.0.0.1', port:smtp.port, secure:false, ignoreTLS:true });
const valid = {
  name: 'Integration Test', email: 'test@example.test', phone: '+91 9000000000',
  company: 'Example Company', companySize: '1000+', department: 'Operations',
  message: 'Temporary integration test: verify standalone contact persistence.',
  website: '', consent: true,
};
const post = (payload, headers = {}) => fetch(base + '/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
  body: typeof payload === 'string' ? payload : JSON.stringify(payload),
});

before(async () => {
  temporary = await mkdtemp(join(tmpdir(), 'flowtivo-test-'));
  databasePath = join(temporary, 'inquiries.sqlite');
  smtp = await localSmtp();
  app = await createApp({ dbPath: databasePath, mail: { config:testMailConfig, transport:testTransport() } });
  app.server.listen(0, '127.0.0.1');
  await once(app.server, 'listening');
  base = `http://127.0.0.1:${app.server.address().port}`;
});
after(async () => {
  await app?.close();
  await smtp?.close();
  if (temporary) await rm(temporary, { recursive: true, force: true });
});

test('homepage serves SEO without a login redirect', async () => {
  for (const [route, page] of Object.entries(seo)) {
    const response = await fetch(base + route, { redirect: 'manual' });
    assert.equal(response.status, 200, route);
    assert.equal(response.headers.get('location'), null);
    const html = await response.text();
    assert.ok(html.includes(`<title>${page.title}</title>`), route);
    assert.ok(html.includes('id="root"'), route);
    assert.ok(!/chatgpt\.site|signin-with-chatgpt|_next\//.test(html), route);
  }
});

test('previous page URLs redirect to sections on the same homepage', async () => {
  for (const [route, section] of Object.entries(navigation.aliases)) {
    const response = await fetch(base + route, { redirect: 'manual' });
    assert.equal(response.status, 301, route);
    assert.equal(response.headers.get('location'), `/#${section}`, route);
  }
});

test('logo and application assets are served normally', async () => {
  const response = await fetch(base + '/flowtivo-logo.png');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/png');
  assert.ok((await response.arrayBuffer()).byteLength > 0);
  const html = await (await fetch(base)).text();
  const source = html.match(/src="(\/assets\/[^"]+\.js)"/)[1];
  const asset = await fetch(base + source);
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get('content-type'), /javascript/);
  const evidence = await fetch(base + '/benchmarks/enquiry-pipeline.json');
  assert.equal(evidence.status, 200);
  const report = await evidence.json();
  assert.equal(report.classification, 'Local development benchmark');
  assert.equal(report.samplesMs.length, report.methodology.requestCount);
  assert.equal(report.results.persistedEnquiries, report.methodology.requestCount);
});

test('contact validation rejects invalid fields, company size, consent and spam', async () => {
  for (const payload of [{}, { ...valid, email:'invalid' }, { ...valid, companySize:'1-10' }, { ...valid, consent:false }, { ...valid, website:'https://spam.test' }]) {
    const response = await post(payload);
    assert.equal(response.status, 400);
    assert.ok((await response.json()).error);
  }
});

test('malformed, oversized and cross-origin requests are rejected', async () => {
  assert.equal((await post('{')).status, 400);
  assert.equal((await post(JSON.stringify({ ...valid, message:'x'.repeat(17000) }))).status, 413);
  assert.equal((await post(valid, { Origin:'https://untrusted.example' })).status, 403);
  assert.equal((await post(valid, { 'Content-Type':'text/plain' })).status, 415);
});

test('valid enquiry is persisted in a real SQLite file', async () => {
  const response = await post(valid, { Origin:base });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).success, true);
  await app.delivery.flush();
  const reopened = openDatabase(databasePath);
  try {
    const rows = reopened.prepare('SELECT email, company_size, consent FROM inquiries').all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].email, valid.email);
    assert.equal(rows[0].company_size, valid.companySize);
    assert.equal(rows[0].consent, 1);
    assert.equal(reopened.prepare('SELECT status FROM email_deliveries').get().status, 'sent');
  } finally { reopened.close(); }
});

test('enquiries and private files cannot be read through public routes', async () => {
  assert.equal((await fetch(base + '/api/contact')).status, 405);
  assert.equal((await fetch(base + '/.env')).status, 404);
  assert.equal((await fetch(base + '/data/inquiries.sqlite')).status, 404);
  const response = await fetch(base + '/missing-page');
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
});


test('SMTP notification reaches the fixed recipient with every field and visitor Reply-To', () => {
  assert.equal(smtp.messages.length, 1);
  const email = smtp.messages[0];
  assert.deepEqual(email.recipients, [CONTACT_RECIPIENT]);
  assert.match(email.body, /Reply-To: Integration Test <test@example.test>/);
  for (const value of [valid.name, valid.email, valid.phone, valid.company, valid.companySize, valid.department, 'Consent: Granted']) assert.ok(email.body.includes(value), value);
  assert.ok(email.body.includes('Temporary integration test'));
});

test('temporary SMTP failure keeps a durable job and the next attempt delivers it', async () => {
  const database = openDatabase(join(temporary, 'retry.sqlite'));
  const result = database.prepare(`INSERT INTO inquiries (name,email,phone,company,company_size,department,message,consent) VALUES (?,?,?,?,?,?,?,1)`)
    .run(valid.name,valid.email,valid.phone,valid.company,valid.companySize,valid.department,valid.message);
  database.prepare('INSERT INTO email_deliveries (inquiry_id) VALUES (?)').run(result.lastInsertRowid);
  smtp.rejectNext();
  const delivery = createMailQueue(database, { config:testMailConfig, transport:testTransport() });
  try {
    await delivery.flush();
    let job = database.prepare('SELECT * FROM email_deliveries').get();
    assert.equal(job.status, 'pending');
    assert.equal(job.attempts, 1);
    assert.ok(job.next_attempt_at > Date.now());
    database.prepare('UPDATE email_deliveries SET next_attempt_at = 0').run();
    await delivery.flush();
    job = database.prepare('SELECT * FROM email_deliveries').get();
    assert.equal(job.status, 'sent');
    assert.equal(job.attempts, 2);
  } finally { await delivery.close(); database.close(); }
});

test('missing mail credentials produces an honest error and does not accept an enquiry', async () => {
  const path = join(temporary, 'unconfigured.sqlite');
  const isolated = await createApp({ dbPath:path, mail:{config:{enabled:false,from:'site@example.test'}} });
  isolated.server.listen(0,'127.0.0.1');
  await once(isolated.server,'listening');
  try {
    const response = await fetch(`http://127.0.0.1:${isolated.server.address().port}/api/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(valid) });
    assert.equal(response.status,503);
    const database = openDatabase(path);
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM inquiries').get().count,0);
    database.close();
  } finally { await isolated.close(); }
});
