import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeft, Leaf, Zap, Droplets, Truck, TrendingDown, Award, Info } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const CarbonFootprint: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const carbonScore = 72;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (carbonScore / 100) * circumference;

  const categories = [
    { name: '能源消耗', value: 45, unit: 'kg CO₂', icon: Zap, color: '#f59e0b', percent: 35 },
    { name: '水资源', value: 28, unit: 'kg CO₂', icon: Droplets, color: '#3b82f6', percent: 22 },
    { name: '肥料农药', value: 32, unit: 'kg CO₂', icon: Leaf, color: '#10b981', percent: 25 },
    { name: '物流运输', value: 23, unit: 'kg CO₂', icon: Truck, color: '#8b5cf6', percent: 18 },
  ];

  const achievements = [
    { id: '1', title: '节能先锋', desc: '连续30天能耗低于平均值', icon: '⚡', unlocked: true },
    { id: '2', title: '绿色种植', desc: '有机肥使用率超过50%', icon: '🌱', unlocked: true },
    { id: '3', title: '碳中和达人', desc: '月度碳排放为零', icon: '🏆', unlocked: false },
  ];

  const tips = [
    '使用LED补光灯替代传统灯具，可减少40%能耗',
    '优化灌溉时间至清晨，减少蒸发损失',
    '增加有机肥比例，降低化肥碳排放',
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>碳足迹</Text>
          <TouchableOpacity style={[styles.infoButton, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
            <Info size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.periodSelector, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                style={[styles.periodButton, selectedPeriod === period && { backgroundColor: colors.card }]}
              >
                <Text style={[styles.periodText, { color: colors.textMuted }, selectedPeriod === period && styles.periodTextActive]}>
                  {period === 'week' ? '本周' : period === 'month' ? '本月' : '本年'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.ringContainer}>
            <Svg width={160} height={160} viewBox="0 0 160 160">
              <Defs>
                <LinearGradient id="carbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#10b981" />
                  <Stop offset="100%" stopColor="#059669" />
                </LinearGradient>
              </Defs>
              <Circle cx="80" cy="80" r={radius} stroke={isDark ? colors.border : '#f3f4f6'} strokeWidth="12" fill="transparent" />
              <Circle
                cx="80" cy="80" r={radius}
                stroke="url(#carbonGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation={-90}
                origin="80, 80"
              />
            </Svg>
            <View style={styles.scoreCenter}>
              <Text style={[styles.scoreValue, { color: colors.text }]}>{carbonScore}</Text>
              <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>环保指数</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <TrendingDown size={16} color="#10b981" />
              <Text style={[styles.summaryValue, { color: colors.text }]}>128 kg</Text>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>总排放量</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Leaf size={16} color="#10b981" />
              <Text style={[styles.summaryValue, { color: colors.text }]}>-18%</Text>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>同比下降</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>排放构成</Text>
        <View style={[styles.categoriesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {categories.map((cat, index) => (
            <View key={cat.name} style={[styles.categoryItem, index < categories.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={[styles.categoryIcon, { backgroundColor: isDark ? `${cat.color}30` : `${cat.color}20` }]}>
                <cat.icon size={18} color={cat.color} />
              </View>
              <View style={styles.categoryContent}>
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryName, { color: colors.text }]}>{cat.name}</Text>
                  <Text style={[styles.categoryValue, { color: colors.textMuted }]}>{cat.value} {cat.unit}</Text>
                </View>
                <View style={[styles.categoryBarBg, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                  <View style={[styles.categoryBar, { width: `${cat.percent}%`, backgroundColor: cat.color }]} />
                </View>
              </View>
              <Text style={[styles.categoryPercent, { color: colors.text }]}>{cat.percent}%</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>环保成就</Text>
        <View style={styles.achievementsRow}>
          {achievements.map((ach) => (
            <View key={ach.id} style={[styles.achievementCard, { backgroundColor: colors.card, borderColor: colors.border }, !ach.unlocked && styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>{ach.icon}</Text>
              <Text style={[styles.achievementTitle, { color: colors.text }, !ach.unlocked && { color: colors.textMuted }]}>{ach.title}</Text>
              <Text style={[styles.achievementDesc, { color: colors.textMuted }]}>{ach.desc}</Text>
              {!ach.unlocked && (
                <View style={[styles.lockOverlay, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                  <Text style={[styles.lockText, { color: colors.textMuted }]}>未解锁</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>减排建议</Text>
        <View style={[styles.tipsCard, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5', borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#d1fae5' }]}>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.tipText, { color: isDark ? '#6ee7b7' : '#065f46' }]}>{tip}</Text>
            </View>
          ))}
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
  infoButton: { padding: 8, borderRadius: 8 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  scoreCard: { borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, marginBottom: 24 },
  periodSelector: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 24 },
  periodButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  periodText: { fontSize: 12, fontWeight: '500' },
  periodTextActive: { color: '#059669', fontWeight: 'bold' },
  ringContainer: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  scoreCenter: { position: 'absolute', alignItems: 'center' },
  scoreValue: { fontSize: 40, fontWeight: 'bold' },
  scoreLabel: { fontSize: 12, marginTop: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryDivider: { width: 1, height: 40 },
  summaryValue: { fontSize: 18, fontWeight: 'bold' },
  summaryLabel: { fontSize: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  categoriesCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 24 },
  categoryItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  categoryIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  categoryContent: { flex: 1 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  categoryName: { fontSize: 14, fontWeight: '500' },
  categoryValue: { fontSize: 12 },
  categoryBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  categoryBar: { height: '100%', borderRadius: 3 },
  categoryPercent: { fontSize: 14, fontWeight: 'bold', width: 40, textAlign: 'right' },
  achievementsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  achievementCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, position: 'relative', overflow: 'hidden' },
  achievementLocked: { opacity: 0.6 },
  achievementIcon: { fontSize: 32, marginBottom: 8 },
  achievementTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  achievementDesc: { fontSize: 10, textAlign: 'center' },
  lockOverlay: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  lockText: { fontSize: 8 },
  tipsCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  tipNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' },
  tipNumberText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  tipText: { flex: 1, fontSize: 13, lineHeight: 20 },
});

export default CarbonFootprint;
