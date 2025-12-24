
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TextTool from './components/TextTool';
import ImageTool from './components/ImageTool';
import VoiceTool from './components/VoiceTool';
import { ToolType } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const data = [
    { name: 'Reasoning', value: 98, color: '#6366f1' },
    { name: 'Creativity', value: 92, color: '#06b6d4' },
    { name: 'Speed', value: 99, color: '#10b981' },
    { name: 'Accuracy', value: 95, color: '#f59e0b' },
    { name: 'Vision', value: 88, color: '#d946ef' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-4xl font-extrabold tracking-tight mb-2">Multiverse Dashboard</h2>
        <p className="text-slate-400 text-lg">System-wide performance overview and AI capability metrics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            🚀 Model Capability Benchmark
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-slate-700/50">
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Neural Nodes</h4>
            <div className="space-y-4">
              {[
                { label: 'Gemini 3 Flash', desc: 'Active - Optimal', color: 'bg-indigo-500' },
                { label: 'Gemini 2.5 Flash Image', desc: 'Standby - Ready', color: 'bg-cyan-500' },
                { label: 'Gemini 2.5 Flash Native', desc: 'Calibrating', color: 'bg-emerald-500' },
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${node.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                  <div>
                    <p className="font-bold text-sm">{node.label}</p>
                    <p className="text-xs text-slate-500">{node.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 border border-slate-700/50 bg-gradient-to-br from-indigo-900/20 to-transparent">
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Quick Insights</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Gemini 3 Pro performance shows a 15% increase in multi-turn reasoning efficiency over previous versions.
            </p>
            <button className="mt-4 text-indigo-400 text-xs font-bold hover:underline">View Full Logs →</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tokens Processed', val: '42.8M', trend: '+12%' },
          { label: 'Avg Latency', val: '240ms', trend: '-18%' },
          { label: 'Success Rate', val: '99.9%', trend: 'Stable' },
          { label: 'Total Projects', val: '1,204', trend: '+42' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-5 border border-slate-700/50">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{stat.val}</span>
              <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-400' : stat.trend.startsWith('-') ? 'text-cyan-400' : 'text-slate-400'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('dashboard');

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard': return <Dashboard />;
      case 'text': return <TextTool />;
      case 'image': return <ImageTool />;
      case 'voice': return <VoiceTool />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTool={activeTool} setActiveTool={setActiveTool}>
      {renderTool()}
    </Layout>
  );
};

export default App;
