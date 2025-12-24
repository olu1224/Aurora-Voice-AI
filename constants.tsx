
import React from 'react';
import { 
  Mic2, MessageSquare, Star, Filter, FileText, Cpu, Users, Building2, TrendingUp, XCircle, CheckCircle2, BrainCircuit, Settings2, Zap, ShieldCheck, Calendar, Home, ShoppingBag, Coffee, Stethoscope, Globe, MapPin, Image as ImageIcon, Rocket, ShieldAlert, Target, Mail, ClipboardList, Reply, Facebook, Instagram, Twitter, Youtube, Globe2, PhoneCall, MessageSquareCode, Beaker, HeartPulse, Scale, Utensils
} from 'lucide-react';

export const AuroraLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="aurora-grad-1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient>
      <linearGradient id="aurora-grad-2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
    </defs>
    <circle cx="50" cy="50" r="48" stroke="url(#aurora-grad-1)" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-20" />
    <path d="M25 70C35 40 45 20 50 20C55 20 65 40 75 70" stroke="url(#aurora-grad-1)" strokeWidth="12" strokeLinecap="round" filter="url(#glow)" className="animate-pulse" />
    <path d="M35 70C42 50 48 40 50 40C52 40 58 50 65 70" stroke="url(#aurora-grad-2)" strokeWidth="8" strokeLinecap="round" className="opacity-80" />
    <circle cx="50" cy="20" r="6" fill="white" filter="url(#glow)"><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" /></circle>
  </svg>
);

export interface VoicePersona {
  id: string;
  name: string;
  character: string;
  tone: string;
  useCase: string;
  isLiveCompatible?: boolean;
}

/**
 * Supported voices for Gemini 2.5 Live API:
 * Zephyr, Puck, Charon, Kore, Fenrir
 */
export const VOICE_LIBRARY: VoicePersona[] = [
  { id: 'Zephyr', name: 'Zephyr', character: 'The Executive', tone: 'Authoritative & Polished', useCase: 'High-ticket B2B sales.', isLiveCompatible: true },
  { id: 'Puck', name: 'Puck', character: 'The Dynamic', tone: 'Vibrant & Playful', useCase: 'Entertainment and restaurant bookings.', isLiveCompatible: true },
  { id: 'Kore', name: 'Kore', character: 'The Professional', tone: 'Calm & Competent', useCase: 'Medical scheduling and admin.', isLiveCompatible: true },
  { id: 'Charon', name: 'Charon', character: 'The Guard', tone: 'Formal & Secure', useCase: 'Security and sensitive data.', isLiveCompatible: true },
  { id: 'Fenrir', name: 'Fenrir', character: 'The Resolute', tone: 'Strong & Direct', useCase: 'Logistics and supply chain.', isLiveCompatible: true }
];

export const INDUSTRY_MASTER_LIST = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: <Home size={24} />,
    problem: '80% of leads go cold because agents are in showings when the call comes in.',
    solution: 'Aurora answers instantly, qualifies the buyer budget, and books a walkthrough on your calendar while you are still at the showing.',
    roi: '4.2x Booking Rate Increase'
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: <ShieldCheck size={24} />,
    problem: 'Call centers are expensive and leads get frustrated with long hold times for simple quotes.',
    solution: 'Aurora provides instant, accurate policy quotes and handles claim intake across 40+ languages with zero hold time.',
    roi: '65% Reduction in Op-Ex'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: <HeartPulse size={24} />,
    problem: 'Front desks are overwhelmed with "Is Dr. Smith in today?" and appointment shuffling.',
    solution: 'Aurora manages the schedule, verifies insurance coverage, and sends HIPAA-compliant reminders via SMS.',
    roi: '92% Fewer No-Shows'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: <ShoppingBag size={24} />,
    problem: 'Customers abandon carts when they have a quick question about sizing or shipping.',
    solution: 'Aurora acts as a personal shopper on your site and social DMs, closing deals by resolving objections in 0.4s.',
    roi: '22% Sales Lift'
  },
  {
    id: 'legal',
    name: 'Law Firms',
    icon: <Scale size={24} />,
    problem: 'Missing a single high-value personal injury call can cost a firm thousands in settlements.',
    solution: 'Aurora performs initial intake, captures key incident details, and escalates critical cases to a partner immediately.',
    roi: 'Infinite - Never Miss a Lead'
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    icon: <Utensils size={24} />,
    problem: 'Peak hours lead to missed reservations and frustrated diners hanging up.',
    solution: 'Aurora handles table bookings and event inquiries concurrently, ensuring every caller gets a reservation.',
    roi: 'Maximized Table Occupancy'
  }
];

