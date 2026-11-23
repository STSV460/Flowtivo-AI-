import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { BookingProvider } from './components/BookingProvider';
import { Navbar, Footer } from './components/shared';
import {
  Home,
  NotFound,
  BookingConfirmed,
  EnterpriseAIAutomation,
  EnterpriseAIAssistants,
  EnterpriseWorkflowIntegration,
} from './pages';
import seo from './data/seo.json';
import navigation from './data/navigation.json';
import site from './data/site.json';

function RouteEffects() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    const page = (seo as Record<string, { title: string; description: string; noindex?: boolean }>)[pathname];
    document.title = page?.title || 'Page Not Found | Flowtivo AI';
    const description = page?.description || 'Explore Flowtivo AI enterprise automation solutions.';
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      document.querySelector(selector)?.setAttribute('content', description);
    }
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      document.querySelector(selector)?.setAttribute('content', document.title);
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', new URL(pathname, site.url).href);
    if (page?.noindex) {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, follow');
    } else {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index, follow, max-image-preview:large');
    }
    if (hash) {
      const frame = requestAnimationFrame(() => {
        let id: string;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key]);
  return null;
}

function LegacySection() {
  const { pathname, search, hash } = useLocation();
  const id = (navigation.aliases as Record<string, string>)[pathname];
  return id ? <Navigate replace to={`/${search}${hash || `#${id}`}`} /> : <NotFound />;
}

function Site() {
  return <>
    <RouteEffects />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div id="top" tabIndex={-1} />
    <Navbar />
    <main id="main-content" tabIndex={-1}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enterprise-ai-automation" element={<EnterpriseAIAutomation />} />
        <Route path="/enterprise-ai-assistants" element={<EnterpriseAIAssistants />} />
        <Route path="/enterprise-workflow-integration" element={<EnterpriseWorkflowIntegration />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="*" element={<LegacySection />} />
      </Routes>
    </main>
    <Footer />
    <Toaster theme="dark" position="bottom-left" richColors closeButton />
  </>;
}

export function AppContent() { return <BookingProvider><Site /></BookingProvider>; }
export default function App() { return <BrowserRouter><AppContent /></BrowserRouter>; }
