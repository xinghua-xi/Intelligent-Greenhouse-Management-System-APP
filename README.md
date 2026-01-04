# 绿智云棚

智慧温室大棚管理系统移动端应用，基于 React Native + Expo 开发。

## 功能特性

- 🌡️ **环境监控** - 实时查看温度、湿度、光照、CO2 等环境数据
- 🤖 **AI 智能问答** - 支持语音输入，讯飞语音识别，DeepSeek 大模型回答
- 📊 **三种操作模式** - 极简/标准/专家模式，适配不同用户需求
- 🚨 **智能预警** - AI 分析风险，自动推送预警通知
- 🎛️ **设备控制** - 远程控制灌溉、通风、补光、加热等设备
- 📱 **离线数据采集** - 支持离线记录，联网后自动同步

## 技术栈

- **框架**: React Native + Expo SDK 54
- **语言**: TypeScript
- **状态管理**: React Context
- **UI**: NativeWind (Tailwind CSS)
- **导航**: React Navigation
- **语音**: expo-av + expo-speech
- **后端**: Spring Cloud 微服务

## 项目结构

```
├── src/
│   ├── components/      # 公共组件
│   ├── context/         # 全局状态
│   ├── hooks/           # 自定义 Hooks
│   ├── pages/           # 页面组件
│   └── services/        # API 服务
├── assets/              # 静态资源
├── App.tsx              # 应用入口
└── app.config.js        # Expo 配置
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo Go App (手机端)

### 安装依赖

```bash
npm install
```

### 配置后端地址

修改 `src/services/api/client.ts` 中的 IP 和端口：

```typescript
const DEV_CONFIG = {
  LOCAL_IP: '192.168.0.2',  // 你的电脑局域网 IP
  PORT: '8080',              // 后端网关端口
};
```

### 启动开发服务器

```bash
npm start
```

用 Expo Go 扫描二维码即可在手机上运行。

## 后端接口

| 服务 | 端口 | 说明 |
|------|------|------|
| gateway-service | 8080 | API 网关 |
| auth-service | 8081 | 认证服务 |
| device-service | 8082 | 设备服务 |
| data-service | 8083 | 数据服务 |
| ai-decision-service | 8084 | AI 决策服务 |
| vision-service | 8085 | 视觉服务 |

## 主要页面

- **首页** - 健康评分、环境概览、AI 建议
- **大棚管理** - 大棚列表、设备控制
- **智能中心** - AI 托管、智能排产
- **预警中心** - 风险预警、历史记录
- **我的** - 个人设置、模式切换

## License

MIT
