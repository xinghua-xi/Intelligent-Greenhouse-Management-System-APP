import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AlertOctagon, AlertTriangle, Info, Phone, CheckCircle2, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import AiChatButton from '../components/AiChatButton';

const AlertsPage: React.FC = () => {
  const { colors, isDark } = useTheme();
  
  const alerts = [
    { id: '1', level: 'fatal', message: '1号棚主水泵故障', source: '水泵控制器 #A1', timestamp: '10:23', handled: false },
    { id: '2', level: 'severe', message: '2号棚温度过高 (35°C)', source: '温湿度传感器 #T2', timestamp: '11:05', handled: false },
    { id: '3', level: 'reminder', message: '营养液桶液位低', source: '液位传感器 #L1', timestamp: '09:00', handled: true },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>告警中心</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>只在需要的时候打扰你</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {alerts.map((alert) => {
          const isFatal = alert.level === 'fatal';
          const isSevere = alert.level === 'severe';
          const Icon = isFatal ? AlertOctagon : isSevere ? AlertTriangle : Info;
          const iconBgColor = isFatal ? '#ef4444' : isSevere ? '#f97316' : isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff';
          const iconColor = isFatal || isSevere ? 'white' : '#3b82f6';
          
          return (
            <View key={alert.id} style={[styles.alertCard, { backgroundColor: colors.card, borderColor: colors.border }, alert.handled && styles.alertCardHandled]}>
              <View style={styles.alertRow}>
                <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                  <Icon size={24} color={iconColor} />
                </View>
                <View style={styles.alertContent}>
                  <View style={styles.alertTitleRow}>
                    <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>
                    <View style={[styles.timeBadge, { backgroundColor: isDark ? colors.border : '#f9fafb' }]}>
                      <Text style={[styles.timeText, { color: colors.textMuted }]}>{alert.timestamp}</Text>
                    </View>
                  </View>
                  <Text style={[styles.sourceText, { color: colors.textMuted }]}>来源: {alert.source}</Text>
                  
                  {!alert.handled ? (
                    <View style={styles.actionRow}>
                      <TouchableOpacity 
                        style={[
                          styles.actionButton, 
                          isFatal 
                            ? (isDark ? styles.actionButtonFatalDark : styles.actionButtonFatal) 
                            : { backgroundColor: isDark ? colors.border : '#f3f4f6' }
                        ]}
                        activeOpacity={0.8}
                      >
                        {isFatal ? <Phone size={14} color="#ef4444" /> : <CheckCircle2 size={14} color={colors.textSecondary} />}
                        <Text style={[styles.actionText, isFatal ? styles.actionTextFatal : { color: colors.textSecondary }]}>处理</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.handledRow}>
                      <Check size={12} color="#059669" />
                      <Text style={styles.handledText}>已处理</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <AiChatButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSafeArea: { borderBottomWidth: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  alertCard: { borderRadius: 24, padding: 20, borderWidth: 1, marginBottom: 16 },
  alertCardHandled: { opacity: 0.6 },
  alertRow: { flexDirection: 'row', gap: 20 },
  iconContainer: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  alertContent: { flex: 1 },
  alertTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  alertMessage: { fontWeight: 'bold', fontSize: 14, flex: 1, marginRight: 8 },
  timeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  timeText: { fontSize: 10 },
  sourceText: { fontSize: 12, marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionButtonFatal: { backgroundColor: '#fef2f2' },
  actionButtonFatalDark: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  actionText: { fontSize: 12, fontWeight: 'bold' },
  actionTextFatal: { color: '#dc2626' },
  handledRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  handledText: { fontSize: 10, fontWeight: 'bold', color: '#059669' },
});

export default AlertsPage;
