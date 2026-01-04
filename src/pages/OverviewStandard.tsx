import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { AlertTriangle, Droplets, Zap, CheckCircle, Leaf, CloudSun, Wind } from 'lucide-react-native';
import { getDailyAdvice } from '../services/geminiService';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAiRecommendation, useGreenhouses } from '../hooks/useApi';
import { dataApi } from '../services/api';
import AiChatButton from '../components/AiChatButton';

const OverviewStandard: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [healthScore, setHealthScore] = useState(0);
  const [advice, setAdvice] = useState<{suggestion: string, reason: string}>({
    suggestion: '今日建议暂停灌溉',
    reason: '根区传感器显示水分充足，且下午预计气温转凉，避免根系缺氧。'
  });
  const [envData, setEnvData] = useState<{temp: number, humidity: number}>({ temp: 24, humidity: 65 });

  // 使用 API Hooks
  const { decision, loading: decisionLoading } = useAiRecommendation();
  const { greenhouses, loading: greenhousesLoading } = useGreenhouses();

  // 获取环境数据
  useEffect(() => {
    dataApi.getEnvironmentData(undefined, '1h')
      .then(data => {
        if (data && data.length > 0) {
          const latest = data[data.length - 1];
          setEnvData({ temp: latest.temp, humidity: latest.humidity });
        }
      })
      .catch(err => console.log('获取环境数据失败:', err));
  }, []);

  useEffect(() => {
    // 计算平均健康分数
    if (greenhouses.length > 0) {
      const avgScore = Math.round(greenhouses.reduce((sum, gh) => sum + gh.healthScore, 0) / greenhouses.length);
      setTimeout(() => setHealthScore(avgScore), 100);
    } else {
      setTimeout(() => setHealthScore(86), 100);
    }
  }, [greenhouses]);

  useEffect(() => {
    // 使用 API 返回的 AI 建议
    if (decision) {
      const actionMap: Record<string, string> = {
        'IRRIGATION': '启动灌溉',
        'VENTILATION': '开启通风',
        'LIGHTING': '补充光照',
        'HEATING': '启动加热'
      };
      setAdvice({
        suggestion: `AI 建议: ${actionMap[decision.action] || decision.action}`,
        reason: decision.reason
      });
    } else {
      // 回退到 Gemini 服务
      getDailyAdvice()
        .then(data => {
          if (data && data.suggestion) {
            setAdvice(data);
          }
        })
        .catch(err => console.log('获取建议失败:', err));
    }
  }, [decision]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius; 
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.welcomeText, { color: colors.textMuted }]}>欢迎回来</Text>
              <Text style={[styles.farmName, { color: colors.text }]}>绿智云棚</Text>
            </View>
            <View style={styles.weatherContainer}>
              <View style={[styles.weatherBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <CloudSun size={16} color="#f59e0b" />
                <Text style={[styles.tempText, { color: colors.textSecondary }]}>{envData.temp}°C</Text>
              </View>
              <Text style={[styles.humidityText, { color: colors.textMuted }]}>湿度 {envData.humidity}% · {envData.humidity > 70 ? '偏高' : envData.humidity < 40 ? '偏低' : '适宜'}</Text>
            </View>
          </View>

          <View style={[styles.healthCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.healthCardAccent} />
            {/* 装饰性背景 */}
            <View style={[styles.decorCircle1, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.08)' }]} />
            <View style={[styles.decorCircle2, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.03)' : 'rgba(16, 185, 129, 0.05)' }]} />
            
            <View style={styles.ringContainer}>
              <View style={styles.svgWrapper}>
                <Svg width={180} height={180} viewBox="0 0 180 180">
                  <Defs>
                    <LinearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#34d399" />
                      <Stop offset="50%" stopColor="#10b981" />
                      <Stop offset="100%" stopColor="#059669" />
                    </LinearGradient>
                    <LinearGradient id="gradientBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={isDark ? '#1e293b' : '#f1f5f9'} />
                      <Stop offset="100%" stopColor={isDark ? '#334155' : '#e2e8f0'} />
                    </LinearGradient>
                  </Defs>
                  {/* 外圈装饰 */}
                  <Circle cx="90" cy="90" r="85" stroke={isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)'} strokeWidth="1" fill="transparent" strokeDasharray="4 4" />
                  {/* 背景圆环 */}
                  <Circle cx="90" cy="90" r={radius} stroke="url(#gradientBg)" strokeWidth="14" fill="transparent" />
                  {/* 进度圆环 */}
                  <Circle 
                    cx="90" cy="90" r={radius} 
                    stroke="url(#gradientScore)" 
                    strokeWidth="14" 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation={-90}
                    origin="90, 90"
                  />
                  {/* 起点装饰点 */}
                  <Circle cx="90" cy={90 - radius} r="4" fill="#34d399" />
                </Svg>
              </View>
              <View style={styles.scoreContainer}>
                <View style={styles.scoreRow}>
                  <Text style={[styles.scoreText, { color: '#10b981' }]}>{healthScore}</Text>
                  <Text style={[styles.scoreMax, { color: colors.textMuted }]}>/100</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5', borderWidth: 1, borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0' }]}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>健康状况优</Text>
                </View>
              </View>
            </View>
            
            <View style={[styles.metricsDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.metricsRow}>
              <MetricMini label="环境" val={92} color="#10b981" icon={Leaf} colors={colors} isDark={isDark} />
              <View style={[styles.metricSeparator, { backgroundColor: colors.border }]} />
              <MetricMini label="水肥" val={78} color="#f59e0b" icon={Droplets} colors={colors} isDark={isDark} isWarning />
              <View style={[styles.metricSeparator, { backgroundColor: colors.border }]} />
              <MetricMini label="病害" val={95} color="#10b981" icon={CheckCircle} colors={colors} isDark={isDark} />
              <View style={[styles.metricSeparator, { backgroundColor: colors.border }]} />
              <MetricMini label="能源" val={88} color="#10b981" icon={Zap} colors={colors} isDark={isDark} />
            </View>
          </View>

          <View style={styles.riskSection}>
            <View style={styles.riskHeader}>
              <Text style={[styles.riskTitle, { color: colors.text }]}>今日风险摘要</Text>
              <View style={[styles.aiBadge, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                <Text style={[styles.aiBadgeText, { color: colors.textMuted }]}>AI 实时分析</Text>
              </View>
            </View>
            <View style={styles.riskCards}>
              <RiskCard type="warning" title="根区含氧量下降" desc="持续灌溉导致土壤孔隙度降低，建议控水。" colors={colors} isDark={isDark} />
              <RiskCard type="info" title="午后高温预警" desc="预计 14:00 棚内温度超过 32℃，自动开启遮阳。" colors={colors} isDark={isDark} />
            </View>
          </View>

          <View style={[styles.adviceCard, { backgroundColor: isDark ? '#312e81' : '#4f46e5' }]}>
            <View style={styles.adviceDecor} />
            <View style={styles.adviceContent}>
              <View style={styles.adviceHeader}>
                <View style={styles.adviceTitleRow}>
                  <View style={[styles.adviceIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)' }]}>
                    <Zap size={16} color="#fcd34d" />
                  </View>
                  <Text style={styles.adviceLabel}>AI 决策建议</Text>
                </View>
              </View>
              <Text style={styles.adviceSuggestion}>{advice.suggestion}</Text>
              <Text style={styles.adviceReason}>依据：{advice.reason}</Text>
              <TouchableOpacity style={[styles.adviceButton, { backgroundColor: isDark ? '#e0e7ff' : '#fff' }]} activeOpacity={0.8}>
                <CheckCircle size={14} color="#4338ca" />
                <Text style={styles.adviceButtonText}>一键执行</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* AI 问答悬浮按钮 */}
      <AiChatButton />
    </View>
  );
};

const MetricMini = ({label, val, color, icon: Icon, colors, isDark, isWarning}: any) => (
  <View style={styles.metricItem}>
    <View style={[styles.metricIconBg, { backgroundColor: isDark ? `${color}20` : `${color}15` }]}>
      <Icon size={18} color={color} />
    </View>
    <View style={[styles.metricBarBg, { backgroundColor: isDark ? colors.border : '#e5e7eb' }]}>
      <View style={[styles.metricBar, { width: `${val}%`, backgroundColor: color }]} />
    </View>
    <View style={styles.metricValueRow}>
      <Text style={[styles.metricValue, { color: color }]}>{val}</Text>
      {isWarning && <View style={[styles.metricWarningDot, { backgroundColor: color }]} />}
    </View>
    <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
  </View>
);

const RiskCard = ({type, title, desc, colors, isDark}: any) => {
  const isWarning = type === 'warning';
  return (
    <View style={[styles.riskCard, isWarning ? (isDark ? styles.riskCardWarningDark : styles.riskCardWarning) : { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.riskIconBg, isWarning ? styles.riskIconWarning : (isDark ? { backgroundColor: 'rgba(59, 130, 246, 0.2)' } : styles.riskIconInfo)]}>
        {isWarning ? <AlertTriangle size={20} color="#f97316" /> : <Wind size={20} color="#3b82f6" />}
      </View>
      <View style={styles.riskCardContent}>
        <View style={styles.riskCardTitleRow}>
          <Text style={[styles.riskCardTitle, { color: colors.text }]}>{title}</Text>
          {isWarning && <View style={styles.warningDot} />}
        </View>
        <Text style={[styles.riskCardDesc, { color: colors.textMuted }]}>{desc}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, paddingTop: 8 },
  welcomeText: { fontSize: 12, fontWeight: 'bold', marginBottom: 2, textTransform: 'uppercase' },
  farmName: { fontSize: 24, fontWeight: '800' },
  weatherContainer: { alignItems: 'flex-end' },
  weatherBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  tempText: { fontWeight: 'bold' },
  humidityText: { fontSize: 10, marginTop: 4 },
  healthCard: { borderRadius: 32, padding: 24, borderWidth: 1, alignItems: 'center', position: 'relative', overflow: 'hidden', marginBottom: 24 },
  healthCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#10b981', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  decorCircle1: { position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 90 },
  decorCircle2: { position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: 70 },
  ringContainer: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginVertical: 8, position: 'relative' },
  svgWrapper: { position: 'absolute', top: 0, left: 0 },
  scoreContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  scoreText: { fontSize: 44, fontWeight: '900' },
  scoreMax: { fontSize: 14, fontWeight: 'bold', marginLeft: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#059669' },
  metricsDivider: { width: '90%', height: 1, marginTop: 20, marginBottom: 20 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 8 },
  metricSeparator: { width: 1, height: 50, opacity: 0.5 },
  metricItem: { alignItems: 'center', flex: 1 },
  metricIconBg: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  metricBarBg: { width: '85%', height: 5, borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  metricBar: { height: '100%', borderRadius: 999 },
  metricValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricValue: { fontSize: 14, fontWeight: '800' },
  metricWarningDot: { width: 5, height: 5, borderRadius: 3 },
  metricLabel: { fontSize: 10, marginTop: 2, fontWeight: '500' },
  riskSection: { marginBottom: 24 },
  riskHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  riskTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 4 },
  aiBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  aiBadgeText: { fontSize: 10 },
  riskCards: { gap: 12 },
  riskCard: { padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 12 },
  riskCardWarning: { backgroundColor: '#fff7ed', borderColor: '#fed7aa' },
  riskCardWarningDark: { backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.3)' },
  riskIconBg: { padding: 10, borderRadius: 12 },
  riskIconWarning: { backgroundColor: '#ffedd5' },
  riskIconInfo: { backgroundColor: '#eff6ff' },
  riskCardContent: { flex: 1 },
  riskCardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  riskCardTitle: { fontSize: 14, fontWeight: 'bold' },
  warningDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f97316' },
  riskCardDesc: { fontSize: 12, marginTop: 4, lineHeight: 18 },
  adviceCard: { backgroundColor: '#4f46e5', borderRadius: 24, padding: 24, overflow: 'hidden', position: 'relative' },
  adviceDecor: { position: 'absolute', right: -48, top: -48, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.1)' },
  adviceContent: { position: 'relative', zIndex: 10 },
  adviceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  adviceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  adviceIcon: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  adviceLabel: { fontWeight: 'bold', fontSize: 14, color: '#c7d2fe' },
  adviceSuggestion: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#fff', lineHeight: 26 },
  adviceReason: { color: '#c7d2fe', fontSize: 12, marginBottom: 20, fontWeight: '500' },
  adviceButton: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  adviceButtonText: { color: '#4338ca', fontSize: 12, fontWeight: 'bold' },
});

export default OverviewStandard;
