import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Cpu, Activity, Thermometer, Droplets, Sun, Zap, TrendingUp, Clock, Play, Pause, RotateCcw, Layers, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';

const SmartExpert: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'model' | 'twin' | 'logs'>('model');
  const [simRunning, setSimRunning] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [metrics, setMetrics] = useState({ temp: 24.5, humidity: 65, light: 850, ec: 1.2, yield: 92 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simRunning) {
      interval = setInterval(() => {
        setSimTime(t => t + 1);
        setMetrics(m => ({
          temp: Math.min(32, Math.max(18, m.temp + (Math.random() - 0.5) * 1.5)),
          humidity: Math.min(85, Math.max(45, m.humidity + (Math.random() - 0.5) * 3)),
          light: Math.min(1200, Math.max(400, m.light + (Math.random() - 0.5) * 80)),
          ec: Math.min(2.5, Math.max(0.8, m.ec + (Math.random() - 0.5) * 0.2)),
          yield: Math.min(100, m.yield + Math.random() * 0.3)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simRunning]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const logs = [
    { time: '14:32:15', type: 'action', msg: '通风系统启动 - 温度阈值触发' },
    { time: '14:30:00', type: 'predict', msg: '预测模型更新 - 产量指数 +0.3%' },
    { time: '14:25:42', type: 'alert', msg: 'EC值接近上限 (2.3 mS/cm)' },
    { time: '14:20:00', type: 'action', msg: '灌溉完成 - 持续15分钟' },
    { time: '14:15:33', type: 'predict', msg: '光照积算达标 - DLI 12.5' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Cpu size={18} color="#34d399" />
            <Text style={styles.title}>智能决策中心</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>模型运行中</Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          {[
            { key: 'model', label: 'AI模型', icon: Activity },
            { key: 'twin', label: '数字孪生', icon: Layers },
            { key: 'logs', label: '执行日志', icon: Clock }
          ].map(tab => (
            <TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.tabActive]} onPress={() => setActiveTab(tab.key as any)}>
              <tab.icon size={14} color={activeTab === tab.key ? '#34d399' : '#64748b'} />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'model' && (
            <View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>模型性能监控</Text>
                <View style={styles.metricsRow}>
                  <MetricBox label="推理延迟" value="23ms" color="#10b981" />
                  <MetricBox label="准确率" value="96.2%" color="#3b82f6" />
                  <MetricBox label="调用次数" value="1,247" color="#f59e0b" />
                </View>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>实时预测曲线</Text>
                <Svg width="100%" height={120} viewBox="0 0 300 120">
                  <Line x1="30" y1="100" x2="280" y2="100" stroke="#334155" strokeWidth="1" />
                  <Line x1="30" y1="20" x2="30" y2="100" stroke="#334155" strokeWidth="1" />
                  <Path d="M 30 80 Q 80 70, 120 55 T 180 45 T 240 35 T 280 30" stroke="#10b981" strokeWidth="2" fill="none" />
                  <Path d="M 30 60 Q 80 65, 120 70 T 180 60 T 240 55 T 280 50" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                  <SvgText x="285" y="32" fill="#10b981" fontSize="8">实际</SvgText>
                  <SvgText x="285" y="52" fill="#3b82f6" fontSize="8">预测</SvgText>
                </Svg>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>决策建议队列</Text>
                <View style={styles.suggestionItem}>
                  <View style={[styles.suggestionIcon, { backgroundColor: 'rgba(245,158,11,0.2)' }]}><Zap size={14} color="#f59e0b" /></View>
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionTitle}>EC值调整建议</Text>
                    <Text style={styles.suggestionDesc}>建议将EC值从1.2提升至1.5 mS/cm</Text>
                  </View>
                  <Text style={styles.suggestionConf}>87%</Text>
                </View>
                <View style={styles.suggestionItem}>
                  <View style={[styles.suggestionIcon, { backgroundColor: 'rgba(59,130,246,0.2)' }]}><Droplets size={14} color="#3b82f6" /></View>
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionTitle}>灌溉时间优化</Text>
                    <Text style={styles.suggestionDesc}>建议将灌溉时间调整至06:00</Text>
                  </View>
                  <Text style={styles.suggestionConf}>92%</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'twin' && (
            <View>
              <View style={styles.twinCard}>
                <View style={styles.twinHeader}>
                  <Text style={styles.twinLabel}>模拟时间</Text>
                  <Text style={styles.twinTime}>{formatTime(simTime)}</Text>
                </View>
                <Svg width="100%" height={160} viewBox="0 0 300 160">
                  <Path d="M 20 130 L 20 60 Q 150 10 280 60 L 280 130 Z" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="2" />
                  <Circle cx={50} cy={110} r={6 + metrics.yield * 0.08} fill="#22c55e" opacity={0.8} />
                  <Line x1={50} y1={118} x2={50} y2={130} stroke="#15803d" strokeWidth="2" />
                  <Circle cx={100} cy={110} r={6 + metrics.yield * 0.08} fill="#22c55e" opacity={0.8} />
                  <Line x1={100} y1={118} x2={100} y2={130} stroke="#15803d" strokeWidth="2" />
                  <Circle cx={150} cy={110} r={6 + metrics.yield * 0.08} fill="#22c55e" opacity={0.8} />
                  <Line x1={150} y1={118} x2={150} y2={130} stroke="#15803d" strokeWidth="2" />
                  <Circle cx={200} cy={110} r={6 + metrics.yield * 0.08} fill="#22c55e" opacity={0.8} />
                  <Line x1={200} y1={118} x2={200} y2={130} stroke="#15803d" strokeWidth="2" />
                  <Circle cx={250} cy={110} r={6 + metrics.yield * 0.08} fill="#22c55e" opacity={0.8} />
                  <Line x1={250} y1={118} x2={250} y2={130} stroke="#15803d" strokeWidth="2" />
                  <SvgText x="40" y="50" fill="#f59e0b" fontSize="10">{metrics.temp.toFixed(1)}°C</SvgText>
                  <SvgText x="240" y="50" fill="#3b82f6" fontSize="10">{metrics.humidity.toFixed(0)}%</SvgText>
                </Svg>
                <View style={styles.controlRow}>
                  <TouchableOpacity style={[styles.controlBtn, simRunning && styles.controlBtnActive]} onPress={() => setSimRunning(!simRunning)}>
                    {simRunning ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.resetBtn} onPress={() => { setSimRunning(false); setSimTime(0); }}>
                    <RotateCcw size={18} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>环境参数</Text>
                <View style={styles.paramGrid}>
                  <ParamItem icon={Thermometer} label="温度" value={`${metrics.temp.toFixed(1)}°C`} color="#f59e0b" />
                  <ParamItem icon={Droplets} label="湿度" value={`${metrics.humidity.toFixed(0)}%`} color="#3b82f6" />
                  <ParamItem icon={Sun} label="光照" value={`${metrics.light.toFixed(0)} lux`} color="#eab308" />
                  <ParamItem icon={Zap} label="EC值" value={`${metrics.ec.toFixed(2)}`} color="#8b5cf6" />
                </View>
              </View>
              <View style={styles.card}>
                <View style={styles.yieldHeader}>
                  <Text style={styles.cardTitle}>预测产量指数</Text>
                  <Text style={styles.yieldValue}>{metrics.yield.toFixed(1)}</Text>
                </View>
                <View style={styles.yieldBar}><View style={[styles.yieldProgress, { width: `${metrics.yield}%` }]} /></View>
              </View>
            </View>
          )}

          {activeTab === 'logs' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>执行日志</Text>
              {logs.map((log, i) => (
                <View key={i} style={styles.logItem}>
                  <Text style={styles.logTime}>{log.time}</Text>
                  <View style={[styles.logType, { backgroundColor: log.type === 'alert' ? 'rgba(239,68,68,0.2)' : log.type === 'action' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)' }]}>
                    {log.type === 'alert' ? <AlertTriangle size={10} color="#ef4444" /> : log.type === 'action' ? <Activity size={10} color="#10b981" /> : <TrendingUp size={10} color="#3b82f6" />}
                  </View>
                  <Text style={styles.logMsg}>{log.msg}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MetricBox = ({ label, value, color }: any) => (
  <View style={styles.metricBox}>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const ParamItem = ({ icon: Icon, label, value, color }: any) => (
  <View style={styles.paramItem}>
    <Icon size={16} color={color} />
    <Text style={styles.paramLabel}>{label}</Text>
    <Text style={styles.paramValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#34d399' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  statusText: { fontSize: 11, color: '#10b981' },
  tabBar: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  tabActive: { backgroundColor: 'rgba(52,211,153,0.1)' },
  tabText: { fontSize: 12, color: '#64748b' },
  tabTextActive: { color: '#34d399', fontWeight: 'bold' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#94a3b8', marginBottom: 12 },
  metricsRow: { flexDirection: 'row', gap: 8 },
  metricBox: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 10, alignItems: 'center' },
  metricValue: { fontSize: 18, fontWeight: 'bold' },
  metricLabel: { fontSize: 10, color: '#64748b', marginTop: 4 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#334155' },
  suggestionIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  suggestionContent: { flex: 1 },
  suggestionTitle: { fontSize: 12, fontWeight: 'bold', color: '#e2e8f0' },
  suggestionDesc: { fontSize: 10, color: '#64748b', marginTop: 2 },
  suggestionConf: { fontSize: 14, fontWeight: 'bold', color: '#10b981' },
  twinCard: { backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  twinHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  twinLabel: { color: '#64748b', fontSize: 12 },
  twinTime: { color: '#34d399', fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace' },
  controlRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 12 },
  controlBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: '#f59e0b' },
  resetBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  paramGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  paramItem: { width: '48%', backgroundColor: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  paramLabel: { fontSize: 11, color: '#64748b' },
  paramValue: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0', marginLeft: 'auto' },
  yieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yieldValue: { fontSize: 28, fontWeight: 'bold', color: '#10b981' },
  yieldBar: { height: 8, backgroundColor: '#1e293b', borderRadius: 4, overflow: 'hidden', marginTop: 12 },
  yieldProgress: { height: '100%', backgroundColor: '#10b981', borderRadius: 4 },
  logItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  logTime: { fontSize: 10, color: '#64748b', fontFamily: 'monospace', width: 60 },
  logType: { width: 20, height: 20, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  logMsg: { flex: 1, fontSize: 11, color: '#e2e8f0' },
});

export default SmartExpert;
