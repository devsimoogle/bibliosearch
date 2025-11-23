
import { GoogleGenAI } from "@google/genai";
import { SearchResponse, LibraryResource, CatalogResult, GroundingChunk, Suggestion, ContentSection, AIModel, AIProvider, LLMConfig } from "../types";
import * as db from './databaseService';

// --- UTILS ---

/**
 * Safely parses JSON from LLM responses, cleaning Markdown and partials.
 */
const cleanAndParseJSON = <T>(text: string): T => {
  if (!text) throw new Error("Empty response text");

  // 1. Remove Markdown code blocks
  let cleaned = text.replace(/```json\s*([\s\S]*?)\s*```/g, '$1')
    .replace(/```\s*([\s\S]*?)\s*```/g, '$1')
    .trim();

  // 2. Locate JSON boundaries
  const firstOpenBrace = cleaned.indexOf('{');
  const firstOpenBracket = cleaned.indexOf('[');
  let startIndex = -1;
  if (firstOpenBrace !== -1 && firstOpenBracket !== -1) {
    startIndex = Math.min(firstOpenBrace, firstOpenBracket);
  } else if (firstOpenBrace !== -1) startIndex = firstOpenBrace;
  else if (firstOpenBracket !== -1) startIndex = firstOpenBracket;

  if (startIndex !== -1) {
    const lastCloseBrace = cleaned.lastIndexOf('}');
    const lastCloseBracket = cleaned.lastIndexOf(']');
    const endIndex = Math.max(lastCloseBrace, lastCloseBracket);
    if (endIndex > startIndex) cleaned = cleaned.substring(startIndex, endIndex + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw e;
  }
};

// Returns a safe fallback response so the app doesn't crash on 429
const getQuotaExceededResponse = (): SearchResponse => ({
  synthesis: [{
    heading: "Library Service Notice",
    body: "The automated reference system is currently at maximum capacity. Displaying cached or limited results. Please try your specific inquiry again momentarily."
  }],
  libraryResources: [],
  relatedTopics: [],
  webSources: []
});

const handleApiError = (error: any): SearchResponse => {
  // SILENTLY HANDLE QUOTA ERRORS
  if (
    error.status === 429 ||
    (error.message && error.message.includes('429')) ||
    (error.message && error.message.includes('quota')) ||
    (error.message && error.message.includes('resource exhausted'))
  ) {
    return getQuotaExceededResponse();
  }

  // Return empty structure for other errors to prevent UI crash
  console.warn("LLM Service Error (Silenced):", error);
  return {
    synthesis: [{ heading: "Search Unavailable", body: "We could not complete this specific search request at this time." }],
    libraryResources: [],
    relatedTopics: [],
    webSources: []
  };
};

// --- PROVIDER IMPLEMENTATIONS ---

async function performTavilySearch(query: string, apiKey: string): Promise<GroundingChunk[]> {
  if (!apiKey) return [];
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "advanced", // Use advanced for better results
        include_images: true, // Request images
        include_domains: [],
        max_results: 8,
        include_answer: true
      })
    });
    const data = await response.json();

    return data.results.map((r: any) => ({
      web: {
        uri: r.url,
        title: r.title,
        content: r.content
      }
    }));
  } catch (e) {
    return [];
  }
}

