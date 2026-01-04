import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Save, CloudUpload, Clock, Check, WifiOff, ChevronLeft, Sprout, ListFilter, Trash2 } from 'lucide-react-native';
import { OfflineRecord } from '../types';
import { offlineRepository } from '../repositories/OfflineRepository';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const DataEntry: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState<OfflineRecord[]>([]);
  
  const [cropType, setCropType] = useState('番茄');
  const [stage, setStage] = useState('开花期');
  const [height, setHeight] = useState('');
  const [pestCount, setPestCount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await offlineRepository.getAll();
    setQueue(data);
  };

  const handleSubmit = async () => {
    if (!height) {
      Alert.alert('提示', '请输入作物高度');
      return;
    }

    const newRecord: OfflineRecord = {
      id: Date.now().toString(),
      cropType,
      growthStage: stage,
      height: Number(height),
      pestCount: Number(pestCount) || 0,
      notes,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const updatedQueue = await offlineRepository.add(newRecord);
    setQueue(updatedQueue);
    
    setHeight('');
    setPestCount('');
    setNotes('');
    Alert.alert('成功', '记录已保存到本地');
  };

  const handleSync = async () => {
    setLoading(true);
    setTimeout(async () => {
      const updatedQueue = await offlineRepository.syncAll();
      setQueue(updatedQueue);
      setLoading(false);
      Alert.alert('同步完成', '所有数据已上传至云端');
    }, 1500);
  };

  const handleClear = async () => {
    Alert.alert(
        '确认', 
        '确定要清除已同步的记录吗？',
        [
            {text: '取消', style: 'cancel'},
            {text: '清除', onPress: async () => {
                const updatedQueue = await offlineRepository.clearSynced();
                setQueue(updatedQueue);
            }}
        ]
    );
  }

  const pendingCount = queue.filter(q => !q.synced).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.textSecondary} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>数据采集</Text>
                    <View style={styles.offlineRow}>
                        <WifiOff size={10} color={colors.textMuted} />
                        <Text style={[styles.offlineText, { color: colors.textMuted }]}>离线模式已启用</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.headerRight}>
                {queue.some(q => q.synced) && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <Trash2 size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity 
                    onPress={handleSync}
                    disabled={pendingCount === 0 || loading}
                    style={[styles.syncButton, pendingCount > 0 ? styles.syncButtonActive : { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}
                >
                    {loading ? <ActivityIndicator size="small" color="#059669" /> : <CloudUpload size={16} color={pendingCount > 0 ? "#047857" : colors.textMuted} />}
                    <Text style={[styles.syncText, pendingCount > 0 ? styles.syncTextActive : { color: colors.textMuted }]}>
                        同步 ({pendingCount})
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.formHeader}>
                <View style={[styles.formIconBg, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5' }]}>
                    <Sprout size={16} color="#059669" />
                </View>
                <Text style={[styles.formTitle, { color: colors.textSecondary }]}>手动录入</Text>
            </View>

            <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>作物类型</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['番茄', '黄瓜', '甜椒', '草莓', '茄子'].map(c => (
                        <TouchableOpacity 
                            key={c} 
                            onPress={() => setCropType(c)}
                            style={[styles.chipButton, cropType === c ? styles.chipActive : { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border }]}
                        >
                            <Text style={[styles.chipText, cropType === c ? styles.chipTextActive : { color: colors.textSecondary }]}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>生长阶段</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['苗期', '生长期', '开花期', '结果期'].map(s => (
                        <TouchableOpacity 
                            key={s} 
                            onPress={() => setStage(s)}
                            style={[styles.chipButton, stage === s ? styles.chipActive : { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border }]}
                        >
                            <Text style={[styles.chipText, stage === s ? styles.chipTextActive : { color: colors.textSecondary }]}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                    <Text style={[styles.inputLabel, { color: colors.textMuted }]}>株高 (cm)</Text>
                    <TextInput 
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                        placeholder="0.0"
                        placeholderTextColor={colors.textMuted}
                        style={[styles.textInput, { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border, color: colors.text }]}
                    />
                </View>
                <View style={styles.inputHalf}>
                    <Text style={[styles.inputLabel, { color: colors.textMuted }]}>虫害计数</Text>
                    <TextInput 
                        keyboardType="numeric"
                        value={pestCount}
                        onChangeText={setPestCount}
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                        style={[styles.textInput, { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border, color: colors.text }]}
                    />
                </View>
            </View>

            <View style={styles.notesGroup}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>备注</Text>
                <TextInput 
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="输入其他观测情况..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={3}
                    style={[styles.textInput, styles.textArea, { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border, color: colors.text }]}
                />
            </View>

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Save size={18} color="white" />
                <Text style={styles.submitText}>保存记录</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.queueHeader}>
             <View style={styles.queueTitleRow}>
                 <ListFilter size={14} color={colors.textMuted} />
                 <Text style={[styles.queueTitle, { color: colors.textMuted }]}>本地记录队列</Text>
             </View>
             <View style={[styles.queueCountBadge, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                <Text style={[styles.queueCountText, { color: colors.textMuted }]}>{queue.length} 条</Text>
             </View>
        </View>
        
        {queue.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ListFilter size={32} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>暂无待上传记录</Text>
            </View>
        ) : (
            <View style={styles.recordList}>
                {queue.map((record) => (
                    <View key={record.id} style={[styles.recordCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View>
                            <View style={styles.recordTitleRow}>
                                <Text style={[styles.recordCrop, { color: colors.text }]}>{record.cropType}</Text>
                                <View style={[styles.stageBadge, record.growthStage === '结果期' ? styles.stageBadgeAmber : { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                                    <Text style={[styles.stageText, record.growthStage === '结果期' ? styles.stageTextAmber : { color: colors.textMuted }]}>
                                        {record.growthStage}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.recordMeta}>
                                <View style={styles.recordMetaItem}>
                                    <Clock size={10} color={colors.textMuted} />
                                    <Text style={[styles.recordMetaText, { color: colors.textMuted }]}>
                                        {new Date(record.timestamp).getHours().toString().padStart(2, '0')}:
                                        {new Date(record.timestamp).getMinutes().toString().padStart(2, '0')}
                                    </Text>
                                </View>
                                {record.height > 0 && <Text style={[styles.recordMetaText, { color: colors.textMuted }]}>• 株高 {record.height}cm</Text>}
                            </View>
                        </View>
                        
                        <View style={[styles.syncStatusIcon, record.synced ? styles.syncedIcon : styles.pendingIcon]}>
                            {record.synced ? <Check size={16} color="#10b981" /> : <CloudUpload size={16} color="#f59e0b" />}
                        </View>
                    </View>
                ))}
            </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSafeArea: { borderBottomWidth: 1 },
  headerRow: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  offlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  offlineText: { fontSize: 10, color: '#9ca3af' },
  headerRight: { flexDirection: 'row', gap: 8 },
  clearButton: { padding: 8 },
  syncButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  syncButtonActive: { backgroundColor: '#d1fae5' },
  syncButtonInactive: { backgroundColor: '#f3f4f6' },
  syncText: { fontSize: 12, fontWeight: 'bold' },
  syncTextActive: { color: '#047857' },
  syncTextInactive: { color: '#9ca3af' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 50 },
  formCard: { borderRadius: 24, padding: 20, borderWidth: 1, marginBottom: 24 },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  formIconBg: { padding: 6, backgroundColor: '#d1fae5', borderRadius: 8 },
  formTitle: { fontWeight: 'bold', color: '#374151', fontSize: 14 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginBottom: 8 },
  chipButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, marginRight: 8 },
  chipActive: { backgroundColor: '#059669', borderColor: '#059669' },
  chipInactive: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },
  chipText: { fontSize: 12, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  chipTextInactive: { color: '#4b5563' },
  inputRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  inputHalf: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginBottom: 6 },
  textInput: { width: '100%', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  notesGroup: { marginBottom: 20 },
  submitButton: { width: '100%', backgroundColor: '#059669', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  queueHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 4 },
  queueTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  queueTitle: { fontSize: 12, fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' },
  queueCountBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  queueCountText: { fontSize: 10, color: '#9ca3af' },
  emptyState: { paddingVertical: 48, borderRadius: 24, borderWidth: 1, borderStyle: 'dashed', opacity: 0.6, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginTop: 8 },
  recordList: { gap: 12, paddingBottom: 40 },
  recordCard: { padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  recordTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  recordCrop: { fontWeight: 'bold', color: '#374151', fontSize: 14 },
  stageBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stageBadgeAmber: { backgroundColor: '#fef3c7' },
  stageBadgeGray: { backgroundColor: '#f3f4f6' },
  stageText: { fontSize: 10, fontWeight: 'bold' },
  stageTextAmber: { color: '#d97706' },
  stageTextGray: { color: '#6b7280' },
  recordMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recordMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recordMetaText: { fontSize: 10, color: '#9ca3af', fontWeight: '500' },
  syncStatusIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  syncedIcon: { backgroundColor: '#ecfdf5' },
  pendingIcon: { backgroundColor: '#fef3c7' },
});

export default DataEntry;
