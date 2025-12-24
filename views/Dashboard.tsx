
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
  ArrowRight,
  Target,
  Users,
  Activity,
  Workflow,
  MousePointer2,
  Mail,
  MessageSquare
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
  <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 p-6 rounded-[24px] shadow-sm hover:border-cyan-500/30 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 bg-slate-900 rounded-xl ${color} group-hover:bg-cyan-600 group-hover:text-white transition-all`}>{icon}</div>
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend}
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </div>
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">{title}</p>
    <h3 className="text-3xl font-bold tracking-tighter text-slate-100 relative z-10">{value}</h3>
    {subtitle && <p className="text-[9px] text-slate-500 font-bold uppercase mt-2 tracking-wider relative z-10 italic">{subtitle}</p>}
  </div>
);

const Dashboard: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'calls' | 'qualified' | 'revenue'>('revenue');
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Command Center</h2>
          <p className="text-slate-400 mt-1 italic font-medium">Monitoring your AI Workforce ROI in real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
          <ShieldCheck size={14} />
          Workflow Integrity: 99.8%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Attributed Revenue" value="$28.1k" trend="+18%" isPositive={true} icon={<TrendingUp size={24} />} subtitle="Closed by AI Sequencer" />
        <StatCard title="Response Latency" value="0.3s" trend="-99%" isPositive={true} icon={<Zap size={24} />} subtitle="World-class performance" color="text-amber-400" />
        <StatCard title="Lead Qualified" value="184" trend="+32%" isPositive={true} icon={<CalendarCheck size={24} />} subtitle="Direct Calendar Bookings" />
        <StatCard title="Reputation Guard" value="4.9★" trend="+0.1" isPositive={true} icon={<Star size={24} />} subtitle="Automated Review Logic" color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 p-8 rounded-[32px] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl text-slate-100 font-outfit flex items-center gap-3">
              <Activity size={20} className="text-cyan-400" />
              Efficiency Analytics
            </h3>
            <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
              <button onClick={() => setActiveMetric('revenue')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMetric === 'revenue' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'text-slate-500'}`}>Revenue</button>
              <button onClick={() => setActiveMetric('calls')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMetric === 'calls' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'text-slate-500'}`}>Volume</button>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { date: 'Mon', revenue: 2400, calls: 45 },
                { date: 'Tue', revenue: 3600, calls: 52 },
                { date: 'Wed', revenue: 3000, calls: 38 },
                { date: 'Thu', revenue: 4400, calls: 65 },
                { date: 'Fri', revenue: 4000, calls: 48 },
                { date: 'Sat', revenue: 1600, calls: 24 },
                { date: 'Sun', revenue: 1000, calls: 15 },
              ]}>
                <defs>
                  <linearGradient id="primary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey={activeMetric} stroke="#22d3ee" strokeWidth={4} fill="url(#primary)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[32px] shadow-sm flex flex-col flex-1">
            <h3 className="font-bold text-xl text-slate-100 font-outfit mb-6 flex items-center gap-3">
              <Workflow size={20} className="text-emerald-400" />
              Auto-Sequences
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Emails Dispatched', value: '428', icon: <Mail size={14} />, color: 'text-cyan-400' },
                { label: 'SMS Confirmations', value: '312', icon: <MessageSquare size={14} />, color: 'text-emerald-400' },
                { label: 'Social Responses', value: '156', icon: <MousePointer2 size={14} />, color: 'text-pink-500' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-950 ${item.color}`}>{item.icon}</div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/agent')}
              className="mt-6 w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Manage Sequences <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[32px] shadow-sm flex flex-col h-fit">
            <h3 className="font-bold text-xl text-slate-100 font-outfit mb-4 flex items-center gap-3">
              <Users size={20} className="text-purple-400" />
              Live Queue
            </h3>
            <div className="space-y-3">
              {CALENDAR_EVENTS.slice(0, 2).map((event) => (
                <div key={event.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl group hover:border-purple-500/30 transition-all cursor-pointer">
                  <p className="font-bold text-slate-100 text-xs truncate mb-1">{event.title}</p>
                  <div className="flex items-center gap-2 text-[8px] text-slate-500 font-black uppercase tracking-tighter">
                    <Clock size={10} /> {event.time} • {event.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12">
        <div className="flex items-center gap-3 mb-10">
          <Target className="text-cyan-400" />
          <h3 className="text-2xl font-black font-outfit text-white tracking-tight uppercase">Strategic Growth Pillars</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STRATEGIES.map((strategy, idx) => (
            <div key={idx} className="bg-[#0f172a] border border-slate-800 p-10 rounded-[40px] flex flex-col hover:bg-slate-900/60 transition-all group shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-cyan-500/10 transition-colors"></div>
               <div className="flex items-center justify-between mb-8 relative z-10">
                <span className="px-3 py-1 bg-slate-800 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                  Pillar 0{idx + 1}
                </span>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${strategy.impact === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  {strategy.impact}
                </span>
              </div>
              <h4 className="font-bold text-2xl text-white mb-2 font-outfit tracking-tight">{strategy.title}</h4>
              <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-6">{strategy.tag}</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-10 flex-1 italic">"{strategy.description}"</p>
              <div className="mt-auto pt-8 border-t border-slate-800">
                <p className="text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">Expected ROI</p>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 italic text-xs text-slate-200">
                  {strategy.roi}
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
