
import React, { useState, useRef, useEffect } from 'react';
import { 
  BrainCircuit, Search, MapPin, Send, Sparkles, Loader2, 
  ExternalLink, Globe, Map as MapIcon, MessageSquare, 
  Volume2, Zap, Cpu, ShieldCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { speakText } from '../services/ttsService';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingLinks?: { title: string; uri: string }[];
}

const Intelligence: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groundingMode, setGroundingMode] = useState<'Fast' | 'Local' | 'Deep Reasoning'>('Fast');
  const [isSpeakingId, setIsSpeakingId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleVocalize = async (text: string, id: number) => {
    setIsSpeakingId(id);
    try {
      await speakText(text);
    } catch (e) {
      console.error("TTS Failed", e);
    } finally {
      setIsSpeakingId(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let response;

      if (groundingMode === 'Fast') {
        // FAST AI RESPONSES: gemini-2.5-flash-lite
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite-latest',
          contents: userMsg,
          config: { tools: [{ googleSearch: {} }] }
        });
      } else if (groundingMode === 'Local') {
        // LOCAL SEARCH: Maps grounding
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
           navigator.geolocation.getCurrentPosition(res, rej)
        ).catch(() => null);

        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userMsg,
          config: { 
            tools: [{ googleMaps: {} }],
            toolConfig: pos ? {
              retrievalConfig: {
                latLng: {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude
                }
              }
            } : undefined
          }
        });
      } else {
        // DEEP REASONING: gemini-3-pro-preview with max thinkingBudget
        response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: userMsg,
          config: {
            thinkingConfig: { thinkingBudget: 32768 }
          }
        });
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = groundingChunks.map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
        return null;
      }).filter(Boolean);

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || "Neural connection timeout. Re-synchronize node.",
        isThinking: groundingMode === 'Deep Reasoning',
        groundingLinks: links.length > 0 ? links : undefined
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Internal Node Communication Fault. Check Security Keys." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-outfit text-white flex items-center gap-3 uppercase tracking-tighter">
            <BrainCircuit className="text-cyan-400" /> Neural Intelligence Hub
          </h2>
          <p className="text-slate-400 text-sm italic font-medium">Provisioning high-fidelity market data and business logic.</p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-xl">
          <button 
            onClick={() => setGroundingMode('Fast')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${groundingMode === 'Fast' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Zap size={14} /> Fast
          </button>
          <button 
            onClick={() => setGroundingMode('Local')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${groundingMode === 'Local' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MapIcon size={14} /> Local
          </button>
          <button 
            onClick={() => setGroundingMode('Deep Reasoning')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${groundingMode === 'Deep Reasoning' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Cpu size={14} /> Think Mode
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-[40px] overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/20 relative z-10 custom-scrollbar">
          {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[40px] flex items-center justify-center text-slate-700 shadow-2xl">
                 <Sparkles size={48} className="animate-pulse" />
               </div>
               <div className="max-w-xs">
                 <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Neural Standby</p>
                 <p className="text-xs text-slate-600 font-medium italic">"Provisioning logic nodes for OAMcorp and enterprise environments. What is our objective today?"</p>
               </div>
             </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3 duration-500`}>
               <span className="text-[9px] font-black uppercase text-slate-700 mb-2 tracking-widest flex items-center gap-2">
                 {msg.role === 'user' ? 'Root Administrator' : 'Aurora Core Intelligence'}
                 {msg.role === 'model' && msg.isThinking && <ShieldCheck size={10} className="text-purple-400" />}
               </span>
               <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-[28px] text-[13px] leading-relaxed shadow-xl relative group ${
                 msg.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none backdrop-blur-xl'
               }`}>
                 {msg.role === 'model' && (
                   <button 
                    onClick={() => handleVocalize(msg.text, idx)}
                    disabled={isSpeakingId !== null}
                    className={`absolute -right-14 top-0 p-3 rounded-2xl border border-slate-800 bg-slate-900 transition-all ${isSpeakingId === idx ? 'text-cyan-400' : 'text-slate-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 shadow-xl'}`}
                   >
                     <Volume2 size={18} className={isSpeakingId === idx ? 'animate-pulse' : ''} />
                   </button>
                 )}
                 <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                 
                 {msg.groundingLinks && (
                   <div className="mt-8 pt-6 border-t border-slate-800/50 grid grid-cols-1 md:grid-cols-2 gap-3">
                     <p className="col-span-full text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Verification Channels</p>
                     {msg.groundingLinks.map((link, lIdx) => (
                       <a 
                        key={lIdx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:bg-slate-800 hover:border-cyan-500/30 transition-all group/link shadow-inner"
                       >
                         <span className="text-[11px] font-bold text-cyan-400 truncate pr-4">{link.title || 'Data Source'}</span>
                         <ExternalLink size={12} className="text-slate-700 group-hover/link:text-white shrink-0" />
                       </a>
                     ))}
                   </div>
                 )}
               </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-4">
               <div className="px-8 py-5 bg-slate-900/40 border border-slate-800 rounded-[28px] rounded-tl-none flex items-center gap-3 animate-pulse shadow-xl">
                 <Loader2 size={16} className="animate-spin text-cyan-400" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synchronizing Neural Fragments...</span>
               </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-8 bg-slate-900/80 border-t border-slate-800 backdrop-blur-2xl relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex gap-4 relative max-w-5xl mx-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                groundingMode === 'Fast' ? "Ultra-low latency mode active..." : 
                groundingMode === 'Local' ? "Searching local indices..." :
                "Deep reasoning node engaged..."
              }
              className="flex-1 bg-slate-950 border border-slate-800 rounded-[28px] px-10 py-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all pr-24 shadow-2xl placeholder:text-slate-800"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-900 text-white rounded-[22px] transition-all shadow-xl active:scale-95 shadow-cyan-600/30"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
