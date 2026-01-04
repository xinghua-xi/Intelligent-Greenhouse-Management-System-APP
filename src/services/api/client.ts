/**
 * API 客户端 - React Native 版本
 * 使用 AsyncStorage 存储 Token
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ApiResponse } from './types';

// ==================== 配置 ====================

// 开发环境配置 - 修改这里的 IP 和端口
const DEV_CONFIG = {
  // 你的电脑局域网 IP（运行后端的机器）
  LOCAL_IP: '192.168.0.2',
  // Spring Cloud Gateway 端口
  PORT: '8080',
  // 请求超时时间（毫秒）
  TIMEOUT: 15000,
};

// 获取 API 基础地址
const getBaseUrl = () => {
  if (!__DEV__) {
    return 'https://api.smartgreenhouse.com';
  }
  
  const { LOCAL_IP, PORT } = DEV_CONFIG;
  
  if (Platform.OS === 'android') {
    // Android 真机用局域网 IP
    return `http://${LOCAL_IP}:${PORT}`;
  } else if (Platform.OS === 'ios') {
    // iOS 真机用局域网 IP
    return `http://${LOCAL_IP}:${PORT}`;
  } else {
    // Web 浏览器
    return `http://localhost:${PORT}`;
  }
};

const API_BASE_URL = getBaseUrl();

// 调试日志
if (__DEV__) {
  console.log('🌐 API 配置:', {
    baseUrl: API_BASE_URL,
    platform: Platform.OS,
    timeout: DEV_CONFIG.TIMEOUT
  });
}

const TOKEN_KEY = 'smart_greenhouse_token';
const USER_KEY = 'smart_greenhouse_user';

// ==================== Token 管理 ====================

export const tokenManager = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async getUser(): Promise<any | null> {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }
};

// ==================== HTTP 请求封装 ====================

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private onUnauthorized?: () => void;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, timeout = DEV_CONFIG.TIMEOUT } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const token = await tokenManager.getToken();
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 调试日志
    if (__DEV__) {
      console.log(`📤 请求: ${method} ${url}`);
      if (body) console.log('📦 请求体:', JSON.stringify(body));
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const startTime = Date.now();
      
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      const duration = Date.now() - startTime;
      if (__DEV__) {
        console.log(`📥 响应: ${response.status} (${duration}ms)`);
      }

      // 处理 401 未授权
      if (response.status === 401) {
        await tokenManager.clear();
        this.onUnauthorized?.();
        throw new Error('未授权，请重新登录');
      }

      const data: ApiResponse<T> = await response.json();
      
      if (__DEV__) {
        console.log('📄 响应数据:', JSON.stringify(data).substring(0, 200));
      }

      // 业务错误处理
      if (data.code !== 200) {
        throw new Error(data.msg || '请求失败');
      }

      return data.data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (__DEV__) {
        console.log('❌ 请求错误:', error.message || error);
      }
      
      if (error.name === 'AbortError') {
        throw new Error(`请求超时 (${timeout/1000}秒) - 请检查:\n1. 后端服务是否启动\n2. 手机和电脑是否在同一WiFi\n3. 防火墙是否允许端口 ${DEV_CONFIG.PORT}`);
      }
      
      // 网络错误提示
      if (error.message?.includes('Network request failed')) {
        throw new Error(`网络连接失败 - 请检查:\n1. 后端地址: ${this.baseUrl}\n2. 手机和电脑是否在同一WiFi\n3. 防火墙设置`);
      }
      
      throw error;
    }
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
