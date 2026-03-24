import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, CheckCircle2, AlertCircle, Info, ChevronRight, Phone } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const SendMessage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [variables, setVariables] = useState({});
  const [status, setStatus] = useState(null); // 'sending', 'sent', 'error'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTemplates();
  }, []);

  const fetchApprovedTemplates = async () => {
    try {
      const res = await axios.get(`${API_URL}/templates`);
      const approved = res.data.filter(t => t.status === 'Approved');
      setTemplates(approved);
      if (approved.length > 0) handleSelectTemplate(approved[0]);
    } catch (err) {
      console.error('Error fetching templates:', err);
      // Dummy data for demo if backend not running
      const dummy = [
        { _id: '1', name: 'welcome_message', content: 'Hello {{1}}, welcome to {{2}}!', status: 'Approved' },
        { _id: '2', name: 'order_shipped', content: 'Hi {{1}}, your order #{{2}} has been shipped via {{3}}.', status: 'Approved' }
      ];
      setTemplates(dummy);
      handleSelectTemplate(dummy[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    // Parse variables from content (e.g., {{1}}, {{2}})
    const matches = template.content.match(/{{(\d+)}}/g) || [];
    const vars = {};
    matches.forEach(m => {
      const num = m.replace(/[{}]/g, '');
      vars[num] = '';
    });
    setVariables(vars);
    setStatus(null);
  };

  const handleVarChange = (num, val) => {
    setVariables({ ...variables, [num]: val });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Logic for sending message goes here
      // For demo, we'll simulate a 1.5s delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('sent');
      setPhoneNumber('');
      // Reset variables
      const resetVars = { ...variables };
      Object.keys(resetVars).forEach(k => resetVars[k] = '');
      setVariables(resetVars);
    } catch (err) {
      setStatus('error');
    }
  };

  const getPreview = () => {
    if (!selectedTemplate) return '';
    let content = selectedTemplate.content;
    Object.keys(variables).forEach(num => {
      const val = variables[num] || `{{${num}}}`;
      content = content.replace(`{{${num}}}`, val);
    });
    return content;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Send WhatsApp Message</h2>
        <p className="text-slate-500">Initiate conversations using your pre-approved templates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection & Config */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Select Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map((t) => (
                  <button
                    key={t._id}
                    onClick={() => handleSelectTemplate(t)}
                    className={`p-4 rounded-xl border text-left transition-all group ${
                      selectedTemplate?._id === t._id 
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-50' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold text-sm ${selectedTemplate?._id === t._id ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {t.name}
                      </span>
                      <ChevronRight size={14} className={selectedTemplate?._id === t._id ? 'text-emerald-500' : 'text-slate-300'} />
                    </div>
                    <p className="text-xs text-slate-400 truncate">{t.content}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <label className="text-sm font-semibold text-slate-700 block flex items-center gap-2">
                <Phone size={16} /> Recipient Phone Number
              </label>
              <input 
                type="text" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
              />
            </div>

            {Object.keys(variables).length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-sm font-semibold text-slate-700 block">Template Variables</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(variables).map((num) => (
                    <div key={num} className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Variable {"{{"}{num}{"}}"}</span>
                      <input 
                        type="text" 
                        value={variables[num]}
                        onChange={(e) => handleVarChange(num, e.target.value)}
                        placeholder={`Value for ${num}`}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Preview & Action */}
        <div className="space-y-6">
          <div className="sticky top-8">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Message Preview</h3>
            <div className="bg-[#e5ddd5] p-3 rounded-2xl shadow-xl w-full max-w-[300px] border-[6px] border-slate-800 mx-auto">
               <div className="bg-white p-3 rounded-lg shadow-sm space-y-2 relative after:content-[''] after:absolute after:left-[-8px] after:top-2 after:border-[8px] after:border-transparent after:border-r-white">
                 <p className="text-xs text-slate-800 whitespace-pre-wrap break-words leading-relaxed">
                   {getPreview() || 'Your message will appear here...'}
                 </p>
                 <div className="flex justify-end gap-1 items-center">
                   <span className="text-[10px] text-slate-400 uppercase">12:00 PM</span>
                   <CheckCircle2 size={10} className="text-slate-300" />
                 </div>
               </div>
            </div>

            <div className="mt-8 space-y-4">
              {status === 'sent' && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-semibold">Message sent successfully!</span>
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-in shake duration-200">
                  <AlertCircle size={20} />
                  <span className="text-sm font-semibold">Failed to send message.</span>
                </div>
              )}

              <button 
                onClick={handleSend}
                disabled={!selectedTemplate || !phoneNumber || status === 'sending'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-4 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send via WhatsApp
                  </>
                )}
              </button>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 italic">
                <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-normal">
                  You can only send messages using approved templates. New templates usually take 24-48 hours for review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
