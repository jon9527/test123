
import React, { useState } from 'react';
import { generateImage } from '../services/gemini';
import { GeneratedImage } from '../types';

const ImageTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const url = await generateImage(prompt);
      const newImg: GeneratedImage = {
        url,
        prompt,
        timestamp: Date.now()
      };
      setGallery(prev => [newImg, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-bold mb-2">Pixel Lab</h2>
        <p className="text-slate-400">Generate stunning visuals with Gemini 2.5 Flash Image.</p>
      </header>

      <div className="glass rounded-2xl p-8 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Visual Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with floating gardens, cinematic lighting, 8k resolution..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 h-32 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
            />
          </div>
          <div className="flex md:flex-col justify-end gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Manifesting...' : 'Generate Image'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="aspect-square glass rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-500 animate-pulse">Rendering Reality...</p>
          </div>
        )}
        {gallery.map((img, i) => (
          <div key={i} className="group relative glass rounded-2xl overflow-hidden border border-slate-700/50 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
            <img src={img.url} alt={img.prompt} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
              <p className="text-sm text-slate-200 line-clamp-3 mb-2">{img.prompt}</p>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = img.url;
                  link.download = `nexus-ai-${img.timestamp}.png`;
                  link.click();
                }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium self-start transition-colors"
              >
                Download PNG
              </button>
            </div>
          </div>
        ))}
        {gallery.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-slate-500">
            <div className="text-6xl mb-4 grayscale opacity-30">🖼️</div>
            <p>Generated images will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTool;
