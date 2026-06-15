import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onAction }) => {
  return (
    <View className={styles.sectionHeader}>
      <View className={styles.title}>
        <View className={styles.titleBar}></View>
        <Text>{title}</Text>
      </View>
      {actionText && (
        <View
          className={styles.action} onClick={() => onAction?.()}>
          <Text>{actionText}</Text>
          <Text className={styles.arrow}>›</Text>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;
