import React, { useState, useMemo } from 'react';
import { Tab, ChatMessage, Language } from './types';
import { Layout } from './components/Layout';
import { ProductList } from './components/ProductList';
import { ImageStudio } from './components/ImageStudio';
import { TaskManager } from './components/TaskManager';
import { AIAssistantOrb } from './components/AIAssistantOrb';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PRODUCTS);
  const [language, setLanguage] = useState<Language>('en');
  
  // Optimization: Lift chat state so it persists between tab switches/orb toggles
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI assistant for CE Generators and Pumps. Ask me anything about our products in English, Amharic, Chinese, Tigrinya, or Oromifa.' }
  ]);

  // Optimization: Memoize the tab content to prevent unnecessary re-renders of inactive components
  const content = useMemo(() => {
    switch (activeTab) {
      case Tab.PRODUCTS:
        return <ProductList language={language} />;
      case Tab.STUDIO:
        return <ImageStudio language={language} />;
      case Tab.TASKS:
        return <TaskManager language={language} />;
      default:
        return <ProductList language={language} />;
    }
  }, [activeTab, language]);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} language={language} setLanguage={setLanguage}>
      <main className="w-full h-full flex flex-col relative">
        {content}
      </main>
      
      {/* Floating Assistant Orb (Persistent Overlay) */}
      <AIAssistantOrb chatMessages={chatMessages} setChatMessages={setChatMessages} language={language} />
    </Layout>
  );
}