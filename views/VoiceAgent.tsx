
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, Phone, PhoneOff, MessageSquare, Sparkles, Loader2, Zap, Rocket, Waves, Activity, Mail, Reply, Facebook, Instagram, Twitter, Youtube, Globe2, Star, CheckCircle2, ShieldCheck, AlertCircle, Wifi, Volume2, Database, BrainCircuit, ClipboardList
} from 'lucide-react';
import { AuroraVoiceService } from '../services/geminiLiveService';
import { OMNI_CHANNELS } from '../constants';

const VoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('idle');
  const [automationLog, setAutomationLog] = useState<any[]>([]);
  const [kbInfo, setKbInfo] = useState({ businessName: 'Acme Corp', industry: 'Real Estate' });

  const serviceRef = useRef<AuroraVoiceService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const businessName = localStorage.getItem('aurora_business_name') || 'Acme Corp';
    const industry = localStorage.getItem('aurora_industry') || 'Real Estate';
    setKbInfo({ businessName, industry });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, automationLog]);

  const handleTranscription = useCallback((text: string, isUser: boolean, isFinal: boolean) => {
    if (isFinal) {
      setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, isFinal: true } : m));
      if (isUser) setStatus('thinking');
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
    const logEntry = {
      id: Math.random(),
      name,
      platform: args.platform || 'System',
      timestamp: new Date().toLocaleTimeString(),
      icon: name === 'completeLeadForm' ? <ClipboardList size={14} /> : name === 'checkEmails' ? <Mail size={14} /> : <Zap size={14} />
    };
    setAutomationLog(prev => [logEntry, ...prev]);

    let displayMsg = `[SYSTEM] Aurora ${name === 'bookMeeting' ? 'scheduled a meeting' : name === 'completeLeadForm' ? 'submitted a lead form' : name === 'sendFollowUp' ? 'sent a follow-up' : 'executed an automated task'}.`;
    setMessages(prev => [...prev, { text: displayMsg, isUser: false, isFinal: true, isSystem: true, id: Math.random() }]);
  };

  const toggleSession = async () => {
    if (isActive) {
      serviceRef.current?.disconnect();
      serviceRef.current = null;
      setIsActive(false);
      setStatus('idle');
    } else {
      setStatus('connecting');
      try {
        const kbBusiness = localStorage.getItem('aurora_business_name') || 'Acme Corp';
        const kbKnowledge = localStorage.getItem('aurora_knowledge') || '';
        const kbObjective = localStorage.getItem('aurora_objective') || 'Qualify leads and book meetings.';

        const instruction = `
          BUSINESS: ${kbBusiness}. GOAL: ${kbObjective}. 
          PROTOCOLS: ${kbKnowledge}.
          You are Aurora, a proactive receptionist and sales agent. 
          Answer calls, qualify leads, and use your TOOLS (Form submission, Email checks, Social replies) to assist.
        `;

        const service = new AuroraVoiceService({ voiceName: 'Kore', tone: 'Professional', speakingRate: 1, responsePacing: true, ambientEffect: 'None', ambientVolume: 0.1 });
        await service.connect(instruction, handleTranscription, handleToolCall);
        serviceRef.current = service;
        setIsActive(true);
      } catch (err) {
        setStatus('error');
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-outfit text-white uppercase flex items-center gap-3">Universal Command</h2>
          <p className="text-slate-400 text-sm">Managing Phone, Web Chat, Social, and CRM Workflows.</p>
        </div>
        <div className={`px-4 py-2 rounded-full border bg-slate-900 text-[10px] font-black uppercase tracking-widest ${status === 'error' ? 'text-rose-400' : 'text-cyan-400'}`}>
           <Wifi size={12} className={isActive ? 'animate-pulse' : ''} /> {status.toUpperCase()}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className={`w-64 h-64 rounded-full border border-slate-800 flex items-center justify-center transition-all duration-700 ${isActive ? 'border-cyan-500/40 shadow-[0_0_120px_rgba(34,211,238,0.2)]' : ''}`}>
              <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center shadow-2xl transition-all ${isActive ? 'scale-110' : 'grayscale opacity-30'}`}>
                {status === 'speaking' ? <Waves size={56} className="text-white animate-pulse" /> : <Sparkles size={48} className="text-white" />}
              </div>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">{isActive ? 'Node Active' : 'Reception Standby'}</h3>
              <p className="text-slate-500 text-xs mt-2 italic">Synced with Knowledge Base: {kbInfo.businessName}</p>
            </div>
          </div>
          <div className="p-8 border-t border-slate-800">
             <button onClick={toggleSession} disabled={status === 'connecting'} className={`w-full py-6 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all ${isActive ? 'bg-rose-600' : 'bg-gradient-to-r from-cyan-600 to-blue-700'} text-white shadow-xl`}>
              {status === 'connecting' ? <Loader2 className="animate-spin mx-auto" size={24} /> : (isActive ? 'Shutdown Agent' : 'Activate AI Workforce')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] h-[35%] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 font-black text-[10px] uppercase text-slate-400 flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" /> Automation & Reception Logs
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {automationLog.map(log => (
                <div key={log.id} className="p-3 bg-slate-900/30 border border-slate-800/50 rounded-2xl flex items-center justify-between group hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400">{log.icon}</div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter">{log.platform} • {log.name}</p>
                      <p className="text-[8px] text-slate-500">{log.timestamp}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
              ))}
              {automationLog.length === 0 && <div className="h-full flex items-center justify-center opacity-20 text-[10px] font-black uppercase">Monitoring workflows...</div>}
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 font-black text-[10px] uppercase text-slate-400 flex items-center gap-2">
              <MessageSquare size={14} className="text-cyan-400" /> Interaction Feed
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3`}>
                  <span className="text-[8px] font-black uppercase text-slate-600 mb-1.5">{msg.isUser ? 'Prospect' : 'Aurora AI'}</span>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${msg.isSystem ? 'bg-cyan-500/10 text-cyan-400 italic' : msg.isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
