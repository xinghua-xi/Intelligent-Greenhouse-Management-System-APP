# 绿智云棚 - 智慧农业管理系统设计文档

## 1. 项目概述

### 1.1 项目名称
绿智云棚 (Smart Greenhouse Management System)

### 1.2 项目定位
面向现代农业的智能温室大棚管理移动应用，集成物联网传感器数据采集、AI病害诊断、智能决策、数字孪生等功能，为不同技术水平的用户提供差异化的操作体验。

### 1.3 技术栈
- **框架**: React Native + Expo
- **语言**: TypeScript
- **导航**: React Navigation (Stack + Tab)
- **状态管理**: React Context
- **UI组件**: 自定义组件 + Lucide Icons
- **样式**: StyleSheet + NativeWind (Tailwind CSS)
- **AI服务**: Google Gemini API
- **图表**: react-native-svg

## 2. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      App.tsx                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Context Providers                   │   │
│  │  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │ThemeContext │  │   AppModeContext        │  │   │
│  │  │(深色/浅色)   │  │ (极简/标准/专家模式)     │  │   │
│  │  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Navigation Container                   │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │         Stack Navigator                  │    │   │
│  │  │  • Login / ForgotPassword               │    │   │
│  │  │  • Main (Tab Navigator)                 │    │   │
│  │  │  • Modal Pages (Settings, Help...)      │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 3. 三模式设计体系

### 3.1 设计理念
针对不同用户群体提供差异化的界面和功能复杂度：

| 模式 | 目标用户 | 设计特点 |
|------|----------|----------|
| 极简模式 | 老年人/非技术人员 | 大字体、简单状态、一键操作、语音交互 |
| 标准模式 | 普通农户 | 平衡信息展示、健康评分、AI建议、设备控制 |
| 专家模式 | 农艺师/技术人员 | 深色科技主题、详细数据、热力图、日志监控 |

### 3.2 模式路由架构

```
src/pages/
├── Overview.tsx          # 总览路由器
│   ├── OverviewMinimal.tsx
│   ├── OverviewStandard.tsx
│   └── OverviewExpert.tsx
├── GreenhouseRouter.tsx  # 大棚路由器
│   ├── GreenhouseMinimal.tsx
│   ├── Greenhouse.tsx (标准)
│   └── GreenhouseExpert.tsx
├── SmartRouter.tsx       # 智能路由器
│   ├── SmartMinimal.tsx
│   ├── Smart.tsx (标准)
│   └── SmartExpert.tsx
└── AlertsRouter.tsx      # 告警路由器
    ├── AlertsMinimal.tsx
    ├── Alerts.tsx (标准)
    └── AlertsExpert.tsx
```

## 4. 功能模块详解

### 4.1 总览模块 (Overview)

| 极简模式 | 标准模式 | 专家模式 |
|----------|----------|----------|
| 大棚状态卡片(正常/异常) | 环境数据仪表盘 | 多维数据监控面板 |
| 一键呼叫专家 | AI决策建议推送 | 实时传感器数据流 |
| 语音播报状态 | 健康评分趋势 | 历史数据对比图表 |

### 4.2 大棚管理模块 (Greenhouse)

| 极简模式 | 标准模式 | 专家模式 |
|----------|----------|----------|
| 大棚列表(大图标) | 2D/3D分区视图 | 热力图分区监控 |
| 温度/湿度大字显示 | 传感器数据卡片 | 多传感器数据融合 |
| 状态指示(✓/⚠️) | AI托管/手动切换 | 设备控制矩阵 |
| 语音交互按钮 | 设备控制面板 | 执行日志追踪 |

### 4.3 智能中心模块 (Smart)

| 极简模式 | 标准模式 | 专家模式 |
|----------|----------|----------|
| 拍照识别(大按钮) | 病害AI诊断 | AI模型性能监控 |
| 健康/异常结果 | AI决策建议 | 预测曲线图表 |
| 呼叫专家按钮 | 数字孪生模拟 | 数字孪生仿真 |
| 语音咨询入口 | 生长周期预测 | 决策建议队列 |
|  |  | 执行日志系统 |

### 4.4 告警中心模块 (Alerts)

