
import { GoogleGenAI, Type, Content } from "@google/genai";
import { SearchResponse, LibraryResource, CatalogResult, GroundingChunk, Suggestion, ContentSection } from "../types";

// NOTE: This service is largely deprecated in favor of llmService.ts 
// but kept for compatibility with older views if re-enabled.

/**
 * Helper to safely parse JSON from AI responses
 */
const cleanAndParseJSON = <T>(text: string): T => {
  if (!text) throw new Error("Empty response text");
  let cleaned = text.replace(/```json\s*([\s\S]*?)\s*```/g, '$1')
                    .replace(/```\s*([\s\S]*?)\s*```/g, '$1')
                    .trim();
  const firstOpenBrace = cleaned.indexOf('{');
  const firstOpenBracket = cleaned.indexOf('[');
  let startIndex = -1;
  if (firstOpenBrace !== -1 && firstOpenBracket !== -1) startIndex = Math.min(firstOpenBrace, firstOpenBracket);
  else if (firstOpenBrace !== -1) startIndex = firstOpenBrace;
  else if (firstOpenBracket !== -1) startIndex = firstOpenBracket;

  if (startIndex !== -1) {
    const lastCloseBrace = cleaned.lastIndexOf('}');
    const lastCloseBracket = cleaned.lastIndexOf(']');
    const endIndex = Math.max(lastCloseBrace, lastCloseBracket);
    if (endIndex > startIndex) cleaned = cleaned.substring(startIndex, endIndex + 1);
  }
  try { return JSON.parse(cleaned); } catch (e) { throw e; }
};

const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  // Suppress errors to avoid crashing app logic
};

export const getSearchSuggestions = async (partialQuery: string): Promise<Suggestion[]> => {
  if (partialQuery.length < 2) return [];
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Autosuggest: "${partialQuery}". JSON array: [{text, type}].`,
      config: { responseMimeType: "application/json" }
    });
    return cleanAndParseJSON<Suggestion[]>(response.text || "[]");
  } catch (e) { return []; }
};

export const generateCatalogMetadata = async (query: string): Promise<CatalogResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("No API Key");
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Catalog metadata for: "${query}". JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return cleanAndParseJSON<CatalogResult>(response.text || "{}");
  } catch (e) {
    handleApiError(e);
    throw e;
  }
};

export const generateAbstract = async (text: string): Promise<{ abstract: string, keywords: string[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("No API Key");
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Abstract/Keywords for text. JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return cleanAndParseJSON(response.text || "{}");
  } catch (e) {
    handleApiError(e);
    throw e;
  }
};

export const sendReferenceQuery = async (history: Content[], message: string): Promise<{ text: string, sources: GroundingChunk[] }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("No API Key");
  const ai = new GoogleGenAI({ apiKey });

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: { tools: [{ googleSearch: {} }] }
    });
    const response = await chat.sendMessage({ message: message });
    return { 
      text: response.text || "", 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (e) {
    handleApiError(e);
    return { text: "Error in reference search.", sources: [] };
  }
};
