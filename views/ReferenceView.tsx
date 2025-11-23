import React, { useState, useRef, useEffect } from 'react';
import { sendReferenceQuery } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SendIcon, SparklesIcon } from '../components/Icons';

export const ReferenceView = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: 'Greetings. I am your Reference Assistant. I can search academic and general web sources to answer complex inquiries with citations. How can I assist you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Format history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendReferenceQuery(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        sources: response.sources
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I apologize, but I encountered an error while searching for that information."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="flex-none mb-4">
        <h2 className="text-3xl font-serif text-library-900">Reference Desk</h2>
        <p className="text-library-600 text-sm">Powered by Gemini 2.5 & Google Search Grounding</p>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-library-100 p-6 space-y-6 mb-4"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
              msg.role === 'user' 
                ? 'bg-library-700 text-white rounded-br-none' 
                : 'bg-library-50 text-gray-800 rounded-bl-none border border-library-100'
            }`}>
              {/* Message Content */}
              <div className="prose prose-sm max-w-none">
                 <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>

              {/* Sources / Grounding */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-library-200">
                  <p className="text-xs font-bold text-library-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3" /> Sources
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.sources.map((source, idx) => (
                       source.web?.uri ? (
                        <li key={idx}>
                          <a 
                            href={source.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-2 bg-white rounded border border-library-200 hover:border-library-400 hover:shadow-sm transition-all text-xs truncate text-library-700"
                          >
                            <span className="font-semibold block truncate">{source.web.title}</span>
                            <span className="text-gray-400 truncate">{source.web.uri}</span>
                          </a>
                        </li>
                      ) : null
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start animate-pulse">
             <div className="bg-library-50 rounded-2xl rounded-bl-none px-5 py-4 border border-library-100 flex items-center gap-2">
               <div className="w-2 h-2 bg-library-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-library-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-library-400 rounded-full animate-bounce delay-150"></div>
               <span className="text-xs text-library-500 ml-2">Consulting sources...</span>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex-none flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a reference question (e.g., 'What was the impact of the printing press on literacy in the 16th century?')"
          className="flex-1 bg-white border border-library-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-library-500 focus:border-transparent shadow-sm"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-6 py-3 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};