import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Mail, KeyRound, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Step = 'email' | 'code' | 'reset' | 'success';

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = () => {
    if (!email.trim()) {
      Alert.alert('提示', '请输入邮箱地址');
      return;
    }
    setLoading(true);
    // 模拟发送验证码
    setTimeout(() => {
      setLoading(false);
      startCountdown();
      setStep('code');
      Alert.alert('提示', '验证码已发送到您的邮箱');
    }, 1000);
  };

  const handleVerifyCode = () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }
    setLoading(true);
    // 模拟验证
    setTimeout(() => {
      setLoading(false);
      setStep('reset');
    }, 1000);
  };

  const handleResetPassword = () => {
    if (!newPassword.trim()) {
      Alert.alert('提示', '请输入新密码');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('提示', '密码长度至少6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }
    setLoading(true);
    // 模拟重置密码
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1000);
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const renderEmailStep = () => (
    <>
      <View style={styles.iconWrapper}>
        <Mail size={32} color="#059669" />
      </View>
      <Text style={styles.stepTitle}>找回密码</Text>
      <Text style={styles.stepDesc}>请输入您注册时使用的邮箱地址，我们将发送验证码到您的邮箱</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>邮箱地址</Text>
        <TextInput 
          style={styles.input}
          placeholder="请输入邮箱地址"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        onPress={handleSendCode}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>发送验证码</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderCodeStep = () => (
    <>
      <View style={styles.iconWrapper}>
        <ShieldCheck size={32} color="#059669" />
      </View>
      <Text style={styles.stepTitle}>输入验证码</Text>
      <Text style={styles.stepDesc}>验证码已发送至 {email}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>验证码</Text>
        <TextInput 
          style={styles.input}
          placeholder="请输入6位验证码"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />
      </View>

      <TouchableOpacity 
        onPress={countdown > 0 ? undefined : handleSendCode}
        disabled={countdown > 0}
        style={styles.resendButton}
      >
        <Text style={[styles.resendText, countdown > 0 && styles.resendTextDisabled]}>
          {countdown > 0 ? `${countdown}秒后重新发送` : '重新发送验证码'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleVerifyCode}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>验证</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderResetStep = () => (
    <>
      <View style={styles.iconWrapper}>
        <KeyRound size={32} color="#059669" />
      </View>
      <Text style={styles.stepTitle}>设置新密码</Text>
      <Text style={styles.stepDesc}>请设置您的新密码，密码长度至少6位</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>新密码</Text>
        <TextInput 
          style={styles.input}
          placeholder="请输入新密码"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>确认密码</Text>
        <TextInput 
          style={styles.input}
          placeholder="请再次输入新密码"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        onPress={handleResetPassword}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>重置密码</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <View style={[styles.iconWrapper, styles.successIcon]}>
        <ShieldCheck size={32} color="#fff" />
      </View>
      <Text style={styles.stepTitle}>密码重置成功</Text>
      <Text style={styles.stepDesc}>您的密码已成功重置，请使用新密码登录</Text>

      <TouchableOpacity 
        onPress={handleBackToLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>返回登录</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {step !== 'success' && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          {step === 'email' && renderEmailStep()}
          {step === 'code' && renderCodeStep()}
          {step === 'reset' && renderResetStep()}
          {step === 'success' && renderSuccessStep()}
        </View>

        {step !== 'success' && (
          <View style={styles.stepsIndicator}>
            <View style={[styles.stepDot, step === 'email' && styles.stepDotActive]} />
            <View style={styles.stepLine} />
            <View style={[styles.stepDot, step === 'code' && styles.stepDotActive]} />
            <View style={styles.stepLine} />
            <View style={[styles.stepDot, step === 'reset' && styles.stepDotActive]} />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  successIcon: {
    backgroundColor: '#059669',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#9ca3af',
  },
  stepsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d1d5db',
  },
  stepDotActive: {
    backgroundColor: '#059669',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
});

export default ForgotPassword;
