import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AlertOctagon, AlertTriangle, Info, Clock, CheckCircle, Activity, Cpu, TrendingUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AlertsExpert: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'fatal' | 'warning' | 'info'>('all');

  const alerts = [
    { id: '1', level: 'fatal', code: 'ERR_PUMP_001', message: '主水泵通信中断', source: 'PLC-A1', timestamp: '14:32:15', value: 'timeout', threshold: '5s', handled: false },
    { id: '2', level: 'fatal', code: 'ERR_TEMP_002', message: '温度传感器异常', source: 'SENSOR-T2', timestamp: '14:30:42', value: '35.2°C', threshold: '32°C', handled: false },
    { id: '3', level: 'warning', code: 'WRN_EC_001', message: 'EC值接近上限', source: 'SENSOR-EC1', timestamp: '14:25:00', value: '2.3 mS/cm', threshold: '2.5 mS/cm', handled: false },
    { id: '4', level: 'warning', code: 'WRN_HUM_001', message: '湿度偏低', source: 'SENSOR-H1', timestamp: '14:20:33', value: '48%', threshold: '50%', handled: true },
    { id: '5', level: 'info', code: 'INF_MAINT_001', message: '设备维护提醒', source: 'SYSTEM', timestamp: '14:00:00', value: '运行720h', threshold: '720h', handled: false },
  ];

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.level === filter);
  const stats = {
    fatal: alerts.filter(a => a.level === 'fatal' && !a.handled).length,
    warning: alerts.filter(a => a.level === 'warning' && !a.handled).length,
    info: alerts.filter(a => a.level === 'info' && !a.handled).length,
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Cpu size={18} color="#34d399" />
            <Text style={styles.title}>告警监控中心</Text>
          </View>
          <View style={styles.statusBadge}>
            <Activity size={12} color="#10b981" />
            <Text style={styles.statusText}>实时监控</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statCard, filter === 'fatal' && styles.statCardActive, { borderColor: '#ef4444' }]} onPress={() => setFilter(filter === 'fatal' ? 'all' : 'fatal')}>
            <AlertOctagon size={16} color="#ef4444" />
            <Text style={styles.statValue}>{stats.fatal}</Text>
            <Text style={styles.statLabel}>严重</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, filter === 'warning' && styles.statCardActive, { borderColor: '#f59e0b' }]} onPress={() => setFilter(filter === 'warning' ? 'all' : 'warning')}>
            <AlertTriangle size={16} color="#f59e0b" />
            <Text style={styles.statValue}>{stats.warning}</Text>
            <Text style={styles.statLabel}>警告</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, filter === 'info' && styles.statCardActive, { borderColor: '#3b82f6' }]} onPress={() => setFilter(filter === 'info' ? 'all' : 'info')}>
            <Info size={16} color="#3b82f6" />
            <Text style={styles.statValue}>{stats.info}</Text>
            <Text style={styles.statLabel}>提示</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {filteredAlerts.map((alert) => {
            const isFatal = alert.level === 'fatal';
            const isWarning = alert.level === 'warning';
            const Icon = isFatal ? AlertOctagon : isWarning ? AlertTriangle : Info;
            const color = isFatal ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6';
            
            return (
              <View key={alert.id} style={[styles.alertCard, alert.handled && styles.alertCardHandled]}>
                <View style={styles.alertHeader}>
                  <View style={[styles.levelBadge, { backgroundColor: `${color}20` }]}>
                    <Icon size={12} color={color} />
                    <Text style={[styles.levelText, { color }]}>{alert.code}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Clock size={10} color="#64748b" />
                    <Text style={styles.timeText}>{alert.timestamp}</Text>
                  </View>
                </View>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertSource}>来源: {alert.source}</Text>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>当前值</Text>
                    <Text style={[styles.metricValue, { color }]}>{alert.value}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>阈值</Text>
                    <Text style={styles.metricValue}>{alert.threshold}</Text>
                  </View>
                </View>
                {!alert.handled ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${color}20` }]}>
                      <CheckCircle size={14} color={color} />
                      <Text style={[styles.actionText, { color }]}>确认</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtnSecondary}>
                      <TrendingUp size={14} color="#64748b" />
                      <Text style={styles.actionTextSecondary}>分析</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.handledBadge}>
                    <CheckCircle size={12} color="#10b981" />
                    <Text style={styles.handledText}>已处理</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#34d399' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, color: '#10b981' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  statCardActive: { borderWidth: 2 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#e2e8f0', marginTop: 4 },
  statLabel: { fontSize: 10, color: '#64748b', marginTop: 2 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  alertCard: { backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#334155', marginBottom: 12 },
  alertCardHandled: { opacity: 0.5 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  levelText: { fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' },
  timeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 10, color: '#64748b', fontFamily: 'monospace' },
  alertMessage: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0', marginBottom: 4 },
  alertSource: { fontSize: 11, color: '#64748b', marginBottom: 10 },
  metricsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metricItem: { flex: 1 },
  metricLabel: { fontSize: 10, color: '#64748b' },
  metricValue: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8 },
  actionText: { fontSize: 12, fontWeight: 'bold' },
  actionBtnSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(100,116,139,0.2)' },
  actionTextSecondary: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  handledBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  handledText: { fontSize: 11, color: '#10b981', fontWeight: 'bold' },
});

export default AlertsExpert;
