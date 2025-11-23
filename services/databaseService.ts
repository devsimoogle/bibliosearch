
import { SearchResponse, UserProfile, ActivityLog, University, Lecturer, Student, LLMConfig, AIModel, LibraryResource } from "../types";

const DB_KEYS = {
  USER: 'biblio_db_user',
  CACHE: 'biblio_db_cache',
  ACTIVITY: 'biblio_db_activity',
  LECTURERS: 'biblio_db_lecturers',
  STUDENTS: 'biblio_db_students',
  LLM_CONFIG: 'biblio_db_llm_config'
};

// Configured with provided keys to resolve 429 errors immediately
const DEFAULT_LLM_CONFIG: LLMConfig = {
  activeModelId: 'openai/gpt-oss-20b', // Default to Nebius new model
  apiKeys: {
    google: process.env.API_KEY || '',
    nebius: 'v1.CmQKHHN0YXRpY2tleS1lMDBjcGQ4N2dmYmVhOHdjanMSIXNlcnZpY2VhY2NvdW50LWUwMHYwZ2F2eXhxOTdzNzdoeDIMCLjKi8kGEJWB6c8BOgwItc2jlAcQgKuhhgJAAloDZTAw.AAAAAAAAAAFqYKQEpISohUqUf-_VyTXrDrMWqZs1FHA01KKtOLFMBccuGdCLykcqqTnsiwoZvQgVbwLOADzBj0o8QWozcyMG',
    tavily: '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'
  }
};

export const AVAILABLE_MODELS: AIModel[] = [
  { id: 'openai/gpt-oss-20b', name: 'Nebius (GPT-OSS 20B)', provider: 'nebius', requiresTavily: true },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'google', requiresTavily: false },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', requiresTavily: false },
  { id: 'llama3-70b-8192', name: 'Llama 3 70B (Groq)', provider: 'groq', requiresTavily: true },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Groq)', provider: 'groq', requiresTavily: true },
  { id: 'Meta-Llama-3.1-405B-Instruct', name: 'Llama 3.1 405B (Sambanova)', provider: 'sambanova', requiresTavily: true },
  { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'mistral', requiresTavily: true },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (OpenRouter)', provider: 'openrouter', requiresTavily: true },
  { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Llama 3 8B (OpenRouter Free)', provider: 'openrouter', requiresTavily: true },
];

const UNIVERSITIES: University[] = [
  // NIGERIA
  { id: 'University of Lagos', name: 'University of Lagos', country: 'Nigeria', location: 'Lagos' },
  { id: 'University of Ibadan', name: 'University of Ibadan', country: 'Nigeria', location: 'Ibadan' },
  { id: 'Obafemi Awolowo University', name: 'Obafemi Awolowo University', country: 'Nigeria', location: 'Ile-Ife' },
  { id: 'Ahmadu Bello University', name: 'Ahmadu Bello University', country: 'Nigeria', location: 'Zaria' },
  { id: 'University of Nigeria', name: 'University of Nigeria', country: 'Nigeria', location: 'Nsukka' },
  { id: 'Covenant University', name: 'Covenant University', country: 'Nigeria', location: 'Ota' },
  { id: 'Babcock University', name: 'Babcock University', country: 'Nigeria', location: 'Ilishan-Remo' },
  { id: 'Lagos State University', name: 'Lagos State University', country: 'Nigeria', location: 'Ojo' },
  { id: 'University of Ilorin', name: 'University of Ilorin', country: 'Nigeria', location: 'Ilorin' },
  { id: 'Federal University of Technology Akure', name: 'Federal University of Technology Akure', country: 'Nigeria', location: 'Akure' },
  { id: 'Federal University of Technology Minna', name: 'Federal University of Technology Minna', country: 'Nigeria', location: 'Minna' },
  { id: 'University of Benin', name: 'University of Benin', country: 'Nigeria', location: 'Benin City' },
  { id: 'University of Port Harcourt', name: 'University of Port Harcourt', country: 'Nigeria', location: 'Port Harcourt' },
  { id: 'Landmark University', name: 'Landmark University', country: 'Nigeria', location: 'Omu-Aran' },
  { id: 'Afe Babalola University', name: 'Afe Babalola University', country: 'Nigeria', location: 'Ado-Ekiti' },
  { id: 'Bayero University Kano', name: 'Bayero University Kano', country: 'Nigeria', location: 'Kano' },
  { id: 'Nnamdi Azikiwe University', name: 'Nnamdi Azikiwe University', country: 'Nigeria', location: 'Awka' },
  { id: 'University of Jos', name: 'University of Jos', country: 'Nigeria', location: 'Jos' },
  { id: 'University of Maiduguri', name: 'University of Maiduguri', country: 'Nigeria', location: 'Maiduguri' },
  { id: 'Pan-Atlantic University', name: 'Pan-Atlantic University', country: 'Nigeria', location: 'Lagos' },
  { id: 'University of Reading', name: 'University of Reading', country: 'United Kingdom', location: 'Reading' },
  { id: 'Oxford University', name: 'Oxford University', country: 'United Kingdom', location: 'UK' },
  { id: 'Harvard University', name: 'Harvard University', country: 'United States', location: 'USA' }
];

