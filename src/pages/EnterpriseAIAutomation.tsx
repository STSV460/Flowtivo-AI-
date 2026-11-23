import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Workflow, Settings, Activity, AlertTriangle, Users, Database } from 'lucide-react';
import { CallButton, Reveal, Brand } from '../components/shared';

const challenges = [
  {
    title: 'High-Volume Manual Friction',
    description: 'Teams spend tens of thousands of hours re-keying data, reconciling spreadsheets, and managing routine requests between ERPs, CRMs, and ticketing systems.',
  },
  {
    title: 'Process Inconsistency & Human Error',
    description: 'Manual handoffs without automated schema validation lead to data discrepancies, delayed customer fulfillment, and increased audit risks.',
  },
  {
    title: 'Lack of Real-Time Execution Observability',
    description: 'Disconnected automations and unmonitored scripts create black boxes where failed executions stall business operations silently.',
  },
];

const capabilities = [
  {
    title: 'End-to-End Workflow Orchestration',
    description: 'Connect enterprise applications (Salesforce, SAP, ServiceNow, Jira, Slack, Microsoft 365) into resilient, observable execution pipelines.',
  },
  {
    title: 'Mandatory Human-in-the-Loop Approval Gates',
    description: 'High-consequence actions (financial updates, external transmissions, permission adjustments) require explicit human sign-off via interactive chat or dashboard.',
  },
  {
    title: 'Automated Exception Handling & Telemetry',
    description: 'Every execution is logged with complete timing, payload schemas, and fallback routing so anomalies are caught immediately.',
  },
];

const useCases = [
  {
    title: 'Operations: Multi-System Invoice & PO Reconciliation',
    details: 'Automates extraction, cross-referencing against ERP purchase orders, line-item validation, and discrepancy routing for human supervisor sign-off.',
    impact: 'Reduces manual reconciliation cycles while maintaining full audit logging.',
  },
  {
    title: 'IT & Service Desk: Automated Incident Triage & Dispatch',
    details: 'Parses incoming incident alerts, performs initial log correlation, categorizes urgency based on SLA policies, and routes pre-populated briefs to on-call teams.',
    impact: 'Eliminates tier-1 triage latency and standardizes incident records.',
  },
  {
    title: 'HR & Operations: Enterprise Employee Onboarding Workflows',
    details: 'Coordinates multi-department account provisioning, compliance document collection, role-specific hardware assignment, and manager check-in cadences.',
    impact: 'Standardizes cross-department handoffs with zero missed compliance milestones.',
  },
];

const faqs = [
  [
    'How do human-in-the-loop approvals work in enterprise automations?',
    'Workflows can be configured with mandatory approval gates at any stage. When a threshold is met (e.g. monetary value, risk classification, or anomaly score), the system pauses execution, prepares a concise decision brief, and notifies the designated reviewer via Slack, Microsoft Teams, or email. Execution only resumes upon cryptographic or authenticated human confirmation.',
  ],
  [
    'Can you integrate with on-premises or legacy enterprise systems?',
    'Yes. We build custom connectors and secure API proxies that interface with on-premises databases, legacy SOAP services, REST endpoints, and secure SFTP file drops without compromising internal network boundaries.',
  ],
  [
    'What is the typical pilot engagement structure?',
    'We offer a tightly scoped 2–4 week paid pilot focused on a single high-friction departmental workflow. The pilot validates API reliability, data schema accuracy, and user adoption in a staging environment before committing to wider enterprise rollout.',
  ],
  [
    'How is operational exception handling managed?',
    'Every workflow incorporates retry policies with exponential backoff, dead-letter queue routing, and automated alert dispatch to your observability platforms (e.g. Datadog, PagerDuty, or Slack). Workflows never fail silently.',
  ],
];

