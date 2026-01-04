import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, AlertTriangle, Droplets, Thermometer, Mic, Phone } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import VoiceAssistant from '../components/VoiceAssistant';

const GreenhouseMinimal: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [showVoice, setShowVoice] = useState(false);

  const greenhouses = [
    { id: '1', name: '1号棚', crop: '番茄', status: 'normal', temp: 24, humidity: 65 },
    { id: '2', name: '2号棚', crop: '黄瓜', status: 'warning', temp: 32, humidity: 45 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>我的大棚</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>共 {greenhouses.length} 个</Text>
        </View>

        <View style={styles.content}>
          {greenhouses.map((gh) => (
            <TouchableOpacity 
              key={gh.id} 
              style={[styles.greenhouseCard, { 
                backgroundColor: gh.status === 'normal' ? '#d1fae5' : '#fef3c7',
                borderColor: gh.status === 'normal' ? '#10b981' : '#f59e0b'
              }]}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.statusIcon, { backgroundColor: gh.status === 'normal' ? '#10b981' : '#f59e0b' }]}>
                  {gh.status === 'normal' ? <Check size={32} color="#fff" strokeWidth={3} /> : <AlertTriangle size={32} color="#fff" />}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.greenhouseName}>{gh.name}</Text>
                  <Text style={styles.cropName}>种的是{gh.crop}</Text>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Thermometer size={24} color="#ef4444" />
                  <Text style={styles.statValue}>{gh.temp}°C</Text>
                </View>
                <View style={styles.statItem}>
                  <Droplets size={24} color="#3b82f6" />
                  <Text style={styles.statValue}>{gh.humidity}%</Text>
                </View>
              </View>
              <Text style={[styles.statusText, { color: gh.status === 'normal' ? '#059669' : '#d97706' }]}>
                {gh.status === 'normal' ? '✓ 一切正常' : '⚠️ 需要关注'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={[styles.voiceButton, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}
            onPress={() => setShowVoice(true)}
          >
            <Mic size={28} color="#059669" />
            <Text style={[styles.voiceText, { color: colors.text }]}>点击语音问答</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <VoiceAssistant visible={showVoice} onClose={() => setShowVoice(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 16, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '900' },
  subtitle: { fontSize: 18, marginTop: 4 },
  content: { flex: 1, gap: 20 },
  greenhouseCard: { borderRadius: 24, padding: 24, borderWidth: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  statusIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  greenhouseName: { fontSize: 28, fontWeight: 'bold', color: '#1f2937' },
  cropName: { fontSize: 18, color: '#6b7280', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  statusText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  bottomActions: { paddingVertical: 20 },
  voiceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 20, borderRadius: 20 },
  voiceText: { fontSize: 20, fontWeight: 'bold' },
});

export default GreenhouseMinimal;