export const AURORA_ADVANTAGES = [
  {
    title: "0.4s Response Latency",
    desc: "In business, speed is the only variable that matters. Aurora responds faster than a human can inhale.",
    icon: <Zap size={24} />,
    accent: "text-amber-400"
  },
  {
    title: "Unified Business Logic",
    desc: "Aurora doesn't just 'chat'. She learns your entire business manual, pricing, and refund policies in seconds.",
    icon: <BrainCircuit size={24} />,
    accent: "text-cyan-400"
  },
  {
    title: "Global Scalability",
    desc: "One Aurora can handle 1,000 calls at the exact same moment. No more hiring 'seasons' or training overhead.",
    icon: <Globe size={24} />,
    accent: "text-emerald-400"
  },
  {
    title: "Cost Displacement",
    desc: "Replace a $4,000/mo salary with a pay-as-you-go model that only costs you when Aurora is actually making you money.",
    icon: <TrendingUp size={24} />,
    accent: "text-purple-400"
  }
];

export const SIX_TOOLS = [
  {
    title: "Split Testing (Experiments)",
    desc: "Deploy multiple Auroras with different scripts or voices to see which converts more leads.",
    icon: <Beaker size={32} />,
    color: "from-purple-600/20 to-indigo-600/20"
  },
  {
    title: "Workflow Automation",
    desc: "Autonomous receptionist that completes lead forms, checks emails, and follows up via SMS.",
    icon: <ClipboardList size={32} />,
    color: "from-emerald-600/20 to-teal-600/20"
  },
  {
    title: "Omni-Channel Voice",
    desc: "Human-like voice agent that handles calls across phone lines and social media platforms.",
    icon: <Mic2 size={32} />,
    color: "from-blue-600/20 to-cyan-600/20"
  },
  {
    title: "Conversation AI",
    desc: "Train specialized chatbots by simply entering your website URL. Instant intelligence extraction.",
    icon: <MessageSquareCode size={32} />,
    color: "from-cyan-600/20 to-blue-600/20"
  },
  {
    title: "Reputation Guard",
    desc: "Automatically monitors and responds to public reviews on Google, Yelp, and Facebook.",
    icon: <Star size={32} />,
    color: "from-yellow-600/20 to-orange-600/20"
  },
  {
    title: "AI Creative",
    desc: "Generate professional ad visuals and video tours for Instagram and YouTube via the Cinematic Engine.",
    icon: <ImageIcon size={32} />,
    color: "from-cyan-600/20 to-emerald-600/20"
  }
];

export const OMNI_CHANNELS = [
  { id: 'phone', name: 'Phone', icon: <PhoneCall size={18} />, color: 'text-emerald-400' },
  { id: 'sms', name: 'SMS', icon: <MessageSquare size={18} />, color: 'text-cyan-400' },
  { id: 'email', name: 'Email', icon: <Mail size={18} />, color: 'text-blue-400' },
  { id: 'facebook', name: 'Facebook', icon: <Facebook size={18} />, color: 'text-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: <Instagram size={18} />, color: 'text-pink-500' },
  { id: 'x', name: 'X / Twitter', icon: <Twitter size={18} />, color: 'text-slate-200' }
];

export const CALL_METRICS = [
  { date: 'Mon', calls: 45, qualified: 12, revenue: 2400 },
  { date: 'Tue', calls: 52, qualified: 18, revenue: 3600 },
  { date: 'Wed', calls: 38, qualified: 14, revenue: 3000 },
  { date: 'Thu', calls: 65, qualified: 25, revenue: 4400 },
  { date: 'Fri', calls: 48, qualified: 20, revenue: 4000 },
  { date: 'Sat', calls: 24, qualified: 8, revenue: 1600 },
  { date: 'Sun', calls: 15, qualified: 5, revenue: 1000 },
];

export const SAMPLE_LEADS = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', phone: '+1 415-555-0123', status: 'Qualified', lastCallDate: '2024-05-14', sentiment: 'Positive', notes: 'Interested in luxury waterfront properties. Budget $2M+.' },
  { id: '2', name: 'Mark Thompson', email: 'm.thompson@outlook.com', phone: '+1 212-555-0987', status: 'Interested', lastCallDate: '2024-05-13', sentiment: 'Neutral', notes: 'Asked about claim processing times for commercial auto.' },
  { id: '3', name: 'Elena Rodriguez', email: 'elena.r@techcorp.io', phone: '+1 650-555-4433', status: 'New', lastCallDate: '2024-05-14', sentiment: 'Positive', notes: 'Personal shopper inquiry for bridal collection.' },
  { id: '4', name: 'David Chen', email: 'dchen@legalpartners.com', phone: '+1 312-555-7788', status: 'Qualified', lastCallDate: '2024-05-12', sentiment: 'Positive', notes: 'Scheduled initial consultation for IP litigation.' },
  { id: '5', name: 'Sophia Miller', email: 'sophia.m@hospitality.net', phone: '+1 305-555-2211', status: 'New', lastCallDate: '2024-05-14', sentiment: 'Negative', notes: 'Upset about reservation double-booking. Handled via automated refund.' },
];

