import React, { useState } from 'react';
import { generateAbstract } from '../services/geminiService';
import { FileTextIcon } from '../components/Icons';
import { LoadingOverlay } from '../components/Loading';

export const SummarizerView = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ abstract: string; keywords: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await generateAbstract(text);
      setResult(data);
    } catch (e) {
      alert("Failed to generate abstract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Input Side */}
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-3xl font-serif text-library-900">Abstract Generator</h2>
          <p className="text-library-600">Paste document text to generate an academic abstract and keywords.</p>
        </div>
        <div className="flex-1 relative">
          <textarea
            className="w-full h-[60vh] lg:h-full p-6 rounded-xl border border-library-200 focus:ring-2 focus:ring-library-500 focus:border-transparent outline-none resize-none font-mono text-sm leading-relaxed bg-white shadow-sm"
            placeholder="Paste the full text of the article or chapter here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button
            onClick={handleSummarize}
            disabled={!text.trim() || loading}
            className="absolute bottom-6 right-6 bg-library-800 hover:bg-library-900 text-white px-6 py-3 rounded-lg shadow-lg font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
          >
            <FileTextIcon className="w-4 h-4" />
            Generate Abstract
          </button>
        </div>
      </div>

      {/* Output Side */}
      <div className="relative flex flex-col h-full bg-parchment rounded-xl border border-stone-200 shadow-md p-8 overflow-y-auto">
        {loading && <LoadingOverlay message="Reading text & synthesizing abstract..." />}
        
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-stone-400">
            <div className="w-16 h-16 border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-serif">A</span>
            </div>
            <p>Generated abstract will appear here.</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in space-y-8">
             <div>
                <h3 className="text-sm font-bold tracking-widest text-stone-500 uppercase mb-4 border-b border-stone-300 pb-2">Abstract</h3>
                <p className="font-serif text-stone-800 leading-8 text-lg text-justify">
                  {result.abstract}
                </p>
             </div>

             <div>
                <h3 className="text-sm font-bold tracking-widest text-stone-500 uppercase mb-4 border-b border-stone-300 pb-2">Keywords / Descriptors</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-stone-200 text-stone-800 px-3 py-1 rounded text-sm font-medium hover:bg-stone-300 transition-colors">
                      {kw}
                    </span>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};