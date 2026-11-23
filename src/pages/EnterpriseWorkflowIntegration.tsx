import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Layers, Network, Activity, GitBranch, RefreshCw, AlertCircle } from 'lucide-react';
import { CallButton, Reveal } from '../components/shared';

const challenges = [
  {
    title: 'The Siloed Enterprise Stack',
    description: 'Modern cloud SaaS applications, legacy on-premises databases, and specialized departmental tools cannot communicate seamlessly, causing fragmented data records.',
  },
  {
    title: 'Friction in Cross-Department Handoffs',
    description: 'Critical business processes stall at organizational seams—Sales handoffs to Operations, Operations handoffs to Finance—relying on manual pinging and email chains.',
  },
  {
    title: 'Fragile Custom Scripts & Zero Observability',
    description: 'Ad-hoc cron jobs and unmonitored scripts break silently when third-party APIs update, lacking execution tracing, retry logic, or alerting.',
  },
];

const capabilities = [
  {
    title: 'Bi-Directional Middleware & Connectors',
    description: 'Custom resilient middleware connecting REST, GraphQL, SOAP, Webhooks, and database streams with automated payload transformation.',
  },
  {
    title: 'Event-Driven Workflow Orchestration',
    description: 'Trigger actions across enterprise tools in real-time based on state changes, status updates, or incoming webhook payloads.',
  },
  {
    title: 'End-to-End Execution Telemetry',
    description: 'Complete observability into every API request, latency metric, and transaction status, complete with dead-letter queue routing and instant alert notifications.',
  },
];

const useCases = [
  {
    title: 'Sales-to-Finance: CRM, Contract & Billing Synchronization',
    details: 'Automatically synchronizes closed deals in Salesforce with ERP billing (NetSuite/SAP), provisions project spaces in Jira, and drafts invoices for human review.',
    impact: 'Eliminates billing delays and prevents discrepancies between sales contracts and revenue recognition.',
  },
  {
    title: 'IT & Security: Identity Provisioning & Access Lifecycle',
    details: 'Orchestrates user provisioning across Active Directory, Google Workspace, AWS IAM, and internal applications following HR system trigger events.',
    impact: 'Enforces least-privilege compliance and accelerates day-one employee onboarding.',
  },
  {
    title: 'Supply Chain & Logistics: Real-Time Partner Event Synchronization',
    details: 'Normalizes disparate EDI, XML, and JSON feeds from logistics partners into a unified database, automatically flagging shipping delays for operations review.',
    impact: 'Provides enterprise-wide visibility and reduces exception resolution time.',
  },
];

const faqs = [
  [
    'How do you manage breaking API changes from third-party enterprise vendors?',
    'We implement schema validation contracts and defensive parsing layers. If an external API returns unexpected parameters or deprecated fields, the system routes the payload to a quarantined dead-letter queue and alerts our engineering team while keeping surrounding workflows operational.',
  ],
  [
    'Can you connect cloud tools with on-premises legacy infrastructure?',
    'Yes. We establish secure communication using private API gateways, reverse proxies, or dedicated VPN tunnels without requiring you to expose sensitive internal databases directly to the public internet.',
  ],
  [
    'How do you prevent data duplication across synchronized systems?',
    'We employ idempotent request patterns, unique transaction idempotency keys, and distributed lock mechanisms to guarantee that automated transactions are processed exactly once, even during network retries.',
  ],
  [
    'What support and monitoring are provided after integration launch?',
    'We provide ongoing SLA-backed retainers that monitor webhook delivery rates, API rate limits, error budgets, and schema updates, ensuring high system uptime and proactive maintenance.',
  ],
];

