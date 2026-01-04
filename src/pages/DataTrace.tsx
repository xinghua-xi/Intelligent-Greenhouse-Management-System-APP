import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeft, Search, Filter, Package, Truck, Store, Leaf, QrCode, Calendar, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const DataTrace: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [selectedBatch, setSelectedBatch] = useState<string | null>('B20241220001');

  const batches = [
    { id: 'B20241220001', crop: '番茄', variety: '圣女果', weight: '500kg', date: '2024-12-20', status: '已出库' },
    { id: 'B20241218002', crop: '黄瓜', variety: '水果黄瓜', weight: '320kg', date: '2024-12-18', status: '运输中' },
    { id: 'B20241215003', crop: '甜椒', variety: '彩椒', weight: '180kg', date: '2024-12-15', status: '已售出' },
  ];

  const traceSteps = [
    { id: 1, title: '播种育苗', date: '2024-09-15', location: '1号育苗棚', icon: Leaf, details: '品种：圣女果 | 种子批次：S2024091501' },
    { id: 2, title: '移栽定植', date: '2024-10-01', location: '1号智能番茄棚', icon: MapPin, details: '定植密度：3株/m² | 基肥施用完成' },
    { id: 3, title: '生长管理', date: '2024-10-01 ~ 12-15', location: '1号智能番茄棚', icon: Calendar, details: '灌溉32次 | 施肥12次 | 病虫害防治2次' },
    { id: 4, title: '采收包装', date: '2024-12-18', location: '分拣中心', icon: Package, details: '采收量：520kg | 合格率：96.2%' },
    { id: 5, title: '物流运输', date: '2024-12-19', location: '冷链物流', icon: Truck, details: '运输温度：4-8°C | 车牌：浙A12345' },
    { id: 6, title: '终端销售', date: '2024-12-20', location: '盒马鲜生·杭州店', icon: Store, details: '上架时间：08:30 | 保质期至：12-25' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>数据溯源</Text>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
            <Filter size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.searchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.searchRow}>
            <Search size={18} color={colors.textMuted} />
            <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>输入批次号或扫描二维码</Text>
          </View>
          <TouchableOpacity style={[styles.qrButton, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5' }]}>
            <QrCode size={20} color="#10b981" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>近期批次</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.batchScroll}>
          {batches.map((batch) => (
            <TouchableOpacity
              key={batch.id}
              onPress={() => setSelectedBatch(batch.id)}
              style={[
                styles.batchCard, 
                { backgroundColor: colors.card, borderColor: colors.border },
                selectedBatch === batch.id && styles.batchCardActive
              ]}
            >
              <View style={styles.batchHeader}>
                <Text style={[styles.batchCrop, { color: colors.text }, selectedBatch === batch.id && styles.batchCropActive]}>{batch.crop}</Text>
                <View style={[
                  styles.statusBadge, 
                  batch.status === '已售出' 
                    ? (isDark ? styles.statusSoldDark : styles.statusSold) 
                    : batch.status === '运输中' 
                      ? (isDark ? styles.statusShippingDark : styles.statusShipping) 
                      : (isDark ? styles.statusOutDark : styles.statusOut)
                ]}>
                  <Text style={[styles.statusText, { color: isDark ? '#e5e7eb' : '#374151' }]}>{batch.status}</Text>
                </View>
              </View>
              <Text style={[styles.batchId, { color: colors.textMuted }, selectedBatch === batch.id && styles.batchIdActive]}>{batch.id}</Text>
              <Text style={[styles.batchInfo, { color: colors.textSecondary }, selectedBatch === batch.id && styles.batchInfoActive]}>{batch.variety} · {batch.weight}</Text>
              <Text style={[styles.batchDate, { color: colors.textMuted }, selectedBatch === batch.id && styles.batchDateActive]}>{batch.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>溯源链路</Text>
        <View style={[styles.traceContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {traceSteps.map((step, index) => (
            <View key={step.id} style={styles.traceStep}>
              <View style={styles.traceLeft}>
                <View style={[
                  styles.traceIcon, 
                  { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5' },
                  index === traceSteps.length - 1 && styles.traceIconLast
                ]}>
                  <step.icon size={18} color={index === traceSteps.length - 1 ? '#fff' : '#10b981'} />
                </View>
                {index < traceSteps.length - 1 && <View style={[styles.traceLine, { backgroundColor: isDark ? colors.border : '#e5e7eb' }]} />}
              </View>
              <View style={styles.traceContent}>
                <View style={styles.traceHeader}>
                  <Text style={[styles.traceTitle, { color: colors.text }]}>{step.title}</Text>
                  <Text style={[styles.traceDate, { color: colors.textMuted }]}>{step.date}</Text>
                </View>
                <Text style={styles.traceLocation}>{step.location}</Text>
                <Text style={[styles.traceDetails, { color: colors.textMuted }]}>{step.details}</Text>
              </View>
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
  filterButton: { padding: 8, borderRadius: 8 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  searchCard: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, marginBottom: 24 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchPlaceholder: { fontSize: 14 },
  qrButton: { padding: 8, borderRadius: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  batchScroll: { marginBottom: 24, marginHorizontal: -20, paddingHorizontal: 20 },
  batchCard: { width: 160, borderRadius: 16, padding: 16, marginRight: 12, borderWidth: 1 },
  batchCardActive: { backgroundColor: '#059669', borderColor: '#059669' },
  batchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  batchCrop: { fontSize: 16, fontWeight: 'bold' },
  batchCropActive: { color: '#fff' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusOut: { backgroundColor: '#dbeafe' },
  statusOutDark: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
  statusShipping: { backgroundColor: '#fef3c7' },
  statusShippingDark: { backgroundColor: 'rgba(251, 191, 36, 0.2)' },
  statusSold: { backgroundColor: '#d1fae5' },
  statusSoldDark: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  batchId: { fontSize: 10, marginBottom: 4 },
  batchIdActive: { color: 'rgba(255,255,255,0.8)' },
  batchInfo: { fontSize: 12, marginBottom: 4 },
  batchInfoActive: { color: '#fff' },
  batchDate: { fontSize: 10 },
  batchDateActive: { color: 'rgba(255,255,255,0.7)' },
  traceContainer: { borderRadius: 24, padding: 20, borderWidth: 1 },
  traceStep: { flexDirection: 'row', marginBottom: 4 },
  traceLeft: { alignItems: 'center', marginRight: 16 },
  traceIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  traceIconLast: { backgroundColor: '#059669' },
  traceLine: { width: 2, flex: 1, marginVertical: 4 },
  traceContent: { flex: 1, paddingBottom: 20 },
  traceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  traceTitle: { fontSize: 14, fontWeight: 'bold' },
  traceDate: { fontSize: 10 },
  traceLocation: { fontSize: 12, color: '#10b981', marginBottom: 4 },
  traceDetails: { fontSize: 12, lineHeight: 18 },
});

export default DataTrace;
