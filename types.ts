
export enum AppState {
  HOME = 'HOME',
  SEARCHING = 'SEARCHING',
  RESULTS = 'RESULTS',
  PROFILE = 'PROFILE', 
  ADMIN = 'ADMIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ONBOARDING = 'ONBOARDING',
  SETTINGS = 'SETTINGS'
}

export type AIProvider = 'google' | 'groq' | 'sambanova' | 'nebius' | 'mistral' | 'openrouter';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  requiresTavily: boolean;
}

export interface LLMConfig {
  activeModelId: string;
  apiKeys: {
    google?: string;
    groq?: string;
    sambanova?: string;
    nebius?: string;
    mistral?: string;
    openrouter?: string;
    tavily?: string;
  }
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
    content?: string; // Added for context
  };
}

export interface LibraryResource {
  title: string;
  author: string;
  year: string;
  type: 'Book' | 'Journal' | 'Article' | 'Media';
  isbn?: string;
  description: string;
  coverImage?: string; // For generated 3D cover colors
  color?: string;
  matchReason?: string; // Why this was recommended
}

export interface ContentSection {
  heading: string;
  body: string;
}

export interface University {
  id: string; 
  name: string;
  country?: string;
  domains?: string[];
  web_pages?: string[];
  location?: string; 
}

export interface Lecturer {
  id: string;
  name: string;
  universityId: string;
  department: string;
  email: string;
  expertise: string[];
}

export interface SearchResponse {
  synthesis: ContentSection[]; 
  webSources: GroundingChunk[];
  libraryResources: LibraryResource[];
  lecturers?: Lecturer[]; 
  relatedTopics: string[]; 
}

export interface CatalogResult {
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  isbn: string;
  ddc: string;
  lcc: string;
  subjects: string[];
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingChunk[];
}

export interface Suggestion {
  text: string;
  type: 'Topic' | 'Title' | 'Author';
}

export interface UserProfile {
  id: string;
  studentId?: string; // Generated ID (e.g., UNILAG-2024-001)
  name: string;
  role: string;
  department?: string;
  level?: string;
  country?: string; 
  universityId?: string; 
  institution: string;
  avatar?: string; // Base64 image
  joinedDate: string;
  searchesCount: number;
  savedItemsCount: number;
  isAdmin?: boolean; 
  isSetupComplete?: boolean;
  hasSeenWalkthrough?: boolean;
}

export interface Student extends UserProfile {
  // Extended student interface for Admin view
  status: 'Active' | 'Inactive';
}

export interface ActivityLog {
  id: string;
  action: 'SEARCH' | 'SAVE' | 'VIEW' | 'REQUEST' | 'ADMIN' | 'LOGIN';
  details: string;
  timestamp: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
