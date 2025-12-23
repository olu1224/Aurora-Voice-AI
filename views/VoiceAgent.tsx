
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  Phone, 
  PhoneOff, 
  Settings2, 
  MessageSquare, 
  X, 
  Check, 
  Sparkles, 
  Loader2, 
  User,
  Coffee,
  Briefcase,
  Zap,
  Shield,
  Music,
  Heart,
  Wifi,
  Volume2,
  Waves,
  Rocket,
  Gavel,
  ShoppingBag,
  Star,
  Sun,
  BookOpen,
  CloudRain,
  Building2,
  Trees,
  FastForward,
  ShieldCheck,
  ShieldAlert,
  VolumeX,
  Target,
  Search
} from 'lucide-react';
import { AuroraVoiceService, AgentConfig, AmbientType } from '../services/geminiLiveService';
import { GoogleGenAI } from "@google/genai";

interface Message {
  text: string;
  isUser: boolean;
  id: string;
  isFinal: boolean;
  isSystem?: boolean;
}

interface CallSummary {
  qualification: string;
  decisions: string[];
  actionItems: string[];
  overallSummary: string;
  meetingScheduled?: boolean;
  sentimentScore?: number;
  reviewLikelihood?: string;
}

const VOICE_METADATA: Record<AgentConfig['voiceName'], { label: string, desc: string, bestFor: string, icon: any }> = {
  Zephyr: { label: 'The Executive', desc: 'Direct, clear, and efficient.', bestFor: 'B2B Sales', icon: Briefcase },
  Puck: { label: 'The Hustler', desc: 'High energy and persuasive.', bestFor: 'E-commerce', icon: Zap },
  Charon: { label: 'The Advisor', desc: 'Deep, calm, and trustworthy.', bestFor: 'Insurance/Finance', icon: Shield },
  Kore: { label: 'The Concierge', desc: 'Warm and welcoming.', bestFor: 'Hospitality', icon: Coffee },
  Fenrir: { label: 'The Specialist', desc: 'Technical and authoritative.', bestFor: 'Tech Support', icon: User },
  Aoede: { label: 'The Harmonizer', desc: 'Rhythmic and soothing.', bestFor: 'Wellness', icon: Music },
  Hesperus: { label: 'The Veteran', desc: 'Experienced and steady.', bestFor: 'Real Estate', icon: Shield },
  Eos: { label: 'The Innovator', desc: 'Bright and optimistic.', bestFor: 'Startups', icon: Heart },
  Astra: { label: 'The Visionary', desc: 'Futuristic and precision-driven.', bestFor: 'SaaS & Tech', icon: Rocket },
  Boreas: { label: 'The Magistrate', desc: 'Authoritative and steady.', bestFor: 'Legal & Logistics', icon: Gavel },
  Iris: { label: 'The Stylist', desc: 'Vibrant and helpful.', bestFor: 'Retail & Fashion', icon: ShoppingBag },
  Nyx: { label: 'The Elite', desc: 'Elegant and sophisticated.', bestFor: 'Luxury Brands', icon: Star },
  Helios: { label: 'The Motivator', desc: 'Bright and high-energy.', bestFor: 'Health & Fitness', icon: Sun },
  Selene: { label: 'The Educator', desc: 'Nurturing and clear.', bestFor: 'Education', icon: BookOpen },
};

const AMBIENT_METADATA: Record<AmbientType, { icon: any, desc: string }> = {
  'None': { icon: VolumeX, desc: 'Clear studio output' },
  'Rainy Day': { icon: CloudRain, desc: 'Soft background pitter-patter' },
  'Coffee Shop': { icon: Coffee, desc: 'Muffled chatter and warmth' },
  'Office Buzz': { icon: Building2, desc: 'Subtle activity and typing' },
  'Quiet Garden': { icon: Trees, desc: 'Natural soft breeze' }
};

const VOICES = Object.keys(VOICE_METADATA) as Array<AgentConfig['voiceName']>;
const AMBIENTS = Object.keys(AMBIENT_METADATA) as Array<AmbientType>;

type AgentStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'thinking';

