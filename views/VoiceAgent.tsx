import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Mic, Phone, MessageSquare, Sparkles, Loader2, Zap, Waves, Activity, 
  AlertCircle, Wifi, Volume2, BrainCircuit, ClipboardList, Settings2, 
  Headphones, X, Send, Brain, BarChart3, Split, Timer, Clock, Sliders, 
  RotateCcw, Heart, Target, Lightbulb, Fingerprint, TrendingUp, CheckCircle2,
  Workflow, ArrowRight, Share2, Mail, Play, Pause, ChevronRight, BellRing,
  Smartphone, FileText, ToggleRight, ToggleLeft, Plus, ShieldCheck
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { AuroraVoiceService } from '../services/geminiLiveService';
import { VOICE_LIBRARY } from '../constants';

// Fix: Moved internal icon components before their usage in AMBIENTS to avoid TDZ errors
const CalendarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const CoffeeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);
const CloudRainIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9" /><path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" />
  </svg>
);
const BriefcaseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const TreesIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m17 10 3 3m-3-3 3-3m-3 3h4m-9 10V9m0 0-3 3m3-3 3-3M9 9h4" />
  </svg>
);

const AMBIENTS = [
  { name: 'Coffee Shop Ambience', icon: <CoffeeIcon size={14} /> },
  { name: 'Rainy Day', icon: <CloudRainIcon size={14} /> },
  { name: 'Office Buzz', icon: <BriefcaseIcon size={14} /> },
  { name: 'Quiet Garden', icon: <TreesIcon size={14} /> }
];

const INITIAL_SEQUENCES = [
  { 
    id: 'Hot_Lead_Closer', 
    name: 'The Closer', 
    trigger: 'High Interest / Hesitation',
    steps: [
      { type: 'SMS', label: 'Urgency text (sent now)', delay: '0m' },
      { type: 'Email', label: 'Pricing breakdown', delay: '2h' },
      { type: 'SMS', label: 'Closing offer', delay: '24h' }
    ], 
    color: 'text-rose-400',
    borderColor: 'border-rose-500/20',
    bgColor: 'bg-rose-500/5',
    enabled: true
  },
  { 
    id: 'Warm_Education_Drip', 
    name: 'Knowledge Drop', 
    trigger: 'Information Request',
    steps: [
      { type: 'Email', label: 'PDF Brochure', delay: '0m' },
      { type: 'Email', label: 'Case Study: Real Estate', delay: '24h' },
      { type: 'SMS', label: 'Q&A session invite', delay: '48h' }
    ], 
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    enabled: true
  },
  { 
    id: 'Meeting_Confirmation_Armor', 
    name: 'Meeting Armor', 
    trigger: 'Meeting Booked',
    steps: [
      { type: 'Email', label: 'Calendar invite sync', delay: '0m' },
      { type: 'SMS', label: 'Confirmation text', delay: '0m' },
      { type: 'SMS', label: 'Reminder: 1hr before', delay: '-1h' }
    ], 
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    bgColor: 'bg-cyan-500/5',
    enabled: true
  }
];

const VoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('idle');
  const [automationLog, setAutomationLog] = useState<any[]>([]);
  const [kbInfo, setKbInfo] = useState({ businessName: 'Acme Corp', industry: 'Real Estate' });
  const [showConfig, setShowConfig] = useState(false);
  const [qualificationLevel, setQualificationLevel] = useState(0); 
  const [activeTab, setActiveTab] = useState<'persona' | 'automations' | 'effects'>('automations');
  
  // Automation State
  const [sequences, setSequences] = useState(() => {
    const saved = localStorage.getItem('aurora_automation_sequences');
    return saved ? JSON.parse(saved) : INITIAL_SEQUENCES;
  });

  // Telemetry & Interaction State
  const [sentimentHistory, setSentimentHistory] = useState<{val: number}[]>([]);
  const [extractedFacts, setExtractedFacts] = useState<string[]>([]);
  const [intentScores, setIntentScores] = useState({ interest: 0, urgency: 0, authority: 0 });
  const [activePipelines, setActivePipelines] = useState<any[]>([]);

  // A/B Testing State
  const [isABTesting, setIsABTesting] = useState(() => localStorage.getItem('aurora_ab_testing_enabled') === 'true');
  const [activeVariation, setActiveVariation] = useState<'A' | 'B' | null>(null);

  const [agentConfig, setAgentConfig] = useState(() => {
    const saved = localStorage.getItem('aurora_bot_config');
    return saved ? JSON.parse(saved) : { 
      voice: VOICE_LIBRARY[1].id,
      voiceA: VOICE_LIBRARY[0].id,
      voiceB: VOICE_LIBRARY[1].id,
      ambient: 'None',
      ambientVolume: 0.1,
      ambientEnabled: false,
      responsePacing: true 
    };
  });

  const currentVoiceId = isABTesting ? (activeVariation === 'B' ? agentConfig.voiceB : agentConfig.voiceA) : agentConfig.voice;
  const selectedVoice = VOICE_LIBRARY.find(v => v.id === currentVoiceId) || VOICE_LIBRARY[1];

  const serviceRef = useRef<AuroraVoiceService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = () => setKbInfo({ 
      businessName: localStorage.getItem('aurora_business_name') || 'Acme Corp', 
      industry: localStorage.getItem('aurora_industry') || 'Real Estate' 
    });
    loadData();
    window.addEventListener('aurora_settings_updated', loadData);
    return () => window.removeEventListener('aurora_settings_updated', loadData);
  }, []);

  useEffect(() => {
    localStorage.setItem('aurora_bot_config', JSON.stringify(agentConfig));
    localStorage.setItem('aurora_automation_sequences', JSON.stringify(sequences));
    serviceRef.current?.updateAmbient(agentConfig.ambient, agentConfig.ambientVolume, agentConfig.ambientEnabled);
  }, [agentConfig, sequences]);

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const toggleSequence = (id: string) => {
    setSequences((prev: any[]) => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const updateTelemetry = useCallback((text: string, isUser: boolean) => {
    if (!isUser) return;
    const lower = text.toLowerCase();
    if (lower.includes('price') || lower.includes('cost')) setIntentScores(p => ({ ...p, interest: Math.min(100, p.interest + 15) }));
    if (lower.includes('now') || lower.includes('asap')) setIntentScores(p => ({ ...p, urgency: Math.min(100, p.urgency + 25) }));
    if (lower.includes('manager') || lower.includes('decide')) setIntentScores(p => ({ ...p, authority: Math.min(100, p.authority + 20) }));
    const sentiment = lower.includes('bad') ? -8 : lower.includes('good') ? 8 : (Math.random() * 6 - 3);
    setSentimentHistory(prev => [...prev.slice(-19), { val: sentiment }]);
  }, []);

  const handleTranscription = useCallback((text: string, isUser: boolean, isFinal: boolean) => {
    if (isFinal) {
      if (text) {
        updateTelemetry(text, isUser);
        setMessages(prev => [...prev, { text, isUser, isFinal: true, id: Math.random() }]);
      }
      setStatus(isUser ? 'thinking' : 'listening');
      if (isUser) setQualificationLevel(prev => Math.min(100, prev + 5));
      return;
    }
    if (!text || text.trim() === '') return;
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.isUser === isUser && !last.isFinal) return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      return [...prev, { text, isUser, isFinal: false, id: Math.random() }];
    });
    setStatus(isUser ? 'listening' : 'speaking');
  }, [updateTelemetry]);

  const handleToolCall = (name: string, args: any) => {
    const timestamp = new Date().toLocaleTimeString();
    
    if (name === 'triggerNurtureSequence') {
      const seq = sequences.find((s: any) => s.id === args.sequenceType);
      if (seq && seq.enabled) {
        setActivePipelines(prev => [{ ...seq, startTime: timestamp, status: 'Active', currentStep: 0 }, ...prev]);
        setAutomationLog(prev => [{ id: Math.random(), name: `Sequence Init: ${seq.name}`, timestamp, type: 'automation', icon: <Workflow size={14} /> }, ...prev]);
      }
    } else if (name === 'sendEmailFollowUp') {
      setAutomationLog(prev => [{ id: Math.random(), name: `Email Sent: ${args.subject}`, timestamp, type: 'tool', icon: <Mail size={14} className="text-blue-400" /> }, ...prev]);
    } else if (name === 'sendSMSFollowUp') {
      setAutomationLog(prev => [{ id: Math.random(), name: `SMS Outbound: ${args.message.substring(0, 15)}...`, timestamp, type: 'tool', icon: <Smartphone size={14} className="text-emerald-400" /> }, ...prev]);
    } else {
      setAutomationLog(prev => [{ id: Math.random(), name: name === 'bookMeeting' ? 'Calendar Sync' : name, timestamp, type: 'tool', icon: <CalendarIcon size={14} className="text-cyan-400" /> }, ...prev]);
    }
    
    if (name === 'bookMeeting') {
      setQualificationLevel(100);
      setExtractedFacts(prev => Array.from(new Set([...prev, "Closing Event - Meeting Confirmed"])));
    }
  };

  const toggleSession = async () => {
    if (isActive) {
      serviceRef.current?.disconnect();
      serviceRef.current = null;
      setIsActive(false);
      setStatus('idle');
      setQualificationLevel(0);
      setActivePipelines([]);
    } else {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) await (window as any).aistudio.openSelectKey();
      setStatus('connecting');
      let variation: 'A' | 'B' | null = null;
      if (isABTesting) {
        variation = Math.random() > 0.5 ? 'A' : 'B';
        setActiveVariation(variation);
      }
      try {
        const service = new AuroraVoiceService({ voiceName: selectedVoice.id as any, tone: selectedVoice.tone, speakingRate: 1, responsePacing: agentConfig.responsePacing, ambientEffect: agentConfig.ambient, ambientVolume: agentConfig.ambientVolume, ambientEnabled: agentConfig.ambientEnabled });
        await service.connect(`IDENTITY: Aurora. BUSINESS: ${kbInfo.businessName}. Close or Nurture using automated sequences.`, handleTranscription, handleToolCall);
        serviceRef.current = service;
        setIsActive(true);
        setStatus('listening');
      } catch (err) { setStatus('error'); }
    }
  };

  const statusInfo = useMemo(() => {
    switch(status) {
      case 'connecting': return { text: 'Connecting', color: 'text-amber-400', orbGradient: 'from-amber-400 to-orange-600', icon: <Loader2 size={12} className="animate-spin" /> };
      case 'listening': return { text: 'Listening', color: 'text-emerald-400', orbGradient: 'from-emerald-400 to-teal-600', icon: <Mic size={12} className="animate-pulse" /> };
      case 'thinking': return { text: 'Thinking', color: 'text-purple-400', orbGradient: 'from-purple-400 to-indigo-600', icon: <Brain size={12} className="animate-bounce" /> };
      case 'speaking': return { text: 'Speaking', color: 'text-cyan-400', orbGradient: 'from-cyan-400 to-blue-600', icon: <Waves size={12} className="animate-pulse" /> };
      case 'error': return { text: 'Node Error', color: 'text-rose-400', orbGradient: 'from-rose-400 to-red-600', icon: <AlertCircle size={12} /> };
      default: return { text: 'Idle', color: 'text-slate-500', orbGradient: 'from-slate-700 to-slate-900', icon: <Activity size={12} /> };
    }
  }, [status]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">Autonomous Node</h2>
          <p className="text-slate-400 text-sm italic font-medium">Synchronizing ${kbInfo.businessName}'s automation engine.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowConfig(!showConfig)} className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${showConfig ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <Settings2 size={16} /> Automation Grid
          </button>
          <div className="px-5 py-3 rounded-xl border bg-slate-900/40 border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex justify-center backdrop-blur-md">
            <span className={`flex items-center gap-2.5 ${statusInfo.color}`}>
              <span className={`w-2 h-2 rounded-full bg-current ${status !== 'idle' ? 'animate-ping' : ''}`} />
              {statusInfo.icon} {statusInfo.text.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Control Panel */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl shrink-0">
            <div className="flex-1 flex flex-col items-center justify-center p-8 py-10 relative overflow-hidden min-h-[360px]">
              <div className={`absolute inset-0 blur-[120px] opacity-10 transition-colors duration-1000 ${statusInfo.color.replace('text', 'bg')}`} />
              <div className={`w-44 h-44 rounded-full border flex items-center justify-center relative z-10 transition-all ${isActive ? 'border-cyan-500/40 shadow-[0_0_80px_rgba(34,211,238,0.2)]' : 'border-slate-800'}`}>
                <svg className="absolute inset-0 -rotate-90 w-full h-full p-2 opacity-40">
                  <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="4" fill="none" className="text-cyan-400 transition-all duration-1000" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * qualificationLevel) / 100} />
                </svg>
                <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 bg-gradient-to-br ${statusInfo.orbGradient} ${isActive ? 'scale-110 animate-pulse' : 'grayscale'}`}>
                  {isActive ? <Fingerprint size={40} className="text-white" /> : <Sparkles size={32} className="text-slate-400" />}
                </div>
              </div>
              <div className="mt-8 text-center space-y-2 relative z-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Aurora {activeVariation ? `(Var ${activeVariation})` : ''}</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest ${qualificationLevel > 50 ? 'text-emerald-400' : 'text-slate-500'}`}>Potential Outcome: {qualificationLevel}%</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-900/20">
               <button onClick={toggleSession} disabled={status === 'connecting'} className={`w-full py-5 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'bg-rose-600 hover:bg-rose-500' : 'bg-gradient-to-r from-cyan-600 to-blue-700'} text-white shadow-xl`}>
                {status === 'connecting' ? 'Initiating...' : (isActive ? 'Shutdown Node' : 'Initialize Node')}
               </button>
            </div>
          </div>

          {showConfig && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-2 space-y-2 shadow-2xl animate-in slide-in-from-left-4">
              <div className="flex p-1 bg-slate-950 rounded-[20px] border border-slate-800">
                <button onClick={() => setActiveTab('automations')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'automations' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500'}`}>Pipelines</button>
                <button onClick={() => setActiveTab('persona')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'persona' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}>Persona</button>
                <button onClick={() => setActiveTab('effects')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'effects' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Ambience</button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[340px] custom-scrollbar">
                {activeTab === 'automations' && (
                  <div className="space-y-4">
                    {sequences.map((s: any) => (
                      <div key={s.id} className={`p-4 rounded-2xl border transition-all ${s.enabled ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-950 opacity-40 grayscale'} flex flex-col gap-3`}>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase ${s.color}`}>{s.name}</span>
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Trigger: {s.trigger}</span>
                          </div>
                          <button onClick={() => toggleSequence(s.id)} className="text-slate-400 hover:text-white transition-colors">
                            {s.enabled ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} />}
                          </button>
                        </div>
                        <div className="space-y-1.5 pt-1 border-t border-slate-800/50">
                          {s.steps.map((step: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
                              <div className="flex items-center gap-2">
                                {step.type === 'Email' ? <Mail size={10} className="text-blue-400" /> : <Smartphone size={10} className="text-emerald-400" />}
                                <span>{step.label}</span>
                              </div>
                              <span className="text-[8px] text-slate-600 italic">{step.delay}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-3 border border-dashed border-slate-800 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white hover:border-slate-500 transition-all flex items-center justify-center gap-2">
                       <Plus size={12} /> Add Sequence
                    </button>
                  </div>
                )}
                {activeTab === 'persona' && (
                  <div className="space-y-3">
                    {VOICE_LIBRARY.map(v => (
                      <button key={v.id} onClick={() => setAgentConfig({...agentConfig, voice: v.id})} className={`w-full p-4 rounded-2xl border text-left transition-all ${agentConfig.voice === v.id ? 'bg-cyan-500/10 border-cyan-500' : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100'}`}>
                        <p className="text-xs font-black text-white">{v.name}</p>
                        <p className="text-[9px] text-slate-500 italic mt-1">{v.character}</p>
                      </button>
                    ))}
                  </div>
                )}
                {activeTab === 'effects' && (
                  <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Volume2 size={14} /> Background Noise</span>
                      <button onClick={() => setAgentConfig({...agentConfig, ambientEnabled: !agentConfig.ambientEnabled})} className={`w-10 h-5 rounded-full relative transition-all ${agentConfig.ambientEnabled ? 'bg-indigo-600' : 'bg-slate-800'}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${agentConfig.ambientEnabled ? 'left-5.5' : 'left-0.5'}`} /></button>
                    </div>
                    {agentConfig.ambientEnabled && (
                      <div className="grid grid-cols-2 gap-2">
                        {AMBIENTS.map(a => (
                          <button key={a.name} onClick={() => setAgentConfig({...agentConfig, ambient: a.name})} className={`p-2 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all ${agentConfig.ambient === a.name ? 'border-indigo-500 text-indigo-400' : 'border-slate-800 text-slate-600'}`}>{a.name}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center Stream */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] flex-1 overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 font-black text-[10px] uppercase text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2"><MessageSquare size={14} className="text-cyan-400" /> Conversion Uplink</div>
              <div className="flex items-center gap-3">
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Buffer: Healthy</span>
                 <Wifi size={12} className="text-emerald-500 animate-pulse" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950/20">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                  <BrainCircuit size={48} />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Listening for Neural Sync...</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                  <span className="text-[8px] font-black uppercase text-slate-700 mb-1 tracking-widest">{msg.isUser ? 'Customer Voice' : 'Aurora Voice'}</span>
                  <div className={`max-w-[85%] p-4 rounded-[20px] text-[13px] leading-relaxed shadow-lg ${msg.isUser ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/10' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Right Telemetry */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-6 shadow-xl space-y-8 flex flex-col h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Workflow size={14} className="text-purple-400" /> Automation Telemetry</h4>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[7px] font-black text-slate-500 uppercase">Realtime</span>
                </div>
              </div>
              
              {activePipelines.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center opacity-40 text-center gap-3">
                   <BellRing size={20} className="text-slate-600" />
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Awaiting conversion triggers.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activePipelines.map((pipe, idx) => (
                    <div key={idx} className={`p-4 bg-slate-900/60 border border-slate-800 rounded-2xl animate-in slide-in-from-right-2 overflow-hidden relative`}>
                       <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-5 blur-3xl pointer-events-none" />
                       <div className="flex items-center justify-between mb-3 relative z-10">
                         <span className={`text-[10px] font-black uppercase ${pipe.color}`}>{pipe.name}</span>
                         <span className="text-[8px] text-slate-600 font-bold">{pipe.startTime}</span>
                       </div>
                       <div className="flex gap-1 mb-3">
                         {pipe.steps.map((_: any, i: number) => (
                           <div key={i} className={`h-1 flex-1 rounded-full ${i <= pipe.currentStep ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-800'}`} />
                         ))}
                       </div>
                       <div className="flex items-center justify-between">
                         <p className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-2">
                           <CheckCircle2 size={10} className="text-emerald-500" /> 
                           Step {pipe.currentStep + 1}: {pipe.steps[pipe.currentStep].label}
                         </p>
                         <div className="flex items-center gap-1">
                           <Loader2 size={8} className="animate-spin text-slate-600" />
                           <span className="text-[7px] text-slate-600 uppercase font-black">Syncing</span>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-rose-500" /> Sentiment Arc</h4>
              <div className="h-24 w-full bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentHistory}>
                    <Area type="monotone" dataKey="val" stroke="#22d3ee" fill="#22d3ee20" strokeWidth={2} isAnimationActive={false} />
                    <YAxis domain={[-10, 10]} hide />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
                   <div className="flex justify-between text-[7px] font-black uppercase text-emerald-400"><span>Positive</span></div>
                   <div className="border-t border-slate-800 w-full" />
                   <div className="flex justify-between text-[7px] font-black uppercase text-rose-400"><span>Negative</span></div>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                {[
                  { label: 'Closure Intent', val: intentScores.interest, color: 'bg-emerald-500', icon: <TrendingUp size={10} /> },
                  { label: 'Time Scarcity', val: intentScores.urgency, color: 'bg-amber-500', icon: <Clock size={10} /> },
                  { label: 'Authority Score', val: intentScores.authority, color: 'bg-cyan-500', icon: <ShieldCheck size={10} /> }
                ].map(s => (
                  <div key={s.label} className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-black uppercase text-slate-600">
                      <span className="flex items-center gap-1">{s.icon} {s.label}</span>
                      <span>{s.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${s.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-auto">
              <div className="p-4 bg-gradient-to-br from-cyan-600/10 to-indigo-600/10 border border-cyan-500/20 rounded-2xl">
                 <div className="flex items-center justify-between mb-2">
                   <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5"><Zap size={10} /> Lead Rating</p>
                   <span className="text-xs font-black text-white">{qualificationLevel}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-700" style={{ width: `${qualificationLevel}%` }} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon stubs for specific styles moved to top

export default VoiceAgent;