import React, { useState, useMemo } from 'react';
import { View, Text, Button, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { funeralStyles } from '@/data/styles';
import { FuneralStyle } from '@/types';
import { useOrderStore, now } from '@/store/orderStore';
import { funeralHomes } from '@/data/workers';

const StyleDetailPage: React.FC = () => {
  const router = useRouter();
  const styleId = router.params.id || 's001';
  const style: FuneralStyle = useMemo(
    () => funeralStyles.find(s => s.id === styleId) || funeralStyles[0],
    [styleId]
  );

  const [currentImg, setCurrentImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const addOrder = useOrderStore(s => s.addOrder);

  const totalPrice = style.price * quantity;
  const discountPercent = style.originalPrice
    ? Math.round((1 - style.price / style.originalPrice) * 100)
    : 0;
  const isLowStock = style.stock <= 5;

  const handleQtyChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > style.stock) {
        Taro.showToast({ title: `最多可订${style.stock}件`, icon: 'none' });
        return style.stock;
      }
      return next;
    });
  };

  const handleFavorite = () => {
    console.log('[StyleDetail] handleFavorite');
    setIsFavorite(prev => !prev);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'none'
    });
  };

  const handleOrder = () => {
    console.log('[StyleDetail] handleOrder', { styleId, quantity, totalPrice });
    Taro.showModal({
      title: '确认下单？',
      content: `${style.name} × ${quantity}\n合计：¥${totalPrice}`,
      confirmColor: '#2D5A4B',
      success: (res) => {
        if (res.confirm) {
          const subtotal = style.price * quantity;
          const deliveryFee = 60;
          const totalAmount = subtotal + deliveryFee;

          const order = {
            id: `o_${Date.now()}`,
            orderNo: `BY${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(useOrderStore.getState().orders.length + 1).padStart(3, '0')}`,
            createdAt: now(),
            status: 'pending' as const,
            urgency: 'normal' as const,
            styles: [{
              styleId: style.id,
              styleName: style.name,
              styleImage: style.images[0],
              quantity,
              unitPrice: style.price,
              subtotal: style.price * quantity
            }],
            address: {
              funeralHome: funeralHomes[0].name,
              funeralHall: '待确认',
              address: funeralHomes[0].address,
              contactName: '待填写',
              contactPhone: '',
              deliveryDate: new Date().toISOString().slice(0, 10),
              deliveryTime: '10:00'
            },
            arrangementRequired: false,
            dispatchTasks: [],
            subtotal,
            arrangementFee: 0,
            deliveryFee,
            urgentFee: 0,
            discountAmount: 0,
            totalAmount,
            paidAmount: 0,
            customerName: '线上客户',
            customerPhone: ''
          };

          addOrder(order);
          Taro.showToast({ title: '下单成功', icon: 'success' });
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/orders/index' });
          }, 1000);
        }
      }
    });
  };

  const handleCustomizeCouplet = () => {
    Taro.showActionSheet({
      itemList: ['定制挽联', '查看款式库'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.navigateTo({ url: '/pages/couplet/index' });
        } else if (res.tapIndex === 1) {
          Taro.switchTab({ url: '/pages/styles/index' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.banner}>
        <View className={styles.badgeRow}>
          {style.isHot && <View className={classnames(styles.badge, styles.hotBadge)}>热销</View>}
          {style.isNew && <View className={classnames(styles.badge, styles.newBadge)}>新品</View>}
        </View>

        <Swiper
          className={styles.swiperContainer}
          current={currentImg}
          onChange={(e) => setCurrentImg(e.detail.current)}
          indicatorDots={false}
          autoplay={style.images.length > 1}
          circular={style.images.length > 1}
        >
          {style.images.map((img, idx) => (
            <SwiperItem key={idx} className={styles.swiperItem}>
              <Image src={img} className={styles.swiperImage} mode="aspectFill" />
            </SwiperItem>
          ))}
        </Swiper>

        <View className={styles.pagination}>
          {currentImg + 1}/{style.images.length}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.titleCard}>
          <View className={styles.priceRow}>
            <Text className={styles.price}>¥{style.price}</Text>
            {style.originalPrice && (
              <>
                <Text className={styles.originalPrice}>¥{style.originalPrice}</Text>
                {discountPercent > 0 && (
                  <View className={styles.discount}>{discountPercent}% OFF</View>
                )}
              </>
            )}
          </View>

          <Text className={styles.name}>{style.name}</Text>
          <Text className={styles.desc}>{style.description}</Text>

          <View className={styles.metaRow}>
            <View className={styles.metaItem}>
              <Text className={styles.metaLabel}>扎制时长</Text>
              <Text className={styles.metaValue}>{style.makeTime}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaLabel}>库存</Text>
              <Text className={classnames(styles.metaValue, isLowStock && styles.stockWarn)}>
                {style.stock}件
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.specCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>规格参数</Text>
          </View>

          <View className={styles.specList}>
            {style.specifications.map((spec, idx) => (
              <View key={idx} className={styles.specItem}>
                <View className={styles.specDot}></View>
                <Text className={styles.specText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.suitableCard}>
          <View className={styles.suitableTitle}>
            <Text>适用场合</Text>
          </View>
          <Text className={styles.suitableText}>{style.suitable}</Text>
        </View>

        <View className={styles.stockInfo}>
          <View className={styles.stockLeft}>
            <Text className={styles.stockLabel}>数量</Text>
            <Text className={classnames(styles.stockValue, isLowStock && styles.stockWarn)}>
              库存 {style.stock} 件
              {isLowStock && '（库存紧张）'}
            </Text>
          </View>
          <View className={styles.qtyControl}>
            <View className={styles.qtyBtn} onClick={() => handleQtyChange(-1)}>−</View>
            <Text className={styles.qtyValue}>{quantity}</Text>
            <View className={styles.qtyBtn} onClick={() => handleQtyChange(1)}>+</View>
          </View>
        </View>

        <View style={{ height: '64rpx' }}></View>
      </View>

      <View className={styles.footer}>
        <View className={styles.priceSummary}>
          <Text className={styles.summaryLabel}>合计</Text>
          <Text className={styles.summaryPrice}>¥{totalPrice}</Text>
        </View>
        <Button className={styles.btnFav} onClick={handleFavorite}>
          <Text>{isFavorite ? '♥' : '♡'}</Text>
          <Text style={{ fontSize: '20rpx' }}>{isFavorite ? '已收藏' : '收藏'}</Text>
        </Button>
        <Button className={styles.btnFav} onClick={handleCustomizeCouplet}>
          <Text>...</Text>
          <Text style={{ fontSize: '20rpx' }}>更多</Text>
        </Button>
        <Button className={styles.btnOrder} onClick={handleOrder}>
          立即下单
        </Button>
      </View>
    </View>
  );
};

export default StyleDetailPage;
