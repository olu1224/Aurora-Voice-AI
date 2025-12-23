
import React, { useState } from 'react';
import { 
  Settings, 
  BrainCircuit, 
  Target, 
  Power, 
  Globe, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  ChevronDown, 
  Info, 
  Plus, 
  Download,
  Link,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ConversationAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'training' | 'goals'>('training');
  const [isBotOn, setIsBotOn] = useState(false);
  const [domainUrl, setDomainUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hey There! Here\'s how you can train me!' },
    { role: 'bot', text: 'Start by telling me where to extract the data from? The more I know, the better I can assist you :)' }
  ]);

  const handleExtract = async () => {
    if (!domainUrl || extracting) return;
    setExtracting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using search grounding to "browse" the provided URL and summarize knowledge
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I want to train a customer service bot for the website: ${domainUrl}. Extract the key business facts, services, and core value proposition from this domain so I can use it as training material.`,
        config: { tools: [{ googleSearch: {} }] }
      });

      setChatMessages(prev => [...prev, 
        { role: 'user', text: `Extracting data from ${domainUrl}` },
        { role: 'bot', text: `Great! I've analyzed the content at ${domainUrl}. I found several key services and business protocols. You can now see these in your Knowledge Base.` },
        { role: 'bot', text: response.text || 'Analysis complete.' }
      ]);
      
      // Persist some of this to knowledge base for the voice agent
      localStorage.setItem('aurora_knowledge', (localStorage.getItem('aurora_knowledge') || '') + '\n\n' + response.text);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I couldn\'t extract data from that URL. Please ensure it is publicly accessible.' }]);
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-outfit text-white tracking-tight uppercase">Conversation AI</h2>
          <p className="text-slate-400 mt-1">Unlock the power of automated conversations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'settings', label: 'Bot Settings', icon: <Settings size={16} /> },
          { id: 'training', label: 'Bot Training', icon: <BrainCircuit size={16} /> },
          { id: 'goals', label: 'Bot Goals', icon: <Target size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${
              activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
          </button>
        ))}
      </div>

      {/* Status Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsBotOn(!isBotOn)}
            className={`p-2 rounded-xl transition-all ${isBotOn ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}
          >
            <Power size={20} />
          </button>
          <span className="text-sm font-bold text-slate-200">
            Bot is {isBotOn ? 'On' : 'Off'}. 
            <button className="ml-2 text-cyan-400 hover:underline">Click here to go to settings!</button>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Training Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3 text-xs text-slate-400">
            <Info size={16} className="text-cyan-400" />
            Training material is applicable to all Bots
          </div>

          {/* Extract Data Section */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 space-y-8 shadow-xl">
            <div>
              <h3 className="text-xl font-bold font-outfit text-white">Extract Data From</h3>
              <p className="text-sm text-slate-500">Pull key information from your sources efficiently</p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enter domain</label>
              <div className="flex gap-2">
                <div className="relative group">
                  <select className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none pr-8">
                    <option>Exact URL</option>
                    <option>Wildcard</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-slate-400 transition-colors" size={14} />
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm">https://</span>
                  <input 
                    type="text" 
                    value={domainUrl}
                    onChange={(e) => setDomainUrl(e.target.value)}
                    placeholder="example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-16 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                    <Info size={16} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleExtract}
                  disabled={extracting || !domainUrl}
                  className="px-8 py-3 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-50 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {extracting ? <Loader2 className="animate-spin" size={16} /> : null}
                  Extract Data
                </button>
              </div>
            </div>
          </div>

          {/* Customize Response Section */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-outfit text-white">Customize your bot's response</h3>
                <p className="text-sm text-slate-500">Train bot to handle questions on your behalf</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:text-white bg-slate-900 rounded-lg border border-slate-800"><Search size={18} /></button>
                <button className="p-2 text-slate-500 hover:text-white bg-slate-900 rounded-lg border border-slate-800"><Download size={18} /></button>
              </div>
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Add question here"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Preview */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] overflow-hidden flex flex-col h-[600px] shadow-2xl">
          <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600/10 rounded-xl text-cyan-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Train Bot</h3>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isBotOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{isBotOn ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest appearance-none pr-8 focus:outline-none">
                  <option>Select intent</option>
                  <option>Support</option>
                  <option>Sales</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
              </div>
              <button className="p-1.5 text-slate-500 hover:text-white bg-slate-950 rounded-lg border border-slate-800"><RefreshCw size={14} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-xs leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-none shadow-lg' 
                  : 'bg-blue-600 text-white rounded-2xl rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-end gap-2">
            <button className="p-2 text-slate-500 hover:text-white transition-all"><Sparkles size={18} /></button>
            <button className="p-2 text-slate-500 hover:text-white transition-all"><ThumbsUp size={18} /></button>
            <button className="p-2 text-slate-500 hover:text-white transition-all"><ThumbsDown size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationAI;
