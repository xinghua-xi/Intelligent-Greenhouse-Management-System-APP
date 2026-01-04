import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Cpu, Thermometer, Droplets, Sun, Zap, Layers } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';

const GreenhouseExpert: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('A2');

  const zones = [
    { id: 'A1', temp: 23.5, humidity: 62, soil: 45, ec: 1.2, status: 'normal' },
    { id: 'A2', temp: 24.8, humidity: 58, soil: 38, ec: 1.5, status: 'warning' },
    { id: 'A3', temp: 24.2, humidity: 65, soil: 52, ec: 1.3, status: 'normal' },
    { id: 'B1', temp: 25.1, humidity: 55, soil: 41, ec: 1.4, status: 'normal' },
    { id: 'B2', temp: 26.3, humidity: 48, soil: 35, ec: 1.8, status: 'critical' },
    { id: 'B3', temp: 24.0, humidity: 68, soil: 55, ec: 1.1, status: 'normal' },
  ];

  const selectedData = zones.find(z => z.id === selectedZone) || zones[0];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Cpu size={18} color="#34d399" />
              <Text style={styles.title}>大棚监控中心</Text>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>6/6 在线</Text>
            </View>
          </View>

          <View style={styles.heatmapCard}>
            <Text style={styles.cardTitle}>分区热力图</Text>
            <View style={styles.heatmapGrid}>
              {zones.map((zone) => (
                <TouchableOpacity key={zone.id}
                  style={[styles.zoneCell, selectedZone === zone.id && styles.zoneCellSelected,
                    { backgroundColor: zone.status === 'critical' ? 'rgba(239,68,68,0.3)' : zone.status === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.2)' }]}
                  onPress={() => setSelectedZone(zone.id)}>
                  <Text style={styles.zoneId}>{zone.id}</Text>
                  <Text style={styles.zoneTemp}>{zone.temp}°C</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{selectedZone} 区域详情</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Thermometer size={14} color="#ef4444" />
                <Text style={styles.metricValue}>{selectedData.temp}°C</Text>
                <Text style={styles.metricLabel}>温度</Text>
              </View>
              <View style={styles.metricCard}>
                <Droplets size={14} color="#3b82f6" />
                <Text style={styles.metricValue}>{selectedData.humidity}%</Text>
                <Text style={styles.metricLabel}>湿度</Text>
              </View>
              <View style={styles.metricCard}>
                <Layers size={14} color="#f59e0b" />
                <Text style={styles.metricValue}>{selectedData.soil}%</Text>
                <Text style={styles.metricLabel}>土壤</Text>
              </View>
              <View style={styles.metricCard}>
                <Zap size={14} color="#8b5cf6" />
                <Text style={styles.metricValue}>{selectedData.ec}</Text>
                <Text style={styles.metricLabel}>EC值</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>24小时趋势</Text>
            <Svg width="100%" height={100} viewBox="0 0 300 100">
              <Line x1="20" y1="80" x2="280" y2="80" stroke="#334155" strokeWidth="1" />
              <Path d="M 30 60 Q 80 55, 120 45 T 180 35 T 240 50 T 270 40" stroke="#ef4444" strokeWidth="2" fill="none" />
              <Path d="M 30 40 Q 80 45, 120 50 T 180 55 T 240 45 T 270 50" stroke="#3b82f6" strokeWidth="2" fill="none" />
            </Svg>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#34d399' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  onlineText: { fontSize: 11, color: '#10b981' },
  heatmapCard: { backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  cardTitle: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 12 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  zoneCell: { width: '31%', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  zoneCellSelected: { borderColor: '#34d399' },
  zoneId: { fontSize: 12, fontWeight: 'bold', color: '#e2e8f0' },
  zoneTemp: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  detailCard: { backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 16 },
  detailTitle: { fontSize: 14, fontWeight: 'bold', color: '#e2e8f0', marginBottom: 12 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricCard: { width: '48%', backgroundColor: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 8, alignItems: 'center' },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: '#e2e8f0', marginTop: 4 },
  metricLabel: { fontSize: 10, color: '#64748b', marginTop: 2 },
  chartCard: { backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155' },
});

export default GreenhouseExpert;
