
import React, { useState } from 'react';
/* Added missing ChevronRight import */
import { CreditCard, Zap, History, Shield, ArrowUpRight, TrendingUp, Plus, X, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';

const RechargeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'amount' | 'processing' | 'success'>('amount');
  const [selectedAmount, setSelectedAmount] = useState(50);

  const handleRecharge = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 2000);
    setTimeout(() => {
      onClose();
      setStep('amount');
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => step !== 'processing' && onClose()}></div>
      
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {step === 'amount' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold font-outfit text-white">Top Up Credits</h3>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-slate-900 rounded-xl transition-all"><X size={18} /></button>
            </div>

            <p className="text-slate-400 text-sm mb-6">Select an amount to recharge your Aurora balance. Credits are applied instantly.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[25, 50, 100, 250].map(amt => (
                <button 
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-4 rounded-2xl border font-bold transition-all ${
                    selectedAmount === amt 
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-600/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mb-8">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Payment Method</span>
                <span className="text-xs text-cyan-400 font-bold">Edit</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">Visa ending in 4242</p>
            </div>

            <button 
              onClick={handleRecharge}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-cyan-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Confirm Recharge <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-16 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-pulse"></div>
              <Loader2 size={96} className="text-cyan-500 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white font-outfit">Processing Payment</h3>
            <p className="text-slate-400 text-sm">Securing your credits for 24/7 reception...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-white font-outfit">Recharge Successful!</h3>
            <p className="text-slate-400 text-sm">Your balance has been updated to <strong>$92.50</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Billing: React.FC = () => {
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-slate-100">Pay-as-you-go</h2>
          <p className="text-slate-400 mt-1">Simple, transparent pricing. No subscriptions, only pay for what Aurora handles.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400 italic tracking-tight">Secure Business Payments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap size={120} className="text-cyan-500" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-4">Current Credits</p>
                <h3 className="text-6xl font-bold font-outfit mb-2 text-slate-50">$42.50</h3>
                <p className="text-slate-500 text-sm">Estimated to last ~1,400 call minutes</p>
                <button 
                  onClick={() => setIsRechargeOpen(true)}
                  className="mt-6 flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-600/30"
                >
                  <Plus size={18} /> Add Credits
                </button>
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex-1 max-w-sm">
                <p className="text-sm font-medium mb-4 text-slate-200">Auto-recharge is <span className="text-emerald-400">Enabled</span></p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>Recharge $50.00 when below $10.00</span>
                  <button className="text-cyan-400 font-bold hover:underline">Edit</button>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[42.5%] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-slate-100">
              <History size={20} className="text-cyan-400" />
              Usage History
            </h3>
            <div className="space-y-4">
              {[
                { date: 'May 12, 2024', activity: 'Aurora Live Sessions', duration: '42 min', cost: '$2.10' },
                { date: 'May 11, 2024', activity: 'Automated Lead Qualification', duration: '128 min', cost: '$6.40' },
                { date: 'May 10, 2024', activity: 'Aurora Live Sessions', duration: '15 min', cost: '$0.75' },
                { date: 'May 09, 2024', activity: 'Manual Top-up', duration: '-', cost: '+$50.00', type: 'credit' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                  <div className="flex gap-4 items-center">
                    <div className={`p-2 rounded-lg ${item.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {item.type === 'credit' ? <ArrowUpRight size={18} /> : <Zap size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-200">{item.activity}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.date} • {item.duration}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${item.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'}`}>{item.cost}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-100">
              <CreditCard size={20} className="text-cyan-400" />
              Payment Methods
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 border border-cyan-500/30 bg-cyan-500/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center">
                    <div className="w-6 h-4 bg-cyan-600 rounded-sm"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-200">•••• 4242</span>
                </div>
                <span className="text-[10px] bg-cyan-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Main</span>
              </div>
              <button className="w-full py-2.5 border border-dashed border-slate-700 rounded-xl text-sm text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 bg-slate-900/50">
                <Plus size={16} /> Add Payment Method
              </button>
            </div>
          </div>

          <div className="bg-cyan-600/5 border border-cyan-500/20 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <TrendingUp size={18} />
              ROI Insight
            </h4>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Based on your last 30 days, Aurora is costing you roughly <strong>$0.05 per minute</strong>, generating an estimated <strong>12x return</strong> on investment compared to manual lead qualification.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <p className="text-2xl font-bold text-slate-100">124</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hours Saved</p>
              </div>
              <div className="text-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <p className="text-2xl font-bold text-white">$6.2k</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Value Unlocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </div>
  );
};

export default Billing;