async function fetchOpenAICompatible(
  provider: AIProvider,
  modelId: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  jsonMode: boolean = true
): Promise<string> {
  let baseUrl = '';
  const headers: any = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  switch (provider) {
    case 'groq': baseUrl = 'https://api.groq.com/openai/v1/chat/completions'; break;
    case 'sambanova': baseUrl = 'https://api.sambanova.ai/v1/chat/completions'; break;
    case 'mistral': baseUrl = 'https://api.mistral.ai/v1/chat/completions'; break;
    case 'nebius': baseUrl = 'https://api.studio.nebius.ai/v1/chat/completions'; break;
    case 'openrouter':
      baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
      headers['HTTP-Referer'] = window.location.origin; // Required by OpenRouter
      headers['X-Title'] = 'BiblioSearch';
      break;
    default: throw new Error(`Provider ${provider} not implemented`);
  }

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: jsonMode && provider !== 'openrouter' ? { type: "json_object" } : undefined, // OpenRouter models vary in support
        temperature: 0.3
      })
    });

    if (response.status === 429) {
      throw new Error("429 Quota Exceeded");
    }

    if (!response.ok) {
      // Return a basic string if API fails
      return JSON.stringify({ synthesis: [], libraryResources: [] });
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (e) {
    throw e;
  }
}

// --- MAIN SEARCH LOGIC ---

export const performLibrarySearch = async (query: string): Promise<SearchResponse> => {
  const config = db.getLLMConfig();
  const activeModel = db.AVAILABLE_MODELS.find(m => m.id === config.activeModelId) || db.AVAILABLE_MODELS[0];

  try {
    // 1. GEMINI PIPELINE (Native Grounding)
    if (activeModel.provider === 'google') {
      return await performGeminiSearch(query, activeModel.id, config.apiKeys.google || process.env.API_KEY || '');
    }

    // 2. OPENAI-COMPATIBLE PIPELINE (Tavily Grounding)
    else {
      return await performStandardLLMSearch(query, activeModel, config);
    }

  } catch (error: any) {
    return handleApiError(error);
  }
};

// --- GEMINI SPECIFIC ---

async function performGeminiSearch(query: string, modelId: string, apiKey: string): Promise<SearchResponse> {
  const ai = new GoogleGenAI({ apiKey });

  try {
    const [synthesisRes, resourcesRes] = await Promise.all([
      ai.models.generateContent({
        model: modelId,
        contents: `You are BiblioSearch. Query: "${query}".
        Step 1: Search extensively using Google Search tool.
        Step 2: Synthesize findings into JSON.
        Format: { "sections": [{ "heading": "...", "body": "..." }], "relatedTopics": ["..."] }
        Rules: Use single quotes inside body text. NO HTML. strict JSON. Keep the synthesis CONCISE and to the point. Only expand if the query is complex.`,
        config: { tools: [{ googleSearch: {} }] }
      }),
      ai.models.generateContent({
        model: modelId,
        contents: `List 6 academic resources for: "${query}". JSON array. Items: title, author, year, type, description, isbn (optional).`,
        config: { responseMimeType: "application/json" }
      })
    ]);

    const text = synthesisRes.text || "";
    const sources = synthesisRes.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let parsedSynth: { sections: ContentSection[], relatedTopics: string[] } = { sections: [], relatedTopics: [] };
    try {
      parsedSynth = cleanAndParseJSON(text);
    } catch (e) {
      parsedSynth.sections = [{ heading: "Search Result", body: text }];
    }

    let resources: LibraryResource[] = [];
    try {
      resources = cleanAndParseJSON(resourcesRes.text || "[]");
    } catch (e) { resources = []; }

    return {
      synthesis: parsedSynth.sections || [],
      relatedTopics: parsedSynth.relatedTopics || [],
      webSources: sources,
      libraryResources: resources
    };
  } catch (error: any) {
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      return getQuotaExceededResponse();
    }
    return {
      synthesis: [{ heading: "System Busy", body: "Unable to retrieve real-time data." }],
      libraryResources: [], relatedTopics: [], webSources: []
    };
  }
}

// --- STANDARD LLM (Groq/Sambanova/etc) ---

