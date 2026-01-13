import { GoogleGenAI } from "@google/genai";

const getSystemInstruction = () => `
You are an expert Automation Testing Engineer specializing in Cypress.io.
Your task is to analyze HTML snippets and a user's natural language description to generate the *single best* Cypress selector.

Rules for Selector Generation (Priority Order):
1. **Best Practice Attributes**: Prioritize \`data-cy\`, \`data-test\`, \`data-testid\` attributes.
2. **ID**: Use \`#id\` if unique and stable.
3. **Semantic/Stable Classes**: Use classes that look stable (e.g., \`.btn-primary\`). Avoid Tailwind utility classes (e.g., \`.p-4\`, \`.text-red\`) or randomly generated hashes.
4. **Text Content**: Use \`cy.contains('text')\` if the element is best identified by visible text (like buttons or links).
5. **Traversal**: Keep traversal shallow. Avoid long chains like \`div > div > ul > li\`. Use \`.find()\` or \`.parent()\` only if necessary.

Output Format:
- Return ONLY the Cypress command string (e.g., \`cy.get('[data-cy="submit"]')\` or \`cy.contains('button', 'Login')\`).
- Do NOT return markdown formatting, backticks, or explanations.
- Do NOT append actions (like .click()) unless explicitly asked in the description, but usually, just return the selector.
`;

/**
 * Generates a Cypress selector using the Google Gemini API.
 * 
 * @param html The HTML snippet context
 * @param description User's description of the target element
 * @param apiKey The user's Google AI Studio API key (Required)
 */
export const generateSelector = async (html: string, description: string, apiKey: string): Promise<string> => {
  if (!html.trim()) {
    throw new Error("HTML content is missing.");
  }
  if (!description.trim()) {
    throw new Error("Description is missing.");
  }
  if (!apiKey || !apiKey.trim()) {
    throw new Error("API Key is missing. Please configure it in settings.");
  }

  try {
    // Initialize the client with the user-provided key
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      HTML Snippet:
      \`\`\`html
      ${html}
      \`\`\`

      Target Element Description: "${description}"

      Generate the specific Cypress selector for this element.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Updated to latest flash model as per current standards
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.2, // Low temperature for deterministic code generation
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    // Clean up any accidental whitespace or backticks if the model ignores instruction
    return text.replace(/```/g, '').replace(/`/g, '').trim();

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide friendlier error messages for common API issues
    if (error.message?.includes('403') || error.toString().includes('API key')) {
      throw new Error("Invalid API Key. Please check your key in settings.");
    }
    
    throw new Error(error.message || "Failed to generate selector.");
  }
};
