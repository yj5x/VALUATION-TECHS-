import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";
import { logger } from "../utils/logger";
import { ANALYSIS_SCHEMA } from "../utils/constants";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async analyzeDocument(documentContent: string): Promise<any> {
    try {
      const prompt = `Analyze the following real estate valuation report content and extract key information based on the provided JSON schema. Ensure all fields in the schema are populated accurately. The report content is in Arabic. If a field is not found, use 'N/A' or 0 where appropriate, but try your best to extract all possible information.

Report Content:\n\n${documentContent}

Output JSON according to the schema:`;

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA,
        },
      });

      const responseText = result.response.text();
      logger.info("Gemini API Raw Response:", responseText);
      return JSON.parse(responseText);
    } catch (error) {
      logger.error("Error analyzing document with Gemini API:", error);
      throw new Error("Failed to analyze document with AI.");
    }
  }

  async convertToGenerativePart(fileBuffer: Buffer, mimeType: string): Promise<Part> {
    return {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };
  }
}

