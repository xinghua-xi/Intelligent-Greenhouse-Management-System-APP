/**
 * 智慧温室 API TypeScript 类型定义
 */

// ==================== 通用 ====================

export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

// ==================== Auth ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  role: 'EXPERT' | 'STANDARD' | 'MINIMAL';
  defaultMode: 'EXPERT' | 'STANDARD' | 'MINIMAL';
  createdAt: string;
}

export interface LoginData {
  token: string;
  user: User;
}

// ==================== Device ====================

export type GreenhouseStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type ZoneStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';
export type DeviceType = 'FAN' | 'LIGHT' | 'PUMP' | 'HEATER';
export type ActionType = 'IRRIGATION' | 'VENTILATION' | 'LIGHTING' | 'HEATING';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface Greenhouse {
  id: string;
  name: string;
  crop: string;
  status: GreenhouseStatus;
  healthScore: number;
  location?: GeoPoint;
  createdAt: string;
}

export interface Zone {
  id: string;
  name: string;
  greenhouseId: string;
  cropType: string;
  status: ZoneStatus;
}

export interface Actuator {
  id: string;
  name: string;
  zoneId: string;
  type: DeviceType;
  currentValue: string;
  autoMode: boolean;
}

export interface ZoneWithDevices {
  zone: Zone;
  devices: Actuator[];
}

export interface GreenhouseDetail {
  info: Greenhouse;
  zones: ZoneWithDevices[];
}

export interface ControlRequest {
  mode?: string;
  action: ActionType;
  duration?: number;
}

// ==================== Data ====================

export interface SensorData {
  greenhouseId: string;
  temperature: number;
  humidity: number;
}

export interface EnvironmentData {
  time: string;
  temp: number;
  humidity: number;
  light: number;
  co2: number;
  voltage: number;
}

// ==================== Device Node ====================

export type NodeType = 'SENSOR' | 'GATEWAY' | 'RELAY';
export type NodeStatus = 'ONLINE' | 'OFFLINE' | 'WARNING';

export interface DeviceNode {
  id: string;
  name: string;
  greenhouseId: string;
  nodeType: NodeType;
  signalStrength: number;
  battery: number;
  status: NodeStatus;
  lastHeartbeat: string;
  createdAt: string;
}

// ==================== AI ====================

export interface Decision {
  action: ActionType;
  reason: string;
  confidence: number;
}

export type TaskType = 'irrigation' | 'fertilizer' | 'ventilation' | 'lighting';
export type TaskStatus = 'pending' | 'completed' | 'failed';

export interface AiTask {
  id: string;
  type: TaskType;
  status: TaskStatus;
  aiConfidence: number;
}

// ==================== Speech ====================

export interface SpeechToTextRequest {
  audio: string; // base64 编码的音频数据
  format?: string; // 音频格式，如 'wav', 'pcm'
}

export interface SpeechToTextResponse {
  text: string;
  confidence?: number;
}

// ==================== Chat ====================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  prompt: string;
  history?: ChatMessage[];
  greenhouseId?: string;
}

export interface ChatResponse {
  success: boolean;
  text: string;
  model: string;
  timestamp: number;
}

// ==================== Vision ====================

export type PlantCondition = 'healthy' | 'pest' | 'disease';

export interface DiagnosisRequest {
  description: string;
  cropType: string;
}

export interface Diagnosis {
  condition: PlantCondition;
  disease: string;
  confidence: number;
  treatment: string;
}

// ==================== Article ====================

export type ArticleCategory = 'PEST' | 'DISEASE' | 'PLANTING' | 'MANAGEMENT';

export interface Article {
  id: string;
  title: string;
  content: string;
  category: ArticleCategory;
  cropType: string;
  author: string;
  viewCount: number;
  coverImage?: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}
