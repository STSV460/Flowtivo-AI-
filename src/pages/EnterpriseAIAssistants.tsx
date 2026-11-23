import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Brain, Lock, Search, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';
import { CallButton, Reveal } from '../components/shared';

const challenges = [
  {
    title: 'Sprawling, Disconnected Information',
    description: 'Corporate policies, SOPs, engineering runbooks, and client records are fragmented across SharePoint, Confluence, Google Drive, and internal wikis.',
  },
  {
    title: 'Unsanctioned Consumer AI & Data Leakage',
    description: 'Employees paste sensitive proprietary documents and customer PII into public chatbots, creating severe data sovereignty and compliance vulnerabilities.',
  },
  {
    title: 'Hallucination & Lack of Auditability',
    description: 'Generic AI models generate unverified answers without citing the exact clause, document version, or source paragraph, making verification impossible.',
  },
];

const capabilities = [
  {
    title: 'Source-Grounded Retrieval (RAG)',
    description: 'Every answer is mathematically anchored to your approved corporate documentation, with interactive citations linking directly to verified pages and sections.',
  },
  {
    title: 'Role-Based Access Control (RBAC)',
    description: 'Integrates with enterprise identity providers (Okta, Azure AD) so employees only retrieve answers from documents their permission tier allows.',
  },
  {
    title: 'Continuous Document Synchronization',
    description: 'Automated delta-indexing pipelines keep the assistant synchronized with updated manuals, policy revisions, and newly approved documentation.',
  },
];

const useCases = [
  {
    title: 'Operations & Engineering: Technical Runbook & SOP Assistant',
    details: 'Enables field engineers and plant operators to instantly query complex standard operating procedures, maintenance logs, and safety protocols with verifiable citations.',
    impact: 'Reduces lookup time from hours to seconds and prevents procedural errors.',
  },
  {
    title: 'HR & People Ops: Policy, Benefits & Onboarding Assistant',
    details: 'Answers complex multi-jurisdictional employee questions regarding leave policies, health benefits, and compliance guidelines, citing internal handbooks.',
    impact: 'Deflects up to 60% of repetitive internal HR queries while maintaining accuracy.',
  },
  {
    title: 'Customer Support & Sales: Product Knowledge Copilot',
    details: 'Equips customer-facing representatives with immediate, verified answers to technical product specifications, contract terms, and compliance requirements.',
    impact: 'Shortens sales cycles and improves first-contact resolution rates.',
  },
];

const faqs = [
  [
    'How do you prevent the AI assistant from hallucinating false information?',
    'We employ advanced Retrieval-Augmented Generation (RAG) with strict prompt constraints: the model is instructed to answer strictly based on retrieved document chunks. If the verified knowledge base does not contain the answer, the assistant explicitly states that information is not available rather than guessing.',
  ],
  [
    'Is company data used to train AI models?',
    'No. We exclusively utilize enterprise tenant APIs with zero data retention and strict guarantees that customer inputs, outputs, and embeddings are never stored or used to train public foundation models.',
  ],
  [
    'How are access permissions enforced during search?',
    'Permissions are filtered at query time. The search engine checks the user’s authenticated identity against document access control lists (ACLs) before retrieving context, ensuring users never see answers derived from restricted documents.',
  ],
  [
    'What document formats and repositories are supported?',
    'We support PDFs, Word documents, Excel sheets, markdown files, SharePoint, Google Drive, Notion, Confluence, Jira, and custom database knowledge stores.',
  ],
];