const StatusBadge: React.FC<{ status: AgentStatus }> = ({ status }) => {
  const configs: Record<AgentStatus, { color: string, icon: any, label: string, pulse: boolean }> = {
    idle: { color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', icon: Phone, label: 'Reception Ready', pulse: false },
    connecting: { color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', icon: Wifi, label: 'Connecting...', pulse: true },
    listening: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: Mic, label: 'Listening...', pulse: true },
    speaking: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Volume2, label: 'Responding...', pulse: true },
    thinking: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Sparkles, label: 'Thinking...', pulse: true },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.color} text-[10px] font-bold uppercase tracking-widest transition-all duration-300`}>
      <Icon size={12} className={config.pulse ? 'animate-pulse' : ''} />
      {config.label}
    </div>
  );
};

const VoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [summary, setSummary] = useState<CallSummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [lastMeeting, setLastMeeting] = useState<any>(null);
  const [lastSelectedAmbient, setLastSelectedAmbient] = useState<AmbientType>('Office Buzz');
  const [qualificationScore, setQualificationScore] = useState(0);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    voiceName: 'Kore',
    tone: 'Professional',
    speakingRate: 1.0,
    ambientEffect: 'None',
    ambientVolume: 0.1,
  });

  const serviceRef = useRef<AuroraVoiceService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, summary, isSummarizing, lastMeeting]);

  const handleTranscription = useCallback((text: string, isUser: boolean, isFinal: boolean) => {
    if (isFinal) {
      setMessages(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const updated = [...prev];
        updated[updated.length - 1] = { ...last, isFinal: true };
        return updated;
      });
      if (isUser) setStatus('thinking');
      else setStatus('listening');
      
      // Artificial intelligence simulation: update qualification progress
      if (isUser) {
        setQualificationScore(prev => Math.min(prev + 15, 100));
      }

      return;
    }

    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.isUser === isUser && !lastMsg.isFinal && !lastMsg.isSystem) {
        const updated = [...prev];
        updated[updated.length - 1] = { ...lastMsg, text: lastMsg.text + text };
        return updated;
      }
      return [...prev, { text, isUser, id: Date.now().toString(), isFinal: false }];
    });
    setStatus(isUser ? 'listening' : 'speaking');
  }, []);

  const generateSummary = async (conversation: Message[], meeting: any) => {
    if (conversation.length < 2) return;
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const transcript = conversation.map(m => `${m.isSystem ? '[SYSTEM]' : m.isUser ? 'Prospect' : 'Aurora'}: ${m.text}`).join('\n');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a structured JSON summary of this call. Include: qualification (Yes/No), decisions, action items, overall summary, a sentiment score (0-10), and review likelihood (High/Medium/Low). Also extract: Name, Email, Phone, Intent if found.
        Transcript: ${transcript}`,
        config: { responseMimeType: "application/json" }
      });
      const result = JSON.parse(response.text || '{}');
      setSummary({ ...result, meetingScheduled: !!meeting });
      if (result.extracted) setExtractedData(result.extracted);
    } catch (err) {
      console.error("Summary failed:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const toggleSession = async () => {
    if (isActive) {
      serviceRef.current?.disconnect();
      serviceRef.current = null;
      setIsActive(false);
      setStatus('idle');
      generateSummary(messages, lastMeeting);
    } else {
      setSummary(null);
      setMessages([]);
      setLastMeeting(null);
      setQualificationScore(0);
      setExtractedData({});
      setStatus('connecting');
      try {
        const service = new AuroraVoiceService(process.env.API_KEY || '', agentConfig);
        const systemPrompt = `You are Aurora, the AI Receptionist for the business. 
        GOALS:
        1. Answer every question accurately.
        2. Book appointments if they are ready.
        3. Provide elite customer experience.
        4. If the customer is happy/satisfied, ask if they'd be open to leaving a 5-star Google Review. If they agree, tell them you'll send a link.
        Be helpful, empathetic, and fast.`;
        
        await service.connect(systemPrompt, handleTranscription, (meeting) => {
          setLastMeeting(meeting);
          setMessages(prev => [...prev, {
            id: `meeting-${Date.now()}`,
            text: `RECEPTIONIST ACTION: Appointment confirmed for ${meeting.date} at ${meeting.time}. User experience optimized.`,
            isUser: false,
            isFinal: true,
            isSystem: true
          }]);
        });
        serviceRef.current = service;
        setIsActive(true);
        setStatus('listening');
      } catch (err) {
        setStatus('idle');
      }
    }
  };

  useEffect(() => {
    if (isActive && serviceRef.current) {
      serviceRef.current.updateConfig(agentConfig);
    }
  }, [agentConfig, isActive]);

  const handleAmbientToggle = (enabled: boolean) => {
    if (enabled) {
      setAgentConfig({ ...agentConfig, ambientEffect: lastSelectedAmbient });
    } else {
      setAgentConfig({ ...agentConfig, ambientEffect: 'None' });
    }
  };

  const handleAmbientTypeSelect = (type: AmbientType) => {
    if (type !== 'None') {
      setLastSelectedAmbient(type);
    }
    setAgentConfig({ ...agentConfig, ambientEffect: type });
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-slate-100 flex items-center gap-3">
            AI Receptionist Console
            <span className="text-[10px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-pulse">Experience Guard Active</span>
          </h2>
          <p className="text-slate-400">Handle questions, book meetings, and generate Google reviews instantly.</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
            <div className={`absolute inset-0 opacity-10 transition-all duration-1000 bg-gradient-to-tr from-cyan-900 via-transparent to-emerald-900 ${isActive ? 'scale-110' : ''}`}></div>
            
            {/* Qualification Progress */}
            {isActive && (
              <div className="absolute top-8 left-8 right-8 z-10 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Target size={12} /> Lead Qualification Progress
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{qualificationScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${qualificationScore}%` }}
                  />
                </div>
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-64 h-64 rounded-full border border-slate-800 flex items-center justify-center transition-all duration-700 ${isActive ? 'border-cyan-500/40 shadow-[0_0_120px_rgba(34,211,238,0.2)]' : ''}`}>
                <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-2xl transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_0_50px_rgba(34,211,238,0.4)]' : 'grayscale opacity-30'}`}>
                  {status === 'speaking' ? <Waves size={48} className="text-white animate-pulse" /> : 
                   status === 'listening' ? <Mic size={40} className="text-white animate-bounce" /> :
                   status === 'thinking' ? <Sparkles size={40} className="text-white animate-spin-slow" /> :
                   isActive ? <PhoneOff size={40} className="text-white" /> : <Phone size={40} className="text-white" />}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center z-10">
              <h3 className="text-2xl font-bold font-outfit mb-2 text-white tracking-tight uppercase">
                {status === 'speaking' ? 'Aurora Responding' : 
                 status === 'listening' ? 'Customer Speaking' : 
                 status === 'thinking' ? 'Optimizing Experience' :
                 status === 'connecting' ? 'Establishing Line' : 'Receptionist Standby'}
              </h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed italic">
                {isActive ? 'Every interaction is a chance to resolve and delight. Analyzing for review opportunities.' : 'Aurora ensures every call is answered with elite speed and empathy.'}
              </p>
            </div>
          </div>

          <div className="p-8 border-t border-slate-800 bg-slate-900/40 flex flex-col md:flex-row justify-center items-center gap-6 relative z-10 backdrop-blur-sm">
            <button 
              onClick={toggleSession}
              className={`w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${isActive ? 'bg-rose-600 shadow-rose-600/30' : 'bg-cyan-600 shadow-cyan-600/30'} text-white shadow-xl`}
            >
              {isActive ? <PhoneOff size={24} /> : <Phone size={24} />}
              {isActive ? 'Disconnect Agent' : 'Activate Live Receptionist'}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-slate-800 border border-slate-700 rounded-2xl text-slate-300 font-bold hover:text-white transition-all shadow-lg active:scale-95">
              <Settings2 size={24} /> Settings
            </button>
          </div>
        </div>

        {/* Extracted Data & Monitor Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Intelligence Panel */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl h-1/3">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-100 flex items-center gap-2 font-outfit uppercase tracking-widest">
                <Search size={14} className="text-cyan-400" />
                Live Brain Extractions
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
              {Object.entries(extractedData).length > 0 ? (
                Object.entries(extractedData).map(([key, val]) => (
                  <div key={key} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">{key}</p>
                    <p className="text-xs font-bold text-slate-200 truncate">{val}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-4 opacity-30 text-slate-500 italic text-[10px]">
                  Listening for key details...
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl flex flex-col flex-1 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-100 flex items-center gap-2 font-outfit uppercase tracking-widest">
                <MessageSquare size={14} className="text-cyan-400" />
                Intercept Monitor
              </h3>
              {status === 'speaking' && <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[8px] font-black rounded-full border border-amber-500/20 uppercase">Resolving Instantly</div>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
              {messages.length === 0 && !isSummarizing && !summary ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                  <ShieldCheck size={40} className="text-slate-600" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Experience Guard</p>
                    <p className="text-[10px] text-slate-600">Waiting for call intercept...</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(msg => (
                    msg.isSystem ? (
                      <div key={msg.id} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in zoom-in-95 duration-500 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-[8px] uppercase tracking-widest">
                          <Check size={12} /> Sync Success
                        </div>
                        <p className="text-[11px] text-slate-200 font-medium leading-relaxed">{msg.text}</p>
                      </div>
                    ) : (
                      <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3`}>
                        <span className="text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">{msg.isUser ? 'Customer' : 'Aurora AI'}</span>
                        <div className={`max-w-[92%] p-3 rounded-xl text-xs leading-relaxed ${msg.isUser ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none shadow-sm'}`}>
                          {msg.text || '...'}
                        </div>
                      </div>
                    )
                  ))}

                  {isSummarizing && <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3 animate-pulse text-[10px] text-slate-400"><Loader2 className="animate-spin" size={14} /> Finalizing Service Report...</div>}
                  
                  {summary && (
                    <div className="p-6 bg-[#0f172a] border border-slate-700 rounded-2xl space-y-4 shadow-2xl mt-4 border-l-4 border-l-cyan-500 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-widest"><ShieldAlert size={14} /> Experience Report</div>
                      <p className="text-[11px] text-slate-300 italic leading-relaxed">"{summary.overallSummary}"</p>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                          <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Sentiment Score</p>
                          <p className="text-sm font-bold text-white">{summary.sentimentScore}/10</p>
                        </div>
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                          <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Review Hook</p>
                          <p className={`text-sm font-bold ${summary.reviewLikelihood === 'High' ? 'text-emerald-400' : 'text-slate-300'}`}>{summary.reviewLikelihood}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Call Resolution</span>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${summary.qualification?.toLowerCase().includes('yes') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>Success</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="relative w-full max-w-lg h-full bg-[#0f172a] border-l border-slate-800 p-10 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-bold font-outfit uppercase tracking-tighter text-white">Service Persona</h3>
                <p className="text-xs text-slate-500">Tune the empathy and speed of your AI Receptionist.</p>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="p-3 bg-slate-800 rounded-xl"><X size={20} /></button>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FastForward size={20} className="text-cyan-400" />
                    <label className="text-sm font-black text-slate-200 uppercase tracking-widest">Verbal Tempo</label>
                  </div>
                  <span className="text-cyan-400 font-black text-xs bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{agentConfig.speakingRate.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1"
                  value={agentConfig.speakingRate}
                  onChange={(e) => setAgentConfig({ ...agentConfig, speakingRate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Ambient Environment</label>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${agentConfig.ambientEffect === 'None' ? 'text-slate-600' : 'text-emerald-400'}`}>
                      {agentConfig.ambientEffect === 'None' ? 'Disabled' : 'Active'}
                    </span>
                    <button 
                      onClick={() => handleAmbientToggle(agentConfig.ambientEffect === 'None')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${agentConfig.ambientEffect === 'None' ? 'bg-slate-700' : 'bg-cyan-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${agentConfig.ambientEffect === 'None' ? 'translate-x-1' : 'translate-x-6'}`} />
                    </button>
                  </div>
                </div>
                
                <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${agentConfig.ambientEffect === 'None' ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                  {AMBIENTS.map(type => {
                    const meta = AMBIENT_METADATA[type];
                    const isSelected = agentConfig.ambientEffect === type;
                    return (
                      <button 
                        key={type}
                        onClick={() => handleAmbientTypeSelect(type)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                          isSelected ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/5' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <meta.icon size={20} className={isSelected ? 'text-cyan-400' : 'text-slate-500'} />
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-cyan-200' : 'text-slate-400'}`}>{type}</p>
                      </button>
                    );
                  })}
                </div>
                
                {agentConfig.ambientEffect !== 'None' && (
                  <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ambient Volume</label>
                      <span className="text-[10px] font-bold text-cyan-400">{Math.round(agentConfig.ambientVolume * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.01"
                      value={agentConfig.ambientVolume}
                      onChange={(e) => setAgentConfig({ ...agentConfig, ambientVolume: parseFloat(e.target.value) })}
                      className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Receptionist Voice</label>
                <div className="grid grid-cols-1 gap-4">
                  {VOICES.map(v => {
                    const meta = VOICE_METADATA[v];
                    const isSelected = agentConfig.voiceName === v;
                    return (
                      <button 
                        key={v} 
                        onClick={() => setAgentConfig({...agentConfig, voiceName: v})}
                        className={`p-5 rounded-3xl border text-left transition-all ${
                          isSelected ? 'bg-cyan-500/10 border-cyan-500/50 shadow-2xl' : 'bg-slate-900/50 border-slate-800'
                        }`}
                      >
                        <div className="flex gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'bg-slate-800 text-slate-500'}`}>
                            <meta.icon size={28} />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-white">{meta.label}</p>
                            <p className="text-xs text-slate-500 italic">{meta.desc}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 sticky bottom-0 bg-[#0f172a] pb-6 border-t border-slate-800/50">
              <button onClick={() => setIsSettingsOpen(false)} className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all shadow-2xl">
                Commit Persona Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VoiceAgent;
