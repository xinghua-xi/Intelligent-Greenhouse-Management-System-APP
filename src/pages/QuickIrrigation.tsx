import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { ChevronLeft, Droplets, Clock, Zap, Play, Pause, RotateCcw, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Svg, { Circle } from 'react-native-svg';

const QuickIrrigation: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [duration, setDuration] = useState(30);
  const [ecValue, setEcValue] = useState(1.8);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedZone, setSelectedZone] = useState<string[]>(['A1', 'A2', 'A3']);

  const zones = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
  const durations = [15, 30, 45, 60];
  const ecValues = [1.2, 1.5, 1.8, 2.0, 2.2];

  const toggleZone = (zone: string) => {
    if (isRunning) return;
    setSelectedZone(prev => 
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  const handleStart = () => {
    if (selectedZone.length === 0) {
      Alert.alert('提示', '请至少选择一个灌溉区域');
      return;
    }
    setIsRunning(true);
    setProgress(0);
  };

  const handleStop = () => {
    Alert.alert('确认', '确定要停止灌溉吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => { setIsRunning(false); setProgress(0); } }
    ]);
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>一键灌溉</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.statusCard, { backgroundColor: isDark ? '#1e293b' : '#0f172a' }]}>
          <View style={styles.progressRing}>
            <Svg width={160} height={160} viewBox="0 0 160 160">
              <Circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
              <Circle cx="80" cy="80" r={radius} stroke="#10b981" strokeWidth="10" fill="transparent" 
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" rotation={-90} origin="80, 80" />
            </Svg>
            <View style={styles.progressContent}>
              {isRunning ? (
                <>
                  <Text style={styles.progressValue}>{progress}%</Text>
                  <Text style={styles.progressLabel}>灌溉中</Text>
                </>
              ) : (
                <>
                  <Droplets size={32} color="#10b981" />
                  <Text style={styles.progressLabel}>待启动</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={16} color="#94a3b8" />
              <Text style={styles.statValue}>{duration}分钟</Text>
              <Text style={styles.statLabel}>预计时长</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Zap size={16} color="#f59e0b" />
              <Text style={styles.statValue}>{ecValue}</Text>
              <Text style={styles.statLabel}>EC值</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TrendingUp size={16} color="#3b82f6" />
              <Text style={styles.statValue}>{selectedZone.length}</Text>
              <Text style={styles.statLabel}>区域数</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>选择灌溉区域</Text>
          <View style={styles.zoneGrid}>
            {zones.map(zone => (
              <TouchableOpacity key={zone}
                style={[styles.zoneItem, { backgroundColor: colors.card, borderColor: selectedZone.includes(zone) ? '#10b981' : colors.border },
                  selectedZone.includes(zone) && { backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)' }]}
                onPress={() => toggleZone(zone)} disabled={isRunning}>
                <Text style={[styles.zoneText, { color: selectedZone.includes(zone) ? '#10b981' : colors.text }]}>{zone}</Text>
                {selectedZone.includes(zone) && <CheckCircle size={14} color="#10b981" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>灌溉时长</Text>
          <View style={styles.optionRow}>
            {durations.map(d => (
              <TouchableOpacity key={d}
                style={[styles.optionItem, { backgroundColor: colors.card, borderColor: duration === d ? '#10b981' : colors.border },
                  duration === d && { backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)' }]}
                onPress={() => !isRunning && setDuration(d)} disabled={isRunning}>
                <Text style={[styles.optionValue, { color: duration === d ? '#10b981' : colors.text }]}>{d}</Text>
                <Text style={[styles.optionUnit, { color: colors.textMuted }]}>分钟</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>EC 值设置</Text>
          <View style={styles.optionRow}>
            {ecValues.map(ec => (
              <TouchableOpacity key={ec}
                style={[styles.ecItem, { backgroundColor: colors.card, borderColor: ecValue === ec ? '#3b82f6' : colors.border },
                  ecValue === ec && { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#eff6ff' }]}
                onPress={() => !isRunning && setEcValue(ec)} disabled={isRunning}>
                <Text style={[styles.ecValue, { color: ecValue === ec ? '#3b82f6' : colors.text }]}>{ec}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.ecTip, { backgroundColor: isDark ? 'rgba(245,158,11,0.2)' : '#fef3c7' }]}>
            <AlertTriangle size={14} color="#f59e0b" />
            <Text style={[styles.ecTipText, { color: isDark ? '#fcd34d' : '#92400e' }]}>当前土壤EC值1.2，建议灌溉EC值1.8-2.0</Text>
          </View>
        </View>

        <View style={styles.controlRow}>
          {isRunning ? (
            <>
              <TouchableOpacity style={[styles.stopButton, { borderColor: '#ef4444' }]} onPress={handleStop}>
                <Pause size={20} color="#ef4444" />
                <Text style={styles.stopButtonText}>暂停</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.resetButton, { backgroundColor: isDark ? colors.border : 'rgba(148,163,184,0.2)' }]} 
                onPress={() => { setIsRunning(false); setProgress(0); }}>
                <RotateCcw size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Play size={20} color="#fff" />
              <Text style={styles.startButtonText}>开始灌溉</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSafeArea: { borderBottomWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  placeholder: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  statusCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24 },
  progressRing: { position: 'relative', width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  progressContent: { position: 'absolute', alignItems: 'center' },
  progressValue: { fontSize: 36, fontWeight: 'bold', color: '#10b981' },
  progressLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 10, color: '#94a3b8' },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, marginLeft: 4 },
  zoneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  zoneItem: { width: '31%', paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  zoneText: { fontSize: 14, fontWeight: '600' },
  optionRow: { flexDirection: 'row', gap: 10 },
  optionItem: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  optionValue: { fontSize: 18, fontWeight: 'bold' },
  optionUnit: { fontSize: 10, marginTop: 2 },
  ecItem: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  ecValue: { fontSize: 16, fontWeight: 'bold' },
  ecTip: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, marginTop: 12 },
  ecTipText: { fontSize: 12, flex: 1 },
  controlRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  startButton: { flex: 1, backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  stopButton: { flex: 1, backgroundColor: 'transparent', paddingVertical: 16, borderRadius: 16, borderWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  stopButtonText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  resetButton: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});

export default QuickIrrigation;
