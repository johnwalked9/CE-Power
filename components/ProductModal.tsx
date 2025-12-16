import React from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, CheckCircle, Zap, Box, Wind, Droplets, Volume2, Maximize2, ImageOff } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  language: Language;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content - Transparent Glass */}
      <div className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full transition-colors border border-white/5 group"
        >
          <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-72 md:h-auto relative bg-black/20 flex items-center justify-center overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
            className="w-full h-full object-cover"
          />
           <div className="hidden flex flex-col items-center text-slate-500">
              <ImageOff className="w-12 h-12 mb-2" />
              <span className="text-sm">{t.products.unavailable}</span>
           </div>
           
           {/* Gradients to blend image into glass */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent md:bg-gradient-to-r pointer-events-none"></div>
          
          <div className="absolute bottom-8 left-8 pointer-events-none drop-shadow-md">
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{product.name}</h2>
            <div className="inline-block bg-blue-600/80 backdrop-blur-md text-white text-sm font-bold px-4 py-1.5 rounded-full border border-blue-400/20 shadow-lg">
              {product.brand}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-blue-300 mb-3 border-b border-white/10 pb-2 uppercase tracking-wider text-xs">{t.modal.description}</h3>
            <p className="text-slate-200 leading-loose text-sm font-light">
              {product.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-300 mb-4 border-b border-white/10 pb-2 uppercase tracking-wider text-xs">{t.modal.specifications}</h3>
            <div className="grid grid-cols-2 gap-3">
              <SpecItem icon={Zap} label={t.modal.maxPower} value={product.specs.maxPower} />
              <SpecItem icon={CheckCircle} label={t.modal.pf} value={product.specs.powerFactor} />
              <SpecItem icon={Wind} label={t.modal.cooling} value={product.specs.cooling} />
              <SpecItem icon={Droplets} label={t.modal.fuel} value={product.specs.fuelConsumption} />
              <SpecItem icon={Volume2} label={t.modal.noise} value={product.specs.noiseLevel} />
              <SpecItem icon={Box} label={t.modal.phase} value={product.specs.phase} />
              <SpecItem icon={Maximize2} label={t.modal.dimensions} value={product.specs.dimensions} />
              <SpecItem icon={Box} label={t.modal.weight} value={product.specs.weight} />
            </div>
          </div>
          
          <div className="pt-2">
             <button className="w-full bg-blue-600/80 hover:bg-blue-500/80 backdrop-blur-sm border border-blue-400/20 text-white font-bold py-4 rounded-full transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_50px_rgba(37,99,235,0.4)] hover:scale-[1.02]">
               {t.modal.requestQuote}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
      <Icon className="w-3 h-3 text-blue-400" />
      {label}
    </div>
    <div className="text-sm font-medium text-slate-200 pl-5">
      {value}
    </div>
  </div>
);