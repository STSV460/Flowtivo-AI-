import site from './site.json';
export const email = site.email;
// Approved transparent logo with white lettering for dark backgrounds.
export const brand = { name: 'Flowtivo AI', tagline: 'Less Busywork. More Business.', logoPath: '/flowtivo-logo-dark.png' };

export const services = [
  {
    icon: 'compass',
    title: 'AI Strategy & Roadmap',
    description: 'Turn enterprise AI ambitions into a prioritized, phased adoption roadmap.',
    problem: 'Siloed tools, vendor noise, and lack of integration clarity create executive hesitation.',
    build: 'A departmental opportunity map and phased implementation roadmap aligned with operational priorities and security requirements.',
    features: ['Stakeholder & systems discovery', 'Impact vs feasibility scoring', 'Scoped pilot & 90-day execution plan'],
    outcome: 'Clear business cases, executive alignment, and prioritized milestones before capital commitment.',
  },
  {
    icon: 'scan',
    title: 'AI Readiness Audit',
    description: 'Pinpoint operational bottlenecks and evaluate technical integration feasibility.',
    problem: 'Teams spend thousands of hours on manual workflows without clear visibility into automation feasibility.',
    build: 'A thorough technical and operational evaluation of existing applications, data quality, API endpoints, and permission structures.',
    features: ['Workflow & handoff mapping', 'Access control and API feasibility', 'Baseline metric benchmarking'],
    outcome: 'A prioritized shortlist of high-ROI automation candidates with clear technical criteria.',
  },
  {
    icon: 'brain',
    title: 'Custom Internal AI Assistants',
    description: 'Enterprise intelligence grounded in approved corporate repositories with strict access controls.',
    problem: 'Employees lose valuable hours searching across disparate documentation, wikis, and legacy systems.',
    build: 'Role-based, source-cited internal AI assistants connecting private documentation, SOPs, and knowledge repositories.',
    features: ['Verifiable source citations', 'Granular role-based access control (RBAC)', 'Scheduled document & knowledge synchronization'],
    outcome: 'Accelerated decision-making, reduced repetitive queries, and auditable enterprise answers.',
  },
  {
    icon: 'workflow',
    title: 'SOP & Workflow Automation',
    description: 'Eliminate repetitive manual handoffs with resilient, human-in-the-loop automation.',
    problem: 'Routine data transfers and multi-step approvals cause bottlenecks and introduce human error.',
    build: 'Connected workflows across ERPs, CRMs, and ticketing systems, featuring human approval gates and real-time observability.',
    features: ['Human-in-the-loop review checkpoints', 'Bi-directional enterprise integrations', 'Automated retry and exception routing'],
    outcome: 'Streamlined departmental operations with comprehensive audit trails and human oversight.',
  },
  {
    icon: 'library',
    title: 'Knowledge Base Build',
    description: 'Structure institutional knowledge for seamless human and AI accessibility.',
    problem: 'Critical operational expertise is trapped in employee silos, chat histories, and unstructured PDFs.',
    build: 'A structured, validated knowledge architecture that prepares corporate information for retrieval-augmented generation (RAG).',
    features: ['SOP standardization & taxonomy', 'Deduplication & ownership tagging', 'Version governance and review cadences'],
    outcome: 'Dependable, searchable enterprise knowledge ready for daily operations and autonomous retrieval.',
  },
  {
    icon: 'layers',
    title: 'Department Automation',
    description: 'Tailored automation pipelines addressing specific functional bottlenecks.',
    problem: 'Individual business units rely on fragmented manual workarounds that do not scale.',
    build: 'Purpose-built automation workflows designed for Operations, IT, Finance, HR, and Customer Support departments.',
    features: ['Departmental workflow assessment', 'Custom middleware integrations', 'Centralized operational telemetry'],
    outcome: 'Substantial reduction in manual hours and increased operational throughput across departments.',
  },
  {
    icon: 'shield',
    title: 'Team Training & AI Governance',
    description: 'Equip internal teams with practical skills and robust enterprise guardrails.',
    problem: 'Ad-hoc, unmonitored AI usage exposes organizations to compliance risks and inconsistent quality.',
    build: 'Comprehensive training workshops, acceptable use policies, human-review protocols, and data privacy safeguards.',
    features: ['Role-specific staff enablement', 'Data privacy and acceptable-use policies', 'Quality control and audit standards'],
    outcome: 'Confident, compliant teams operating with clear oversight and standardized processes.',
  },
  {
    icon: 'chart',
    title: 'Ongoing Optimization Retainer',
    description: 'SLA-backed engineering support, proactive monitoring, and continuous enhancement.',
    problem: 'Enterprise systems, APIs, and workflows evolve continuously, requiring dedicated operational care.',
    build: 'A predictable maintenance and optimization partnership providing telemetry monitoring, bug fixes, and feature iterations.',
    features: ['Real-time pipeline monitoring', 'Proactive exception triage', 'Backlog prioritization & version updates'],
    outcome: 'Resilient, high-availability automations that scale alongside enterprise growth.',
  },
];

