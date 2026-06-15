import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, Textarea, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { orders, orderStatusNames } from '@/data/orders';
import { Order } from '@/types';

type RefundType = 'full' | 'partial' | 'exchange';

const REFUND_TYPES: { key: RefundType; name: string; desc: string }[] = [
  { key: 'full', name: '全额退款', desc: '退还全部已支付金额' },
  { key: 'partial', name: '部分退款', desc: '退还部分金额，花礼已使用' },
  { key: 'exchange', name: '换货处理', desc: '重新制作并配送，不退款' }
];

const REFUND_REASONS = [
  '鲜花质量问题',
  '配送延迟严重',
  '与图片不符',
  '殡仪馆/时间变更',
  '挽联内容错误',
  '其他原因'
];

const RefundPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id || 'o006';
  const order: Order = useMemo(
    () => orders.find(o => o.id === orderId) || orders[5],
    [orderId]
  );

  const existingRefund = order.refund;
  const isProcessed = !!existingRefund;

  const [refundType, setRefundType] = useState<RefundType>(existingRefund?.type || 'partial');
  const [refundAmount, setRefundAmount] = useState<string>(
    existingRefund?.refundAmount?.toString() || Math.round(order.paidAmount * 0.5).toString()
  );
  const [selectedReason, setSelectedReason] = useState<string>(existingRefund?.reason || '');
  const [customReason, setCustomReason] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const processLog = useMemo(() => {
    if (!existingRefund) return [];
    const logs: { label: string; time?: string; user?: string }[] = [];
    logs.push({
      label: '提交退款申请',
      time: existingRefund.applyAt,
      user: order.customerName
    });
    if (existingRefund.approvedAt) {
      logs.push({
        label: existingRefund.status === 'rejected' ? '退款申请被驳回' : '退款申请已通过',
        time: existingRefund.approvedAt,
        user: existingRefund.processedBy
      });
    }
    if (existingRefund.status === 'completed') {
      logs.push({
        label: `退款完成 ¥${existingRefund.refundAmount}`,
        user: '系统'
      });
    }
    return logs;
  }, [existingRefund, order]);

  const handleAddPhoto = () => {
    console.log('[Refund] handleAddPhoto');
    Taro.showToast({ title: '上传凭证图片', icon: 'none' });
    const newPhoto = `https://picsum.photos/id/${225 + photos.length * 20}/300/300`;
    setPhotos(prev => prev.length < 9 ? [...prev, newPhoto] : prev);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('[Refund] handleSubmit', {
      refundType, refundAmount, selectedReason, customReason
    });

    if (!selectedReason && !customReason) {
      Taro.showToast({ title: '请选择或填写退款原因', icon: 'none' });
      return;
    }
    if (refundType !== 'exchange' && (!refundAmount || Number(refundAmount) <= 0)) {
      Taro.showToast({ title: '请填写退款金额', icon: 'none' });
      return;
    }
    if (Number(refundAmount) > order.paidAmount) {
      Taro.showToast({ title: '退款金额不能超过实付金额', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认提交退款？',
      content: `类型：${REFUND_TYPES.find(t => t.key === refundType)?.name}
${refundType !== 'exchange' ? `金额：¥${refundAmount}` : ''}
原因：${selectedReason || customReason}`,
      confirmColor: '#B4272C',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '申请已提交', icon: 'success' });
            setTimeout(() => Taro.navigateBack(), 1000);
          }, 800);
        }
      }
    });
  };

  const handleApprove = () => {
    console.log('[Refund] handleApprove');
    Taro.showModal({
      title: '确认通过退款？',
      content: `将退款 ¥${existingRefund?.refundAmount || refundAmount} 给客户`,
      confirmColor: '#2D5A4B',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '处理中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '已通过退款', icon: 'success' });
          }, 800);
        }
      }
    });
  };

  const handleReject = () => {
    console.log('[Refund] handleReject');
    Taro.showModal({
      title: '确认驳回申请？',
      editable: true,
      placeholderText: '请输入驳回原因',
      confirmColor: '#B4272C',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '处理中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '已驳回申请', icon: 'success' });
          }, 800);
        }
      }
    });
  };

  const getStatusClass = () => {
    switch (existingRefund?.status) {
      case 'pending': return styles.statusPending;
      case 'approved': return styles.statusApproved;
      case 'rejected': return styles.statusRejected;
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  };

  const getStatusText = () => {
    switch (existingRefund?.status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已驳回';
      case 'completed': return '已完成';
      default: return '新建申请';
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.orderSummary}>
          <View className={styles.summaryHeader}>
            <Text className={styles.orderNo}>订单 {order.orderNo}</Text>
            <View className={classnames(styles.statusTag, getStatusClass())}>
              {getStatusText()}
            </View>
          </View>

          {order.styles.slice(0, 1).map((s, idx) => (
            <View key={idx} className={styles.styleItem}>
              <View className={styles.styleImg}>
                <Image src={s.styleImage} mode="aspectFill" />
              </View>
              <View className={styles.styleInfo}>
                <Text className={styles.styleName}>{s.styleName}</Text>
                <View className={styles.styleBottom}>
                  <Text className={styles.stylePrice}>¥{order.totalAmount}</Text>
                  <Text className={styles.styleQty}>实付 ¥{order.paidAmount}</Text>
                </View>
              </View>
            </View>
          ))}

          {order.styles.length > 1 && (
            <Text style={{ fontSize: '$font-size-xs', color: '$color-text-tertiary', marginTop: '$spacing-sm', textAlign: 'right' }}>
              共{order.styles.length}件商品
            </Text>
          )}

          {existingRefund && (
            <View className={styles.amountInfo}>
              <Text className={styles.amountLabel}>申请退款金额</Text>
              <Text className={styles.amountValue}>¥{existingRefund.refundAmount}</Text>
            </View>
          )}
        </View>

        {!isProcessed && (
          <>
            <View className={styles.refundTypeSection}>
              <View className={styles.cardTitle}>
                <View className={styles.titleBar}></View>
                <Text>退款类型</Text>
              </View>

              <View className={styles.typeList}>
                {REFUND_TYPES.map(type => (
                  <View
                    key={type.key}
                    className={classnames(styles.typeItem, refundType === type.key && styles.selected)}
                    onClick={() => setRefundType(type.key)}
                  >
                    <View className={styles.typeLeft}>
                      <View className={classnames(styles.radioDot, refundType === type.key && styles.selected)}>
                        {refundType === type.key && <View className={styles.radioInner}></View>}
                      </View>
                      <View className={styles.typeText}>
                        <Text className={styles.typeName}>{type.name}</Text>
                        <Text className={styles.typeDesc}>{type.desc}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {refundType !== 'exchange' && (
                <View className={styles.amountInput}>
                  <Text className={styles.amountLabel}>退款金额</Text>
                  <View className={styles.amountBox}>
                    <Text className={styles.currency}>¥</Text>
                    <Input
                      className={styles.inputField}
                      type="digit"
                      value={refundAmount}
                      onInput={(e) => setRefundAmount(e.detail.value)}
                      maxlength={8}
                    />
                  </View>
                </View>
              )}
            </View>

            <View className={styles.reasonSection}>
              <View className={styles.cardTitle}>
                <View className={styles.titleBar}></View>
                <Text>退款原因</Text>
              </View>

              <View className={styles.reasonList}>
                {REFUND_REASONS.map(reason => (
                  <View
                    key={reason}
                    className={classnames(styles.reasonTag, selectedReason === reason && styles.selected)}
                    onClick={() => setSelectedReason(selectedReason === reason ? '' : reason)}
                  >
                    <Text>{reason}</Text>
                    {selectedReason === reason && (
                      <Text className={styles.checkmark}>✓</Text>
                    )}
                  </View>
                ))}
              </View>

              <Textarea
                className={styles.remarkInput}
                value={customReason}
                onInput={(e) => setCustomReason(e.detail.value)}
                maxlength={300}
                placeholder="详细说明退款原因（选填）..."
              />
            </View>

            <View className={styles.photosSection}>
              <View className={styles.cardTitle}>
                <View className={styles.titleBar}></View>
                <Text>凭证照片</Text>
                <Text style={{ fontSize: '$font-size-xs', color: '$color-text-tertiary', fontWeight: 'normal', marginLeft: 'auto' }}>
                  {photos.length}/9
                </Text>
              </View>

              <View className={styles.photosGrid}>
                {photos.map((photo, idx) => (
                  <View key={idx} className={styles.photoItem}>
                    <Image src={photo} mode="aspectFill" />
                    <View className={styles.removeBtn} onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(idx);
                    }}>×</View>
                  </View>
                ))}
                {photos.length < 9 && (
                  <View className={styles.photoItem} onClick={handleAddPhoto}>
                    +
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {processLog.length > 0 && (
          <View className={styles.processLog}>
            <View className={styles.cardTitle}>
              <View className={styles.titleBar}></View>
              <Text>处理进度</Text>
            </View>

            <View className={styles.timeline}>
              {processLog.map((log, idx) => (
                <View key={idx} className={styles.timelineItem}>
                  <View className={styles.timelineDot}></View>
                  <View>
                    <Text className={styles.timelineLabel}>{log.label}</Text>
                    {log.time && <Text className={styles.timelineTime}>{log.time}</Text>}
                    {log.user && <Text className={styles.timelineUser}>操作人：{log.user}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        {isProcessed ? (
          <>
            {existingRefund?.status === 'pending' ? (
              <>
                <Button className={classnames(styles.btn, styles.btnReject)} onClick={handleReject}>
                  驳回申请
                </Button>
                <Button className={classnames(styles.btn, styles.btnApprove)} onClick={handleApprove}>
                  通过退款
                </Button>
              </>
            ) : (
              <>
                <Button className={classnames(styles.btn, styles.btnGhost)} onClick={() => Taro.navigateBack()}>
                  返回
                </Button>
                <Button
                  className={classnames(styles.btn, styles.btnSubmit)}
                  onClick={() => Taro.showToast({ title: '联系客户', icon: 'none' })}
                >
                  联系客户
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Button className={classnames(styles.btn, styles.btnGhost)} onClick={() => Taro.navigateBack()}>
              取消
            </Button>
            <Button className={classnames(styles.btn, styles.btnSubmit)} onClick={handleSubmit}>
              提交退款申请
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default RefundPage;
