import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusTag from '@/components/StatusTag';
import { Order } from '@/types';
import { orderStatusNames, urgencyNames } from '@/data/orders';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  onAction?: (action: string, order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, showActions = true, onAction }) => {
  const renderActions = () => {
    if (!showActions) return null;

    const actions: { key: string; label: string; type: 'primary' | 'ghost' }[] = [];

    switch (order.status) {
      case 'pending':
        actions.push({ key: 'confirm', label: '确认订单', type: 'primary' });
        actions.push({ key: 'cancel', label: '取消', type: 'ghost' });
        break;
      case 'confirmed':
        actions.push({ key: 'dispatch', label: '派工扎制', type: 'primary' });
        actions.push({ key: 'detail', label: '详情', type: 'ghost' });
        break;
      case 'making':
        actions.push({ key: 'progress', label: '查看进度', type: 'primary' });
        actions.push({ key: 'detail', label: '详情', type: 'ghost' });
        break;
      case 'completed':
        actions.push({ key: 'arrange_delivery', label: '安排配送', type: 'primary' });
        actions.push({ key: 'detail', label: '详情', type: 'ghost' });
        break;
      case 'delivering':
        actions.push({ key: 'track', label: '跟踪配送', type: 'primary' });
        break;
      case 'delivered':
        actions.push({ key: 'refund', label: '售后', type: 'ghost' });
        actions.push({ key: 'detail', label: '详情', type: 'primary' });
        break;
      case 'cancelled':
      case 'refunded':
        actions.push({ key: 'detail', label: '详情', type: 'primary' });
        break;
      default:
        actions.push({ key: 'detail', label: '详情', type: 'primary' });
    }

    return (
      <View className={styles.actions}>
        {actions.map(action => (
          <Button
            key={action.key}
            className={classnames(
              styles.actionBtn,
              action.type === 'primary' ? styles.primaryBtn : styles.ghostBtn
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(action.key, order);
            }}
          >
            {action.label}
          </Button>
        ))}
      </View>
    );
  };

  return (
    <View
      className={styles.orderCard}
      onClick={() => {
        Taro.navigateTo({
          url: `/pages/order-detail/index?id=${order.id}`
        });
      }}
    >
      <View className={styles.cardHeader}>
        <View className={styles.leftInfo}>
          <Text className={styles.orderNo}>订单号 {order.orderNo}</Text>
          <View className={styles.tagsRow}>
            <StatusTag type="order" status={order.status}>
              {orderStatusNames[order.status]}
            </StatusTag>
            {order.urgency !== 'normal' && (
              <StatusTag type="urgency" status={order.urgency}>
                {urgencyNames[order.urgency]}
              </StatusTag>
            )}
            {order.arrangementRequired && (
              <View style={{
                fontSize: '22rpx',
                padding: '4rpx 12rpx',
                borderRadius: '8rpx',
                background: 'rgba(45, 90, 75, 0.1)',
                color: '#2D5A4B'
              }}>含布置</View>
            )}
          </View>
        </View>
        <View className={styles.rightInfo}>
          <Text className={styles.time}>{order.createdAt.slice(5, 16)}</Text>
        </View>
      </View>

      <View className={styles.stylesSection}>
        {order.styles.slice(0, 2).map((style, idx) => (
          <View key={idx} className={styles.styleItem}>
            <Image
              src={style.styleImage}
              className={styles.styleImage}
              mode="aspectFill"
            />
            <View className={styles.styleInfo}>
              <Text className={styles.styleName}>{style.styleName}</Text>
              <View className={styles.styleMeta}>
                <Text className={styles.stylePrice}>¥{style.unitPrice}</Text>
                <Text className={styles.styleQty}>x{style.quantity}</Text>
              </View>
            </View>
          </View>
        ))}
        {order.styles.length > 2 && (
          <View style={{
            alignSelf: 'center',
            color: '#8A9099',
            fontSize: '24rpx',
            padding: '0 16rpx'
          }}>
            +{order.styles.length - 2}项
          </View>
        )}
      </View>

      <View className={styles.infoSection}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>殡仪馆</Text>
          <Text className={styles.infoValue}>
            {order.address.funeralHome} · {order.address.funeralHall}
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>配送时间</Text>
          <Text className={styles.infoValue}>
            {order.address.deliveryDate} {order.address.deliveryTime}
          </Text>
        </View>
        {order.couplet && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>逝者</Text>
            <Text className={styles.infoValue}>{order.couplet.decedentsName}</Text>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        <View className={styles.totalAmount}>
          合计
          <Text className={styles.amountValue}>¥{order.totalAmount}</Text>
        </View>
        {renderActions()}
      </View>
    </View>
  );
};

export default OrderCard;
