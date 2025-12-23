
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mic2, 
  Database, 
  Users, 
  CreditCard, 
  Settings as SettingsIcon,
  Bell, 
  Search, 
  Menu, 
  X, 
  Home as HomeIcon, 
  Sparkles, 
  Image as ImageIcon, 
  BrainCircuit,
  MessageSquareCode,
  Beaker
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import VoiceAgent from './views/VoiceAgent';
import KnowledgeBase from './views/KnowledgeBase';
import Leads from './views/Leads';
import Billing from './views/Billing';
import Home from './views/Home';
import SettingsView from './views/Settings';
import Intelligence from './views/Intelligence';
import VisualAI from './views/VisualAI';
import ConversationAI from './views/ConversationAI';
import Experiments from './views/Experiments';
import { AuroraLogo } from './constants';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${isActive 
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'}
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

const AppContent: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 w-72 bg-[#0f172a] border-r border-slate-800 z-50 transform transition-transform duration-300 lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
            <AuroraLogo size={40} className="animate-pulse" />
            <h1 className="text-2xl font-bold font-outfit tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              AURORA
            </h1>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
            <SidebarItem to="/" icon={<HomeIcon size={18} />} label="Overview" />
            <SidebarItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Command Center" />
            <SidebarItem to="/agent" icon={<Mic2 size={18} />} label="Voice Agent" />
            <SidebarItem to="/conversation" icon={<MessageSquareCode size={18} />} label="Conversation AI" />
            <SidebarItem to="/experiments" icon={<Beaker size={18} />} label="Experiments" />
            <SidebarItem to="/intelligence" icon={<BrainCircuit size={18} />} label="AI Intelligence" />
            <SidebarItem to="/visual" icon={<ImageIcon size={18} />} label="Visual Content" />
            <SidebarItem to="/knowledge" icon={<Database size={18} />} label="Knowledge Base" />
            <SidebarItem to="/leads" icon={<Users size={18} />} label="Leads & CRM" />
            <SidebarItem to="/billing" icon={<CreditCard size={18} />} label="Pay-as-you-go" />
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <SidebarItem to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
            <div className="mt-6 p-4 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-2xl border border-cyan-500/20">
              <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-1">Account Balance</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white">$42.50</p>
                <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              </div>
              <button 
                onClick={() => navigate('/billing')}
                className="mt-3 w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-cyan-600/20"
              >
                Top Up
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md z-30">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search leads, calls, or settings..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#020617]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800 cursor-pointer" onClick={() => navigate('/settings')}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Acme Corp</p>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">Enterprise Mode</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold ring-2 ring-white/10 shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agent" element={<VoiceAgent />} />
            <Route path="/conversation" element={<ConversationAI />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/visual" element={<VisualAI />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
