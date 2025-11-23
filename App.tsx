
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, SearchResponse, Suggestion, LibraryResource, ToastMessage, UserProfile, University, Lecturer } from './types';
import { performLibrarySearch, getSearchSuggestions } from './services/llmService';
import * as db from './services/databaseService';
import {
  LibraryIcon, SearchIcon, BookIcon, SparklesIcon, XIcon,
  HistoryIcon, FilterIcon, CalendarIcon, TagIcon, BookmarkIcon,
  TrashIcon, QuoteIcon, RefreshIcon, GlobeIcon, CheckCircleIcon,
  UserIcon, DatabaseIcon, ActivityIcon, ProfileIcon, SchoolIcon,
  DownloadIcon, AdminIcon, BriefcaseIcon, IdCardIcon, SettingsIcon, ChipIcon, LogoutIcon,
  ChevronRightIcon, ExternalLinkIcon, VideoIcon, NewspaperIcon, FileTextIcon
} from './components/Icons';
import { BeautifulLoader } from './components/Loading';
import { Toast } from './components/Toast';
import { AdminView } from './views/AdminView';
import { AdminLoginView } from './views/AdminLoginView';
import { OnboardingView } from './views/OnboardingView';
import { LibraryIdCard } from './components/LibraryIdCard';
import { Walkthrough } from './components/Walkthrough';
import { ResultsView } from './views/ResultsView';

// --- VISUAL COMPONENTS ---

// Visual components moved to components/Visuals.tsx

