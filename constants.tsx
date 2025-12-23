
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
  { id: 'x', name: 'X / Twitter', icon: <Twitter size={18} />, color: 'text-slate-200' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube size={18} />, color: 'text-rose-600' },
  { id: 'web', name: 'Website', icon: <Globe2 size={18} />, color: 'text-indigo-400' },
  { id: 'reviews', name: 'Google Reviews', icon: <Star size={18} />, color: 'text-amber-400' },
];

export const INDUSTRY_TEMPLATES = [
  { id: 'insurance', name: 'Insurance', icon: <ShieldCheck size={18} />, prompt: "You are an elite insurance agent. Qualify leads by asking about their current policy age, family size, and goals. Book an appointment if they spend >$100/mo." },
  { id: 'real-estate', name: 'Real Estate', icon: <Home size={18} />, prompt: "You are a senior real estate concierge. Ask about property type, pre-approval status, and timeline. Book a walkthrough immediately if timeline is < 30 days." },
  { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingBag size={18} />, prompt: "You are a customer growth agent. Handle tracking, returns, and upselling based on style. Push a 20% discount if they mention a competitor." },
  { id: 'hospitality', name: 'Hospitality', icon: <Coffee size={18} />, prompt: "You are a hotel front-desk manager. Handle room availability and local concierge duties. Upsell breakfast and airport shuttle services." },
  { id: 'medical', name: 'Medical/Health', icon: <Stethoscope size={18} />, prompt: "You are a patient coordinator. Filter by symptoms and insurance provider. Prioritize scheduling for high-value aesthetic procedures." },
];

export const STRATEGIES = [
  { id: 'social-conversion', title: 'Social Lead Capture', tag: 'Omni-Channel', impact: 'Critical', description: 'Aurora monitors Instagram and Facebook DMs. She qualifies prospects and books meetings before they lose interest.', roi: 'Estimated 65% increase in social media conversion rates.' },
  { id: 'youtube-growth', title: 'Comment Engagement', tag: 'Community', impact: 'High', description: 'Aurora replies to high-intent comments on YouTube videos, driving traffic to your sales landing pages.', roi: '300% boost in organic engagement velocity.' },
  { id: 'review-sync', title: 'Reputation Loop', tag: 'Trust', impact: 'Critical', description: 'Automatic 5-star review responses and solicitation after positive interactions on any channel.', roi: 'Establishes industry dominance in local search.' }
];

export const FAQS = [
  { 
    q: "How does Aurora manage multiple social media logins?", 
    a: "Aurora uses secure OAuth2 protocols to connect to your business suites. She can manage Facebook, Instagram, X, and YouTube concurrently through one unified neural node, maintaining brand consistency everywhere." 
  },
  { 
    q: "Can Aurora handle image-based DMs on Instagram?", 
    a: "Yes. Using Gemini's visual intelligence, Aurora can analyze screenshots, receipts, or property photos sent via DMs to qualify leads more effectively than text-only bots." 
  },
  { 
    q: "What about negative reviews on Google or Yelp?", 
    a: "Aurora detects negative sentiment instantly and triggers a 'Crisis Response' protocol. She offers professional resolutions and escalates the issue to your human team before the reputation damage scales." 
  },
  { 
    q: "Does it work with my current website's live chat?", 
    a: "Perfectly. Aurora can be embedded as a voice or text widget on any website, providing a seamless transition from web browsing to a qualified sales call." 
  },
  { 
    q: "Can Aurora analyze video content on YouTube?", 
    a: "Aurora can 'watch' your uploads to understand context and then intelligently moderate comments, answering questions about your products mentioned in the video." 
  },
  { 
    q: "Is there an extra cost for social media channels?", 
    a: "No. Our pay-as-you-go model applies across all channels. You are only charged for meaningful interactions and task completions, regardless of the platform." 
  },
  { 
    q: "How secure is my social media access?", 
    a: "We use enterprise-grade vaulting. Your social credentials are never stored in plain text and our AI operates within the strict API limits defined by each platform (X, Meta, Google)." 
  },
  { 
    q: "Can she handle complex scheduling across multiple team calendars?", 
    a: "Yes. Aurora syncs with Google Calendar and Outlook, finding the best slot for the prospect based on your team's real-time availability." 
  },
  { 
    q: "What languages can the omni-channel agent support?", 
    a: "Aurora is multi-lingual across 40+ languages. She can reply to an Instagram DM in Spanish, answer a phone call in English, and respond to a YouTube comment in Japanese simultaneously." 
  }
];

export const CALENDAR_EVENTS = [
  { id: '1', title: 'Consultation: Loft Sales', time: '10:00 AM', date: 'Today', type: 'High Value' },
  { id: '2', title: 'Claim Review: Auto Policy', time: '1:30 PM', date: 'Today', type: 'Retention' },
  { id: '3', title: 'Site Visit: Downtown HQ', time: '4:00 PM', date: 'Tomorrow', type: 'Closing' },
];

export const SAMPLE_LEADS = [
  { id: '1', name: 'Sarah Wilson', email: 'swilson@loft.com', phone: '+1 555-9011', status: 'Qualified', lastCallDate: '2024-05-20', sentiment: 'Positive', notes: 'Scheduled via Instagram DM.' },
  { id: '2', name: 'Mike Johnson', email: 'mj@tech.co', phone: '+1 555-8822', status: 'Interested', lastCallDate: '2024-05-19', sentiment: 'Neutral', notes: 'Asked about bulk insurance discounts via SMS.' },
];

export const CALL_METRICS = [
  { date: 'Mon', revenue: 2400, calls: 45, qualified: 12 },
  { date: 'Tue', revenue: 3600, calls: 52, qualified: 18 },
  { date: 'Wed', revenue: 3000, calls: 38, qualified: 15 },
  { date: 'Thu', revenue: 4400, calls: 65, qualified: 22 },
  { date: 'Fri', revenue: 4000, calls: 48, qualified: 16 },
  { date: 'Sat', revenue: 1600, calls: 24, qualified: 8 },
  { date: 'Sun', revenue: 1000, calls: 15, qualified: 5 },
];

export const USE_CASES = [
  { title: "Real Estate", desc: "Qualify buyers on Instagram and book walkthroughs instantly." },
  { title: "Insurance", desc: "Handle claims via SMS and high-value policy inquiries via Email." },
  { title: "Retail", desc: "Automate responses to YouTube comments and Facebook tracking requests." }
];

export const ONBOARDING_STEPS = [
  { title: "1. Train Your Employee", desc: "Upload your business docs. Aurora builds a custom brain in seconds.", icon: <BrainCircuit size={24} />, color: "text-purple-400", link: "/knowledge" },
  { title: "2. Define Persona", desc: "Select from 14+ elite voices tailored for high-conversion sales.", icon: <Settings2 size={24} />, color: "text-cyan-400", link: "/agent" },
  { title: "3. Go Live & Scale", desc: "Connect to your phone or site and start capturing revenue 24/7.", icon: <Zap size={24} />, color: "text-emerald-400", link: "/agent" }
];