export const solutions = [
  {
    slug: 'knowledge',
    icon: 'brain',
    label: 'SECURE ENTERPRISE KNOWLEDGE',
    title: 'Answers grounded in approved company sources.',
    name: 'RAG-Powered Internal Knowledge & AI Assistant',
    short: 'Private, source-cited answers from your corporate repositories.',
    problem: 'Critical institutional knowledge is fragmented across policies, intranet pages, drives, and ticketing systems.',
    solution: 'A private enterprise assistant connecting your approved documents, returning answers with exact page and section citations under strict permission controls.',
    result: 'Drastically faster information retrieval, streamlined employee onboarding, and zero public model data leakage.',
    tags: ['Role-based access', 'Verifiable source citations', 'Zero data retention'],
    workflow: ['Approved enterprise repositories', 'Permission-scoped indexing', 'Contextual vector retrieval', 'Source-cited executive answer'],
  },
  {
    slug: 'operations',
    icon: 'workflow',
    label: 'ORCHESTRATED ENTERPRISE WORKFLOWS',
    title: 'End-to-end automation with human approval checkpoints.',
    name: 'AI Operations & Workflow Automation Hub',
    short: 'Connected systems, automated triage, and human-in-the-loop oversight.',
    problem: 'Operations teams manually re-enter data, reconcile reports, and follow up on cross-department approvals across legacy systems.',
    solution: 'Resilient orchestration connecting your enterprise stack, incorporating explicit human approval gates for critical actions and real-time exception logging.',
    result: 'Reduced cycle times, auditable execution logs, and elimination of manual copy-paste operations.',
    tags: ['Human approval gates', 'System-wide telemetry', 'Cross-platform APIs'],
    workflow: ['Trigger or data arrival', 'AI parsing & schema validation', 'Mandatory human approval gate', 'Synchronized execution & audit log'],
  },
  {
    slug: 'intelligence',
    icon: 'sparkles',
    label: 'QUALIFICATION & COMMUNICATION INTELLIGENCE',
    title: 'Intelligent triage, contextual qualification, and structured summaries.',
    name: 'AI Consultancy & Client Intelligence Chatbot',
    short: 'Contextual enquiry parsing and automated team handoffs.',
    problem: 'Internal service desks and business teams spend hours clarifying basic request parameters and categorizing incoming demands.',
    solution: 'An intelligent workflow assistant that gathers structured parameters, categorizes complex requests against business rules, and routes complete briefs to human specialists.',
    result: 'Instant response times, comprehensive stakeholder context, and higher conversion to resolution.',
    tags: ['Contextual triage', 'Structured briefing', 'Seamless human handoff'],
    workflow: ['Inbound request', 'Knowledge context lookup', 'Multi-attribute qualification', 'Structured briefing to specialist'],
  },
];

export const departments = [
  {
    name: 'Operations',
    icon: 'settings',
    intro: 'Orchestrate cross-system workflows with continuous visibility.',
    examples: ['Automated cross-system data reconciliation', 'SOP-driven task routing with approval gates', 'Real-time operational exception handling and alerts'],
  },
  {
    name: 'IT & Digital Transformation',
    icon: 'shield',
    intro: 'Extend existing enterprise infrastructure without adding technical debt.',
    examples: ['Secure internal knowledge assistants with RBAC', 'API integration between legacy on-premises and cloud tools', 'Automated security incident triage and reporting'],
  },
  {
    name: 'Finance',
    icon: 'wallet',
    intro: 'Eliminate error-prone manual reconciliation and accelerate reporting.',
    examples: ['Multi-currency invoice data extraction and validation', 'Threshold-based expense routing and approval logging', 'Scheduled financial summary aggregation'],
  },
  {
    name: 'HR & People Operations',
    icon: 'users',
    intro: 'Deliver consistent employee support and automated onboarding workflows.',
    examples: ['New hire checklist orchestration and document collection', 'Enterprise policy search with source-linked citations', 'Leave and benefit workflow routing'],
  },
  {
    name: 'Customer Support',
    icon: 'headset',
    intro: 'Equip frontline agents with rapid, accurate knowledge retrieval.',
    examples: ['Tier-1 ticket categorization and priority routing', 'Knowledge-grounded response recommendations for human review', 'Complex case history summarization during escalations'],
  },
  {
    name: 'Sales & Revenue',
    icon: 'chart',
    intro: 'Remove administrative friction between sales teams and client conversations.',
    examples: ['Enterprise lead qualification and CRM enrichment', 'Meeting transcript summarization and action-item extraction', 'Contract review preparation and human sign-off routing'],
  },
];

