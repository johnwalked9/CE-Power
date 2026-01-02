import React, { memo } from 'react';
import { Tab, Language } from '../types';
import { Zap, Palette, Menu, X, ClipboardList, Globe, Phone } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Optimization: Memoize Layout to prevent re-renders when internal child state changes
export const Layout: React.FC<LayoutProps> = memo(({ children, activeTab, onTabChange, language, setLanguage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  const t = TRANSLATIONS[language];

  const navItems = [
    { id: Tab.PRODUCTS, label: t.nav.products, icon: Zap },
    { id: Tab.STUDIO, label: t.nav.studio, icon: Palette },
    { id: Tab.TASKS, label: t.nav.tasks, icon: ClipboardList },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'am', label: 'Amharic' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ti', label: 'Tigrinya' },
    { code: 'om', label: 'Oromiffa' },
  ];

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* 
        Optimization: 
        1. transform: translate3d(0,0,0) promotes this layer to the GPU.
        2. will-change hints browsers to optimize for transform changes.
      */}
      <div 
        className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none"
        style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse will-change-transform"></div>
        <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[80px] will-change-transform"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] will-change-transform"></div>
      </div>

      {/* Floating Header */}
      <div className="px-4 pt-4 z-50 sticky top-0">
        <header className="max-w-7xl mx-auto rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-blue-500/80 to-cyan-400/80 p-2 rounded-full backdrop-blur-sm shadow-lg shadow-blue-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-wide drop-shadow-sm leading-none">
                  CE <span className="font-light">Generator & Pump</span>
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] md:text-xs font-mono text-blue-300">0966330309</span>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-1 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/20 backdrop-blur-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              {/* Language Selector Desktop */}
              <div className="relative ml-4">
                 <button 
                   onClick={() => setLangMenuOpen(!langMenuOpen)}
                   className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                 >
                   <Globe className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase">{language}</span>
                 </button>
                 {langMenuOpen && (
                   <>
                   <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)}></div>
                   <div className="absolute right-0 top-full mt-2 w-32 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20 flex flex-col p-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangMenuOpen(false);
                          }}
                          className={`text-left px-4 py-2 text-sm rounded-xl transition-colors ${language === lang.code ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                   </div>
                   </>
                 )}
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-slate-300 hover:bg-white/10 rounded-full transition-colors"
              >
                 <Globe className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-slate-300 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Language Menu */}
          {langMenuOpen && (
             <div className="absolute top-20 right-4 w-40 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 flex flex-col gap-1 shadow-2xl z-50 animate-in slide-in-from-top-2">
                 {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`text-left px-4 py-3 text-sm rounded-xl transition-colors font-medium ${language === lang.code ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
             </div>
          )}

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 right-0 mx-4 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
               {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-600/30 text-blue-100 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </header>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
});