
import React from 'react';
import { 
  Mic2, 
  MessageSquare, 
  Star, 
  Filter, 
  FileText, 
  Cpu, 
  Users, 
  Building2, 
  TrendingUp,
  XCircle,
  CheckCircle2,
  BrainCircuit,
  Settings2,
  Zap,
  ShieldCheck,
  Calendar,
  Briefcase,
  Home,
  ShoppingBag,
  Coffee,
  Stethoscope
} from 'lucide-react';

export const AuroraLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="aurora-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <filter id="aurora-glow-effect" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" stroke="url(#aurora-gradient-primary)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
    <circle cx="50" cy="50" r="38" stroke="url(#aurora-gradient-primary)" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.2" />
    <path 
      d="M30 65C38 55 45 35 50 35C55 35 62 55 70 65" 
      stroke="url(#aurora-gradient-primary)" 
      strokeWidth="10" 
      strokeLinecap="round" 
      filter="url(#aurora-glow-effect)"
    />
    <path 
      d="M30 65C38 55 45 35 50 35C55 35 62 55 70 65" 
      stroke="white" 
      strokeWidth="2" 
      strokeLinecap="round" 
      opacity="0.5"
    />
    <circle cx="50" cy="35" r="5" fill="url(#aurora-gradient-primary)" filter="url(#aurora-glow-effect)">
      <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
    </circle>
    <path 
      d="M38 60Q50 52 62 60" 
      stroke="url(#aurora-gradient-primary)" 
      strokeWidth="4" 
      strokeLinecap="round" 
      opacity="0.7"
    />
  </svg>
);

export const INDUSTRY_TEMPLATES = [
  { id: 'insurance', name: 'Insurance', icon: <ShieldCheck size={18} />, prompt: "You are an insurance advisor. Your goal is to qualify leads for life and health insurance policies. Ask about their current coverage and schedule a consultation with a senior agent." },
  { id: 'real-estate', name: 'Real Estate', icon: <Home size={18} />, prompt: "You are a real estate concierge. Help buyers find their dream home. Ask about budget, location preferences, and number of bedrooms. Book property viewings directly into the calendar." },
  { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingBag size={18} />, prompt: "You are a shopping assistant. Help customers track orders, handle returns, and recommend products based on their style preferences. Drive sales by offering limited-time discounts." },
  { id: 'hospitality', name: 'Hospitality', icon: <Coffee size={18} />, prompt: "You are a hotel front-desk AI. Handle room bookings, answer questions about amenities, and suggest local dining options. Ensure a premium guest experience from the first hello." },
  { id: 'medical', name: 'Medical/Health', icon: <Stethoscope size={18} />, prompt: "You are a patient coordinator. Help patients schedule appointments, verify insurance providers, and answer general clinic FAQs. Prioritize urgent care transfers if necessary." },
];

export const CALENDAR_EVENTS = [
  { id: '1', title: 'Sarah - Property Viewing', time: '10:00 AM', date: 'Today', type: 'Viewing' },
  { id: '2', title: 'James - Policy Review', time: '1:30 PM', date: 'Today', type: 'Consultation' },
  { id: '3', title: 'Mike - Demo Call', time: '4:00 PM', date: 'Tomorrow', type: 'Sales' },
];

export const ONBOARDING_STEPS = [
  {
    title: "1. Give Her a 'Brain'",
    desc: "Paste your FAQs or website link. Aurora learns your business in seconds.",
    icon: <BrainCircuit size={24} />,
    color: "text-purple-400",
    link: "/knowledge"
  },
  {
    title: "2. Choose Her Persona",
    desc: "Pick a voice and personality that fits your brand perfectly.",
    icon: <Settings2 size={24} />,
    color: "text-cyan-400",
    link: "/agent"
  },
  {
    title: "3. Activate & Profit",
    desc: "Turn her on and watch her book meetings while you sleep.",
    icon: <Zap size={24} />,
    color: "text-emerald-400",
    link: "/agent"
  }
];

export const SIX_TOOLS = [
  {
    title: "Voice AI",
    desc: "Never miss a call. Answer, qualify and book appointments instantly.",
    icon: <Mic2 size={32} />,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Conversation AI",
    desc: "Chatbots that feel human. Engage, nurture and close day or night.",
    icon: <MessageSquare size={32} />,
    color: "from-purple-500/20 to-blue-500/20"
  },
  {
    title: "Reviews AI",
    desc: "Respond to every review, boost your reputation and climb search rankings.",
    icon: <Star size={32} />,
    color: "from-cyan-500/20 to-emerald-500/20"
  },
  {
    title: "Funnel AI",
    desc: "Build high-converting landing pages and sales processes automatically.",
    icon: <Filter size={32} />,
    color: "from-orange-500/20 to-rose-500/20"
  },
  {
    title: "Content AI",
    desc: "Generate professional posts, emails, and blogs that resonate with your audience.",
    icon: <FileText size={32} />,
    color: "from-blue-500/20 to-indigo-500/20"
  },
  {
    title: "Workflow AI",
    desc: "Automate complex business operations and sync data across your ecosystem.",
    icon: <Cpu size={32} />,
    color: "from-emerald-500/20 to-cyan-500/20"
  }
];

