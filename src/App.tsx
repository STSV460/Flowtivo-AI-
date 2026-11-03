'use client';
import { useEffect, useState } from 'react';
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar, Footer } from './components/shared';
import { Home, Services, Solutions, About, Team, Projects, Contact, NotFound } from './pages';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const pageNames:Record<string,string>={'/':'Less Busywork. More Business.','/services':'AI Services','/solutions':'Flagship Solutions','/about':'About Us','/team':'Our Team','/projects':'Illustrative Projects','/contact':'Book a Free Strategy Call'};
function RouteEffects(){const{pathname,hash}=useLocation();useEffect(()=>{document.title=`Flowtivo AI — ${pageNames[pathname]||'Page Not Found'}`;if(hash){requestAnimationFrame(()=>document.getElementById(hash.slice(1))?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));}else{window.scrollTo({top:0,behavior:'instant'});}document.getElementById('main-content')?.focus({preventScroll:true});},[pathname,hash]);return null;}
function Site(){return <><RouteEffects/><a className="skip-link" href="#main-content">Skip to content</a><div id="top"/><ParticleBackground/><Navbar/><main id="main-content" tabIndex={-1}><Routes><Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/solutions" element={<Solutions/>}/><Route path="/about" element={<About/>}/><Route path="/team" element={<Team/>}/><Route path="/projects" element={<Projects/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></main><Footer/><Link className="floating-call" to="/contact"><span className="live-dot"/>Book a Call<ArrowUpRight size={15}/></Link><Toaster theme="dark" position="bottom-left" richColors closeButton/></>;}
export default function App({initialPath='/'}:{initialPath?:string}){const[mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);return mounted?<BrowserRouter><Site/></BrowserRouter>:<MemoryRouter initialEntries={[initialPath]}><Site/></MemoryRouter>;}
