import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { Camera, Mic, Phone, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { getGeminiDiagnosis } from '../services/geminiService';
import VoiceAssistant from '../components/VoiceAssistant';

const SmartMinimal: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ healthy: boolean; message: string } | null>(null);
  const [showVoice, setShowVoice] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("需要相机权限", "请允许访问相机");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });
    if (!res.canceled && res.assets?.[0]) {
      setImageUri(res.assets[0].uri);
      if (res.assets[0].base64) {
        analyzeImage(res.assets[0].base64);
      }
    }
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const diagnosis = await getGeminiDiagnosis(base64);
      setResult({
        healthy: diagnosis.condition === 'healthy',
        message: diagnosis.condition === 'healthy' ? '作物很健康！' : diagnosis.diagnosis || '发现问题，建议咨询专家'
      });
    } catch {
      setResult({ healthy: false, message: '分析失败，请重试' });
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => { setImageUri(null); setResult(null); };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>智能助手</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>拍照识别作物健康</Text>
        </View>
        <View style={styles.content}>
          {!imageUri ? (
            <TouchableOpacity style={[styles.cameraCard, { backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#d1fae5' }]} onPress={pickImage} activeOpacity={0.8}>
              <View style={styles.cameraIcon}><Camera size={48} color="#10b981" /></View>
              <Text style={styles.cameraText}>点击拍照</Text>
              <Text style={styles.cameraHint}>对准作物叶片</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.resultContainer}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                {analyzing && (
                  <View style={styles.analyzingOverlay}>
                    <ActivityIndicator size="large" color="#10b981" />
                    <Text style={styles.analyzingText}>正在分析...</Text>
                  </View>
                )}
              </View>
              {result && (
                <View style={[styles.resultCard, { backgroundColor: result.healthy ? '#d1fae5' : '#fef3c7', borderColor: result.healthy ? '#10b981' : '#f59e0b' }]}>
                  <View style={[styles.resultIcon, { backgroundColor: result.healthy ? '#10b981' : '#f59e0b' }]}>
                    {result.healthy ? <CheckCircle size={32} color="#fff" /> : <AlertTriangle size={32} color="#fff" />}
                  </View>
                  <Text style={[styles.resultTitle, { color: result.healthy ? '#059669' : '#d97706' }]}>{result.healthy ? '健康' : '需要关注'}</Text>
                  <Text style={styles.resultMessage}>{result.message}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.retryButton} onPress={reset}><Text style={styles.retryText}>重新拍照</Text></TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={[styles.voiceButton, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}
            onPress={() => setShowVoice(true)}
          >
            <Mic size={28} color="#059669" /><Text style={[styles.voiceText, { color: colors.text }]}>语音咨询</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: '#ef4444' }]}>
            <Phone size={24} color="#fff" /><Text style={styles.callText}>呼叫专家</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <VoiceAssistant visible={showVoice} onClose={() => setShowVoice(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 16, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '900' },
  subtitle: { fontSize: 18, marginTop: 4 },
  content: { flex: 1 },
  cameraCard: { flex: 1, maxHeight: 400, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#10b981', borderStyle: 'dashed' },
  cameraIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cameraText: { fontSize: 24, fontWeight: 'bold', color: '#059669' },
  cameraHint: { fontSize: 16, color: '#10b981', marginTop: 8 },
  resultContainer: { flex: 1, gap: 16 },
  imageWrapper: { height: 200, borderRadius: 24, overflow: 'hidden', backgroundColor: '#000' },
  image: { width: '100%', height: '100%' },
  analyzingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  analyzingText: { color: '#10b981', fontSize: 18, fontWeight: 'bold', marginTop: 12 },
  resultCard: { borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 3 },
  resultIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  resultTitle: { fontSize: 28, fontWeight: 'bold' },
  resultMessage: { fontSize: 16, color: '#6b7280', marginTop: 8, textAlign: 'center' },
  retryButton: { backgroundColor: '#e5e7eb', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  retryText: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  bottomActions: { paddingVertical: 20, gap: 12 },
  voiceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 18, borderRadius: 20 },
  voiceText: { fontSize: 18, fontWeight: 'bold' },
  callButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 18, borderRadius: 20 },
  callText: { fontSize: 18, fontWeight: 'bold', color: '#fff' }
});

export default SmartMinimal;
