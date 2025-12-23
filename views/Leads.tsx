
import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  Plus, 
  Search, 
  ExternalLink, 
  Mail, 
  Phone, 
  Calendar,
  Smile,
  Meh,
  Frown,
  X,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { SAMPLE_LEADS } from '../constants';
import { Lead } from '../types';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>(SAMPLE_LEADS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    industry: 'Real Estate',
    notes: ''
  });

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone.includes(searchTerm)
  );

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      lastCallDate: new Date().toISOString().split('T')[0],
      sentiment: 'Neutral',
      notes: formData.notes || `Manually added lead for ${formData.industry}`
    };

    setLeads([newLead, ...leads]);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'New',
        industry: 'Real Estate',
        notes: ''
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-slate-100">Leads & CRM</h2>
          <p className="text-slate-400">Manage prospects qualified by Aurora AI.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-700 text-slate-200 shadow-sm transition-all">
            <Filter size={18} /> Filters
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-600/20 active:scale-95"
          >
            <Plus size={18} /> Add Lead
          </button>
        </div>
      </div>

      {/* CRM Dashboard Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Prospects', value: leads.length.toString() },
          { label: 'Recently Qualified', value: leads.filter(l => l.status === 'Qualified').length.toString() },
          { label: 'Meetings Pending', value: '12' },
          { label: 'Conversion Rate', value: '18.4%' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl shadow-sm">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-slate-200 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 text-xs text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-[10px] text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Lead Information</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sentiment</th>
                <th className="px-6 py-4">Last Interaction</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group animate-in fade-in duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 group-hover:scale-105 transition-transform">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{lead.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-slate-500 text-[10px]">
                          <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"><Mail size={10} /> {lead.email}</span>
                          <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"><Phone size={10} /> {lead.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      lead.status === 'Interested' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {lead.sentiment === 'Positive' ? <Smile size={16} className="text-emerald-400" /> : 
                       lead.sentiment === 'Neutral' ? <Meh size={16} className="text-amber-400" /> : 
                       <Frown size={16} className="text-rose-400" />}
                      <span className="text-xs text-slate-400">{lead.sentiment}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                        <Calendar size={12} className="text-slate-500" /> {lead.lastCallDate}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 truncate max-w-[150px]">{lead.notes}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white shadow-sm transition-all"><ExternalLink size={16} /></button>
                      <button className="p-2 bg-cyan-600/10 rounded-lg hover:bg-cyan-600/20 text-cyan-400 transition-all"><Phone size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 font-medium">No leads found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !showSuccess && setIsModalOpen(false)}></div>
          
          <div className={`relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${showSuccess ? 'scale-100 opacity-100' : ''}`}>
            {showSuccess ? (
              <div className="p-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={40} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold font-outfit text-white">Lead Added!</h3>
                <p className="text-slate-400">Prospect has been successfully added to your CRM.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserPlus size={24} className="text-cyan-400" />
                    <h3 className="text-xl font-bold font-outfit text-white">Manual Lead Entry</h3>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddLead} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 555-0123"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none"
                      >
                        <option>New</option>
                        <option>Interested</option>
                        <option>Qualified</option>
                        <option>Closed</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Industry Segment</label>
                      <select 
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none"
                      >
                        <option>Real Estate</option>
                        <option>Insurance</option>
                        <option>E-commerce</option>
                        <option>Hospitality</option>
                        <option>Restaurant</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Internal Notes</label>
                    <textarea 
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Brief context about this lead..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
                    >
                      Create Prospect
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
