import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save, X, Info, Plus, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

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

  const addButton = () => {
    setFormData({
      ...formData,
      buttons: [...formData.buttons, { type: 'URL', text: '', value: '' }]
    });
  };

  const removeButton = (index) => {
    const newButtons = [...formData.buttons];
    newButtons.splice(index, 1);
    setFormData({ ...formData, buttons: newButtons });
  };

  const handleButtonChange = (index, field, value) => {
    const newButtons = [...formData.buttons];
    newButtons[index][field] = value;
    setFormData({ ...formData, buttons: newButtons });
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
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium px-4 py-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <X size={20} />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Template Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. welcome_new_user"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                required
              />
              <p className="text-xs text-slate-400">Use lowercase and underscores only.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option>Marketing</option>
                  <option>Utility</option>
                  <option>Authentication</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Language</label>
                <select 
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="hi-IN">Hindi</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                <span>Message Content</span>
                <span className="text-xs font-normal text-slate-400 italic flex items-center gap-1">
                  <Info size={12} /> Use {"{{1}}"}, {"{{2}}"} for variables
                </span>
              </label>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                placeholder="Hello {{1}}, welcome to our service! Your order #{{2}} is ready."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                required
              ></textarea>
            </div>
          </div>

          {/* Interactive Buttons Component */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Interactive Buttons</h3>
              <button 
                type="button"
                onClick={addButton}
                className="text-emerald-600 font-semibold text-sm flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Button
              </button>
            </div>
            
            {formData.buttons.map((btn, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl items-start group">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <select 
                    value={btn.type}
                    onChange={(e) => handleButtonChange(idx, 'type', e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="URL">URL Link</option>
                    <option value="PHONE_NUMBER">Phone Call</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Label e.g. View Order"
                    value={btn.text}
                    onChange={(e) => handleButtonChange(idx, 'text', e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="URL or Phone"
                    value={btn.value}
                    onChange={(e) => handleButtonChange(idx, 'value', e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => removeButton(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {formData.buttons.length === 0 && (
              <p className="text-sm text-slate-400 italic text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
                No buttons added yet. Click 'Add Button' to include Call to Action or Links.
              </p>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="sticky top-8">
             <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Live Preview</h3>
             <div className="bg-[#e5ddd5] p-3 rounded-2xl shadow-xl w-full max-w-[300px] border-[6px] border-slate-800">
               <div className="bg-white p-3 rounded-lg shadow-sm space-y-2 relative after:content-[''] after:absolute after:left-[-8px] after:top-2 after:border-[8px] after:border-transparent after:border-r-white">
                 <p className="text-xs text-slate-800 whitespace-pre-wrap break-words leading-relaxed">
                   {formData.content || 'Your message will appear here...'}
                 </p>
                 <div className="flex justify-end">
                   <span className="text-[10px] text-slate-400 uppercase">12:00 PM</span>
                 </div>
               </div>
               
               {formData.buttons.map((btn, idx) => (
                 <div key={idx} className="mt-2 text-center bg-white/90 backdrop-blur py-2 rounded-lg text-emerald-600 text-sm font-semibold flex items-center justify-center gap-2 cursor-default border-t border-slate-100">
                   {btn.text || 'Button Label'}
                   {btn.type === 'URL' && <ExternalLink size={12} />}
                 </div>
               ))}
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
