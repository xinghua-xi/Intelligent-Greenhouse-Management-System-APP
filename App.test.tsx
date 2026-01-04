import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function AppTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>智农云</Text>
      <Text style={styles.subtitle}>让农业更懂生活</Text>

      <Text style={styles.label}>账号</Text>
      <TextInput
        style={styles.input}
        placeholder="admin"
        defaultValue="admin"
      />

      <Text style={styles.label}>密码</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="请输入密码"
        defaultValue="123456"
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>立即登录</Text>
      </Pressable>

      <Text style={styles.copyright}>© 2024 SmartGreenhouse Tech</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ecfdf5', // emerald-50
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937', // gray-800
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280', // gray-500
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
    backgroundColor: '#f9fafb', // gray-50
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#059669', // emerald-600
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  copyright: {
    fontSize: 12,
    color: '#9ca3af', // gray-400
    textAlign: 'center',
    marginTop: 32,
  },
});

