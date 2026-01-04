/**
 * AI 问答悬浮按钮组件
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AppRoute } from '../types';

interface AiChatButtonProps {
  bottom?: number;
}

const AiChatButton: React.FC<AiChatButtonProps> = ({ bottom = 100 }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={[styles.floatingButton, { bottom }]}
      onPress={() => navigation.navigate(AppRoute.AI_CHAT)}
      activeOpacity={0.8}
    >
      <MessageCircle size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default AiChatButton;