const INITIAL_LECTURERS: Lecturer[] = [
  { id: 'lec_001', name: 'Dr. Emily Carter', universityId: 'Oxford University', department: 'Information Science', email: 'e.carter@ox.ac.uk', expertise: ['Digital Archiving', 'Metadata'] },
  { id: 'lec_002', name: 'Prof. John Smith', universityId: 'Harvard University', department: 'Computer Science', email: 'jsmith@harvard.edu', expertise: ['AI in Libraries', 'Information Retrieval'] },
  { id: 'lec_003', name: 'Dr. Chioma Okonkwo', universityId: 'University of Lagos', department: 'Library Studies', email: 'cokonkwo@unilag.edu.ng', expertise: ['African Archives', 'Knowledge Management'] },
  { id: 'lec_004', name: 'Prof. Tunde Bakare', universityId: 'Covenant University', department: 'Computer Engineering', email: 't.bakare@covenant.edu.ng', expertise: ['Network Security', 'IoT'] }
];

const INITIAL_USER: UserProfile = {
  id: 'usr_init',
  name: 'New Scholar',
  role: 'Student',
  institution: '',
  joinedDate: new Date().toLocaleDateString(),
  searchesCount: 0,
  savedItemsCount: 0,
  isAdmin: false,
  isSetupComplete: false,
  hasSeenWalkthrough: false
};

