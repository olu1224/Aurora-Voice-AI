
import React, { useState, useRef, useEffect } from 'react';
import { 
  BrainCircuit, 
  Search, 
  MapPin, 
  Send, 
  Sparkles, 
  Loader2, 
  ExternalLink,
  Globe,
  Map as MapIcon,
  MessageSquare
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  groundingLinks?: { title: string; uri: string }[];
}

const Intelligence: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groundingMode, setGroundingMode] = useState<'Search' | 'Maps' | 'Deep Reasoning'>('Search');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let response;

      if (groundingMode === 'Search') {
        response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userMsg,
          config: { tools: [{ googleSearch: {} }] }
        });
      } else if (groundingMode === 'Maps') {
        // Maps grounding requires location or specific query
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
        // Deep Reasoning mode
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
        text: response.text || "I'm sorry, I couldn't generate a response.",
        groundingLinks: links.length > 0 ? links : undefined
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Service connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-3">
            <BrainCircuit className="text-cyan-400" /> Aurora Intelligence
          </h2>
          <p className="text-slate-400 italic">Research market trends, local data, and business complex logic.</p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button 
            onClick={() => setGroundingMode('Search')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${groundingMode === 'Search' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500'}`}
          >
            <Globe size={14} /> Search
          </button>
          <button 
            onClick={() => setGroundingMode('Maps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${groundingMode === 'Maps' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}
          >
            <MapIcon size={14} /> Local Maps
          </button>
          <button 
            onClick={() => setGroundingMode('Deep Reasoning')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${groundingMode === 'Deep Reasoning' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500'}`}
          >
            <Sparkles size={14} /> Reasoning
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/20">
          {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
               <BrainCircuit size={64} className="text-slate-600" />
               <div className="max-w-xs">
                 <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Knowledge Agent</p>
                 <p className="text-xs text-slate-600">Ask about current news, business competitors, or local industry hotspots.</p>
               </div>
             </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3`}>
               <span className="text-[10px] font-black uppercase text-slate-600 mb-2 tracking-widest">{msg.role === 'user' ? 'You' : 'Aurora AI'}</span>
               <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                 msg.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none shadow-xl' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none shadow-sm'
               }`}>
                 <div className="whitespace-pre-wrap">{msg.text}</div>
                 {msg.groundingLinks && (
                   <div className="mt-6 pt-4 border-t border-slate-700 space-y-2">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sources Found</p>
                     {msg.groundingLinks.map((link, lIdx) => (
                       <a 
                        key={lIdx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-700 transition-all group"
                       >
                         <span className="text-xs font-medium text-cyan-400 truncate pr-4">{link.title || 'Source Link'}</span>
                         <ExternalLink size={14} className="text-slate-600 group-hover:text-white" />
                       </a>
                     ))}
                   </div>
                 )}
               </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 animate-pulse">
               <div className="p-4 bg-slate-800 border border-slate-700 rounded-3xl rounded-tl-none flex items-center gap-3">
                 <Loader2 size={16} className="animate-spin text-cyan-400" />
                 <span className="text-xs text-slate-400">Aurora is analyzing {groundingMode.toLowerCase()} networks...</span>
               </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-6 bg-slate-900/60 border-t border-slate-800 backdrop-blur-md">
          <div className="flex gap-4 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                groundingMode === 'Search' ? "Ask about recent events or news..." :
                groundingMode === 'Maps' ? "Ask about local competitors or restaurants..." :
                "Enter complex business logic questions..."
              }
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all pr-16 shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg active:scale-90"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
