/**
 * API 服务统一导出
 */

export * from './types';
export { apiClient, tokenManager } from './client';
export { authApi } from './auth';
export { deviceApi } from './device';
export { aiApi, visionApi } from './ai';
export { dataApi } from './data';

// 统一 API 入口
import { authApi } from './auth';
import { deviceApi } from './device';
import { aiApi, visionApi } from './ai';
import { dataApi } from './data';

export const api = {
  auth: authApi,
  device: deviceApi,
  ai: aiApi,
  vision: visionApi,
  data: dataApi
};

export default api;
