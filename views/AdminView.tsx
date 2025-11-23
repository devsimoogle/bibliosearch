
import React, { useState, useEffect } from 'react';
import * as db from '../services/databaseService';
import { Lecturer, University, Student, LLMConfig } from '../types';
import { AdminIcon, PlusIcon, UserIcon, SchoolIcon, BriefcaseIcon, XIcon, UsersIcon, DashboardIcon, SettingsIcon, KeyIcon, ChipIcon, CheckCircleIcon, ServerIcon, CpuIcon, LogoutIcon, SearchIcon, EditIcon, TrashIcon } from '../components/Icons';

type AdminTab = 'OVERVIEW' | 'STUDENTS' | 'LECTURERS' | 'SYSTEM';

// Menu Icon for Mobile
const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" x2="21" y1="6" y2="6" />
    <line x1="3" x2="21" y1="12" y2="12" />
    <line x1="3" x2="21" y1="18" y2="18" />
  </svg>
);

export const AdminView = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Search States
  const [studentSearch, setStudentSearch] = useState('');
  const [lecturerSearch, setLecturerSearch] = useState('');

  // Lecturer Form State (Add/Edit)
  const [isEditingLec, setIsEditingLec] = useState(false);
  const [editingLecId, setEditingLecId] = useState<string | null>(null);
  
  const [lecName, setLecName] = useState('');
  const [lecUniId, setLecUniId] = useState('');
  const [lecDept, setLecDept] = useState('');
  const [lecEmail, setLecEmail] = useState('');
  const [lecExpertise, setLecExpertise] = useState('');

  // System Settings State
  const [config, setConfig] = useState<LLMConfig>(db.getLLMConfig());

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setLecturers(db.getLecturers());
    setStudents(db.getAllStudents());
    setUniversities(db.getUniversities());
  };

  const openAddLecturer = () => {
    setEditingLecId(null);
    setLecName(''); setLecUniId(''); setLecDept(''); setLecEmail(''); setLecExpertise('');
    setIsEditingLec(true);
  };

  const openEditLecturer = (lec: Lecturer) => {
    setEditingLecId(lec.id);
    setLecName(lec.name);
    setLecUniId(lec.universityId);
    setLecDept(lec.department);
    setLecEmail(lec.email);
    setLecExpertise(lec.expertise.join(', '));
    setIsEditingLec(true);
  };

  const handleDeleteLecturer = (id: string) => {
    if (confirm("Are you sure you want to remove this lecturer?")) {
      const updated = lecturers.filter(l => l.id !== id);
      localStorage.setItem('biblio_db_lecturers', JSON.stringify(updated));
      refreshData();
    }
  };

  const handleSaveLecturer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecName || !lecUniId || !lecDept) return;
    
    let updatedList = [...lecturers];
    const newLecturer: Lecturer = {
      id: editingLecId || `lec_${Date.now()}`,
      name: lecName,
      universityId: lecUniId,
      department: lecDept,
      email: lecEmail,
      expertise: lecExpertise.split(',').map(s => s.trim())
    };

    if (editingLecId) {
       updatedList = updatedList.map(l => l.id === editingLecId ? newLecturer : l);
       db.logActivity('ADMIN', `Updated lecturer: ${newLecturer.name}`);
    } else {
       updatedList.push(newLecturer);
       db.logActivity('ADMIN', `Added new lecturer: ${newLecturer.name}`);
    }
    
    localStorage.setItem('biblio_db_lecturers', JSON.stringify(updatedList));
    refreshData();
    setIsEditingLec(false);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateLLMConfig({ apiKeys: config.apiKeys });
    alert("System keys updated securely.");
  };

  const selectModel = (modelId: string) => {
    setConfig(prev => ({ ...prev, activeModelId: modelId }));
    db.updateLLMConfig({ activeModelId: modelId });
  };

  const getUniName = (id: string) => universities.find(u => u.id === id)?.name || id;

  const getProviderIcon = (provider: string) => {
    switch(provider) {
      case 'google': return <ServerIcon className="w-5 h-5 text-blue-500"/>;
      case 'groq': return <ChipIcon className="w-5 h-5 text-orange-500"/>;
      case 'sambanova': return <CpuIcon className="w-5 h-5 text-purple-500"/>;
      default: return <ServerIcon className="w-5 h-5 text-gray-500"/>;
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
    (s.studentId && s.studentId.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const filteredLecturers = lecturers.filter(l => 
    l.name.toLowerCase().includes(lecturerSearch.toLowerCase()) ||
    l.department.toLowerCase().includes(lecturerSearch.toLowerCase())
  );

  const SidebarItem = ({ tab, icon, label }: { tab: AdminTab, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => { setActiveTab(tab); setShowSidebar(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === tab ? 'bg-amber-500 text-white shadow-md' : 'text-library-200 hover:bg-library-800'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-library-900 animate-fade-in font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-library-900 border-b border-library-800 p-4 z-40 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
           <AdminIcon className="w-6 h-6 text-white" />
           <span className="font-serif font-bold text-white">Admin Console</span>
        </div>
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-white p-2 hover:bg-library-800 rounded">
           {showSidebar ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {showSidebar && <div className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setShowSidebar(false)}></div>}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-library-900 border-r border-library-800 p-6 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex items-center gap-3 mb-10 px-2">
           <div className="bg-white p-2 rounded-lg shadow-lg">
             <AdminIcon className="w-6 h-6 text-library-900" />
           </div>
           <div>
             <h2 className="text-white font-serif font-bold text-lg leading-tight">Admin<br/>Console</h2>
           </div>
        </div>
        {/* Mobile Sidebar Header */}
        <div className="md:hidden mb-8 mt-16 px-2">
            <h2 className="text-white font-serif font-bold text-xl">Menu</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem tab="OVERVIEW" icon={<DashboardIcon className="w-5 h-5"/>} label="Overview" />
          <SidebarItem tab="STUDENTS" icon={<UsersIcon className="w-5 h-5"/>} label="Students" />
          <SidebarItem tab="LECTURERS" icon={<BriefcaseIcon className="w-5 h-5"/>} label="Lecturers" />
          <div className="pt-4 mt-4 border-t border-library-800">
             <SidebarItem tab="SYSTEM" icon={<SettingsIcon className="w-5 h-5"/>} label="System Config" />
          </div>
        </nav>

        <button onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-100 hover:bg-red-900/30 rounded-xl transition-colors mt-auto cursor-pointer">
          <LogoutIcon className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-library-50 flex flex-col h-full overflow-hidden w-full pt-16 md:pt-0">
        <header className="hidden md:flex bg-white border-b border-gray-200 px-8 py-5 shadow-sm justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold text-gray-800 font-serif">
            {activeTab === 'OVERVIEW' && 'System Overview'}
            {activeTab === 'STUDENTS' && 'Student Directory'}
            {activeTab === 'LECTURERS' && 'Faculty Management'}
            {activeTab === 'SYSTEM' && 'AI Model & Key Configuration'}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             System Online
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><UsersIcon className="w-6 h-6"/></div>
                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Students</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900">{students.length}</div>
                  <div className="text-sm text-green-500 mt-2 font-medium">+ New registrations this week</div>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><BriefcaseIcon className="w-6 h-6"/></div>
                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Lecturers</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900">{lecturers.length}</div>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><SchoolIcon className="w-6 h-6"/></div>
                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Universities</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900">{universities.length}</div>
               </div>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'STUDENTS' && (
             <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                   <div className="relative w-full max-w-md">
                      <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        <tr>
                          <th className="p-5">Student</th>
                          <th className="p-5">ID Number</th>
                          <th className="p-5">Department</th>
                          <th className="p-5">Level</th>
                          <th className="p-5">Status</th>
                          <th className="p-5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map((stu, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="p-5 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                {stu.avatar ? <img src={stu.avatar} className="w-full h-full object-cover"/> : <UserIcon className="w-full h-full p-2 text-gray-400"/>}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">{stu.name}</div>
                                <div className="text-xs text-gray-500">{stu.universityId}</div>
                              </div>
                            </td>
                            <td className="p-5 font-mono text-sm text-gray-600">{stu.studentId || 'N/A'}</td>
                            <td className="p-5 text-sm text-gray-700">{stu.department || '-'}</td>
                            <td className="p-5 text-sm text-gray-700">{stu.level || '-'}</td>
                            <td className="p-5">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span>
                            </td>
                            <td className="p-5 flex gap-2">
                               <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><EditIcon className="w-4 h-4"/></button>
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No student records found.</td></tr>}
                      </tbody>
                    </table>
                </div>
             </div>
          )}

          {/* LECTURERS TAB */}
          {activeTab === 'LECTURERS' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full max-w-md">
                   <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Search lecturers..." 
                     value={lecturerSearch}
                     onChange={(e) => setLecturerSearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                   />
                </div>
                <button 
                  onClick={openAddLecturer}
                  className="bg-library-900 hover:bg-library-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-md transition-all whitespace-nowrap"
                >
                  <PlusIcon className="w-4 h-4" /> Add New Lecturer
                </button>
              </div>

              {isEditingLec && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                  <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl border border-amber-200 animate-scale-up max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                      <h4 className="font-bold text-gray-800 text-lg">{editingLecId ? 'Edit Lecturer Profile' : 'New Lecturer Profile'}</h4>
                      <button onClick={() => setIsEditingLec(false)}><XIcon className="w-5 h-5 text-gray-400 hover:text-red-500"/></button>
                    </div>
                    <form onSubmit={handleSaveLecturer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Name</label><input className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none" value={lecName} onChange={e=>setLecName(e.target.value)} required/></div>
                       <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">University</label><select className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none" value={lecUniId} onChange={e=>setLecUniId(e.target.value)} required><option value="">Select...</option>{universities.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Department</label><input className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none" value={lecDept} onChange={e=>setLecDept(e.target.value)} required/></div>
                       <div><label className="text-xs font-bold text-gray-500 uppercase">Email</label><input className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none" value={lecEmail} onChange={e=>setLecEmail(e.target.value)}/></div>
                       <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Expertise (Comma separated)</label><input className="w-full border rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none" value={lecExpertise} onChange={e=>setLecExpertise(e.target.value)} placeholder="e.g. AI, Robotics"/></div>
                       <div className="md:col-span-2 flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                         <button type="button" onClick={()=>setIsEditingLec(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                         <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium">Save Profile</button>
                       </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <tr><th className="p-5">Name</th><th className="p-5">University</th><th className="p-5">Department</th><th className="p-5">Expertise</th><th className="p-5">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredLecturers.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50">
                        <td className="p-5 font-bold text-gray-900">{l.name}</td>
                        <td className="p-5 text-gray-500">{getUniName(l.universityId)}</td>
                        <td className="p-5">{l.department}</td>
                        <td className="p-5"><div className="flex gap-1 flex-wrap">{l.expertise.map((x,i)=><span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{x}</span>)}</div></td>
                        <td className="p-5 flex gap-2">
                           <button onClick={() => openEditLecturer(l)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><EditIcon className="w-4 h-4"/></button>
                           <button onClick={() => handleDeleteLecturer(l.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><TrashIcon className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    ))}
                    {filteredLecturers.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No lecturers found matching your search.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SYSTEM CONFIG TAB */}
          {activeTab === 'SYSTEM' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Models */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><ChipIcon className="w-5 h-5 text-amber-500"/> AI Processors</h3>
                 <p className="text-sm text-gray-600 mb-6">Select the underlying intelligence model for the library search engine.</p>
                 <div className="space-y-3">
                  {db.AVAILABLE_MODELS.map((model) => (
                    <div 
                      key={model.id}
                      onClick={() => selectModel(model.id)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${config.activeModelId === model.id ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    >
                      <div className="bg-white p-2 border border-gray-200 rounded-lg">{getProviderIcon(model.provider)}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm">{model.name}</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">{model.provider} {model.requiresTavily && '• Uses Web'}</p>
                      </div>
                      {config.activeModelId === model.id && <CheckCircleIcon className="w-5 h-5 text-amber-500" />}
                    </div>
                  ))}
                 </div>
              </div>

              {/* Keys */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><KeyIcon className="w-5 h-5 text-blue-500"/> API Gateway</h3>
                 <form onSubmit={handleSaveKeys} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Google Gemini API Key</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
                        placeholder="AIza..."
                        value={config.apiKeys.google || ''}
                        onChange={(e) => setConfig({...config, apiKeys: {...config.apiKeys, google: e.target.value}})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tavily Search API Key <span className="text-amber-600">(Required for Groq/Mistral)</span></label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono"
                        placeholder="tvly-..."
                        value={config.apiKeys.tavily || ''}
                        onChange={(e) => setConfig({...config, apiKeys: {...config.apiKeys, tavily: e.target.value}})}
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-3">Other Providers</p>
                      {['groq', 'sambanova', 'mistral', 'nebius'].map((provider) => (
                        <div key={provider} className="mb-3">
                           <input 
                             type="password" 
                             className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-amber-500 outline-none text-xs font-mono"
                             placeholder={`${provider.charAt(0).toUpperCase() + provider.slice(1)} Key`}
                             // @ts-ignore
                             value={config.apiKeys[provider] || ''}
                             // @ts-ignore
                             onChange={(e) => setConfig({...config, apiKeys: {...config.apiKeys, [provider]: e.target.value}})}
                           />
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="w-full bg-library-800 text-white py-3 rounded-xl font-bold hover:bg-library-900 transition-colors shadow-lg">Update Secure Credentials</button>
                 </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
