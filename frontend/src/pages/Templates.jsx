import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Filter, MoreVertical, ExternalLink, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../api';

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/templates`);
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`${API_URL}/templates/${id}`);
      fetchTemplates();
      setOpenMenuId(null);
    } catch (err) {
      alert('Failed to delete template');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Message Templates</h2>
          <p className="text-slate-500">Create and manage your WhatsApp message templates.</p>
        </div>
        <Link 
          to="/create-template"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          New Template
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            <Filter size={20} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Template Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="animate-spin text-emerald-600" size={24} />
                       Loading templates...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="max-w-md mx-auto p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100 space-y-3">
                      <p className="font-bold text-lg">Connection Error</p>
                      <p className="text-sm opacity-90">{error}</p>
                      <div className="pt-4 flex flex-col items-center gap-3">
                        <button 
                          onClick={fetchTemplates}
                          className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all font-sans"
                        >
                          Retry Connection
                        </button>
                        <p className="text-[10px] text-red-400 max-w-xs">
                          If this persist, please ensure your MongoDB Atlas IP Access List allows connections from Render (0.0.0.0/0).
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : templates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No templates found. Create one to get started!</td>
                </tr>
              ) : (
                templates.map((template) => (
                  <tr key={template._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">{template.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                        {template.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(template.status)}`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-2 relative">
                          {(template.status === 'Pending' || template.status === 'Draft') && (
                            <button 
                              onClick={async () => {
                                try {
                                  await axios.post(`${API_URL}/templates/${template._id}/${template.status === 'Draft' ? 'submit' : 'approve'}`);
                                  fetchTemplates();
                                } catch (err) {
                                  alert('Failed to update template status');
                                }
                              }}
                              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm underline px-2 py-1 rounded"
                            >
                              {template.status === 'Draft' ? 'Submit' : 'Approve'}
                            </button>
                          )}
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === template._id ? null : template._id);
                              }}
                              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openMenuId === template._id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={() => setOpenMenuId(null)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                  <button 
                                    onClick={() => navigate(`/edit-template/${template._id}`)}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                  >
                                    <Edit2 size={16} className="text-emerald-500" />
                                    Edit Template
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(template._id)}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    Delete Template
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                       </div>
                     </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Templates;
