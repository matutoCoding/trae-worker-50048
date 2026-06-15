import React, { useState, useMemo } from 'react';
import { View, Text, Button, Input, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useOrderStore, now } from '@/store/orderStore';
import { funeralStyles } from '@/data/styles';
import { funeralHomes } from '@/data/workers';
import { UrgencyLevel, Order } from '@/types';

const POPULAR_STYLES = funeralStyles.filter(s =>
  ['s001', 's002', 's003', 's004', 's005', 's006'].includes(s.id)
);

const URGENCY_OPTIONS: { key: UrgencyLevel; label: string; cls: string }[] = [
  { key: 'normal', label: '普通', cls: styles.urgencyNormal },
  { key: 'urgent', label: '加急', cls: styles.urgencyUrgent },
  { key: 'super_urgent', label: '特急', cls: styles.urgencySuper }
];

const OrderCreatePage: React.FC = () => {
  const addOrder = useOrderStore(s => s.addOrder);
  const orderCount = useOrderStore(s => s.orders.length);

  const [selectedStyleId, setSelectedStyleId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [funeralHomeIdx, setFuneralHomeIdx] = useState(0);
  const [funeralHall, setFuneralHall] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('10:00');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [remark, setRemark] = useState('');

  const selectedStyle = useMemo(
    () => funeralStyles.find(s => s.id === selectedStyleId),
    [selectedStyleId]
  );

  const home = funeralHomes[funeralHomeIdx];

  const feeCalc = useMemo(() => {
    const subtotal = (selectedStyle?.price || 0) * quantity;
    const deliveryFee = 60;
    const urgentFee = urgency === 'super_urgent' ? 500 : urgency === 'urgent' ? 200 : 0;
    const total = subtotal + deliveryFee + urgentFee;
    return { subtotal, deliveryFee, urgentFee, total };
  }, [selectedStyle, quantity, urgency]);

  const handleSubmit = () => {
    if (!selectedStyle) {
      Taro.showToast({ title: '请选择款式', icon: 'none' });
      return;
    }
    if (!customerName.trim()) {
      Taro.showToast({ title: '请填写客户姓名', icon: 'none' });
      return;
    }
    if (!contactName.trim()) {
      Taro.showToast({ title: '请填写联系人', icon: 'none' });
      return;
    }
    if (!deliveryDate) {
      Taro.showToast({ title: '请填写送达日期', icon: 'none' });
      return;
    }

    const orderNo = `BY${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(orderCount + 1).padStart(3, '0')}`;

    const order: Order = {
      id: `o_${Date.now()}`,
      orderNo,
      createdAt: now(),
      status: 'pending',
      urgency,
      styles: [{
        styleId: selectedStyle.id,
        styleName: selectedStyle.name,
        styleImage: selectedStyle.images[0],
        quantity,
        unitPrice: selectedStyle.price,
        subtotal: selectedStyle.price * quantity
      }],
      address: {
        funeralHome: home.name,
        funeralHall: funeralHall || '待确认',
        address: home.address,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        deliveryDate,
        deliveryTime: deliveryTime || '10:00'
      },
      arrangementRequired: false,
      dispatchTasks: [],
      subtotal: feeCalc.subtotal,
      arrangementFee: 0,
      deliveryFee: feeCalc.deliveryFee,
      urgentFee: feeCalc.urgentFee,
      discountAmount: 0,
      totalAmount: feeCalc.total,
      paidAmount: 0,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerRemark: remark.trim() || undefined
    };

    addOrder(order);
    Taro.showToast({ title: '下单成功', icon: 'success' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/orders/index' });
    }, 1000);
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>选择款式</Text>
          </View>
          <View className={styles.styleGrid}>
            {POPULAR_STYLES.map(s => (
              <View
                key={s.id}
                className={classnames(styles.styleOption, selectedStyleId === s.id && styles.selected)}
                onClick={() => setSelectedStyleId(s.id)}
              >
                <View className={styles.styleOptionImg}>
                  <Image src={s.images[0]} mode="aspectFill" />
                </View>
                <View className={styles.styleOptionInfo}>
                  <Text className={styles.styleOptionName}>{s.name}</Text>
                  <Text className={styles.styleOptionPrice}>¥{s.price}</Text>
                </View>
                {selectedStyleId === s.id && <Text className={styles.checkMark}>✓</Text>}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>数量</Text>
          </View>
          <View className={styles.qtyRow}>
            <Text style={{ fontSize: '24rpx', color: '#5A626C' }}>
              {selectedStyle ? `${selectedStyle.name} · ¥${selectedStyle.price}/件` : '请先选择款式'}
            </Text>
            <View className={styles.qtyControl}>
              <View className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</View>
              <Text className={styles.qtyValue}>{quantity}</Text>
              <View className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</View>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>客户信息</Text>
          </View>
          <View className={styles.fieldGroup}>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>客户姓名 *</Text>
              <Input className={styles.fieldInput} value={customerName} onInput={e => setCustomerName(e.detail.value)} placeholder="请输入下单客户姓名" />
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>客户电话</Text>
              <Input className={styles.fieldInput} type="number" value={customerPhone} onInput={e => setCustomerPhone(e.detail.value)} placeholder="请输入联系电话" />
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>配送信息</Text>
          </View>
          <View className={styles.fieldGroup}>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>殡仪馆</Text>
              <View className={styles.urgencyRow}>
                {funeralHomes.map((fh, idx) => (
                  <View
                    key={fh.id}
                    className={classnames(styles.urgencyOption, funeralHomeIdx === idx && styles.selected, styles.urgencyNormal)}
                    onClick={() => setFuneralHomeIdx(idx)}
                  >
                    {fh.name.length > 5 ? fh.name.slice(0, 5) + '…' : fh.name}
                  </View>
                ))}
              </View>
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>礼堂</Text>
              <Input className={styles.fieldInput} value={funeralHall} onInput={e => setFuneralHall(e.detail.value)} placeholder="如：安魂厅" />
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>现场联系人 *</Text>
              <Input className={styles.fieldInput} value={contactName} onInput={e => setContactName(e.detail.value)} placeholder="请输入现场联系人" />
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>联系人电话</Text>
              <Input className={styles.fieldInput} type="number" value={contactPhone} onInput={e => setContactPhone(e.detail.value)} placeholder="请输入联系电话" />
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>送达日期 *</Text>
              <Input className={styles.fieldInput} value={deliveryDate} onInput={e => setDeliveryDate(e.detail.value)} placeholder="如：2026-06-16" />
            </View>
            <View className={styles.field}>
              <Text className={styles.fieldLabel}>送达时间</Text>
              <Input className={styles.fieldInput} value={deliveryTime} onInput={e => setDeliveryTime(e.detail.value)} placeholder="如：10:00" />
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>加急等级</Text>
          </View>
          <View className={styles.urgencyRow}>
            {URGENCY_OPTIONS.map(opt => (
              <View
                key={opt.key}
                className={classnames(styles.urgencyOption, urgency === opt.key && styles.selected, opt.cls)}
                onClick={() => setUrgency(opt.key)}
              >
                {opt.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardTitle}>
            <View className={styles.titleBar}></View>
            <Text>备注</Text>
          </View>
          <Input className={styles.fieldInput} value={remark} onInput={e => setRemark(e.detail.value)} placeholder="客户特殊要求等" />
        </View>

        <View className={styles.summaryCard}>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>花礼小计</Text>
            <Text className={styles.summaryValue}>¥{feeCalc.subtotal}</Text>
          </View>
          <View className={styles.summaryRow}>
            <Text className={styles.summaryLabel}>配送费</Text>
            <Text className={styles.summaryValue}>¥{feeCalc.deliveryFee}</Text>
          </View>
          {feeCalc.urgentFee > 0 && (
            <View className={styles.summaryRow}>
              <Text className={styles.summaryLabel}>加急费</Text>
              <Text className={styles.summaryValue}>¥{feeCalc.urgentFee}</Text>
            </View>
          )}
          <View className={styles.summaryTotal}>
            <Text className={styles.totalLabel}>合计</Text>
            <Text className={styles.totalValue}>¥{feeCalc.total}</Text>
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={styles.btnGhost} onClick={() => Taro.navigateBack()}>取消</Button>
        <Button className={styles.btnPrimary} onClick={handleSubmit}>提交订单</Button>
      </View>
    </View>
  );
};

export default OrderCreatePage;
