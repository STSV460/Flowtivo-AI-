// Reproducible local benchmark. No .env loading, real credentials or external email.
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir, platform, arch } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import nodemailer from 'nodemailer';
import { createApp } from '../server/app.mjs';
import { openDatabase } from '../server/database.mjs';
import { localSmtp } from '../server/testing/smtp.mjs';

const requestCount=100;
const temporary=await mkdtemp(join(tmpdir(),'flowtivo-benchmark-'));
const databasePath=join(temporary,'benchmark.sqlite');
let smtp,app,database;
try {
  smtp=await localSmtp();
  const transport=nodemailer.createTransport({host:'127.0.0.1',port:smtp.port,secure:false,ignoreTLS:true});
  app=await createApp({dbPath:databasePath,mail:{config:{enabled:true,from:'benchmark@example.test'},transport}});
  app.server.listen(0,'127.0.0.1');await once(app.server,'listening');
  const endpoint=`http://127.0.0.1:${app.server.address().port}/api/contact`;
  const latencies=[];
  for(let index=0;index<requestCount;index++) {
    const payload={name:'Benchmark Test',email:`bench-${index}@example.test`,phone:'',company:`Benchmark case ${index}`,companySize:'1000+',department:'Operations',message:`Synthetic benchmark enquiry reference ${index}. No real customer data.`,website:'',consent:true};
    const started=performance.now();
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json();
    latencies.push(performance.now()-started);
    assert.equal(response.status,201);assert.equal(result.success,true);
  }
  database=openDatabase(databasePath);
  for(let attempt=0;attempt<requestCount;attempt++) {
    await app.delivery.flush();
    if(database.prepare("SELECT COUNT(*) AS count FROM email_deliveries WHERE status='sent'").get().count===requestCount)break;
  }
  const records=database.prepare('SELECT email,company,message FROM inquiries ORDER BY id').all();
  const sent=database.prepare("SELECT COUNT(*) AS count FROM email_deliveries WHERE status='sent'").get().count;
  assert.equal(records.length,requestCount);assert.equal(sent,requestCount);assert.equal(smtp.messages.length,requestCount);
  records.forEach((record,index)=>{
    assert.equal(record.email,`bench-${index}@example.test`);
    assert.equal(record.company,`Benchmark case ${index}`);
    assert.equal(record.message,`Synthetic benchmark enquiry reference ${index}. No real customer data.`);
    assert.ok(smtp.messages.some(message=>message.body.includes(`Reply-To: Benchmark Test <bench-${index}@example.test>`)));
  });
  const sorted=[...latencies].sort((a,b)=>a-b);
  const percentile=p=>sorted[Math.ceil(p*sorted.length)-1];
  const round=value=>Number(value.toFixed(3));
  const sourceFiles=['scripts/benchmark-contact.mjs','server/app.mjs','server/contact.mjs','server/database.mjs','server/mail.mjs','server/testing/smtp.mjs'];
  const sourceHashes={};
  for(const file of sourceFiles)sourceHashes[file]=createHash('sha256').update(await readFile(file)).digest('hex');
  const report={
    schemaVersion:1,
    measuredAt:new Date().toISOString(),
    classification:'Local development benchmark',
    scope:'This website’s enquiry API and notification queue only; not flagship workflows or client deployments.',
    environment:{runtime:process.version,platform:platform(),architecture:arch(),http:'loopback HTTP',storage:'temporary SQLite file',smtp:'disposable loopback SMTP receiver'},
    methodology:{command:'npm run benchmark:contact',endpoint:'POST /api/contact',requestCount,concurrency:1,warmupRequests:0,backgroundWorkerEnabled:true,timing:'Client request start through complete HTTP acknowledgement body. Includes validation and SQLite commit; excludes SMTP delivery, third-party APIs, frontend rendering and scheduling.',delivery:'After requests complete, flush the queue and check saved records, sent status, local SMTP receipt count and each synthetic sender Reply-To.'},
    results:{acknowledgementMs:{p50:round(percentile(.5)),p95:round(percentile(.95)),min:round(sorted[0]),max:round(sorted.at(-1))},acceptedRequests:requestCount,persistedEnquiries:records.length,localNotificationsReceived:smtp.messages.length,queueJobsSent:sent},
    samplesMs:latencies.map(round),
    sourceSha256:sourceHashes,
    limitations:['Single local run with synthetic data and sequential requests; not a production load test.','Local SMTP receipt is not Gmail inbox delivery.','No uptime, customer savings, deployed-project count or flagship-system performance was measured.','Results vary with hardware, hosting, concurrency and external providers.'],
  };
  const serialized=JSON.stringify(report,null,2)+'\n';
  await mkdir('public/benchmarks',{recursive:true});
  await writeFile('src/data/enquiry-benchmark.json',serialized);
  await writeFile('public/benchmarks/enquiry-pipeline.json',serialized);
  console.log(JSON.stringify({requests:requestCount,p50Ms:report.results.acknowledgementMs.p50,p95Ms:report.results.acknowledgementMs.p95,persisted:records.length,localNotifications:smtp.messages.length,report:'public/benchmarks/enquiry-pipeline.json'}));
} finally {
  database?.close();await app?.close();await smtp?.close();await rm(temporary,{recursive:true,force:true});
}
