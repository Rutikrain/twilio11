import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_URL}/templates`);
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
      // Fallback dummy data for demo
      setTemplates([
        { _id: '1', name: 'welcome_template', category: 'Marketing', status: 'Approved', language: 'en-US', createdAt: new Date() },
        { _id: '2', name: 'order_update', category: 'Utility', status: 'Pending', language: 'en-US', createdAt: new Date() },
        { _id: '3', name: 'auth_otp', category: 'Authentication', status: 'Rejected', language: 'en-US', createdAt: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSubmit = async (id) => {
    try {
      await axios.post(`${API_URL}/templates/${id}/submit`);
      fetchTemplates();
    } catch (err) {
      alert('Failed to submit template');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Message Templates</h2>
          <p className="text-slate-500">Manage your WhatsApp message templates and approval status.</p>
        </div>
        <Link to="/create-template" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-100">
          <Plus size={20} />
          Create Template
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <button className="px-4 py-2 text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50 rounded-lg border border-slate-200 transition-all">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Template Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((template) => (
                <tr key={template._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{template.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 font-medium">{template.category}</span>
                  </td>
                  <td className="px-6 py-4 uppercase text-slate-600 text-sm">{template.language}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(template.status)}`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       {template.status === 'Draft' && (
                         <button 
                           onClick={() => handleSubmit(template._id)}
                           className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm underline px-2 py-1 rounded"
                         >
                           Submit
                         </button>
                       )}
                       <button className="text-slate-400 hover:text-slate-600 p-1">
                         <MoreVertical size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {templates.length === 0 && !loading && (
            <div className="p-12 text-center text-slate-500 italic">No templates found. Create one to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;
