
import React from 'react';
import { ToolType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTool, setActiveTool }) => {
  const navItems: { id: ToolType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: '📊' },
    { id: 'text', label: 'Text Forge', icon: '✍️' },
    { id: 'image', label: 'Pixel Lab', icon: '🎨' },
    { id: 'voice', label: 'Echo Hub', icon: '🎙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-slate-200">
      {/* Sidebar */}
      <nav className="w-full md:w-64 glass md:h-screen p-6 flex flex-col gap-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
            🌀
          </div>
          <h1 className="text-xl font-bold tracking-tight gradient-text">Nexus AI</h1>
        </div>

        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                activeTool === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm">Neural Link Active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