// Safe JSON parse helper
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to parse ${key}, resetting to default.`);
    localStorage.removeItem(key);
    return fallback;
  }
};

const initDB = () => {
  if (!localStorage.getItem(DB_KEYS.USER)) {
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(INITIAL_USER));
  }
  
  // Validate existing config or merge
  const storedConfig = localStorage.getItem(DB_KEYS.LLM_CONFIG);
  if (!storedConfig) {
    localStorage.setItem(DB_KEYS.LLM_CONFIG, JSON.stringify(DEFAULT_LLM_CONFIG));
  } else {
    try {
      const current = JSON.parse(storedConfig);
      let needsUpdate = false;
      if (!current.apiKeys.nebius && DEFAULT_LLM_CONFIG.apiKeys.nebius) {
        current.apiKeys.nebius = DEFAULT_LLM_CONFIG.apiKeys.nebius;
        current.apiKeys.tavily = DEFAULT_LLM_CONFIG.apiKeys.tavily;
        needsUpdate = true;
      }
      if (current.activeModelId === 'Meta-Llama-3.1-70B-Instruct') {
        current.activeModelId = DEFAULT_LLM_CONFIG.activeModelId;
        needsUpdate = true;
      }
      if (needsUpdate) localStorage.setItem(DB_KEYS.LLM_CONFIG, JSON.stringify(current));
    } catch (e) {
      localStorage.setItem(DB_KEYS.LLM_CONFIG, JSON.stringify(DEFAULT_LLM_CONFIG));
    }
  }
};

// --- LLM CONFIG ---
export const getLLMConfig = (): LLMConfig => {
  initDB();
  return safeParse(DB_KEYS.LLM_CONFIG, DEFAULT_LLM_CONFIG);
};

export const updateLLMConfig = (updates: Partial<LLMConfig>): LLMConfig => {
  const current = getLLMConfig();
  const updated = { ...current, ...updates };
  if (updates.apiKeys) {
    updated.apiKeys = { ...current.apiKeys, ...updates.apiKeys };
  }
  localStorage.setItem(DB_KEYS.LLM_CONFIG, JSON.stringify(updated));
  return updated;
};

// --- USER ---
export const getUserProfile = (): UserProfile => {
  initDB();
  return safeParse(DB_KEYS.USER, INITIAL_USER);
};

export const updateUserProfile = (updates: Partial<UserProfile>): UserProfile => {
  const user = getUserProfile();
  const updatedUser = { ...user, ...updates };
  localStorage.setItem(DB_KEYS.USER, JSON.stringify(updatedUser));
  return updatedUser;
};

export const markWalkthroughSeen = () => {
  const user = getUserProfile();
  user.hasSeenWalkthrough = true;
  localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
  return user;
};

export const generateStudentId = (universityName: string): string => {
  initDB();
  const uniCode = universityName ? universityName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'LIB') : 'LIB';
  const year = new Date().getFullYear();
  
  const students: Student[] = safeParse(DB_KEYS.STUDENTS, []);
  const existingIds = new Set(students.map(s => s.studentId));

  let studentId = '';
  let uniqueFound = false;
  let attempts = 0;

  while (!uniqueFound && attempts < 50) {
    const rand = Math.floor(100 + Math.random() * 900);
    const candidateId = `${uniCode}-${year}-${rand}`;
    if (!existingIds.has(candidateId)) {
      studentId = candidateId;
      uniqueFound = true;
    }
    attempts++;
  }

  if (!studentId) {
    studentId = `${uniCode}-${year}-${Date.now().toString().slice(-4)}`;
  }
  
  return studentId;
};

export const createGuestProfile = (): UserProfile => {
  const guestData = {
    name: "Guest Scholar",
    universityId: "Open Access",
    department: "General Studies",
    level: "Visitor",
    studentId: `GUEST-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`
  };
  return completeOnboarding(guestData);
};

export const completeOnboarding = (data: Partial<UserProfile>): UserProfile => {
  const user = getUserProfile();
  const studentId = data.studentId || generateStudentId(data.universityId || '');

  const finalizedUser: UserProfile = {
    ...user,
    ...data,
    id: `usr_${Date.now()}`,
    studentId: studentId,
    isSetupComplete: true,
    joinedDate: new Date().toLocaleDateString()
  };

  localStorage.setItem(DB_KEYS.USER, JSON.stringify(finalizedUser));
  
  initDB();
  const students: Student[] = safeParse(DB_KEYS.STUDENTS, []);
  students.push({ ...finalizedUser, status: 'Active' });
  localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));

  return finalizedUser;
};

export const getAllStudents = (): Student[] => {
  initDB();
  return safeParse(DB_KEYS.STUDENTS, []);
};

export const updateUserStats = (incrementSearch = false, incrementSaved = false) => {
  const user = getUserProfile();
  if (incrementSearch) user.searchesCount += 1;
  if (incrementSaved) user.savedItemsCount += 1;
  localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
  return user;
};

// --- UNIVERSITIES ---
export const getUniversities = (): University[] => UNIVERSITIES;

export const fetchUniversitiesFromAPI = async (country: string): Promise<University[]> => {
  try {
    const response = await fetch(`https://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    if (!response.ok) throw new Error("API Failed");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((u: any) => ({
        id: u.name, name: u.name, country: u.country, domains: u.domains, web_pages: u.web_pages
      }));
    }
  } catch (e) {
    console.warn("External University API failed, using fallback.");
  }
  return UNIVERSITIES.filter(u => !country || (u.country && u.country.toLowerCase().includes(country.toLowerCase())));
};

// --- LECTURERS ---
export const getLecturers = (): Lecturer[] => {
  initDB();
  return safeParse(DB_KEYS.LECTURERS, INITIAL_LECTURERS);
};

export const addLecturer = (lecturer: Lecturer) => {
  const lecturers = getLecturers();
  lecturers.push(lecturer);
  localStorage.setItem(DB_KEYS.LECTURERS, JSON.stringify(lecturers));
};

export const searchLecturers = (query: string): Lecturer[] => {
  const lecturers = getLecturers();
  const q = query.toLowerCase();
  return lecturers.filter(l => l.name.toLowerCase().includes(q) || l.department.toLowerCase().includes(q) || l.expertise.some(e => e.toLowerCase().includes(q)));
};

