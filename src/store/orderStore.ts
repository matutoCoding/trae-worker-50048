import { create } from 'zustand';
import { Order, OrderStatus, UrgencyLevel, DispatchTask, DeliveryOrder } from '@/types';
import { orders as seedOrders } from '@/data/orders';

interface OrderStore {
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  dispatchWorkers: (id: string, tasks: DispatchTask[], status?: OrderStatus) => void;
  updateDispatchTask: (orderId: string, workerId: string, patch: Partial<DispatchTask>) => void;
  updateDelivery: (orderId: string, patch: Partial<DeliveryOrder>, orderStatus?: OrderStatus) => void;
}

const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: seedOrders.map(o => ({ ...o })),

  getOrder: (id) => get().orders.find(o => o.id === id),

  addOrder: (order) => set(state => ({
    orders: [order, ...state.orders]
  })),

  updateOrderStatus: (id, status) => set(state => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),

  dispatchWorkers: (id, tasks, status) => set(state => ({
    orders: state.orders.map(o =>
      o.id === id
        ? { ...o, dispatchTasks: tasks, status: status || o.status }
        : o
    )
  })),

  updateDispatchTask: (orderId, workerId, patch) => set(state => ({
    orders: state.orders.map(o =>
      o.id === orderId
        ? {
            ...o,
            dispatchTasks: o.dispatchTasks.map(t =>
              t.workerId === workerId ? { ...t, ...patch } : t
            )
          }
        : o
    )
  })),

  updateDelivery: (orderId, patch, orderStatus) => set(state => ({
    orders: state.orders.map(o =>
      o.id === orderId
        ? {
            ...o,
            status: orderStatus || o.status,
            delivery: o.delivery
              ? { ...o.delivery, ...patch }
              : { id: `del_${Date.now()}`, orderId, staffId: 'd001', route: ['花店', o.address.funeralHome], estimatedArrival: `${o.address.deliveryDate} ${o.address.deliveryTime}`, status: 'pending', ...patch }
          }
        : o
    )
  }))
}));

export { now };
