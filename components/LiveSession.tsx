import React, { useState, useRef, useEffect } from 'react';
import { connectLive } from '../services/geminiService';
import { Mic, PhoneOff, Cog, Wifi, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LiveSessionProps {
  language: Language;
}

export const LiveSession: React.FC<LiveSessionProps> = ({ language }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = TRANSLATIONS[language];
  
  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const liveClientRef = useRef<{ sendAudio: (d: Float32Array) => void; close: () => void } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Clean up on unmount
  useEffect(() => {
    // Auto-start session on mount
    let mounted = true;
    
    const initSession = async () => {
      // Small delay to ensure smooth transition animation
      await new Promise(resolve => setTimeout(resolve, 500));
      if (mounted) {
        await startSession();
      }
    };

    initSession();

    return () => {
      mounted = false;
      stopSession();
    };
  }, []);

  const decodeAudioData = async (
    base64String: string,
    ctx: AudioContext
  ): Promise<AudioBuffer> => {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Manual PCM decode (16-bit, 24kHz mono output from Gemini)
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    if (isConnecting || isConnected) return;
    
    setError(null);
    setIsConnecting(true);

    try {
      // 1. Setup Input Audio (Mic) - 16kHz for Gemini Input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        if (liveClientRef.current) {
          liveClientRef.current.sendAudio(inputData);
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // 2. Setup Output Audio (Speaker) - 24kHz for Gemini Output
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      // Resume context if it was created in suspended state (browser autoplay policy)
      if (outputCtx.state === 'suspended') {
        await outputCtx.resume();
      }
      
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // 3. Connect to Gemini Live
      const client = await connectLive({
        onAudioData: async (base64Audio) => {
          // Play audio chunk
          try {
            if (!outputAudioContextRef.current) return;
            const buffer = await decodeAudioData(base64Audio, outputAudioContextRef.current);
            const sourceNode = outputAudioContextRef.current.createBufferSource();
            sourceNode.buffer = buffer;
            sourceNode.connect(outputAudioContextRef.current.destination);
            
            // Track active sources for interruption handling
            audioSourcesRef.current.add(sourceNode);
            sourceNode.onended = () => {
              audioSourcesRef.current.delete(sourceNode);
            };

            const now = outputAudioContextRef.current.currentTime;
            
            // If the scheduler fell behind (e.g. after interruption reset), snap to now
            if (nextStartTimeRef.current < now) {
              nextStartTimeRef.current = now;
            }

            // Schedule next chunk
            const startTime = Math.max(nextStartTimeRef.current, now);
            sourceNode.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;
          } catch (e) {
            console.error("Audio Playback Error", e);
          }
        },
        onInterrupted: () => {
          console.log("Interruption detected! Stopping audio...");
          // Stop all currently playing audio nodes
          audioSourcesRef.current.forEach((source) => {
            try {
              source.stop();
            } catch (e) {
              // ignore errors if source already stopped
            }
          });
          audioSourcesRef.current.clear();
          // Reset scheduler so new audio starts immediately
          nextStartTimeRef.current = 0;
        },
        onClose: () => {
           setIsConnected(false);
           setIsConnecting(false);
        }
      });

      liveClientRef.current = client;
      setIsConnected(true);

    } catch (err: any) {
      console.error(err);
      setError("Failed to access microphone or connect to API.");
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (liveClientRef.current) {
      liveClientRef.current.close();
      liveClientRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    audioSourcesRef.current.clear();
    setIsConnected(false);
    setIsConnecting(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep radial gradient */}
        <div className="absolute inset-0 bg-radial-at-c from-slate-900 via-slate-950 to-black"></div>
        
        {/* Animated fluid waves - darker and more subtle */}
        <div className={`absolute bottom-[-50%] left-0 w-[200%] h-[150%] bg-blue-900/10 rounded-[40%] animate-wave blur-[100px] ${isConnected ? 'opacity-100' : 'opacity-30'}`}></div>
        <div className={`absolute bottom-[-50%] left-[-20%] w-[200%] h-[150%] bg-indigo-900/10 rounded-[35%] animate-wave blur-[80px] animation-delay-2000 ${isConnected ? 'opacity-100' : 'opacity-30'}`} style={{animationDelay: '-2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center gap-12">
        
        {/* Main Status Area */}
        <div className="text-center space-y-6">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-mono uppercase tracking-widest transition-all ${isConnected ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
            <Wifi className={`w-3 h-3 ${isConnected ? 'animate-pulse' : ''}`} />
            {isConnected ? t.live.connectionActive : (isConnecting ? 'Connecting...' : t.live.standby)}
          </div>
          
          <h1 className={`text-4xl md:text-7xl font-black tracking-tighter transition-colors duration-500 ${isConnected ? 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500'}`}>
            {isConnected ? t.live.listening : (isConnecting ? "Initializing..." : "Engine Expert")}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
            {isConnected 
              ? t.live.desc_listening 
              : t.live.desc_standby}
          </p>
        </div>

        {/* Central Visualization */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
          {/* Outer glow rings */}
          {(isConnected || isConnecting) && (
             <>
               <div className={`absolute inset-0 bg-blue-500/10 rounded-full blur-[80px] ${isConnected ? 'animate-pulse' : ''}`}></div>
               <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             </>
          )}
          
          {/* Main Gear - Scaled Up */}
          <div className="relative z-10 transition-transform duration-700 hover:scale-105">
            <Cog 
              className={`w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl transition-all duration-1000 ${isConnected || isConnecting ? 'animate-spin text-blue-100 opacity-90' : 'animate-spin-slow text-slate-700 opacity-50'}`} 
              strokeWidth={0.5}
            />
            
            {/* Inner Core */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className={`w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner transition-all duration-500 ${isConnected || isConnecting ? 'bg-blue-600/20' : 'bg-slate-900/50'}`}>
                  {isConnecting ? (
                     <Loader2 className="w-12 h-12 text-blue-300 animate-spin" />
                  ) : isConnected ? (
                    /* Equalizer Simulation */
                    <div className="flex items-center justify-center gap-1.5 h-16 w-16">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className="w-1.5 bg-blue-400 rounded-full animate-equalizer"
                          style={{ animationDelay: `${i * 0.1}s`, animationDuration: `${0.8 + Math.random() * 0.5}s` }}
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <Mic className="w-12 h-12 text-slate-500" />
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4 z-20">
          {error && (
            <div className="animate-in fade-in slide-in-from-bottom-2 text-red-400 bg-red-950/30 px-6 py-3 rounded-2xl border border-red-500/30 text-sm mb-4 backdrop-blur-md">
              {error}
            </div>
          )}

          {!isConnecting && (
            <button
              onClick={isConnected ? stopSession : startSession}
              className={`group relative px-12 py-6 rounded-full font-bold text-lg uppercase tracking-widest transition-all duration-500 transform hover:scale-105 active:scale-95 ${
                isConnected 
                  ? 'bg-red-600/90 hover:bg-red-500 text-white shadow-[0_0_50px_rgba(220,38,38,0.5)]' 
                  : 'bg-white text-slate-900 hover:bg-blue-50 shadow-[0_0_50px_rgba(255,255,255,0.2)]'
              }`}
            >
              <div className="flex items-center gap-4">
                {isConnected ? (
                  <>
                    <PhoneOff className="w-6 h-6" /> 
                    <span>{t.live.end}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 group-hover:animate-bounce" /> 
                    <span>{t.live.start}</span>
                  </>
                )}
              </div>
              
              {/* Button Glint */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[shimmer_3s_infinite]"></div>
              </div>
            </button>
          )}
          
          {(!isConnected && !isConnecting) && (
             <p className="text-slate-500 text-sm">{t.live.desc_standby}</p>
          )}
        </div>
      </div>
    </div>
  );
};