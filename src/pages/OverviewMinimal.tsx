import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, AlertOctagon, Phone, Mic } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import VoiceAssistant from '../components/VoiceAssistant';

const OverviewMinimal: React.FC = () => {
  const { colors, isDark } = useTheme();
  const isHealthy = true;
  const [showVoice, setShowVoice] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>绿智云棚</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>今天是 5月24日</Text>
        </View>

        <View style={styles.centerContent}>
          <View style={[styles.statusCircle, isHealthy ? styles.healthyCircle : styles.unhealthyCircle]}>
              <View style={styles.innerCircle}>
                  {isHealthy ? (
                      <Check size={120} color="white" strokeWidth={3} />
                  ) : (
                      <AlertOctagon size={120} color="white" />
                  )}
              </View>
          </View>
          
          <View style={styles.statusText}>
              <Text style={[styles.statusTitle, isHealthy ? styles.healthyText : styles.unhealthyText]}>
                  {isHealthy ? '一切正常' : '需要关注'}
              </Text>
              <Text style={[styles.statusDescription, { color: colors.textMuted }]}>
                  {isHealthy ? '大棚里很舒服，不用管' : '1号棚有点缺水了'}
              </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!isHealthy && (
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
                  <Text style={styles.primaryButtonText}>一键浇水</Text>
              </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.voiceButton, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]} 
            activeOpacity={0.8}
            onPress={() => setShowVoice(true)}
          >
              <View style={[styles.micContainer, { backgroundColor: colors.card }]}>
                   <Mic size={32} color="#059669" />
              </View>
              <Text style={[styles.voiceButtonText, { color: colors.text }]}>点击 语音问答</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.8}>
              <Phone size={20} color={colors.textMuted} />
              <Text style={[styles.callButtonText, { color: colors.textMuted }]}>呼叫农技员</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 语音问答弹窗 */}
      <VoiceAssistant visible={showVoice} onClose={() => setShowVoice(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 24 },
  header: { marginBottom: 32, marginTop: 16 },
  title: { fontSize: 30, fontWeight: '900' },
  subtitle: { fontSize: 18, marginTop: 8 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -40 },
  statusCircle: { width: 256, height: 256, borderRadius: 128, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 16 },
  healthyCircle: { backgroundColor: '#10b981' },
  unhealthyCircle: { backgroundColor: '#ef4444' },
  innerCircle: { width: 224, height: 224, borderRadius: 112, borderWidth: 4, borderColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center' },
  statusText: { marginTop: 32, alignItems: 'center' },
  statusTitle: { fontSize: 36, fontWeight: 'bold', marginBottom: 12 },
  healthyText: { color: '#059669' },
  unhealthyText: { color: '#dc2626' },
  statusDescription: { fontSize: 20, fontWeight: '500', textAlign: 'center' },
  buttonContainer: { gap: 16, marginBottom: 16 },
  primaryButton: { width: '100%', backgroundColor: '#2563eb', paddingVertical: 24, borderRadius: 24, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  primaryButtonText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  voiceButton: { width: '100%', paddingVertical: 24, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 16 },
  micContainer: { padding: 12, borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  voiceButtonText: { fontSize: 20, fontWeight: 'bold' },
  callButton: { width: '100%', borderWidth: 2, paddingVertical: 16, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  callButtonText: { fontWeight: 'bold' },
});

export default OverviewMinimal;
