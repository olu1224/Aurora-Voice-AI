
import React, { useState, useEffect } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { VOICE_LIBRARY, VoicePersona } from '../constants';

interface QAPair {
  id: string;
  q: string;
  a: string;
}

const ConversationAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'training' | 'goals' | 'channels'>('training');
  const [trainingMode, setTrainingMode] = useState<'hub' | 'url' | 'docs' | 'qa'>('hub');
  const [isBotOn, setIsBotOn] = useState(true);
  
  // Channels State
  const [channels, setChannels] = useState([
    { id: 'ig', name: 'Instagram', connected: true, health: 100, icon: <Instagram className="text-pink-500" /> },
    { id: 'fb', name: 'Facebook', connected: true, health: 98, icon: <Facebook className="text-blue-600" /> },
    { id: 'x', name: 'X / Twitter', connected: false, health: 0, icon: <Twitter className="text-slate-200" /> }
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

  const renderChannels = () => (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 space-y-10 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold font-outfit text-white">Omni-Channel Integrations</h3>
            <p className="text-sm text-slate-500 italic">Aurora acts as a centralized brain for your brand's social presence.</p>
          </div>
          <button className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all">
            Connect New App
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((ch) => (
            <div key={ch.id} className="p-6 bg-slate-950/50 border border-slate-800 rounded-[28px] group hover:border-cyan-500/30 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {ch.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{ch.name}</h4>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${ch.connected ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {ch.connected ? 'Operational' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                {ch.connected && (
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12} className="animate-pulse" /> {ch.health}% Health
                  </div>
                )}
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed italic">
                  {ch.connected 
                    ? `Aurora is monitoring @sterling_corp DMs and replying to customer inquiries using the current knowledge base.`
                    : `Connect your ${ch.name} business account to enable automated lead qualification and customer support.`}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
                <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  ch.connected ? 'text-rose-400 hover:bg-rose-500/10' : 'bg-white text-slate-950 hover:scale-105 shadow-xl'
                }`}>
                  {ch.connected ? 'Revoke Access' : 'Authenticate Agent'}
                </button>
                {ch.connected && (
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <Settings size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="p-8 border-2 border-dashed border-slate-800 rounded-[28px] flex flex-col items-center justify-center text-center space-y-4 hover:border-cyan-500/30 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-slate-900/50 rounded-full flex items-center justify-center text-slate-700 group-hover:text-cyan-400 transition-colors">
              <Plus size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Custom Webhook</p>
              <p className="text-[10px] text-slate-600 italic">Integrate Aurora into any proprietary chat system.</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 p-6 bg-amber-500/5 rounded-[24px] border border-amber-500/10 flex items-start gap-4">
          <ShieldAlert className="text-amber-500 shrink-0" size={20} />
          <div>
            <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Security Disclaimer</h5>
            <p className="text-xs text-slate-400 italic">Aurora operates within strict Meta and X API rate limits. All interactions are processed through enterprise-grade encrypted nodes to ensure your brand's data security.</p>
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
          <h2 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Agent Brain</h2>
          <p className="text-slate-400 mt-1 italic font-medium">Engineer your perfect AI employee through neural mapping.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
            onClick={() => setIsBotOn(!isBotOn)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              isBotOn ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            <Power size={14} /> {isBotOn ? 'Brain Active' : 'Neural Hibernate'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit">
        {[
          { id: 'training', label: 'Knowledge', icon: <BrainCircuit size={14} /> },
          { id: 'channels', label: 'Channels', icon: <Globe size={14} /> },
          { id: 'settings', label: 'Persona', icon: <Settings size={14} /> },
          { id: 'goals', label: 'Strategy', icon: <Target size={14} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
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
            <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 min-h-[400px] flex items-center justify-center text-slate-600 italic">
               Select a training node to begin knowledge mapping.
            </div>
          )}
          {(activeTab === 'goals') && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 min-h-[400px] flex items-center justify-center text-slate-600 italic">
               Optimization goals and conversion strategy hub.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationAI;
