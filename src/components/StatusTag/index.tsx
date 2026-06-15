import React from 'react';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { OrderStatus, UrgencyLevel } from '@/types';

interface StatusTagProps {
  type: 'order' | 'urgency';
  status: OrderStatus | UrgencyLevel;
  text?: string;
  children?: React.ReactNode;
}

const statusClassMap: Record<OrderStatus, string> = {
  pending: styles.pending,
  confirmed: styles.confirmed,
  making: styles.making,
  completed: styles.completed,
  delivering: styles.delivering,
  delivered: styles.delivered,
  cancelled: styles.cancelled,
  refunding: styles.refunding,
  refunded: styles.refunded
};

const urgencyClassMap: Record<UrgencyLevel, string> = {
  normal: styles.normal,
  urgent: styles.urgent,
  super_urgent: styles.superUrgent
};

const StatusTag: React.FC<StatusTagProps> = ({ type, status, text, children }) => {
  const className = classnames(
    styles.statusTag,
    type === 'order' ? statusClassMap[status as OrderStatus] : urgencyClassMap[status as UrgencyLevel]
  );

  return <View className={className}>{children || text}</View>;
};

export default StatusTag;