async function performStandardLLMSearch(query: string, model: AIModel, config: LLMConfig): Promise<SearchResponse> {
  const apiKey = config.apiKeys[model.provider];
  const tavilyKey = config.apiKeys.tavily;

  // Graceful fallback if no key
  if (!apiKey && model.provider !== 'google') {
    return {
      synthesis: [{ heading: "Configuration Required", body: `Please enter your ${model.provider} API Key in the Librarian Dashboard to enable this model.` }],
      libraryResources: [], relatedTopics: [], webSources: []
    };
  }

  let webContext = "";
  let webSources: GroundingChunk[] = [];

  if (model.requiresTavily && tavilyKey) {
    try {
      const results = await performTavilySearch(query, tavilyKey);
      webSources = results;
      // Provide more context to the LLM for better synthesis
      webContext = results.map(r => `Title: ${r.web?.title}\nURL: ${r.web?.uri}\nContent: ${r.web?.content}`).join("\n\n");
    } catch (e) { }
  }

  const systemPrompt = `You are BiblioSearch.
  Context: ${webContext}
  Task: Synthesize a concise academic answer (expand only if necessary) and list 6 academic resources.
  JSON Format:
  {
    "synthesis": [{ "heading": "string", "body": "string" }],
    "libraryResources": [{ "title": "string", "author": "string", "year": "string", "type": "Book"|"Journal", "description": "string", "isbn": "string" }],
    "relatedTopics": ["string"]
  }
  Ensure valid JSON. No Markdown blocks.`;

  try {
    const responseText = await fetchOpenAICompatible(model.provider, model.id, apiKey || '', systemPrompt, query, true);
    const data = cleanAndParseJSON<any>(responseText);
    return {
      synthesis: data.synthesis || [],
      libraryResources: data.libraryResources || [],
      relatedTopics: data.relatedTopics || [],
      webSources: webSources
    };
  } catch (e: any) {
    if (e.message.includes('429')) return getQuotaExceededResponse();
    return { synthesis: [], libraryResources: [], relatedTopics: [], webSources: [] };
  }
}

// --- UTILS ---

export const getSearchSuggestions = async (partialQuery: string): Promise<Suggestion[]> => {
  if (partialQuery.length < 2) return [];
  const config = db.getLLMConfig();
  try {
    if (config.apiKeys.google) {
      const ai = new GoogleGenAI({ apiKey: config.apiKeys.google });
      const res = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `Autosuggest for "${partialQuery}". JSON array: [{text, type}].`,
        config: { responseMimeType: "application/json" }
      });
      return cleanAndParseJSON(res.text || "[]");
    }
    return [];
  } catch (e) { return []; }
};

export const generateCatalogMetadata = async (query: string): Promise<CatalogResult> => {
  const config = db.getLLMConfig();
  if (!config.apiKeys.google) throw new Error("Cataloging requires Google API Key.");
  const ai = new GoogleGenAI({ apiKey: config.apiKeys.google });
  const res = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Generate library catalog metadata for: "${query}". Return JSON.`,
    config: { responseMimeType: "application/json" }
  });
  return cleanAndParseJSON(res.text || "{}");
};

export const generateAbstract = async (text: string): Promise<{ abstract: string, keywords: string[] }> => {
  const config = db.getLLMConfig();
  if (!config.apiKeys.google) throw new Error("Summarizer requires Google API Key.");
  const ai = new GoogleGenAI({ apiKey: config.apiKeys.google });
  const res = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: `Generate abstract and keywords. JSON format.`,
    config: { responseMimeType: "application/json" }
  });
  return cleanAndParseJSON(res.text || "{}");
};

export const sendReferenceQuery = async (history: any[], message: string): Promise<{ text: string, sources: GroundingChunk[] }> => {
  const config = db.getLLMConfig();
  if (config.apiKeys.google) {
    const ai = new GoogleGenAI({ apiKey: config.apiKeys.google });
    const chat = ai.chats.create({ model: 'gemini-2.0-flash-exp', config: { tools: [{ googleSearch: {} }] } });
    const res = await chat.sendMessage({ message });
    return { text: res.text || "", sources: res.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
  }
  return { text: "Chat available with Gemini only.", sources: [] };
};