export function EnterpriseAIAutomation() {
  return (
    <div className="landing-page-shell">
      {/* Hero Section */}
      <section className="section container landing-hero">
        <Reveal immediate className="landing-hero-copy">
          <span className="eyebrow">ENTERPRISE OPERATIONS · WORKFLOW AUTOMATION</span>
          <h1>
            Enterprise AI Automation.<br />
            <span className="gradient-text">Engineered for Reliability.</span>
          </h1>
          <p>
            Eliminate repetitive manual operations, connect legacy enterprise software, and enforce mandatory human approval gates across your departments.
          </p>
          <div className="hero-actions">
            <CallButton className="button-primary">Schedule an Operations Discovery Call</CallButton>
            <Link className="button button-outline" to="/#contact">
              Submit Requirements <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={15} />
            <span>Built for 10,000+ employee enterprises · Human-in-the-loop governance · Scoped paid pilots</span>
          </div>
        </Reveal>
      </section>

      {/* Core Challenges Section */}
      <section className="section section-band">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OPERATIONAL BOTTLENECKS</span>
            <h2>Why manual enterprise processes stall execution</h2>
            <p>
              As organizations scale beyond thousands of employees, manual coordination between disconnected software stacks becomes the primary constraint on operational velocity.
            </p>
          </div>
          <div className="landing-grid-3">
            {challenges.map((c, i) => (
              <Reveal key={c.title} className="landing-card" delay={i * 0.05}>
                <div className="landing-card-icon"><AlertTriangle size={22} /></div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution & Capabilities */}
      <section className="section container">
        <div className="section-heading">
          <span className="eyebrow">OUR SOLUTION</span>
          <h2>Resilient AI workflow orchestration</h2>
          <p>
            We architect departmental automations that eliminate manual copy-paste routines while ensuring human operators retain total control over critical business decisions.
          </p>
        </div>
        <div className="landing-grid-3">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} className="landing-card highlight-card" delay={i * 0.05}>
              <div className="landing-card-icon"><Workflow size={22} /></div>
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
            <span className="eyebrow">REPRESENTATIVE ENTERPRISE USE CASES</span>
            <h2>Where enterprise automation drives measurable impact</h2>
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

      {/* Security & Governance */}
      <section className="section container">
        <div className="landing-split-box">
          <div>
            <span className="eyebrow">GOVERNANCE &amp; SECURITY</span>
            <h2>Enterprise compliance without compromise</h2>
            <p>
              Your enterprise security posture comes first. We integrate using zero-data-retention APIs, role-based access control (RBAC), and private tenant hosting. Client data is never stored on external AI servers or used for model training.
            </p>
            <div className="security-badges-list">
              <div><ShieldCheck size={16} /> Private API endpoints &amp; tenant isolation</div>
              <div><ShieldCheck size={16} /> Role-based access control aligned with Active Directory / Okta</div>
              <div><ShieldCheck size={16} /> Comprehensive audit trails with immutable execution logs</div>
              <div><ShieldCheck size={16} /> Full runbook documentation &amp; handover</div>
            </div>
          </div>
          <div className="landing-pilot-box">
            <span className="micro-label">PILOT METHODOLOGY</span>
            <h3>The Scoped Paid Pilot</h3>
            <p>
              Validate feasibility and business value before broad enterprise commitment:
            </p>
            <ol className="pilot-steps">
              <li><strong>1. Discovery &amp; API Assessment (Week 1):</strong> Map data flows and authentication parameters.</li>
              <li><strong>2. Isolated Pilot Build (Weeks 2–3):</strong> Implement the automated workflow in a staging environment.</li>
              <li><strong>3. Telemetry &amp; Adoption Review (Week 4):</strong> Measure error rates, cycle time, and user feedback.</li>
            </ol>
            <div style={{ marginTop: '20px' }}>
              <CallButton className="button-primary">
                Discuss a Scoped Pilot
              </CallButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section section-band">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">FAQS</span>
            <h2>Questions from Operations Leaders</h2>
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

      {/* Final CTA */}
      <section className="section container landing-cta-section">
        <div className="landing-cta-box">
          <span className="eyebrow">START WITH A STRUCTURED DISCOVERY</span>
          <h2>Accelerate your enterprise workflows today.</h2>
          <p>
            Schedule a 30-minute discovery call with our senior engineering team to evaluate your automation challenges and integration feasibility.
          </p>
          <div className="cta-button-group">
            <CallButton className="button-primary">Schedule Consultation</CallButton>
            <Link className="button button-outline" to="/#contact">
              Send Enquiry Message <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
