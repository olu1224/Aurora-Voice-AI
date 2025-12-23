
import React, { useState } from 'react';
import { Save, FileText, CheckCircle, ShieldAlert, Clock, ShieldCheck, Star, Zap, BrainCircuit, LayoutTemplate } from 'lucide-react';
import { Industry } from '../types';
import { INDUSTRY_TEMPLATES } from '../constants';

const KnowledgeBase: React.FC = () => {
  const [industry, setIndustry] = useState(Industry.REAL_ESTATE);
  const [knowledge, setKnowledge] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const applyTemplate = (template: typeof INDUSTRY_TEMPLATES[0]) => {
    setIndustry(template.name as Industry);
    setKnowledge(template.prompt);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-slate-100">Receptionist Intelligence</h2>
          <p className="text-slate-400 mt-1">Train Aurora on your business logic, pricing, and 24/7 protocols.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
          <ShieldAlert size={14} />
          Encrypted Knowledge Vault
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-100 font-outfit">
          <LayoutTemplate size={22} className="text-purple-400" />
          Industry Templates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {INDUSTRY_TEMPLATES.map(template => (
            <button 
              key={template.id}
              onClick={() => applyTemplate(template)}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all flex flex-col items-center gap-3 text-center group"
            >
              <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
                {template.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="font-bold text-xl flex items-center gap-2 text-slate-100 font-outfit">
              <FileText size={22} className="text-cyan-400" />
              Core Business Logic
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Business Display Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme FinTech Solutions"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Market Industry</label>
                <select 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all appearance-none text-slate-200"
                >
                  {Object.values(Industry).map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Primary Objective</label>
              <input 
                type="text" 
                placeholder="Resolve support tickets and request Google reviews from happy customers."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Detailed Source of Truth</label>
                <span className="text-[10px] text-cyan-400 font-bold">Protocol Accuracy: 99.4%</span>
              </div>
              <textarea 
                rows={10}
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                placeholder="Paste your FAQ, complex pricing, and business rules. Aurora uses this to provide fast, elite customer experience."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none text-slate-200 leading-relaxed font-mono text-xs"
              ></textarea>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-100 font-outfit">
              <Star size={22} className="text-yellow-400" />
              Reputation Management
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Google Review URL</label>
                <input type="text" placeholder="https://g.page/r/your-business-id/review" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Review Solicitation Hook</label>
                <textarea 
                  rows={2}
                  placeholder="If sentiment is positive, say: 'I'm so glad I could help! We're trying to reach more local customers—would you mind if I sent you a quick link to leave us a 5-star review?'"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent"></div>
            <div className="relative z-10">
              <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-cyan-400" />
                Intelligence Sync
              </h4>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Aurora is training on your latest business updates.
              </p>
              <button 
                onClick={handleSave}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${
                  isSaved ? 'bg-emerald-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                {isSaved ? 'Synchronized' : 'Push Updates'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <Clock size={16} className="text-amber-400" />
              Experience Protocols
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Response Speed</span>
                <span className="text-xs text-emerald-400 font-bold">&lt;100ms</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Review Hooks</span>
                <span className="text-xs text-emerald-400 font-bold">Auto-Triage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
