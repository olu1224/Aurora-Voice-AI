
import React, { useState } from 'react';
import { 
  Beaker, 
  TrendingUp, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  BarChart3, 
  Zap, 
  Mic2, 
  FileText, 
  ChevronRight,
  Target,
  Trophy,
  ArrowUpRight,
  AlertCircle,
  X,
  CheckCircle2,
  Loader2,
  Settings2
} from 'lucide-react';
import { VOICE_LIBRARY } from '../constants';

interface Experiment {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'completed';
  agentA: {
    voice: string;
    calls: number;
    conversions: number;
  };
  agentB: {
    voice: string;
    calls: number;
    conversions: number;
  };
}

const VOICES = VOICE_LIBRARY.map(v => v.id);

const NewExperimentModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onCreate: (exp: Experiment) => void 
}> = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    voiceA: 'Zephyr',
    voiceB: 'Kore'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    
    // Simulate neural provisioning
    setTimeout(() => {
      const newExp: Experiment = {
        id: Date.now().toString(),
        name: formData.name,
        status: 'running',
        agentA: { voice: formData.voiceA, calls: 0, conversions: 0 },
        agentB: { voice: formData.voiceB, calls: 0, conversions: 0 }
      };
      onCreate(newExp);
      setStep('success');
    }, 2000);

    setTimeout(() => {
      onClose();
      setStep('form');
      setFormData({ name: '', voiceA: 'Zephyr', voiceB: 'Kore' });
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0f172a] border border-slate-800 rounded-[40px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        
        {step === 'form' && (
          <div className="p-10 md:p-14">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                 <h3 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter leading-none">New Split Test</h3>
                 <p className="text-slate-500 text-sm font-medium italic">Deploy competing neural variations.</p>
              </div>
              <button onClick={onClose} className="p-3 text-slate-500 hover:text-white bg-slate-900/50 rounded-2xl transition-all border border-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Target size={12} className="text-cyan-400" /> Experiment Name
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-700" 
                  placeholder="e.g. Q4 High-Intent Leads" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Mic2 size={12} className="text-cyan-400" /> Variation A
                  </label>
                  <select 
                    value={formData.voiceA} 
                    onChange={e => setFormData({...formData, voiceA: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer"
                  >
                    {VOICES.map(v => <option key={v} value={v} className="bg-slate-950">{v}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Mic2 size={12} className="text-purple-400" /> Variation B
                  </label>
                  <select 
                    value={formData.voiceB} 
                    onChange={e => setFormData({...formData, voiceB: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none appearance-none cursor-pointer"
                  >
                    {VOICES.map(v => <option key={v} value={v} className="bg-slate-950">{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-500 italic leading-relaxed">
                  "Aurora will automatically distribute incoming calls 50/50 between Variation A and B. Conversion metrics will be tracked in real-time."
                </p>
              </div>

              <button type="submit" className="w-full py-6 bg-white text-slate-950 font-black uppercase tracking-widest rounded-[24px] text-sm shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                Deploy Neural Experiment <Beaker size={20} />
              </button>
            </form>
          </div>
        )}

        {step === 'loading' && (
          <div className="p-24 text-center space-y-10 animate-in fade-in duration-500">
             <div className="relative w-40 h-40 mx-auto">
               <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping" />
               <div className="absolute inset-4 bg-cyan-500/5 rounded-full border border-cyan-500/20 flex items-center justify-center">
                 <Loader2 size={80} className="text-cyan-400 animate-spin" />
               </div>
             </div>
             <div className="space-y-3">
               <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">Provisioning Test Hub</h3>
               <p className="text-slate-500 text-sm font-medium italic">Configuring neural cross-talk for {formData.name}...</p>
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-24 text-center space-y-10 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
               <CheckCircle2 size={56} className="animate-bounce" />
             </div>
             <div className="space-y-3">
               <h3 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter">Experiment Live</h3>
               <p className="text-slate-400 text-base font-medium italic max-w-sm mx-auto leading-relaxed">Tracking active. Aurora is now comparing {formData.voiceA} vs {formData.voiceB}.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ExperimentCard: React.FC<{ 
  exp: Experiment;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}> = ({ exp, onDelete, onToggle }) => {
  const getRate = (conv: number, total: number) => total === 0 ? 0 : (conv / total) * 100;
  const rateA = getRate(exp.agentA.conversions, exp.agentA.calls);
  const rateB = getRate(exp.agentB.conversions, exp.agentB.calls);
  const winner = exp.agentA.calls > 0 || exp.agentB.calls > 0 ? (rateA > rateB ? 'A' : 'B') : null;

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 space-y-8 shadow-xl hover:border-cyan-500/20 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Beaker size={120} />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-2xl">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-outfit text-white">{exp.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${exp.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{exp.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onToggle(exp.id)}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            {exp.status === 'running' ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
            onClick={() => onDelete(exp.id)}
            className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-rose-500/50 hover:text-rose-500 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Variation A */}
        <div className={`p-6 rounded-2xl border transition-all ${winner === 'A' ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Variation A</p>
              <h4 className="font-bold text-slate-100 flex items-center gap-2">
                <Mic2 size={14} className="text-cyan-400" /> {exp.agentA.voice}
              </h4>
            </div>
            {winner === 'A' && <Trophy size={20} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-black text-white">{rateA.toFixed(1)}%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Appointment Rate</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-300">{exp.agentA.conversions} / {exp.agentA.calls}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Booked</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: `${rateA}%` }} />
            </div>
          </div>
        </div>

        {/* Variation B */}
        <div className={`p-6 rounded-2xl border transition-all ${winner === 'B' ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Variation B</p>
              <h4 className="font-bold text-slate-100 flex items-center gap-2">
                <Mic2 size={14} className="text-emerald-400" /> {exp.agentB.voice}
              </h4>
            </div>
            {winner === 'B' && <Trophy size={20} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-black text-white">{rateB.toFixed(1)}%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Appointment Rate</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-300">{exp.agentB.conversions} / {exp.agentB.calls}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Booked</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${rateB}%` }} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} /> Statistical Significance: {Math.min(100, (exp.agentA.calls + exp.agentB.calls) / 10).toFixed(0)}%
        </div>
        <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          Full Report <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

const Experiments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: '1',
      name: 'Q3 Real Estate Push',
      status: 'running',
      agentA: { voice: 'Zephyr (Deep/Authoritative)', calls: 450, conversions: 24 },
      agentB: { voice: 'Kore (Friendly/Empathetic)', calls: 420, conversions: 41 },
    },
    {
      id: '2',
      name: 'Cold Outreach Beta',
      status: 'paused',
      agentA: { voice: 'Puck (Energetic)', calls: 120, conversions: 5 },
      agentB: { voice: 'Fenrir (Strong/Direct)', calls: 115, conversions: 6 },
    }
  ]);

  const handleDelete = (id: string) => {
    setExperiments(experiments.filter(e => e.id !== id));
  };

  const handleToggle = (id: string) => {
    setExperiments(experiments.map(e => {
      if (e.id === id) {
        return { ...e, status: e.status === 'running' ? 'paused' : 'running' };
      }
      return e;
    }));
  };

  const handleCreate = (newExp: Experiment) => {
    setExperiments([newExp, ...experiments]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <NewExperimentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreate} 
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Aurora Experiments</h2>
          <p className="text-slate-400 mt-1 italic font-medium">Data-driven optimization of your voice sales machine.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-50 transition-all flex items-center gap-2 shadow-xl"
        >
          <Plus size={18} /> New Split Test
        </button>
      </div>

      {/* Global Optimization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-[24px] shadow-sm flex items-center gap-6">
          <div className="p-4 bg-cyan-600/10 text-cyan-400 rounded-2xl">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg. Lift</p>
            <h3 className="text-3xl font-bold text-white">+24.5%</h3>
          </div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-[24px] shadow-sm flex items-center gap-6">
          <div className="p-4 bg-emerald-600/10 text-emerald-400 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Top Variation</p>
            <h3 className="text-3xl font-bold text-white">Kore</h3>
          </div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-[24px] shadow-sm flex items-center gap-6">
          <div className="p-4 bg-amber-600/10 text-amber-400 rounded-2xl">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Optimization</p>
            <h3 className="text-3xl font-bold text-white">$12.4k</h3>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 text-xs text-slate-400">
        <AlertCircle size={18} className="text-cyan-400 flex-shrink-0" />
        <p>Experiments work by randomly assigning each new lead from your selected lists to one of the variations below. Once 500+ calls are reached, statistical significance is achieved.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {experiments.map(exp => (
          <ExperimentCard 
            key={exp.id} 
            exp={exp} 
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default Experiments;
