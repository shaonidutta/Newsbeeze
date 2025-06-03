import axios from "axios";
import APP_CONFIG from "../config/app";

// Hugging Face API configuration
const HF_API_URL = `${APP_CONFIG.apis.huggingFace.baseUrl}/models/${APP_CONFIG.apis.huggingFace.models.summarization}`;
const HF_API_KEY = import.meta.env.REACT_APP_HUGGINGFACE_API_KEY;

export const summarizeText = async (text: string): Promise<string> => {
  // If no API key is provided, return a simple truncation
  if (!HF_API_KEY) {
    console.warn(
      "Hugging Face API key not found. Using fallback summarization."
    );
    return createFallbackSummary(text);
  }

  try {
    // Clean and prepare text for summarization
    const cleanedText = text
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Skip summarization if text is already short
    if (cleanedText.length < 100) {
      return cleanedText;
    }

    const response = await axios.post(
      HF_API_URL,
      {
        inputs: cleanedText,
        parameters: {
          max_length: 100,
          min_length: 30,
          do_sample: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text.trim();
    } else {
      throw new Error("Invalid response format from Hugging Face API");
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);

    // Return fallback summary
    return createFallbackSummary(text);
  }
};

const createFallbackSummary = (text: string): string => {
  // Simple extractive summarization - take first few sentences
  const sentences = text
    .replace(/<[^>]*>/g, "") // Remove HTML
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  if (sentences.length === 0) {
    return text.substring(0, 150) + "...";
  }

  // Take first 1-2 sentences, up to ~150 characters
  let summary = sentences[0];
  if (summary.length < 100 && sentences.length > 1) {
    summary += ". " + sentences[1];
  }

  // Ensure it's not too long
  if (summary.length > 200) {
    summary = summary.substring(0, 197) + "...";
  }

  return summary + (summary.endsWith(".") ? "" : ".");
};
