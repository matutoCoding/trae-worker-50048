import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import { monthlySettlement, orders } from '@/data/orders';
import { categoryNames } from '@/data/styles';

const SettlementPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('2026年06月');

  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '已更新', icon: 'success' });
    }, 1000);
  });

  const settlement = monthlySettlement;

  const maxRevenue = useMemo(() =>
    Math.max(...settlement.dailyStats.map(s => s.revenue)),
    [settlement]
  );

  const maxCategoryRevenue = useMemo(() =>
    Math.max(...settlement.byCategory.map(c => c.revenue)),
    [settlement]
  );

  const refundOrders = useMemo(() =>
    orders.filter(o => o.refund),
    []
  );

  const handleExport = () => {
    console.log('[Settlement] handleExport');
    Taro.showModal({
      title: '导出对账单',
      content: `将导出${currentMonth}的对账单，是否继续？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '生成中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '已生成对账单', icon: 'success' });
          }, 1500);
        }
      }
    });
  };

  const handleViewDetail = () => {
    console.log('[Settlement] handleViewDetail');
    Taro.showToast({ title: '查看账单明细', icon: 'none' });
  };

  const handleRefundClick = (orderId: string) => {
    console.log('[Settlement] handleRefundClick', { orderId });
    Taro.navigateTo({ url: `/pages/refund/index?id=${orderId}` });
  };

  const formatMoney = (val: number) =>
    val.toLocaleString('zh-CN', { minimumFractionDigits: 0 });

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
        <Text className={styles.title}>对账结算</Text>

        <View
          className={styles.monthSelector}
          onClick={() => Taro.showToast({ title: '选择月份', icon: 'none' })}
        >
          <Text className={styles.monthText}>{currentMonth}</Text>
          <Text className={styles.monthArrow}>▼</Text>
        </View>

        <View className={styles.revenueCard}>
          <Text className={styles.revenueLabel}>本月净收入</Text>
          <Text className={styles.revenueValue}>¥{formatMoney(settlement.netRevenue)}</Text>
          <View className={styles.revenueSub}>
            <Text className={styles.revenueSubItem}>
              总收入
              <Text className={styles.subValue}>¥{formatMoney(settlement.totalRevenue)}</Text>
            </Text>
            <Text className={styles.revenueSubItem}>
              退款
              <Text className={styles.subValue}>-¥{formatMoney(settlement.totalRefund)}</Text>
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statsGrid}>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>{settlement.totalOrders}</Text>
            <Text className={styles.statsLabel}>总订单</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>
              {settlement.dailyStats.reduce((s, d) => s + d.deliveredCount, 0)}
            </Text>
            <Text className={styles.statsLabel}>已送达</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>
              {settlement.dailyStats.reduce((s, d) => s + d.urgentCount, 0)}
            </Text>
            <Text className={styles.statsLabel}>加急单</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>
              {refundOrders.length}
            </Text>
            <Text className={styles.statsLabel}>退款单</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <SectionHeader
            title="每日收入趋势"
            actionText="近7天"
          />
          <View className={styles.chartSection}>
            <View className={styles.bars}>
              {settlement.dailyStats.map(stat => {
                const height = maxRevenue > 0 ? (stat.revenue / maxRevenue) * 180 + 16 : 16;
                return (
                  <View key={stat.date} className={styles.barWrap}>
                    <View style={{ height: `${height}rpx` }} className={styles.bar}>
                      <Text className={styles.barValue}>
                        {stat.revenue >= 1000 ? `${(stat.revenue / 1000).toFixed(1)}k` : stat.revenue}
                      </Text>
                    </View>
                    <Text className={styles.barLabel}>{stat.date.slice(3)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <SectionHeader title="分类收入占比" />
          <View className={styles.categoryList}>
            {settlement.byCategory.map(cat => (
              <View key={cat.category} className={styles.categoryItem}>
                <View className={styles.catIcon}>
                  {cat.category === 'wreath' && '🌸'}
                  {cat.category === 'basket' && '💐'}
                  {cat.category === 'stand' && '🎋'}
                  {cat.category === 'bouquet' && '🌹'}
                  {cat.category === 'arrangement' && '🏛️'}
                </View>
                <View className={styles.catInfo}>
                  <View className={styles.catName}>
                    <Text>{categoryNames[cat.category]}</Text>
                    <Text className={styles.catCount}>{cat.count}单</Text>
                  </View>
                  <View className={styles.catBar}>
                    <View
                      className={styles.catBarFill}
                      style={{ width: `${maxCategoryRevenue > 0 ? (cat.revenue / maxCategoryRevenue) * 100 : 0}%` }}
                    />
                  </View>
                </View>
                <Text className={styles.catAmount}>¥{formatMoney(cat.revenue)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <SectionHeader
            title="殡仪馆业绩"
            actionText="查看全部"
            onAction={() => Taro.showToast({ title: '殡仪馆业绩详情', icon: 'none' })}
          />
          <View className={styles.categoryList}>
            {settlement.byFuneralHome.map(home => (
              <View key={home.name} className={styles.categoryItem}>
                <View className={styles.catIcon}>🏛️</View>
                <View className={styles.catInfo}>
                  <View className={styles.catName}>
                    <Text>{home.name}</Text>
                    <Text className={styles.catCount}>{home.count}单</Text>
                  </View>
                </View>
                <Text className={styles.catAmount}>¥{formatMoney(home.revenue)}</Text>
              </View>
            ))}
          </View>
        </View>

        {refundOrders.length > 0 && (
          <View className={styles.sectionCard}>
            <SectionHeader
              title="退款记录"
              actionText={`共${refundOrders.length}笔`}
            />
            <View className={styles.refundSection}>
              {refundOrders.map(order => (
                <View
                  key={order.id}
                  className={styles.refundItem}
                  onClick={() => handleRefundClick(order.id)}
                >
                  <View className={styles.refundIcon}>↩</View>
                  <View className={styles.refundInfo}>
                    <View className={styles.refundOrder}>
                      订单 {order.orderNo}
                      <View
                        className={classnames(
                          styles.statusTag,
                          order.refund?.status === 'completed' ? styles.statusCompleted : styles.statusPending
                        )}
                      >
                        {order.refund?.status === 'completed' ? '已退款' : '处理中'}
                      </View>
                    </View>
                    <Text className={styles.refundReason}>{order.refund?.reason}</Text>
                  </View>
                  <Text className={styles.refundAmount}>-¥{order.refund?.refundAmount}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.bottomActions}>
          <Button className={classnames(styles.actionBtn, styles.ghostAction)} onClick={handleViewDetail}>
            账单明细
          </Button>
          <Button className={classnames(styles.actionBtn, styles.primaryAction)} onClick={handleExport}>
            导出对账单
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettlementPage;