export function EnterpriseAIAssistants() {
  return (
    <div className="landing-page-shell">
      {/* Hero */}
      <section className="section container landing-hero">
        <Reveal immediate className="landing-hero-copy">
          <span className="eyebrow">ENTERPRISE IT · INTERNAL AI ASSISTANTS</span>
          <h1>
            Source-Grounded AI Assistants.<br />
            <span className="gradient-text">Zero Public Data Leakage.</span>
          </h1>
          <p>
            Private, permission-aware internal AI assistants that retrieve verified answers from your corporate documentation, wikis, and SOP repositories—with exact source citations.
          </p>
          <div className="hero-actions">
            <CallButton className="button-primary">Schedule Assistant Demo</CallButton>
            <Link className="button button-outline" to="/#contact">
              Discuss Knowledge Architecture <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={15} />
            <span>Role-based access control · Zero model training on enterprise data · Verifiable citations</span>
          </div>
        </Reveal>
      </section>

      {/* Challenges */}
      <section className="section section-band">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">THE ENTERPRISE KNOWLEDGE CRISIS</span>
            <h2>Why unstructured corporate data wastes executive time</h2>
            <p>
              In large enterprises, critical institutional knowledge is locked inside thousands of scattered documents, leaving employees guessing or relying on shadow AI tools.
            </p>
          </div>
          <div className="landing-grid-3">
            {challenges.map((c, i) => (
              <Reveal key={c.title} className="landing-card" delay={i * 0.05}>
                <div className="landing-card-icon"><AlertOctagon size={22} /></div>
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
          <span className="eyebrow">ENTERPRISE-GRADE ARCHITECTURE</span>
          <h2>Secure, verifiable knowledge retrieval</h2>
          <p>
            Our internal AI assistants are engineered around strict corporate boundaries, ensuring verifiable precision and enterprise compliance.
          </p>
        </div>
        <div className="landing-grid-3">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} className="landing-card highlight-card" delay={i * 0.05}>
              <div className="landing-card-icon"><Brain size={22} /></div>
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
            <span className="eyebrow">HIGH-VALUE DEPARTMENTAL USE CASES</span>
            <h2>Empower enterprise teams with instant answers</h2>
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

      {/* Security Deep Dive */}
      <section className="section container">
        <div className="landing-split-box">
          <div>
            <span className="eyebrow">DATA SECURITY &amp; PRIVACY</span>
            <h2>Architected for Chief Information Officers</h2>
            <p>
              We implement enterprise security by design. Your documentation never leaves private VPC boundaries, and all vector indices are encrypted at rest and in transit.
            </p>
            <div className="security-badges-list">
              <div><Lock size={16} /> Encryption via AES-256 at rest and TLS 1.3 in transit</div>
              <div><Search size={16} /> Strict query-time ACL filtering prevents cross-department data exposure</div>
              <div><FileText size={16} /> Verifiable, clickable citations linking to source documents</div>
              <div><CheckCircle2 size={16} /> Zero data training on proprietary customer prompts</div>
            </div>
          </div>
          <div className="landing-pilot-box">
            <span className="micro-label">SCOPED PROOF-OF-VALUE</span>
            <h3>4-Week Knowledge Pilot</h3>
            <p>
              Test internal assistant accuracy against your real corporate documentation:
            </p>
            <ol className="pilot-steps">
              <li><strong>Week 1: Document Curation:</strong> Ingest sample SOPs and internal handbooks.</li>
              <li><strong>Week 2: RAG Pipeline Indexing:</strong> Configure vector search and RBAC mapping.</li>
              <li><strong>Week 3: Blind Benchmark Evaluation:</strong> Measure accuracy and citation fidelity.</li>
              <li><strong>Week 4: Stakeholder Enablement:</strong> Departmental review and rollout plan.</li>
            </ol>
            <div style={{ marginTop: '20px' }}>
              <CallButton className="button-primary">
                Book an Assistant Pilot Call
              </CallButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section section-band">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">TECHNICAL FAQS</span>
            <h2>Answers for IT &amp; Security Teams</h2>
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
          <span className="eyebrow">EMPOWER YOUR WORKFORCE</span>
          <h2>Unlock institutional knowledge with confidence.</h2>
          <p>
            Connect with our engineering specialists to schedule a private demonstration of our source-grounded assistant architecture.
          </p>
          <div className="cta-button-group">
            <CallButton className="button-primary">Schedule Assistant Demo</CallButton>
            <Link className="button button-outline" to="/#contact">
              Send Technical Enquiry <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
