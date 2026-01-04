import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Constants from 'expo-constants';
import { DiagnosisResult } from "../types";

// In Expo, use Constants.expoConfig.extra for environment variables
// You can set these in app.config.js under expo.extra
const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY || Constants.expoConfig?.extra?.API_KEY || '';
const genAI = apiKey && apiKey !== 'dummy-key' ? new GoogleGenerativeAI(apiKey) : null;

export const getGeminiDiagnosis = async (base64Image: string): Promise<DiagnosisResult> => {
  // Check for dummy key or empty key to avoid API calls that will fail
  if (!genAI || !apiKey || apiKey === 'dummy-key') {
    return mockDiagnosis();
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            plantName: { type: SchemaType.STRING },
            condition: {
              type: SchemaType.STRING,
              enum: ['healthy', 'disease', 'pest', 'unknown']
            },
            diagnosis: { type: SchemaType.STRING },
            treatment: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING }
            },
            confidence: { type: SchemaType.NUMBER }
          },
          required: ['plantName', 'condition', 'diagnosis', 'treatment', 'confidence']
        }
      }
    });

    const prompt = `Analyze this crop image. Identify plant, disease/pest/deficiency. JSON format: {plantName, condition(healthy|disease|pest|unknown), diagnosis(Chinese), treatment([string]), confidence(number)}.`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      },
      { text: prompt }
    ]);

    const response = await result.response;
    const jsonText = response.text();
    if (!jsonText) throw new Error("Empty response");
    return JSON.parse(jsonText) as DiagnosisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockDiagnosis();
  }
};

export const getDailyAdvice = async (): Promise<{ suggestion: string, reason: string }> => {
  if (!genAI || !apiKey || apiKey === 'dummy-key') {
    return {
      suggestion: "今日建议暂停灌溉",
      reason: "根区传感器显示水分充足，且下午预计气温转凉，避免根系缺氧。"
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const result = await model.generateContent(
      `Generate daily ag advice in Chinese JSON {suggestion, reason} for tomato greenhouse.`
    );

    const response = await result.response;
    return JSON.parse(response.text() || "{}");
  } catch (e) {
    return {
      suggestion: "今日建议暂停灌溉",
      reason: "根区传感器显示水分充足，且下午预计气温转凉。"
    };
  }
}

const mockDiagnosis = (): DiagnosisResult => ({
  plantName: "番茄 (演示)",
  condition: "disease",
  diagnosis: "检测到早疫病初期症状，叶片有同心轮纹斑点。",
  treatment: ["及时摘除病叶并带出田外销毁", "喷洒百菌清或代森锰锌进行防治", "控制棚内湿度"],
  confidence: 88
});
