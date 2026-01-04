/**
 * 数据采集 API
 */

import apiClient from './client';
import { SensorData, EnvironmentData } from './types';

export const dataApi = {
  /** 上传传感器数据 */
  async uploadSensorData(data: SensorData): Promise<string> {
    return apiClient.post<string>('/data/upload', data);
  },

  /** 批量上传传感器数据 */
  async uploadBatchSensorData(dataList: SensorData[]): Promise<string> {
    return apiClient.post<string>('/data/upload/batch', { data: dataList });
  },

  /** 获取环境数据（时序） */
  async getEnvironmentData(greenhouseId?: string, range: '1h' | '24h' | '7d' = '24h'): Promise<EnvironmentData[]> {
    const params = new URLSearchParams();
    if (greenhouseId) params.append('greenhouseId', greenhouseId);
    params.append('range', range);
    const query = params.toString();
    return apiClient.get<EnvironmentData[]>(`/data/environment${query ? `?${query}` : ''}`);
  }
};

export default dataApi;
