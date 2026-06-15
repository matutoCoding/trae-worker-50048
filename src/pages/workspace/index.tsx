import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import { orders } from '@/data/orders';
import { workers, skillLevelNames, workerStatusNames } from '@/data/workers';
import { categoryNames } from '@/data/styles';
import { Order } from '@/types';

const QUICK_ACTIONS = [
  { icon: '⚡', label: '挽联定制', url: '/pages/couplet/index' },
  { icon: '👤', label: '派工调度', url: '' },
  { icon: '🎋', label: '布置登记', url: '/pages/arrangement/index' },
  { icon: '📋', label: '殡仪馆', url: '' }
];

const WorkspacePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const todayTasks = useMemo(() => {
    return orders
      .filter(o => ['pending', 'confirmed', 'making', 'completed', 'delivering'].includes(o.status))
      .sort((a, b) => {
        const urgencyOrder = { super_urgent: 0, urgent: 1, normal: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      })
      .slice(0, 5);
  }, []);

  const todayStats = useMemo(() => {
    const today = orders.filter(o => o.createdAt.startsWith('2026-06-15'));
    return {
      newOrder: today.length,
      making: today.filter(o => o.status === 'making').length,
      delivered: today.filter(o => o.status === 'delivered').length,
      urgent: today.filter(o => o.urgency !== 'normal').length
    };
  }, []);

  const handleQuickAction = (item: typeof QUICK_ACTIONS[number]) => {
    console.log('[Workspace] handleQuickAction', { label: item.label });
    if (item.url) {
      Taro.navigateTo({ url: item.url });
    } else {
      Taro.showToast({ title: `${item.label}功能`, icon: 'none' });
    }
  };

  const handleTaskClick = (order: Order) => {
    console.log('[Workspace] handleTaskClick', { orderId: order.id });
    if (order.dispatchTasks.length > 0) {
      Taro.navigateTo({ url: `/pages/dispatch/index?id=${order.id}` });
    } else {
      Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` });
    }
  };

  const getUrgencyText = (level: string) => {
    switch (level) {
      case 'super_urgent': return '特急';
      case 'urgent': return '加急';
      default: return '';
    }
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
      }}
    >
      <View className={styles.header}>
        <Text className={styles.title}>工作台</Text>

        <View className={styles.quickActions}>
          {QUICK_ACTIONS.map(item => (
            <View
              key={item.label}
              className={styles.quickItem}
              onClick={() => handleQuickAction(item)}
            >
              <View className={styles.quickIcon}>{item.icon}</View>
              <Text className={styles.quickLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsRow}>
          <StatCard
            label="今日新增订单"
            value={todayStats.newOrder}
            theme="green"
            diff={{ value: '12%', type: 'up' }}
          />
          <StatCard
            label="扎制中"
            value={todayStats.making}
            theme="gold"
            extra={`${workers.filter(w => w.status === 'working').length}位师傅`}
          />
          <StatCard
            label="已送达"
            value={todayStats.delivered}
            theme="blue"
          />
          <StatCard
            label="加急订单"
            value={todayStats.urgent}
            theme="red"
            extra="优先处理"
          />
        </View>

        <View className={styles.taskSection}>
          <SectionHeader
            title="今日待办任务"
            actionText="查看全部"
            onAction={() => Taro.switchTab({ url: '/pages/orders/index' })}
          />

          {todayTasks.length === 0 ? (
            <EmptyState text="暂无待办任务" subText="休息一下吧~" />
          ) : (
            todayTasks.map(order => (
              <View
                key={order.id}
                className={styles.taskItem}
                onClick={() => handleTaskClick(order)}
              >
                <View className={styles.taskAvatar}>
                  <Image src={order.styles[0].styleImage} mode="aspectFill" />
                </View>
                <View className={styles.taskInfo}>
                  <Text className={styles.taskTitle}>
                    {order.styles.map(s => s.styleName).join('、')}
                  </Text>
                  <Text className={styles.taskDesc}>
                    {order.address.funeralHome} · {order.address.funeralHall}
                  </Text>
                  <View className={styles.taskMeta}>
                    {order.urgency !== 'normal' && (
                      <View className={`${styles.taskBadge} ${styles.urgentBadge}`}>
                        {getUrgencyText(order.urgency)}
                      </View>
                    )}
                    <View className={`${styles.taskBadge} ${styles.timeBadge}`}>
                      {order.address.deliveryTime}送达
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View className={styles.workerStatus}>
          <SectionHeader
            title="扎制师傅状态"
            actionText={`共${workers.length}人`}
          />

          <View className={styles.workerList}>
            {workers.map(worker => (
              <View key={worker.id} className={styles.workerItem}>
                <View className={styles.workerAvatar}>
                  <Image src={worker.avatar} mode="aspectFill" />
                  <View className={`${styles.statusDot} ${
                    worker.status === 'working' ? styles.dotWorking :
                    worker.status === 'idle' ? styles.dotIdle : styles.dotOffline
                  }`}></View>
                </View>
                <View className={styles.workerInfo}>
                  <View className={styles.workerName}>
                    <Text>{worker.name}</Text>
                    <View className={styles.levelTag}>
                      {skillLevelNames[worker.skillLevel]}
                    </View>
                    {worker.specialty.slice(0, 2).map(cat => (
                      <View key={cat} className={styles.specialtyTag}>
                        {categoryNames[cat]}
                      </View>
                    ))}
                  </View>
                  <Text className={styles.workerTask}>
                    {workerStatusNames[worker.status]} · 今日 {worker.todayTasks} 个任务
                  </Text>
                </View>
                <Text className={styles.taskCount}>{worker.todayTasks}单</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WorkspacePage;