export const getCampusPicks = (user: UserProfile): LibraryResource[] => {
  const resources: LibraryResource[] = [];
  const dept = user.department?.toLowerCase() || '';
  const level = user.level?.toLowerCase() || '';
  const uni = user.institution || user.universityId || '';

  if (uni) {
    resources.push({
      title: `The History of ${uni}`,
      author: `${uni} Press`,
      year: "2023",
      type: "Book",
      description: `A comprehensive guide to the legacy, traditions, and academic excellence of ${uni}. Essential reading for all new scholars.`,
      matchReason: `Campus History • ${uni}`
    });
    resources.push({
      title: `Student Handbook & Ethics: ${uni}`,
      author: "Student Affairs Division",
      year: "2024",
      type: "Book",
      description: "Official regulations, code of conduct, and academic guidelines for all registered students.",
      matchReason: `Required Reading`
    });
  }

  let levelKeyword = "";
  if (level.includes('100') || level.includes('200')) levelKeyword = "Introduction to";
  else if (level.includes('300') || level.includes('400')) levelKeyword = "Advanced";
  else if (level.includes('500') || level.includes('600')) levelKeyword = "Applied";
  else if (level.includes('msc') || level.includes('phd')) levelKeyword = "Research Methodology in";

  if (dept.includes('computer') || dept.includes('software') || dept.includes('it')) {
    resources.push({
      title: `${levelKeyword} Algorithms & Data Structures`,
      author: "Thomas H. Cormen",
      year: "2022",
      type: "Book",
      description: "The definitive guide to computing algorithms. Covers sorting, graph theory, and complexity analysis.",
      matchReason: `Dept. Recommendation • ${user.department}`
    });
    resources.push({
      title: "Modern Operating Systems",
      author: "Andrew S. Tanenbaum",
      year: "2023",
      type: "Book",
      description: "A deep dive into OS architecture, processes, and memory management.",
      matchReason: `Core Course Material`
    });
  } else if (dept.includes('law') || dept.includes('legal')) {
    resources.push({
      title: `${levelKeyword} Constitutional Law`,
      author: "A. V. Dicey",
      year: "2021",
      type: "Book",
      description: "Fundamental principles of the constitution and the rule of law.",
      matchReason: `Dept. Recommendation • ${user.department}`
    });
  } else if (dept.includes('medic') || dept.includes('health')) {
    resources.push({
      title: "Clinical Anatomy",
      author: "Richard S. Snell",
      year: "2023",
      type: "Book",
      description: "A clinical approach to understanding human anatomy for medical students.",
      matchReason: `Dept. Recommendation • ${user.department}`
    });
  } else {
    resources.push({
      title: `${levelKeyword} Academic Writing & Research`,
      author: "Kate L. Turabian",
      year: "2022",
      type: "Book",
      description: "A manual for writers of research papers, theses, and dissertations.",
      matchReason: `General Requirement • ${user.level}`
    });
  }

  if (level.includes('400') || level.includes('500') || level.includes('msc') || level.includes('phd')) {
    resources.push({
      title: "Statistical Methods for Research",
      author: "C.R. Kothari",
      year: "2023",
      type: "Book",
      description: "Essential statistical techniques for analyzing research data.",
      matchReason: `Thesis Support • ${user.level}`
    });
  }

  return resources;
};

// --- CACHE & LOGS ---
export const getCachedResult = (query: string): SearchResponse | null => {
  initDB();
  return safeParse(DB_KEYS.CACHE, {})[query.toLowerCase().trim()] || null;
};

export const cacheResult = (query: string, data: SearchResponse) => {
  initDB();
  const cache = safeParse(DB_KEYS.CACHE, {});
  cache[query.toLowerCase().trim()] = data;
  localStorage.setItem(DB_KEYS.CACHE, JSON.stringify(cache));
};

export const logActivity = (action: ActivityLog['action'], details: string) => {
  initDB();
  const logs: ActivityLog[] = safeParse(DB_KEYS.ACTIVITY, []);
  const newLog: ActivityLog = { id: Date.now().toString(), action, details, timestamp: Date.now() };
  localStorage.setItem(DB_KEYS.ACTIVITY, JSON.stringify([newLog, ...logs].slice(0, 50)));
};

export const getRecentActivity = (): ActivityLog[] => {
  initDB();
  return safeParse(DB_KEYS.ACTIVITY, []);
};