const ProfileDrawer = ({ isOpen, onClose, onUpdateUser, onSearchHistory }: { isOpen: boolean, onClose: () => void, onUpdateUser: () => void, onSearchHistory: (q: string) => void }) => {
  const [user, setUser] = useState(db.getUserProfile());
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setUser(db.getUserProfile());
      const savedHist = localStorage.getItem('biblio_history');
      if (savedHist) {
        try {
          setHistory(JSON.parse(savedHist));
        } catch (e) { setHistory([]); }
      }
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <div className={`fixed inset-y-0 right-0 z-[70] w-full md:w-[450px] bg-white shadow-xl transform transition-transform duration-300 ease-out flex flex-col border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header - Light & Clean */}
        <div className="p-6 pb-2 shrink-0 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div>
            <h2 className="text-gray-900 font-serif font-bold text-2xl tracking-tight">Scholar Dossier</h2>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">Personal Library Record</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-2 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scroll-smooth">
          {/* Card Section */}
          <div className="flex justify-center py-2 animate-scale-up">
            <div className="w-full transform transition-transform duration-500">
              <LibraryIdCard user={user} showStatus={true} />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-library-900">{user.searchesCount}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Searches</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-library-900">{user.savedItemsCount}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Saved Items</span>
            </div>
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
                <HistoryIcon className="w-4 h-4" /> Recent History
              </h3>
              <div className="space-y-1">
                {history.slice(0, 8).map((h, i) => (
                  <div key={i} onClick={() => { onSearchHistory(h); onClose(); }} className="flex items-center gap-3 p-3 hover:bg-amber-50 rounded-xl cursor-pointer transition-colors group">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-amber-100 text-gray-400 group-hover:text-amber-600 transition-colors">
                      <SearchIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium truncate flex-1 group-hover:text-gray-900">{h}</span>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function App() {
  const [user, setUser] = useState(db.getUserProfile());
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterYear, setFilterYear] = useState<string>('All Time');
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const [savedResources, setSavedResources] = useState<LibraryResource[]>([]);
  const [showShelf, setShowShelf] = useState(false);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
  const [isRequested, setIsRequested] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughMode, setWalkthroughMode] = useState<'HOME' | 'RESULTS'>('HOME');

  useEffect(() => {
    db.getLLMConfig();
    try {
      const savedHist = localStorage.getItem('biblio_history');
      if (savedHist) setSearchHistory(JSON.parse(savedHist));
      const savedShelf = localStorage.getItem('biblio_shelf');
      if (savedShelf) setSavedResources(JSON.parse(savedShelf));
    } catch (e) { }

    const currentUser = db.getUserProfile();
    setUser(currentUser);

    if (!currentUser.isSetupComplete) {
      setShowOnboarding(true);
    } else if (!currentUser.hasSeenWalkthrough) {
      setWalkthroughMode('HOME');
      setShowWalkthrough(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    const updatedUser = db.getUserProfile();
    setUser(updatedUser);
    setState(AppState.HOME);
    showToastMsg("Setup complete! Welcome to your library.", "success");
    setWalkthroughMode('HOME');
    setShowWalkthrough(true);
  };

  const handleWalkthroughComplete = () => {
    setShowWalkthrough(false);
    db.markWalkthroughSeen();
  };

  const refreshUser = () => setUser(db.getUserProfile());
  const showToastMsg = (msg: string, type: ToastMessage['type'] = 'info') => setToast({ id: Date.now().toString(), message: msg, type });

  const addToHistory = (q: string) => {
    const cleanQ = q.trim();
    if (!cleanQ) return;
    setSearchHistory(prev => {
      const newHist = [cleanQ, ...prev.filter(i => i !== cleanQ)].slice(0, 8);
      localStorage.setItem('biblio_history', JSON.stringify(newHist));
      return newHist;
    });
  };

  const toggleSaveResource = (res: LibraryResource) => {
    setSavedResources(prev => {
      const exists = prev.find(r => r.title === res.title && r.author === res.author);
      let newShelf;
      if (exists) {
        newShelf = prev.filter(r => r !== exists);
        showToastMsg("Removed from shelf", "info");
      } else {
        newShelf = [res, ...prev];
        showToastMsg("Resource saved to shelf", "success");
        db.logActivity('SAVE', `Saved resource: ${res.title}`);
        db.updateUserStats(false, true);
      }
      localStorage.setItem('biblio_shelf', JSON.stringify(newShelf));
      return newShelf;
    });
  };

  const isSaved = (res: LibraryResource) => savedResources.some(r => r.title === res.title && r.author === res.author);

  const handleRequestRetrieval = () => {
    setIsRequested(true);
    db.logActivity('REQUEST', `Requested retrieval: ${selectedResource?.title}`);
    showToastMsg("Retrieval request submitted to circulation desk", "success");
  };

  const handleDownloadPDF = () => {
    if (!selectedResource) return;
    const content = `<html><head><title>${selectedResource.title}</title></head><body><h1>${selectedResource.title}</h1><p><strong>Author:</strong> ${selectedResource.author}</p><p><strong>Year:</strong> ${selectedResource.year}</p><p><strong>Type:</strong> ${selectedResource.type}</p><p><strong>Description:</strong> ${selectedResource.description}</p><script>window.print();</script></body></html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(content); win.document.close(); }
  };

  useEffect(() => { if (!selectedResource) setIsRequested(false); }, [selectedResource]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 2) {
        const suggs = await getSearchSuggestions(query);
        setSuggestions(suggs);
      } else {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = overrideQuery || query;
    if (!q.trim()) return;

    setQuery(q);
    setShowSuggestions(false);
    setState(AppState.SEARCHING);
    setError('');
    setSelectedResource(null);
    setShowShelf(false);
    setFilterType('All');
    setFilterYear('All Time');
    setSearchTime(0);
    setTotalResults(0);

    addToHistory(q);
    db.logActivity('SEARCH', `Searched for: ${q}`);
    db.updateUserStats(true, false);

    const cachedResult = db.getCachedResult(q);
    if (cachedResult) {
      setTimeout(() => {
        setResults(cachedResult);
        setState(AppState.RESULTS);
      }, 300);
      return;
    }

    try {
      const startTime = performance.now();
      const data = await performLibrarySearch(q);
      const endTime = performance.now();

      setSearchTime((endTime - startTime) / 1000);
      setTotalResults((data.libraryResources?.length || 0) + (data.webSources?.length || 0));

      const lecturers = db.searchLecturers(q);
      if (lecturers.length > 0) data.lecturers = lecturers;

      db.cacheResult(q, data);
      setResults(data);
      setState(AppState.RESULTS);

    } catch (err: any) {
      if (err.message && (err.message.includes('429') || err.message.includes('quota'))) {
        setError("Service capacity reached. Please try again momentarily.");
        setState(AppState.HOME);
      } else {
        setError("Search service temporarily unavailable.");
        setState(AppState.HOME);
      }
    }
  };

  const filteredResources = useMemo(() => {
    if (!results?.libraryResources) return [];

    return results.libraryResources.filter(r => {
      const typeMatch = filterType === 'All' || r.type === filterType;
      const currentYear = new Date().getFullYear();
      let yearMatch = true;
      const rYear = parseInt(r.year);

      if (!isNaN(rYear)) {
        if (filterYear === 'Last 5 Years') yearMatch = rYear >= (currentYear - 5);
        else if (filterYear === 'Last 10 Years') yearMatch = rYear >= (currentYear - 10);
        else if (filterYear === 'Last 20 Years') yearMatch = rYear >= (currentYear - 20);
      }
      return typeMatch && yearMatch;
    });
  }, [results, filterType, filterYear]);

  const campusPicks = db.getCampusPicks(user);
  const isHome = state === AppState.HOME;

  const handleAdminLogin = () => { setShowOnboarding(false); setState(AppState.ADMIN); showToastMsg("Welcome back, Librarian.", "success"); };
  const handleAdminLogout = () => { setState(AppState.HOME); showToastMsg("Logged out.", "info"); if (!user.isSetupComplete) setShowOnboarding(true); };

  if (state === AppState.ADMIN_LOGIN) return <AdminLoginView onLogin={handleAdminLogin} onCancel={() => setState(AppState.HOME)} />;
  if (state === AppState.ADMIN) return <AdminView onClose={handleAdminLogout} />;

  return (
    <div className={`h-full overflow-hidden font-sans flex flex-col selection:bg-amber-200 ${state === AppState.RESULTS ? 'bg-[#f8f9fa]' : 'bg-library-50'}`}>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      {showOnboarding && <OnboardingView onComplete={handleOnboardingComplete} onAdminLogin={() => setState(AppState.ADMIN_LOGIN)} />}
      {showWalkthrough && <Walkthrough onComplete={handleWalkthroughComplete} mode={walkthroughMode} />}
      <ProfileDrawer isOpen={showProfile} onClose={() => setShowProfile(false)} onUpdateUser={refreshUser} onSearchHistory={(q) => handleSearch(undefined, q)} />

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 ease-in-out z-40 ${isHome ? 'py-4 px-4 md:py-6 md:px-8 bg-gradient-to-b from-white/90 to-transparent backdrop-blur-[1px]' : 'py-3 px-4 md:px-6 shadow-sm bg-white/95 backdrop-blur-xl border-b border-gray-100'}`}>
        <div className={`max-w-[1600px] mx-auto flex items-center justify-between`}>
          <div className={`flex items-center gap-2 cursor-pointer group`} onClick={() => { setState(AppState.HOME); setQuery(''); setResults(null); }}>
            <div className={`p-2 rounded-xl hidden md:block shadow-sm ${isHome ? 'bg-library-900' : 'bg-amber-500 group-hover:bg-amber-400'}`}>
              <LibraryIcon className={`w-4 h-4 text-white`} />
            </div>
            <span className={`font-serif font-bold text-lg tracking-tight ${isHome ? 'text-library-900' : 'text-gray-900'}`}>BiblioSearch</span>
          </div>

          {state !== AppState.HOME && (
            <div className="flex-1 max-w-xl mx-4 md:mx-8 relative">
              <form onSubmit={(e) => handleSearch(e)} className="relative w-full group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
                  className="w-full bg-gray-100 hover:bg-white text-gray-800 border border-transparent focus:border-amber-500/30 rounded-full py-2.5 pl-10 pr-4 focus:ring-4 focus:ring-amber-500/10 text-sm shadow-inner focus:shadow-lg transition-all outline-none font-medium placeholder-gray-400"
                  placeholder="Search..."
                />
                <SearchIcon className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {suggestions.map((s, idx) => (
                    <div key={idx} className="px-5 py-3 hover:bg-amber-50 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-0" onClick={() => handleSearch(undefined, s.text)}>
                      <SearchIcon className="w-4 h-4 text-gray-400" /><span className="text-gray-800 text-sm font-medium">{s.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 md:gap-5">
            {!isHome && <button onClick={() => setState(AppState.HOME)} className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-amber-600 transition-colors cursor-pointer"><SearchIcon className="w-3 h-3" /> Home</button>}
            <button onClick={() => setShowShelf(true)} className={`relative group p-2.5 rounded-full transition-all cursor-pointer ${isHome ? 'hover:bg-library-200' : 'bg-gray-100 hover:bg-amber-50'}`}>
              <BookmarkIcon className={`w-5 h-5 ${isHome ? 'text-library-900' : 'text-gray-600 group-hover:text-amber-500'}`} filled={savedResources.length > 0} />
              {savedResources.length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>}
            </button>
            <button onClick={() => setShowProfile(true)} className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-white shadow-md overflow-hidden transform hover:scale-105 transition-transform cursor-pointer bg-library-800">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Horizontal Filters for Results Page */}
        {state === AppState.RESULTS && (
          <div className="max-w-[1600px] mx-auto mt-3 px-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
            {['All', 'Book', 'Journal', 'Article', 'Media'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filterType === type ? 'bg-library-900 text-white border-library-900 shadow-md shadow-library-900/20' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {type}
              </button>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-5 py-2 text-xs font-bold text-gray-600 outline-none hover:bg-gray-50 cursor-pointer shadow-sm"
            >
              <option value="All Time">Any Time</option>
              <option value="Last 5 Years">Past 5 Years</option>
              <option value="Last 10 Years">Past 10 Years</option>
            </select>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col relative w-full overflow-hidden ${state === AppState.RESULTS ? 'pt-40' : 'pt-20'}`}>

        {state === AppState.HOME && (
          <div className="flex-1 overflow-y-auto bg-library-50 scroll-smooth -mt-20 pt-20">
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-6 animate-fade-in pb-20">
              <div className="z-10 w-full max-w-3xl flex flex-col items-center">
                <div className="mb-8 flex flex-col items-center text-center">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-library-900 tracking-tight mb-2">BiblioSearch</h1>
                  {user.universityId && (
                    <div className="flex items-center gap-2 mb-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                      <SchoolIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">{user.universityId}</span>
                    </div>
                  )}
                  <p className="text-sm md:text-base text-gray-500 font-medium max-w-md">Semantic discovery for the modern scholar.</p>
                </div>

                <div className="w-full max-w-2xl relative group px-2 md:px-0 mb-12">
                  <div className="absolute -inset-1 bg-gradient-to-r from-library-100 via-amber-100 to-library-100 rounded-[2rem] blur-lg opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                  <div className="relative bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-1 z-20 flex items-center">
                    <SearchIcon className="ml-5 w-5 h-5 text-gray-300" />
                    <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }} className="flex-1 px-4 py-3 text-base bg-transparent border-none focus:outline-none font-medium text-gray-800 placeholder-gray-300" placeholder="Search for books, journals, or topics..." autoFocus />
                    <button onClick={() => handleSearch()} className="bg-library-900 text-white p-3 rounded-[1.5rem] hover:bg-library-800 shadow-md cursor-pointer hover:scale-105 transition-transform"><SparklesIcon className="w-4 h-4" /></button>
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden z-30 mx-2">
                      <div className="p-2">
                        {suggestions.map((s, idx) => (
                          <div key={idx} className="px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors group/item" onClick={() => handleSearch(undefined, s.text)}>
                            <SearchIcon className="w-4 h-4 text-gray-300" />
                            <span className="text-gray-700 text-sm font-medium group-hover/item:text-library-900">{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {campusPicks.length > 0 && (
                  <div className="w-full max-w-5xl px-2 animate-slide-up">
                    <div className="flex items-center gap-3 mb-6 px-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><SchoolIcon className="w-3 h-3" /> Featured Collections</h3>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {campusPicks.map((pick, i) => (
                        <div key={i} className="relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full bg-white border border-gray-100" onClick={() => handleSearch(undefined, pick.title)}>
                          {/* Gradient Header */}
                          <div className={`h-24 p-5 flex items-start justify-between ${i === 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50' : i === 1 ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'}`}>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{pick.type}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? 'bg-amber-200/50 text-amber-600' : i === 1 ? 'bg-blue-200/50 text-blue-600' : 'bg-emerald-200/50 text-emerald-600'}`}>
                              <BookIcon className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col">
                            <h4 className="font-serif font-bold text-gray-900 leading-tight group-hover:text-library-800 transition-colors line-clamp-2 mb-2">{pick.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4 flex-1">{pick.description}</p>
                            {pick.matchReason && (
                              <div className="pt-3 border-t border-gray-50 flex items-center gap-2">
                                <SparklesIcon className="w-3 h-3 text-amber-400" />
                                <span className="text-[10px] font-bold text-gray-400">{pick.matchReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-16 opacity-50 hover:opacity-100 transition-opacity pb-8">
                  <button
                    onClick={() => setState(AppState.ADMIN_LOGIN)}
                    className="text-[10px] text-gray-400 hover:text-library-600 transition-colors uppercase font-bold tracking-widest flex items-center gap-2 cursor-pointer"
                  >
                    <AdminIcon className="w-3 h-3" /> Librarian Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.SEARCHING && <BeautifulLoader />}

        {state === AppState.RESULTS && results && (
          <ResultsView
            results={results}
            filteredResources={filteredResources}
            totalResults={totalResults}
            searchTime={searchTime}
            onSearch={(term) => handleSearch(undefined, term)}
            onSave={toggleSaveResource}
            isSaved={isSaved}
          />
        )}
      </main>

      {showShelf && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setShowShelf(false)}></div>
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col border-l border-white/50 animate-slide-in-right">
            <div className="p-6 bg-library-900 text-white flex justify-between items-center shadow-md z-10"><h2 className="font-serif font-bold text-xl flex items-center gap-2"><BookmarkIcon className="w-5 h-5 text-amber-500" filled /> My Shelf</h2><button onClick={() => setShowShelf(false)} className="cursor-pointer hover:text-amber-400 transition-colors"><XIcon className="w-6 h-6" /></button></div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {savedResources.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center">
                  <BookmarkIcon className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">Your shelf is empty.<br />Save books to cite them later.</p>
                </div>
              )}
              {savedResources.map((res, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedResource(res)}>
                  <button onClick={(e) => { e.stopPropagation(); toggleSaveResource(res); }} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 cursor-pointer p-1 rounded-md hover:bg-red-50"><TrashIcon className="w-4 h-4" /></button>
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-14 bg-library-100 rounded flex items-center justify-center">
                      <BookIcon className="w-5 h-5 text-library-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 font-serif pr-6 leading-tight text-sm">{res.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{res.author}</p>
                      <span className="inline-block mt-2 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase">{res.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                <QuoteIcon className="w-4 h-4" /> Export Citations
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">

            {/* Clean Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white sticky top-0 z-10">
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded border border-amber-200">{selectedResource.type}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 text-xs font-bold">{selectedResource.year}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 leading-tight">{selectedResource.title}</h2>
                <p className="text-library-600 font-medium mt-1">{selectedResource.author}</p>
              </div>
              <button onClick={() => setSelectedResource(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"><XIcon className="w-6 h-6" /></button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto">

              {/* Action Bar */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                <button onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-blue-200">
                  <DownloadIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-xs font-bold">Download PDF</span>
                </button>
                <button onClick={() => toggleSaveResource(selectedResource)} className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-colors group cursor-pointer border ${isSaved(selectedResource) ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-transparent hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'}`}>
                  <BookmarkIcon className={`w-4 h-4 ${isSaved(selectedResource) ? 'text-amber-500' : 'text-gray-400 group-hover:text-amber-500'}`} filled={isSaved(selectedResource)} />
                  <span className="text-xs font-bold">{isSaved(selectedResource) ? 'Saved to Shelf' : 'Save to Shelf'}</span>
                </button>
                <div className="col-span-2 md:col-span-1 bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center px-4">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Reference ID</span>
                  <span className="font-mono text-xs text-gray-800">{selectedResource.isbn || 'N/A'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-library-900 uppercase tracking-widest mb-3 flex items-center gap-2"><BriefcaseIcon className="w-4 h-4 text-amber-500" /> Abstract / Summary</h4>
                <p className="text-gray-600 leading-relaxed text-justify font-serif text-sm md:text-base bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  {selectedResource.description}
                </p>
              </div>

              {/* Citation Tool */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Citation Preview</h4>
                  <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                    {(['APA', 'MLA', 'Chicago'] as const).map(f => (
                      <button key={f} onClick={() => setCitationFormat(f)} className={`text-[10px] px-3 py-1 rounded-md cursor-pointer transition-all font-bold ${citationFormat === f ? 'bg-library-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-xs p-4 bg-white border border-gray-200 rounded-xl text-slate-600 select-all shadow-inner">
                  {selectedResource.title} by {selectedResource.author} ({selectedResource.year}). Retrieved from BiblioSearch.
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
              <button onClick={() => setSelectedResource(null)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">Close</button>
              <button onClick={handleRequestRetrieval} disabled={isRequested} className={`flex-1 py-3 rounded-xl font-bold text-sm md:text-base shadow-md transition-all transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${isRequested ? 'bg-green-600 text-white' : 'bg-library-900 text-white hover:bg-library-800'}`}>
                {isRequested ? <><CheckCircleIcon className="w-5 h-5" /> Request Sent</> : 'Request Physical Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