| 极简模式 | 标准模式 | 专家模式 |
|----------|----------|----------|
| 紧急/普通分类 | 多级告警列表 | 告警代码分类 |
| 大图标状态显示 | 来源追踪 | 阈值对比分析 |
| 一键处理按钮 | 处理状态管理 | 过滤器筛选 |
| 呼叫技术支持 | 时间戳记录 | 趋势分析入口 |

### 4.5 个人中心模块 (Profile)
- 用户信息展示
- **模式切换器** (极简/标准/专家)
- 离线数据采集入口
- 数据溯源
- 肥料使用记录
- 碳足迹统计
- 系统设置

## 5. 页面清单

### 5.1 认证相关
| 页面 | 路由 | 功能 |
|------|------|------|
| Login | LOGIN | 登录页面，支持记住密码 |
| ForgotPassword | FORGOT_PASSWORD | 忘记密码三步流程 |

### 5.2 主功能页面
| 页面 | 路由 | 功能 |
|------|------|------|
| Overview | OVERVIEW | 总览仪表盘 |
| Greenhouse | GREENHOUSE | 大棚管理 |
| Smart | SMART | 智能中心 |
| Alerts | ALERTS | 告警中心 |
| Profile | PROFILE | 个人中心 |

### 5.3 二级页面
| 页面 | 路由 | 功能 |
|------|------|------|
| DataEntry | DATA_ENTRY | 离线数据采集 |
| DataTrace | DATA_TRACE | 数据溯源 |
| FertilizerRecord | FERTILIZER_RECORD | 肥料记录 |
| CarbonFootprint | CARBON_FOOTPRINT | 碳足迹 |
| Settings | SETTINGS | 系统设置 |
| Help | HELP | 帮助中心 |
| About | ABOUT | 关于我们 |
| QuickIrrigation | QUICK_IRRIGATION | 一键灌溉 |
| DeviceSettings | DEVICE_SETTINGS | 设备设置 |

## 6. 目录结构

```
绿智云棚promax/
├── App.tsx                    # 应用入口
├── index.tsx                  # Expo入口
├── app.config.js              # Expo配置
├── package.json               # 依赖配置
├── tsconfig.json              # TypeScript配置
├── tailwind.config.js         # Tailwind配置
│
├── src/
│   ├── context/               # 全局状态
│   │   ├── AppModeContext.tsx # 模式管理
│   │   └── ThemeContext.tsx   # 主题管理
│   │
│   ├── pages/                 # 页面组件
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Overview.tsx       # 路由器
│   │   ├── OverviewMinimal.tsx
│   │   ├── OverviewStandard.tsx
│   │   ├── OverviewExpert.tsx
│   │   ├── GreenhouseRouter.tsx
│   │   ├── Greenhouse.tsx
│   │   ├── GreenhouseMinimal.tsx
│   │   ├── GreenhouseExpert.tsx
│   │   ├── SmartRouter.tsx
│   │   ├── Smart.tsx
│   │   ├── SmartMinimal.tsx
│   │   ├── SmartExpert.tsx
│   │   ├── AlertsRouter.tsx
│   │   ├── Alerts.tsx
│   │   ├── AlertsMinimal.tsx
│   │   ├── AlertsExpert.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   ├── QuickIrrigation.tsx
│   │   ├── DeviceSettings.tsx
│   │   └── ...
│   │
│   ├── services/              # 服务层
│   │   └── geminiService.ts   # AI诊断服务
│   │
│   ├── repositories/          # 数据仓库
│   │
│   └── types.ts               # 类型定义
│
└── components/                # 公共组件
    └── Layout.tsx
```

## 7. 核心数据类型

```typescript
// 应用模式
type AppMode = 'minimal' | 'standard' | 'expert';

// 路由定义
enum AppRoute {
  LOGIN = 'Login',
  FORGOT_PASSWORD = 'ForgotPassword',
  OVERVIEW = 'Overview',
  GREENHOUSE = 'Greenhouse',
  SMART = 'Smart',
  ALERTS = 'Alerts',
  PROFILE = 'Profile',
  // ... 更多路由
}

// 大棚数据
interface Greenhouse {
  id: string;
  name: string;
  crop: string;
  stage: string;
  status: 'normal' | 'warning' | 'critical';
  healthScore: number;
  image: string;
}

// AI诊断结果
interface DiagnosisResult {
  plantName: string;
  condition: 'healthy' | 'disease' | 'pest' | 'unknown';
  diagnosis: string;
  treatment: string[];
  confidence: number;
}
```

