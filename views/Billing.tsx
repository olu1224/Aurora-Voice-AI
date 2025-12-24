
import React, { useState } from 'react';
import { 
  CreditCard, 
  Zap, 
  History, 
  Shield, 
  ArrowUpRight, 
  TrendingUp, 
  Plus, 
  X, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  Lock, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const AddPaymentMethodModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdded: (card: any) => void }> = ({ isOpen, onClose, onAdded }) => {
  const [step, setStep] = useState<'details' | 'verifying' | 'success'>('details');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

  if (!isOpen) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verifying');
    // Simulate bank/Stripe verification
    setTimeout(() => {
      onAdded({
        last4: cardData.number.slice(-4),
        brand: 'Mastercard',
        isMain: false
      });
      setStep('success');
    }, 2500);
    
    setTimeout(() => {
      onClose();
      setStep('details');
      setCardData({ number: '', expiry: '', cvv: '', name: '' });
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => step !== 'verifying' && onClose()}></div>
      
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-[40px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
        
        {step === 'details' && (
          <div className="p-10 md:p-12">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">Activate Payment Node</h3>
                <p className="text-slate-500 text-sm font-medium italic">Secure your Aurora workforce with a verified method.</p>
              </div>
              <button onClick={onClose} className="p-3 text-slate-500 hover:text-white bg-slate-900/50 rounded-2xl transition-all border border-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleActivate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Cardholder Name</label>
                <input 
                  required 
                  type="text" 
                  value={cardData.name}
                  onChange={e => setCardData({...cardData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800" 
                  placeholder="e.g. David Sterling" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                  <input 
                    required 
                    type="text" 
                    maxLength={16}
                    value={cardData.number}
                    onChange={e => setCardData({...cardData, number: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-5 py-4 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800 tracking-[0.2em]" 
                    placeholder="0000 0000 0000 0000" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Expiry Date</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardData.expiry}
                    onChange={e => setCardData({...cardData, expiry: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">CVV / CVC</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                    <input 
                      required 
                      type="password" 
                      maxLength={4}
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={e => setCardData({...cardData, cvv: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800" 
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 items-start">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                <p className="text-[10px] text-slate-400 italic leading-relaxed">
                  Your data is protected by enterprise-grade 256-bit encryption. Aurora never stores your full card number on local nodes.
                </p>
              </div>

              <button 
                type="submit" 
                className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-[24px] text-sm shadow-[0_15px_40px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                Activate Method <Shield size={18} />
              </button>
            </form>
          </div>
        )}

        {step === 'verifying' && (
          <div className="p-24 text-center space-y-10 animate-in fade-in duration-500">
             <div className="relative w-40 h-40 mx-auto">
               <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
               <div className="absolute inset-4 bg-emerald-500/5 rounded-full border border-emerald-500/20 flex items-center justify-center">
                 <Loader2 size={80} className="text-emerald-400 animate-spin" />
               </div>
             </div>
             <div className="space-y-3">
               <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">Verifying Credentials</h3>
               <p className="text-slate-500 text-sm font-medium italic">Handshaking with payment infrastructure...</p>
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-24 text-center space-y-10 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
               <CheckCircle2 size={56} className="animate-bounce" />
             </div>
             <div className="space-y-3">
               <h3 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter">Activation Complete</h3>
               <p className="text-slate-400 text-base font-medium italic max-w-sm mx-auto leading-relaxed">New payment node linked successfully. Your agent is fully authorized.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { brand: 'Visa', last4: '4242', isMain: true }
  ]);

  const handleAddPayment = (newCard: any) => {
    setPaymentMethods(prev => [...prev, newCard]);
  };

  const removePayment = (index: number) => {
    setPaymentMethods(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-slate-100 uppercase tracking-tight">Financial Center</h2>
          <p className="text-slate-400 mt-1 italic font-medium">No subscriptions. No hidden fees. Just results.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400 italic tracking-tight">Enterprise Secure Node</span>
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
                <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Available Credits</p>
                <h3 className="text-7xl font-bold font-outfit mb-2 text-slate-50 tracking-tighter">$42.50</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Est. Utility: ~1,400 call minutes</p>
                <button 
                  onClick={() => setIsRechargeOpen(true)}
                  className="mt-6 flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-[20px] text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-600/30"
                >
                  <Plus size={18} /> Add Credits
                </button>
              </div>
              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm flex-1 max-w-sm">
                <p className="text-sm font-black uppercase tracking-widest mb-4 text-slate-200">Auto-Recharge <span className="text-emerald-400 ml-2">Active</span></p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 font-bold uppercase tracking-widest">
                  <span>Threshold: $10.00</span>
                  <button className="text-cyan-400 font-bold hover:underline">Settings</button>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[42.5%] rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 shadow-sm">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-slate-100 font-outfit uppercase tracking-tight">
              <History size={20} className="text-cyan-400" />
              Activity Ledger
            </h3>
            <div className="space-y-4">
              {[
                { date: 'May 12, 2024', activity: 'Aurora Live Sessions', duration: '42 min', cost: '$2.10' },
                { date: 'May 11, 2024', activity: 'Automated Lead Qualification', duration: '128 min', cost: '$6.40' },
                { date: 'May 10, 2024', activity: 'Aurora Live Sessions', duration: '15 min', cost: '$0.75' },
                { date: 'May 09, 2024', activity: 'Manual Top-up', duration: '-', cost: '+$50.00', type: 'credit' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-900/50 transition-all border border-transparent hover:border-slate-800 group">
                  <div className="flex gap-5 items-center">
                    <div className={`p-3 rounded-xl transition-all ${item.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500 group-hover:text-cyan-400'}`}>
                      {item.type === 'credit' ? <ArrowUpRight size={18} /> : <Zap size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-200 uppercase tracking-tight">{item.activity}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.date} • {item.duration}</p>
                    </div>
                  </div>
                  <p className={`font-black text-sm tracking-widest ${item.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'}`}>{item.cost}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-xl flex items-center gap-3 text-slate-100 font-outfit uppercase tracking-tight">
                <CreditCard size={20} className="text-cyan-400" />
                Linked Nodes
              </h3>
              <ShieldCheck size={18} className="text-emerald-500" />
            </div>
            
            <div className="space-y-4 mb-8">
              {paymentMethods.map((method, idx) => (
                <div key={idx} className={`flex items-center justify-between p-5 border rounded-2xl transition-all group ${
                  method.isMain ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-800 bg-slate-900/40'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                      {method.brand}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-200 tracking-[0.2em]">•••• {method.last4}</span>
                      {method.isMain && <p className="text-[8px] text-cyan-400 font-black uppercase tracking-widest mt-1">Default Protocol</p>}
                    </div>
                  </div>
                  {idx > 0 && (
                    <button onClick={() => removePayment(idx)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}

              <button 
                onClick={() => setIsAddPaymentOpen(true)}
                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 bg-slate-900/50 group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Link New Payment Node
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800 bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 flex gap-3">
              <AlertCircle size={14} className="text-amber-500 shrink-0" />
              <p className="text-[9px] text-slate-400 font-medium italic">Aurora requires at least one active payment node to prevent neural service interruption.</p>
            </div>
          </div>

          <div className="bg-cyan-600/5 border border-cyan-500/20 rounded-[32px] p-8 shadow-sm">
            <h4 className="font-black text-cyan-400 text-xs mb-4 flex items-center gap-2 uppercase tracking-widest">
              <TrendingUp size={18} />
              Efficiency Insight
            </h4>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed italic">
              "Aurora's current utility cost is <strong>$0.05 / min</strong>, generating an verified <strong>12x ROI</strong> vs traditional human reception nodes."
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
                <p className="text-2xl font-black text-white">124</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Hours Reclaimed</p>
              </div>
              <div className="text-center bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
                <p className="text-2xl font-black text-emerald-400">$6.2k</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Revenue Caught</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
      <AddPaymentMethodModal 
        isOpen={isAddPaymentOpen} 
        onClose={() => setIsAddPaymentOpen(false)} 
        onAdded={handleAddPayment} 
      />
    </div>
  );
};

// Internal icon for consistency
const Trash2: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9 2 2 4-4"/>
  </svg>
);

export default Billing;
