import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeft, Plus, Droplets, Leaf, Calendar, TrendingUp, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const FertilizerRecord: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'records' | 'stats'>('records');

  const records = [
    { id: '1', date: '2024-12-20', type: '复合肥', name: '史丹利15-15-15', amount: '25kg', area: '1号棚', operator: '赵亮', method: '滴灌施肥' },
    { id: '2', date: '2024-12-18', type: '叶面肥', name: '磷酸二氢钾', amount: '2kg', area: '1号棚', operator: '李明', method: '喷施' },
    { id: '3', date: '2024-12-15', type: '有机肥', name: '发酵羊粪', amount: '100kg', area: '2号棚', operator: '赵亮', method: '穴施' },
    { id: '4', date: '2024-12-12', type: '微量元素', name: '螯合铁', amount: '500g', area: '1号棚', operator: '王芳', method: '滴灌施肥' },
  ];

  const stats = {
    totalUsage: '352kg',
    monthlyAvg: '88kg',
    costSaved: '¥1,280',
    efficiency: '+15%',
  };

  const fertilizerTypes = [
    { name: '复合肥', usage: 45, color: '#10b981' },
    { name: '有机肥', usage: 30, color: '#f59e0b' },
    { name: '叶面肥', usage: 15, color: '#3b82f6' },
    { name: '微量元素', usage: 10, color: '#8b5cf6' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>肥料使用记录</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5' }]}>
            <Plus size={20} color="#10b981" />
          </TouchableOpacity>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('records')}
            style={[styles.tab, activeTab === 'records' && { backgroundColor: colors.card }]}
          >
            <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === 'records' && styles.tabTextActive]}>使用记录</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('stats')}
            style={[styles.tab, activeTab === 'stats' && { backgroundColor: colors.card }]}
          >
            <Text style={[styles.tabText, { color: colors.textMuted }, activeTab === 'stats' && styles.tabTextActive]}>统计分析</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'records' ? (
          <View>
            {records.map((record) => (
              <View key={record.id} style={[styles.recordCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordTypeContainer}>
                    <View style={[
                      styles.recordIcon, 
                      { backgroundColor: record.type === '有机肥' 
                        ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7') 
                        : record.type === '叶面肥' 
                          ? (isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe') 
                          : (isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5') 
                      }
                    ]}>
                      {record.type === '有机肥' ? <Leaf size={16} color="#f59e0b" /> : <Droplets size={16} color={record.type === '叶面肥' ? '#3b82f6' : '#10b981'} />}
                    </View>
                    <View>
                      <Text style={[styles.recordType, { color: colors.textMuted }]}>{record.type}</Text>
                      <Text style={[styles.recordName, { color: colors.text }]}>{record.name}</Text>
                    </View>
                  </View>
                  <View style={[styles.recordAmount, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                    <Text style={[styles.amountText, { color: colors.text }]}>{record.amount}</Text>
                  </View>
                </View>
                <View style={styles.recordDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={12} color={colors.textMuted} />
                    <Text style={[styles.detailText, { color: colors.textMuted }]}>{record.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailText, { color: colors.textMuted }]}>{record.area}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailText, { color: colors.textMuted }]}>{record.method}</Text>
                  </View>
                </View>
                <Text style={[styles.operatorText, { color: colors.textMuted }]}>操作员: {record.operator}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalUsage}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>本月用量</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.monthlyAvg}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>周均用量</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statValue, styles.statValueGreen]}>{stats.costSaved}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>成本节省</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.statValue, styles.statValueGreen]}>{stats.efficiency}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>效率提升</Text>
              </View>
            </View>

            <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.chartTitle, { color: colors.text }]}>肥料类型占比</Text>
              <View style={styles.barChart}>
                {fertilizerTypes.map((type) => (
                  <View key={type.name} style={styles.barItem}>
                    <Text style={[styles.barLabel, { color: colors.textMuted }]}>{type.name}</Text>
                    <View style={[styles.barContainer, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                      <View style={[styles.bar, { width: `${type.usage}%`, backgroundColor: type.color }]} />
                    </View>
                    <Text style={[styles.barValue, { color: colors.text }]}>{type.usage}%</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.tipCard, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb', borderColor: isDark ? 'rgba(245, 158, 11, 0.3)' : '#fef3c7' }]}>
              <View style={[styles.tipIcon, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7' }]}>
                <AlertCircle size={20} color="#f59e0b" />
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: isDark ? '#fbbf24' : '#92400e' }]}>智能建议</Text>
                <Text style={[styles.tipText, { color: isDark ? '#fcd34d' : '#a16207' }]}>根据土壤检测数据，建议下次施肥增加钾肥比例，有助于提高果实品质。</Text>
              </View>
            </View>
          </View>
        )}
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
  addButton: { padding: 8, borderRadius: 8 },
  tabContainer: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabText: { fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: '#059669', fontWeight: 'bold' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  recordCard: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  recordTypeContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recordIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  recordType: { fontSize: 12 },
  recordName: { fontSize: 14, fontWeight: 'bold' },
  recordAmount: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  amountText: { fontSize: 14, fontWeight: 'bold' },
  recordDetails: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12 },
  operatorText: { fontSize: 11 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { width: '47%', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1 },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statValueGreen: { color: '#10b981' },
  statLabel: { fontSize: 12 },
  chartCard: { borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1 },
  chartTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 16 },
  barChart: { gap: 12 },
  barItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  barLabel: { width: 60, fontSize: 12 },
  barContainer: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 4 },
  barValue: { width: 36, fontSize: 12, fontWeight: 'bold', textAlign: 'right' },
  tipCard: { borderRadius: 16, padding: 16, flexDirection: 'row', gap: 12, borderWidth: 1 },
  tipIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  tipText: { fontSize: 12, lineHeight: 18 },
});

export default FertilizerRecord;