export function EnterpriseWorkflowIntegration() {
  return (
    <div className="landing-page-shell">
      {/* Hero */}
      <section className="section container landing-hero">
        <Reveal immediate className="landing-hero-copy">
          <span className="eyebrow">DIGITAL TRANSFORMATION · SYSTEMS INTEGRATION</span>
          <h1>
            Enterprise Workflow Integration.<br />
            <span className="gradient-text">Connected. Resilient. Observable.</span>
          </h1>
          <p>
            Bridge disparate enterprise systems, eliminate cross-department handoff friction, and gain complete operational observability into automated business processes.
          </p>
          <div className="hero-actions">
            <CallButton className="button-primary">Schedule Integration Review</CallButton>
            <Link className="button button-outline" to="/#contact">
              Submit Stack Details <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={15} />
            <span>Bi-directional API connectors · Real-time exception observability · Idempotent architecture</span>
          </div>
        </Reveal>
      </section>

      {/* Challenges */}
      <section className="section section-band">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">INTEGRATION BOTTLENECKS</span>
            <h2>Why fragmented enterprise systems drain productivity</h2>
            <p>
              When mission-critical applications cannot exchange data reliably, operations teams become human middleware, wasting countless hours on manual synchronization.
            </p>
          </div>
          <div className="landing-grid-3">
            {challenges.map((c, i) => (
              <Reveal key={c.title} className="landing-card" delay={i * 0.05}>
                <div className="landing-card-icon"><AlertCircle size={22} /></div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">ORCHESTRATION ARCHITECTURE</span>
          <h2>Robust middleware engineered for scale</h2>
          <p>
            We build fault-tolerant integration pipelines that connect legacy infrastructure with modern cloud platforms without adding technical debt.
          </p>
        </div>
        <div className="landing-grid-3">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} className="landing-card highlight-card" delay={i * 0.05}>
              <div className="landing-card-icon"><Network size={22} /></div>
              <h3>{cap.title}</h3>
              <p>{cap.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="section section-band">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">CROSS-SYSTEM ENTERPRISE SCENARIOS</span>
            <h2>Proven workflows connecting core business systems</h2>
          </div>
          <div className="use-case-list">
            {useCases.map((u, i) => (
              <Reveal key={u.title} className="use-case-row" delay={i * 0.05}>
                <div className="use-case-index">0{i + 1}</div>
                <div className="use-case-content">
                  <h3>{u.title}</h3>
                  <p>{u.details}</p>
                  <div className="use-case-impact">
                    <Check size={15} /> <span>{u.impact}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Observability */}
      <section className="section container">
        <div className="landing-split-box">
          <div>
            <span className="eyebrow">RELIABILITY &amp; TELEMETRY</span>
            <h2>Built for enterprise application architects</h2>
            <p>
              We treat integrations as critical production infrastructure. Our architectures include comprehensive logging, cryptographic webhook verification, and automated alerting.
            </p>
            <div className="security-badges-list">
              <div><Activity size={16} /> Real-time latency tracking and error budgeting</div>
              <div><GitBranch size={16} /> Automated retry policies with exponential backoff &amp; jitter</div>
              <div><RefreshCw size={16} /> Idempotent state handling preventing duplicate execution</div>
              <div><ShieldCheck size={16} /> Encrypted payloads using TLS 1.3 and signed HMAC headers</div>
            </div>
          </div>
          <div className="landing-pilot-box">
            <span className="micro-label">ENGAGEMENT MODEL</span>
            <h3>Integration Feasibility Review</h3>
            <p>
              We evaluate your systems before writing code:
            </p>
            <ol className="pilot-steps">
              <li><strong>Step 1: API &amp; Schema Audit:</strong> Review rate limits, authentication, and payload formats.</li>
              <li><strong>Step 2: Architecture Blueprint:</strong> Define queueing, transformation logic, and fallback routes.</li>
              <li><strong>Step 3: Staged Proof-of-Concept:</strong> Validate end-to-end data flow in staging.</li>
              <li><strong>Step 4: Monitored Production Cutover:</strong> Phased traffic migration with rollback safety.</li>
            </ol>
            <div style={{ marginTop: '20px' }}>
              <CallButton className="button-primary">
                Request Integration Architecture Review
              </CallButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section section-band">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">INTEGRATION FAQS</span>
            <h2>Technical Details for Systems Architects</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details className="faq-item" data-slot="accordion-item" key={q}>
                <summary data-slot="accordion-trigger">
                  <h3>{q}</h3>
                  <ArrowRight size={17} aria-hidden="true" />
                </summary>
                <div data-slot="accordion-content">
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section container landing-cta-section">
        <div className="landing-cta-box">
          <span className="eyebrow">CONNECT YOUR ECOSYSTEM</span>
          <h2>Eliminate manual handoffs between systems.</h2>
          <p>
            Schedule a technical consultation to discuss connecting your enterprise software stack with resilient, observable AI workflows.
          </p>
          <div className="cta-button-group">
            <CallButton className="button-primary">Schedule Integration Review</CallButton>
            <Link className="button button-outline" to="/#contact">
              Send System Details <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
