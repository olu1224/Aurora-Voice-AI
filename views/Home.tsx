
import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  XCircle, 
  CheckCircle2, 
  ChevronDown, 
  MessageCircle,
  X,
  PlayCircle,
  PauseCircle,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Target,
  Rocket,
  Volume2,
  Maximize,
  Sparkles,
  Play,
  AlertCircle,
  Loader2,
  Video,
  Clapperboard,
  Waves,
  Minus,
  Plus as PlusIcon,
  Shield,
  Building2,
  User,
  Mail,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { SIX_TOOLS, USE_CASES, FAQS, AuroraLogo, ONBOARDING_STEPS, INDUSTRY_MASTER_LIST, AURORA_ADVANTAGES } from '../constants';
import { NavLink, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const ToolCard: React.FC<{ tool: any }> = ({ tool }) => (
  <div className={`p-8 rounded-[32px] bg-gradient-to-br ${tool.color} border border-white/5 hover:border-white/20 transition-all group flex flex-col h-full shadow-lg backdrop-blur-sm overflow-hidden relative`}>
    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150 rotate-12">
      {tool.icon}
    </div>
    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-2xl relative z-10">
      {tool.icon}
    </div>
    <h3 className="text-2xl font-bold font-outfit text-white mb-4 relative z-10">{tool.title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 relative z-10">{tool.desc}</p>
    <NavLink to="/agent" className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform relative z-10">
      Deploy {tool.title} Agent <ChevronRight size={14} className="text-cyan-400" />
    </NavLink>
  </div>
);

const IndustryShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="px-4 max-w-7xl mx-auto py-32 relative overflow-hidden">
      <div className="text-center mb-20 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full text-[10px] font-black text-emerald-400 mb-6 uppercase tracking-[0.2em]">
          Universal Mastery
        </div>
        <h2 className="text-5xl md:text-7xl font-black font-outfit text-white tracking-tighter uppercase mb-6 leading-none">Built for every <span className="text-cyan-400">Empire</span></h2>
        <p className="text-slate-500 max-w-2xl mx-auto italic font-medium">Aurora isn't a generic chatbot. She is a specialized AI workforce trained on industry-specific protocols to ensure every call captures maximum value.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Industry Selection */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {INDUSTRY_MASTER_LIST.map((ind, idx) => (
            <button 
              key={ind.id}
              onClick={() => setActiveIndex(idx)}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                activeIndex === idx 
                  ? 'bg-cyan-600/10 border-cyan-500/40 text-white shadow-lg' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className={`p-3 rounded-xl ${activeIndex === idx ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                {ind.icon}
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">{ind.name}</span>
            </button>
          ))}
        </div>

        {/* Detailed Case View */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-[40px] p-10 md:p-16 relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-10 duration-500" key={activeIndex}>
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
            {INDUSTRY_MASTER_LIST[activeIndex].icon}
          </div>
          
          <div className="relative z-10 space-y-12">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">The Crisis</h3>
              <p className="text-2xl font-bold text-white leading-tight italic">"{INDUSTRY_MASTER_LIST[activeIndex].problem}"</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">The Aurora Intervention</h3>
              <p className="text-xl text-slate-300 leading-relaxed font-medium">
                {INDUSTRY_MASTER_LIST[activeIndex].solution}
              </p>
            </div>

            <div className="pt-10 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Verified ROI Outcome</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-emerald-400">{INDUSTRY_MASTER_LIST[activeIndex].roi}</span>
                  <TrendingUp className="text-emerald-500 animate-bounce" />
                </div>
              </div>
              <NavLink to="/agent" className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                Deploy this model
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AuroraAdvantage: React.FC = () => (
  <section className="px-4 max-w-7xl mx-auto py-24 border-y border-slate-800/60 mb-20">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {AURORA_ADVANTAGES.map((adv, idx) => (
        <div key={idx} className="space-y-6 group">
          <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${adv.accent} transition-all group-hover:scale-110 shadow-xl group-hover:shadow-cyan-500/20`}>
            {adv.icon}
          </div>
          <h4 className="text-xl font-bold font-outfit text-white tracking-tight">{adv.title}</h4>
          <p className="text-slate-500 text-sm leading-relaxed italic">"{adv.desc}"</p>
        </div>
      ))}
    </div>
  </section>
);

const TrialModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', industry: 'Tech & SaaS' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => setStep('success'), 3000);
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
                 <h3 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter leading-none">14-Day Free Trial</h3>
                 <p className="text-slate-500 text-sm font-medium italic">Capturing revenue begins now.</p>
              </div>
              <button onClick={onClose} className="p-3 text-slate-500 hover:text-white bg-slate-900/50 rounded-2xl transition-all border border-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <User size={12} className="text-cyan-400" /> Your Full Name
                  </label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-700" placeholder="e.g. David Sterling" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Mail size={12} className="text-cyan-400" /> Business Email
                  </label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-700" placeholder="david@sterling.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Building2 size={12} className="text-cyan-400" /> Company Identity
                </label>
                <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-700" placeholder="Acme Logistics Corp" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Target size={12} className="text-cyan-400" /> Target Industry
                </label>
                <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all appearance-none cursor-pointer">
                  {['Real Estate', 'Insurance', 'E-commerce', 'Hospitality', 'Tech & SaaS', 'Healthcare'].map(i => <option key={i} value={i} className="bg-slate-950">{i}</option>)}
                </select>
              </div>

              <button type="submit" className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black uppercase tracking-widest rounded-[24px] text-sm shadow-[0_15px_40px_rgba(8,145,178,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6">
                Initialize Deployment <Rocket size={20} />
              </button>

              <div className="flex items-center justify-center gap-8 pt-8 border-t border-slate-800/50 mt-10">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" /> Encrypted Protocol
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <CheckCircle2 size={14} className="text-emerald-500" /> No Card Required
                </div>
              </div>
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
               <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">Provisioning AI Instance</h3>
               <p className="text-slate-500 text-sm font-medium italic">Synchronizing {formData.company}'s custom workforce node...</p>
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-24 text-center space-y-10 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
               <CheckCircle2 size={56} className="animate-bounce" />
             </div>
             <div className="space-y-3">
               <h3 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter">Workforce Active</h3>
               <p className="text-slate-400 text-base font-medium italic max-w-sm mx-auto leading-relaxed">Your environment is live. Welcome to 24/7 revenue capture, {formData.name.split(' ')[0]}.</p>
             </div>
             <button onClick={onClose} className="px-16 py-6 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl text-sm transition-all hover:scale-105 shadow-2xl">
               Access Command Center
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoShowcase: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const steps = [
    "Analyzing Aurora's Voice Core...",
    "Rendering Neural Receptionist Interface...",
    "Synthesizing Cinematic Lead Qualification...",
    "Finalizing 4K Business Demo...",
    "Securing Download Stream..."
  ];

  const generateAIVideo = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setIsGenerating(true);
    setGenerationStep(0);
    setError(null);

    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 20000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = "A cinematic, high-tech promotional advertisement for 'Aurora', an AI Voice Sales Agent. Show a futuristic 3D holographic sphere pulsing with teal light (representing the AI's voice). Transition to a business professional's smartphone screen showing calls being answered automatically. The environment is a clean, modern glass office at sunset. Overlays: 'Handle Calls', 'Book Meetings', 'Capture Revenue'. 4k resolution, professional color grading, smooth 24fps.";

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Fetch the video as a blob to avoid 'The element has no supported sources' error.
        const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        clearInterval(stepInterval);
      } else {
        throw new Error("Generation failed.");
      }
    } catch (err: any) {
      setError(err.message || "Generation error.");
      clearInterval(stepInterval);
    } finally {
      setIsGenerating(false);
    }
  };

  // Cleanup Object URL on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoUrl) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !videoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    videoRef.current.currentTime = (percentage / 100) * videoRef.current.duration;
    setProgress(percentage);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', () => setIsPlaying(false));
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoUrl]);

  return (
    <section className="px-4 max-w-7xl mx-auto py-20 relative">
      <div className="text-center mb-16 animate-in fade-in duration-700">
        <h2 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight uppercase mb-4">The AI Proof</h2>
        <p className="text-slate-500 max-w-2xl mx-auto italic font-medium">Generate a custom AI video tour of your business workforce using the latest Veo 3.1 engine.</p>
      </div>

      <div 
        className="relative group rounded-[40px] border-[12px] border-slate-900 bg-black shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all min-h-[500px] flex flex-col items-center justify-center cursor-pointer"
        onClick={() => videoUrl && togglePlay()}
      >
        {!videoUrl && !isGenerating ? (
          <div className="text-center p-12 space-y-8 animate-in zoom-in duration-500 relative z-10">
             <div className="w-24 h-24 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
               <Clapperboard size={48} className="text-white" />
             </div>
             <div>
               <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter mb-4">Create Your Custom Tour</h3>
               <p className="text-slate-400 max-w-md mx-auto italic font-medium">Use Aurora's built-in Cinematic Engine to render a promotional video of your AI employee in real-time.</p>
             </div>
             <button 
              onClick={(e) => { e.stopPropagation(); generateAIVideo(); }}
              className="px-12 py-5 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
             >
               Generate AI Video Demo <Video size={20} />
             </button>
             {error && (
               <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold flex items-center gap-2 justify-center">
                 <AlertCircle size={14} /> {error}
               </div>
             )}
          </div>
        ) : isGenerating ? (
          <div className="text-center p-12 space-y-10 animate-in fade-in duration-700 relative z-10">
            <div className="relative w-32 h-32 mx-auto">
               <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
               <div className="absolute inset-0 bg-cyan-600/10 rounded-full animate-pulse flex items-center justify-center border border-cyan-500/20">
                 <Loader2 size={64} className="text-cyan-400 animate-spin" />
               </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white uppercase tracking-widest">{steps[generationStep]}</h3>
              <p className="text-slate-500 text-sm font-medium italic">High-quality video synthesis usually takes 1-2 minutes.</p>
            </div>
            <div className="w-64 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden border border-slate-700">
               <div className="h-full bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-1000" style={{ width: `${((generationStep + 1) / steps.length) * 100}%` }} />
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <video ref={videoRef} src={videoUrl!} className={`w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-60'}`} playsInline />
            <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-30 transition-opacity duration-500 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors">
                  {isPlaying ? <PauseCircle size={32} /> : <Play size={32} fill="currentColor" />}
                </button>
                <div className="flex-1 h-2 bg-white/10 rounded-full relative cursor-pointer" onClick={handleSeek}>
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-100 relative shadow-[0_0_15px_rgba(34,211,238,0.8)]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            {!isPlaying && (
              <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center z-20"><PlayCircle size={100} className="text-white/80 drop-shadow-2xl" /></button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const FAQItem: React.FC<{ faq: { q: string, a: string }; isOpen: boolean; toggle: () => void }> = ({ faq, isOpen, toggle }) => (
  <div className={`rounded-[24px] transition-all duration-500 overflow-hidden relative ${
    isOpen 
      ? 'bg-gradient-to-r from-blue-100/10 to-cyan-500/10 border border-cyan-400/40 shadow-[0_10px_30px_-10px_rgba(34,211,238,0.3)] backdrop-blur-md' 
      : 'bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20'
  }`}>
    {/* Liquid Sheen Overlay */}
    <div className={`absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
    
    <button onClick={toggle} className="w-full px-8 py-7 flex items-center justify-between text-left group relative z-10">
      <span className={`text-sm md:text-[15px] font-bold tracking-tight transition-colors ${isOpen ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'}`}>
        {faq.q}
      </span>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ${isOpen ? 'bg-cyan-500 text-slate-950 rotate-180' : 'bg-white/5 text-slate-500'}`}>
        <ChevronDown size={18} />
      </div>
    </button>
    <div className={`px-8 transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'max-h-[300px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="h-px w-full bg-gradient-to-r from-cyan-500/30 to-transparent mb-6" />
      <p className="text-sm text-slate-300 leading-relaxed italic font-medium border-l-2 border-cyan-500/30 pl-5">
        "{faq.a}"
      </p>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [showWidget, setShowWidget] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const navigate = useNavigate();

  const half = Math.ceil(FAQS.length / 2);
  const faqLeft = FAQS.slice(0, half);
  const faqRight = FAQS.slice(half);

  return (
    <div className="space-y-40 pb-40 animate-in fade-in duration-1000 relative">
      <TrialModal isOpen={isTrialOpen} onClose={() => setIsTrialOpen(false)} />

      {/* Hero Section */}
      <section className="text-center pt-24 relative overflow-hidden px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[800px] bg-gradient-to-b from-cyan-500/20 via-blue-500/5 to-transparent blur-[140px] rounded-full -z-10 animate-pulse" />
        <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full text-[10px] font-black text-cyan-400 mb-12 uppercase tracking-[0.2em] shadow-2xl">
          <AuroraLogo size={20} className="animate-pulse" /> Unified AI Workforce Ecosystem
        </div>
        <h1 className="text-7xl md:text-[160px] font-black font-outfit tracking-tighter text-white mb-10 leading-[0.85] max-w-7xl mx-auto">
          Hire Your First <span className="bg-gradient-to-r from-cyan-400 via-white to-blue-500 bg-clip-text text-transparent italic">AI Employee.</span>
        </h1>
        <p className="text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-16 font-medium italic px-4">
          Hiring specialized AI employees shouldn't be complex. Aurora delivers ready-to-work voice agents that qualify, sell, and support your brand in 40+ languages.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={() => setIsTrialOpen(true)} className="px-14 py-7 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black uppercase tracking-widest rounded-[28px] text-sm shadow-[0_20px_60px_-10px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group">
            Start 14-Day Free Trial <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigate('/billing')} className="px-14 py-7 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-[28px] text-sm backdrop-blur-sm transition-all flex items-center gap-3">
            <Zap size={20} className="text-amber-400" /> Pay-As-You-Go
          </button>
        </div>
      </section>

      {/* Educational Advantage Section */}
      <AuroraAdvantage />

      {/* Video Showcase */}
      <VideoShowcase />

      {/* Universal Mastery Showcase */}
      <IndustryShowcase />

      {/* Grid Section */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="text-center mb-28">
          <h2 className="text-6xl font-black font-outfit text-white tracking-tighter uppercase leading-none mb-6">Omni-Channel Mastery</h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto italic font-medium">Specialized AI intelligence designed to replace entire support and sales departments.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {SIX_TOOLS.map((tool, idx) => <ToolCard key={idx} tool={tool} />)}
        </div>
      </section>

      {/* Liquid Glass FAQ Section */}
      <section className="px-4 max-w-7xl mx-auto py-24 relative overflow-visible">
        <div className="text-center mb-24 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 bg-white/5 px-8 py-2.5 rounded-full text-[11px] font-black text-slate-400 mb-8 uppercase tracking-[0.3em] border border-white/10 backdrop-blur-sm">
            Operational Intel
          </div>
          <h2 className="text-5xl md:text-8xl font-black font-outfit text-white tracking-tighter uppercase mb-8 leading-[0.9]">
            Everything you need to know about<br />your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI Workforce</span>
          </h2>
          <div className="w-40 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-4 opacity-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-8 relative z-10">
          <div className="space-y-8">
            {faqLeft.map((faq, idx) => (
              <FAQItem 
                key={idx} 
                faq={faq} 
                isOpen={openFaq === idx} 
                toggle={() => setOpenFaq(openFaq === idx ? null : idx)} 
              />
            ))}
          </div>
          <div className="space-y-8">
            {faqRight.map((faq, idx) => (
              <FAQItem 
                key={idx + half} 
                faq={faq} 
                isOpen={openFaq === idx + half} 
                toggle={() => setOpenFaq(openFaq === idx + half ? null : idx + half)} 
              />
            ))}
          </div>
        </div>

        {/* Neural Flux Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent -z-10 pointer-events-none opacity-40 blur-[100px]" />
      </section>

      {/* Frankenstein Section */}
      <section className="bg-[#0b1120] rounded-[80px] p-16 md:p-36 border border-slate-800/60 relative overflow-hidden text-center mx-4 shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-purple-600/5" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <h2 className="text-7xl font-black font-outfit text-white mb-10 tracking-tighter leading-[0.85] uppercase">Kill the<br />"Patchwork" Tax</h2>
        <p className="text-slate-400 max-w-3xl mx-auto mb-24 text-2xl font-medium leading-relaxed italic">
          Stop paying for fragmented apps that don't speak to each other. Aurora is the first unified brain that synchronizes your entire business logic.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 relative z-10">
          {[
            { title: "Unified Brain", desc: "All tools share one knowledge base. Aurora learns your business once, uses it everywhere.", icon: <BrainCircuit className="text-purple-400" /> },
            { title: "Revenue Focused", desc: "Every call, email, and ad is optimized for one core metric: Conversions.", icon: <TrendingUp className="text-emerald-400" /> },
            { title: "Zero Latency", desc: "Human-grade conversations with speed that beats the competition in 0.4s.", icon: <Zap className="text-amber-400" /> }
          ].map((item, idx) => (
            <div key={idx} className="p-12 bg-slate-950/80 backdrop-blur-md rounded-[48px] border border-slate-800 text-left hover:border-cyan-500/40 transition-all shadow-2xl group">
              <div className="mb-10 p-5 bg-slate-900 rounded-2xl w-fit group-hover:scale-110 transition-transform ring-1 ring-white/5">{item.icon}</div>
              <h4 className="text-3xl font-bold text-white mb-4 font-outfit uppercase tracking-tight">{item.title}</h4>
              <p className="text-slate-500 text-base leading-relaxed italic">"{item.desc}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center pb-24 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-900 to-black p-24 md:p-36 rounded-[90px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/5 opacity-50" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-1000" />
          
          <div className="relative z-10">
            <h2 className="text-6xl md:text-8xl font-black font-outfit text-white mb-10 tracking-tighter uppercase leading-[0.9]">Start your 14-day<br /><span className="text-cyan-400">Empire Trial</span></h2>
            <p className="text-slate-400 text-xl mb-16 font-medium italic max-w-2xl mx-auto">Train Aurora on your business today. Zero credits required to begin.</p>
            <button onClick={() => setIsTrialOpen(true)} className="px-16 py-8 bg-white text-slate-950 font-black uppercase tracking-[0.2em] rounded-[32px] text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)] flex items-center gap-4 mx-auto">
              Initiate My Workforce <Rocket size={26} className="text-cyan-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Widget */}
      {showWidget && (
        <div className="fixed bottom-12 right-12 z-[100] animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-[36px] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.7)] flex items-center gap-7 min-w-[420px] relative backdrop-blur-2xl">
            <button onClick={() => setShowWidget(false)} className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all shadow-xl"><X size={16} /></button>
            <div className="w-20 h-20 rounded-3xl overflow-hidden flex-shrink-0 border-2 border-cyan-500/20 shadow-xl ring-4 ring-white/5">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60" alt="Aurora Agent" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-cyan-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Elite Reception Node
              </p>
              <p className="text-[13px] font-bold text-white leading-tight italic">"Ready to convert your missed calls into deals? Let's talk."</p>
            </div>
            <div onClick={() => navigate('/agent')} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-cyan-600/30 cursor-pointer hover:scale-110 active:scale-90 transition-all animate-pulse">
              <MessageCircle size={28} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
