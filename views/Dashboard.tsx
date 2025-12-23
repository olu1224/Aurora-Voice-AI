
import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CalendarCheck,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Star,
  Sparkles,
  ChevronRight,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { CALL_METRICS, SAMPLE_LEADS, STRATEGIES, ONBOARDING_STEPS, CALENDAR_EVENTS } from '../constants';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  trend: string; 
  isPositive: boolean; 
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
}> = ({ title, value, trend, isPositive, icon, subtitle, color = "text-cyan-400" }) => (
  <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-cyan-500/30 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 bg-cyan-500/10 rounded-xl ${color} group-hover:bg-cyan-500 group-hover:text-white transition-all`}>{icon}</div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend}
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      </div>
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">{title}</p>
    <h3 className="text-3xl font-bold tracking-tight text-slate-100 relative z-10">{value}</h3>
    {subtitle && <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-wider relative z-10">{subtitle}</p>}
  </div>
);

const Dashboard: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'calls' | 'prevented' | 'reviews'>('calls');
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white">Receptionist Command Center</h2>
          <p className="text-slate-400 mt-1">Winning with fast responses and elite customer experience.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-sm font-bold text-emerald-400">
          <ShieldCheck size={16} />
          24/7 Reputation Guard Active
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold font-outfit text-white mb-2 flex items-center gap-2">
              <Sparkles className="text-cyan-400" /> Welcome to Aurora
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              You're just minutes away from automating your first call. Follow the steps below to unleash your new AI employee.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-cyan-500 h-full w-[33%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
              </div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Step 1 of 3</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            {ONBOARDING_STEPS.map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(step.link)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col items-center text-center ${
                  idx === 0 ? 'bg-cyan-500/10 border-cyan-500/40 shadow-xl' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`mb-3 ${idx === 0 ? step.color : 'text-slate-600 group-hover:text-slate-400'}`}>
                  {step.icon}
                </div>
                <p className={`text-[11px] font-bold uppercase tracking-tighter ${idx === 0 ? 'text-white' : 'text-slate-500'}`}>
                  {step.title.split('. ')[1]}
                </p>
                {idx === 0 && <span className="text-[8px] mt-1 font-black text-cyan-400 animate-pulse">START HERE</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Missed Calls Prevented" value="214" trend="+14%" isPositive={true} icon={<ShieldAlert size={24} />} subtitle="Never missed a lead" />
        <StatCard title="Response Latency" value="0.4s" trend="-22%" isPositive={true} icon={<Zap size={24} />} subtitle="Instant connection" color="text-amber-400" />
        <StatCard title="Meetings Booked" value="48" trend="+18%" isPositive={true} icon={<CalendarCheck size={24} />} subtitle="Business running smooth" />
        <StatCard title="Review Influence" value="4.9★" trend="+0.4" isPositive={true} icon={<Star size={24} />} subtitle="More positive reviews" color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl text-slate-100 font-outfit flex items-center gap-2">
              <TrendingUp size={20} className="text-cyan-400" />
              Service Performance
            </h3>
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setActiveMetric('calls')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMetric === 'calls' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}>Calls</button>
              <button onClick={() => setActiveMetric('prevented')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMetric === 'prevented' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}>Prevented</button>
              <button onClick={() => setActiveMetric('reviews')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMetric === 'reviews' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}>Reviews</button>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CALL_METRICS}>
                <defs>
                  <linearGradient id="primary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey={activeMetric} stroke="#22d3ee" strokeWidth={3} fill="url(#primary)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col">
          <h3 className="font-bold text-xl text-slate-100 font-outfit mb-6 flex items-center gap-2">
            <CalendarCheck size={20} className="text-emerald-400" />
            Scheduled Directly
          </h3>
          <div className="space-y-3 flex-1">
            {CALENDAR_EVENTS.map((event) => (
              <div key={event.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-slate-100 text-sm truncate">{event.title}</p>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                  <Clock size={12} /> {event.time} • {event.type}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/leads')}
            className="mt-6 w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            View Full Pipeline <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="pt-8">
        <h3 className="text-2xl font-bold font-outfit text-slate-100 mb-8">Value Delivery Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STRATEGIES.map((strategy, idx) => (
            <div key={idx} className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl flex flex-col hover:bg-slate-900/60 transition-all hover:scale-[1.02] shadow-xl group border-t-4 border-t-cyan-500">
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-slate-800 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  Pillar {idx + 1}
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {strategy.impact}
                </span>
              </div>
              <h4 className="font-bold text-xl text-white mb-2">{strategy.title}</h4>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-tighter mb-4">{strategy.tag}</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">{strategy.description}</p>
              <div className="mt-auto pt-6 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Growth ROI</p>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 italic text-[11px] text-slate-300">
                  "{strategy.roi}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
