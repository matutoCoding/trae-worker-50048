import React, { useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useOrderStore, now } from '@/store/orderStore';
import { deliveryStatusNames } from '@/data/orders';
import { deliveryStaffs } from '@/data/workers';

const DeliveryDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id || 'o001';

  const order = useOrderStore(s => s.orders.find(o => o.id === orderId)) || useOrderStore(s => s.orders[0]);
  const updateDelivery = useOrderStore(s => s.updateDelivery);
  const updateOrderStatus = useOrderStore(s => s.updateOrderStatus);

  const driver = (() => {
    if (order.delivery) {
      return deliveryStaffs.find(d => d.id === order.delivery!.staffId) || deliveryStaffs[0];
    }
    return deliveryStaffs[0];
  })();

  const deliveryStatus = order.delivery?.status ||
    (order.status === 'delivered' ? 'delivered' : 'pending');

  const [signedName, setSignedName] = useState(order.delivery?.signedBy || '');

  const handleCall = () => {
    console.log('[DeliveryDetail] handleCall', { phone: driver.phone });
    Taro.makePhoneCall({
      phoneNumber: driver.phone.replace(/\*/g, '1')
    }).catch(() => {
      Taro.showToast({ title: `联系 ${driver.name}`, icon: 'none' });
    });
  };

  const handleMsg = () => {
    console.log('[DeliveryDetail] handleMsg');
    Taro.showToast({ title: '发送消息功能', icon: 'none' });
  };

  const handlePickup = () => {
    updateDelivery(orderId, { status: 'picked' });
    Taro.showToast({ title: '已确认取货', icon: 'success' });
  };

  const handleTakePhoto = () => {
    const seed = Math.floor(Math.random() * 1000);
    const photoUrl = `https://picsum.photos/seed/${seed}/400/400`;
    const currentPhotos = order.delivery?.photos || [];
    updateDelivery(orderId, { photos: [...currentPhotos, photoUrl] });
    Taro.showToast({ title: '拍照成功', icon: 'success' });
  };

  const handleSign = () => {
    console.log('[DeliveryDetail] handleSign');
    if (!signedName) {
      Taro.showModal({
        title: '签收确认',
        editable: true,
        placeholderText: '请输入签收人姓名',
        success: (res) => {
          if (res.confirm && res.content) {
            setSignedName(res.content);
            confirmDelivery(res.content);
          }
        }
      });
    } else {
      Taro.showToast({ title: '已签收', icon: 'success' });
    }
  };

  const confirmDelivery = (name: string) => {
    updateDelivery(orderId, { status: 'delivered', signedBy: name, signedAt: now() }, 'delivered');
    updateOrderStatus(orderId, 'delivered');
    Taro.showToast({ title: `${name} 已签收`, icon: 'success' });
  };

  const handlePlanRoute = () => {
    console.log('[DeliveryDetail] handlePlanRoute');
    Taro.showToast({ title: '路线规划中...', icon: 'loading', duration: 1000 });
    setTimeout(() => {
      Taro.showToast({ title: '路线已规划', icon: 'success' });
    }, 1000);
  };

  const getStatusText = () => deliveryStatusNames[deliveryStatus] || '待配送';

  const routeSteps = [
    { name: '花店出发点', addr: '城南区花卉路123号', type: 'start' },
    { name: '当前位置', addr: order.delivery?.route?.[1] || '北二环中路', type: 'middle' },
    { name: order.address.funeralHome, addr: order.address.address, type: 'end' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.mapMock}>
        <View className={styles.routeLine}>
          <View className={styles.startPoint}></View>
          <View className={styles.currentPoint}></View>
          <View className={styles.endPoint}></View>
          <View className={styles.connector}></View>
        </View>
        <View className={styles.mapPlaceholder}>
          <Text className={styles.mapIcon}>🗺️</Text>
          <Text>配送路线图</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.statusCard}>
          <View className={styles.statusTop}>
            <View>
              <Text className={styles.statusLabel}>配送状态</Text>
              <Text className={styles.statusValue}>{getStatusText()}</Text>
            </View>
            <View className={styles.eta}>
              预计 {order.delivery?.estimatedArrival?.slice(11, 16) || order.address.deliveryTime} 到达
            </View>
          </View>
          <Text className={styles.routeHint}>
            路线：{order.delivery?.route?.join(' → ') || '规划中'}
          </Text>
        </View>

        <View className={styles.driverCard}>
          <View className={styles.driverHeader}>
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
              <Text className={styles.driverPhone}>
                {driver.phone} · 今日已配送 {driver.todayDeliveries} 单
              </Text>
            </View>
            <View className={styles.contactBtns}>
              <Button className={classnames(styles.contactBtn, styles.btnMsg)} onClick={handleMsg}>
                ✉
              </Button>
              <Button className={classnames(styles.contactBtn, styles.btnCall)} onClick={handleCall}>
                ☎
              </Button>
            </View>
          </View>

          <View className={styles.routeInfo}>
            <Text className={styles.routeTitle}>配送路线</Text>
            <View className={styles.routeSteps}>
              {routeSteps.map((step, idx) => (
                <View key={idx} className={styles.routeStep}>
                  <View className={classnames(
                    styles.stepIcon,
                    step.type === 'start' ? styles.iconStart :
                    step.type === 'middle' ? styles.iconMiddle : styles.iconEnd
                  )}>
                    {step.type === 'start' ? '出' : step.type === 'middle' ? '•' : '终'}
                  </View>
                  <View className={styles.stepContent}>
                    <Text className={styles.stepName}>{step.name}</Text>
                    <Text className={styles.stepAddr}>{step.addr}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.orderCard}>
          <View className={styles.cardTitle}>
            <Text>配送物品</Text>
            <Text className={styles.orderNo}>{order.orderNo}</Text>
          </View>

          <View className={styles.items}>
            {order.styles.map((s, idx) => (
              <View key={idx} className={styles.item}>
                <View className={styles.itemImg}>
                  <Image src={s.styleImage} mode="aspectFill" />
                </View>
                <View className={styles.itemInfo}>
                  <Text className={styles.itemName}>{s.styleName}</Text>
                  <View className={styles.itemBottom}>
                    <Text className={styles.itemPrice}>¥{s.unitPrice}</Text>
                    <Text className={styles.itemQty}>x{s.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className={styles.destInfo}>
            <View className={styles.destRow}>
              <Text className={styles.destLabel}>送达地点</Text>
              <Text className={styles.destValue}>
                {order.address.funeralHome} {order.address.funeralHall}
              </Text>
            </View>
            <View className={styles.destRow}>
              <Text className={styles.destLabel}>详细地址</Text>
              <Text className={styles.destValue}>{order.address.address}</Text>
            </View>
            <View className={styles.destRow}>
              <Text className={styles.destLabel}>联系人</Text>
              <Text className={styles.destValue}>
                {order.address.contactName} {order.address.contactPhone}
              </Text>
            </View>
            <View className={styles.destRow}>
              <Text className={styles.destLabel}>送达时间</Text>
              <Text className={styles.destValue}>
                {order.address.deliveryDate} {order.address.deliveryTime}
              </Text>
            </View>
          </View>

          {(order.delivery?.photos?.length || deliveryStatus === 'delivered') && (
            <View className={styles.photosSection}>
              <Text className={styles.cardTitle}>签收凭证</Text>
              <View className={styles.photosGrid}>
                {order.delivery?.photos?.map((p, idx) => (
                  <View key={idx} className={styles.photoItem}>
                    <Image src={p} mode="aspectFill" />
                  </View>
                ))}
                {deliveryStatus === 'delivered' && !order.delivery?.photos?.length && (
                  <View
                    className={styles.photoItem}
                    onClick={handleTakePhoto}
                  >
                    +
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {deliveryStatus === 'delivered' && (
          <View className={styles.signSection}>
            <View className={styles.cardTitle}>签收信息</View>
            <View className={styles.signedBy}>
              <Text className={styles.signedLabel}>签收人</Text>
              <Text className={styles.signedValue}>{order.delivery?.signedBy || '—'}</Text>
            </View>
            <View className={styles.signedBy}>
              <Text className={styles.signedLabel}>签收时间</Text>
              <Text className={styles.signedValue}>{order.delivery?.signedAt || '—'}</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        {['pending', 'picked'].includes(deliveryStatus) && (
          <>
            <Button className={classnames(styles.btn, styles.btnGhost)} onClick={handlePlanRoute}>
              规划路线
            </Button>
            <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handlePickup}>
              确认取货
            </Button>
          </>
        )}
        {['en_route', 'arrived'].includes(deliveryStatus) && (
          <>
            <Button className={classnames(styles.btn, styles.btnGhost)} onClick={handleTakePhoto}>
              拍照留证
            </Button>
            <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleSign}>
              确认签收
            </Button>
          </>
        )}
        {deliveryStatus === 'delivered' && (
          <>
            <Button className={classnames(styles.btn, styles.btnGhost)} onClick={handleCall}>
              联系客户
            </Button>
            <Button
              className={classnames(styles.btn, styles.btnPrimary)}
              onClick={() => Taro.navigateBack()}
            >
              返回列表
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default DeliveryDetailPage;