export const USE_CASES = [
  {
    title: "Agencies",
    desc: "Free your team. Impress clients. Scale smarter.",
    icon: <Building2 size={32} />,
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "Small Business Owners",
    desc: "Offload the grind. Grow faster. Build stronger relationships.",
    icon: <Users size={32} />,
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "Affiliate Marketers",
    desc: "Automate lead gen, content and campaigns. Earn while you sleep.",
    icon: <TrendingUp size={32} />,
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60"
  }
];

export const COMPARISON = {
  without: [
    "Missed calls = lost revenue",
    "Leads slipping through the cracks",
    "LA patchwork of overpriced tools",
    "Your team buried in busywork"
  ],
  with: [
    "Every call answered",
    "Every review handled",
    "Every chat engaged",
    "Every funnel and campaign running on autopilot"
  ]
};

export const FAQS = [
  { q: "What is AI Employee?", a: "Aurora AI Employee is a suite of six specialized tools designed to handle your business operations automatically, from answering calls to generating content." },
  { q: "How much does it cost?", a: "We operate on a transparent pay-as-you-go model. You only pay for the minutes or tasks processed by the AI, starting from as low as $0.05 per interaction." },
  { q: "Do I need technical skills?", a: "Not at all. Aurora is designed to be plug-and-play. You can train it by simply uploading your business docs or pointing it to your website." },
  { q: "How is AI Employee different?", a: "Unlike single-use 'Frankenstein' tools, Aurora offers a unified platform where voice, chat, reviews, and workflows share a single source of truth." },
  { q: "What's included?", a: "The standard package includes all six tools: Voice, Conversation, Reviews, Funnels, Content, and Workflow automation." },
  { q: "Can I customize it?", a: "Absolutely. You can choose from multiple vocal personas, set custom brand guidelines, and define unique business logic." }
];

export const SAMPLE_LEADS = [
  { id: '1', name: 'James Wilson', email: 'james@example.com', phone: '+1 555-0101', status: 'Qualified', lastCallDate: '2024-05-12', sentiment: 'Positive', notes: 'Interested in loft listings. Scheduled viewing.' },
  { id: '2', name: 'Sarah Chen', email: 'schen@tech.io', phone: '+1 555-0102', status: 'New', lastCallDate: '2024-05-11', sentiment: 'Neutral', notes: 'Inquired about bundles.' },
  { id: '3', name: 'Michael Ross', email: 'mross@legal.com', phone: '+1 555-0103', status: 'Interested', lastCallDate: '2024-05-10', sentiment: 'Positive', notes: 'Booked reservation via Aurora.' },
  { id: '4', name: 'Emily Davis', email: 'emily@boutique.com', phone: '+1 555-0104', status: 'Qualified', lastCallDate: '2024-05-09', sentiment: 'Positive', notes: 'Pricing resolved instantly.' },
];

export const CALL_METRICS = [
  { date: 'Mon', calls: 45, qualified: 12, prevented: 14, reviews: 2, revenue: 2400 },
  { date: 'Tue', calls: 52, qualified: 18, prevented: 19, reviews: 5, revenue: 3600 },
  { date: 'Wed', calls: 38, qualified: 15, prevented: 11, reviews: 3, revenue: 3000 },
  { date: 'Thu', calls: 65, qualified: 22, prevented: 24, reviews: 8, revenue: 4400 },
  { date: 'Fri', calls: 48, qualified: 20, prevented: 16, reviews: 6, revenue: 4000 },
  { date: 'Sat', calls: 24, qualified: 8, prevented: 22, reviews: 1, revenue: 1600 },
  { date: 'Sun', calls: 15, qualified: 5, prevented: 18, reviews: 0, revenue: 1000 },
];

export const STRATEGIES = [
  {
    id: 'zero-missed-calls',
    title: 'Instant Response Triage',
    tag: 'Fewer Missed Calls',
    impact: 'Critical (Retention)',
    description: 'Aurora intercepts every call post-5PM and during peak hours. Eliminates the \"voicemail black hole\" and keeps business running 24/7.',
    roi: 'Captures 40% more leads that usually bounce to competitors after hearing a voicemail.'
  },
  {
    id: 'reputation-booster',
    title: 'Review Generation Loop',
    tag: 'More Google Reviews',
    impact: 'High (Reputation)',
    description: 'After resolving a question with high empathy, Aurora identifies positive sentiment and automatically sends a personalized Google Review link via SMS.',
    roi: 'Increased review frequency by 250%. Direct impact on local SEO ranking and trust.'
  },
  {
    id: 'experience-edge',
    title: 'Elite Customer Experience',
    tag: 'Better Service',
    impact: 'High (Loyalty)',
    description: 'Natural, human-like voice with ZERO latency. Customers get answers to complex questions instantly without waiting on hold.',
    roi: '94% CSAT score. Reduces customer frustration and churn by resolving issues on the first call.'
  }
];
