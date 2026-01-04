import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Sprout, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppRoute } from '../types';
import { authApi } from '../services/api';
import { useAppMode } from '../context/AppModeContext';

const STORAGE_KEY_USERNAME = '@login_username';
const STORAGE_KEY_PASSWORD = '@login_password';
const STORAGE_KEY_REMEMBER = '@login_remember';

const Login: React.FC = () => {
  const navigation = useNavigation<any>();
  const { setMode } = useAppMode();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // 加载保存的登录信息
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedRemember = await AsyncStorage.getItem(STORAGE_KEY_REMEMBER);
      if (savedRemember === 'true') {
        const savedUsername = await AsyncStorage.getItem(STORAGE_KEY_USERNAME);
        const savedPassword = await AsyncStorage.getItem(STORAGE_KEY_PASSWORD);
        if (savedUsername) setUsername(savedUsername);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('加载保存的登录信息失败:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEY_USERNAME, username);
        await AsyncStorage.setItem(STORAGE_KEY_PASSWORD, password);
        await AsyncStorage.setItem(STORAGE_KEY_REMEMBER, 'true');
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY_USERNAME);
        await AsyncStorage.removeItem(STORAGE_KEY_PASSWORD);
        await AsyncStorage.setItem(STORAGE_KEY_REMEMBER, 'false');
      }
    } catch (error) {
      console.log('保存登录信息失败:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // 调用登录 API
      const result = await authApi.login({ username, password });
      
      // 保存记住密码
      await saveCredentials();
      
      // 根据用户角色设置默认模式
      if (result.user.defaultMode) {
        const modeMap: Record<string, 'minimal' | 'standard' | 'expert'> = {
          'MINIMAL': 'minimal',
          'STANDARD': 'standard',
          'EXPERT': 'expert'
        };
        setMode(modeMap[result.user.defaultMode] || 'standard');
      }
      
      // 跳转到主页
      navigation.replace('Main');
    } catch (err: any) {
      console.error('登录失败:', err);
      const errorMsg = err.message || '登录失败';
      setError(errorMsg);
      
      // 开发环境下提供跳过选项
      if (__DEV__) {
        Alert.alert(
          '登录失败',
          `${errorMsg}\n\n是否使用开发模式跳过登录？`,
          [
            { text: '取消', style: 'cancel' },
            { 
              text: '跳过登录', 
              onPress: async () => {
                await saveCredentials();
                navigation.replace('Main');
              }
            }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate(AppRoute.FORGOT_PASSWORD);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Sprout size={32} color="white" />
            </View>
            <Text style={styles.title}>绿智云棚</Text>
            <Text style={styles.subtitle}>智慧农业 绿色未来</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>账号</Text>
              <TextInput 
                style={styles.input}
                placeholder="请输入管理员账号"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>密码</Text>
              <TextInput 
                style={styles.input}
                placeholder="请输入密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.options}>
              <TouchableOpacity style={styles.rememberMe} onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Check size={12} color="#fff" strokeWidth={3} />}
                </View>
                <Text style={styles.rememberText}>记住密码</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>忘记密码?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>立即登录</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.copyright}>© 2024 绿智云棚科技</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5', // emerald-50
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#059669', // emerald-600
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937', // gray-800
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280', // gray-500
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280', // gray-500
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    backgroundColor: '#f9fafb', // gray-50
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  rememberText: {
    fontSize: 12,
    color: '#6b7280', // gray-500
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669', // emerald-600
  },
  button: {
    width: '100%',
    backgroundColor: '#059669', // emerald-600
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  copyright: {
    marginTop: 32,
    fontSize: 12,
    color: '#9ca3af', // gray-400
    textAlign: 'center',
  },
});

export default Login;
