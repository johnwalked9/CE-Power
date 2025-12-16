import React, { useState, memo } from 'react';
import { PRODUCTS, TRANSLATIONS } from '../constants';
import { Product, Language } from '../types';
import { ProductModal } from './ProductModal';
import { Info, Battery, Activity, ImageOff } from 'lucide-react';

interface ProductListProps {
  language: Language;
}

// Optimization: Memoize the list component as it re-renders often during parent updates but its data is static
export const ProductList: React.FC<ProductListProps> = memo(({ language }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<'All' | 'Generator' | 'Pump'>('All');

  const t = TRANSLATIONS[language];

  const filteredProducts = PRODUCTS.filter(
    p => filter === 'All' || p.type === filter
  );

  const getFilterLabel = (f: string) => {
     if(f === 'All') return t.products.all;
     if(f === 'Generator') return t.products.generator;
     if(f === 'Pump') return t.products.pump;
     return f;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-light text-white drop-shadow-lg tracking-tight">{t.products.title}</h2>
        <div className="flex bg-white/5 backdrop-blur-xl rounded-full p-1.5 border border-white/10 shadow-lg">
          {['All', 'Generator', 'Pump'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === f 
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {getFilterLabel(f)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden cursor-pointer hover:border-blue-400/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transform hover:-translate-y-2"
          >
            <div className="aspect-video w-full overflow-hidden bg-black/20 flex items-center justify-center relative m-2 rounded-[1.5rem] mb-0">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 rounded-[1.5rem]"
              />
              <div className="hidden flex flex-col items-center text-slate-500">
                <ImageOff className="w-8 h-8 mb-2" />
                <span className="text-xs">{t.products.unavailable}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors shadow-black drop-shadow-md">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">{product.brand}</p>
                </div>
                <span className="bg-white/10 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 text-slate-200">
                  {product.powerKW} kW
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 mt-2">
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
                  <Battery className="w-3.5 h-3.5 text-blue-400" />
                  {product.specs.phase}
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  {product.specs.cooling}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-blue-300 font-medium group-hover:translate-x-1 transition-transform">
                {t.products.viewDetails} <Info className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          language={language}
        />
      )}
    </div>
  );
});