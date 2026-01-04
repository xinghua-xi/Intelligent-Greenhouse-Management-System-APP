import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Layers, Database, Gauge, Settings, ChevronRight, PenTool } from 'lucide-react-native';
import { useAppMode } from '../context/AppModeContext';
import { useTheme } from '../context/ThemeContext';
import { AppRoute, AppMode } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile: React.FC = () => {
  const navigation = useNavigation<any>();
  const { mode, setMode } = useAppMode();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBg}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarInner}>
                  <Image 
                    source={require('../../assets/avatar.jpg')} 
                    style={styles.avatar} 
                  />
                </View>
              </View>
              <View>
                <Text style={styles.userName}>赵亮</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>超级管理员</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentContainer}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modeHeader}>
              <Text style={[styles.modeLabel, { color: colors.textMuted }]}>操作模式</Text>
              <View style={[styles.currentModeBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5' }]}>
                <Text style={styles.currentModeText}>当前: {mode === 'minimal' ? '极简' : mode === 'standard' ? '标准' : '专家'}</Text>
              </View>
            </View>
            <View style={[styles.modeSelector, { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border }]}>
              {(['minimal', 'standard', 'expert'] as AppMode[]).map((m) => (
                <TouchableOpacity 
                  key={m}
                  onPress={() => setMode(m)}
                  style={[styles.modeButton, mode === m && { backgroundColor: colors.card }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modeButtonText, { color: mode === m ? '#059669' : colors.textMuted }]}>
                    {m === 'minimal' ? '极简' : m === 'standard' ? '标准' : '专家'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MenuItem icon={PenTool} label="离线数据采集" onClick={() => navigation.navigate(AppRoute.DATA_ENTRY)} subText="支持离线" colors={colors} isDark={isDark} />
            <MenuItem icon={Layers} label="数据溯源" onClick={() => navigation.navigate(AppRoute.DATA_TRACE)} colors={colors} isDark={isDark} />
            <MenuItem icon={Database} label="肥料使用记录" onClick={() => navigation.navigate(AppRoute.FERTILIZER_RECORD)} colors={colors} isDark={isDark} />
            <MenuItem icon={Gauge} label="碳足迹" onClick={() => navigation.navigate(AppRoute.CARBON_FOOTPRINT)} isLast colors={colors} isDark={isDark} />
          </View>
          
          <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MenuItem icon={Settings} label="系统设置" onClick={() => navigation.navigate(AppRoute.SETTINGS)} isLast colors={colors} isDark={isDark} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const MenuItem = ({ icon: Icon, label, onClick, subText, isLast, colors, isDark }: any) => (
  <TouchableOpacity onPress={onClick} style={[styles.menuItem, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]} activeOpacity={0.7}>
    <View style={[styles.menuIconBg, { backgroundColor: isDark ? colors.border : '#f9fafb' }]}><Icon size={18} color={colors.textMuted} /></View>
    <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
    {subText && <View style={[styles.menuSubTextBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5' }]}><Text style={styles.menuSubText}>{subText}</Text></View>}
    <ChevronRight size={16} color={colors.textMuted} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerBg: { backgroundColor: '#059669', paddingTop: 16, paddingBottom: 80, paddingHorizontal: 24, borderBottomLeftRadius: 48, borderBottomRightRadius: 48 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingTop: 16 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'rgba(16, 185, 129, 0.5)', padding: 4 },
  avatarInner: { width: '100%', height: '100%', borderRadius: 36, backgroundColor: '#e5e7eb', overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  roleBadge: { backgroundColor: 'rgba(4, 120, 87, 0.5)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginTop: 4 },
  roleText: { color: '#d1fae5', fontSize: 12 },
  contentContainer: { paddingHorizontal: 20, marginTop: -48, gap: 20 },
  card: { borderRadius: 24, padding: 20, borderWidth: 1 },
  modeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modeLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  currentModeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  currentModeText: { fontSize: 10, color: '#059669', fontWeight: 'bold' },
  modeSelector: { flexDirection: 'row', borderRadius: 16, padding: 6, borderWidth: 1 },
  modeButton: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  modeButtonText: { fontSize: 12, fontWeight: 'bold' },
  menuCard: { borderRadius: 24, overflow: 'hidden', borderWidth: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  menuIconBg: { padding: 10, borderRadius: 12 },
  menuLabel: { flex: 1, fontWeight: 'bold', fontSize: 14 },
  menuSubTextBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  menuSubText: { fontSize: 10, color: '#059669', fontWeight: 'bold' },
});

export default Profile;
