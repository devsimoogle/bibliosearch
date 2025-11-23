import React from 'react';
import { BookIcon, NewspaperIcon, FileTextIcon } from './Icons';

export const ResourceVisual = ({ type }: { type: string }) => {
    if (type === 'Book') {
        return (
            <div className="w-24 h-32 bg-amber-600 rounded-r-lg rounded-l-sm shadow-md relative flex items-center justify-center overflow-hidden border-l-4 border-amber-800">
                <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-amber-800/20"></div>
                <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black/10 to-transparent"></div>
                <BookIcon className="w-10 h-10 text-white/90 drop-shadow-sm" />
                <div className="absolute bottom-3 left-3 right-3 h-1 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-5 left-3 right-8 h-1 bg-white/20 rounded-full"></div>
            </div>
        );
    }
    if (type === 'Journal') {
        return (
            <div className="w-24 h-32 bg-blue-500 rounded-lg shadow-md relative flex flex-col items-center pt-6 overflow-hidden border border-blue-600">
                <div className="w-16 h-20 bg-white shadow-sm flex flex-col gap-1 p-2 items-center">
                    <div className="w-full h-1 bg-gray-200"></div>
                    <div className="w-full h-1 bg-gray-200"></div>
                    <div className="w-2/3 h-1 bg-gray-200"></div>
                    <NewspaperIcon className="w-6 h-6 text-blue-500 mt-2" />
                </div>
                <div className="absolute top-0 left-0 right-0 h-4 bg-blue-700"></div>
            </div>
        );
    }
    if (type === 'Media') {
        return (
            <div className="w-28 h-20 bg-gray-900 rounded-xl shadow-md relative flex items-center justify-center overflow-hidden border border-gray-700">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-red-500"></div>
                </div>
            </div>
        );
    }
    // Default / Article
    return (
        <div className="w-24 h-32 bg-emerald-50 rounded-lg shadow-sm border border-emerald-100 relative flex items-center justify-center">
            <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-100 rounded-bl-xl"></div>
            <FileTextIcon className="w-10 h-10 text-emerald-600" />
            <div className="absolute bottom-3 left-3 text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Article</div>
        </div>
    );
};

export const InlineFormat = ({ text }: { text: string }) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
                if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={index} className="italic text-gray-800">{part.slice(1, -1)}</em>;
                return <span key={index}>{part}</span>;
            })}
        </>
    );
};

export const FormattedText = ({ text }: { text: string }) => {
    if (!text) return null;
    const cleanText = text.replace(/<[^>]*>/g, '');
    const lines = cleanText.split('\n');
    return (
        <span className="block space-y-4 font-sans leading-relaxed text-gray-700">
            {lines.map((line, i) => {
                if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                    const content = line.trim().substring(2);
                    return (
                        <span key={i} className="flex gap-3 pl-1">
                            <span className="shrink-0 w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5"></span>
                            <span className="block"><InlineFormat text={content} /></span>
                        </span>
                    );
                }
                if (line.trim().startsWith('### ')) return <h4 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2"><InlineFormat text={line.replace('### ', '')} /></h4>
                if (line.trim().startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3"><InlineFormat text={line.replace('## ', '')} /></h3>
                if (!line.trim()) return <br key={i} />;
                return <span key={i} className="block"><InlineFormat text={line} /></span>;
            })}
        </span>
    );
};
