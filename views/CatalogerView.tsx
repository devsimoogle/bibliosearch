import React, { useState } from 'react';
import { generateCatalogMetadata } from '../services/geminiService';
import { CatalogResult } from '../types';
import { SearchIcon, BookIcon } from '../components/Icons';
import { LoadingOverlay } from '../components/Loading';

export const CatalogerView = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CatalogResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateCatalogMetadata(query);
      setResult(data);
    } catch (err) {
      setError("Unable to retrieve catalog data. Please try a more specific search (ISBN is best).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif text-library-900 mb-2">Smart Cataloger</h2>
        <p className="text-library-600">Enter an ISBN, Title, or Author to generate standard library metadata.</p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-library-100 mb-8">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <SearchIcon className="absolute left-4 text-library-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 978-0-14-312755-0 or 'The Nature of Books' by Martian"
            className="w-full pl-12 pr-4 py-3 bg-library-50 border border-transparent rounded-lg focus:bg-white focus:border-library-500 focus:ring-2 focus:ring-library-200 outline-none transition-all text-lg"
          />
          <button
            type="submit"
            disabled={loading || !query}
            className="absolute right-2 bg-library-700 hover:bg-library-800 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Catalog
          </button>
        </form>
      </div>

      {/* Results Area */}
      <div className="flex-1 relative min-h-[400px]">
        {loading && <LoadingOverlay message="Querying bibliographic databases & analyzing..." />}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Main Info Card */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-library-600">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight">{result.title}</h3>
                  <p className="text-lg text-library-700 mt-1">by {result.author}</p>
                </div>
                <BookIcon className="text-library-200 w-12 h-12" />
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mt-6">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-500">Publisher</span>
                  <span className="text-gray-800">{result.publisher}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-500">Year</span>
                  <span className="text-gray-800">{result.publicationDate}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-gray-500">ISBN</span>
                  <span className="text-gray-800 font-mono">{result.isbn}</span>
                </div>
              </div>
            </div>

            {/* Classification Card */}
            <div className="bg-library-800 text-library-50 p-6 rounded-xl shadow-md">
              <h4 className="text-library-200 uppercase tracking-wider text-xs font-bold mb-6">Classification Data</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-library-700/50 p-4 rounded-lg">
                  <span className="block text-xs text-library-300 mb-1">DDC (Dewey)</span>
                  <span className="text-2xl font-mono font-bold text-white">{result.ddc}</span>
                </div>
                <div className="bg-library-700/50 p-4 rounded-lg">
                  <span className="block text-xs text-library-300 mb-1">LCC (Library of Congress)</span>
                  <span className="text-2xl font-mono font-bold text-white">{result.lcc}</span>
                </div>
              </div>

              <div>
                <span className="block text-xs text-library-300 mb-2">Subject Headings (LCSH/FAST)</span>
                <div className="flex flex-wrap gap-2">
                  {result.subjects.map((subj, idx) => (
                    <span key={idx} className="bg-white/10 px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-colors cursor-default">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary - Full Width */}
            <div className="md:col-span-2 bg-parchment p-6 rounded-xl shadow-inner border border-stone-200">
              <h4 className="font-serif font-bold text-stone-800 mb-3">Cataloger's Abstract</h4>
              <p className="text-stone-700 leading-relaxed text-justify">
                {result.summary}
              </p>
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-full text-library-300 opacity-60">
            <BookIcon className="w-24 h-24 mb-4" />
            <p className="text-lg">Ready to catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
};