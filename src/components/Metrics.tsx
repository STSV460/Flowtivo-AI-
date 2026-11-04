import { ArrowDownRight, ArrowUpRight, Check } from 'lucide-react';
import { metrics, benchmarkContext, engineeringFeatures } from '../data/metrics';

export function Metrics() {
  const date=new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(benchmarkContext.measuredAt));
  return <section id="impact" tabIndex={-1} className="container engineering-section anchor-target" aria-labelledby="impact-heading">
    <div className="engineering-heading"><div><span className="eyebrow">ENGINEERING METRICS</span><h2 id="impact-heading">Measured. With the evidence attached.</h2></div><span className="benchmark-kind">LOCAL BENCHMARK</span></div>
    <p className="benchmark-scope"><strong>This website’s enquiry backend.</strong> {benchmarkContext.requestCount} synthetic requests, a temporary SQLite database and a local SMTP test receiver.</p>
    <div className="benchmark-grid">{metrics.map(metric=><div className="benchmark-card" key={metric.label}><strong>{metric.value}<small>{metric.unit}</small></strong><h3>{metric.label}</h3><p>{metric.detail}</p></div>)}</div>
    <div className="benchmark-meta"><span>Tested {date} · Node {benchmarkContext.runtime} · Concurrency: 1</span><a href={benchmarkContext.reportUrl} target="_blank" rel="noreferrer">View raw benchmark report<ArrowUpRight size={15}/></a></div>
    <details className="benchmark-method"><summary>Test setup and limits</summary><p>API timing covers validation, the database commit and HTTP acknowledgement. Email delivery runs separately. Test notifications went to a local receiver. This run measures the website backend; it does not measure Gmail inbox delivery, flagship workflows, customer savings or production uptime. Results depend on hosting, load and external services.</p><p>The report includes every timing sample, the repeatable command and source-file hashes.</p></details>
    <div className="engineering-features">{engineeringFeatures.map(feature=><div key={feature.title}><span><Check size={15}/>{feature.title}</span><p>{feature.detail}</p></div>)}</div>
    <div className="engineering-next"><p>For your automation, we agree the baseline and success measures before building.</p><a href="#contact">Discuss your workflow<ArrowDownRight size={15}/></a></div>
  </section>;
}
