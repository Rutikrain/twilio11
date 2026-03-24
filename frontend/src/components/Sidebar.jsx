import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Send, Settings, LogOut, MessageSquareMore } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Templates', path: '/templates', icon: FileText },
    { name: 'Create Template', path: '/create-template', icon: MessageSquareMore },
    { name: 'Send Message', path: '/send-message', icon: Send },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <MessageSquareMore size={20} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Twilio SaaS
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm shadow-emerald-100/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
