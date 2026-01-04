/**
 * API Hooks - 封装常用的 API 调用
 */

import { useState, useEffect, useCallback } from 'react';
import { deviceApi, aiApi, visionApi } from '../services/api';
import { Greenhouse, GreenhouseDetail, Decision, AiTask, Diagnosis } from '../services/api/types';

// ==================== 大棚列表 ====================

export function useGreenhouses() {
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGreenhouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deviceApi.getGreenhouses();
      setGreenhouses(data);
    } catch (err: any) {
      setError(err.message);
      // 开发环境使用模拟数据
      if (__DEV__) {
        setGreenhouses([
          { id: 'gh_001', name: '1号 智能番茄棚', crop: '番茄', status: 'NORMAL', healthScore: 92, createdAt: '' },
          { id: 'gh_002', name: '2号 育苗实验棚', crop: '甜椒', status: 'WARNING', healthScore: 65, createdAt: '' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGreenhouses();
  }, [fetchGreenhouses]);

  return { greenhouses, loading, error, refresh: fetchGreenhouses };
}

// ==================== 大棚详情 ====================

export function useGreenhouseDetail(id: string | null) {
  const [detail, setDetail] = useState<GreenhouseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await deviceApi.getGreenhouseDetail(id);
      setDetail(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { detail, loading, error, refresh: fetchDetail };
}

// ==================== AI 建议 ====================

export function useAiRecommendation() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiApi.getRecommendation();
      setDecision(data);
    } catch (err: any) {
      setError(err.message);
      // 开发环境使用模拟数据
      if (__DEV__) {
        setDecision({
          action: 'IRRIGATION',
          reason: '检测到土壤含水量(28%)低于设定阈值(30%)，建议启动灌溉',
          confidence: 0.92
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  return { decision, loading, error, refresh: fetchRecommendation };
}

// ==================== AI 任务列表 ====================

export function useAiTasks() {
  const [tasks, setTasks] = useState<AiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiApi.getScheduleTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
      // 开发环境使用模拟数据
      if (__DEV__) {
        setTasks([
          { id: 'task_01', type: 'irrigation', status: 'pending', aiConfidence: 0.88 },
          { id: 'task_02', type: 'ventilation', status: 'completed', aiConfidence: 0.95 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refresh: fetchTasks };
}

// ==================== 设备控制 ====================

export function useDeviceControl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controlDevice = useCallback(async (
    deviceId: string, 
    action: 'IRRIGATION' | 'VENTILATION' | 'LIGHTING' | 'HEATING',
    duration?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      await deviceApi.controlDevice(deviceId, { action, duration });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { controlDevice, loading, error };
}
