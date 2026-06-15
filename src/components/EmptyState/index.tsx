import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  text?: string;
  subText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  text = '暂无数据',
  subText
}) => {
  return (
    <View className={styles.emptyState}>
      <View className={styles.icon}>
        <svg viewBox="0 0 200 200" width="200" height="200">
          <circle cx="100" cy="100" r="80" fill="#F0EDE7" />
          <path d="M70 90 Q100 70, 130 90 Q130 120, 100 140 Q70 120, 70 90 Z" fill="#E5E6EB" />
          <circle cx="85" cy="100" r="4" fill="#C9CDD4" />
          <circle cx="115" cy="100" r="4" fill="#C9CDD4" />
          <path d="M90 118 Q100 125, 110 118" fill="none" stroke="#C9CDD4" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </View>
      <Text className={styles.text}>{text}</Text>
      {subText && <Text className={styles.subText}>{subText}</Text>}
    </View>
  );
};

export default EmptyState;
