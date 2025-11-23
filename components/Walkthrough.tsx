
import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, XIcon, SearchIcon, FilterIcon, BookmarkIcon, SchoolIcon, IdCardIcon } from './Icons';

interface WalkthroughProps {
  onComplete: () => void;
  mode?: 'HOME' | 'RESULTS';
}

export const Walkthrough = ({ onComplete, mode = 'RESULTS' }: WalkthroughProps) => {
  const [step, setStep] = useState(0);

  const homeSteps = [
    {
      title: "Welcome to BiblioSearch",
      desc: "Your intelligent academic discovery engine. Let's get you oriented.",
      icon: <SchoolIcon className="w-10 h-10 text-amber-500" />
    },
    {
      title: "Smart Recommendations",
      desc: "We curate resources based on your University, Department, and Level.",
      icon: <BookmarkIcon className="w-10 h-10 text-amber-500" />
    },
    {
      title: "Scholar Profile",
      desc: "Access your Digital ID Card, History, and Shelf from the top right.",
      icon: <IdCardIcon className="w-10 h-10 text-amber-500" />
    },
    {
      title: "Start Searching",
      desc: "Type any topic to search books, journals, and verify web sources.",
      icon: <SearchIcon className="w-10 h-10 text-amber-500" />
    }
  ];

  const resultSteps = [
    {
      title: "The Stacks",
      desc: "We found relevant academic materials for your query.",
      icon: <SearchIcon className="w-10 h-10 text-amber-500" />
    },
    {
      title: "Refine Your Search",
      desc: "Use filters to narrow down by Publication Year or Resource Type.",
      icon: <FilterIcon className="w-10 h-10 text-amber-500" />
    },
    {
      title: "Knowledge Synthesis",
      desc: "Read a consolidated summary of the topic before diving into specific books.",
      icon: <BookmarkIcon className="w-10 h-10 text-amber-500" />
    },
    {
      title: "Save to Shelf",
      desc: "Click the bookmark icon on any book to save it for later citation.",
      icon: <BookmarkIcon className="w-10 h-10 text-amber-500" />
    }
  ];

  const steps = mode === 'HOME' ? homeSteps : resultSteps;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative mx-4 border border-library-100">
        <button onClick={onComplete} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-library-50 rounded-full flex items-center justify-center mb-2 shadow-inner border border-library-100">
            {steps[step].icon}
          </div>
          <h3 className="text-3xl font-serif font-bold text-library-900">{steps[step].title}</h3>
          <p className="text-gray-600 leading-relaxed text-lg">{steps[step].desc}</p>
          
          <div className="flex flex-col w-full gap-6 pt-4">
            <div className="flex gap-2 justify-center">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'bg-amber-500 w-8' : 'bg-gray-200 w-2'}`} />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="w-full bg-library-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-library-800 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-[0.98]"
            >
              {step === steps.length - 1 ? (mode === 'HOME' ? "Enter Library" : "Start Exploring") : "Next"} 
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
