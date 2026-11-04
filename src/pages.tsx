import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Mail, ShieldCheck, Database, Workflow, BrainCircuit, CalendarDays } from 'lucide-react';
import { Hero } from './components/Hero';
import { Metrics } from './components/Metrics';
import { ToolStack } from './components/ToolStack';
import { ContactForm } from './components/ContactForm';
import { CallButton, Reveal, Icon, SectionHeading, FAQ, Brand } from './components/shared';
import { services, solutions, steps, email, departments } from './data/content';

function ServicesSection() {
  return <section id="services" tabIndex={-1} className="section container anchor-target">
    <SectionHeading eyebrow="SERVICES" title="AI that works where you work." description="Eight capabilities. One practical plan for removing the work that slows your business down."/>
    <div className="capability-grid">{services.map((service,index)=><Reveal key={service.title} className="capability-card" delay={(index%3)*.04}>
      <div className="capability-top"><span className="index-number">{String(index+1).padStart(2,'0')}</span><Icon name={service.icon} size={22}/></div>
      <h3>{service.title}</h3><p>{service.build}</p>
      <details className="capability-details"><summary>What’s included<span aria-hidden="true">+</span></summary><ul>{service.features.map(feature=><li key={feature}><Check size={14}/>{feature}</li>)}</ul><p>{service.outcome}</p><CallButton className="text-booking">Discuss this service</CallButton></details>
    </Reveal>)}</div>
  </section>;
}

