import React, { useState } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import { Wand2, ImagePlus, Download, RefreshCw, Eraser } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ImageStudioProps {
  language: Language;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ language }) => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = TRANSLATIONS[language];

  // Generation Options
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  
  // Editing Options
  const [sourceImageForEdit, setSourceImageForEdit] = useState<string | null>(null);

  const handleAction = async () => {
    if (!prompt) return;
    setLoading(true);
    setResultImage(null);
    setError(null);

    try {
      let result = '';
      if (mode === 'generate') {
        result = await generateImage(prompt, size);
      } else if (mode === 'edit' && sourceImageForEdit) {
        result = await editImage(sourceImageForEdit, prompt);
      }
      setResultImage(result);
    } catch (e: any) {
      console.error(e);
      let errorMessage = "Failed to process image.";
      if (typeof e === 'string') {
        errorMessage = e;
      } else if (e.message) {
        if (e.message.includes('403') || e.message.includes('PERMISSION_DENIED')) {
          errorMessage = "Permission Denied: Please ensure you have selected a valid API Key with billing enabled for High Quality generation.";
        } else {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImageForEdit(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Controls */}
      <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-full">
            <Wand2 className="text-purple-400 w-5 h-5" />
          </div>
          {t.studio.title}
        </h2>

        <div className="flex bg-black/20 rounded-full p-1.5 mb-8 border border-white/5">
          <button 
            onClick={() => { setMode('generate'); setError(null); }} 
            className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${mode === 'generate' ? 'bg-purple-600/80 text-white shadow-lg backdrop-blur-sm' : 'text-slate-400 hover:text-white'}`}
          >
            {t.studio.generate}
          </button>
          <button 
             onClick={() => { setMode('edit'); setError(null); }} 
             className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${mode === 'edit' ? 'bg-purple-600/80 text-white shadow-lg backdrop-blur-sm' : 'text-slate-400 hover:text-white'}`}
          >
            {t.studio.edit}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">{t.studio.prompt}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'generate' ? "A futuristic silent generator..." : "Remove the background..."}
              className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 h-36 resize-none transition-all placeholder-slate-500"
            />
          </div>

          {mode === 'generate' && (
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">{t.studio.size}</label>
               <div className="relative">
                 <select value={size} onChange={(e: any) => setSize(e.target.value)} className="w-full appearance-none bg-white/5 border border-white/10 rounded-[1.5rem] p-4 px-6 text-white text-sm focus:outline-none focus:border-purple-500/50">
                   <option value="1K" className="bg-slate-900">1K (Standard)</option>
                   <option value="2K" className="bg-slate-900">2K (High Res)</option>
                   <option value="4K" className="bg-slate-900">4K (Ultra)</option>
                 </select>
               </div>
               {size !== '1K' && <p className="text-[10px] text-purple-300 mt-2 ml-2">* Requires billed API key</p>}
             </div>
          )}

          {mode === 'edit' && (
            <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">{t.studio.source}</label>
               <label className="block w-full border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-[2rem] p-6 text-center cursor-pointer transition-colors bg-white/5 hover:bg-white/10">
                 <input type="file" className="hidden" accept="image/*" onChange={handleEditUpload} />
                 {sourceImageForEdit ? (
                    <img src={sourceImageForEdit} className="h-24 mx-auto object-contain rounded-xl shadow-lg" alt="source" />
                 ) : (
                   <div className="text-slate-400 text-sm">
                     <ImagePlus className="w-8 h-8 mx-auto mb-3 opacity-60" />
                     <span className="font-medium">{t.studio.upload}</span>
                   </div>
                 )}
               </label>
            </div>
          )}

          <button
            onClick={handleAction}
            disabled={loading || !prompt || (mode === 'edit' && !sourceImageForEdit)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(147,51,234,0.3)] transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {mode === 'generate' ? t.studio.btnGenerate : t.studio.btnEdit}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center p-8 relative overflow-hidden backdrop-blur-2xl shadow-xl min-h-[500px]">
         {loading && (
           <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
             <div className="text-center">
               <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
               <p className="text-purple-300 animate-pulse font-light tracking-widest uppercase text-sm">Creating Masterpiece...</p>
             </div>
           </div>
         )}
         
         {error ? (
           <div className="text-center max-w-md p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] backdrop-blur-md">
             <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Wand2 className="w-10 h-10 text-red-400" />
             </div>
             <h3 className="text-red-200 font-bold text-xl mb-3">Generation Failed</h3>
             <p className="text-red-300/70 text-sm leading-relaxed">{error}</p>
           </div>
         ) : resultImage ? (
           <div className="relative group max-h-full">
             <img src={resultImage} alt="Result" className="max-w-full max-h-[70vh] rounded-[2rem] shadow-2xl border border-white/10" />
             <a 
               href={resultImage} 
               download="generated-design.png"
               className="absolute top-6 right-6 bg-black/60 hover:bg-black/80 backdrop-blur-xl text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 hover:scale-110 duration-200"
             >
               <Download className="w-6 h-6" />
             </a>
           </div>
         ) : (
           <div className="text-center text-slate-500">
             <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                {mode === 'generate' ? <ImagePlus className="w-14 h-14 opacity-30" /> : <Eraser className="w-14 h-14 opacity-30" />}
             </div>
             <p className="text-xl font-light text-slate-400">{t.studio.placeholder}</p>
           </div>
         )}
      </div>
    </div>
  );
};