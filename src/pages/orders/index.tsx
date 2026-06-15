import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import OrderCard from '@/components/OrderCard';
import EmptyState from '@/components/EmptyState';
import { orderStatusNames } from '@/data/orders';
import { useOrderStore, now } from '@/store/orderStore';
import { Order, OrderStatus, TabKey, UrgencyLevel } from '@/types';

const TAB_LIST: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'making', label: '扎制中' },
  { key: 'delivering', label: '配送中' },
  { key: 'delivered', label: '已完成' }
];

const URGENCY_FILTERS: { key: UrgencyLevel | 'all'; label: string }[] = [
  { key: 'all', label: '全部级别' },
  { key: 'super_urgent', label: '特急' },
  { key: 'urgent', label: '加急' },
  { key: 'normal', label: '普通' }
];

const OrdersPage: React.FC = () => {
  const orders = useOrderStore(s => s.orders);
  const updateOrderStatus = useOrderStore(s => s.updateOrderStatus);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useDidShow(() => {
  });

  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      making: orders.filter(o => o.status === 'making').length,
      delivering: orders.filter(o => o.status === 'delivering').length
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchTab = activeTab === 'all' || order.status === activeTab;
      const matchUrgency = urgencyFilter === 'all' || order.urgency === urgencyFilter;
      return matchTab && matchUrgency;
    }).sort((a, b) => {
      const urgencyOrder = { super_urgent: 0, urgent: 1, normal: 2 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, activeTab, urgencyFilter]);

  const handleAction = (action: string, order: Order) => {
    console.log('[Orders] handleAction', { action, orderId: order.id });

    switch (action) {
      case 'confirm':
        updateOrderStatus(order.id, 'confirmed');
        Taro.showToast({ title: '订单已确认', icon: 'success' });
        break;
      case 'cancel':
        Taro.showModal({
          title: '确认取消订单？',
          content: '取消后将无法恢复，确定吗？',
          confirmColor: '#B4272C',
          success: (res) => {
            if (res.confirm) {
              updateOrderStatus(order.id, 'cancelled');
              Taro.showToast({ title: '已取消', icon: 'success' });
            }
          }
        });
        break;
      case 'dispatch':
        Taro.navigateTo({ url: `/pages/dispatch/index?id=${order.id}` });
        break;
      case 'progress':
        Taro.navigateTo({ url: `/pages/dispatch/index?id=${order.id}` });
        break;
      case 'arrange_delivery':
        Taro.navigateTo({ url: `/pages/delivery-detail/index?id=${order.id}` });
        break;
      case 'track':
        Taro.navigateTo({ url: `/pages/delivery-detail/index?id=${order.id}` });
        break;
      case 'refund':
        Taro.navigateTo({ url: `/pages/refund/index?id=${order.id}` });
        break;
      case 'detail':
      default:
        Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` });
    }
  };

  const handleCreateOrder = () => {
    Taro.navigateTo({ url: '/pages/order-create/index' });
    console.log('[Orders] handleCreateOrder');
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
          Taro.showToast({ title: '刷新成功', icon: 'success' });
        }, 1000);
      }}
    >
      <View className={styles.header}>
        <View className={styles.topBar}>
          <Text className={styles.title}>订单管理</Text>
        </View>

        <View className={styles.statGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.total}</Text>
            <Text className={styles.statLabel}>今日订单</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.making}</Text>
            <Text className={styles.statLabel}>扎制中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.delivering}</Text>
            <Text className={styles.statLabel}>配送中</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.tabBar}>
          {TAB_LIST.map(tab => (
            <View
              key={tab.key}
              className={`${styles.tabItem} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.urgencyFilter}>
          {URGENCY_FILTERS.map(filter => (
            <View
              key={filter.key}
              className={`${styles.filterChip} ${urgencyFilter === filter.key ? styles.active : ''}`}
              onClick={() => setUrgencyFilter(filter.key)}
            >
              <Text>{filter.label}</Text>
            </View>
          ))}
        </View>

        {filteredOrders.length === 0 ? (
          <EmptyState
            text="暂无订单"
            subText="试试切换筛选条件查看"
          />
        ) : (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={handleAction}
            />
          ))
        )}
      </View>

      <Button className={styles.createBtn} onClick={handleCreateOrder}>
        +
      </Button>
    </ScrollView>
  );
};

export default OrdersPage;
