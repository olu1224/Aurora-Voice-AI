
import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Shield, 
  Bell, 
  Globe, 
  Lock, 
  Mail, 
  ChevronRight, 
  Camera,
  CheckCircle2,
  Trash2
} from 'lucide-react';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
    <div className="px-8 py-4 border-b border-slate-800 bg-slate-900/30">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="p-8 space-y-6">
      {children}
    </div>
  </div>
);

const ToggleSwitch: React.FC<{ label: string; description: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="max-w-md">
      <p className="font-bold text-slate-100">{label}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-cyan-600' : 'bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const SettingsView: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    callAlerts: true,
    weeklyReports: false,
    billingAlerts: true
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black font-outfit text-white tracking-tight">Settings</h2>
          <p className="text-slate-400 mt-1">Manage your business profile and security preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isSaved ? 'bg-emerald-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20'
          }`}
        >
          {isSaved ? <CheckCircle2 size={18} /> : null}
          {isSaved ? 'Saved Changes' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <SettingsSection title="Business Profile">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl relative overflow-hidden">
                A
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} />
                </div>
              </div>
              <p className="text-center mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logo</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
                <input type="text" defaultValue="Acme FinTech Corp" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Support Email</label>
                <input type="email" defaultValue="support@acme.corp" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Timezone</label>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all appearance-none">
                  <option>UTC -8:00 (Pacific Time)</option>
                  <option>UTC -5:00 (Eastern Time)</option>
                  <option>UTC +0:00 (London)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone System ID</label>
                <input type="text" readOnly value="+1 (555) 442-9011" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed" />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <div className="space-y-8">
            <ToggleSwitch 
              label="Real-time Call Alerts" 
              description="Get a browser notification as soon as Aurora handles a new lead." 
              checked={notifications.callAlerts} 
              onChange={(v) => setNotifications({...notifications, callAlerts: v})} 
            />
            <ToggleSwitch 
              label="Weekly ROI Reports" 
              description="Receive a detailed email report every Monday with conversion and savings stats." 
              checked={notifications.weeklyReports} 
              onChange={(v) => setNotifications({...notifications, weeklyReports: v})} 
            />
            <ToggleSwitch 
              label="Low Balance Alerts" 
              description="Notify when credits fall below $10.00 to prevent downtime." 
              checked={notifications.billingAlerts} 
              onChange={(v) => setNotifications({...notifications, billingAlerts: v})} 
            />
          </div>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title="Security & API">
          <div className="space-y-6">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-xl text-slate-400"><Lock size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Change Password</p>
                  <p className="text-xs text-slate-500">Last updated 3 months ago</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </div>

            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-xl text-slate-400"><Shield size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Two-Factor Authentication</p>
                  <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest text-[8px]">Enabled</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </div>

            <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-rose-500">Delete Account</p>
                  <p className="text-xs text-slate-500">Permanently remove all leads, recordings, and business data.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-rose-600/10 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all">
                  <Trash2 size={14} /> Deactivate
                </button>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsView;