export const enterpriseTrustPillars = [
  {
    title: 'Data Confidentiality & Privacy',
    description: 'We build around strict zero-data-retention APIs and enterprise tenant boundaries. Client data is never utilized to train public foundation models.',
  },
  {
    title: 'Role-Based Access Control',
    description: 'Assistants and automations respect existing enterprise permission tiers. Employees only access information they are authorized to view.',
  },
  {
    title: 'Human-in-the-Loop Safeguards',
    description: 'Critical business operations incorporate mandatory human approval checkpoints before executing writes, updates, or external communications.',
  },
  {
    title: 'Integration Feasibility First',
    description: 'We evaluate API rate limits, authentication protocols, and system architecture during initial discovery before recommending solutions.',
  },
  {
    title: 'Observable Exception Handling',
    description: 'Automations include failure alerting, automated fallback queues, and transparent run histories so processes never stall silently.',
  },
  {
    title: 'Documentation & Handover',
    description: 'Every deployment includes complete technical architecture schemas, operational runbooks, and staff enablement for full internal governance.',
  },
];

export const steps = [
  {
    title: 'Department Discovery & Feasibility',
    text: 'We analyze your workflows, security requirements, and system APIs to identify high-conviction automation opportunities.',
  },
  {
    title: 'Scoped Proof-of-Value Pilot',
    text: 'We engineer a tightly defined pilot in an isolated environment to validate performance, integration, and user adoption.',
  },
  {
    title: 'Full Phased Deployment',
    text: 'We connect approved enterprise systems, establish human oversight gates, and conduct role-specific team enablement.',
  },
  {
    title: 'SLA Support & Ongoing Optimization',
    text: 'We monitor execution telemetry, handle edge cases, and continuously enhance capabilities against business objectives.',
  },
];

export const faqs = [
  [
    'What does an AI automation agency do?',
    'An AI automation agency maps repetitive business processes, connects existing tools and builds AI systems around approved data. Flowtivo AI focuses on workflow automation, internal knowledge assistants and client enquiry systems, supported by discovery, team training and ongoing improvement.',
  ],
  [
    'How should we compare AI automation companies?',
    'Start with the process you need to improve. Ask which tools and data sources will be connected, where human approvals are needed, how failures are handled and what support is included. Agree a baseline and measurable acceptance criteria before building. Flowtivo AI starts with a readiness audit to define that scope.',
  ],
  [
    'Who is Flowtivo AI for?',
    'We partner with enterprise leaders and operations executives—primarily at organizations with 10,000+ employees across the US, UK, Australia, UAE, and India—as well as mid-market firms modernizing critical workflows. Our counterparts are CIOs, CTOs, COOs, VPs of Operations, Heads of Digital Transformation, and business unit leaders looking for scoped, high-reliability AI solutions without building an unproven in-house AI team from scratch.',
  ],
  [
    'How do you handle enterprise data security and confidentiality?',
    'Enterprise data governance is non-negotiable. We architect integrations around dedicated customer environments, role-based access control (RBAC), and private API endpoints. Your corporate data is never used to train public foundational models. All automated updates can be restricted with human approval gates, audit logging, and automated failure fallbacks.',
  ],
  [
    'What is your engagement model and typical timeline?',
    'We prioritize low-risk, predictable outcomes. Engagements start with a focused department discovery and technical readiness audit (1–2 weeks), followed by a scoped paid pilot (2–4 weeks) to demonstrate tangible workflow improvements before committing to organization-wide rollout. Phased implementations typically deploy within 4–8 weeks based on integration complexity.',
  ],
  [
    'Can you integrate with our existing enterprise stack?',
    'Yes. We design around your current systems rather than forcing rip-and-replace. We integrate with major cloud ecosystems (Google Workspace, Microsoft 365, Azure, AWS), enterprise platforms (Salesforce, HubSpot, Jira, ServiceNow, Slack), relational databases, and proprietary internal REST/GraphQL APIs.',
  ],
  [
    'How do you measure business impact and ROI?',
    'Before engineering begins, we baseline key operational indicators: manual hours spent, error rates, cycle time, and escalation frequencies. We do not make generic savings claims; all outcomes are measured against empirical usage telemetry and agreed departmental benchmarks.',
  ],
  [
    'Do we need an internal AI engineering team to work with you?',
    'No. Flowtivo AI provides end-to-end engineering, integration, and prompt/workflow architecture. Your team provides business context, workflow definitions, and access permissions. Following deployment, we deliver comprehensive runbooks and train your designated process owners.',
  ],
  [
    'What happens after initial deployment?',
    'We offer structured ongoing optimization retainers that cover pipeline telemetry monitoring, API update maintenance, edge-case remediation, and a prioritized improvement backlog so your systems adapt as business requirements evolve.',
  ],
  [
    'How do human-in-the-loop approvals work in practice?',
    'For high-impact workflows (such as payment processing, external communications, or database mutations), the automation handles data aggregation, analysis, and draft preparation, then routes the decision to a human supervisor via Slack, Teams, or an internal dashboard. The action only executes once approved.',
  ],
];
