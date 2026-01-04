/**
 * 认证 API
 */

import apiClient, { tokenManager } from './client';
import { LoginRequest, LoginData, User } from './types';

export const authApi = {
  /** 用户登录 */
  async login(data: LoginRequest): Promise<LoginData> {
    const result = await apiClient.post<LoginData>('/auth/login', data);
    // 保存 Token 和用户信息
    await tokenManager.setToken(result.token);
    await tokenManager.setUser(result.user);
    return result;
  },

  /** 退出登录 */
  async logout(): Promise<void> {
    await tokenManager.clear();
  },

  /** 检查是否已登录 */
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenManager.getToken();
    return !!token;
  },

  /** 获取当前用户 */
  async getCurrentUser(): Promise<User | null> {
    return tokenManager.getUser();
  },

  /** 获取 Token */
  async getToken(): Promise<string | null> {
    return tokenManager.getToken();
  }
};

export default authApi;
