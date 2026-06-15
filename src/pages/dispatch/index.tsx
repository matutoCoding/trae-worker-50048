import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useOrderStore, now } from '@/store/orderStore';
import { workers, skillLevelNames, workerStatusNames } from '@/data/workers';
import { categoryNames } from '@/data/styles';
import { DispatchTask, OrderStatus } from '@/types';

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getDateFromNow = (hours: number): string => {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return formatDateTime(d);
};

const formatNowShort = (): string => {
  const full = now();
  return full.slice(0, 16);
};

const DispatchPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id || 'o001';

  const orders = useOrderStore(state => state.orders);
  const dispatchWorkers = useOrderStore(state => state.dispatchWorkers);
  const updateDispatchTask = useOrderStore(state => state.updateDispatchTask);
  const updateOrderStatus = useOrderStore(state => state.updateOrderStatus);

  const order = useMemo(() =>
    orders.find(o => o.id === orderId) || orders[1],
    [orderId, orders]
  );

  const [selectedWorker, setSelectedWorker] = useState<string | null>(
    order.dispatchTasks[0]?.workerId || null
  );
  const [notes, setNotes] = useState(order.dispatchTasks[0]?.notes || '');
  const [scheduledStart, setScheduledStart] = useState(
    order.dispatchTasks[0]?.scheduledStart || formatDateTime(new Date())
  );
  const [scheduledEnd, setScheduledEnd] = useState(
    order.dispatchTasks[0]?.scheduledEnd || getDateFromNow(1)
  );

  const availableWorkers = useMemo(() => {
    return workers.map(w => {
      const isAssigned = order.dispatchTasks.some(t => t.workerId === w.id);
      return { worker: w, isAssigned };
    });
  }, [order]);

  const progress = useMemo(() => {
    const tasks = order.dispatchTasks;
    if (tasks.length === 0) return [];

    const startedTask = tasks.find(t => t.startedAt);
    const completedTask = tasks.find(t => t.completedAt);
    const notedTask = tasks.find(t => t.notes);
    const taskWithSchedule = tasks.find(t => t.scheduledStart || t.scheduledEnd);

    return [
      {
        label: '派工分配',
        status: tasks.length > 0 ? 'done' : 'pending',
        time: tasks[0]?.assignedAt?.slice(5, 16),
        worker: tasks[0] ? workers.find(w => w.id === tasks[0].workerId)?.name : null
      },
      {
        label: '开始扎制',
        status: tasks.some(t => t.startedAt) ? 'done' : (order.status === 'making' ? 'active' : 'pending'),
        time: startedTask?.startedAt?.slice(11, 16),
        worker: startedTask ? workers.find(w => w.id === startedTask.workerId)?.name : null
      },
      {
        label: '扎制完成',
        status: tasks.every(t => t.status === 'completed') ? 'done' : 'pending',
        time: completedTask?.completedAt?.slice(11, 16),
        worker: completedTask ? workers.find(w => w.id === completedTask.workerId)?.name : null,
        notes: notedTask?.notes,
        scheduledStart: taskWithSchedule?.scheduledStart,
        scheduledEnd: taskWithSchedule?.scheduledEnd
      }
    ];
  }, [order]);

  const resolveScheduledStart = (): string => {
    if (scheduledStart === '立即开始') {
      return formatNowShort();
    }
    return scheduledStart;
  };

  const resolveScheduledEnd = (): string => {
    if (scheduledEnd === '预计1小时') {
      return getDateFromNow(1);
    }
    return scheduledEnd;
  };

  const handleAssign = () => {
    if (!selectedWorker) {
      Taro.showToast({ title: '请选择扎制师傅', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认派工？',
      content: `派工给 ${workers.find(w => w.id === selectedWorker)?.name}`,
      success: (res) => {
        if (res.confirm) {
          const task: DispatchTask = {
            workerId: selectedWorker,
            assignedAt: now(),
            status: 'assigned',
            notes: notes || undefined,
            scheduledStart: resolveScheduledStart(),
            scheduledEnd: resolveScheduledEnd()
          };
          const newStatus: OrderStatus = order.status === 'pending' ? 'confirmed' : order.status;
          dispatchWorkers(orderId, [task], newStatus);
          Taro.showToast({
            title: '派工成功',
            icon: 'success',
            success: () => {
              setTimeout(() => Taro.navigateBack(), 1500);
            }
          });
        }
      }
    });
  };

  const handleUpdateStatus = (action: 'start' | 'complete') => {
    const task = order.dispatchTasks[0];
    if (!task) return;
    const msg = action === 'start' ? '确认开始扎制？' : '确认扎制完成？';
    Taro.showModal({
      title: '操作确认',
      content: msg,
      success: (res) => {
        if (res.confirm) {
          if (action === 'start') {
            updateDispatchTask(orderId, task.workerId, {
              startedAt: now(),
              status: 'in_progress'
            });
            updateOrderStatus(orderId, 'making');
          } else {
            updateDispatchTask(orderId, task.workerId, {
              completedAt: now(),
              status: 'completed'
            });
            updateOrderStatus(orderId, 'completed');
          }
          Taro.showToast({
            title: action === 'start' ? '已开始扎制' : '扎制完成',
            icon: 'success',
            success: () => {
              setTimeout(() => Taro.navigateBack(), 1500);
            }
          });
        }
      }
    });
  };

  const getUrgencyText = () => {
    switch (order.urgency) {
      case 'super_urgent': return '特急';
      case 'urgent': return '加急';
      default: return '';
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.orderSummary}>
          <View className={styles.orderTop}>
            <View>
              <Text className={styles.orderNo}>订单 {order.orderNo}</Text>
            </View>
            {order.urgency !== 'normal' && (
              <View className={styles.orderTags}>
                <View className={styles.urgentTag}>{getUrgencyText()}</View>
              </View>
            )}
          </View>

          <View className={styles.orderItems}>
            {order.styles.map((s, idx) => (
              <View key={idx} className={styles.orderItem}>
                <View className={styles.itemImg}>
                  <Image src={s.styleImage} mode="aspectFill" />
                </View>
                <Text className={styles.itemName}>{s.styleName}</Text>
                <Text className={styles.itemQty}>x{s.quantity}</Text>
              </View>
            ))}
          </View>

          <View className={styles.deliveryInfo}>
            📍 {order.address.funeralHome} · {order.address.funeralHall}{'\n'}
            ⏰ {order.address.deliveryDate} {order.address.deliveryTime} 送达
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>扎制进度</Text>
          </View>

          <View className={styles.progressSection}>
            {progress.map((step, idx) => (
              <View key={idx} className={styles.progressItem}>
                <View className={classnames(
                  styles.progressDot,
                  step.status === 'done' && styles.done,
                  step.status === 'active' && styles.active
                )}>
                  {step.status === 'done' ? '✓' : idx + 1}
                </View>
                {idx < progress.length - 1 && <View className={styles.progressLine}></View>}
                <View className={styles.progressContent}>
                  <View className={classnames(
                    styles.progressLabel,
                    step.status === 'done' && styles.done,
                    step.status === 'active' && styles.active
                  )}>
                    <Text>{step.label}</Text>
                    {step.worker && (
                      <Text className={styles.workerNameInline}>· {step.worker}</Text>
                    )}
                  </View>
                  {step.time && (
                    <Text className={styles.progressTime}>{step.time}</Text>
                  )}
                  {step.scheduledStart && (
                    <View className={styles.progressNotes}>预计开始: {step.scheduledStart}</View>
                  )}
                  {step.scheduledEnd && (
                    <View className={styles.progressNotes}>预计完成: {step.scheduledEnd}</View>
                  )}
                  {step.notes && (
                    <View className={styles.progressNotes}>{step.notes}</View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>选择扎制师傅</Text>
            <Button className={styles.assignBtn} onClick={handleAssign}>
              {selectedWorker ? '重新派工' : '确认派工'}
            </Button>
          </View>

          <View className={styles.workerList}>
            {availableWorkers.map(({ worker }) => (
              <View
                key={worker.id}
                className={classnames(
                  styles.workerItem,
                  selectedWorker === worker.id && styles.selected
                )}
                onClick={() => setSelectedWorker(worker.id)}
              >
                <View className={styles.workerAvatar}>
                  <Image src={worker.avatar} mode="aspectFill" />
                  <View className={classnames(
                    styles.statusDot,
                    worker.status === 'working' ? styles.dotWorking :
                    worker.status === 'idle' ? styles.dotIdle : styles.dotOffline
                  )}></View>
                </View>
                <View className={styles.workerInfo}>
                  <View className={styles.workerName}>
                    <Text>{worker.name}</Text>
                    <View className={styles.levelTag}>
                      {skillLevelNames[worker.skillLevel]}
                    </View>
                  </View>
                  <View className={styles.workerMeta}>
                    <Text>{workerStatusNames[worker.status]}</Text>
                    {worker.specialty.map(cat => (
                      <View key={cat} className={styles.specialty}>
                        {categoryNames[cat]}
                      </View>
                    ))}
                  </View>
                </View>
                <View className={styles.taskBadge}>
                  今日{worker.todayTasks}单
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>排期设置</Text>
          </View>

          <View className={styles.scheduleSection}>
            <View
              className={styles.timeInput}
              onClick={() => Taro.showToast({ title: '选择开始时间', icon: 'none' })}
            >
              <Text className={styles.timeLabel}>开始时间</Text>
              <Text className={styles.timeValue}>{scheduledStart}</Text>
            </View>
            <View
              className={styles.timeInput}
              onClick={() => Taro.showToast({ title: '选择完成时间', icon: 'none' })}
            >
              <Text className={styles.timeLabel}>预计完成</Text>
              <Text className={styles.timeValue}>{scheduledEnd}</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionTitle}>
            <Text>扎制备注</Text>
          </View>
          <Textarea
            className={styles.notesInput}
            value={notes}
            onInput={(e) => setNotes(e.detail.value)}
            maxlength={200}
            placeholder="特殊要求、挽联格式注意事项等..."
          />
        </View>
      </View>

      <View className={styles.footer}>
        {order.status === 'confirmed' ? (
          <Button className={styles.btnGhost} onClick={() => Taro.navigateBack()}>取消</Button>
        ) : (
          <Button
            className={classnames(styles.btn, styles.btnGhost)}
            onClick={() => handleUpdateStatus('start')}
          >
            开始扎制
          </Button>
        )}
        {order.status === 'making' ? (
          <Button
            className={classnames(styles.btn, styles.btnPrimary)}
            onClick={() => handleUpdateStatus('complete')}
          >
            扎制完成
          </Button>
        ) : (
          <Button
            className={classnames(styles.btn, styles.btnPrimary)}
            onClick={handleAssign}
          >
            {order.dispatchTasks.length > 0 ? '更新派工' : '确认派工'}
          </Button>
        )}
      </View>
    </View>
  );
};

export default DispatchPage;
