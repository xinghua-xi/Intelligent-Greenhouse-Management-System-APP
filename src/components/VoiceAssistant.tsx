/**
 * 语音问答助手组件 - 支持讯飞语音识别
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Mic, X, Volume2, VolumeX, ChevronLeft, Send, MicOff } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { aiApi } from '../services/api';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

interface VoiceAssistantProps {
  visible: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ visible, onClose }) => {
  const { colors, isDark } = useTheme();
  const [status, setStatus] = useState<'idle' | 'listening' | 'recognizing' | 'thinking' | 'speaking'>('idle');
  const [inputText, setInputText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // 快捷问题
  const quickQuestions = [
    '番茄叶子发黄怎么办？',
    '今天需要浇水吗？',
    '大棚温度多少合适？',
    '如何防治病虫害？',
  ];

  // 请求麦克风权限
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
  }, []);

  // 录音计时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'listening') {
      timer = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(timer);
  }, [status]);

  // 脉冲动画
  useEffect(() => {
    if (status === 'listening') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [status]);

  // 关闭时清理
  useEffect(() => {
    if (!visible) {
      Speech.stop();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }
      setStatus('idle');
      setQuestion('');
      setAnswer('');
      setInputText('');
    }
  }, [visible]);

  // 开始录音
  const startRecording = async () => {
    // 防止重复调用
    if (status !== 'idle') return;

    try {
      // 先检查权限
      const { status: permStatus } = await Audio.requestPermissionsAsync();
      if (permStatus !== 'granted') {
        Alert.alert('需要麦克风权限', '请在设置中允许访问麦克风');
        return;
      }
      setPermissionGranted(true);

      // 确保之前的录音已完全卸载
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch {}
        recordingRef.current = null;
        // 等待一下让系统释放资源
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 重置音频模式
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 使用预设的高质量录音选项
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = newRecording;
      setStatus('listening');
      setAnswer('');
      setQuestion('');

    } catch (err: any) {
      console.error('录音失败:', err);
      recordingRef.current = null;
      
      if (err.message?.includes('Only one Recording')) {
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          const { recording: retryRecording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
          );
          recordingRef.current = retryRecording;
          setStatus('listening');
          setAnswer('');
          setQuestion('');
        } catch (retryErr) {
          console.error('重试录音失败:', retryErr);
          Alert.alert('录音失败', '请稍后重试');
        }
      } else {
        Alert.alert('录音失败', '无法启动录音，请检查麦克风权限');
      }
    }
  };

  // 停止录音并识别
  const stopRecording = async () => {
    if (!recordingRef.current || status !== 'listening') return;

    try {
      setStatus('recognizing');
      
      const currentRecording = recordingRef.current;
      recordingRef.current = null;
      
      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();

      if (uri) {
        // 读取音频文件并转为 base64
        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });

        // 获取文件格式
        const format = uri.includes('.m4a') ? 'm4a' : 'wav';
        console.log('🎤 音频格式:', format, '大小:', base64Audio.length);

        // 调用后端语音识别接口
        try {
          const result = await aiApi.speechToText(base64Audio, format);
          
          if (result.text && result.text.trim()) {
            setInputText(result.text);
            // 自动发送识别结果
            handleQuestion(result.text);
          } else {
            setStatus('idle');
            Alert.alert('识别失败', '未能识别到语音内容，请重试或手动输入');
          }
        } catch (err: any) {
          console.error('语音识别失败:', err);
          setStatus('idle');
          Alert.alert('识别失败', err.message || '语音识别服务暂时不可用，请手动输入');
        }

        // 删除临时文件
        try {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch {}
      }
    } catch (err) {
      console.error('停止录音失败:', err);
      setStatus('idle');
    }
  };

  // 处理问题
  const handleQuestion = async (q: string) => {
    if (!q.trim()) return;
    
    setQuestion(q);
    setInputText('');
    setStatus('thinking');

    try {
      const response = await aiApi.chat({ prompt: q });
      
      if (response.success) {
        setAnswer(response.text);
        setStatus('speaking');
        
        // 朗读回答
        Speech.speak(response.text, {
          language: 'zh-CN',
          pitch: 1.0,
          rate: 0.9,
          onDone: () => setStatus('idle'),
          onStopped: () => setStatus('idle'),
          onError: () => setStatus('idle'),
        });
      } else {
        throw new Error('AI 响应失败');
      }
    } catch (error: any) {
      setStatus('idle');
      Alert.alert('提示', error.message || '服务暂时不可用');
    }
  };

  // 停止朗读
  const stopSpeaking = () => {
    Speech.stop();
    setStatus('idle');
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening': return `录音中... ${recordingDuration}秒`;
      case 'recognizing': return '正在识别语音...';
      case 'thinking': return '思考中...';
      case 'speaking': return '正在回答...';
      default: return '按住麦克风说话';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening': return '#ef4444';
      case 'recognizing': return '#f59e0b';
      case 'thinking': return '#f59e0b';
      case 'speaking': return '#3b82f6';
      default: return '#10b981';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* 顶部导航栏 */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <ChevronLeft size={28} color={colors.text} />
            <Text style={[styles.backText, { color: colors.text }]}>返回</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            {status === 'speaking' && (
              <TouchableOpacity onPress={stopSpeaking} style={styles.stopButton}>
                <VolumeX size={24} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* 语音按钮区域 */}
            <View style={styles.micSection}>
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
              
              <Animated.View style={[
                styles.micPulse,
                { transform: [{ scale: pulseAnim }] },
                status === 'listening' && styles.micPulseActive
              ]}>
                <TouchableOpacity
                  style={[
                    styles.micButton,
                    { backgroundColor: getStatusColor() }
                  ]}
                  onPressIn={status === 'idle' ? startRecording : undefined}
                  onPressOut={status === 'listening' ? stopRecording : undefined}
                  onPress={status === 'speaking' ? stopSpeaking : undefined}
                  disabled={status === 'thinking' || status === 'recognizing'}
                >
                  {(status === 'thinking' || status === 'recognizing') ? (
                    <ActivityIndicator size="large" color="#fff" />
                  ) : status === 'speaking' ? (
                    <Volume2 size={48} color="#fff" />
                  ) : status === 'listening' ? (
                    <MicOff size={48} color="#fff" />
                  ) : (
                    <Mic size={48} color="#fff" />
                  )}
                </TouchableOpacity>
              </Animated.View>
              
              <Text style={[styles.micHint, { color: colors.textMuted }]}>
                {status === 'listening' ? '松开结束录音' : 
                 status === 'speaking' ? '点击停止朗读' : '按住说话'}
              </Text>
            </View>

            {/* 快捷问题 */}
            {!question && status === 'idle' && (
              <View style={styles.quickSection}>
                <Text style={[styles.quickTitle, { color: colors.textMuted }]}>或选择快捷问题</Text>
                <View style={styles.quickGrid}>
                  {quickQuestions.map((q, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.quickButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                      onPress={() => handleQuestion(q)}
                    >
                      <Text style={[styles.quickText, { color: colors.text }]}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* 问题显示 */}
            {question && (
              <View style={[styles.questionBox, { backgroundColor: isDark ? colors.border : '#e0f2fe' }]}>
                <Text style={[styles.boxLabel, { color: colors.textMuted }]}>您的问题</Text>
                <Text style={[styles.questionText, { color: colors.text }]}>{question}</Text>
              </View>
            )}

            {/* 回答显示 */}
            {answer && (
              <View style={[styles.answerBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5' }]}>
                <View style={styles.answerHeader}>
                  <Volume2 size={18} color="#10b981" />
                  <Text style={styles.answerLabel}>AI 回答</Text>
                  {status === 'speaking' && (
                    <View style={styles.speakingIndicator}>
                      <Text style={styles.speakingText}>朗读中</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.answerText, { color: colors.text }]}>{answer}</Text>
                
                {status === 'idle' && (
                  <TouchableOpacity 
                    style={styles.replayButton}
                    onPress={() => {
                      setStatus('speaking');
                      Speech.speak(answer, {
                        language: 'zh-CN',
                        pitch: 1.0,
                        rate: 0.9,
                        onDone: () => setStatus('idle'),
                        onStopped: () => setStatus('idle'),
                      });
                    }}
                  >
                    <Volume2 size={16} color="#10b981" />
                    <Text style={styles.replayText}>重新朗读</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>

          {/* 底部输入区域 */}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View style={[styles.inputWrapper, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="或在这里输入问题..."
                placeholderTextColor={colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={200}
                editable={status === 'idle'}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || status !== 'idle') && styles.sendButtonDisabled]}
              onPress={() => handleQuestion(inputText)}
              disabled={!inputText.trim() || status !== 'idle'}
            >
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 12, 
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  backText: { fontSize: 17, marginLeft: 4 },
  headerRight: { width: 60, alignItems: 'flex-end' },
  stopButton: { padding: 8 },
  content: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 20 },
  micSection: { alignItems: 'center', marginVertical: 20 },
  statusText: { fontSize: 18, fontWeight: '600', marginBottom: 24 },
  micPulse: { borderRadius: 80 },
  micPulseActive: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  micButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  micHint: { marginTop: 20, fontSize: 15 },
  quickSection: { marginTop: 30 },
  quickTitle: { fontSize: 14, marginBottom: 16, textAlign: 'center' },
  quickGrid: { gap: 12 },
  quickButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    borderRadius: 16, 
    borderWidth: 1,
  },
  quickText: { fontSize: 17, textAlign: 'center' },
  questionBox: { 
    padding: 20, 
    borderRadius: 20, 
    marginTop: 24,
  },
  boxLabel: { fontSize: 13, marginBottom: 8 },
  questionText: { fontSize: 18, fontWeight: '600', lineHeight: 28 },
  answerBox: { 
    padding: 20, 
    borderRadius: 20, 
    marginTop: 16,
  },
  answerHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 12,
  },
  answerLabel: { fontSize: 15, color: '#10b981', fontWeight: '600' },
  speakingIndicator: { 
    backgroundColor: '#10b981', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12,
    marginLeft: 'auto',
  },
  speakingText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  answerText: { fontSize: 17, lineHeight: 28 },
  replayButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  replayText: { color: '#10b981', fontSize: 15, fontWeight: '500' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    padding: 12, 
    borderTopWidth: 1, 
    gap: 10,
  },
  inputWrapper: { 
    flex: 1, 
    borderRadius: 24, 
    paddingHorizontal: 18, 
    paddingVertical: 12,
    maxHeight: 100,
  },
  input: { fontSize: 16, maxHeight: 80 },
  sendButton: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#10b981', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#9ca3af' },
});

export default VoiceAssistant;
