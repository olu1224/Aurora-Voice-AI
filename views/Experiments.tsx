
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
  AlertCircle
} from 'lucide-react';

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

const ExperimentCard: React.FC<{ exp: Experiment }> = ({ exp }) => {
  const getRate = (conv: number, total: number) => total === 0 ? 0 : (conv / total) * 100;
  const rateA = getRate(exp.agentA.conversions, exp.agentA.calls);
  const rateB = getRate(exp.agentB.conversions, exp.agentB.calls);
  const winner = rateA > rateB ? 'A' : 'B';

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
          <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            {exp.status === 'running' ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-rose-500/50 hover:text-rose-500 transition-all">
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
  const [experiments] = useState<Experiment[]>([
    {
      id: '1',
      name: 'Q3 Real Estate Push',
      status: 'running',
      agentA: { voice: 'Zephyr (Deep/Authoritative)', calls: 450, conversions: 24 },
      agentB: { voice: 'Selene (Friendly/Empathetic)', calls: 420, conversions: 41 },
    },
    {
      id: '2',
      name: 'Cold Outreach Beta',
      status: 'paused',
      agentA: { voice: 'Puck (Energetic)', calls: 120, conversions: 5 },
      agentB: { voice: 'Kore (Calm/Professional)', calls: 115, conversions: 6 },
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Aurora Experiments</h2>
          <p className="text-slate-400 mt-1 italic font-medium">Data-driven optimization of your voice sales machine.</p>
        </div>
        <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-50 transition-all flex items-center gap-2 shadow-xl">
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
            <h3 className="text-3xl font-bold text-white">Selene</h3>
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
          <ExperimentCard key={exp.id} exp={exp} />
        ))}
      </div>
    </div>
  );
};

export default Experiments;
