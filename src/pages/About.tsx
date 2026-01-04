import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { ChevronLeft, ChevronRight, Sprout, Shield, FileText, Star, Share2, Github } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const About: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const menuItems = [
    { id: 'rate', label: '给我们评分', icon: Star, color: '#f59e0b' },
    { id: 'share', label: '分享给朋友', icon: Share2, color: '#3b82f6' },
    { id: 'privacy', label: '隐私政策', icon: Shield, color: '#8b5cf6' },
    { id: 'terms', label: '用户协议', icon: FileText, color: '#6b7280' },
    { id: 'opensource', label: '开源许可', icon: Github, color: '#111827' },
  ];

  const features = [
    '智能环境监控',
    'AI病害诊断',
    '精准水肥管理',
    '全程数据溯源',
    '碳足迹追踪',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>关于绿智云棚</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Sprout size={48} color="#fff" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>绿智云棚</Text>
          <Text style={[styles.slogan, { color: colors.textMuted }]}>智慧农业 · 绿色未来</Text>
          <View style={[styles.versionBadge, { backgroundColor: isDark ? colors.border : '#ecfdf5' }]}>
            <Text style={styles.versionText}>版本 1.0.0</Text>
          </View>
        </View>

        <View style={[styles.introCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.introTitle, { color: colors.text }]}>产品介绍</Text>
          <Text style={[styles.introText, { color: colors.textMuted }]}>
            绿智云棚是一款专为现代农业设计的智能温室管理系统。通过物联网传感器实时采集环境数据，结合AI算法提供精准的种植决策支持，帮助农户实现科学种植、降本增效。
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={[styles.featuresTitle, { color: colors.text }]}>核心功能</Text>
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <View key={index} style={[styles.featureItem, { backgroundColor: isDark ? colors.border : '#f9fafb' }]}>
                  <View style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <item.icon size={18} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.copyright, { color: colors.textMuted }]}>© 2024 绿智云棚科技有限公司</Text>
          <Text style={[styles.rights, { color: isDark ? '#475569' : '#d1d5db' }]}>保留所有权利</Text>
          
          <View style={styles.contactRow}>
            <Text style={[styles.contactText, { color: colors.textMuted }]}>官网: www.luzhiyunpeng.com</Text>
          </View>
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
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoContainer: { width: 96, height: 96, borderRadius: 24, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#059669', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  appName: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  slogan: { fontSize: 14, marginBottom: 12 },
  versionBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  versionText: { fontSize: 12, color: '#059669', fontWeight: '500' },
  introCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 20 },
  introTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  introText: { fontSize: 14, lineHeight: 22 },
  featuresContainer: { marginTop: 20 },
  featuresTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  featuresList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  featureText: { fontSize: 12, fontWeight: '500' },
  menuCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginBottom: 32 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  footer: { alignItems: 'center' },
  copyright: { fontSize: 12, marginBottom: 4 },
  rights: { fontSize: 10, marginBottom: 16 },
  contactRow: { flexDirection: 'row', gap: 16 },
  contactText: { fontSize: 11 },
});

export default About;
