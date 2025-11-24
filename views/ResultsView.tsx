import React, { useState, useEffect } from 'react';
import { SearchResponse, LibraryResource } from '../types';
import {
    ActivityIcon, SparklesIcon, GlobeIcon, ExternalLinkIcon,
    BookIcon, CheckCircleIcon, BookmarkIcon, XIcon, DownloadIcon,
    QuoteIcon, BriefcaseIcon, ChevronRightIcon
} from '../components/Icons';
import { ResourceVisual, FormattedText } from '../components/Visuals';

interface ResultsViewProps {
    results: SearchResponse;
    filteredResources: LibraryResource[];
    totalResults: number;
    searchTime: number;
    onSearch: (term: string) => void;
    onSave: (res: LibraryResource) => void;
    isSaved: (res: LibraryResource) => boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
    results,
    filteredResources,
    totalResults,
    searchTime,
    onSearch,
    onSave,
    isSaved
}) => {
    const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
    const [isRequested, setIsRequested] = useState(false);
    const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
    const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);

    useEffect(() => {
        if (!selectedResource) {
            setIsRequested(false);
            setIsAbstractExpanded(false);
        }
    }, [selectedResource]);

    const handleRequestRetrieval = () => {
        setIsRequested(true);
    };

    const handleDownloadPDF = () => {
        if (!selectedResource) return;
        const content = `<html><head><title>${selectedResource.title}</title></head><body><h1>${selectedResource.title}</h1><p><strong>Author:</strong> ${selectedResource.author}</p><p><strong>Year:</strong> ${selectedResource.year}</p><p><strong>Type:</strong> ${selectedResource.type}</p><p><strong>Description:</strong> ${selectedResource.description}</p><script>window.print();</script></body></html>`;
        const win = window.open('', '_blank');
        if (win) { win.document.write(content); win.document.close(); }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#FAFAFA] scroll-smooth font-sans">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20 pt-4 sm:pt-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: Compact Stats & Nav (Desktop) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-4">
                        {/* Minimal Stats */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <ActivityIcon className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Results</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-2xl font-serif font-bold text-gray-900">{totalResults}</div>
                                <div className="text-[10px] text-gray-400 font-medium">({searchTime.toFixed(2)}s)</div>
                            </div>
                        </div>

                        {/* Compact Topics */}
                        {results.relatedTopics && results.relatedTopics.length > 0 && (
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3 text-xs flex items-center gap-2 uppercase tracking-wider">
                                    <SparklesIcon className="w-3.5 h-3.5 text-amber-500" /> Related
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {results.relatedTopics.slice(0, 6).map((topic, i) => (
                                        <button key={i} onClick={() => onSearch(topic)} className="text-left bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200 text-gray-600 hover:text-amber-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all">
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Web Sources List (Desktop) */}
                        {results.webSources.length > 0 && (
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3 text-xs flex items-center gap-2 uppercase tracking-wider">
                                    <GlobeIcon className="w-3.5 h-3.5 text-blue-500" /> Sources
                                </h3>
                                <div className="space-y-2">
                                    {results.webSources.slice(0, 4).map((source, idx) => source.web?.uri && (
                                        <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 group hover:bg-gray-50 p-1.5 -mx-1.5 rounded-lg transition-colors">
                                            <div className="shrink-0 w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[9px] font-bold border border-blue-100">
                                                {idx + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-[11px] font-semibold text-gray-700 truncate group-hover:text-blue-600">{source.web.title}</h4>
                                                <div className="text-[9px] text-gray-400 truncate">{new URL(source.web.uri).hostname}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CENTER/RIGHT COLUMN */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* MOBILE ONLY: Stats & Topics Horizontal Scroll */}
                        <div className="lg:hidden space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-serif font-bold text-gray-900">{totalResults}</span>
                                    <span className="text-xs text-gray-500">results found</span>
                                </div>
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{searchTime.toFixed(2)}s</span>
                            </div>

                            {/* Mobile Web Sources - Horizontal Scroll List */}
                            {results.webSources.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
                                        <GlobeIcon className="w-3 h-3 text-blue-500" /> Verified Sources
                                    </h3>
                                    <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
                                        {results.webSources.map((source, idx) => source.web?.uri && (
                                            <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex-none w-48 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm flex items-center gap-2 active:scale-95 transition-transform">
                                                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold border border-blue-100">
                                                    {idx + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-[11px] font-bold text-gray-800 leading-tight truncate">{source.web.title}</h4>
                                                    <div className="text-[9px] text-gray-400 truncate">{new URL(source.web.uri).hostname}</div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ZONE 1: AI Overview - COMPACT & ELEGANT */}
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-amber-100/50 overflow-hidden relative">
                            {/* Elegant Header */}
                            <div className="px-5 py-3 border-b border-gray-50 bg-gradient-to-r from-white via-amber-50/30 to-white flex items-center gap-3">
                                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 shadow-sm">
                                    <SparklesIcon className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-serif font-bold text-gray-900 tracking-tight leading-none">AI Overview</h2>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Synthesized Knowledge</p>
                                </div>
                            </div>

                            {/* Compact Content */}
                            <div className="p-5 space-y-5">
                                {results.synthesis.map((section, idx) => (
                                    <div key={idx} className="group">
                                        <h3 className="font-serif font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
                                            <span className="w-1 h-3 bg-amber-400 rounded-full"></span>
                                            {section.heading}
                                        </h3>
                                        <div className="text-gray-600 text-[13px] leading-relaxed font-sans pl-3 border-l border-gray-100">
                                            <FormattedText text={section.body} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Minimal Footer */}
                            <div className="px-5 py-2 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Imoogle 4.0</span>
                            </div>
                        </div>

                        {/* ZONE 2: Library Catalog */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-serif font-bold text-gray-900">Library Resources</h3>
                                <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{filteredResources.length} items</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredResources.map((resource, idx) => (
                                    <div key={idx} className="group bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full" onClick={() => setSelectedResource(resource)}>

                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${resource.type === 'Book' ? 'bg-amber-50 text-amber-700 border-amber-100' : resource.type === 'Journal' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                                    {resource.type}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">{resource.year}</span>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); onSave(resource); }} className={`hover:scale-110 transition-transform ${isSaved(resource) ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}>
                                                <BookmarkIcon className="w-3.5 h-3.5" filled={isSaved(resource)} />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h4 className="font-serif font-bold text-sm text-gray-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2 mb-1">{resource.title}</h4>
                                            <p className="text-xs text-gray-500 font-medium truncate mb-2.5">{resource.author}</p>

                                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-3 bg-gray-50/50 p-2 rounded-lg border border-gray-50">
                                                {resource.description}
                                            </p>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                                            {resource.matchReason ? (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600">
                                                    <SparklesIcon className="w-3 h-3" /> {resource.matchReason}
                                                </div>
                                            ) : <div></div>}
                                            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPACT & BEAUTIFUL MODAL */}
            {selectedResource && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
                    <div className="bg-white w-[95%] max-w-md sm:max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[85vh]">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-white sticky top-0 z-10">
                            <div className="pr-8">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase rounded tracking-wider">{selectedResource.type}</span>
                                    <span className="text-gray-300 text-[10px]">•</span>
                                    <span className="text-gray-500 text-[10px] font-bold">{selectedResource.year}</span>
                                </div>
                                <h2 className="text-xl font-serif font-bold text-gray-900 leading-tight">{selectedResource.title}</h2>
                                <p className="text-sm text-amber-600 font-medium mt-0.5">{selectedResource.author}</p>
                            </div>
                            <button onClick={() => setSelectedResource(null)} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            {/* Abstract */}
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <BriefcaseIcon className="w-3.5 h-3.5 text-amber-500" /> Abstract
                                </h4>
                                <div className={`relative ${!isAbstractExpanded ? 'max-h-24 overflow-hidden' : ''}`}>
                                    <p className="text-gray-600 leading-relaxed text-justify font-sans text-sm">
                                        {selectedResource.description}
                                    </p>
                                    {!isAbstractExpanded && (
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent flex items-end justify-center">
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setIsAbstractExpanded(!isAbstractExpanded)} className="text-[10px] font-bold text-amber-600 mt-1 hover:underline">
                                    {isAbstractExpanded ? 'Show Less' : 'Read More'}
                                </button>
                            </div>

                            {/* Citation */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <QuoteIcon className="w-3.5 h-3.5" /> Citation
                                    </h4>
                                    <div className="flex bg-white rounded-md p-0.5 border border-gray-200 shadow-sm">
                                        {(['APA', 'MLA', 'Chicago'] as const).map(f => (
                                            <button key={f} onClick={() => setCitationFormat(f)} className={`text-[9px] px-2 py-1 rounded-sm cursor-pointer transition-all font-bold ${citationFormat === f ? 'bg-slate-800 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}>{f}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="font-mono text-[11px] p-3 bg-white border border-gray-200 rounded-lg text-slate-600 select-all leading-relaxed">
                                    {selectedResource.title} by {selectedResource.author} ({selectedResource.year}). Retrieved from BiblioSearch.
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
                            <button onClick={handleDownloadPDF} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 rounded-xl text-xs font-bold text-gray-700 transition-all shadow-sm group">
                                <DownloadIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" /> Download PDF
                            </button>
                            <button onClick={() => onSave(selectedResource)} className={`flex-1 flex items-center justify-center gap-2 py-3 border rounded-xl text-xs font-bold transition-all shadow-sm group ${isSaved(selectedResource) ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 text-gray-700'}`}>
                                <BookmarkIcon className={`w-4 h-4 transition-colors ${isSaved(selectedResource) ? 'text-amber-700' : 'text-gray-400 group-hover:text-amber-600'}`} filled={isSaved(selectedResource)} /> {isSaved(selectedResource) ? 'Saved' : 'Save for Later'}
                            </button>
                            <button onClick={handleRequestRetrieval} disabled={isRequested} className={`flex-[1.5] py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${isRequested ? 'bg-green-600 text-white border border-green-700' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg border border-slate-900'}`}>
                                {isRequested ? <><CheckCircleIcon className="w-4 h-4" /> Requested</> : 'Request Physical Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
