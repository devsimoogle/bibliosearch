import React, { useState, useEffect } from 'react';
import { LibraryIcon, SearchIcon, SparklesIcon } from './Icons';

const LOADING_STEPS = [
  "Accessing Global Archives...",
  "Consulting Semantic Index...",
  "Cross-Referencing Citations...",
  "Synthesizing Knowledge...",
  "Verifying Sources...",
  "Formatting Abstract..."
];

export const BeautifulLoader = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 relative overflow-hidden bg-parchment">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-library-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Main Animation Container */}
      <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
        {/* Core Logo */}
        <div className="absolute inset-0 bg-white rounded-full shadow-2xl flex items-center justify-center z-20 animate-scale-pulse">
           <LibraryIcon className="w-12 h-12 text-library-900" />
        </div>
        
        {/* Orbiting Rings */}
        <div className="absolute inset-[-10px] border-2 border-dashed border-amber-400/50 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-[-24px] border border-library-300/30 rounded-full animate-reverse-spin"></div>
        
        {/* Orbiting Particles */}
        <div className="absolute inset-0 animate-spin-slow z-10">
           <div className="absolute -top-6 left-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2"></div>
        </div>
        <div className="absolute inset-0 animate-reverse-spin z-10">
           <div className="absolute -bottom-8 left-1/2 w-3 h-3 bg-library-600 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2"></div>
        </div>
      </div>

      {/* Text Cycle */}
      <div className="z-10 text-center space-y-3">
        <h2 className="text-2xl font-serif font-bold text-library-900 animate-fade-in tracking-wide">
          BiblioSearch AI
        </h2>
        <div className="h-8 overflow-hidden">
           <p key={textIndex} className="text-amber-700 font-medium font-mono text-sm uppercase tracking-widest animate-slide-up">
             {LOADING_STEPS[textIndex]}
           </p>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-library-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-library-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-library-400 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => <BeautifulLoader />;
export const LoadingOverlay = ({ message }: { message?: string }) => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-xl">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-200 border-t-amber-600 mb-4"></div>
    {message && <p className="text-library-800 font-serif font-bold animate-pulse">{message}</p>}
  </div>
);
