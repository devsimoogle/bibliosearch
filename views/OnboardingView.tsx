
import React, { useState, useEffect } from 'react';
import { University } from '../types';
import * as db from '../services/databaseService';
import { SchoolIcon, GlobeIcon, UserIcon, CameraIcon, ChevronRightIcon, IdCardIcon, AdminIcon, DownloadIcon } from '../components/Icons';
import { LibraryIdCard } from '../components/LibraryIdCard';
import { Confetti } from '../components/Confetti';

export const OnboardingView = ({ onComplete, onAdminLogin }: { onComplete: () => void, onAdminLogin?: () => void }) => {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUni, setSelectedUni] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [level, setLevel] = useState('100lvl');
  const [avatar, setAvatar] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  useEffect(() => {
    // Auto-detect country
    setLoading(true);
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_name) {
          setCountry(data.country_name);
          fetchUnis(data.country_name);
        }
      })
      .catch(() => {
        setCountry('Nigeria');
        fetchUnis('Nigeria');
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchUnis = async (c: string) => {
    const unis = await db.fetchUniversitiesFromAPI(c);
    setUniversities(unis);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
    fetchUnis(e.target.value);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerateId = () => {
    const id = db.generateStudentId(selectedUni);
    setGeneratedId(id);
    setStep(4);
    setShowConfetti(true);
  };

  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 378;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 600, 378);
    grad.addColorStop(0, '#2a3a36');
    grad.addColorStop(1, '#38554e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 378);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px serif';
    ctx.fillText('BiblioSearch', 80, 50);

    ctx.fillStyle = '#c5d9d3';
    ctx.font = '10px sans-serif';
    ctx.fillText('ACADEMIC ACCESS', 80, 65);

    ctx.fillStyle = '#75a094';
    ctx.font = '14px sans-serif';
    ctx.fillText('SCHOLAR ID', 40, 160);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(generatedId, 40, 200);

    ctx.fillStyle = '#75a094';
    ctx.font = '12px sans-serif';
    ctx.fillText('SCHOLAR NAME', 140, 300);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px serif';
    ctx.fillText(name || 'SCHOLAR', 140, 325);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${level} • ${dept}`, 140, 345);

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(40, 280, 80, 80);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 280, 80, 80);

    const link = document.createElement('a');
    link.download = `BiblioSearch-ID-${generatedId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleFinish = () => {
    db.completeOnboarding({
      name,
      country,
      universityId: selectedUni,
      department: dept,
      level,
      avatar,
      studentId: generatedId
    });
    // This callback will trigger App.tsx to set state to HOME
    onComplete();
  };

  const handleGuestAccess = () => {
    db.createGuestProfile();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-library-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      {showConfetti && <Confetti />}

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative animate-scale-up">

        {step < 4 && (
          <div className="h-2 bg-gray-100 w-full shrink-0">
            <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        )}

        <div className="p-5 md:p-8 flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="animate-fade-in space-y-6 flex flex-col h-full">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-amber-600">
                  <GlobeIcon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Where are you studying?</h2>
                <p className="text-gray-500 mt-2">We'll personalize your library resources.</p>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                  <input value={country} onChange={handleCountryChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-library-500" placeholder="Enter Country..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">University</label>
                  <div className="relative">
                    <SchoolIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <select value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-library-500 cursor-pointer" disabled={loading}>
                      <option value="">{loading ? 'Detecting...' : 'Select University...'}</option>
                      {universities.map((u, i) => <option key={i} value={u.name}>{u.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-auto pt-4 md:pt-6">
                <button onClick={() => setStep(2)} disabled={!selectedUni} className="w-full bg-library-900 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-library-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">Continue <ChevronRightIcon className="w-5 h-5" /></button>
                <button onClick={handleGuestAccess} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer">Quick Guest Access</button>
                {onAdminLogin && <button onClick={onAdminLogin} className="w-full py-3 text-library-500 hover:text-library-800 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-library-50 rounded-xl transition-colors cursor-pointer"><AdminIcon className="w-4 h-4" /> Librarian Login</button>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-blue-600"><IdCardIcon className="w-6 h-6 md:w-8 md:h-8" /></div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Academic Profile</h2>
                <p className="text-gray-500 mt-2">Tell us about your course of study.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                  <input value={dept} onChange={(e) => setDept(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-library-500" placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-library-500 cursor-pointer">
                    {['100lvl', '200lvl', '300lvl', '400lvl', '500lvl', '600lvl', 'MSc', 'PhD', 'Staff'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-4 text-gray-500 font-medium hover:bg-gray-50 rounded-xl cursor-pointer">Back</button>
                <button onClick={() => setStep(3)} disabled={!dept} className="flex-1 bg-library-900 text-white py-4 rounded-xl font-bold hover:bg-library-800 transition-all disabled:opacity-50 cursor-pointer">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-green-600"><UserIcon className="w-6 h-6 md:w-8 md:h-8" /></div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Identity Setup</h2>
                <p className="text-gray-500 mt-2">Personalize your library ID card.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4 group cursor-pointer hover:border-amber-300 transition-colors">
                  {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><UserIcon className="w-16 h-16" /></div>}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs"><CameraIcon className="w-6 h-6 mb-1" /><input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} /></label>
                </div>
                <div className="w-full">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preferred Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none font-medium text-center text-lg focus:ring-2 focus:ring-library-500" placeholder="Your Name" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="px-6 py-4 text-gray-500 font-medium hover:bg-gray-50 rounded-xl cursor-pointer">Back</button>
                <button onClick={handleGenerateId} disabled={!name} className="flex-1 bg-library-900 text-white py-4 rounded-xl font-bold hover:bg-library-800 transition-all disabled:opacity-50 shadow-lg shadow-library-200/50 cursor-pointer">Generate ID</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-scale-up text-center space-y-4 py-2 flex flex-col items-center justify-center h-full">
              <div>
                <h2 className="text-2xl font-serif font-bold text-library-900 mb-1">You are now a BiblioSearch Scholar</h2>
                <p className="text-amber-600 font-mono text-sm font-medium">Access Granted</p>
              </div>

              <div className="py-2 w-full flex justify-center">
                <LibraryIdCard
                  user={{ name, studentId: generatedId, level, department: dept, avatar, universityId: selectedUni }}
                  interactive={false}
                />
              </div>

              <div className="pt-2 space-y-3 w-full">
                <button
                  onClick={handleDownloadCard}
                  className="w-full bg-white text-library-900 border border-library-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <DownloadIcon className="w-5 h-5 text-amber-500" /> Save ID Card
                </button>
                <button
                  onClick={handleFinish}
                  className="w-full bg-library-900 text-white py-4 rounded-xl font-bold text-xl hover:shadow-xl transition-all shadow-lg shadow-library-200 cursor-pointer"
                >
                  Enter Library
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
