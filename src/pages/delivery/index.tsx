import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import { useOrderStore } from '@/store/orderStore';
import { deliveryStaffs, funeralHomes, cooperationNames } from '@/data/workers';
import { deliveryStatusNames } from '@/data/orders';
import { Order } from '@/types';

const TAB_LIST = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待配送' },
  { key: 'delivering', label: '配送中' },
  { key: 'delivered', label: '已完成' }
];

const DeliveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const orders = useOrderStore(s => s.orders);

  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const deliveryOrders = useMemo(() => {
    return orders.filter(o =>
      ['completed', 'delivering', 'delivered'].includes(o.status) || o.delivery
    ).map(o => ({
      order: o,
      deliveryStatus: o.delivery?.status || (o.status === 'delivered' ? 'delivered' : 'pending')
    }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return deliveryOrders.filter(item => {
      if (activeTab === 'all') return true;
      if (activeTab === 'delivering') return item.deliveryStatus === 'en_route' || item.deliveryStatus === 'arrived' || item.order.status === 'delivering';
      if (activeTab === 'pending') return item.deliveryStatus === 'pending' || item.deliveryStatus === 'picked';
      if (activeTab === 'delivered') return item.deliveryStatus === 'delivered' || item.order.status === 'delivered';
      return true;
    });
  }, [deliveryOrders, activeTab]);

  const driverStats = useMemo(() => ({
    working: deliveryStaffs.filter(d => d.status === 'delivering').length,
    idle: deliveryStaffs.filter(d => d.status === 'idle').length,
    today: deliveryStaffs.reduce((sum, d) => sum + d.todayDeliveries, 0)
  }), []);

  const getDriverByOrder = (order: Order) => {
    if (!order.delivery) return null;
    return deliveryStaffs.find(d => d.id === order.delivery!.staffId) || deliveryStaffs[0];
  };

  const getStatusClass = (status: string) => {
    if (status === 'en_route' || status === 'arrived') return styles.statusEnRoute;
    if (status === 'delivered') return styles.statusDelivered;
    return styles.statusPending;
  };

  const handleCall = (phone: string) => {
    console.log('[Delivery] handleCall', { phone });
    Taro.makePhoneCall({ phoneNumber: phone.replace(/\*/g, '1') }).catch(err => {
      console.error('[Delivery] 拨号失败', err);
      Taro.showToast({ title: '拨号功能', icon: 'none' });
    });
  };

  const handleCardClick = (order: Order) => {
    console.log('[Delivery] handleCardClick', { orderId: order.id });
    Taro.navigateTo({ url: `/pages/delivery-detail/index?id=${order.id}` });
  };

  const renderTimeline = (item: { order: Order; deliveryStatus: string }) => {
    const { order, deliveryStatus } = item;
    const timeline = [
      { label: '扎制完成', time: order.dispatchTasks.find(t => t.completedAt)?.completedAt?.slice(11, 16) || '—', active: ['making', 'completed', 'delivering', 'delivered'].includes(order.status) },
      { label: '已取货', time: deliveryStatus === 'picked' ? '10:15' : deliveryStatus === 'en_route' || deliveryStatus === 'arrived' || deliveryStatus === 'delivered' ? '10:15' : '—', active: ['picked', 'en_route', 'arrived', 'delivered'].includes(deliveryStatus) || order.status === 'delivered' },
      { label: '配送中', time: deliveryStatus === 'en_route' ? '进行中' : deliveryStatus === 'arrived' || deliveryStatus === 'delivered' ? order.delivery?.estimatedArrival?.slice(11, 16) : '—', active: ['en_route', 'arrived', 'delivered'].includes(deliveryStatus) || order.status === 'delivering' },
      { label: '已送达', time: deliveryStatus === 'delivered' ? order.delivery?.signedAt : '—', active: deliveryStatus === 'delivered' || order.status === 'delivered' }
    ];

    return (
      <View className={styles.timeline}>
        <Text className={styles.timelineTitle}>配送进度</Text>
        {timeline.map((step, idx) => (
          <View key={idx} className={styles.timelineItem}>
            <View className={classnames(styles.timelineDot, step.active && styles.active)}></View>
            {idx < timeline.length - 1 && <View className={styles.timelineLine}></View>}
            <View className={styles.timelineContent}>
              <Text className={classnames(styles.timelineLabel, step.active && styles.active)}>
                {step.label}
              </Text>
              <Text className={styles.timelineTime}>{step.time}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderSignInfo = (item: { order: Order; deliveryStatus: string }) => {
    const { order, deliveryStatus } = item;
    const isDelivered = deliveryStatus === 'delivered' || order.status === 'delivered';
    if (!isDelivered) return null;

    const signedBy = order.delivery?.signedBy || order.address.contactName;
    const signedAt = order.delivery?.signedAt;

    return (
      <View className={styles.signInfo}>
        <View className={styles.signRow}>
          <Text className={styles.signLabel}>签收人</Text>
          <Text className={styles.signValue}>{signedBy}</Text>
        </View>
        <View className={styles.signRow}>
          <Text className={styles.signLabel}>签收时间</Text>
          <Text className={styles.signValue}>{signedAt}</Text>
        </View>
      </View>
    );
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
        <Text className={styles.title}>配送跟踪</Text>

        <View className={styles.driverSummary}>
          <View className={styles.driverStat}>
            <Text className={styles.statNum}>{driverStats.working}</Text>
            <Text className={styles.statLabel}>配送中</Text>
          </View>
          <View className={styles.driverStat}>
            <Text className={styles.statNum}>{driverStats.idle}</Text>
            <Text className={styles.statLabel}>空闲</Text>
          </View>
          <View className={styles.driverStat}>
            <Text className={styles.statNum}>{driverStats.today}</Text>
            <Text className={styles.statLabel}>今日完成</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.tabs}>
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

        {filteredOrders.length === 0 ? (
          <EmptyState text="暂无配送订单" />
        ) : (
          filteredOrders.map(item => {
            const driver = getDriverByOrder(item.order);
            const statusText = deliveryStatusNames[item.deliveryStatus] || '待配送';

            return (
              <View
                key={item.order.id}
                className={styles.deliveryCard}
                onClick={() => handleCardClick(item.order)}
              >
                <View className={styles.cardHeader}>
                  <View className={styles.cardLeft}>
                    <Text className={styles.orderNo}>订单 {item.order.orderNo}</Text>
                    <Text className={styles.dest}>{item.order.address.funeralHome}</Text>
                    <Text className={styles.hall}>
                      {item.order.address.funeralHall} · {item.order.address.deliveryTime}
                    </Text>
                  </View>
                  <View className={styles.cardRight}>
                    <View className={classnames(styles.deliverStatus, getStatusClass(item.deliveryStatus))}>
                      {statusText}
                    </View>
                    <Text className={styles.eta}>
                      预计 {item.order.delivery?.estimatedArrival?.slice(11, 16) || item.order.address.deliveryTime}
                    </Text>
                  </View>
                </View>

                {driver && (
                  <View className={styles.driverSection}>
                    <View className={styles.driverAvatar}>
                      <Image
                        src={`https://picsum.photos/id/${64 + parseInt(driver.id.slice(-3)) % 50}/200/200`}
                        mode="aspectFill"
                      />
                    </View>
                    <View className={styles.driverInfo}>
                      <View className={styles.driverName}>
                        <Text>{driver.name}</Text>
                        <View className={styles.vehicleTag}>{driver.vehicleType}</View>
                      </View>
                      <Text className={styles.driverMeta}>
                        今日已完成 {driver.todayDeliveries} 单 · {item.order.delivery?.route?.join(' → ') || '路线规划中'}
                      </Text>
                    </View>
                    <Button
                      className={styles.phoneBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(driver.phone);
                      }}
                    >
                      ☎
                    </Button>
                  </View>
                )}

                <ScrollView scrollX className={styles.itemsRow}>
                  {item.order.styles.map((s, idx) => (
                    <View key={idx} className={styles.itemThumb}>
                      <Image src={s.styleImage} mode="aspectFill" />
                    </View>
                  ))}
                </ScrollView>

                {renderTimeline(item)}
                {renderSignInfo(item)}
              </View>
            );
          })
        )}

        <View className={styles.funeralHomeCard}>
          <SectionHeader title="合作殡仪馆" actionText={`共${funeralHomes.length}家`} />
          <View className={styles.homeList}>
            {funeralHomes.map(home => (
              <View
                key={home.id}
                className={styles.homeItem}
                onClick={() => {
                  console.log('[Delivery] 点击殡仪馆', { id: home.id });
                  Taro.showToast({ title: home.contactPerson, icon: 'none' });
                }}
              >
                <View className={styles.homeIcon}>🏛️</View>
                <View className={styles.homeInfo}>
                  <View className={styles.homeName}>
                    <Text>{home.name}</Text>
                    <View className={classnames(
                      styles.coopTag,
                      home.cooperationLevel === 'strategic' ? styles.coopStrategic : styles.coopStandard
                    )}>
                      {cooperationNames[home.cooperationLevel]}
                    </View>
                  </View>
                  <Text className={styles.homeAddr}>
                    {home.address} · {home.contactPerson} {home.contactPhone}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DeliveryPage;
