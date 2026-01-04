export type AppMode = 'minimal' | 'standard' | 'expert';

export interface SensorData {
  temperature: number;
  humidity: number;
  co2: number;
  soilMoisture: number;
  lightLevel: number;
  timestamp: string;
}

export interface DiagnosisResult {
  plantName: string;
  condition: 'healthy' | 'disease' | 'pest' | 'unknown';
  diagnosis: string;
  treatment: string[];
  confidence: number;
}

export interface Alert {
  id: string;
  level: 'fatal' | 'severe' | 'reminder';
  message: string;
  source: string;
  timestamp: string;
  handled: boolean;
}

export interface Greenhouse {
  id: string;
  name: string;
  crop: string;
  stage: '幼苗期' | '生长期' | '开花期' | '结果期';
  status: 'normal' | 'warning' | 'offline';
  healthScore: number;
  image: string;
}

export enum AppRoute {
  LOGIN = 'login',
  OVERVIEW = 'overview',
  GREENHOUSE = 'greenhouse',
  SMART = 'smart',
  ALERTS = 'alerts',
  PROFILE = 'profile',
  DATA_ENTRY = 'data_entry' // Kept for backward compatibility if needed, but not in main nav
}

export interface HealthMetric {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface OfflineRecord {
  id: string;
  cropType: string;
  growthStage: string;
  height: number;
  pestCount: number;
  notes: string;
  timestamp: string;
  synced: boolean;
}