export const STRATEGIES = [
  { title: 'Dynamic Call Routing', tag: 'Latency & Efficiency', description: 'Aurora uses predictive modeling to route high-intent leads to your best human closers after qualification.', impact: 'Critical', roi: '15% reduction in CAC' },
  { title: 'Sentiment Nurturing', tag: 'Customer Experience', description: 'Automatically detects frustration in tone and triggers an immediate discount or supervisor escalation.', impact: 'High', roi: '22% increase in LTV' },
  { title: 'Zero-Cold Leads', tag: 'Sales Velocity', description: 'Every inbound call is met with a 0.4s response, ensuring no lead ever touches a voicemail box.', impact: 'Critical', roi: '4.2x Appointment rate' },
];

export const ONBOARDING_STEPS = [
  { id: 1, title: 'Identity Mapping', desc: 'Define your business objective and core knowledge source.' },
  { id: 2, title: 'Voice Selection', desc: 'Choose a high-fidelity persona that matches your brand authority.' },
  { id: 3, title: 'Channel Integration', desc: 'Connect your phone, social DMs, and CRM.' },
  { id: 4, title: 'Neural Testing', desc: 'Deploy your first agent in a sandbox environment.' },
];

export const CALENDAR_EVENTS = [
  { id: '1', title: 'Property Tour: 452 Oak St', time: '10:00 AM', date: 'Today', lead: 'Sarah Jenkins' },
  { id: '2', title: 'Policy Review: Thompson Auto', time: '2:30 PM', date: 'Tomorrow', lead: 'Mark Thompson' },
  { id: '3', title: 'Intake Call: IP Discovery', time: '11:15 AM', date: 'May 16', lead: 'David Chen' },
];

export const INDUSTRY_TEMPLATES = [
  { id: 're', name: 'Real Estate', icon: <Home size={18} />, prompt: 'You are a professional real estate receptionist. Qualify buyers based on budget (min $500k) and location preference.' },
  { id: 'ins', name: 'Insurance', icon: <ShieldCheck size={18} />, prompt: 'You are a licensed insurance assistant. Collect policy details and provide preliminary quotes for home and auto.' },
  { id: 'eco', name: 'E-commerce', icon: <ShoppingBag size={18} />, prompt: 'You are a high-end personal shopper. Assist with sizing, shipping status, and product recommendations.' },
  { id: 'hosp', name: 'Hospitality', icon: <Coffee size={18} />, prompt: 'You are a concierge for a luxury hotel. Handle room bookings, spa appointments, and local dinner recommendations.' },
  { id: 'gen', name: 'General Business', icon: <Globe size={18} />, prompt: 'You are a versatile executive assistant. Handle general inquiries and direct callers to the appropriate department.' },
];

export const USE_CASES = [
  { title: 'Customer Support', desc: 'Automate repetitive tickets and provide instant resolutions 24/7.' },
  { title: 'Sales Outbound', desc: 'Scale your outreach with high-fidelity voice agents that never tire.' },
  { title: 'Lead Qualification', desc: 'Filter high-intent prospects before they even talk to a human.' },
];

export const FAQS = [
  { q: 'How fast is the response time?', a: 'Aurora responds in less than 0.4 seconds, which is faster than most human reaction times.' },
  { q: 'Can I use my own voice?', a: 'Currently we support a library of high-fidelity prebuilt voices, with custom cloning available for enterprise clients.' },
  { q: 'Is it hard to integrate with my CRM?', a: 'No, Aurora supports direct webhooks and native integrations with HubSpot, Salesforce, and Pipedrive.' },
  { q: 'What languages does Aurora speak?', a: 'Aurora is fluent in over 40 languages with native accents and local dialect understanding.' },
  { q: 'Is there a contract required?', a: 'No, we operate on a purely pay-as-you-go model. You only pay for the minutes Aurora is actually working.' },
  { q: 'Is my data secure?', a: 'Yes, we use enterprise-grade encryption and follow SOC2 compliance protocols to protect all customer interactions.' },
];
