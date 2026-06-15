import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { orders } from '@/data/orders';
import { workers, funeralHomes } from '@/data/workers';

interface ArrangementItem {
  name: string;
  quantity: number;
  position?: string;
  checked: boolean;
}

const ArrangementPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id || 'o004';
  const order = useMemo(() => orders.find(o => o.id === orderId) || orders[3], [orderId]);

  const funeralHome = useMemo(() =>
    funeralHomes.find(f => f.name === order.address.funeralHome) || funeralHomes[0],
    [order]
  );

  const arrangement = order.arrangement;

  const [items, setItems] = useState<ArrangementItem[]>(
    arrangement?.items.map(i => ({ ...i, checked: true })) || [
      { name: '花圈', quantity: 4, position: '灵堂四角', checked: true },
      { name: '花篮', quantity: 6, position: '两侧', checked: true },
      { name: '台面花艺', quantity: 2, position: '追思台', checked: true },
      { name: '背景装饰', quantity: 1, position: '正后方', checked: false }
    ]
  );

  const [photos, setPhotos] = useState<string[]>(arrangement?.photos || []);
  const [staff, setStaff] = useState<string[]>(
    arrangement?.staff?.split(',').map(s => s.trim()) || []
  );
  const [remarks, setRemarks] = useState(arrangement?.remarks || '');

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddPhoto = () => {
    console.log('[Arrangement] handleAddPhoto');
    Taro.showToast({ title: '拍照/选择图片', icon: 'none' });
    const newPhoto = photos.length === 0
      ? 'https://picsum.photos/id/225/600/400'
      : `https://picsum.photos/id/${230 + photos.length * 10}/600/400`;
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleContactHome = () => {
    console.log('[Arrangement] handleContactHome', { phone: funeralHome.contactPhone });
    Taro.makePhoneCall({
      phoneNumber: funeralHome.contactPhone.replace(/\*/g, '1')
    }).catch(() => {
      Taro.showToast({ title: `联系${funeralHome.contactPerson}`, icon: 'none' });
    });
  };

  const handleAddItem = () => {
    console.log('[Arrangement] handleAddItem');
    Taro.showToast({ title: '添加布置项目', icon: 'none' });
  };

  const handleSave = () => {
    console.log('[Arrangement] handleSave', {
      items: items.filter(i => i.checked),
      photos,
      staff,
      remarks
    });

    const checkedCount = items.filter(i => i.checked).length;
    if (checkedCount === 0) {
      Taro.showToast({ title: '请至少选择一项布置', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认完成布置？',
      content: `已布置 ${checkedCount} 项，拍摄 ${photos.length} 张照片`,
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '布置登记完成', icon: 'success' });
            setTimeout(() => Taro.navigateBack(), 1000);
          }, 800);
        }
      }
    });
  };

  const assignedWorkers = staff.length > 0
    ? staff.map(name => workers.find(w => w.name === name) || { id: '', name, avatar: '', skillLevel: '' as any })
    : order.dispatchTasks.map(t => workers.find(w => w.id === t.workerId)).filter(Boolean) as any[];

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.headerCard}>
          <View className={styles.titleRow}>
            <Text className={styles.pageTitle}>灵堂布置登记</Text>
            <View className={styles.statusBadge}>
              {arrangement?.completedAt ? '已完成' : '进行中'}
            </View>
          </View>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>殡仪馆</Text>
              <Text className={styles.infoValue}>{order.address.funeralHome}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>礼堂</Text>
              <Text className={styles.infoValue}>{order.address.funeralHall}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>订单号</Text>
              <Text className={styles.infoValue}>{order.orderNo}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>逝者</Text>
              <Text className={styles.infoValue}>{order.couplet?.decedentsName || '—'}</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar}></View>
            <Text>殡仪馆对接</Text>
          </View>

          <View className={styles.funeralHomeContact}>
            <View className={styles.contactInfo}>
              <Text className={styles.contactName}>{funeralHome.contactPerson}</Text>
              <Text className={styles.contactRole}>
                {funeralHome.name} · {funeralHome.contactPhone}
              </Text>
            </View>
            <Button className={styles.callBtn} onClick={handleContactHome}>
              ☎
            </Button>
          </View>

          <View className={styles.sectionTitle} style={{ marginTop: '$spacing-lg', marginBottom: '$spacing-md' }}>
            <View className={styles.titleBar}></View>
            <Text>现场工作人员</Text>
          </View>

          <View className={styles.staffList}>
            {assignedWorkers.length === 0 ? (
              <Text style={{ fontSize: '$font-size-sm', color: '$color-text-tertiary' }}>
                暂无分配人员
              </Text>
            ) : (
              assignedWorkers.map((w, idx) => (
                <View key={idx} className={styles.staffTag}>
                  <View className={styles.staffAvatar}>
                    <Image src={w.avatar || 'https://picsum.photos/id/64/100/100'} mode="aspectFill" />
                  </View>
                  <Text className={styles.staffName}>{w.name}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar}></View>
            <Text>布置项目清单</Text>
            <Text style={{ fontSize: '$font-size-xs', color: '$color-text-tertiary', fontWeight: 'normal', marginLeft: 'auto' }}>
              已勾选 {items.filter(i => i.checked).length}/{items.length}
            </Text>
          </View>

          <View className={styles.itemList}>
            {items.map((item, idx) => (
              <View key={idx} className={styles.itemRow} onClick={() => toggleItem(idx)}>
                <View className={styles.itemLeft}>
                  <View className={classnames(
                    styles.itemCheckbox,
                    item.checked && styles.checked
                  )}>
                    {item.checked ? '✓' : ''}
                  </View>
                  <View className={styles.itemInfo}>
                    <Text className={styles.itemName}>{item.name}</Text>
                    {item.position && (
                      <Text className={styles.itemPos}>位置：{item.position}</Text>
                    )}
                  </View>
                </View>
                <Text className={styles.itemQty}>× {item.quantity}</Text>
              </View>
            ))}
          </View>

          <View className={styles.addItem} style={{ marginTop: '$spacing-md' }} onClick={handleAddItem}>
            <Text>+ 添加布置项目</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar}></View>
            <Text>现场照片</Text>
            <Text style={{ fontSize: '$font-size-xs', color: '$color-text-tertiary', fontWeight: 'normal', marginLeft: 'auto' }}>
              {photos.length}/9
            </Text>
          </View>

          <View className={styles.photoGrid}>
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

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar}></View>
            <Text>布置备注</Text>
          </View>
          <Textarea
            className={styles.remarks}
            value={remarks}
            onInput={(e) => setRemarks(e.detail.value)}
            maxlength={200}
            placeholder="现场情况、家属特殊要求、与殡仪馆对接事项等..."
          />
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={classnames(styles.btn, styles.btnGhost)} onClick={() => Taro.navigateBack()}>
          取消
        </Button>
        <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleSave}>
          {arrangement?.completedAt ? '更新记录' : '完成布置登记'}
        </Button>
      </View>
    </View>
  );
};

export default ArrangementPage;
