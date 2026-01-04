import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Switch, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, Box, List, Droplets, Zap, Layers, Sun, MoreVertical, BrainCircuit, TrendingUp, TrendingDown, Fan, Lightbulb, CloudRain, Thermometer, Power, Clock, ChevronRight, Settings2, Activity, RefreshCw } from 'lucide-react-native';
import { Greenhouse, AppRoute } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useGreenhouses, useDeviceControl } from '../hooks/useApi';
import AiChatButton from '../components/AiChatButton';

const GreenhousePage: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [aiMode, setAiMode] = useState(true);
  
  // 使用 API Hook 获取大棚列表
  const { greenhouses: apiGreenhouses, loading, error, refresh } = useGreenhouses();
  const { controlDevice, loading: controlLoading } = useDeviceControl();
  
  // 设备控制状态
  const [devices, setDevices] = useState({
    ventilation: { on: true, speed: 60 },
    irrigation: { on: false, duration: 30 },
    lighting: { on: true, brightness: 80 },
    heating: { on: false, targetTemp: 25 },
  });

  // 转换 API 数据格式
  const greenhouses: Greenhouse[] = apiGreenhouses.map(gh => ({
    id: gh.id,
    name: gh.name,
    crop: gh.crop,
    stage: '生长期', // API 暂无此字段
    status: gh.status === 'NORMAL' ? 'normal' : gh.status === 'WARNING' ? 'warning' : 'critical',
    healthScore: gh.healthScore,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
  }));

  const toggleDevice = async (key: string) => {
    if (aiMode) return; // AI模式下不允许手动控制
    
    const actionMap: Record<string, 'IRRIGATION' | 'VENTILATION' | 'LIGHTING' | 'HEATING'> = {
      ventilation: 'VENTILATION',
      irrigation: 'IRRIGATION',
      lighting: 'LIGHTING',
      heating: 'HEATING'
    };
    
    const newState = !devices[key as keyof typeof devices].on;
    
    // 先更新 UI
    setDevices(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], on: newState }
    }));
    
    // 调用 API（如果有选中的大棚）
    if (selectedId && newState) {
      const success = await controlDevice(`actuator_${key}`, actionMap[key], 300);
      if (!success) {
        // 回滚状态
        setDevices(prev => ({
          ...prev,
          [key]: { ...prev[key as keyof typeof prev], on: !newState }
        }));
        Alert.alert('控制失败', '设备控制指令发送失败');
      }
    }
  };

  if (selectedId) {
    const gh = greenhouses.find(g => g.id === selectedId);
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSelectedId(null)} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>{gh?.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5' }]}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>设备在线</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.moreButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <MoreVertical size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.visualizationArea, { backgroundColor: isDark ? '#0f172a' : '#1e293b' }]}>
                    {/* 背景网格装饰 */}
                    <View style={styles.bgPattern} />
                    
                    <View style={[styles.viewModeToggle, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(51, 65, 85, 0.9)', borderColor: isDark ? '#334155' : '#475569' }]}>
                        <TouchableOpacity 
                            onPress={() => setViewMode('2d')} 
                            style={[styles.viewModeButton, viewMode === '2d' && { backgroundColor: isDark ? '#475569' : '#64748b' }]}
                        >
                            <List size={18} color={viewMode === '2d' ? '#fff' : '#94a3b8'} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setViewMode('3d')} 
                            style={[styles.viewModeButton, viewMode === '3d' && { backgroundColor: isDark ? '#475569' : '#64748b' }]}
                        >
                            <Box size={18} color={viewMode === '3d' ? '#fff' : '#94a3b8'} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={[
                        styles.gridWrapper,
                        viewMode === '3d' && styles.gridWrapper3D
                    ]}>
                        <View style={[
                            styles.gridContainer,
                            viewMode === '3d' && styles.gridContainer3D
                        ]}>
                            {[...Array(9)].map((_, i) => {
                                const row = Math.floor(i / 3);
                                const col = i % 3;
                                const isCenter = i === 4;
                                const depth = viewMode === '3d' ? (2 - row) * 8 : 0;
                                
                                return (
                                    <View 
                                        key={i} 
                                        style={[
                                            styles.gridItem,
                                            viewMode === '3d' && styles.gridItem3D,
                                            { 
                                                backgroundColor: isCenter ? 'rgba(16, 185, 129, 0.4)' : (isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(51, 65, 85, 0.7)'),
                                                borderColor: isCenter ? '#10b981' : (isDark ? '#475569' : '#64748b'),
                                                transform: viewMode === '3d' ? [
                                                    { translateY: -depth },
                                                ] : [],
                                                shadowColor: viewMode === '3d' ? '#000' : 'transparent',
                                                shadowOffset: viewMode === '3d' ? { width: 0, height: depth / 2 } : { width: 0, height: 0 },
                                                shadowOpacity: viewMode === '3d' ? 0.3 : 0,
                                                shadowRadius: viewMode === '3d' ? 8 : 0,
                                                elevation: viewMode === '3d' ? depth : 0,
                                            }
                                        ]}
                                    >
                                        {isCenter && <View style={styles.centerGlow} />}
                                        <View style={[
                                            styles.gridDot, 
                                            { backgroundColor: isCenter ? '#10b981' : (isDark ? '#64748b' : '#94a3b8') },
                                            isCenter && styles.gridDotActive
                                        ]} />
                                        <Text style={[styles.gridText, viewMode === '3d' && { opacity: 0.8 }]}>区-{i+1}</Text>
                                        {viewMode === '3d' && (
                                            <View style={[
                                                styles.gridItemShadow,
                                                { opacity: isCenter ? 0.4 : 0.2 }
                                            ]} />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                        
                        {/* 3D模式下的地面阴影 */}
                        {viewMode === '3d' && (
                            <View style={styles.groundShadow} />
                        )}
                    </View>
                    
                    <View style={[styles.viewModeLabel, { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(51, 65, 85, 0.8)', borderColor: isDark ? '#334155' : '#475569' }]}>
                        <Text style={styles.viewModeLabelText}>{viewMode === '3d' ? '3D 空间视图' : '平面分区视图'}</Text>
                    </View>
                </View>

                <View style={styles.contentWrapper}>
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>A2-中心区域</Text>
                            <View style={[styles.zoneBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', borderColor: isDark ? '#3b82f6' : '#93c5fd' }]}>
                                <Text style={styles.zoneBadgeText}>湿润</Text>
                            </View>
                        </View>
                        <View style={styles.cardSubtitleRow}>
                            <Layers size={12} color={colors.textMuted} />
                            <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>数据融合分析正常</Text>
                        </View>
                        <View style={styles.sensorGrid}>
                            <View style={styles.sensorItemWrapper}>
                                <SensorItem label="土壤水分(10cm)" value="45.2" unit="%" icon={Droplets} trend="up" colors={colors} isDark={isDark} />
                            </View>
                            <View style={styles.sensorItemWrapper}>
                                <SensorItem label="EC 值" value="1.2" unit="mS/cm" icon={Zap} trend="stable" colors={colors} isDark={isDark} />
                            </View>
                            <View style={styles.sensorItemWrapper}>
                                <SensorItem label="根系吸水" value="-12%" unit="效率" icon={Layers} highlight trend="down" colors={colors} isDark={isDark} />
                            </View>
                            <View style={styles.sensorItemWrapper}>
                                <SensorItem label="光照强度" value="High" unit="" icon={Sun} trend="up" colors={colors} isDark={isDark} />
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.controlSection}>
                        <View style={styles.controlHeader}>
                            <Text style={[styles.controlTitle, { color: colors.text }]}>控制与执行</Text>
                            <View style={[styles.controlDivider, { backgroundColor: colors.border }]} />
                        </View>
                        
                        {/* AI托管模式卡片 */}
                        <View style={[styles.aiModeCard, { 
                            backgroundColor: aiMode ? (isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff') : colors.card, 
                            borderColor: aiMode ? '#6366f1' : colors.border 
                        }]}>
                            <View style={styles.aiModeHeader}>
                                <View style={[styles.aiModeIcon, { backgroundColor: aiMode ? '#6366f1' : (isDark ? colors.border : '#e5e7eb') }]}>
                                    <BrainCircuit size={20} color={aiMode ? '#fff' : colors.textMuted} />
                                </View>
                                <View style={styles.aiModeContent}>
                                    <Text style={[styles.aiModeTitle, { color: colors.text }]}>AI 托管模式</Text>
                                    <Text style={[styles.aiModeDesc, { color: colors.textMuted }]}>系统自动调节水肥配比</Text>
                                </View>
                                <Switch
                                    value={aiMode}
                                    onValueChange={setAiMode}
                                    trackColor={{ false: isDark ? '#475569' : '#e5e7eb', true: '#a5b4fc' }}
                                    thumbColor={aiMode ? '#6366f1' : isDark ? '#94a3b8' : '#f4f4f5'}
                                />
                            </View>
                            
                            {aiMode && (
                                <>
                                    <View style={[styles.aiStatusBar, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)' }]}>
                                        <View style={styles.aiStatusDot} />
                                        <Text style={styles.aiStatusText}>AI 托管运行中</Text>
                                    </View>
                                    
                                    {/* AI 运行状态详情 */}
                                    <View style={styles.aiStatsGrid}>
                                        <View style={[styles.aiStatItem, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)' }]}>
                                            <Activity size={14} color="#6366f1" />
                                            <Text style={[styles.aiStatValue, { color: colors.text }]}>24h</Text>
                                            <Text style={[styles.aiStatLabel, { color: colors.textMuted }]}>运行时长</Text>
                                        </View>
                                        <View style={[styles.aiStatItem, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)' }]}>
                                            <Zap size={14} color="#f59e0b" />
                                            <Text style={[styles.aiStatValue, { color: colors.text }]}>12</Text>
                                            <Text style={[styles.aiStatLabel, { color: colors.textMuted }]}>今日调控</Text>
                                        </View>
                                        <View style={[styles.aiStatItem, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)' }]}>
                                            <TrendingUp size={14} color="#10b981" />
                                            <Text style={[styles.aiStatValue, { color: colors.text }]}>+8%</Text>
                                            <Text style={[styles.aiStatLabel, { color: colors.textMuted }]}>效率提升</Text>
                                        </View>
                                    </View>

                                    {/* AI 最近操作 */}
                                    <View style={[styles.aiRecentActions, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)' }]}>
                                        <Text style={[styles.aiRecentTitle, { color: colors.textMuted }]}>最近操作</Text>
                                        <View style={styles.aiRecentItem}>
                                            <Clock size={12} color={colors.textMuted} />
                                            <Text style={[styles.aiRecentText, { color: colors.textSecondary }]}>14:32 自动开启通风 (温度过高)</Text>
                                        </View>
                                        <View style={styles.aiRecentItem}>
                                            <Clock size={12} color={colors.textMuted} />
                                            <Text style={[styles.aiRecentText, { color: colors.textSecondary }]}>12:00 灌溉完成 (EC值1.8)</Text>
                                        </View>
                                    </View>
                                </>
                            )}
                        </View>

                        {/* 手动控制区域 */}
                        <View style={styles.manualSection}>
                            <View style={styles.manualHeader}>
                                <Text style={[styles.manualTitle, { color: colors.textMuted }]}>手动控制</Text>
                                {aiMode && (
                                    <View style={[styles.manualDisabledBadge, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                                        <Text style={[styles.manualDisabledText, { color: colors.textMuted }]}>AI托管中已禁用</Text>
                                    </View>
                                )}
                            </View>

                            <View style={[styles.deviceGrid, { opacity: aiMode ? 0.5 : 1 }]} pointerEvents={aiMode ? 'none' : 'auto'}>
                                <TouchableOpacity 
                                    style={[styles.deviceCard, { 
                                        backgroundColor: colors.card, 
                                        borderColor: devices.ventilation.on ? '#10b981' : colors.border 
                                    }]}
                                    onPress={() => toggleDevice('ventilation')}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.deviceCardHeader}>
                                        <View style={[styles.deviceIcon, { backgroundColor: devices.ventilation.on ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : (isDark ? colors.border : '#f3f4f6') }]}>
                                            <Fan size={18} color={devices.ventilation.on ? '#10b981' : colors.textMuted} />
                                        </View>
                                        <View style={[styles.devicePowerBtn, devices.ventilation.on && styles.devicePowerBtnOn]}>
                                            <Power size={12} color={devices.ventilation.on ? '#fff' : colors.textMuted} />
                                        </View>
                                    </View>
                                    <Text style={[styles.deviceLabel, { color: colors.text }]}>通风系统</Text>
                                    <Text style={[styles.deviceStatus, { color: devices.ventilation.on ? '#10b981' : colors.textMuted }]}>
                                        {devices.ventilation.on ? `${devices.ventilation.speed}% 风速` : '已关闭'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.deviceCard, { 
                                        backgroundColor: colors.card, 
                                        borderColor: devices.irrigation.on ? '#3b82f6' : colors.border 
                                    }]}
                                    onPress={() => toggleDevice('irrigation')}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.deviceCardHeader}>
                                        <View style={[styles.deviceIcon, { backgroundColor: devices.irrigation.on ? (isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe') : (isDark ? colors.border : '#f3f4f6') }]}>
                                            <CloudRain size={18} color={devices.irrigation.on ? '#3b82f6' : colors.textMuted} />
                                        </View>
                                        <View style={[styles.devicePowerBtn, devices.irrigation.on && { backgroundColor: '#3b82f6' }]}>
                                            <Power size={12} color={devices.irrigation.on ? '#fff' : colors.textMuted} />
                                        </View>
                                    </View>
                                    <Text style={[styles.deviceLabel, { color: colors.text }]}>灌溉系统</Text>
                                    <Text style={[styles.deviceStatus, { color: devices.irrigation.on ? '#3b82f6' : colors.textMuted }]}>
                                        {devices.irrigation.on ? `${devices.irrigation.duration}分钟` : '已关闭'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.deviceCard, { 
                                        backgroundColor: colors.card, 
                                        borderColor: devices.lighting.on ? '#f59e0b' : colors.border 
                                    }]}
                                    onPress={() => toggleDevice('lighting')}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.deviceCardHeader}>
                                        <View style={[styles.deviceIcon, { backgroundColor: devices.lighting.on ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7') : (isDark ? colors.border : '#f3f4f6') }]}>
                                            <Lightbulb size={18} color={devices.lighting.on ? '#f59e0b' : colors.textMuted} />
                                        </View>
                                        <View style={[styles.devicePowerBtn, devices.lighting.on && { backgroundColor: '#f59e0b' }]}>
                                            <Power size={12} color={devices.lighting.on ? '#fff' : colors.textMuted} />
                                        </View>
                                    </View>
                                    <Text style={[styles.deviceLabel, { color: colors.text }]}>补光灯</Text>
                                    <Text style={[styles.deviceStatus, { color: devices.lighting.on ? '#f59e0b' : colors.textMuted }]}>
                                        {devices.lighting.on ? `${devices.lighting.brightness}% 亮度` : '已关闭'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.deviceCard, { 
                                        backgroundColor: colors.card, 
                                        borderColor: devices.heating.on ? '#ef4444' : colors.border 
                                    }]}
                                    onPress={() => toggleDevice('heating')}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.deviceCardHeader}>
                                        <View style={[styles.deviceIcon, { backgroundColor: devices.heating.on ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2') : (isDark ? colors.border : '#f3f4f6') }]}>
                                            <Thermometer size={18} color={devices.heating.on ? '#ef4444' : colors.textMuted} />
                                        </View>
                                        <View style={[styles.devicePowerBtn, devices.heating.on && { backgroundColor: '#ef4444' }]}>
                                            <Power size={12} color={devices.heating.on ? '#fff' : colors.textMuted} />
                                        </View>
                                    </View>
                                    <Text style={[styles.deviceLabel, { color: colors.text }]}>加热系统</Text>
                                    <Text style={[styles.deviceStatus, { color: devices.heating.on ? '#ef4444' : colors.textMuted }]}>
                                        {devices.heating.on ? `目标 ${devices.heating.targetTemp}°C` : '已关闭'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* 快捷操作 - 始终可用 */}
                            <View style={[styles.quickActions, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate(AppRoute.QUICK_IRRIGATION)}>
                                    <View style={[styles.quickActionIcon, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5' }]}>
                                        <CloudRain size={16} color="#10b981" />
                                    </View>
                                    <View style={styles.quickActionContent}>
                                        <Text style={[styles.quickActionLabel, { color: colors.text }]}>一键灌溉</Text>
                                        <Text style={[styles.quickActionDesc, { color: colors.textMuted }]}>启动30分钟标准灌溉</Text>
                                    </View>
                                    <ChevronRight size={16} color={colors.textMuted} />
                                </TouchableOpacity>
                                
                                <View style={[styles.quickActionDivider, { backgroundColor: colors.border }]} />
                                
                                <TouchableOpacity style={styles.quickActionItem}>
                                    <View style={[styles.quickActionIcon, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }]}>
                                        <Fan size={16} color="#3b82f6" />
                                    </View>
                                    <View style={styles.quickActionContent}>
                                        <Text style={[styles.quickActionLabel, { color: colors.text }]}>紧急通风</Text>
                                        <Text style={[styles.quickActionDesc, { color: colors.textMuted }]}>全速通风降温</Text>
                                    </View>
                                    <ChevronRight size={16} color={colors.textMuted} />
                                </TouchableOpacity>
                                
                                <View style={[styles.quickActionDivider, { backgroundColor: colors.border }]} />
                                
                                <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate(AppRoute.DEVICE_SETTINGS)}>
                                    <View style={[styles.quickActionIcon, { backgroundColor: isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6' }]}>
                                        <Settings2 size={16} color={colors.textMuted} />
                                    </View>
                                    <View style={styles.quickActionContent}>
                                        <Text style={[styles.quickActionLabel, { color: colors.text }]}>设备设置</Text>
                                        <Text style={[styles.quickActionDesc, { color: colors.textMuted }]}>调整设备参数</Text>
                                    </View>
                                    <ChevronRight size={16} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
  }

  return (
    <>
    <ScrollView style={[styles.listContainer, { backgroundColor: colors.background }]} contentContainerStyle={styles.listContent}>
        <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: colors.text }]}>大棚管理</Text>
            <Text style={[styles.listSubtitle, { color: colors.textMuted }]}>共 {greenhouses.length} 个区域接入 · <Text style={{ color: '#10b981' }}>全部在线</Text></Text>
        </View>

        {greenhouses.map((gh) => (
            <TouchableOpacity 
                key={gh.id} 
                onPress={() => setSelectedId(gh.id)} 
                style={[styles.greenhouseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.9}
            >
                 <View style={[styles.imageContainer, { backgroundColor: isDark ? '#1e293b' : '#f3f4f6' }]}>
                     <Image source={{ uri: gh.image }} style={styles.greenhouseImage} resizeMode="cover" />
                     <View style={styles.cropBadge}>
                         <Text style={styles.cropText}>{gh.crop}</Text>
                     </View>
                 </View>
                 <View style={styles.greenhouseContent}>
                    <View style={styles.greenhouseInfo}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.greenhouseName, { color: colors.text }]}>{gh.name}</Text>
                            <View style={[styles.statusIndicator, { backgroundColor: gh.status === 'normal' ? '#10b981' : '#ef4444' }]} />
                        </View>
                        <View style={[styles.stageBadge, { backgroundColor: isDark ? 'rgba(51, 65, 85, 0.5)' : '#f9fafb' }]}>
                            <Text style={[styles.stageText, { color: colors.textMuted }]}>{gh.stage}</Text>
                        </View>
                    </View>
                    <View style={styles.healthSection}>
                        <View style={styles.healthHeader}>
                            <Text style={[styles.healthLabel, { color: colors.textMuted }]}>健康指数</Text>
                            <Text style={[styles.healthScore, { color: gh.healthScore > 80 ? '#10b981' : '#f59e0b' }]}>{gh.healthScore}</Text>
                        </View>
                        <View style={[styles.healthBarContainer, { backgroundColor: isDark ? '#1e293b' : '#f3f4f6' }]}>
                            <View style={[styles.healthBar, { width: `${gh.healthScore}%`, backgroundColor: gh.healthScore > 80 ? '#10b981' : '#f59e0b' }]} />
                        </View>
                    </View>
                 </View>
            </TouchableOpacity>
        ))}
    </ScrollView>
    <AiChatButton />
    </>
  );
};

const SensorItem = ({label, value, unit, icon: Icon, highlight, trend, colors, isDark}: any) => (
    <View style={[styles.sensorItem, { backgroundColor: isDark ? colors.border : '#f9fafb' }]}>
        <View style={[styles.sensorIconContainer, { 
            backgroundColor: highlight ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2') : colors.card,
            borderColor: highlight ? '#ef4444' : colors.border
        }]}>
            <Icon size={18} color={highlight ? '#ef4444' : colors.textMuted} />
        </View>
        <View style={styles.sensorItemContent}>
            <View style={styles.sensorValueRow}>
                <Text style={[styles.sensorValue, { color: highlight ? '#ef4444' : colors.text }]}>
                    {value} <Text style={[styles.sensorUnit, { color: colors.textMuted }]}>{unit}</Text>
                </Text>
                {trend === 'up' && <TrendingUp size={10} color="#ef4444" />}
                {trend === 'down' && <TrendingDown size={10} color="#10b981" />}
            </View>
            <Text style={[styles.sensorLabel, { color: colors.textMuted }]}>{label}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSafeArea: {
    borderBottomWidth: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 10,
    color: '#10b981',
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  visualizationArea: {
    height: 320,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  viewModeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  viewModeButton: {
    padding: 6,
    borderRadius: 8,
  },
  gridWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridWrapper3D: {
    transform: [
      { perspective: 800 },
      { rotateX: '55deg' },
      { rotateZ: '-45deg' },
      { scale: 0.85 },
    ],
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 264,
    justifyContent: 'center',
    gap: 8,
  },
  gridContainer3D: {
    gap: 12,
  },
  gridItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridItem3D: {
    width: 76,
    height: 76,
    borderRadius: 6,
    borderWidth: 2,
  },
  centerGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  gridDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  gridDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  gridText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  gridItemShadow: {
    position: 'absolute',
    bottom: -8,
    left: 4,
    right: 4,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 4,
    transform: [{ scaleY: 0.3 }],
  },
  groundShadow: {
    position: 'absolute',
    bottom: -40,
    width: 200,
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
  },
  viewModeLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  viewModeLabelText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  contentWrapper: {
    paddingHorizontal: 20,
    marginTop: -24,
  },
  card: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  zoneBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  cardSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sensorItemWrapper: {
    width: '47%',
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 12,
  },
  sensorIconContainer: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  sensorItemContent: {
    flex: 1,
  },
  sensorValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sensorValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sensorUnit: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  sensorLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  controlSection: {
    marginTop: 8,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    marginLeft: 4,
  },
  controlTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  controlDivider: {
    flex: 1,
    height: 1,
  },
  aiModeCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  aiModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiModeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiModeContent: {
    flex: 1,
  },
  aiModeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  aiModeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  aiStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  aiStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
  },
  aiStatusText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  aiStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  aiStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 4,
  },
  aiStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiStatLabel: {
    fontSize: 10,
  },
  aiRecentActions: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  aiRecentTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  aiRecentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aiRecentText: {
    fontSize: 11,
  },
  manualSection: {
    marginTop: 8,
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginLeft: 4,
  },
  manualTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  manualDisabledBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  manualDisabledText: {
    fontSize: 10,
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  deviceCard: {
    width: '47%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  deviceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devicePowerBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  devicePowerBtnOn: {
    backgroundColor: '#10b981',
  },
  deviceLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  deviceStatus: {
    fontSize: 11,
  },
  quickActions: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 100,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  quickActionDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  quickActionDivider: {
    height: 1,
    marginLeft: 62,
  },
  aiCard: {
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  aiSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 56,
    height: 32,
    backgroundColor: '#10b981',
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 4,
  },
  toggleDot: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  disabledCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 96,
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  disabledDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  disabledText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    opacity: 0.5,
  },
  disabledBar: {
    height: 12,
    borderRadius: 6,
    opacity: 0.5,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  listHeader: {
    marginBottom: 20,
    marginTop: 8,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  listSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  greenhouseCard: {
    width: '100%',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  imageContainer: {
    width: 112,
    height: 112,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  greenhouseImage: {
    width: '100%',
    height: '100%',
  },
  cropBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  cropText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  greenhouseContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  greenhouseInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greenhouseName: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  stageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  stageText: {
    fontSize: 12,
    fontWeight: '500',
  },
  healthSection: {
    marginTop: 'auto',
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  healthLabel: {
    fontSize: 12,
  },
  healthScore: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  healthBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  healthBar: {
    height: '100%',
    borderRadius: 999,
  },
});

export default GreenhousePage;