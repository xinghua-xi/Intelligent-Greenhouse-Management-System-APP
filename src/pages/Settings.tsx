import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import { ChevronLeft, ChevronRight, Bell, Moon, Globe, Shield, Database, Wifi, HelpCircle, Info, Trash2, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppRoute } from '../types';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/api';

interface SettingItem {
  id: string;
  label: string;
  desc?: string;
  icon: any;
  type: 'switch' | 'link';
  value?: boolean;
  onChange?: (value: boolean) => void;
  danger?: boolean;
  route?: string;
}

interface SettingGroup {
  title: string;
  items: SettingItem[];
}

const Settings: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, setTheme, colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleDarkModeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账号吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await authApi.logout();
            } catch (error) {
              console.log('退出登录失败:', error);
            }
            navigation.reset({
              index: 0,
              routes: [{ name: AppRoute.LOGIN }],
            });
          }
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除所有缓存数据吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => Alert.alert('提示', '缓存已清除') }
      ]
    );
  };

  const settingGroups: SettingGroup[] = [
    {
      title: '通知设置',
      items: [
        { id: 'notifications', label: '推送通知', desc: '接收告警和提醒', icon: Bell, type: 'switch', value: notifications, onChange: setNotifications },
      ]
    },
    {
      title: '显示设置',
      items: [
        { id: 'darkMode', label: '深色模式', desc: '减少眼睛疲劳', icon: Moon, type: 'switch', value: isDark, onChange: handleDarkModeChange },
        { id: 'language', label: '语言', desc: '简体中文', icon: Globe, type: 'link' },
      ]
    },
    {
      title: '数据与存储',
      items: [
        { id: 'autoSync', label: '自动同步', desc: '在WiFi下自动同步数据', icon: Wifi, type: 'switch', value: autoSync, onChange: setAutoSync },
        { id: 'offlineMode', label: '离线模式', desc: '优先使用本地缓存', icon: Database, type: 'switch', value: offlineMode, onChange: setOfflineMode },
        { id: 'clearCache', label: '清除缓存', desc: '当前缓存: 128MB', icon: Trash2, type: 'link', danger: true },
      ]
    },
    {
      title: '安全与隐私',
      items: [
        { id: 'security', label: '账号安全', desc: '密码、指纹、面容', icon: Shield, type: 'link' },
      ]
    },
    {
      title: '关于',
      items: [
        { id: 'help', label: '帮助与反馈', icon: HelpCircle, type: 'link', route: AppRoute.HELP },
        { id: 'about', label: '关于绿智云棚', desc: '版本 1.0.0', icon: Info, type: 'link', route: AppRoute.ABOUT },
      ]
    },
  ];

  const handleItemPress = (item: SettingItem) => {
    if (item.id === 'clearCache') {
      handleClearCache();
    } else if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>系统设置</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {settingGroups.map((group) => (
          <View key={group.title} style={styles.settingGroup}>
            <Text style={[styles.groupTitle, { color: colors.textMuted }]}>{group.title}</Text>
            <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {group.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.settingItem, index < group.items.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                  activeOpacity={item.type === 'switch' ? 1 : 0.7}
                  onPress={() => item.type === 'link' && handleItemPress(item)}
                >
                  <View style={[styles.settingIcon, item.danger ? (isDark ? styles.settingIconDangerDark : styles.settingIconDanger) : { backgroundColor: isDark ? colors.border : '#f9fafb' }]}>
                    <item.icon size={18} color={item.danger ? '#ef4444' : colors.textMuted} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingLabel, item.danger && styles.settingLabelDanger, { color: item.danger ? '#ef4444' : colors.text }]}>{item.label}</Text>
                    {item.desc && <Text style={[styles.settingDesc, { color: colors.textMuted }]}>{item.desc}</Text>}
                  </View>
                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onChange}
                      trackColor={{ false: isDark ? '#475569' : '#e5e7eb', true: '#a7f3d0' }}
                      thumbColor={item.value ? '#059669' : isDark ? '#94a3b8' : '#f4f4f5'}
                    />
                  ) : (
                    <ChevronRight size={18} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={[styles.logoutButton, { 
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fff', 
            borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' 
          }]} 
          activeOpacity={0.8} 
          onPress={handleLogout}
        >
          <LogOut size={18} color="#ef4444" />
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.textMuted }]}>绿智云棚 © 2024</Text>
        <Text style={[styles.footerSubText, { color: isDark ? '#475569' : '#d1d5db' }]}>智慧农业 · 绿色未来</Text>
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
  settingGroup: { marginBottom: 24 },
  groupTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  groupCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingIconDanger: { backgroundColor: '#fef2f2' },
  settingIconDangerDark: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '500' },
  settingLabelDanger: { color: '#ef4444' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  logoutButton: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, marginBottom: 32 },
  logoutText: { fontSize: 14, fontWeight: 'bold', color: '#ef4444' },
  footerText: { textAlign: 'center', fontSize: 12, marginBottom: 4 },
  footerSubText: { textAlign: 'center', fontSize: 10 },
});

export default Settings;
