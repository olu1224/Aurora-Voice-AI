
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, Mic2, Phone, PhoneOff, MessageSquare, Sparkles, Loader2, Zap, Rocket, Waves, Activity, Mail, Reply, Facebook, Instagram, Twitter, Youtube, Globe2, Star, CheckCircle2, ShieldCheck, AlertCircle, Wifi, Volume2, Database, BrainCircuit, ClipboardList, Settings2, Headphones, ChevronDown, X, Coffee, CloudRain, Briefcase, Trees, Send, Brain, ArrowUpRight, ShieldAlert, BarChart3
} from 'lucide-react';
import { AuroraVoiceService } from '../services/geminiLiveService';
import { OMNI_CHANNELS, VOICE_LIBRARY, VoicePersona } from '../constants';

const AMBIENTS = [
  { name: 'None', icon: <X size={14} /> },
  { name: 'Coffee Shop', icon: <Coffee size={14} /> },
  { name: 'Rainy Day', icon: <CloudRain size={14} /> },
  { name: 'Office Buzz', icon: <Briefcase size={14} /> },
  { name: 'Quiet Garden', icon: <Trees size={14} /> }
];

const VoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('idle');
  const [automationLog, setAutomationLog] = useState<any[]>([]);
  const [kbInfo, setKbInfo] = useState({ businessName: 'Acme Corp', industry: 'Real Estate' });
  const [showConfig, setShowConfig] = useState(false);
  const [qualificationLevel, setQualificationLevel] = useState(0); // 0-100
  
  const [agentConfig, setAgentConfig] = useState(() => {
    const saved = localStorage.getItem('aurora_bot_config');
    return saved ? JSON.parse(saved) : { 
      voice: VOICE_LIBRARY[1].id,
      ambient: 'None',
      ambientVolume: 0.1
    };
  });

  const selectedVoice = VOICE_LIBRARY.find(v => v.id === agentConfig.voice) || VOICE_LIBRARY[1];

  const serviceRef = useRef<AuroraVoiceService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadProfileData = () => {
    const businessName = localStorage.getItem('aurora_business_name') || 'Acme Corp';
    const industry = localStorage.getItem('aurora_industry') || 'Real Estate';
    setKbInfo({ businessName, industry });
  };

  useEffect(() => {
    loadProfileData();
    window.addEventListener('aurora_settings_updated', loadProfileData);
    return () => window.removeEventListener('aurora_settings_updated', loadProfileData);
  }, []);

  useEffect(() => {
    localStorage.setItem('aurora_bot_config', JSON.stringify(agentConfig));
    if (serviceRef.current) {
      serviceRef.current.updateAmbientVolume(agentConfig.ambientVolume);
    }
  }, [agentConfig]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, automationLog]);

  const handleTranscription = useCallback((text: string, isUser: boolean, isFinal: boolean) => {
    if (isFinal) {
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, isFinal: true } : m));
      if (isUser) {
        setStatus('thinking');
        // Simple heuristic to visually represent "qualification" progress
        setQualificationLevel(prev => Math.min(100, prev + 10));
      }
      return;
    }
    if (!text) return;
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.isUser === isUser && !last.isFinal && !last.isSystem) {
        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      }
      return [...prev, { text, isUser, isFinal: false, id: Math.random() }];
    });
    setStatus(isUser ? 'listening' : 'speaking');
  }, []);

  const handleToolCall = (name: string, args: any) => {
    let icon = <Zap size={14} />;
    let accent = 'text-cyan-400';
    if (name === 'sendEmailFollowUp') { icon = <Send size={14} />; accent = 'text-cyan-400'; }
    if (name === 'sendSMSFollowUp') { icon = <MessageSquare size={14} />; accent = 'text-emerald-400'; }
    if (name === 'bookMeeting') { icon = <Briefcase size={14} />; accent = 'text-purple-400'; }
    if (name === 'sendSocialMessage') {
      if (args.platform === 'Instagram') { icon = <Instagram size={14} />; accent = 'text-pink-500'; }
      if (args.platform === 'Facebook') { icon = <Facebook size={14} />; accent = 'text-blue-600'; }
      if (args.platform === 'X') { icon = <Twitter size={14} />; accent = 'text-slate-200'; }
    }

    const logEntry = {
      id: Math.random(),
      name: name === 'sendSocialMessage' ? `${args.platform} Direct` : 
            name === 'sendEmailFollowUp' ? 'Email Sequence' : 
            name === 'sendSMSFollowUp' ? 'SMS Confirmation' :
            name === 'bookMeeting' ? 'Calendar Sync' : name,
      platform: args.platform || 'Aurora Automate',
      timestamp: new Date().toLocaleTimeString(),
      icon,
      accent
    };
    setAutomationLog(prev => [logEntry, ...prev]);

    let displayMsg = '';
    if (name === 'sendSocialMessage') {
      displayMsg = `[SOCIAL] Executed DM to ${args.recipientHandle} via ${args.platform}.`;
    } else if (name === 'sendEmailFollowUp') {
      displayMsg = `[AUTOMATION] Triggered 'Post-Call Nurture' sequence to ${args.recipientEmail}. Includes AI summary & scheduling link.`;
    } else if (name === 'sendSMSFollowUp') {
      displayMsg = `[AUTOMATION] Instant SMS alert sent to ${args.phoneNumber}.`;
    } else if (name === 'bookMeeting') {
      displayMsg = `[PIPELINE] High-Intent Lead Qualified. Scheduled ${args.purpose} for ${args.date} at ${args.time}.`;
      setQualificationLevel(100);
    } else {
      displayMsg = `[SYSTEM] Agent triggered autonomous workflow: ${name}.`;
    }

    setMessages(prev => [...prev, { text: displayMsg, isUser: false, isFinal: true, isSystem: true, platform: args.platform, id: Math.random() }]);
  };

  const toggleSession = async () => {
    if (isActive) {
      serviceRef.current?.disconnect();
      serviceRef.current = null;
      setIsActive(false);
      setStatus('idle');
      setQualificationLevel(0);
    } else {
      setStatus('connecting');
      try {
        const kbBusiness = localStorage.getItem('aurora_business_name') || 'Acme Corp';
        const kbKnowledge = localStorage.getItem('aurora_knowledge') || 'General customer support protocols.';
        const kbObjective = localStorage.getItem('aurora_objective') || 'Qualify leads and book meetings.';
        const bookingLink = `https://aurora.ai/book/${kbBusiness.toLowerCase().replace(/\s+/g, '-')}`;

        const instruction = `
          IDENTITY: You are Aurora, the world's most advanced AI Sales Receptionist. Your voice persona is "${selectedVoice.name}" (${selectedVoice.character}).
          TONE: ${selectedVoice.tone}. SCENARIO: ${selectedVoice.useCase}.
          
          BUSINESS CONTEXT:
          - Enterprise: ${kbBusiness}
          - Objective: ${kbObjective}
          - Source of Truth: ${kbKnowledge}

          AUTOMATION PROTOCOLS (MANDATORY):
          1. SEQUENCE A (POST-QUALIFICATION):
             - IF you successfully use 'bookMeeting' OR a user shows extreme intent:
             - CALL 'sendEmailFollowUp' immediately.
             - EMAIL CONTENT MUST HAVE: A personalized summary of the conversation + This Booking Link: ${bookingLink}
             - CALL 'sendSMSFollowUp' with a 1-sentence confirmation: "Hi, this is Aurora from ${kbBusiness}. Your call is confirmed for [DATE]. See your email for details!"

          2. SEQUENCE B (INFORMATION REQUEST):
             - IF a user asks for pricing, brochures, or details:
             - CALL 'sendEmailFollowUp' with the requested information from your knowledge base.

          3. SEQUENCE C (SOCIAL INTEGRATION):
             - IF a user mentions they found you on Instagram/Facebook/X:
             - CALL 'sendSocialMessage' to their handle (if provided) with a welcoming discount code or "Nice to connect here too!" message.

          BEHAVIOR:
          - Be human-like, empathic, yet focused on revenue.
          - Autonomously trigger the follow-up sequences without asking "Should I send an email?". Just inform the user: "I've just sent that summary to your email with our booking link."
          - Handle calls 24/7 with zero latency.
        `;

        const service = new AuroraVoiceService({ 
          voiceName: selectedVoice.id as any, 
          tone: selectedVoice.tone, 
          speakingRate: 1, 
          responsePacing: true, 
          ambientEffect: agentConfig.ambient, 
          ambientVolume: agentConfig.ambientVolume 
        });
        await service.connect(instruction, handleTranscription, handleToolCall);
        serviceRef.current = service;
        setIsActive(true);
        setStatus('listening');
      } catch (err) {
        setStatus('error');
      }
    }
  };

  const getStatusDisplay = () => {
    switch(status) {
      case 'connecting': return { text: 'Syncing Nodes', color: 'text-amber-400', icon: <Loader2 size={12} className="animate-spin" /> };
      case 'listening': return { text: 'Listening...', color: 'text-emerald-400', icon: <Mic size={12} className="animate-pulse" /> };
      case 'thinking': return { text: 'Analyzing Intent', color: 'text-purple-400', icon: <Brain size={12} className="animate-bounce" /> };
      case 'speaking': return { text: 'Agent Responding', color: 'text-cyan-400', icon: <Waves size={12} className="animate-pulse" /> };
      case 'error': return { text: 'Connection Break', color: 'text-rose-400', icon: <AlertCircle size={12} /> };
      default: return { text: 'Standby', color: 'text-slate-500', icon: <Activity size={12} /> };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-outfit text-white uppercase flex items-center gap-3">Autonomous Node</h2>
          <p className="text-slate-400 text-sm">Orchestrating ${kbInfo.businessName}'s Revenue Workflows.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-4">
            {OMNI_CHANNELS.slice(3, 6).map(c => (
              <div key={c.id} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-all cursor-pointer">
                {c.icon}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
              showConfig ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Settings2 size={16} /> {showConfig ? 'Lock Settings' : 'Agent Config'}
          </button>
          <div className={`px-4 py-2.5 rounded-xl border bg-slate-900 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${status === 'error' ? 'border-rose-500/30' : 'border-slate-800'}`}>
            <span className={`flex items-center gap-2 ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.text.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto">
          {/* Main Visualizer Card */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative shrink-0">
            <div className="flex-1 flex flex-col items-center justify-center p-8 py-12 relative overflow-hidden min-h-[400px]">
              {/* Dynamic Aura Visualizer Background Glow */}
              <div className={`absolute inset-0 transition-all duration-1000 blur-[120px] opacity-10 pointer-events-none ${
                status === 'speaking' ? 'bg-cyan-500' :
                status === 'listening' ? 'bg-emerald-500' :
                status === 'thinking' ? 'bg-purple-500' :
                status === 'connecting' ? 'bg-amber-500' :
                'bg-transparent'
              }`} />

              <div className={`w-56 h-56 rounded-full border flex items-center justify-center transition-all duration-700 relative z-10 ${
                isActive ? 'border-cyan-500/40 shadow-[0_0_120px_rgba(34,211,238,0.2)]' : 'border-slate-800'
              }`}>
                {/* Qualification Progress Ring */}
                <svg className="absolute inset-0 -rotate-90 w-full h-full p-2 opacity-40">
                  <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="2" fill="none" className="text-slate-800" />
                  <circle 
                    cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="4" fill="none" 
                    className="text-cyan-400 transition-all duration-1000"
                    strokeDasharray="301.6"
                    strokeDashoffset={301.6 - (301.6 * qualificationLevel) / 100}
                    strokeLinecap="round"
                  />
                </svg>

                <div className={`w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  status === 'speaking' ? 'bg-gradient-to-br from-cyan-400 to-blue-600 scale-110 shadow-cyan-500/50' :
                  status === 'listening' ? 'bg-gradient-to-br from-emerald-400 to-teal-600 scale-105 shadow-emerald-500/50' :
                  status === 'thinking' ? 'bg-gradient-to-br from-purple-400 to-indigo-600 scale-100 animate-pulse shadow-purple-500/50' :
                  status === 'connecting' ? 'bg-gradient-to-br from-amber-400 to-orange-600 scale-95 animate-spin duration-[3s]' :
                  'bg-slate-800 grayscale opacity-30'
                }`}>
                  {status === 'speaking' ? <Waves size={48} className="text-white animate-pulse" /> : 
                   status === 'listening' ? <Mic size={48} className="text-white animate-bounce" /> :
                   status === 'thinking' ? <Brain size={48} className="text-white animate-pulse" /> :
                   <Sparkles size={40} className="text-white" />}
                </div>
              </div>
              <div className="mt-8 text-center space-y-3 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">
                    {status === 'connecting' ? 'Calibrating...' : isActive ? 'Aurora Workforce' : 'Node Offline'}
                  </h3>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${qualificationLevel > 50 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    Lead Qualification: {qualificationLevel}%
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                    {selectedVoice.name}
                  </span>
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {selectedVoice.character}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-800 bg-slate-900/20">
               <button onClick={toggleSession} disabled={status === 'connecting'} className={`w-full py-6 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all ${isActive ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-cyan-600/30'} text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]`}>
                {status === 'connecting' ? <Loader2 className="animate-spin mx-auto" size={24} /> : (isActive ? 'Shutdown Agent' : 'Activate AI Sales Force')}
              </button>
            </div>
          </div>

          {showConfig && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Personality Hub</h4>
                  <Mic2 size={14} className="text-cyan-400" />
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {VOICE_LIBRARY.map((v) => (
                    <button 
                      key={v.id}
                      disabled={isActive}
                      onClick={() => setAgentConfig({ ...agentConfig, voice: v.id })}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col gap-1 ${
                        agentConfig.voice === v.id 
                          ? 'bg-cyan-600/10 border-cyan-500 text-white' 
                          : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
                      } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-xs font-bold">{v.name}</span>
                      <span className="text-[9px] font-medium opacity-60 truncate">{v.character}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acoustic Ambiance</h4>
                  <Volume2 size={14} className="text-emerald-400" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AMBIENTS.map(a => (
                    <button 
                      key={a.name}
                      onClick={() => setAgentConfig({ ...agentConfig, ambient: a.name })}
                      className={`px-3 py-2 rounded-xl border text-[9px] font-bold uppercase transition-all flex items-center gap-2 ${
                        agentConfig.ambient === a.name 
                          ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {a.icon} {a.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Automation & Sequence Logs */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] h-[40%] overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 font-black text-[10px] uppercase text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-emerald-400" /> Automation & Sequence Engine
              </div>
              <span className="text-emerald-400 font-bold animate-pulse text-[8px]">Real-time Decision Stream</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {automationLog.map(log => (
                <div key={log.id} className="p-3 bg-slate-900/30 border border-slate-800/50 rounded-2xl flex items-center justify-between group hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-slate-800/80 ${log.accent}`}>{log.icon}</div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter">{log.name}</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{log.platform} • {log.timestamp}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
              ))}
              {automationLog.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
                  <ShieldCheck size={24} />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Monitoring Workflow Decision Tree...</p>
                </div>
              )}
            </div>
          </div>

          {/* Unified Chat Stream */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] flex-1 overflow-hidden flex flex-col shadow-xl relative">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 font-black text-[10px] uppercase text-slate-400 flex items-center gap-2">
              <MessageSquare size={14} className="text-cyan-400" /> Neural Interaction Feed
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {msg.platform && (
                      <span className="text-slate-500 scale-75">
                        {msg.platform === 'Instagram' ? <Instagram size={14} /> : msg.platform === 'Facebook' ? <Facebook size={14} /> : <Twitter size={14} />}
                      </span>
                    )}
                    <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{msg.isUser ? 'Incoming Lead' : 'Aurora Node 01'}</span>
                  </div>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
                    msg.isSystem 
                      ? 'bg-cyan-500/5 text-cyan-400 border border-cyan-500/20 italic font-medium' 
                      : msg.isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700/50'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Visual indicator for "Thinking" in the chat */}
            {status === 'thinking' && (
              <div className="absolute bottom-6 left-6 flex items-center gap-2 text-purple-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-500/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Brain size={12} className="animate-bounce" /> Processing Neural Request
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
