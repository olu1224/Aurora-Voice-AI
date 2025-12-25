
import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  BrainCircuit, 
  Target, 
  Power, 
  Globe, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Sparkles, 
  ChevronDown, 
  Info, 
  Plus, 
  Download,
  Link,
  Loader2,
  Mic2,
  Volume2,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Coffee,
  CloudRain,
  Briefcase,
  Trees,
  X,
  FileText,
  Upload,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Headphones,
  Instagram,
  Facebook,
  Twitter,
  Activity,
  ShieldAlert,
  Send,
  User,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { VOICE_LIBRARY, VoicePersona } from '../constants';
import { SocialMessage } from '../types';
import { socialAI } from '../services/socialChatService';

const ConversationAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'training' | 'goals' | 'channels'>('channels');
  const [isBotOn, setIsBotOn] = useState(true);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [socialFeed, setSocialFeed] = useState<SocialMessage[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Channels State
  const [channels, setChannels] = useState([
    { id: 'ig', name: 'Instagram', connected: true, health: 100, username: '@sterling_corp', icon: <Instagram className="text-pink-500" /> },
    { id: 'fb', name: 'Facebook', connected: true, health: 98, username: 'Sterling Logistics', icon: <Facebook className="text-blue-600" /> },
    { id: 'x', name: 'X / Twitter', connected: false, health: 0, username: 'Not Connected', icon: <Twitter className="text-slate-200" /> }
  ]);

  const [botConfig, setBotConfig] = useState(() => {
    const saved = localStorage.getItem('aurora_bot_config');
    return saved ? JSON.parse(saved) : {
      voice: 'Zephyr',
      speed: 1.0,
      tone: 'Professional & Empathetic',
      ambient: 'None',
      ambientVolume: 0.1
    };
  });

  useEffect(() => {
    localStorage.setItem('aurora_bot_config', JSON.stringify(botConfig));
  }, [botConfig]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [socialFeed]);

  const toggleChannel = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setChannels(prev => prev.map(ch => 
        ch.id === id ? { ...ch, connected: !ch.connected, health: !ch.connected ? 100 : 0 } : ch
      ));
      setIsSyncing(null);
    }, 2000);
  };

  const simulateIncomingMessage = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const platforms = ['Instagram', 'Facebook', 'X'] as const;
    const senders = ['Marcus Thorne', 'Elena Vance', 'Julian Rossi', 'Sarah Jenkins'];
    const prompts = [
      "Hi! I'm interested in your property management services. Do you have a brochure?",
      "How much do you charge for commercial auto insurance?",
      "I need to book a viewing for the downtown loft. Is Saturday open?",
      "Can Aurora help me with my claim status? It's been 3 days."
    ];

    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    const randomSender = senders[Math.floor(Math.random() * senders.length)];
    const randomText = prompts[Math.floor(Math.random() * prompts.length)];

    const incoming: SocialMessage = {
      id: Math.random().toString(),
      platform: randomPlatform,
      sender: randomSender,
      text: randomText,
      timestamp: new Date().toLocaleTimeString(),
      isAuroraResponse: false,
      status: 'Read'
    };

    setSocialFeed(prev => [...prev, incoming]);

    // Now Aurora responds
    const businessContext = localStorage.getItem('aurora_knowledge') || "A premium logistics and consulting firm.";
    const responseText = await socialAI.generateResponse(randomPlatform, randomSender, randomText, businessContext);

    setTimeout(() => {
      const response: SocialMessage = {
        id: Math.random().toString(),
        platform: randomPlatform,
        sender: 'Aurora AI',
        text: responseText,
        timestamp: new Date().toLocaleTimeString(),
        isAuroraResponse: true,
        status: 'Delivered'
      };
      setSocialFeed(prev => [...prev, response]);
      setIsSimulating(false);
    }, 1500);
  };

  const renderChannels = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Channel Management */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Smartphone size={14} className="text-cyan-400" /> Active Uplinks
             </h3>
             <button onClick={simulateIncomingMessage} disabled={isSimulating} className="text-[9px] font-black text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full hover:bg-cyan-500/10 transition-all flex items-center gap-2 uppercase tracking-tighter">
               {isSimulating ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />} Test Simulation
             </button>
          </div>

          <div className="space-y-4">
            {channels.map((ch) => (
              <div key={ch.id} className={`p-5 rounded-2xl border transition-all ${ch.connected ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-950/20 border-slate-900 opacity-60'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-xl border border-slate-800">
                      {ch.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{ch.name}</p>
                      <p className="text-[9px] text-slate-500 font-medium">{ch.username}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleChannel(ch.id)}
                    disabled={isSyncing === ch.id}
                    className={`w-12 h-6 rounded-full relative transition-all ${ch.connected ? 'bg-emerald-600' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${ch.connected ? 'left-7' : 'left-1'}`}>
                      {isSyncing === ch.id && <Loader2 size={10} className="animate-spin text-slate-950 m-auto mt-0.5" />}
                    </div>
                  </button>
                </div>
                {ch.connected && (
                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                    <span className="text-emerald-400 flex items-center gap-1"><Activity size={10} className="animate-pulse" /> operational</span>
                    <span className="text-slate-600">{ch.health}% Health</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-cyan-500/30 hover:text-cyan-400 transition-all flex items-center justify-center gap-2 bg-slate-950/20">
            <Plus size={14} /> Integrate WhatsApp
          </button>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 rounded-[32px] p-6 shadow-lg">
           <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <BrainCircuit size={14} /> Neural Pacing
           </h4>
           <p className="text-[11px] text-slate-400 italic mb-6 leading-relaxed">
             Aurora's autonomous social mode responds to inquiries based on your knowledge base logic. Current response latency: <strong>0.8s</strong>.
           </p>
           <div className="space-y-3">
             <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Response Quality</span>
                <span className="text-white">96%</span>
             </div>
             <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] w-[96%]" />
             </div>
           </div>
        </div>
      </div>

      {/* Live Social Inbox */}
      <div className="lg:col-span-8 flex flex-col h-[700px]">
        <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] flex-1 overflow-hidden flex flex-col shadow-2xl relative">
          <div className="p-5 border-b border-slate-800 bg-slate-900/60 font-black text-[10px] uppercase text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2"><MessageSquare size={14} className="text-cyan-400" /> Omni-Channel Command Feed</div>
            <div className="flex items-center gap-2"><Wifi size={12} className="text-emerald-500 animate-pulse" /> Cloud Sync Active</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950/20 custom-scrollbar">
            {socialFeed.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                <Globe size={64} className="animate-spin duration-[10s]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Listening for Global Activity...</p>
              </div>
            )}
            
            {socialFeed.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isAuroraResponse ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3`}>
                <div className="flex items-center gap-2 mb-2">
                   {!msg.isAuroraResponse && (
                     <div className={`p-1 rounded bg-slate-900 border border-slate-800 text-[10px]`}>
                       {msg.platform === 'Instagram' && <Instagram size={10} className="text-pink-500" />}
                       {msg.platform === 'Facebook' && <Facebook size={10} className="text-blue-600" />}
                       {msg.platform === 'X' && <Twitter size={10} className="text-white" />}
                     </div>
                   )}
                   <span className="text-[9px] font-black uppercase text-slate-700 tracking-widest">
                     {msg.sender} {msg.isAuroraResponse ? '(Aurora Node)' : ''}
                   </span>
                </div>
                <div className={`max-w-[85%] p-5 rounded-[24px] text-[13px] leading-relaxed shadow-xl font-medium relative ${
                  msg.isAuroraResponse 
                    ? 'bg-slate-900 text-cyan-300 border border-cyan-500/20 rounded-tr-none' 
                    : 'bg-white/5 text-white border border-white/5 rounded-tl-none backdrop-blur-md'
                }`}>
                  {msg.text}
                  <div className="mt-3 flex items-center justify-between text-[8px] font-black uppercase tracking-tighter text-slate-600">
                    <span>{msg.timestamp}</span>
                    <span className="flex items-center gap-1">{msg.status === 'Delivered' ? <CheckCircle2 size={10} /> : <Activity size={10} />} {msg.status}</span>
                  </div>
                  {msg.isAuroraResponse && (
                    <div className="absolute -left-10 top-0 p-2 bg-cyan-600/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                      <Sparkles size={14} className="animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={feedEndRef} />
          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-4 p-4 bg-slate-950/80 rounded-[20px] border border-slate-800">
               <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-700"><User size={20} /></div>
               <input disabled type="text" placeholder="Omni-channel input locked in Autonomous Mode..." className="flex-1 bg-transparent text-sm text-slate-500 outline-none" />
               <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-600 hover:text-white transition-colors"><Send size={18} /></button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 space-y-10 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold font-outfit text-white">Neural Persona Library</h3>
            <p className="text-sm text-slate-500 italic">Select the vocal identity that best represents your brand's authority.</p>
          </div>
          <div className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12} className="animate-pulse" /> {VOICE_LIBRARY.length} High-Fidelity Voices
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VOICE_LIBRARY.map((v: VoicePersona) => (
            <button 
              key={v.id}
              onClick={() => setBotConfig({...botConfig, voice: v.id})}
              className={`p-6 rounded-[24px] border transition-all text-left group relative overflow-hidden flex flex-col h-full ${
                botConfig.voice === v.id 
                  ? 'bg-cyan-600/10 border-cyan-500 shadow-[0_10px_30px_rgba(34,211,238,0.1)]' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl transition-all ${botConfig.voice === v.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-cyan-400'}`}>
                  <Headphones size={20} />
                </div>
              </div>
              <div className="relative z-10">
                <h4 className="font-bold text-white text-lg">{v.name}</h4>
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-3">{v.character}</p>
                <p className="text-xs text-slate-300 font-medium italic mb-2">"{v.tone}"</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Use Case: {v.useCase}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Conversation Hub</h2>
          <p className="text-slate-400 mt-1 italic font-medium">Managing multi-platform autonomous interactions.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={() => setIsBotOn(!isBotOn)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              isBotOn ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            <Power size={14} /> {isBotOn ? 'Neural Active' : 'Uplink Sleep'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit">
        {[
          { id: 'channels', label: 'Social Inbox', icon: <Globe size={14} /> },
          { id: 'training', label: 'Knowledge Base', icon: <BrainCircuit size={14} /> },
          { id: 'settings', label: 'Voice Persona', icon: <Headphones size={14} /> },
          { id: 'goals', label: 'Sales Strategy', icon: <Target size={14} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12">
          {activeTab === 'channels' && renderChannels()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'training' && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-[40px] p-16 flex flex-col items-center justify-center text-center space-y-6">
               <div className="p-8 bg-slate-900 rounded-[40px] border border-slate-800">
                 <Database size={64} className="text-cyan-400 animate-pulse" />
               </div>
               <div className="max-w-md">
                 <h4 className="text-2xl font-bold text-white mb-2">Neural Knowledge Mapper</h4>
                 <p className="text-sm text-slate-500 italic mb-8">Synchronize your business documents, URLs, and PDFs to Aurora's core memory. This logic is shared across all social DMs.</p>
                 <button className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3 mx-auto">
                   Sync Document Node <Upload size={16} />
                 </button>
               </div>
            </div>
          )}
          {(activeTab === 'goals') && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-[40px] p-16 flex flex-col items-center justify-center text-center space-y-6">
               <div className="p-8 bg-slate-900 rounded-[40px] border border-slate-800">
                 <Target size={64} className="text-emerald-400" />
               </div>
               <div className="max-w-md">
                 <h4 className="text-2xl font-bold text-white mb-2">Strategic Conversion Grid</h4>
                 <p className="text-sm text-slate-500 italic mb-8">Define Aurora's primary objective for social interactions. Currently set to: <strong>"Book Property Walkthroughs"</strong>.</p>
                 <button className="px-10 py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 mx-auto">
                   Edit Objective Parameters <Settings size={16} />
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Internal icon helper
const Database: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
  </svg>
);

const Wifi: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

export default ConversationAI;
