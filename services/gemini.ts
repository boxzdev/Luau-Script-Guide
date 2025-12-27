import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK
// The API key is obtained from the environment variable process.env.API_KEY
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper function to generate text content.
 * @param prompt The text prompt to send to the model.
 * @param model The model to use (default: gemini-3-flash-preview).
 * @returns The generated text response.
 */
export const generateText = async (prompt: string, model: string = 'gemini-3-flash-preview'): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Fetches an explanation, code example, and expected output for a Luau/Roblox concept.
 * Validates if the input matches the selected category.
 */
export const getLuauHelp = async (query: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the term: "${query}".
      Selected Category: "${category}".

      STRICT VALIDATION RULES:
      
      GLOBAL RULE (IMPORTANT): The input must be a SINGLE token, entity, or value.
      - If the input consists of multiple keywords or tokens separated by spaces (e.g., "local if", "var1 var2", "1 + 2"), it is INVALID.
      - Exception: A single string literal (like "hello world") is valid even with spaces inside quotes, provided it is a single entity.

      Category Rules:
      1. Category "Variable & Stuff": 
         - Allows ANY valid Lua/Luau Identifier or Keyword.
         - Includes: User Variables (e.g. 'myVar', 'score'), Global Functions (e.g. 'print', 'warn'), Reserved Keywords (e.g. 'if', 'then', 'end', 'local', 'function', 'return', 'do', 'while', 'for').
         - It does NOT include explicit literal Values (like 123) or Operators (like +).
      2. Category "Value": The term MUST be a single Value. This includes Numbers (123), Booleans (true/false), nil, or String literals ("hello").
      3. Category "Symbol": The term MUST be a single operator (+, -, *, /, #, ..) or punctuation (., :, (, ), [, ], {, }). 

      If the input does NOT match the selected category OR violates the single-entity rule:
      - Set isValid to false.
      - Set summary to a helpful error message. 
        - If the user typed a Symbol into "Variable & Stuff", say: "'${query}' is a symbol/operator. Try the 'Symbol' category."
        - If the user typed a Number into "Variable & Stuff", say: "'${query}' is a value. Try the 'Value' category."
      
      If Valid:
      - Provide a detailed beginner-friendly summary, basic code, and scriptOutput.`,
      config: {
        systemInstruction: `You are a strict but helpful Roblox Studio Luau assistant.
        
        If the user input is VALID for the selected Category and is a SINGLE entity:
        - Set 'isValid' to true.
        - Set 'summary' to a DETAILED, EDUCATIONAL explanation. Do not just say "it is valid". Explain WHAT it is, HOW it works, and WHY it is used in scripting. Imagine you are teaching a beginner.
        - STYLE: You CAN use Markdown bolding (**text**) to highlight key concepts, variable names, or important terms. This will style the text in the UI. Do not use quotes ('') for emphasis.
        - Provide a VERY BASIC 'code' example.
        - Provide the 'scriptOutput'.

        If the user input is INVALID, NONSENSE, or MULTIPLE TOKENS:
        - Set 'isValid' to false.
        - Set 'summary' to a helpful error message. SUGGEST the correct category if applicable.
        - Set 'code' to an empty string.
        - Set 'scriptOutput' to an empty string.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            summary: { type: Type.STRING },
            code: { type: Type.STRING },
            scriptOutput: { type: Type.STRING },
          },
        },
      },
    });
    
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};