function ProcessSection() {
  return <section id="process" tabIndex={-1} className="section section-band anchor-target"><div className="container">
    <SectionHeading eyebrow="PROCESS" title="From first conversation to everyday use." description="A clear path through discovery, delivery and improvement. Your team stays involved at every step."/>
    <div className="process-grid">{steps.map((step,index)=><Reveal className="process-item" key={step.title} delay={index*.05}><span className="process-number">{String(index+1).padStart(2,'0')}</span><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div>
  </div></section>;
}

function FlagshipSection() {
  return <section id="pipelines" tabIndex={-1} className="section container anchor-target">
    <div id="solutions" tabIndex={-1} className="anchor-target"><SectionHeading eyebrow="PIPELINES / FLAGSHIP SOLUTIONS" title="Three systems. Built to move work forward." description="Our flagship solutions connect individual capabilities into a complete system for your company."/></div>
    <div className="flagship-list">{solutions.map((solution,index)=><Reveal key={solution.slug}>
      <article id={solution.slug} tabIndex={-1} className="flagship-row anchor-target">
        <div className="flagship-copy"><span className="index-number">0{index+1} / {solution.label}</span><h3>{solution.name}</h3><p>{solution.solution}</p><div className="tags">{solution.tags.map(tag=><span key={tag}>{tag}</span>)}</div><p className="flagship-result"><Check size={15}/>{solution.result}</p><CallButton className="text-booking">Discuss this system</CallButton></div>
        <div className={`workflow-map workflow-${index}`} aria-label={`${solution.name} workflow`}><div className="workflow-map-header"><Icon name={solution.icon} size={17}/><span>HOW IT CONNECTS</span><span className="live-dot"/></div><ol>{solution.workflow.map((stage,i)=><li key={stage}><span className="workflow-step">0{i+1}</span><span>{stage}</span>{i===solution.workflow.length-1?<Check size={17}/>:<ArrowRight size={16}/>}</li>)}</ol><div className="workflow-note"><ShieldCheck size={14}/>Access and human review scoped to your business.</div></div>
      </article>
    </Reveal>)}</div>
  </section>;
}

function WorkWithUs() {
  return <section id="work-with-us" tabIndex={-1} className="section section-band anchor-target"><div className="container">
    <SectionHeading eyebrow="WORK WITH US" title="Start with what’s slowing you down." description="Talk it through or write it down. Both start with understanding your business."/>
    <div className="start-grid"><Reveal className="start-card start-primary"><span className="eyebrow">LET’S TALK</span><CalendarDays size={26}/><h3>See what AI could do for you.</h3><p>A free demo and a focused conversation about the workflows, knowledge and client interactions you want to improve.</p><ul><li><Check size={16}/>Share your priorities before we meet</li><li><Check size={16}/>Explore systems relevant to your business</li><li><Check size={16}/>Leave with a clearer next step</li></ul><CallButton/></Reveal>
      <Reveal className="start-card"><span className="eyebrow">PREFER TO WRITE?</span><Mail size={26}/><h3>Tell us about your business.</h3><p>Describe the process you want to improve. Give us the context, and we’ll start the conversation from there.</p><ul><li><Check size={16}/>Your current tools and workflows</li><li><Check size={16}/>The manual work taking your team’s time</li><li><Check size={16}/>What a better outcome looks like</li></ul><Link className="button button-outline" to="/#contact">Send an enquiry<ArrowUpRight size={17}/></Link></Reveal></div>
  </div></section>;
}

function AboutSection() {
  return <section id="about" tabIndex={-1} className="section container about-section anchor-target">
    <span className="eyebrow">ABOUT FLOWTIVO AI</span>
    <div className="about-grid"><Reveal className="about-visual"><div className="about-orbit"><Database size={25}/><Workflow size={25}/><BrainCircuit size={25}/></div><Brand/><p>Less Busywork.<br/><span>More Business.</span></p><span className="micro-label">KNOWLEDGE · OPERATIONS · CLIENT EXPERIENCE</span></Reveal>
    <Reveal className="about-copy"><h2>Good systems start<br/>with understanding<br/><span className="gradient-text">your business.</span></h2><p>Flowtivo AI helps mid-market companies turn scattered knowledge and manual processes into practical AI systems.</p><p>We start with how your people work today. Then we connect your tools, build around your approved data and help your team put the system to use.</p><p>From strategy and implementation to training and ongoing improvement, the focus stays the same: giving your people more time for the work that matters.</p><div className="about-principles"><span><Check size={15}/>Built around your existing tools</span><span><Check size={15}/>People stay in control</span><span><Check size={15}/>Support beyond launch</span></div></Reveal></div>
    <div id="departments" tabIndex={-1} className="department-strip anchor-target"><span>BUILT ACROSS YOUR BUSINESS</span>{departments.map(department=><Link key={department.name} to={`/?department=${encodeURIComponent(department.name)}#contact`}><Icon name={department.icon} size={17}/>{department.name}<ArrowUpRight size={13}/></Link>)}</div>
  </section>;
}

function ContactSection() {
  return <section id="contact" tabIndex={-1} className="section section-band contact-section anchor-target"><div className="container">
    <SectionHeading eyebrow="CONTACT" title="What could work better?" description="Book a demo or describe the process taking up your team’s time. Let’s work out where AI can help."/>
    <div className="contact-layout"><aside className="contact-booking"><span className="icon-box"><CalendarDays size={25}/></span><h3>Let’s talk about<br/>your next system.</h3><p>Share a few details, then choose a time for a conversation focused on your business.</p><CallButton/><div className="contact-direct"><span className="micro-label">PREFER EMAIL?</span><a href={`mailto:${email}`}>{email}<ArrowUpRight size={15}/></a></div><details className="privacy-details"><summary>How we use your details</summary><p>We store your contact details and enquiry to respond to your request. For access or deletion requests, email {email}.</p></details></aside><ContactForm/></div>
  </div></section>;
}

export function Home() {
  return <><Hero/><Metrics/><ToolStack/><ServicesSection/><ProcessSection/><FlagshipSection/><WorkWithUs/><AboutSection/><FAQ/><ContactSection/></>;
}

export function NotFound() {
  return <section className="container not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>This workflow leads somewhere else.</h1><p>Let’s get you back to Flowtivo AI.</p><Link className="button button-primary" to="/">Back to home<ArrowRight size={17}/></Link></section>;
}
