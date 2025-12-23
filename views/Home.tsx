
import React, { useState } from 'react';
import { 
  ChevronRight, 
  XCircle, 
  CheckCircle2, 
  ChevronDown, 
  MessageCircle,
  X,
  PlayCircle,
  ArrowRight
} from 'lucide-react';
import { SIX_TOOLS, USE_CASES, COMPARISON, FAQS, AuroraLogo, ONBOARDING_STEPS } from '../constants';
import { NavLink, useNavigate } from 'react-router-dom';

const ToolCard: React.FC<{ tool: any }> = ({ tool }) => (
  <div className={`p-8 rounded-3xl bg-gradient-to-br ${tool.color} border border-white/10 hover:border-white/30 transition-all group flex flex-col h-full shadow-lg backdrop-blur-sm`}>
    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
      {tool.icon}
    </div>
    <h3 className="text-2xl font-bold font-outfit text-white mb-3">{tool.title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{tool.desc}</p>
    <NavLink to="/agent" className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
      Explore {tool.title} <ChevronRight size={14} />
    </NavLink>
  </div>
);

const FAQItem: React.FC<{ faq: any }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className="font-bold text-slate-200">{faq.q}</span>
        <ChevronDown size={20} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-5 pt-0 text-slate-400 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">
          {faq.a}
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const [showWidget, setShowWidget] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="space-y-32 pb-32 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center pt-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-cyan-400 mb-8">
          <AuroraLogo size={16} /> 24/7 AI Team inside your Business
        </div>
        <h1 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-white mb-6 leading-none">
          Six AI tools. One place.<br />
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">Unlimited growth.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Stop patching together single-use tools. Aurora is the first unified AI Employee designed to scale your business with zero friction.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => navigate('/billing')}
            className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl text-lg shadow-2xl shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            Unlock your AI Employee now <ChevronRight size={20} />
          </button>
          <button 
            onClick={() => navigate('/agent')}
            className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl text-lg transition-all flex items-center gap-2"
          >
            <PlayCircle size={24} className="text-cyan-400" /> See it in action
          </button>
        </div>
      </section>

      {/* 3-Step Setup Guide */}
      <section className="text-center bg-[#0f172a] rounded-[48px] p-12 md:p-24 border border-slate-800">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-6 py-2 rounded-full text-[10px] font-bold text-cyan-400 mb-8 uppercase tracking-widest">
          Getting Started
        </div>
        <h2 className="text-4xl md:text-5xl font-black font-outfit text-white mb-16 tracking-tighter">Simple 3-Step Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          {ONBOARDING_STEPS.map((step, idx) => (
            <div key={idx} className="space-y-4 group cursor-pointer" onClick={() => navigate(step.link)}>
              <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform shadow-lg`}>
                {step.icon}
              </div>
              <h4 className="text-xl font-bold text-white">{step.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest pt-2 group-hover:gap-4 transition-all">
                Go to Setup <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIX_TOOLS.map((tool, idx) => (
            <ToolCard key={idx} tool={tool} />
          ))}
        </div>
      </section>

      {/* Frankenstein Section */}
      <section className="bg-[#0f172a] rounded-[48px] p-12 md:p-24 border border-slate-800 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
        <h2 className="text-5xl md:text-6xl font-black font-outfit text-white mb-8 tracking-tighter leading-none">
          Stop Frankenstein-ing<br />single-use tools
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-lg">
          Most "AI" apps are patchwork hacks that charge per click, per task or per seat. 
          Aurora AI Employee is different—built for real outcomes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "All-in-One", desc: "Calls, chats, reviews, funnels, content, automations.", color: "from-cyan-500 to-blue-500" },
            { title: "AI First", desc: "Six tools built for real business outcomes.", color: "from-blue-500 to-purple-500" },
            { title: "Agency Ready", desc: "White label it, resell it, rebill it.", color: "from-purple-500 to-emerald-500" }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-[#020617] rounded-3xl border border-slate-800 text-left hover:border-cyan-500/30 transition-all shadow-xl">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} mb-6`}></div>
              <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-bold text-cyan-400 mb-6 uppercase tracking-widest">
          Use cases
        </div>
        <h2 className="text-5xl font-black font-outfit text-white mb-20 tracking-tighter">Built for every business</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {USE_CASES.map((useCase, idx) => (
            <div key={idx} className="group flex flex-col items-center">
              <div className="w-full aspect-[4/5] rounded-[48px] overflow-hidden mb-8 relative">
                <img src={useCase.img} alt={useCase.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-0 w-full p-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-4">
                    {useCase.icon}
                  </div>
                </div>
              </div>
              <h4 className="text-3xl font-bold text-white mb-3">{useCase.title}</h4>
              <p className="text-slate-400 text-sm">{useCase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-bold text-cyan-400 mb-6 uppercase tracking-widest">
          Impact
        </div>
        <h2 className="text-5xl font-black font-outfit text-white mb-20 tracking-tighter leading-none">
          Hiring your AI Employee<br />makes all the difference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-12 rounded-[48px] bg-rose-500/5 border border-rose-500/20 text-left">
            <h4 className="text-3xl font-bold text-white mb-10 pb-6 border-b border-rose-500/10">Without AI Employee:</h4>
            <ul className="space-y-6">
              {COMPARISON.without.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-slate-400 font-medium">
                  <XCircle className="text-rose-500" size={24} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-12 rounded-[48px] bg-emerald-500/5 border border-emerald-500/20 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full"></div>
            <h4 className="text-3xl font-bold text-white mb-10 pb-6 border-b border-emerald-500/10">With AI Employee:</h4>
            <ul className="space-y-6 relative z-10">
              {COMPARISON.with.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-emerald-100 font-bold">
                  <CheckCircle2 className="text-emerald-500" size={24} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-bold text-cyan-400 mb-6 uppercase tracking-widest">
          FAQs
        </div>
        <h2 className="text-5xl font-black font-outfit text-white mb-20 tracking-tighter">Everything you need to know</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {FAQS.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} />
          ))}
        </div>
      </section>

      {/* Floating Widget */}
      {showWidget && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10 duration-500">
          <div className="bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-slate-200 min-w-[320px] relative">
            <button 
              onClick={() => setShowWidget(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
            >
              <X size={14} />
            </button>
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60" alt="Aurora Support" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">Want to test Aurora's Voice AI and learn more?</p>
            </div>
            <div 
              onClick={() => navigate('/agent')}
              className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 cursor-pointer hover:scale-110 transition-transform"
            >
              <MessageCircle size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
