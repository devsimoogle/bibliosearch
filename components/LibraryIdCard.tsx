
import React from 'react';
import { UserProfile } from '../types';
import { UserIcon, LibraryIcon } from './Icons';

interface LibraryIdCardProps {
  user: Partial<UserProfile>;
  showStatus?: boolean;
  interactive?: boolean;
}

export const LibraryIdCard = ({ user, showStatus = true, interactive = true }: LibraryIdCardProps) => {
  return (
    <div className={`relative w-full aspect-[1.4] md:aspect-[1.586] max-w-[400px] mx-auto rounded-2xl overflow-hidden shadow-xl md:shadow-2xl bg-library-900 border border-library-700 font-sans ${interactive ? 'transition-transform hover:scale-[1.02] duration-300 group perspective-1000 cursor-pointer' : ''}`}>

      {/* Background Texture & Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-library-900 via-library-800 to-library-900 z-0"></div>

      {/* Abstract Pattern (Guilloche-like) */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 20%, transparent 0%, transparent 90%, #f59e0b 100%)',
          backgroundSize: '120% 120%'
        }}>
      </div>
      <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-amber-600/20 blur-[60px] rounded-full"></div>
      <div className="absolute -left-10 -top-20 w-64 h-64 bg-emerald-600/10 blur-[60px] rounded-full"></div>

      {/* Card Content */}
      <div className="relative z-20 p-6 pb-8 flex flex-col h-full justify-between font-sans">

        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg border border-amber-300 text-library-900">
              <LibraryIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-amber-500 tracking-wide leading-none">BiblioSearch</h3>
              <p className="text-[9px] text-library-200 font-medium tracking-[0.2em] uppercase mt-1">Academic Access</p>
            </div>
          </div>
          {/* Chip Icon */}
          <div className="w-10 h-8 bg-gradient-to-tr from-amber-200 to-amber-500 rounded border border-amber-600 shadow-sm opacity-90 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-amber-700/50"></div>
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-amber-700/50"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-amber-700/50 rounded-sm"></div>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-1 flex flex-col justify-center py-2">
          <div className="text-xs text-library-400 uppercase tracking-wider mb-1">Scholar ID</div>
          <div className="text-xl md:text-2xl font-mono text-white tracking-widest drop-shadow-md font-medium">
            {user.studentId || '••••-••••-••••'}
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-amber-500/50 shadow-lg bg-library-800 relative">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
              ) : (
                <UserIcon className="w-full h-full p-3 text-library-600" />
              )}
              {/* Watermark overlay on photo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent pointer-events-none"></div>
            </div>
            <div>
              <p className="text-[10px] text-library-400 uppercase tracking-wider mb-0.5">Scholar Name</p>
              <p className="text-sm font-serif font-bold text-white tracking-wide">{user.name || 'Unknown'}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-amber-200 font-medium border border-white/5">{user.level || 'Student'}</span>
                <span className="text-[9px] text-library-300 font-medium">{user.department || 'General'}</span>
              </div>
            </div>
          </div>

          {showStatus && (
            <div className="text-right flex flex-col items-end">
              <div className="mb-1">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BiblioSearch-Valid" alt="QR" className="w-8 h-8 opacity-80 mix-blend-screen invert" />
              </div>
              <div className="flex items-center justify-end gap-1.5 bg-emerald-900/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[8px] font-bold text-emerald-300 tracking-wider">VALID</span>
              </div>
            </div>
          )}
        </div>

        {/* Holographic Sheen (Only if interactive) */}
        {interactive && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 opacity-30 pointer-events-none group-hover:opacity-50 transition-opacity"></div>}
      </div>
    </div>
  );
};
