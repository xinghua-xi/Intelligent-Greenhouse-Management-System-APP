import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { ChevronLeft, ChevronRight, Fan, CloudRain, Lightbulb, Thermometer, Snowflake, Settings, Clock, Wifi, AlertTriangle, CheckCircle, RotateCcw, Save } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface DeviceConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  enabled: boolean;
  autoMode: boolean;
  params: { [key: string]: { label: string; value: number; unit: string; min: number; max: number } };
}

const DeviceSettings: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [devices, setDevices] = useState<DeviceConfig[]>([
    { id: 'ventilation', name: '通风系统', icon: Fan, color: '#10b981', enabled: true, autoMode: true,
      params: { minSpeed: { label: '最低风速', value: 20, unit: '%', min: 0, max: 100 }, maxSpeed: { label: '最高风速', value: 100, unit: '%', min: 0, max: 100 }, tempThreshold: { label: '启动温度', value: 28, unit: '°C', min: 20, max: 40 } } },
    { id: 'irrigation', name: '灌溉系统', icon: CloudRain, color: '#3b82f6', enabled: true, autoMode: true,
      params: { duration: { label: '单次时长', value: 30, unit: '分钟', min: 5, max: 120 }, interval: { label: '灌溉间隔', value: 6, unit: '小时', min: 1, max: 24 }, ecTarget: { label: '目标EC值', value: 1.8, unit: 'mS/cm', min: 0.5, max: 3.0 } } },
    { id: 'lighting', name: '补光系统', icon: Lightbulb, color: '#f59e0b', enabled: true, autoMode: true,
      params: { brightness: { label: '亮度', value: 80, unit: '%', min: 10, max: 100 }, startTime: { label: '开启时间', value: 18, unit: '点', min: 0, max: 23 }, duration: { label: '补光时长', value: 4, unit: '小时', min: 1, max: 12 } } },
    { id: 'heating', name: '加热系统', icon: Thermometer, color: '#ef4444', enabled: false, autoMode: true,
      params: { targetTemp: { label: '目标温度', value: 20, unit: '°C', min: 10, max: 35 }, minTemp: { label: '启动温度', value: 15, unit: '°C', min: 5, max: 25 } } },
    { id: 'cooling', name: '降温系统', icon: Snowflake, color: '#06b6d4', enabled: true, autoMode: true,
      params: { targetTemp: { label: '目标温度', value: 26, unit: '°C', min: 20, max: 35 }, maxTemp: { label: '启动温度', value: 30, unit: '°C', min: 25, max: 40 } } },
  ]);

  const updateDeviceEnabled = (deviceId: string, enabled: boolean) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, enabled } : d));
    setHasChanges(true);
  };

  const updateDeviceAutoMode = (deviceId: string, autoMode: boolean) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, autoMode } : d));
    setHasChanges(true);
  };

  const updateDeviceParam = (deviceId: string, paramKey: string, delta: number) => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const param = d.params[paramKey];
        const step = param.max > 10 ? 1 : 0.1;
        const newValue = Math.max(param.min, Math.min(param.max, param.value + delta * step));
        return { ...d, params: { ...d.params, [paramKey]: { ...param, value: Math.round(newValue * 10) / 10 } } };
      }
      return d;
    }));
    setHasChanges(true);
  };

  const device = selectedDevice ? devices.find(d => d.id === selectedDevice) : null;

  if (device) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedDevice(null)} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{device.name}</Text>
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.deviceStatusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.deviceIconLarge, { backgroundColor: device.enabled ? `${device.color}20` : (isDark ? colors.border : '#f3f4f6') }]}>
              <device.icon size={32} color={device.enabled ? device.color : colors.textMuted} />
            </View>
            <View style={styles.deviceStatusInfo}>
              <Text style={[styles.deviceStatusName, { color: colors.text }]}>{device.name}</Text>
              <View style={styles.deviceStatusRow}>
                <View style={[styles.statusDot, { backgroundColor: device.enabled ? '#10b981' : '#ef4444' }]} />
                <Text style={[styles.deviceStatusText, { color: colors.textMuted }]}>{device.enabled ? '运行中' : '已关闭'}</Text>
              </View>
            </View>
            <Switch value={device.enabled} onValueChange={(v) => updateDeviceEnabled(device.id, v)}
              trackColor={{ false: isDark ? '#475569' : '#e5e7eb', true: `${device.color}50` }} thumbColor={device.enabled ? device.color : isDark ? '#94a3b8' : '#f4f4f5'} />
          </View>

          <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                <Settings size={18} color={colors.textMuted} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>自动模式</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>根据环境自动调节</Text>
              </View>
              <Switch value={device.autoMode} onValueChange={(v) => updateDeviceAutoMode(device.id, v)}
                trackColor={{ false: isDark ? '#475569' : '#e5e7eb', true: '#a7f3d0' }} thumbColor={device.autoMode ? '#10b981' : isDark ? '#94a3b8' : '#f4f4f5'} />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>参数设置</Text>
          <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {Object.entries(device.params).map(([key, param], index) => (
              <View key={key}>
                <View style={styles.paramItem}>
                  <View style={styles.paramInfo}>
                    <Text style={[styles.paramLabel, { color: colors.text }]}>{param.label}</Text>
                    <Text style={[styles.paramRange, { color: colors.textMuted }]}>范围: {param.min} - {param.max} {param.unit}</Text>
                  </View>
                  <View style={styles.paramInputRow}>
                    <TouchableOpacity style={[styles.paramBtn, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]} onPress={() => updateDeviceParam(device.id, key, -1)}>
                      <Text style={[styles.paramBtnText, { color: colors.text }]}>-</Text>
                    </TouchableOpacity>
                    <View style={[styles.paramValueBox, { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border }]}>
                      <Text style={[styles.paramValue, { color: colors.text }]}>{param.value}</Text>
                      <Text style={[styles.paramUnit, { color: colors.textMuted }]}>{param.unit}</Text>
                    </View>
                    <TouchableOpacity style={[styles.paramBtn, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]} onPress={() => updateDeviceParam(device.id, key, 1)}>
                      <Text style={[styles.paramBtnText, { color: colors.text }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {index < Object.keys(device.params).length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>定时任务</Text>
          <TouchableOpacity style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#dbeafe' }]}>
                <Clock size={18} color="#3b82f6" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>定时开关</Text>
                <Text style={[styles.settingDesc, { color: colors.textMuted }]}>设置自动开关时间</Text>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {hasChanges && (
          <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <TouchableOpacity style={[styles.resetBtn, { borderColor: colors.border }]} onPress={() => setHasChanges(false)}>
              <RotateCcw size={18} color={colors.textMuted} />
              <Text style={[styles.resetBtnText, { color: colors.textMuted }]}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setHasChanges(false)}>
              <Save size={18} color="#fff" />
              <Text style={styles.saveBtnText}>保存设置</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>设备设置</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.overviewCard, { backgroundColor: isDark ? '#1e293b' : '#0f172a' }]}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>设备状态</Text>
            <View style={styles.overviewBadge}>
              <Wifi size={12} color="#10b981" />
              <Text style={styles.overviewBadgeText}>全部在线</Text>
            </View>
          </View>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStatItem}>
              <Text style={styles.overviewStatValue}>{devices.filter(d => d.enabled).length}</Text>
              <Text style={styles.overviewStatLabel}>运行中</Text>
            </View>
            <View style={styles.overviewStatItem}>
              <Text style={styles.overviewStatValue}>{devices.filter(d => !d.enabled).length}</Text>
              <Text style={styles.overviewStatLabel}>已关闭</Text>
            </View>
            <View style={styles.overviewStatItem}>
              <Text style={styles.overviewStatValue}>{devices.filter(d => d.autoMode).length}</Text>
              <Text style={styles.overviewStatLabel}>自动模式</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>设备管理</Text>
        <View style={[styles.deviceList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {devices.map((d, index) => (
            <React.Fragment key={d.id}>
              <TouchableOpacity style={styles.deviceItem} onPress={() => setSelectedDevice(d.id)} activeOpacity={0.7}>
                <View style={[styles.deviceIcon, { backgroundColor: d.enabled ? `${d.color}20` : (isDark ? colors.border : '#f3f4f6') }]}>
                  <d.icon size={20} color={d.enabled ? d.color : colors.textMuted} />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={[styles.deviceName, { color: colors.text }]}>{d.name}</Text>
                  <View style={styles.deviceTags}>
                    <View style={[styles.deviceTag, { backgroundColor: d.enabled ? (isDark ? 'rgba(16,185,129,0.2)' : '#d1fae5') : (isDark ? colors.border : '#f3f4f6') }]}>
                      <Text style={[styles.deviceTagText, { color: d.enabled ? '#10b981' : colors.textMuted }]}>{d.enabled ? '运行中' : '已关闭'}</Text>
                    </View>
                    {d.autoMode && (
                      <View style={[styles.deviceTag, { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#dbeafe' }]}>
                        <Text style={[styles.deviceTagText, { color: '#3b82f6' }]}>自动</Text>
                      </View>
                    )}
                  </View>
                </View>
                <ChevronRight size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {index < devices.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 68 }]} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>全局设置</Text>
        <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: isDark ? 'rgba(245,158,11,0.2)' : '#fef3c7' }]}>
              <AlertTriangle size={18} color="#f59e0b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>安全阈值</Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>设置设备安全运行范围</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 68 }]} />
          <TouchableOpacity style={styles.settingItem}>
            <View style={[styles.settingIcon, { backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : '#d1fae5' }]}>
              <CheckCircle size={18} color="#10b981" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>设备校准</Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>校准传感器和执行器</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>
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
  scrollContent: { padding: 20, paddingBottom: 100 },
  overviewCard: { borderRadius: 20, padding: 20, marginBottom: 24 },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  overviewTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  overviewBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16,185,129,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  overviewBadgeText: { fontSize: 11, color: '#10b981', fontWeight: '600' },
  overviewStats: { flexDirection: 'row' },
  overviewStatItem: { flex: 1, alignItems: 'center' },
  overviewStatValue: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  overviewStatLabel: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 12, marginLeft: 4, textTransform: 'uppercase' },
  deviceList: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  deviceItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  deviceIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 14, fontWeight: '600' },
  deviceTags: { flexDirection: 'row', gap: 6, marginTop: 4 },
  deviceTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  deviceTagText: { fontSize: 10, fontWeight: '600' },
  settingCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  settingDesc: { fontSize: 12, marginTop: 2 },
  divider: { height: 1 },
  deviceStatusCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 24, gap: 16 },
  deviceIconLarge: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  deviceStatusInfo: { flex: 1 },
  deviceStatusName: { fontSize: 18, fontWeight: 'bold' },
  deviceStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  deviceStatusText: { fontSize: 12 },
  paramItem: { padding: 16 },
  paramInfo: { marginBottom: 12 },
  paramLabel: { fontSize: 14, fontWeight: '600' },
  paramRange: { fontSize: 11, marginTop: 2 },
  paramInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paramBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  paramBtnText: { fontSize: 20, fontWeight: 'bold' },
  paramValueBox: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, borderWidth: 1, gap: 4 },
  paramValue: { fontSize: 18, fontWeight: 'bold' },
  paramUnit: { fontSize: 12 },
  bottomBar: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1 },
  resetBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1, gap: 8 },
  resetBtnText: { fontSize: 14, fontWeight: '600' },
  saveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, backgroundColor: '#10b981', gap: 8 },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

export default DeviceSettings;
