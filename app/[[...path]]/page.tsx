import App from '../../src/App';
import type { Metadata } from 'next';
type Props={ params: Promise<{ path?: string[] }> };
const pages:Record<string,{title:string,description:string}>={
 services:{title:'AI Services',description:'AI strategy, readiness audits, custom assistants, workflow automation, governance and ongoing optimization for companies with 50–500 employees.'},
 solutions:{title:'Flagship Solutions',description:'Explore internal knowledge assistants, operations automation hubs and client intelligence chatbots built for your business.'},
 about:{title:'About Us',description:'Flowtivo AI helps mid-market companies turn their knowledge and workflows into practical AI capabilities.'},
 team:{title:'Our Team',description:'Meet the expertise behind Flowtivo AI. Approved team profiles coming soon.'},
 projects:{title:'Illustrative Projects',description:'Explore clearly labeled example AI workflows for HR, Finance, Sales, Support and Operations.'},
 contact:{title:'Book a Free Strategy Call',description:'Discuss custom AI systems for your mid-market company. Contact Flowtivo AI for a free strategy call and custom proposal.'},
};
export async function generateMetadata({params}:Props):Promise<Metadata>{const{path=[]}=await params;const key=path.join('/');const page=pages[key];const title=page?`Flowtivo AI — ${page.title}`:'Flowtivo AI — Less Busywork. More Business.';return {title,description:page?.description,alternates:{canonical:`/${key}`},openGraph:{title,description:page?.description}};}
export default async function Page({params}:Props){const{path=[]}=await params;return <App initialPath={`/${path.join('/')}`}/>;}
