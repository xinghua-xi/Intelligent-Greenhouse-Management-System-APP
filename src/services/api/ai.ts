/**
 * AI 决策 API
 */

import apiClient from './client';
import { Decision, AiTask, Diagnosis, DiagnosisRequest, ChatRequest, ChatResponse, SpeechToTextResponse, Article } from './types';

export const aiApi = {
  /** 获取 AI 托管建议 */
  async getRecommendation(): Promise<Decision> {
    return apiClient.get<Decision>('/ai/decision/recommend');
  },

  /** 获取智能排产任务 */
  async getScheduleTasks(): Promise<AiTask[]> {
    return apiClient.get<AiTask[]>('/ai/schedule/tasks');
  },

  /** 智能问答 */
  async chat(data: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/ai/chat', data, { timeout: 60000 }); // 60秒超时
  },

  /** 语音转文字 */
  async speechToText(audioBase64: string, format: string = 'wav'): Promise<SpeechToTextResponse> {
    return apiClient.post<SpeechToTextResponse>('/ai/speech-to-text', {
      audio: audioBase64,
      format
    }, { timeout: 30000 }); // 30秒超时
  },

  /** 获取知识库文章列表 */
  async getArticles(category?: string, cropType?: string): Promise<Article[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (cropType) params.append('cropType', cropType);
    const query = params.toString();
    return apiClient.get<Article[]>(`/ai/articles${query ? `?${query}` : ''}`);
  },

  /** 搜索文章 */
  async searchArticles(keyword: string): Promise<Article[]> {
    return apiClient.get<Article[]>(`/ai/articles/search?keyword=${encodeURIComponent(keyword)}`);
  },

  /** 获取热门文章 */
  async getHotArticles(): Promise<Article[]> {
    return apiClient.get<Article[]>('/ai/articles/hot');
  },

  /** 获取文章详情 */
  async getArticleDetail(id: string): Promise<Article> {
    return apiClient.get<Article>(`/ai/articles/${id}`);
  }
};

export const visionApi = {
  /** 病害识别（文字描述） */
  async diagnosePlant(description: string, cropType: string): Promise<Diagnosis> {
    return apiClient.post<Diagnosis>('/vision/diagnosis', { description, cropType });
  },

  /** 上传图片并识别 (Base64) */
  async diagnoseFromBase64(base64Image: string): Promise<Diagnosis> {
    return apiClient.post<Diagnosis>('/vision/diagnosis/base64', {
      image: base64Image
    });
  }
};

export default { aiApi, visionApi };
