/**
 * AI 智能问答页面
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Send, Mic, MicOff, Bot, User, Trash2, Volume2, VolumeX } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { aiApi } from '../services/api';
import { ChatMessage } from '../services/api/types';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

const AiChat: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true); // 自动朗读开关
  
  // 语音录制相关
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // 快捷问题
  const quickQuestions = [
    '番茄叶子发黄是什么原因？',
    '今天需要浇水吗？',
    '如何防治红蜘蛛？',
    '大棚温度多少合适？',
  ];

  // 请求麦克风权限
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
    })();
  }, []);

  // 脉冲动画
  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // 停止朗读
  useEffect(() => {
    return () => {
      Speech.stop();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  // 朗读文本
  const speakText = async (text: string) => {
    try {
      // 先停止之前的朗读
      await Speech.stop();
      setIsSpeaking(true);
      
      await Speech.speak(text, {
        language: 'zh-CN',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('语音合成失败:', error);
      setIsSpeaking(false);
    }
  };

  // 停止朗读
  const stopSpeaking = async () => {
    await Speech.stop();
    setIsSpeaking(false);
  };

  // 发送消息
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // 滚动到底部
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await aiApi.chat({
        prompt: text.trim(),
        history: messages.slice(-10), // 最近10条历史
      });

      if (response.success) {
        const assistantMessage: ChatMessage = { role: 'assistant', content: response.text };
        setMessages(prev => [...prev, assistantMessage]);
        
        // 自动朗读回答
        if (autoSpeak) {
          speakText(response.text);
        }
      } else {
        throw new Error('AI 响应失败');
      }
    } catch (error: any) {
      console.error('问答失败:', error);
      Alert.alert('提示', error.message || 'AI 服务暂时不可用，请稍后重试');
      // 移除用户消息
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  // 语音输入提示
  const showVoiceInputTip = () => {
    Alert.alert(
      '语音输入',
      '请使用系统键盘的语音输入功能：\n\n' +
      '• Android: 点击键盘上的麦克风图标\n' +
      '• iOS: 长按空格键启动听写\n\n' +
      '语音识别后文字会自动填入输入框',
      [{ text: '知道了' }]
    );
  };

  // 开始录音
  const startRecording = async () => {
    // 防止重复调用
    if (isRecording || isRecognizing) return;

    try {
      // 先检查权限
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
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

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = newRecording;
      setIsRecording(true);
    } catch (err: any) {
      console.error('录音失败:', err);
      recordingRef.current = null;
      setIsRecording(false);
      
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
          setIsRecording(true);
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
    if (!recordingRef.current || !isRecording) return;

    try {
      setIsRecording(false);
      setIsRecognizing(true);
      
      const currentRecording = recordingRef.current;
      recordingRef.current = null;
      
      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();

      if (uri) {
        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });

        const format = uri.includes('.m4a') ? 'm4a' : 'wav';
        console.log('🎤 音频格式:', format, '大小:', base64Audio.length);

        try {
          const result = await aiApi.speechToText(base64Audio, format);
          
          if (result.text && result.text.trim()) {
            setInputText(prev => prev + result.text);
          } else {
            Alert.alert('识别失败', '未能识别到语音内容，请重试');
          }
        } catch (err: any) {
          console.error('语音识别失败:', err);
          Alert.alert('识别失败', err.message || '语音识别服务暂时不可用');
        }

        try {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch {}
      }
    } catch (err) {
      console.error('停止录音失败:', err);
    } finally {
      setIsRecognizing(false);
    }
  };

  // 清空对话
  const clearChat = () => {
    Alert.alert('确认', '确定要清空所有对话吗？', [
      { text: '取消', style: 'cancel' },
      { 
        text: '确定', 
        onPress: () => {
          Speech.stop();
          setMessages([]);
        }
      },
    ]);
  };

  // 切换自动朗读
  const toggleAutoSpeak = () => {
    if (autoSpeak) {
      Speech.stop();
      setIsSpeaking(false);
    }
    setAutoSpeak(!autoSpeak);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI 智能问答</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>DeepSeek 大模型</Text>
          </View>
          <TouchableOpacity onPress={toggleAutoSpeak} style={styles.speakButton}>
            {autoSpeak ? (
              <Volume2 size={20} color="#10b981" />
            ) : (
              <VolumeX size={20} color={colors.textMuted} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
            <Trash2 size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* 欢迎消息 */}
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <View style={[styles.welcomeIcon, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5' }]}>
                <Bot size={32} color="#10b981" />
              </View>
              <Text style={[styles.welcomeTitle, { color: colors.text }]}>你好，我是绿智助手</Text>
              <Text style={[styles.welcomeDesc, { color: colors.textMuted }]}>
                我可以回答关于温室种植、病虫害防治、环境调控等问题
              </Text>
              
              {/* 快捷问题 */}
              <View style={styles.quickQuestions}>
                <Text style={[styles.quickTitle, { color: colors.textMuted }]}>试试问我：</Text>
                {quickQuestions.map((q, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.quickButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => sendMessage(q)}
                  >
                    <Text style={[styles.quickText, { color: colors.textSecondary }]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 消息列表 */}
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageRow,
                msg.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant,
              ]}
            >
              {msg.role === 'assistant' && (
                <View style={[styles.avatar, styles.avatarAssistant]}>
                  <Bot size={16} color="#fff" />
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.messageBubble,
                  msg.role === 'user'
                    ? [styles.bubbleUser, { backgroundColor: '#10b981' }]
                    : [styles.bubbleAssistant, { backgroundColor: colors.card, borderColor: colors.border }],
                ]}
                onPress={() => msg.role === 'assistant' && speakText(msg.content)}
                activeOpacity={msg.role === 'assistant' ? 0.7 : 1}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.role === 'user' ? styles.textUser : { color: colors.text },
                  ]}
                >
                  {msg.content}
                </Text>
                {msg.role === 'assistant' && (
                  <View style={styles.speakHint}>
                    <Volume2 size={12} color={colors.textMuted} />
                    <Text style={[styles.speakHintText, { color: colors.textMuted }]}>点击朗读</Text>
                  </View>
                )}
              </TouchableOpacity>
              {msg.role === 'user' && (
                <View style={[styles.avatar, styles.avatarUser]}>
                  <User size={16} color="#fff" />
                </View>
              )}
            </View>
          ))}

          {/* 加载中 */}
          {loading && (
            <View style={[styles.messageRow, styles.messageRowAssistant]}>
              <View style={[styles.avatar, styles.avatarAssistant]}>
                <Bot size={16} color="#fff" />
              </View>
              <View style={[styles.messageBubble, styles.bubbleAssistant, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.loadingDots}>
                  <ActivityIndicator size="small" color="#10b981" />
                  <Text style={[styles.loadingText, { color: colors.textMuted }]}>思考中...</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 输入区域 */}
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: isDark ? colors.border : '#f3f4f6' }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={isRecording ? '正在录音...' : isRecognizing ? '识别中...' : '输入你的问题...'}
              placeholderTextColor={isRecording ? '#ef4444' : colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!loading && !isRecording && !isRecognizing}
            />
          </View>
          
          {/* 语音输入按钮 */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[
                styles.voiceButton, 
                { backgroundColor: isRecording ? '#ef4444' : isRecognizing ? '#f59e0b' : (isDark ? colors.border : '#f3f4f6') }
              ]}
              onPress={() => {
                if (isRecording) {
                  stopRecording();
                } else if (!isRecognizing && !loading) {
                  startRecording();
                }
              }}
              disabled={loading || isRecognizing}
            >
              {isRecognizing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : isRecording ? (
                <MicOff size={20} color="#fff" />
              ) : (
                <Mic size={20} color={isDark ? colors.textMuted : '#6b7280'} />
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* 停止朗读按钮（朗读时显示） */}
          {isSpeaking && (
            <TouchableOpacity
              style={[styles.stopButton]}
              onPress={stopSpeaking}
            >
              <VolumeX size={20} color="#fff" />
            </TouchableOpacity>
          )}

          {/* 发送按钮 */}
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading || isRecording || isRecognizing) && styles.sendButtonDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || loading || isRecording || isRecognizing}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  headerCenter: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  speakButton: { padding: 8, marginRight: 4 },
  clearButton: { padding: 8 },
  chatContainer: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 20 },
  welcomeContainer: { alignItems: 'center', paddingVertical: 40 },
  welcomeIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  welcomeTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  welcomeDesc: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },
  quickQuestions: { marginTop: 32, width: '100%' },
  quickTitle: { fontSize: 12, marginBottom: 12, textAlign: 'center' },
  quickButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  quickText: { fontSize: 14 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAssistant: { justifyContent: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarUser: { backgroundColor: '#3b82f6', marginLeft: 8 },
  avatarAssistant: { backgroundColor: '#10b981', marginRight: 8 },
  messageBubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAssistant: { borderBottomLeftRadius: 4, borderWidth: 1 },
  messageText: { fontSize: 15, lineHeight: 22 },
  textUser: { color: '#fff' },
  speakHint: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, opacity: 0.6 },
  speakHintText: { fontSize: 10 },
  loadingDots: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, gap: 8 },
  inputWrapper: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 120 },
  input: { fontSize: 15, maxHeight: 100 },
  voiceButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  stopButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { backgroundColor: '#9ca3af' },
});

export default AiChat;
