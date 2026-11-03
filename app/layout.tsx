import type { Metadata } from 'next';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://flowtivo-ai-studio.saisankarmahadevan.chatgpt.site'),
 title: 'Flowtivo AI — Less Busywork. More Business.',
 description: 'Custom AI assistants, workflow automation and AI consulting for mid-market companies with 50–500 employees. No in-house AI team needed.',
 openGraph: { title: 'Flowtivo AI — Less Busywork. More Business.', description: 'Custom AI systems for growing mid-market companies.', type: 'website', images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
 twitter: { card: 'summary_large_image', title: 'Flowtivo AI', description: 'Less Busywork. More Business.' },
 robots: { index: true, follow: true },
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en"><body>{children}</body></html>;
}
