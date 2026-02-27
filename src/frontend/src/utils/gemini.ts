/**
 * Parse the raw Gemini API JSON response to extract text content.
 */
export function parseGeminiResponse(rawText: string): string {
  try {
    const parsed = JSON.parse(rawText);
    return parsed.candidates[0].content.parts[0].text as string;
  } catch {
    return rawText;
  }
}

/**
 * Strip markdown code blocks and parse as JSON.
 */
export function extractJSON<T = unknown>(text: string): T {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

/**
 * Strip markdown code blocks and parse as JSON.
 * Falls back to `fallback` value if parsing fails.
 */
export function extractJSONWithFallback<T = unknown>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("[gemini] JSON parse failed, using fallback:", text.slice(0, 200));
    return fallback;
  }
}
