/**
 * Gemini API Integration for Eco Cup Verification
 * 
 * This module provides functions to analyze images using Google's Gemini API.
 */

/**
 * Analyzes an image to check if it contains an eco-friendly cup
 * 
 * @param imageBase64 - Base64 encoded image data
 * @returns Promise resolving to verification result
 */
export async function verifyEcoCupImage(imageBase64: string): Promise<{
    isValid: boolean;
    confidence: number;
    feedback: string;
}> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('Gemini API key is not configured');
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: "Analyze this image and determine if it shows a person using an eco-friendly reusable cup. The image should show a person actively using a reusable cup (not disposable). If valid, provide a short positive feedback. If invalid, explain why briefly. Return your analysis in JSON format with these fields: isValid (boolean), confidence (number between 0-1), feedback (string)."
                                },
                                {
                                    inlineData: {
                                        mimeType: "image/jpeg",
                                        data: imageBase64.split(',')[1] // Remove data URL prefix if present
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        topK: 32,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultText) {
            throw new Error('No result from Gemini API');
        }

        // Extract JSON from response (Gemini sometimes adds text before/after the JSON)
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return {
                isValid: false,
                confidence: 0,
                feedback: "Could not parse verification result"
            };
        }

        try {
            const parsedResult = JSON.parse(jsonMatch[0]);
            return {
                isValid: Boolean(parsedResult.isValid),
                confidence: Number(parsedResult.confidence) || 0,
                feedback: String(parsedResult.feedback || "")
            };
        } catch (parseError) {
            console.error("Failed to parse Gemini response", parseError);
            return {
                isValid: false,
                confidence: 0,
                feedback: "Error parsing verification result"
            };
        }
    } catch (error) {
        console.error("Eco Cup verification error:", error);
        return {
            isValid: false,
            confidence: 0,
            feedback: error instanceof Error ? error.message : "Unknown error during verification"
        };
    }
} 