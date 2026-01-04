import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Check, AlertTriangle, Phone, Bell, BellOff, Mic } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import VoiceAssistant from '../components/VoiceAssistant';

const AlertsMinimal: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [showVoice, setShowVoice] = useState(false);

  const alerts = [
    { id: '1', urgent: true, message: '水泵故障', location: '1号棚', handled: false },
    { id: '2', urgent: true, message: '温度过高', location: '2号棚', handled: false },
    { id: '3', urgent: false, message: '营养液不足', location: '1号棚', handled: true },
  ];

  const urgentAlerts = alerts.filter(a => a.urgent && !a.handled);
  const hasUrgent = urgentAlerts.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>消息提醒</Text>
          {hasUrgent ? (
            <View style={styles.urgentBadge}>
              <Bell size={16} color="#fff" />
              <Text style={styles.urgentText}>{urgentAlerts.length} 条紧急</Text>
            </View>
          ) : (
            <View style={[styles.safeBadge, { backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : '#d1fae5' }]}>
              <BellOff size={16} color="#10b981" />
              <Text style={styles.safeText}>暂无紧急</Text>
            </View>
          )}
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {alerts.map((alert) => (
            <View key={alert.id} style={[styles.alertCard, { 
              backgroundColor: alert.handled ? (isDark ? colors.border : '#f3f4f6') :
                               alert.urgent ? '#fef2f2' : (isDark ? 'rgba(245,158,11,0.1)' : '#fef3c7'),
              borderColor: alert.handled ? colors.border : alert.urgent ? '#ef4444' : '#f59e0b',
              opacity: alert.handled ? 0.6 : 1
            }]}>
              <View style={[styles.iconContainer, { backgroundColor: alert.handled ? '#10b981' : alert.urgent ? '#ef4444' : '#f59e0b' }]}>
                {alert.handled ? <Check size={32} color="#fff" strokeWidth={3} /> : <AlertTriangle size={32} color="#fff" />}
              </View>
              <View style={styles.alertContent}>
                <Text style={[styles.alertMessage, { color: alert.handled ? colors.textMuted : '#1f2937' }]}>{alert.message}</Text>
                <Text style={styles.alertLocation}>{alert.location}</Text>
              </View>
              {!alert.handled && (
                <TouchableOpacity style={[styles.handleButton, { backgroundColor: alert.urgent ? '#ef4444' : '#f59e0b' }]} activeOpacity={0.8}>
                  <Text style={styles.handleText}>处理</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={[styles.voiceButton, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}
            onPress={() => setShowVoice(true)}
          >
            <Mic size={24} color="#059669" />
            <Text style={[styles.voiceText, { color: colors.text }]}>语音咨询</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: '#ef4444' }]}>
            <Phone size={24} color="#fff" />
            <Text style={styles.callText}>呼叫技术支持</Text>
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
  header: { marginTop: 16, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900' },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  urgentText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  safeBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  safeText: { fontSize: 16, fontWeight: 'bold', color: '#10b981' },
  scrollView: { flex: 1 },
  scrollContent: { gap: 16, paddingBottom: 20 },
  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 3, gap: 16 },
  iconContainer: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  alertContent: { flex: 1 },
  alertMessage: { fontSize: 22, fontWeight: 'bold' },
  alertLocation: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  handleButton: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  handleText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  bottomActions: { paddingVertical: 20, gap: 12 },
  voiceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 18, borderRadius: 20 },
  voiceText: { fontSize: 18, fontWeight: 'bold' },
  callButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 18, borderRadius: 20 },
  callText: { fontSize: 18, fontWeight: 'bold', color: '#fff' }
});

export default AlertsMinimal;
