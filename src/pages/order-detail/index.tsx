import React, { useMemo } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { orderStatusNames, urgencyNames, paymentMethodNames } from '@/data/orders';
import { workers, skillLevelNames } from '@/data/workers';
import { useOrderStore } from '@/store/orderStore';
import { Order } from '@/types';

const dispatchTaskStatusNames: Record<string, string> = {
  assigned: '派工中',
  in_progress: '扎制中',
  completed: '已完成'
};

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id || 'o001';
  const storeOrders = useOrderStore(s => s.orders);
  const order: Order = storeOrders.find(o => o.id === orderId) || storeOrders[0];

  const timeline = useMemo(() => {
    const items: { label: string; time?: string; active: boolean; remark?: string }[] = [];
    items.push({
      label: '订单创建',
      time: order.createdAt,
      active: true,
      remark: order.customerRemark ? `客户备注: ${order.customerRemark}` : undefined
    });

    if (order.status !== 'pending') {
      items.push({
        label: '订单已确认',
        time: order.dispatchTasks[0]?.assignedAt || order.createdAt,
        active: true
      });
    }

    if (order.dispatchTasks.length > 0) {
      const started = order.dispatchTasks.find(t => t.startedAt);
      items.push({
        label: `派工给 ${order.dispatchTasks.length} 位师傅`,
        time: order.dispatchTasks[0].assignedAt,
        active: true,
        remark: order.dispatchTasks[0].notes
      });
      if (started) {
        items.push({
          label: '开始扎制',
          time: started.startedAt,
          active: true
        });
      }
      if (order.dispatchTasks.every(t => t.status === 'completed')) {
        items.push({
          label: '扎制完成',
          time: order.dispatchTasks.find(t => t.completedAt)?.completedAt,
          active: true
        });
      }
    }

    if (order.delivery) {
      items.push({
        label: '配送中',
        time: order.delivery.status !== 'pending' ? order.delivery.estimatedArrival : undefined,
        active: ['picked', 'en_route', 'arrived', 'delivered'].includes(order.delivery.status)
      });
      if (order.delivery.status === 'delivered') {
        items.push({
          label: `已签收 (${order.delivery.signedBy || order.address.contactName})`,
          time: order.delivery.signedAt,
          active: true
        });
      }
    }

    if (order.arrangement?.completedAt) {
      items.push({
        label: '灵堂布置完成',
        time: order.arrangement.completedAt,
        active: true,
        remark: order.arrangement.remarks
      });
    }

    if (order.refund) {
      items.push({
        label: `退款${order.refund.status === 'completed' ? '完成' : '处理中'}`,
        time: order.refund.applyAt,
        active: true,
        remark: `退款 ¥${order.refund.refundAmount} (${order.refund.reason})`
      });
    }

    if (order.status === 'cancelled' && !order.refund) {
      items.push({
        label: '订单已取消',
        active: true
      });
    }

    return items;
  }, [order]);

  const handleAction = (action: string) => {
    console.log('[OrderDetail] handleAction', { action, orderId: order.id });
    switch (action) {
      case 'couplet':
        Taro.navigateTo({ url: '/pages/couplet/index' });
        break;
      case 'dispatch':
        Taro.navigateTo({ url: `/pages/dispatch/index?id=${order.id}` });
        break;
      case 'delivery':
        Taro.navigateTo({ url: `/pages/delivery-detail/index?id=${order.id}` });
        break;
      case 'arrangement':
        Taro.navigateTo({ url: `/pages/arrangement/index?id=${order.id}` });
        break;
      case 'refund':
        Taro.navigateTo({ url: `/pages/refund/index?id=${order.id}` });
        break;
      case 'call':
        Taro.makePhoneCall({
          phoneNumber: order.customerPhone.replace(/\*/g, '1')
        }).catch(() => {
          Taro.showToast({ title: `联系${order.customerName}`, icon: 'none' });
        });
        break;
      case 'edit':
      default:
        Taro.showToast({ title: '编辑订单', icon: 'none' });
    }
  };

  const urgencyClass = order.urgency === 'super_urgent' ? styles.urgency : '';

  return (
    <View className={styles.page}>
      <View className={styles.statusBanner}>
        <View className={styles.bannerTop}>
          <View>
            <Text className={styles.statusLabel}>订单状态</Text>
            <Text className={styles.statusText}>{orderStatusNames[order.status]}</Text>
            <View className={styles.tags}>
              {order.urgency !== 'normal' && (
                <View className={classnames(styles.tag, urgencyClass)} style={order.urgency !== 'super_urgent' ? {} : undefined}>
                  {urgencyNames[order.urgency]}
                </View>
              )}
              {order.arrangementRequired && <View className={styles.tag}>含布置</View>}
            </View>
          </View>
          {order.urgency !== 'normal' && (
            <View className={classnames(styles.urgency, urgencyClass)}>
              {urgencyNames[order.urgency]}
            </View>
          )}
        </View>
        <View className={styles.orderNoRow}>
          <Text>订单号：{order.orderNo}</Text>
          <Text>创建时间：{order.createdAt}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>花礼款式</Text>
            {order.dispatchTasks.length === 0 && ['confirmed', 'pending'].includes(order.status) && (
              <Text className={styles.actionBtn} onClick={() => handleAction('dispatch')}>
                去派工 →
              </Text>
            )}
          </View>

          {order.styles.map((s, idx) => (
            <View key={idx} className={styles.itemRow}>
              <View className={styles.itemImg}>
                <Image src={s.styleImage} mode="aspectFill" />
              </View>
              <View className={styles.itemInfo}>
                <Text className={styles.itemName}>{s.styleName}</Text>
                <View className={styles.itemBottom}>
                  <Text className={styles.itemPrice}>¥{s.unitPrice}</Text>
                  <Text className={styles.itemQty}>× {s.quantity} = ¥{s.subtotal}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {order.couplet && (
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <View className={styles.titleBar}></View>
              <Text>挽联内容</Text>
              <Text className={styles.actionBtn} onClick={() => handleAction('couplet')}>
                编辑 →
              </Text>
            </View>

            <View className={styles.infoRows}>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>逝者姓名</Text>
                <Text className={styles.infoValue}>{order.couplet.decedentsName}</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>敬献者</Text>
                <Text className={styles.infoValue}>
                  {order.couplet.senderRelation ? `${order.couplet.senderRelation} ` : ''}
                  {order.couplet.senderName}
                </Text>
              </View>
            </View>

            <View className={styles.coupletPreview}>
              <View className={styles.coupletScroll}>
                {order.couplet.upper.split('').map((ch, i) => (
                  <Text key={i} className={styles.coupletChar}>{ch}</Text>
                ))}
              </View>
              <View className={styles.coupletScroll}>
                {order.couplet.lower.split('').map((ch, i) => (
                  <Text key={i} className={styles.coupletChar}>{ch}</Text>
                ))}
              </View>
            </View>
            {order.couplet.horizontal && (
              <View style={{ textAlign: 'center', marginTop: '16rpx', fontSize: '24rpx', color: '#5A626C' }}>
                横批：{order.couplet.horizontal}
              </View>
            )}
          </View>
        )}

        {order.dispatchTasks.length > 0 && (
          <View className={styles.card}>
            <View className={styles.cardTitle}>
              <View className={styles.titleBar}></View>
              <Text>派工详情</Text>
              <Text className={styles.actionBtn} onClick={() => handleAction('dispatch')}>
                查看扎制进度 →
              </Text>
            </View>

            {order.dispatchTasks.map((task, idx) => {
              const worker = workers.find(w => w.id === task.workerId);
              return (
                <View key={idx} style={idx > 0 ? { marginTop: '32rpx', paddingTop: '32rpx', borderTop: '1rpx solid #EEF0F3' } : {}}>
                  <View style={{ marginBottom: '16rpx', display: 'flex', alignItems: 'center' }}>
                    <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#1D2129' }}>
                      任务 {idx + 1}
                    </Text>
                  </View>
                  <View className={styles.infoRows}>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>师傅姓名</Text>
                      <Text className={styles.infoValue}>
                        {worker?.name || task.workerId}
                        {worker && (
                          <Text style={{
                            marginLeft: '12rpx',
                            padding: '4rpx 12rpx',
                            fontSize: '20rpx',
                            borderRadius: '4rpx',
                            background: worker.skillLevel === 'senior'
                              ? 'linear-gradient(135deg, #B4272C 0%, #D04A4F 100%)'
                              : worker.skillLevel === 'intermediate'
                                ? 'linear-gradient(135deg, #E6A23C 0%, #F0C78E 100%)'
                                : '#F2F3F5',
                            color: worker.skillLevel === 'junior' ? '#86909C' : '#FFFFFF'
                          }}>
                            {skillLevelNames[worker.skillLevel]}
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>派工时间</Text>
                      <Text className={styles.infoValue}>{task.assignedAt}</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>开始时间</Text>
                      <Text className={styles.infoValue}>{task.scheduledStart || task.startedAt || '-'}</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>完成时间</Text>
                      <Text className={styles.infoValue}>{task.scheduledEnd || task.completedAt || '-'}</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoLabel}>状态</Text>
                      <Text className={styles.infoValue}>
                        <Text style={{
                          padding: '6rpx 16rpx',
                          borderRadius: '8rpx',
                          fontSize: '22rpx',
                          fontWeight: '500',
                          background: task.status === 'completed'
                            ? '#E8F5E9'
                            : task.status === 'in_progress'
                              ? '#FFF7E6'
                              : '#E6F4FF',
                          color: task.status === 'completed'
                            ? '#00B42A'
                            : task.status === 'in_progress'
                              ? '#FF7D00'
                              : '#165DFF'
                        }}>
                          {dispatchTaskStatusNames[task.status]}
                        </Text>
                      </Text>
                    </View>
                    {task.notes && (
                      <View className={styles.infoRow}>
                        <Text className={styles.infoLabel}>备注</Text>
                        <Text className={styles.infoValue}>{task.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>配送信息</Text>
            {order.delivery && (
              <Text className={styles.actionBtn} onClick={() => handleAction('delivery')}>
                跟踪配送 →
              </Text>
            )}
          </View>

          <View className={styles.infoRows}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>殡仪馆</Text>
              <Text className={styles.infoValue}>
                {order.address.funeralHome}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>礼堂</Text>
              <Text className={styles.infoValue}>{order.address.funeralHall}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>详细地址</Text>
              <Text className={styles.infoValue}>{order.address.address}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>送达时间</Text>
              <Text className={styles.infoValue}>
                {order.address.deliveryDate} {order.address.deliveryTime}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>联系人</Text>
              <Text className={styles.infoValue}>
                {order.address.contactName} {order.address.contactPhone}
              </Text>
            </View>
          </View>

          {order.arrangementRequired && (
            <View style={{ marginTop: '32rpx' }}>
              <View className={styles.cardTitle} style={{ marginBottom: '24rpx' }}>
                <View className={styles.titleBar}></View>
                <Text>灵堂布置</Text>
                <Text className={styles.actionBtn} onClick={() => handleAction('arrangement')}>
                  {order.arrangement?.completedAt ? '查看详情' : '去布置'} →
                </Text>
              </View>
              {order.arrangement?.remarks && (
                <Text style={{ fontSize: '24rpx', color: '#5A626C' }}>
                  {order.arrangement.remarks}
                </Text>
              )}
            </View>
          )}
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>客户信息</Text>
          </View>

          <View className={styles.infoRows}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>下单客户</Text>
              <Text className={styles.infoValue}>
                {order.customerName} {order.customerPhone}
              </Text>
            </View>
            {order.customerRemark && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>客户备注</Text>
                <Text className={styles.infoValue}>{order.customerRemark}</Text>
              </View>
            )}
            {order.internalRemark && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>内部备注</Text>
                <Text className={styles.infoValue}>{order.internalRemark}</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>费用明细</Text>
          </View>

          <View className={styles.amountSection}>
            <View className={styles.amountRow}>
              <Text className={styles.amountLabel}>花礼小计</Text>
              <Text className={styles.amountValue}>¥{order.subtotal}</Text>
            </View>
            {order.arrangementFee > 0 && (
              <View className={styles.amountRow}>
                <Text className={styles.amountLabel}>布置服务费</Text>
                <Text className={styles.amountValue}>¥{order.arrangementFee}</Text>
              </View>
            )}
            {order.deliveryFee > 0 && (
              <View className={styles.amountRow}>
                <Text className={styles.amountLabel}>配送费</Text>
                <Text className={styles.amountValue}>¥{order.deliveryFee}</Text>
              </View>
            )}
            {order.urgentFee > 0 && (
              <View className={styles.amountRow}>
                <Text className={styles.amountLabel}>加急费</Text>
                <Text className={styles.amountValue}>¥{order.urgentFee}</Text>
              </View>
            )}
            {order.discountAmount > 0 && (
              <View className={classnames(styles.amountRow, styles.discount)}>
                <Text className={styles.amountLabel}>优惠折扣</Text>
                <Text className={styles.amountValue}>-¥{order.discountAmount}</Text>
              </View>
            )}

            <View className={styles.totalRow}>
              <Text className={styles.totalLabel}>
                合计
                {order.paidAmount === order.totalAmount ? (
                  <Text className={styles.paidBadge}>已付清</Text>
                ) : order.paidAmount > 0 ? (
                  <Text className={styles.unpaidBadge}>部分付款</Text>
                ) : (
                  <Text className={styles.unpaidBadge}>待付款</Text>
                )}
              </Text>
              <Text className={styles.totalValue}>¥{order.totalAmount}</Text>
            </View>

            {order.paymentMethod && (
              <View style={{ marginTop: '16rpx', textAlign: 'right', fontSize: '22rpx', color: '#8A9099' }}>
                已支付 ¥{order.paidAmount} · {paymentMethodNames[order.paymentMethod]}
              </View>
            )}
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>操作日志</Text>
          </View>

          <View className={styles.timeline}>
            {timeline.map((item, idx) => (
              <View key={idx} className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, item.active && styles.active)}></View>
                <View>
                  <Text className={classnames(styles.timelineLabel, item.active && styles.active)}>
                    {item.label}
                  </Text>
                  {item.time && <Text className={styles.timelineTime}>{item.time}</Text>}
                  {item.remark && (
                    <View className={styles.timelineRemark}>{item.remark}</View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={styles.btnGhost} onClick={() => handleAction('call')}>联系客户</Button>
        {order.status === 'pending' && (
          <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => handleAction('edit')}>
            编辑订单
          </Button>
        )}
        {order.status === 'confirmed' && (
          <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => handleAction('dispatch')}>
            安排派工
          </Button>
        )}
        {['making', 'completed'].includes(order.status) && (
          <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => handleAction('dispatch')}>
            查看扎制进度
          </Button>
        )}
        {['delivering', 'delivered'].includes(order.status) && (
          <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => handleAction('delivery')}>
            {order.status === 'delivered' ? '查看签收' : '跟踪配送'}
          </Button>
        )}
        {['cancelled', 'delivered', 'refunded'].includes(order.status) && !order.refund && (
          <Button
            className={classnames(styles.btn, styles.btnPrimary)}
            style={{ background: 'linear-gradient(135deg, #B4272C 0%, #D04A4F 100%)' }}
            onClick={() => handleAction('refund')}
          >
            售后处理
          </Button>
        )}
      </View>
    </View>
  );
};

export default OrderDetailPage;
