import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Workflow, MessageSquare, ShieldCheck } from 'lucide-react';
import { CallButton, Reveal } from './shared';

function FlowCore() {
  return <div className="flow-core" role="img" aria-label="Company knowledge, workflows and client conversations connected through one AI system">
    <div className="core-grid"/>
    <svg className="core-orbits" viewBox="0 0 600 600" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="core-metal" cx=".28" cy=".2" r=".8"><stop stopColor="#d2efff"/><stop offset=".16" stopColor="#446a91"/><stop offset=".48" stopColor="#101c35"/><stop offset=".75" stopColor="#070d1c"/><stop offset="1" stopColor="#283c5b"/></radialGradient>
        <linearGradient id="core-light" x1="100" y1="120" x2="470" y2="480" gradientUnits="userSpaceOnUse"><stop stopColor="#67e7ff"/><stop offset=".52" stopColor="#5c6dff"/><stop offset="1" stopColor="#b46cff"/></linearGradient>
        <radialGradient id="core-halo"><stop stopColor="#437cff" stopOpacity=".18"/><stop offset="1" stopColor="#437cff" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx="300" cy="300" r="280" fill="url(#core-halo)"/>
      <g stroke="#3a547a" strokeOpacity=".32"><circle cx="300" cy="300" r="235"/><circle cx="300" cy="300" r="275"/><path d="M25 300h550M300 25v550" strokeDasharray="3 9"/></g>
      <g className="orbital-lines" stroke="url(#core-light)"><ellipse cx="300" cy="300" rx="237" ry="83" transform="rotate(-34 300 300)" strokeOpacity=".5"/><ellipse cx="300" cy="300" rx="237" ry="83" transform="rotate(48 300 300)" strokeOpacity=".24"/></g>
      <circle cx="300" cy="300" r="142" fill="url(#core-metal)" stroke="#7096c3" strokeOpacity=".5"/>
      <g stroke="url(#core-light)" strokeWidth="2"><ellipse cx="300" cy="300" rx="143" ry="49" transform="rotate(-30 300 300)"/><ellipse cx="300" cy="300" rx="143" ry="49" transform="rotate(60 300 300)" strokeOpacity=".35"/></g>
      <image href="/flowtivo-mark.png" x="213" y="218" width="174" height="164" preserveAspectRatio="xMidYMid meet"/>
      <g fill="#9edaff"><circle cx="100" cy="171" r="4"/><circle cx="491" cy="422" r="4"/><circle cx="426" cy="119" r="3"/></g>
    </svg>
    <div className="core-label core-label-knowledge"><FileText size={18}/><span>Company knowledge<small>Your data. Connected.</small></span></div>
    <div className="core-label core-label-work"><Workflow size={18}/><span>Connected workflows<small>People stay in control.</small></span></div>
    <div className="core-label core-label-client"><MessageSquare size={18}/><span>Client intelligence<small>Every conversation counts.</small></span></div>
    <div className="core-caption"><span className="live-dot"/> BUILT AROUND YOUR BUSINESS</div>
  </div>;
}

export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading">
    <div className="container hero-layout">
      <Reveal immediate className="hero-copy">
        <span className="eyebrow">AI FOR THE MID-MARKET · 50–500 EMPLOYEES</span>
        <h1 id="hero-heading">Less busywork.<br/>More business.<br/><span className="gradient-text">Powered by AI.</span></h1>
        <p>Custom AI assistants, connected workflows and client intelligence. Built around your people, your tools and the way your business works.</p>
        <div className="hero-actions"><CallButton/><Link className="button button-outline" to="/#services">Explore our Services<ArrowRight size={17}/></Link></div>
        <div className="hero-note"><ShieldCheck size={15}/><span>Your data. Your systems. No in-house AI team needed.</span></div>
      </Reveal>
      <FlowCore/>
    </div>

  </section>;
}
