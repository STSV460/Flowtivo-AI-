import benchmark from './enquiry-benchmark.json';

// Every displayed value comes from the reproducible report, never a marketing counter.
const latency = benchmark.results.acknowledgementMs;
export const metrics = [
  { value:latency.p50.toFixed(2), unit:'ms', label:'Median API acknowledgement', detail:'Request start through the complete response body, including validation and SQLite commit.' },
  { value:latency.p95.toFixed(2), unit:'ms', label:'P95 API acknowledgement', detail:`95th percentile across ${benchmark.methodology.requestCount} sequential synthetic requests.` },
  { value:`${benchmark.results.localNotificationsReceived}/${benchmark.methodology.requestCount}`, unit:'', label:'Local test notifications received', detail:'Notification receipts checked against saved enquiries using a disposable local SMTP receiver.' },
];
export const benchmarkContext = {
  measuredAt:benchmark.measuredAt,
  requestCount:benchmark.methodology.requestCount,
  runtime:benchmark.environment.runtime,
  reportUrl:'/benchmarks/enquiry-pipeline.json',
  scope:benchmark.scope,
};
export const engineeringFeatures = [
  {title:'Validate before accepting',detail:'Required fields, email format, company size and consent are checked before an enquiry is saved.'},
  {title:'Save before acknowledging',detail:'The enquiry and notification job are committed together in one SQLite transaction.'},
  {title:'Recover delivery failures',detail:'Temporary mail errors retain the enquiry and retry through a persistent queue with backoff.'},
];
