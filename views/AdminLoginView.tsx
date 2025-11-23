
import React, { useState } from 'react';
import { AdminIcon, KeyIcon, LibraryIcon } from '../components/Icons';

export const AdminLoginView = ({ onLogin, onCancel }: { onLogin: () => void, onCancel: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo purposes
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid system credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-library-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 to-transparent"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-scale-up">
        <div className="bg-gradient-to-r from-library-800 to-library-700 p-8 text-center border-b border-library-600">
           <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
             <AdminIcon className="w-8 h-8 text-amber-400" />
           </div>
           <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Librarian Access</h2>
           <p className="text-library-200 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System ID</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400"><AdminIcon className="w-5 h-5"/></div>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium text-gray-800"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secure Key</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400"><KeyIcon className="w-5 h-5"/></div>
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium text-gray-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-library-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-library-800 transition-all shadow-lg shadow-library-200/50 flex items-center justify-center gap-2"
            >
              Verify Credentials
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="w-full mt-4 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Return to Public Access
            </button>
          </div>
        </form>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
             <LibraryIcon className="w-3 h-3" /> BiblioSearch Secure Gateway v2.1
           </p>
        </div>
      </div>
    </div>
  );
};
