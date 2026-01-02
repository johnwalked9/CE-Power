import React, { useState, useRef, useEffect } from 'react';
import { connectLive } from '../services/geminiService';
import { Mic, PhoneOff, Cog, Wifi, Loader2, Phone, Copy, Check, X as XIcon } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LiveSessionProps { language: Language; }

export const LiveSession: React.FC<LiveSessionProps> = ({ language }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContactToast, setShowContactToast] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const t = TRANSLATIONS[language];
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const liveClientRef = useRef<{ sendAudio: (d: Float32Array) => void; close: () => void } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBufferRef = useRef<string>("");

  // Speed adjusted to 1.1x as per user request
  const SPEECH_SPEED = 1.1;

  useEffect(() => {
    let mounted = true;
    const initSession = async () => {
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

      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      if (outputCtx.state === 'suspended') {
        await outputCtx.resume();
      }
      outputAudioContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      const client = await connectLive({
        onAudioData: async (base64Audio) => {
          try {
            if (!outputAudioContextRef.current) return;
            const buffer = await decodeAudioData(base64Audio, outputAudioContextRef.current);
            const sourceNode = outputAudioContextRef.current.createBufferSource();
            sourceNode.buffer = buffer;
            
            // Apply 1.1x technical speed increase
            sourceNode.playbackRate.value = SPEECH_SPEED;
            
            sourceNode.connect(outputAudioContextRef.current.destination);
            audioSourcesRef.current.add(sourceNode);
            sourceNode.onended = () => {
              audioSourcesRef.current.delete(sourceNode);
            };
            const now = outputAudioContextRef.current.currentTime;
            if (nextStartTimeRef.current < now) {
              nextStartTimeRef.current = now;
            }
            const startTime = Math.max(nextStartTimeRef.current, now);
            sourceNode.start(startTime);
            
            // Adjust the next start time based on the modified playback duration
            const effectiveDuration = buffer.duration / SPEECH_SPEED;
            nextStartTimeRef.current = startTime + effectiveDuration;
          } catch (e) {
            console.error("Audio Playback Error", e);
          }
        },
        onTranscription: (text) => {
          transcriptionBufferRef.current += text;
          const normalized = transcriptionBufferRef.current.replace(/\s/g, '');
          if (
            normalized.includes('966330309') || 
            normalized.includes('0966330309') ||
            normalized.includes('ዜሮዘጠኝስልሳስድስትሰላሳሶስትዜሮሶስትዜሮዘጠኝ')
          ) {
            setShowContactToast(true);
            transcriptionBufferRef.current = ""; 
            setTimeout(() => setShowContactToast(false), 12000);
          }
        },
        onInterrupted: () => {
          audioSourcesRef.current.forEach((source) => {
            try { source.stop(); } catch (e) {}
          });
          audioSourcesRef.current.clear();
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
    setShowContactToast(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('0966330309');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Contact Number Toast Popup */}
      {showContactToast && (
        <div className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-4 animate-in slide-in-from-top-8 duration-500">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-5 relative overflow-hidden group ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none"></div>
            
            <button 
              onClick={() => setShowContactToast(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-400/30 mb-1">
              <Phone className="w-7 h-7 text-blue-400 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Direct Contact</p>
              <h4 className="text-4xl font-black text-white tracking-tighter select-all">9 66 33 03 09</h4>
              <p className="text-xs text-slate-400 font-light mt-2">Available for sales & technical support</p>
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold text-white transition-all active:scale-95 shadow-xl shadow-blue-900/20"
            >
              {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Number Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>
      )}

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-radial-at-c from-slate-900 via-slate-950 to-black"></div>
        <div className={`absolute bottom-[-50%] left-0 w-[200%] h-[150%] bg-blue-900/10 rounded-[40%] animate-wave blur-[100px] ${isConnected ? 'opacity-100' : 'opacity-30'}`}></div>
        <div className={`absolute bottom-[-50%] left-[-20%] w-[200%] h-[150%] bg-indigo-900/10 rounded-[35%] animate-wave blur-[80px] animation-delay-2000 ${isConnected ? 'opacity-100' : 'opacity-30'}`} style={{animationDelay: '-2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center gap-12">
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

        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
          {(isConnected || isConnecting) && (
             <>
               <div className={`absolute inset-0 bg-blue-500/10 rounded-full blur-[80px] ${isConnected ? 'animate-pulse' : ''}`}></div>
               <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             </>
          )}
          
          <div className="relative z-10 transition-transform duration-700 hover:scale-105">
            <Cog 
              className={`w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl transition-all duration-1000 ${isConnected || isConnecting ? 'animate-spin text-blue-100 opacity-90' : 'animate-spin-slow text-slate-700 opacity-50'}`} 
              strokeWidth={0.5}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
               <div className={`w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner transition-all duration-500 ${isConnected || isConnecting ? 'bg-blue-600/20' : 'bg-slate-900/50'}`}>
                  {isConnecting ? (
                     <Loader2 className="w-12 h-12 text-blue-300 animate-spin" />
                  ) : isConnected ? (
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