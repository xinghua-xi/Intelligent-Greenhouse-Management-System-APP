import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Thermometer, Droplets, Sun, CloudRain, Cpu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const OverviewExpert: React.FC = () => {
  const { colors, isDark } = useTheme();
  
  // 专家模式始终使用深色主题
  const expertColors = {
    background: '#0f172a',
    card: 'rgba(30, 41, 59, 0.5)',
    border: '#334155',
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  };

  return (
    <View style={[styles.container, { backgroundColor: expertColors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <View>
                    <View style={styles.titleRow}>
                        <Cpu size={20} color="#34d399" /> 
                        <Text style={styles.title}>系统监控</Text>
                    </View>
                    <Text style={styles.nodeId}>节点编号: 大棚-01-主控</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>状态: 在线</Text>
                    </View>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>环境趋势 (24小时)</Text>
                <View style={styles.chartArea}>
                    <Svg width="100%" height={160} viewBox="0 0 300 160">
                        <Line x1="30" y1="20" x2="30" y2="130" stroke="#334155" strokeWidth="1" />
                        <Line x1="30" y1="130" x2="290" y2="130" stroke="#334155" strokeWidth="1" />
                        <Line x1="30" y1="50" x2="290" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                        <Line x1="30" y1="90" x2="290" y2="90" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                        
                        <SvgText x="25" y="25" fill="#64748b" fontSize="8" textAnchor="end">30°</SvgText>
                        <SvgText x="25" y="55" fill="#64748b" fontSize="8" textAnchor="end">25°</SvgText>
                        <SvgText x="25" y="95" fill="#64748b" fontSize="8" textAnchor="end">20°</SvgText>
                        <SvgText x="25" y="135" fill="#64748b" fontSize="8" textAnchor="end">15°</SvgText>
                        
                        <SvgText x="50" y="145" fill="#64748b" fontSize="8" textAnchor="middle">00:00</SvgText>
                        <SvgText x="115" y="145" fill="#64748b" fontSize="8" textAnchor="middle">06:00</SvgText>
                        <SvgText x="180" y="145" fill="#64748b" fontSize="8" textAnchor="middle">12:00</SvgText>
                        <SvgText x="245" y="145" fill="#64748b" fontSize="8" textAnchor="middle">18:00</SvgText>
                        
                        <Path d="M 50 100 Q 80 95, 100 90 T 140 70 T 180 50 T 220 60 T 260 80" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <Path d="M 50 70 Q 80 75, 100 80 T 140 85 T 180 75 T 220 70 T 260 65" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />
                        
                        <Circle cx="260" cy="80" r="4" fill="#34d399" />
                        <Circle cx="260" cy="65" r="4" fill="#60a5fa" />
                    </Svg>
                    
                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#34d399' }]} />
                            <Text style={styles.legendText}>温度</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#60a5fa' }]} />
                            <Text style={styles.legendText}>湿度</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.sensorsGrid}>
                <View style={styles.sensorHalf}>
                    <SensorCard label="空气温度" value="24.5" unit="°C" icon={Thermometer} color="#34d399" />
                </View>
                <View style={styles.sensorHalf}>
                    <SensorCard label="空气湿度" value="65.2" unit="%" icon={Droplets} color="#60a5fa" />
                </View>
                <View style={styles.sensorHalf}>
                    <SensorCard label="土壤含水量" value="42.1" unit="%" icon={CloudRain} color="#f59e0b" />
                </View>
                <View style={styles.sensorHalf}>
                    <SensorCard label="光照强度" value="850" unit="W/m²" icon={Sun} color="#eab308" />
                </View>
            </View>

            <View style={styles.logsContainer}>
                <View style={styles.logsHeader}>
                     <Text style={styles.logsTitle}>事件日志</Text>
                </View>
                <View>
                    <LogItem time="10:23:45" level="警告" module="水泵控制" msg="流量偏差检测" />
                    <View style={styles.logSeparator} />
                    <LogItem time="09:15:22" level="信息" module="AI核心" msg="灌溉已优化" />
                </View>
            </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const SensorCard = ({label, value, unit, icon: Icon, color}: any) => (
    <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
            <Text style={styles.sensorLabel}>{label}</Text>
            <Icon size={14} color={color} />
        </View>
        <View style={styles.sensorValueRow}>
            <Text style={styles.sensorValue}>{value}</Text>
            <Text style={styles.sensorUnit}>{unit}</Text>
        </View>
    </View>
);

const LogItem = ({time, level, module, msg}: any) => (
    <View style={styles.logItem}>
        <Text style={styles.logTime}>{time}</Text>
        <Text style={[styles.logLevel, level === '警告' ? styles.logWarn : styles.logInfo]}>{level}</Text>
        <Text style={styles.logModule}>{module}</Text>
        <Text style={styles.logMessage}>{msg}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#34d399' },
  nodeId: { fontSize: 10, color: '#64748b', marginTop: 4 },
  statusContainer: { alignItems: 'flex-end' },
  statusBadge: { backgroundColor: 'rgba(52, 211, 153, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(52, 211, 153, 0.2)' },
  statusText: { fontSize: 12, color: '#34d399' },
  chartContainer: { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: 12, borderWidth: 1, borderColor: '#334155', padding: 16, marginBottom: 16 },
  chartTitle: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 12 },
  chartArea: { width: '100%' },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: '#94a3b8' },
  sensorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  sensorHalf: { width: '48%' },
  sensorCard: { backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  sensorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  sensorLabel: { fontSize: 10, color: '#64748b' },
  sensorValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  sensorValue: { fontSize: 20, fontWeight: 'bold', color: '#e2e8f0' },
  sensorUnit: { fontSize: 10, color: '#64748b' },
  logsContainer: { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: 12, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  logsHeader: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  logsTitle: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8' },
  logItem: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  logSeparator: { borderTopWidth: 1, borderTopColor: 'rgba(51, 65, 85, 0.5)' },
  logTime: { fontSize: 10, color: '#64748b' },
  logLevel: { fontSize: 10, fontWeight: 'bold' },
  logWarn: { color: '#f59e0b' },
  logInfo: { color: '#60a5fa' },
  logModule: { fontSize: 10, color: '#94a3b8' },
  logMessage: { fontSize: 10, color: '#cbd5e1', flex: 1 },
});

export default OverviewExpert;
