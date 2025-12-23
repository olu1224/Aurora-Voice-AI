
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  FileText, 
  CheckCircle, 
  ShieldAlert, 
  Clock, 
  ShieldCheck, 
  Star, 
  Zap, 
  BrainCircuit, 
  LayoutTemplate, 
  Loader2, 
  ArrowRight,
  Shield,
  Activity,
  History
} from 'lucide-react';
import { Industry } from '../types';
import { INDUSTRY_TEMPLATES } from '../constants';

type SyncStatus = 'idle' | 'validating' | 'syncing' | 'complete';

const KnowledgeBase: React.FC = () => {
  // Load initial state from localStorage or defaults
  const [industry, setIndustry] = useState<Industry>(() => {
    return (localStorage.getItem('aurora_industry') as Industry) || Industry.REAL_ESTATE;
  });
  const [knowledge, setKnowledge] = useState(() => {
    return localStorage.getItem('aurora_knowledge') || '';
  });
  const [businessName, setBusinessName] = useState(() => {
    return localStorage.getItem('aurora_business_name') || 'Acme Corp';
  });
  const [objective, setObjective] = useState(() => {
    return localStorage.getItem('aurora_objective') || 'Qualify leads and book meetings.';
  });
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncDate, setLastSyncDate] = useState<string>(() => {
    return localStorage.getItem('aurora_last_sync') || 'Never';
  });

  const applyTemplate = (template: typeof INDUSTRY_TEMPLATES[0]) => {
    setIndustry(template.name as Industry);
    setKnowledge(template.prompt);
  };

  const handleSave = () => {
    if (syncStatus === 'syncing') return;
    
    setSyncStatus('validating');
    setSyncProgress(0);

    // Realistic multi-stage sync simulation
    setTimeout(() => {
      setSyncStatus('syncing');
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            
            // Persist to localStorage for Voice Agent access
            localStorage.setItem('aurora_industry', industry);
            localStorage.setItem('aurora_knowledge', knowledge);
            localStorage.setItem('aurora_business_name', businessName);
            localStorage.setItem('aurora_objective', objective);
            const now = new Date().toLocaleString();
            localStorage.setItem('aurora_last_sync', now);
            
            setSyncStatus('complete');
            setLastSyncDate(now);
            setTimeout(() => setSyncStatus('idle'), 5000);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-slate-100">Receptionist Intelligence</h2>
          <p className="text-slate-400 mt-1">Train Aurora on your business logic, pricing, and 24/7 protocols.</p>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
          <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20 uppercase tracking-widest">
            <ShieldCheck size={14} />
            Intelligence Vault Active
          </div>
          <p className="text-[9px] text-slate-600 mt-1 font-bold uppercase tracking-tighter">Last Protocol Deployment: {lastSyncDate}</p>
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-100 font-outfit uppercase tracking-tight">
          <LayoutTemplate size={22} className="text-purple-400" />
          Neural Templates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {INDUSTRY_TEMPLATES.map(template => (
            <button 
              key={template.id}
              onClick={() => applyTemplate(template)}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center group ${
                industry === template.name ? 'bg-purple-500/10 border-purple-500/40 shadow-lg' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl transition-colors ${
                industry === template.name ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-cyan-400'
              }`}>
                {template.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                industry === template.name ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-200'
              }`}>{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="font-bold text-xl flex items-center gap-2 text-slate-100 font-outfit uppercase tracking-tight">
              <FileText size={22} className="text-cyan-400" />
              Strategic Brain Config
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Business Identity</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Acme FinTech Solutions"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Industry Node</label>
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
              <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Conversion Goal</label>
              <input 
                type="text" 
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Resolve support tickets and request Google reviews."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-slate-200" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Core Intelligence Source</label>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Synchronizing 1:1 Mapping</span>
              </div>
              <textarea 
                rows={10}
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                placeholder="Paste your business protocols, pricing tiers, and FAQ data here. Aurora will use this as her primary 'Source of Truth'."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-4 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none text-slate-200 leading-relaxed font-mono text-xs"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group border-t-4 border-t-cyan-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent"></div>
            <div className="relative z-10 space-y-4">
              <h4 className="font-black text-slate-200 flex items-center gap-2 uppercase tracking-widest text-xs">
                <BrainCircuit size={18} className="text-cyan-400" />
                Intelligence Sync
              </h4>
              
              {syncStatus === 'idle' && (
                <p className="text-xs text-slate-400 leading-relaxed italic">
                  Pushing updates will instantly align the Voice Agent's brain with these new protocols.
                </p>
              )}

              {(syncStatus === 'syncing' || syncStatus === 'validating') && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-cyan-400">
                    <span>{syncStatus === 'validating' ? 'Analyzing logic...' : 'Pushing to cloud nodes...'}</span>
                    <span>{Math.round(syncProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {syncStatus === 'complete' && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2 animate-in zoom-in-95 duration-300">
                   <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                     <CheckCircle size={14} /> Synced Successfully
                   </div>
                   <p className="text-[10px] text-slate-300 italic">"Voice Agent brain updated with {businessName} protocols."</p>
                </div>
              )}

              <button 
                onClick={handleSave}
                disabled={syncStatus === 'syncing' || syncStatus === 'validating'}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${
                  syncStatus === 'complete' ? 'bg-emerald-600 text-white' : 
                  (syncStatus === 'syncing' || syncStatus === 'validating') ? 'bg-slate-800 text-slate-500' :
                  'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {syncStatus === 'syncing' || syncStatus === 'validating' ? <Loader2 className="animate-spin" size={20} /> : 
                 syncStatus === 'complete' ? <CheckCircle size={20} /> : <Zap size={20} />}
                {syncStatus === 'syncing' ? 'Deploying...' : 
                 syncStatus === 'validating' ? 'Validating...' :
                 syncStatus === 'complete' ? 'Active' : 'Deploy To Voice Agent'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h4 className="font-black text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <History size={16} className="text-amber-400" />
              Sync Statistics
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-slate-500 group-hover:text-cyan-400" />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Sync Velocity</span>
                </div>
                <span className="text-xs text-white font-black">Fast</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-slate-500 group-hover:text-cyan-400" />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Reliability</span>
                </div>
                <span className="text-xs text-emerald-400 font-black">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
