export type AppMode = 'minimal' | 'standard' | 'expert';

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
  FORGOT_PASSWORD = 'forgot_password',
  OVERVIEW = 'overview',
  GREENHOUSE = 'greenhouse',
  SMART = 'smart',
  ALERTS = 'alerts',
  PROFILE = 'profile',
  DATA_ENTRY = 'data_entry',
  DATA_TRACE = 'data_trace',
  FERTILIZER_RECORD = 'fertilizer_record',
  CARBON_FOOTPRINT = 'carbon_footprint',
  SETTINGS = 'settings',
  HELP = 'help',
  ABOUT = 'about',
  QUICK_IRRIGATION = 'quick_irrigation',
  DEVICE_SETTINGS = 'device_settings',
  AI_CHAT = 'ai_chat'
}

export interface Alert {
  id: string;
  level: 'fatal' | 'severe' | 'reminder';
  message: string;
  source: string;
  timestamp: string;
  handled: boolean;
}

export interface DiagnosisResult {
    plantName: string;
    condition: 'healthy' | 'disease' | 'pest' | 'unknown';
    diagnosis: string;
    treatment: string[];
    confidence: number;
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