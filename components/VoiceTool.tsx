
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getAIClient, decodeBase64, encodeBase64, decodeAudioBuffer } from '../services/gemini';
import { Modality, LiveServerMessage } from '@google/genai';

const VoiceTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    try {
      setStatus('Initializing Neural Link...');
      const ai = getAIClient();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outAudioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a helpful and articulate voice assistant in the Nexus AI Multiverse. Keep responses concise and engaging for a voice conversation.',
        },
        callbacks: {
          onopen: () => {
            setStatus('Active');
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const b64 = encodeBase64(new Uint8Array(int16.buffer));
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: b64, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const b64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (b64Audio && outAudioContextRef.current) {
              const ctx = outAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioData = decodeBase64(b64Audio);
              const buffer = await decodeAudioBuffer(audioData, ctx, 24000, 1);
              
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            setStatus('Error occurred');
          },
          onclose: () => {
            setStatus('Closed');
            setIsActive(false);
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed to access microphone');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (outAudioContextRef.current) outAudioContextRef.current.close();
    
    setIsActive(false);
    setStatus('Standby');
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-3xl font-bold mb-2">Echo Hub</h2>
        <p className="text-slate-400">Real-time voice interaction via Gemini Live API.</p>
      </header>

      <div className="glass rounded-2xl p-12 border border-slate-700/50 flex flex-col items-center justify-center gap-10 min-h-[400px]">
        <div className="relative">
          {isActive && (
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping scale-150" />
          )}
          <button
            onClick={isActive ? stopSession : startSession}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
            }`}
          >
            {isActive ? '⏹️' : '🎙️'}
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="text-xl font-bold">{isActive ? 'Listening...' : 'Ready to Talk'}</div>
          <p className={`text-sm uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
            {status}
          </p>
        </div>

        <div className="w-full max-w-md bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-bold mb-2 text-center">Connection Metrics</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Model:</span>
              <span className="text-indigo-400">Gemini 2.5 Flash</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Latency:</span>
              <span className="text-emerald-400">Low</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          Live Session Info
        </h3>
        <ul className="space-y-2 text-sm text-slate-400 list-disc pl-5">
          <li>Supports interruptible voice conversations.</li>
          <li>Uses raw PCM audio streams for minimal latency.</li>
          <li>Proprietary decoding for real-time human-like responses.</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceTool;
