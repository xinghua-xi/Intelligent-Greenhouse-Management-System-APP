import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { BrainCircuit, Activity, Scan, Zap, Layers, Camera, CheckCircle2, Thermometer, Droplets, Sun, Wind, Play, Pause, RotateCcw, RefreshCw } from 'lucide-react-native';
import { getGeminiDiagnosis } from '../services/geminiService';
import { DiagnosisResult } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { useAiRecommendation, useAiTasks } from '../hooks/useApi';
import { visionApi } from '../services/api';
import AiChatButton from '../components/AiChatButton';

const SmartPage: React.FC = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<'diagnosis' | 'decision' | 'twin'>('diagnosis');
    const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    
    // 使用 API Hooks
    const { decision, loading: decisionLoading, refresh: refreshDecision } = useAiRecommendation();
    const { tasks, loading: tasksLoading, refresh: refreshTasks } = useAiTasks();
    
    // 数字孪生状态
    const [simRunning, setSimRunning] = useState(false);
    const [simTime, setSimTime] = useState(0);
    const [simTemp, setSimTemp] = useState(24.5);
    const [simHumidity, setSimHumidity] = useState(65);
    const [simLight, setSimLight] = useState(850);
    const [simWater, setSimWater] = useState(100);
    const [simYield, setSimYield] = useState(92);

    // 模拟运行效果
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (simRunning) {
            interval = setInterval(() => {
                setSimTime(t => t + 1);
                setSimTemp(t => Math.min(32, Math.max(18, t + (Math.random() - 0.5) * 2)));
                setSimHumidity(h => Math.min(85, Math.max(45, h + (Math.random() - 0.5) * 5)));
                setSimLight(l => Math.min(1200, Math.max(400, l + (Math.random() - 0.5) * 100)));
                setSimWater(w => Math.max(0, w - Math.random() * 2));
                setSimYield(y => Math.min(100, y + Math.random() * 0.5));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [simRunning]);

    const resetSimulation = () => {
        setSimRunning(false);
        setSimTime(0);
        setSimTemp(24.5);
        setSimHumidity(65);
        setSimLight(850);
        setSimWater(100);
        setSimYield(92);
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("需要相机权限", "请允许访问相机以拍摄照片");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.5,
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            setImageUri(asset.uri);
            if (asset.base64) {
                analyze(asset.base64);
            }
        }
    };

    const analyze = async (base64: string) => {
        setAnalyzing(true);
        setDiagnosisResult(null);
        try {
            const result = await getGeminiDiagnosis(base64);
            setDiagnosisResult(result);
        } catch (e) {
            Alert.alert("错误", "诊断失败，AI 服务暂时无法连接");
        } finally {
            setAnalyzing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>智能中心</Text>
                    <View style={[styles.tabContainer, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
                        <TabButton active={activeTab === 'diagnosis'} onClick={() => setActiveTab('diagnosis')} icon={Scan} label="病害识别" colors={colors} isDark={isDark} />
                        <TabButton active={activeTab === 'decision'} onClick={() => setActiveTab('decision')} icon={BrainCircuit} label="AI 决策" colors={colors} isDark={isDark} />
                        <TabButton active={activeTab === 'twin'} onClick={() => setActiveTab('twin')} icon={Activity} label="数字孪生" colors={colors} isDark={isDark} />
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {activeTab === 'diagnosis' && (
                    <View>
                        {!imageUri ? (
                            <TouchableOpacity onPress={pickImage} style={[styles.cameraButton, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5', borderColor: isDark ? '#10b981' : '#a7f3d0' }]} activeOpacity={0.9}>
                                <View style={[styles.cameraIconContainer, { backgroundColor: colors.card }]}>
                                    <Camera size={32} color="#10b981" />
                                </View>
                                <Text style={[styles.cameraTitle, { color: isDark ? '#10b981' : '#064e3b' }]}>拍摄作物叶片</Text>
                                <Text style={[styles.cameraSubtitle, { color: '#059669' }]}>点击启动 AI 诊断助手</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.imageContainer}>
                                <View style={styles.imageWrapper}>
                                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                                    <TouchableOpacity onPress={() => { setImageUri(null); setDiagnosisResult(null); }} style={styles.retakeButton}>
                                        <Text style={styles.retakeText}>重拍</Text>
                                    </TouchableOpacity>
                                    {analyzing && (
                                        <View style={styles.analyzingOverlay}>
                                            <ActivityIndicator size="large" color="#34d399" />
                                            <Text style={styles.analyzingText}>AI 正在分析病害特征...</Text>
                                        </View>
                                    )}
                                </View>
                                {diagnosisResult && (
                                    <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                        <View style={styles.resultHeader}>
                                            <View style={styles.resultTitleContainer}>
                                                <Text style={[styles.resultTitle, { color: colors.text }]}>{diagnosisResult.plantName}</Text>
                                                <View style={styles.confidenceContainer}>
                                                    <Scan size={14} color={colors.textMuted} />
                                                    <Text style={[styles.confidenceText, { color: colors.textMuted }]}>AI 置信度 {diagnosisResult.confidence}%</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.statusBadge, diagnosisResult.condition === 'healthy' ? styles.statusBadgeHealthy : styles.statusBadgeDisease]}>
                                                <Text style={[styles.statusText, diagnosisResult.condition === 'healthy' ? styles.statusTextHealthy : styles.statusTextDisease]}>
                                                    {diagnosisResult.condition === 'healthy' ? '健康' : '发现病害'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[styles.diagnosisBox, { backgroundColor: isDark ? colors.border : '#f9fafb' }]}>
                                            <Text style={[styles.diagnosisText, { color: colors.textSecondary }]}>{diagnosisResult.diagnosis}</Text>
                                        </View>
                                        {diagnosisResult.treatment && (
                                            <View>
                                                <View style={styles.treatmentHeader}>
                                                    <CheckCircle2 size={18} color="#059669" />
                                                    <Text style={[styles.treatmentTitle, { color: colors.text }]}>建议防治方案</Text>
                                                </View>
                                                {diagnosisResult.treatment.map((t, i) => (
                                                    <View key={i} style={styles.treatmentItem}>
                                                        <View style={styles.treatmentNumber}><Text style={styles.treatmentNumberText}>{i + 1}</Text></View>
                                                        <Text style={[styles.treatmentText, { color: colors.textSecondary }]}>{t}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'decision' && (
                    <View style={styles.decisionContainer}>
                        {decisionLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#10b981" />
                                <Text style={[styles.loadingText, { color: colors.textMuted }]}>加载 AI 建议中...</Text>
                            </View>
                        ) : (
                            <>
                                {decision && (
                                    <DecisionCard 
                                        title={`AI 建议: ${decision.action === 'IRRIGATION' ? '灌溉' : decision.action === 'VENTILATION' ? '通风' : decision.action === 'LIGHTING' ? '补光' : '加热'}`}
                                        desc={decision.reason} 
                                        tags={[`置信度 ${(decision.confidence * 100).toFixed(0)}%`]} 
                                        icon={decision.action === 'IRRIGATION' ? Droplets : decision.action === 'VENTILATION' ? Wind : Zap} 
                                        iconColor={decision.action === 'IRRIGATION' ? '#3b82f6' : '#f59e0b'} 
                                        bgColor={isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe'} 
                                        colors={colors} 
                                        isDark={isDark} 
                                    />
                                )}
                                <DecisionCard title="生长周期预测" desc="基于当前累积光照 (DLI) 模型，预计番茄将于 5 天后进入转色期。" tags={['光照积算']} icon={Zap} iconColor="#f59e0b" bgColor={isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7'} colors={colors} isDark={isDark} />
                                <DecisionCard title="水肥精准调控" desc="检测到果实膨大需求，建议明日将灌溉 EC 值提升至 2.0。" tags={['EC趋势']} icon={Layers} iconColor="#3b82f6" bgColor={isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe'} colors={colors} isDark={isDark} />
                                
                                <TouchableOpacity style={styles.refreshButton} onPress={refreshDecision}>
                                    <RefreshCw size={16} color={colors.textMuted} />
                                    <Text style={[styles.refreshText, { color: colors.textMuted }]}>刷新建议</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}

                {activeTab === 'twin' && (
                    <View>
                        {/* 3D模拟视图 */}
                        <View style={styles.twinContainer}>
                            <View style={styles.twinHeader}>
                                <Text style={styles.twinLabel}>模拟时间</Text>
                                <Text style={styles.twinTime}>{formatTime(simTime)}</Text>
                            </View>
                            
                            {/* 大棚可视化 */}
                            <View style={styles.greenhouseViz}>
                                <Svg width="100%" height={180} viewBox="0 0 300 180">
                                    {/* 大棚轮廓 */}
                                    <Path d="M 30 140 L 30 80 Q 150 20 270 80 L 270 140 Z" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="2" />
                                    {/* 作物行 */}
                                    {[60, 110, 160, 210].map((x, i) => (
                                        <React.Fragment key={i}>
                                            <Circle cx={x} cy={120} r={8 + simYield * 0.1} fill="#22c55e" opacity={0.8} />
                                            <Line x1={x} y1={130} x2={x} y2={140} stroke="#15803d" strokeWidth="2" />
                                        </React.Fragment>
                                    ))}
                                    {/* 温度指示 */}
                                    <SvgText x="50" y="60" fill="#f59e0b" fontSize="10">{simTemp.toFixed(1)}°C</SvgText>
                                    {/* 湿度指示 */}
                                    <SvgText x="240" y="60" fill="#3b82f6" fontSize="10">{simHumidity.toFixed(0)}%</SvgText>
                                </Svg>
                            </View>

                            {/* 控制按钮 */}
                            <View style={styles.controlRow}>
                                <TouchableOpacity style={[styles.controlButton, simRunning && styles.controlButtonActive]} onPress={() => setSimRunning(!simRunning)}>
                                    {simRunning ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.resetButton} onPress={resetSimulation}>
                                    <RotateCcw size={18} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 实时数据面板 */}
                        <View style={[styles.dataPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.dataPanelTitle, { color: colors.text }]}>实时模拟数据</Text>
                            <View style={styles.dataGrid}>
                                <DataItem icon={Thermometer} label="温度" value={`${simTemp.toFixed(1)}°C`} color="#f59e0b" colors={colors} isDark={isDark} />
                                <DataItem icon={Droplets} label="湿度" value={`${simHumidity.toFixed(0)}%`} color="#3b82f6" colors={colors} isDark={isDark} />
                                <DataItem icon={Sun} label="光照" value={`${simLight.toFixed(0)} lux`} color="#eab308" colors={colors} isDark={isDark} />
                                <DataItem icon={Wind} label="水量" value={`${simWater.toFixed(0)}%`} color="#10b981" colors={colors} isDark={isDark} />
                            </View>
                        </View>

                        {/* 预测产量 */}
                        <View style={[styles.yieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.yieldHeader}>
                                <Text style={[styles.yieldLabel, { color: colors.textMuted }]}>预测产量指数</Text>
                                <Text style={styles.yieldValue}>{simYield.toFixed(1)}</Text>
                            </View>
                            <View style={[styles.yieldBar, { backgroundColor: isDark ? colors.border : '#e5e7eb' }]}>
                                <View style={[styles.yieldProgress, { width: `${simYield}%` }]} />
                            </View>
                            <Text style={[styles.yieldTip, { color: colors.textMuted }]}>
                                {simYield > 95 ? '🎉 产量预期优秀！' : simYield > 85 ? '✅ 产量预期良好' : '⚠️ 建议优化环境参数'}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
            <AiChatButton />
        </View>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label, colors, isDark }: any) => (
    <TouchableOpacity onPress={onClick} style={[styles.tabButton, active && { backgroundColor: colors.card }]} activeOpacity={0.8}>
        <Icon size={16} color={active ? colors.text : colors.textMuted} strokeWidth={active ? 2.5 : 2} />
        <Text style={[styles.tabButtonText, { color: active ? colors.text : colors.textMuted }]}>{label}</Text>
    </TouchableOpacity>
);

const DecisionCard = ({ title, desc, tags, icon: Icon, iconColor, bgColor, colors, isDark }: any) => (
    <View style={[styles.decisionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.decisionCardHeader}>
            <View style={[styles.decisionIconContainer, { backgroundColor: bgColor }]}><Icon size={20} color={iconColor} /></View>
            <View style={styles.decisionCardContent}>
                <Text style={[styles.decisionCardTitle, { color: colors.text }]}>{title}</Text>
                <View style={styles.tagContainer}>
                    {tags.map((t: string) => (<View key={t} style={[styles.tag, { backgroundColor: isDark ? colors.border : '#f9fafb', borderColor: colors.border }]}><Text style={[styles.tagText, { color: colors.textMuted }]}>{t}</Text></View>))}
                </View>
            </View>
        </View>
        <Text style={[styles.decisionCardDesc, { color: colors.textSecondary }]}>{desc}</Text>
    </View>
);

const DataItem = ({ icon: Icon, label, value, color, colors, isDark }: any) => (
    <View style={[styles.dataItem, { backgroundColor: isDark ? colors.border : '#f9fafb' }]}>
        <Icon size={18} color={color} />
        <Text style={[styles.dataLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.dataValue, { color: colors.text }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerSafeArea: { borderBottomWidth: 1, paddingBottom: 8 },
    header: { paddingHorizontal: 20, paddingTop: 8 },
    headerTitle: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
    tabContainer: { flexDirection: 'row', padding: 6, borderRadius: 16 },
    tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 12 },
    tabButtonText: { fontSize: 12, fontWeight: 'bold' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    cameraButton: { width: '100%', height: 320, borderWidth: 2, borderStyle: 'dashed', borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
    cameraIconContainer: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    cameraTitle: { fontWeight: 'bold', fontSize: 18 },
    cameraSubtitle: { fontSize: 14, marginTop: 8, opacity: 0.8, fontWeight: '500' },
    imageContainer: { gap: 24 },
    imageWrapper: { borderRadius: 32, overflow: 'hidden', height: 320, backgroundColor: '#000', position: 'relative' },
    image: { width: '100%', height: '100%' },
    retakeButton: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
    retakeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    analyzingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', alignItems: 'center', justifyContent: 'center' },
    analyzingText: { color: '#34d399', fontWeight: 'bold', marginTop: 16 },
    resultCard: { borderRadius: 32, padding: 24, borderWidth: 1 },
    resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    resultTitleContainer: { flex: 1 },
    resultTitle: { fontSize: 20, fontWeight: '900' },
    confidenceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    confidenceText: { fontSize: 12, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
    statusBadgeHealthy: { backgroundColor: '#d1fae5' },
    statusBadgeDisease: { backgroundColor: '#fee2e2' },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    statusTextHealthy: { color: '#047857' },
    statusTextDisease: { color: '#b91c1c' },
    diagnosisBox: { padding: 16, borderRadius: 16, marginBottom: 24 },
    diagnosisText: { fontWeight: '500', lineHeight: 20, fontSize: 14 },
    treatmentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    treatmentTitle: { fontWeight: 'bold', fontSize: 14 },
    treatmentItem: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    treatmentNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center' },
    treatmentNumberText: { fontSize: 10, fontWeight: 'bold', color: '#059669' },
    treatmentText: { flex: 1, fontSize: 14, fontWeight: '500', paddingTop: 2 },
    decisionContainer: { gap: 16 },
    loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    loadingText: { marginTop: 12, fontSize: 14 },
    refreshButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, marginTop: 8 },
    refreshText: { fontSize: 12 },
    decisionCard: { padding: 20, borderRadius: 24, borderWidth: 1 },
    decisionCardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 12 },
    decisionIconContainer: { padding: 12, borderRadius: 16 },
    decisionCardContent: { flex: 1 },
    decisionCardTitle: { fontWeight: 'bold', fontSize: 14 },
    tagContainer: { flexDirection: 'row', gap: 6, marginTop: 8 },
    tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
    tagText: { fontSize: 10 },
    decisionCardDesc: { fontSize: 12, lineHeight: 18 },
    twinContainer: { backgroundColor: '#0f172a', borderRadius: 24, padding: 20, marginBottom: 16 },
    twinHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    twinLabel: { color: '#64748b', fontSize: 12 },
    twinTime: { color: '#34d399', fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace' },
    greenhouseViz: { marginBottom: 16 },
    controlRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
    controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
    controlButtonActive: { backgroundColor: '#f59e0b' },
    resetButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
    dataPanel: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 16 },
    dataPanelTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 16 },
    dataGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    dataItem: { width: '47%', padding: 12, borderRadius: 12, alignItems: 'center', gap: 4 },
    dataLabel: { fontSize: 11 },
    dataValue: { fontSize: 16, fontWeight: 'bold' },
    yieldCard: { borderRadius: 20, padding: 20, borderWidth: 1 },
    yieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    yieldLabel: { fontSize: 12 },
    yieldValue: { fontSize: 32, fontWeight: 'bold', color: '#10b981' },
    yieldBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
    yieldProgress: { height: '100%', backgroundColor: '#10b981', borderRadius: 4 },
    yieldTip: { fontSize: 12, textAlign: 'center' },
});

export default SmartPage;
