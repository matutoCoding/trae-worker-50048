import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export type StatCardTheme = 'green' | 'gold' | 'red' | 'blue';

interface StatCardProps {
  label: string;
  value: string | number;
  extra?: string;
  theme?: StatCardTheme;
  diff?: {
    value: string;
    type: 'up' | 'down';
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  extra,
  theme = 'green',
  diff,
  onClick
}) => {
  return (
    <View className={styles.statCard} onClick={onClick}>
      <View className={classnames(styles.topBar, styles[theme])}></View>
      <Text className={styles.label}>{label}</Text>
      <Text className={styles.value}>{value}</Text>
      {extra && <Text className={styles.extra}>{extra}</Text>}
      {diff && (
        <View className={styles.row}>
          <View className={classnames(
            styles.diff,
            diff.type === 'up' ? styles.diffUp : styles.diffDown
          )}>
            <Text>{diff.type === 'up' ? '↑' : '↓'} {diff.value}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default StatCard;
