import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save, X, Info, Plus, Trash2, ExternalLink } from 'lucide-react';
import API_URL from '../api';

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Marketing',
    language: 'en-US',
    content: '',
    buttons: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddButton = () => {
    setFormData({
      ...formData,
      buttons: [...formData.buttons, { type: 'URL', text: '', value: '' }]
    });
  };

  const handleRemoveButton = (index) => {
    const nextButtons = formData.buttons.filter((_, i) => i !== index);
    setFormData({ ...formData, buttons: nextButtons });
  };

  const handleButtonChange = (index, field, value) => {
    const nextButtons = [...formData.buttons];
    nextButtons[index][field] = value;
    setFormData({ ...formData, buttons: nextButtons });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/templates`, formData);
      navigate('/templates');
    } catch (err) {
      alert('Error creating template: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Create New Template</h2>
          <p className="text-slate-500">Design your WhatsApp message template for approval.</p>
        </div>
        <button 
          onClick={() => navigate('/templates')}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Form */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                Template Name
                <Info size={14} className="text-slate-400" />
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., welcome_message"
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium cursor-pointer"
                >
                  <option>Marketing</option>
                  <option>Utility</option>
                  <option>Authentication</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Language</label>
                <select 
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium cursor-pointer"
                >
                  <option value="en-US">English (US)</option>
                  <option value="hi-IN">Hindi (IN)</option>
                  <option value="es-ES">Spanish</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700">Message Content</label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                placeholder="Enter your message template text..."
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium resize-none"
                required
              />
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Info size={12} />
                Use {`{{1}}`}, {`{{2}}`} etc. for dynamic variables
              </p>
            </div>
          </div>

          {/* Interactive Buttons Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Interactive Buttons (Optional)</label>
              <button 
                type="button"
                onClick={handleAddButton}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1 transition-colors"
              >
                <Plus size={16} /> Add Button
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.buttons.map((btn, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-start">
                    <select 
                      value={btn.type}
                      onChange={(e) => handleButtonChange(idx, 'type', e.target.value)}
                      className="bg-transparent border-none text-sm font-bold text-emerald-600 focus:ring-0 cursor-pointer"
                    >
                      <option value="URL">Visit Website (URL)</option>
                      <option value="PHONE_NUMBER">Call Number</option>
                    </select>
                    <button 
                      type="button"
                      onClick={() => handleRemoveButton(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text"
                      placeholder="Button Text"
                      value={btn.text}
                      onChange={(e) => handleButtonChange(idx, 'text', e.target.value)}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                    <input 
                    type="text"
                    placeholder={btn.type === 'URL' ? 'https://...' : 'Phone Number'}
                    value={btn.value}
                    onChange={(e) => handleButtonChange(idx, 'value', e.target.value)}
                    className="p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  </div>
                </div>
              ))}
              {formData.buttons.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100">
                  No buttons added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="space-y-6">
          <label className="text-sm font-bold text-slate-700 px-2 uppercase tracking-wider block">Live Preview</label>
          <div className="sticky top-8 space-y-6">
            <div className="relative mx-auto w-full max-w-[320px]">
              {/* WhatsApp Mockup */}
              <div className="bg-[#E5DDD5] rounded-[2rem] p-4 shadow-2xl border-[8px] border-slate-900 min-h-[500px] flex flex-col pt-8">
                <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4 relative">
                  <p className="text-slate-800 whitespace-pre-wrap leading-relaxed text-sm">
                    {formData.content || "Your message will appear here..."}
                  </p>
                  
                  {formData.buttons.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {formData.buttons.map((btn, idx) => (
                        <button 
                          key={idx}
                          type="button"
                          onClick={() => {
                            if(btn.type === 'URL') window.open(btn.value, '_blank');
                            else alert(`Calling ${btn.value}...`);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-emerald-600 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg font-semibold text-sm transition-all"
                        >
                          <ExternalLink size={14} />
                          {btn.text || "Button Text"}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white rotate-45 rounded-sm"></div>
                </div>
              </div>
            </div>

             <button 
                type="submit"
                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
             >
               <Save size={20} />
               Create Template
             </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplate;
