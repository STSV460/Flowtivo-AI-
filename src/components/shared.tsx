import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Menu, X, Sparkles, BrainCircuit, Workflow, Compass, ScanLine, Library, Layers, ShieldCheck, ChartNoAxesCombined, Users, Wallet, Headset, Settings2, Mail, Check, ChevronRight, CircleCheck, FileText, Database, MessageSquare, Bell, LockKeyhole, type LucideIcon } from 'lucide-react';
import { brand, email, faqs } from '../data/content';
import navigation from '../data/navigation.json';
import { useBooking } from './BookingProvider';
import { booking } from '../data/booking';
export { ArrowUpRight, ArrowRight, Sparkles, Check, ChevronRight, CircleCheck, FileText, Database, MessageSquare, Bell, LockKeyhole, Mail };
const icons:Record<string,LucideIcon>={sparkles:Sparkles,brain:BrainCircuit,workflow:Workflow,compass:Compass,scan:ScanLine,library:Library,layers:Layers,shield:ShieldCheck,chart:ChartNoAxesCombined,users:Users,wallet:Wallet,headset:Headset,settings:Settings2};
export function Icon({name,size=22}:{name:string,size?:number}) { const Component=icons[name]||Sparkles; return <Component size={size} strokeWidth={1.5}/>; }
export function Reveal({children,className='',delay=0,immediate=false,id}:{children:ReactNode,className?:string,delay?:number,immediate?:boolean,id?:string}) {
  const reduced=useReducedMotion();
  const node=useRef<HTMLDivElement>(null),controls=useAnimationControls();
  useEffect(()=>{
    const element=node.current;
    if(!element)return;
    if(reduced||immediate){controls.set({opacity:1,y:0});return;}
    // Initial HTML stays visible. Animate only off-screen content after hydration.
    if(element.getBoundingClientRect().top<window.innerHeight)return;
    controls.set({opacity:0,y:16});
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        void controls.start({opacity:1,y:0});observer.disconnect();
      }
    },{threshold:.08});
    observer.observe(element);
    return()=>observer.disconnect();
  },[controls,reduced,immediate]);
  return <motion.div ref={node} id={id} className={className} initial={false} animate={controls} transition={{duration:.45,delay}}>{children}</motion.div>;
}
export function Brand({hero=false}:{hero?:boolean}) { return <span className={`brand ${hero?'brand-hero':''}`}><img src={brand.logoPath} alt="Flowtivo AI — Less Busywork. More Business." width={1749} height={355}/></span>; }
export function CallButton({children,outline=false,className='',onClick}:{children?:ReactNode,outline?:boolean,className?:string,onClick?:()=>void}) {
  const {openBooking}=useBooking();
  return <button type="button" aria-haspopup="dialog" className={`button ${outline?'button-outline':'button-primary'} ${className}`} onClick={event=>{openBooking(event.currentTarget);onClick?.();}}>{children||booking.title}<ArrowUpRight size={16}/></button>;
}
export function Navbar() {
  const [open,setOpen]=useState(false),[active,setActive]=useState('');
  const location=useLocation();
  const menuRef=useRef<HTMLElement>(null),toggleRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>setOpen(false),[location.key]);
  useEffect(()=>{
    let frame=0;
    function update(){let current='';for(const item of navigation.items){const element=document.getElementById(item.id);if(element&&element.getBoundingClientRect().top<=180)current=item.id;}setActive(current);}
    function onScroll(){cancelAnimationFrame(frame);frame=requestAnimationFrame(update);}
    update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);};
  },[location.pathname]);
  useEffect(()=>{
    if(!open)return;
    function key(event:KeyboardEvent){
      if(event.key==='Escape'){setOpen(false);toggleRef.current?.focus();}
      if(event.key==='Tab'){
        const nodes=[toggleRef.current,...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a,button')||[])].filter(Boolean) as HTMLElement[];
        const first=nodes[0],last=nodes[nodes.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    }
    document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);
  },[open]);
  return <header className="nav-shell"><div className="nav-inner container">
    <Link to="/#top" aria-label="Flowtivo AI home"><Brand/></Link>
    <nav ref={menuRef} id="main-navigation" className={`nav-links ${open?'is-open':''}`} aria-label="Main navigation">
      <div className="nav-pill">{navigation.items.map(item=><Link key={item.id} to={`/#${item.id}`} className={active===item.id?'active':''} aria-current={active===item.id?'location':undefined}>{item.label}</Link>)}</div>
      <CallButton className="nav-cta" onClick={()=>setOpen(false)}/>
    </nav>
    <button ref={toggleRef} type="button" className="menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-controls="main-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </div></header>;
}
export function SectionHeading({eyebrow,title,description,center=false}:{eyebrow:string,title:ReactNode,description?:string,center?:boolean}) {
  return <Reveal className={`section-heading ${center?'center':''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description&&<p>{description}</p>}</Reveal>;
}
export function FAQ() {
  return <section id="faq" tabIndex={-1} className="section container faq-section anchor-target"><SectionHeading eyebrow="FAQ" title="Clarity before we build." description="Answers about AI automation, integration and working with Flowtivo AI."/><div className="faq-list">{faqs.map(([question,answer])=><details className="faq-item" data-slot="accordion-item" key={question}><summary data-slot="accordion-trigger"><h3>{question}</h3><ChevronRight size={17} aria-hidden="true"/></summary><div data-slot="accordion-content"><p>{answer}</p></div></details>)}</div></section>;
}
export function Footer() {
  return <footer className="container footer"><div className="footer-top"><div className="footer-brand"><Link to="/#top"><Brand/></Link><p>Enterprise AI systems.<br/>Engineered around your business.</p></div><div className="footer-links"><div><span>SOLUTIONS</span><Link to="/enterprise-ai-automation">Enterprise AI Automation</Link><Link to="/enterprise-ai-assistants">Internal AI Assistants</Link><Link to="/enterprise-workflow-integration">Workflow Integration</Link></div><div><span>EXPLORE</span><Link to="/#services">Services</Link><Link to="/#process">Process</Link><Link to="/#governance">Governance</Link><Link to="/#impact">Metrics</Link><Link to="/#pipelines">Flagship systems</Link><Link to="/#about">About</Link></div><div><span>LET’S TALK</span><Link to="/#contact">Send an enquiry</Link><a href={`mailto:${email}`}>{email}</a><CallButton className="text-booking"/></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Flowtivo AI. All rights reserved.</span><a href="#top">Back to top ↑</a></div></footer>;
}
