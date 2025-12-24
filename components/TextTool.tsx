
import React, { useState } from 'react';
import { generateText } from '../services/gemini';
import { ChatMessage } from '../types';

const TextTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateText(input);
      setMessages(prev => [...prev, { role: 'model', content: response || "No response" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Error: Failed to fetch response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-bold mb-2">Text Forge</h2>
        <p className="text-slate-400">Harness Gemini 3 Flash for intelligent dialogue and creative tasks.</p>
      </header>

      <div className="flex-1 glass rounded-2xl p-6 flex flex-col gap-4 overflow-hidden border border-slate-700/50 min-h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
              <span className="text-6xl">🤖</span>
              <p>The neural canvas is empty. Start a conversation.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-75" />
                <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-150" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default TextTool;