## 8. 主题系统

### 8.1 颜色方案
```typescript
// 浅色主题
const lightColors = {
  background: '#f9fafb',
  card: '#ffffff',
  text: '#1f2937',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  primary: '#059669',  // emerald-600
};

// 深色主题
const darkColors = {
  background: '#0f172a',
  card: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#64748b',
  border: '#334155',
  primary: '#10b981',  // emerald-500
};
```

### 8.2 专家模式特殊主题
专家模式采用深色科技风格，固定使用深色背景 `#0f172a`，配合霓虹绿 `#34d399` 作为强调色。

## 9. AI集成

### 9.1 Gemini API 集成
- **模型**: gemini-1.5-flash
- **功能**: 
  - 作物病害图像识别
  - 每日农业建议生成
- **输出格式**: 结构化JSON

### 9.2 离线降级
当API不可用时，系统自动返回模拟数据，确保用户体验不中断。

## 10. 设备控制系统

### 10.1 支持设备
- 通风系统 (风速控制)
- 灌溉系统 (时长控制)
- 补光灯 (亮度控制)
- 加热系统 (温度控制)

### 10.2 控制模式
- **AI托管模式**: 系统自动调节，手动控制禁用
- **手动模式**: 用户完全控制所有设备

## 11. 未来规划

- [ ] 多语言支持
- [ ] 离线数据同步
- [ ] 推送通知集成
- [ ] 更多传感器类型支持
- [ ] 农产品溯源二维码生成
- [ ] 社区功能 (农户交流)
- [ ] 专家在线咨询系统

---

**文档版本**: 1.0  
**最后更新**: 2025年12月21日


---

## 12. 后端 API 集成

### 12.1 API 服务架构

```
src/services/api/
├── index.ts          # 统一导出
├── types.ts          # TypeScript 类型定义
├── client.ts         # HTTP 客户端封装
├── auth.ts           # 认证 API
├── device.ts         # 设备管理 API
├── ai.ts             # AI 决策 API
└── data.ts           # 数据采集 API
```

### 12.2 API 端点

| 模块 | 端点 | 方法 | 说明 |
|------|------|------|------|
| Auth | `/auth/login` | POST | 用户登录 |
| Device | `/devices/greenhouses` | GET | 获取大棚列表 |
| Device | `/devices/greenhouses/{id}/detail` | GET | 获取大棚详情 |
| Device | `/devices/{deviceId}/control` | POST | 设备控制 |
| Data | `/data/upload` | POST | 上传传感器数据 |
| AI | `/ai/decision/recommend` | GET | 获取 AI 建议 |
| AI | `/ai/schedule/tasks` | GET | 获取排产任务 |
| Vision | `/vision/diagnosis` | POST | 病害识别 |

### 12.3 认证机制

- 使用 JWT Token 认证
- Token 存储在 AsyncStorage
- 请求自动携带 Authorization Header
- 401 响应自动跳转登录页

### 12.4 使用示例

```typescript
// 登录
import { authApi } from '../services/api';
await authApi.login({ username: 'admin', password: '123456' });

// 获取大棚列表
import { deviceApi } from '../services/api';
const greenhouses = await deviceApi.getGreenhouses();

// 使用 Hooks
import { useGreenhouses, useAiRecommendation } from '../hooks/useApi';
const { greenhouses, loading, refresh } = useGreenhouses();
const { decision } = useAiRecommendation();
```

### 12.5 环境配置

| 环境 | API 地址 |
|------|----------|
| 开发 (Android 模拟器) | `http://10.0.2.2:8080` |
| 开发 (iOS 模拟器) | `http://localhost:8080` |
| 测试 | `https://test-api.smartgreenhouse.com` |
| 生产 | `https://api.smartgreenhouse.com` |
