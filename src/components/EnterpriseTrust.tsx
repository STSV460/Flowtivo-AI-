import { ShieldCheck, Lock, Users, Activity, FileCheck, Layers } from 'lucide-react';
import { SectionHeading, Reveal } from './shared';
import { enterpriseTrustPillars } from '../data/content';

const pillarIcons = [Lock, Users, ShieldCheck, Layers, Activity, FileCheck];

export function EnterpriseTrust() {
  return (
    <section id="governance" tabIndex={-1} className="section container anchor-target">
      <SectionHeading
        eyebrow="ENTERPRISE TRUST &amp; GOVERNANCE"
        title="Engineered for data confidentiality and human control."
        description="Enterprise automation requires uncompromising security, verifiable source citations, and human approval safeguards. We integrate with your approved infrastructure without exposing sensitive data to public AI models."
      />
      <div className="trust-grid">
        {enterpriseTrustPillars.map((pillar, index) => {
          const IconComponent = pillarIcons[index] || ShieldCheck;
          return (
            <Reveal key={pillar.title} className="trust-card" delay={index * 0.04}>
              <div className="trust-card-icon">
                <IconComponent size={22} />
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </Reveal>
          );
        })}
      </div>
      <div className="governance-banner">
        <div className="governance-banner-content">
          <span className="micro-label">SCOPED ENGAGEMENT METHODOLOGY</span>
          <h3>Low-risk validation through phased execution</h3>
          <p>
            We do not ask enterprises to commit to unverified multi-year transformations. Every initiative begins with a <strong>department discovery and readiness evaluation</strong>, followed by a <strong>tightly scoped paid pilot</strong> in an isolated environment. Production rollout only proceeds once operational feasibility, latency, and adoption metrics are empirically proven.
          </p>
        </div>
        <div className="governance-badges">
          <div className="gov-badge"><ShieldCheck size={16} /> Zero Public Model Data Training</div>
          <div className="gov-badge"><ShieldCheck size={16} /> Granular Role-Based Access Controls</div>
          <div className="gov-badge"><ShieldCheck size={16} /> Mandatory Human Approval Gates</div>
          <div className="gov-badge"><ShieldCheck size={16} /> Complete Architectural Runbooks</div>
        </div>
      </div>
    </section>
  );
}
