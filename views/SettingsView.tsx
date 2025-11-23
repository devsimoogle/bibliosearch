
import React, { useState, useEffect } from 'react';
import * as db from '../services/databaseService';
import { LLMConfig, AIModel } from '../types';
import { SettingsIcon, XIcon, KeyIcon, CpuIcon, CheckCircleIcon, ServerIcon, ChipIcon, LightningIcon } from '../components/Icons';

export const SettingsView = ({ onClose }: { onClose: () => void }) => {
  const [config, setConfig] = useState<LLMConfig>(db.getLLMConfig());
  const [activeTab, setActiveTab] = useState<'MODELS' | 'KEYS'>('MODELS');

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateLLMConfig({ apiKeys: config.apiKeys });
    alert("API Keys saved securely.");
  };

  const selectModel = (modelId: string) => {
    setConfig(prev => ({ ...prev, activeModelId: modelId }));
    db.updateLLMConfig({ activeModelId: modelId });
  };

  const getProviderIcon = (provider: string) => {
    switch(provider) {
      case 'google': return <ServerIcon className="w-5 h-5 text-blue-500"/>;
      case 'groq': return <ChipIcon className="w-5 h-5 text-orange-500"/>;
      case 'sambanova': return <CpuIcon className="w-5 h-5 text-purple-500"/>;
      case 'openrouter': return <LightningIcon className="w-5 h-5 text-yellow-500"/>;
      default: return <ServerIcon className="w-5 h-5 text-gray-500"/>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-library-900 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <SettingsIcon className="w-6 h-6 text-amber-500" />
             <h2 className="text-xl font-serif font-bold">System Configuration</h2>
          </div>
          <button onClick={onClose} className="hover:text-amber-400"><XIcon className="w-6 h-6"/></button>
        </div>

        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('MODELS')} 
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider ${activeTab === 'MODELS' ? 'text-library-900 border-b-4 border-amber-500 bg-amber-50' : 'text-gray-400'}`}
          >
            AI Processors
          </button>
          <button 
            onClick={() => setActiveTab('KEYS')} 
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider ${activeTab === 'KEYS' ? 'text-library-900 border-b-4 border-amber-500 bg-amber-50' : 'text-gray-400'}`}
          >
            API Credentials
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-library-50">
          {activeTab === 'MODELS' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Select the AI inference engine for search and synthesis. Note: Non-Google models require a Tavily API key for web access.</p>
              <div className="grid grid-cols-1 gap-3">
                {db.AVAILABLE_MODELS.map((model) => (
                  <div 
                    key={model.id}
                    onClick={() => selectModel(model.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${config.activeModelId === model.id ? 'border-amber-500 bg-white shadow-md' : 'border-gray-200 bg-white/50 hover:bg-white'}`}
                  >
                    <div className="bg-gray-100 p-3 rounded-full">{getProviderIcon(model.provider)}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{model.name}</h3>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-1">{model.provider} {model.requiresTavily && '• Uses Tavily'}</p>
                    </div>
                    {config.activeModelId === model.id && <CheckCircleIcon className="w-6 h-6 text-amber-500" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'KEYS' && (
            <form onSubmit={handleSaveKeys} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4">
                Keys are stored securely in your browser's LocalStorage. They are never sent to our servers, only directly to the AI providers.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Google Gemini API Key</label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                  <input 
                    type="password" 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="AIza..." 
                    value={config.apiKeys.google || ''}
                    onChange={(e) => setConfig({...config, apiKeys: {...config.apiKeys, google: e.target.value}})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tavily Search API Key <span className="text-amber-600">(Required for Groq/Mistral)</span></label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                  <input 
                    type="password" 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="tvly-..." 
                    value={config.apiKeys.tavily || ''}
                    onChange={(e) => setConfig({...config, apiKeys: {...config.apiKeys, tavily: e.target.value}})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-bold text-gray-700 mb-4">Provider Specific Keys</h4>
                {['groq', 'sambanova', 'mistral', 'nebius', 'openrouter'].map((provider) => (
                  <div key={provider} className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{provider} API Key</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                      placeholder={`Key for ${provider}...`}
                      // @ts-ignore
                      value={config.apiKeys[provider] || ''}
                      // @ts-ignore
                      onChange={(e) => setConfig({...config, apiKeys: {...config.apiKeys, [provider]: e.target.value}})}
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-library-800 text-white py-3 rounded-xl font-bold hover:bg-library-900 transition-colors">
                Save Securely
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
