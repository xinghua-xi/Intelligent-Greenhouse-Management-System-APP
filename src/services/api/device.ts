/**
 * 设备管理 API
 */

import apiClient from './client';
import { Greenhouse, GreenhouseDetail, ControlRequest, DeviceNode } from './types';

export const deviceApi = {
  /** 获取大棚列表 */
  async getGreenhouses(): Promise<Greenhouse[]> {
    return apiClient.get<Greenhouse[]>('/devices/greenhouses');
  },

  /** 获取大棚详情（含分区和设备） */
  async getGreenhouseDetail(id: string): Promise<GreenhouseDetail> {
    return apiClient.get<GreenhouseDetail>(`/devices/greenhouses/${id}/detail`);
  },

  /** 获取节点状态 */
  async getNodes(greenhouseId?: string): Promise<DeviceNode[]> {
    const query = greenhouseId ? `?greenhouseId=${greenhouseId}` : '';
    return apiClient.get<DeviceNode[]>(`/devices/nodes${query}`);
  },

  /** 发送设备控制指令 */
  async controlDevice(deviceId: string, command: ControlRequest): Promise<string> {
    return apiClient.post<string>(`/devices/${deviceId}/control`, command);
  },

  /** 开启灌溉 */
  async startIrrigation(deviceId: string, duration: number = 300): Promise<string> {
    return this.controlDevice(deviceId, {
      action: 'IRRIGATION',
      mode: 'MANUAL',
      duration
    });
  },

  /** 开启通风 */
  async startVentilation(deviceId: string, duration: number = 600): Promise<string> {
    return this.controlDevice(deviceId, {
      action: 'VENTILATION',
      mode: 'MANUAL',
      duration
    });
  },

  /** 开启补光 */
  async startLighting(deviceId: string, duration: number = 3600): Promise<string> {
    return this.controlDevice(deviceId, {
      action: 'LIGHTING',
      mode: 'MANUAL',
      duration
    });
  },

  /** 开启加热 */
  async startHeating(deviceId: string, duration: number = 1800): Promise<string> {
    return this.controlDevice(deviceId, {
      action: 'HEATING',
      mode: 'MANUAL',
      duration
    });
  }
};

export default deviceApi;
