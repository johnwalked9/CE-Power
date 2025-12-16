import React, { useState } from 'react';
import { MessageSquare, Mic, X, Cog } from 'lucide-react';
import { GeminiAssistant } from './GeminiAssistant';
import { LiveSession } from './LiveSession';
import { ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AIAssistantOrbProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  language: Language;
}

export const AIAssistantOrb: React.FC<AIAssistantOrbProps> = ({ chatMessages, setChatMessages, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'live'>('live');

  const t = TRANSLATIONS[language];

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveMode('live'); // Default to live when opening
    }
  };

  return (
    <>
      {/* Floating Full Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-2 md:inset-6 z-[100] bg-slate-950/80 backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-95 duration-500 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-20 pointer-events-none">
            {/* Logo Area */}
            <div className="flex items-center gap-3 pointer-events-auto pl-2">
              <div className="bg-blue-600/20 p-2.5 rounded-full border border-blue-500/30 backdrop-blur-md">
                <Cog className="w-6 h-6 text-blue-400 animate-spin-slow" />
              </div>
              <div className="hidden md:block">
                <h2 className="text-white font-bold tracking-wider">CE ASSISTANT</h2>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="pointer-events-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex gap-1 shadow-2xl">
              <button
                onClick={() => setActiveMode('chat')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeMode === 'chat' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> 
                <span className="hidden sm:inline">{t.assistant.textChat}</span>
              </button>
              <button
                onClick={() => setActiveMode('live')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeMode === 'live' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mic className="w-4 h-4" /> 
                <span className="hidden sm:inline">{t.assistant.liveVoice}</span>
              </button>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:rotate-90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full h-full relative">
            {activeMode === 'chat' ? (
              <div className="max-w-4xl mx-auto h-full pt-28 pb-8 px-6">
                 <div className="h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20">
                    <GeminiAssistant messages={chatMessages} setMessages={setChatMessages} language={language} />
                 </div>
              </div>
            ) : (
              <LiveSession language={language} />
            )}
          </div>
        </div>
      )}

      {/* Floating Orb Trigger (Only visible when closed) */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-8 right-8 z-50 group flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 shadow-[0_0_50px_rgba(59,130,246,0.5)] hover:shadow-[0_0_80px_rgba(59,130,246,0.8)] border border-white/30 transition-all duration-500 hover:scale-110 animate-float cursor-pointer"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden">
             {/* Glass shine */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            
            {/* Engine Cog */}
            <Cog className="w-10 h-10 text-white drop-shadow-lg group-hover:rotate-90 transition-transform duration-700 relative z-10" strokeWidth={2} />
            
            {/* Call Center Mic Overlay */}
            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-2.5 border-[3px] border-slate-900 shadow-lg z-20">
                <Mic className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>
      )}
    </>
  );
};