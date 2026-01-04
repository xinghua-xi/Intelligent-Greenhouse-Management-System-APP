import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { ChevronLeft, ChevronDown, ChevronUp, MessageCircle, Phone, Mail, FileText, Send } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const Help: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [expandedFaq, setExpandedFaq] = useState<string | null>('1');
  const [feedback, setFeedback] = useState('');

  const faqs = [
    { id: '1', question: '如何添加新的大棚？', answer: '进入"大棚"页面，点击右上角的"+"按钮，按照提示填写大棚信息并绑定传感器设备即可完成添加。' },
    { id: '2', question: '离线模式下数据会丢失吗？', answer: '不会。离线模式下采集的数据会保存在本地，待网络恢复后自动同步到云端。您也可以在"数据采集"页面手动触发同步。' },
    { id: '3', question: '如何查看历史数据？', answer: '在"总览"页面点击任意数据卡片，即可查看该指标的历史趋势图表。您也可以在"数据溯源"中查看完整的生产记录。' },
    { id: '4', question: 'AI诊断功能如何使用？', answer: '进入"智能"页面，选择"病害识别"标签，点击拍照按钮对准作物叶片拍摄，AI会自动分析并给出诊断结果和防治建议。' },
    { id: '5', question: '如何修改告警阈值？', answer: '进入"系统设置" > "告警设置"，可以自定义各项环境指标的告警阈值，系统会在超出范围时自动推送通知。' },
  ];

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('提示', '请输入反馈内容');
      return;
    }
    Alert.alert('感谢反馈', '我们已收到您的反馈，会尽快处理！', [
      { text: '确定', onPress: () => setFeedback('') }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={[styles.headerSafeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>帮助与反馈</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>常见问题</Text>
        <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={faq.id}
              style={[styles.faqItem, index < faqs.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                {expandedFaq === faq.id ? (
                  <ChevronUp size={18} color={colors.textMuted} />
                ) : (
                  <ChevronDown size={18} color={colors.textMuted} />
                )}
              </View>
              {expandedFaq === faq.id && (
                <Text style={[styles.faqAnswer, { color: colors.textMuted }]}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>联系我们</Text>
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: isDark ? colors.border : '#ecfdf5' }]}>
              <Phone size={18} color="#059669" />
            </View>
            <View style={styles.contactContent}>
              <Text style={[styles.contactLabel, { color: colors.textMuted }]}>客服热线</Text>
              <Text style={[styles.contactValue, { color: colors.text }]}>400-888-9999</Text>
            </View>
          </View>
          <View style={[styles.contactDivider, { backgroundColor: colors.border }]} />
          <View style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: isDark ? colors.border : '#dbeafe' }]}>
              <Mail size={18} color="#3b82f6" />
            </View>
            <View style={styles.contactContent}>
              <Text style={[styles.contactLabel, { color: colors.textMuted }]}>邮箱</Text>
              <Text style={[styles.contactValue, { color: colors.text }]}>support@luzhiyunpeng.com</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>意见反馈</Text>
        <View style={[styles.feedbackCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.feedbackInput, { backgroundColor: isDark ? colors.border : '#f9fafb', color: colors.text }]}
            placeholder="请描述您遇到的问题或建议..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback} activeOpacity={0.8}>
            <Send size={16} color="#fff" />
            <Text style={styles.submitText}>提交反馈</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.docCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FileText size={20} color={colors.textMuted} />
          <View style={styles.docContent}>
            <Text style={[styles.docTitle, { color: colors.text }]}>使用手册</Text>
            <Text style={[styles.docDesc, { color: colors.textMuted }]}>查看完整的产品使用说明</Text>
          </View>
          <ChevronLeft size={18} color={colors.textMuted} style={{ transform: [{ rotate: '180deg' }] }} />
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
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  faqCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginBottom: 24 },
  faqItem: { padding: 16 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '500', flex: 1, marginRight: 12 },
  faqAnswer: { fontSize: 13, lineHeight: 20, marginTop: 12 },
  contactCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 24 },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  contactContent: { flex: 1 },
  contactLabel: { fontSize: 12 },
  contactValue: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  contactDivider: { height: 1, marginVertical: 12 },
  feedbackCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 24 },
  feedbackInput: { borderRadius: 12, padding: 12, fontSize: 14, height: 100, marginBottom: 12 },
  submitButton: { backgroundColor: '#059669', borderRadius: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  docCard: { borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  docContent: { flex: 1 },
  docTitle: { fontSize: 14, fontWeight: 'bold' },
  docDesc: { fontSize: 12, marginTop: 2 },
});

export default Help;
