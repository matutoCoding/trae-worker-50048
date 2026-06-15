import { Order, DailyStat, MonthlySettlement } from '@/types';

export const orders: Order[] = [
  {
    id: 'o001',
    orderNo: 'BY20260615001',
    createdAt: '2026-06-15 08:30:00',
    status: 'delivering',
    urgency: 'urgent',
    styles: [
      {
        styleId: 's001',
        styleName: '高雅白花圈',
        styleImage: 'https://picsum.photos/id/225/300/300',
        quantity: 2,
        unitPrice: 880,
        subtotal: 1760
      },
      {
        styleId: 's004',
        styleName: '典雅花篮',
        styleImage: 'https://picsum.photos/id/582/300/300',
        quantity: 1,
        unitPrice: 580,
        subtotal: 580
      }
    ],
    couplet: {
      upper: '美德长存典范永在',
      lower: '音容宛在风范犹存',
      horizontal: '永垂不朽',
      decedentsName: '王老先生',
      senderName: '李明',
      senderRelation: '外甥',
      fontStyle: 'solemn'
    },
    address: {
      funeralHome: '市第一殡仪馆',
      funeralHall: '安魂厅',
      address: '城北区安宁路888号',
      contactName: '王女士',
      contactPhone: '138****1234',
      deliveryDate: '2026-06-15',
      deliveryTime: '10:30'
    },
    arrangementRequired: true,
    dispatchTasks: [
      {
        workerId: 'w001',
        assignedAt: '2026-06-15 08:35:00',
        startedAt: '2026-06-15 08:40:00',
        status: 'completed',
        notes: '挽联字体需加粗'
      },
      {
        workerId: 'w003',
        assignedAt: '2026-06-15 08:35:00',
        startedAt: '2026-06-15 08:45:00',
        completedAt: '2026-06-15 09:50:00',
        status: 'completed'
      }
    ],
    delivery: {
      id: 'del001',
      orderId: 'o001',
      staffId: 'd001',
      route: ['花店', '北二环', '安宁路', '市第一殡仪馆'],
      estimatedArrival: '2026-06-15 10:30',
      status: 'en_route',
      notes: '注意花篮摆放方向'
    },
    subtotal: 2340,
    arrangementFee: 300,
    deliveryFee: 80,
    urgentFee: 200,
    discountAmount: 0,
    totalAmount: 2920,
    paidAmount: 2920,
    paymentMethod: 'wechat',
    customerName: '李明',
    customerPhone: '139****8888',
    customerRemark: '请务必在10:30前送到',
    internalRemark: '客户是老客户介绍的，注意服务质量'
  },
  {
    id: 'o002',
    orderNo: 'BY20260615002',
    createdAt: '2026-06-15 09:15:00',
    status: 'making',
    urgency: 'super_urgent',
    styles: [
      {
        styleId: 's008',
        styleName: '三脚架立式花牌',
        styleImage: 'https://picsum.photos/id/598/300/400',
        quantity: 1,
        unitPrice: 1280,
        subtotal: 1280
      }
    ],
    couplet: {
      upper: '一生行好事',
      lower: '千古流芳名',
      decedentsName: '赵老太',
      senderName: '杭州市商会',
      senderRelation: '',
      fontStyle: 'standard'
    },
    address: {
      funeralHome: '市第二殡仪馆',
      funeralHall: '福寿厅',
      address: '城西区福寿街168号',
      contactName: '赵先生',
      contactPhone: '137****5678',
      deliveryDate: '2026-06-15',
      deliveryTime: '11:00'
    },
    arrangementRequired: false,
    dispatchTasks: [
      {
        workerId: 'w002',
        assignedAt: '2026-06-15 09:20:00',
        startedAt: '2026-06-15 09:25:00',
        status: 'in_progress'
      }
    ],
    subtotal: 1280,
    arrangementFee: 0,
    deliveryFee: 100,
    urgentFee: 500,
    discountAmount: 0,
    totalAmount: 1880,
    paidAmount: 1880,
    paymentMethod: 'alipay',
    customerName: '张伟',
    customerPhone: '136****2222',
    customerRemark: '特别急，请加急处理',
    internalRemark: '超级加急，优先处理！'
  },
  {
    id: 'o003',
    orderNo: 'BY20260615003',
    createdAt: '2026-06-15 09:45:00',
    status: 'confirmed',
    urgency: 'normal',
    styles: [
      {
        styleId: 's005',
        styleName: '白色花篮一对',
        styleImage: 'https://picsum.photos/id/225/300/300',
        quantity: 1,
        unitPrice: 980,
        subtotal: 980
      },
      {
        styleId: 's006',
        styleName: '追思花束',
        styleImage: 'https://picsum.photos/id/230/300/300',
        quantity: 3,
        unitPrice: 280,
        subtotal: 840
      }
    ],
    address: {
      funeralHome: '安福园殡仪服务中心',
      funeralHall: '祥和厅',
      address: '城南区祥和大道256号',
      contactName: '刘女士',
      contactPhone: '135****3333',
      deliveryDate: '2026-06-16',
      deliveryTime: '08:30'
    },
    arrangementRequired: false,
    dispatchTasks: [],
    subtotal: 1820,
    arrangementFee: 0,
    deliveryFee: 60,
    urgentFee: 0,
    discountAmount: 50,
    totalAmount: 1830,
    paidAmount: 0,
    customerName: '刘强',
    customerPhone: '138****4444'
  },
  {
    id: 'o004',
    orderNo: 'BY20260614008',
    createdAt: '2026-06-14 14:20:00',
    status: 'delivered',
    urgency: 'normal',
    styles: [
      {
        styleId: 's010',
        styleName: '灵堂全套布置',
        styleImage: 'https://picsum.photos/id/582/400/300',
        quantity: 1,
        unitPrice: 5800,
        subtotal: 5800
      }
    ],
    couplet: {
      upper: '寿高德劭',
      lower: '松青柏翠',
      decedentsName: '孙老先生',
      senderName: '全家敬挽',
      senderRelation: '',
      fontStyle: 'elegant'
    },
    address: {
      funeralHome: '市第一殡仪馆',
      funeralHall: '永安厅',
      address: '城北区安宁路888号',
      contactName: '孙先生',
      contactPhone: '133****5555',
      deliveryDate: '2026-06-15',
      deliveryTime: '07:00'
    },
    arrangementRequired: true,
    dispatchTasks: [
      {
        workerId: 'w001',
        assignedAt: '2026-06-14 14:30:00',
        startedAt: '2026-06-15 05:00:00',
        completedAt: '2026-06-15 06:30:00',
        status: 'completed'
      },
      {
        workerId: 'w004',
        assignedAt: '2026-06-14 14:30:00',
        startedAt: '2026-06-15 05:00:00',
        completedAt: '2026-06-15 06:45:00',
        status: 'completed'
      }
    ],
    delivery: {
      id: 'del004',
      orderId: 'o004',
      staffId: 'd003',
      route: ['花店', '安宁路', '市第一殡仪馆'],
      estimatedArrival: '2026-06-15 07:00',
      actualArrival: '2026-06-15 06:55',
      status: 'delivered',
      signedBy: '孙先生',
      signedAt: '2026-06-15 07:00',
      photos: ['https://picsum.photos/id/582/600/400']
    },
    arrangement: {
      id: 'arr001',
      orderId: 'o004',
      items: [
        { name: '花圈', quantity: 4, position: '灵堂四角' },
        { name: '花篮', quantity: 6, position: '两侧' },
        { name: '台面花艺', quantity: 2, position: '追思台' },
        { name: '背景装饰', quantity: 1, position: '正后方' }
      ],
      photos: [
        'https://picsum.photos/id/225/600/400',
        'https://picsum.photos/id/230/600/400'
      ],
      staff: '张师傅,赵师傅',
      funeralHomeContact: '王主任',
      createdAt: '2026-06-15 05:00:00',
      completedAt: '2026-06-15 06:50:00',
      remarks: '灵堂布置效果非常好，家属很满意'
    },
    subtotal: 5800,
    arrangementFee: 800,
    deliveryFee: 150,
    urgentFee: 0,
    discountAmount: 300,
    totalAmount: 6450,
    paidAmount: 6450,
    paymentMethod: 'bank',
    customerName: '孙先生',
    customerPhone: '132****6666',
    customerRemark: '请安排有经验的师傅布置',
    internalRemark: 'VIP客户，服务一定要到位'
  },
  {
    id: 'o005',
    orderNo: 'BY20260614007',
    createdAt: '2026-06-14 10:00:00',
    status: 'pending',
    urgency: 'normal',
    styles: [
      {
        styleId: 's002',
        styleName: '黄白菊花花圈',
        styleImage: 'https://picsum.photos/id/225/300/300',
        quantity: 1,
        unitPrice: 680,
        subtotal: 680
      }
    ],
    couplet: {
      upper: '流芳百世',
      lower: '遗爱千秋',
      decedentsName: '周女士',
      senderName: '单位同事',
      senderRelation: '同事',
      fontStyle: 'standard'
    },
    address: {
      funeralHome: '天堂殡仪服务站',
      funeralHall: '永乐厅',
      address: '城东区永乐路100号',
      contactName: '吴先生',
      contactPhone: '131****7777',
      deliveryDate: '2026-06-16',
      deliveryTime: '09:00'
    },
    arrangementRequired: false,
    dispatchTasks: [],
    subtotal: 680,
    arrangementFee: 0,
    deliveryFee: 50,
    urgentFee: 0,
    discountAmount: 0,
    totalAmount: 730,
    paidAmount: 200,
    customerName: '吴先生',
    customerPhone: '130****8888',
    internalRemark: '已付定金，货到付余款'
  },
  {
    id: 'o006',
    orderNo: 'BY20260613005',
    createdAt: '2026-06-13 15:30:00',
    status: 'cancelled',
    urgency: 'normal',
    styles: [
      {
        styleId: 's003',
        styleName: '双层豪华花圈',
        styleImage: 'https://picsum.photos/id/598/300/300',
        quantity: 1,
        unitPrice: 1580,
        subtotal: 1580
      }
    ],
    address: {
      funeralHome: '市第一殡仪馆',
      funeralHall: '祥和厅',
      address: '城北区安宁路888号',
      contactName: '陈先生',
      contactPhone: '139****9999',
      deliveryDate: '2026-06-14',
      deliveryTime: '10:00'
    },
    arrangementRequired: false,
    dispatchTasks: [],
    subtotal: 1580,
    arrangementFee: 0,
    deliveryFee: 80,
    urgentFee: 0,
    discountAmount: 0,
    totalAmount: 1660,
    paidAmount: 500,
    customerName: '陈先生',
    customerPhone: '138****0000',
    refund: {
      id: 'r001',
      orderId: 'o006',
      reason: '仪式时间变更，不需要了',
      type: 'partial',
      refundAmount: 300,
      status: 'completed',
      applyAt: '2026-06-13 18:00:00',
      approvedAt: '2026-06-13 18:30:00',
      processedBy: '管理员'
    }
  },
  {
    id: 'o007',
    orderNo: 'BY20260615004',
    createdAt: '2026-06-15 10:20:00',
    status: 'completed',
    urgency: 'urgent',
    styles: [
      {
        styleId: 's007',
        styleName: '高档百合捧花',
        styleImage: 'https://picsum.photos/id/225/300/300',
        quantity: 2,
        unitPrice: 480,
        subtotal: 960
      }
    ],
    couplet: {
      upper: '痛失吾爱',
      lower: '永志不忘',
      decedentsName: '爱妻',
      senderName: '夫君',
      senderRelation: '丈夫',
      fontStyle: 'elegant'
    },
    address: {
      funeralHome: '市第二殡仪馆',
      funeralHall: '追思厅',
      address: '城西区福寿街168号',
      contactName: '黄先生',
      contactPhone: '137****1111',
      deliveryDate: '2026-06-15',
      deliveryTime: '12:00'
    },
    arrangementRequired: false,
    dispatchTasks: [
      {
        workerId: 'w005',
        assignedAt: '2026-06-15 10:25:00',
        startedAt: '2026-06-15 10:30:00',
        completedAt: '2026-06-15 11:20:00',
        status: 'completed'
      }
    ],
    delivery: {
      id: 'del007',
      orderId: 'o007',
      staffId: 'd002',
      route: ['花店', '城西路', '市第二殡仪馆'],
      estimatedArrival: '2026-06-15 12:00',
      actualArrival: '2026-06-15 11:50',
      status: 'delivered',
      signedBy: '黄先生',
      signedAt: '2026-06-15 11:55'
    },
    subtotal: 960,
    arrangementFee: 0,
    deliveryFee: 60,
    urgentFee: 100,
    discountAmount: 0,
    totalAmount: 1120,
    paidAmount: 1120,
    paymentMethod: 'wechat',
    customerName: '黄先生',
    customerPhone: '136****2222',
    customerRemark: '请用缎带包装精美一些'
  },
  {
    id: 'o008',
    orderNo: 'BY20260615005',
    createdAt: '2026-06-15 11:00:00',
    status: 'pending',
    urgency: 'normal',
    styles: [
      {
        styleId: 's012',
        styleName: '遗像花艺框',
        styleImage: 'https://picsum.photos/id/230/300/300',
        quantity: 1,
        unitPrice: 680,
        subtotal: 680
      },
      {
        styleId: 's011',
        styleName: '棺盖花艺',
        styleImage: 'https://picsum.photos/id/225/400/200',
        quantity: 1,
        unitPrice: 1880,
        subtotal: 1880
      }
    ],
    address: {
      funeralHome: '市第一殡仪馆',
      funeralHall: '安息厅',
      address: '城北区安宁路888号',
      contactName: '徐先生',
      contactPhone: '135****3333',
      deliveryDate: '2026-06-16',
      deliveryTime: '06:30'
    },
    arrangementRequired: true,
    dispatchTasks: [],
    subtotal: 2560,
    arrangementFee: 200,
    deliveryFee: 100,
    urgentFee: 0,
    discountAmount: 100,
    totalAmount: 2760,
    paidAmount: 1000,
    customerName: '徐先生',
    customerPhone: '134****4444',
    internalRemark: '明早很早，提醒师傅提前准备'
  }
];

export const orderStatusNames: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  making: '扎制中',
  completed: '扎制完成',
  delivering: '配送中',
  delivered: '已送达',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款'
};

export const urgencyNames: Record<string, string> = {
  normal: '普通',
  urgent: '加急',
  super_urgent: '特急'
};

export const paymentMethodNames: Record<string, string> = {
  wechat: '微信',
  alipay: '支付宝',
  cash: '现金',
  bank: '银行转账'
};

export const dispatchStatusNames: Record<string, string> = {
  assigned: '已派工',
  in_progress: '进行中',
  completed: '已完成'
};

export const deliveryStatusNames: Record<string, string> = {
  pending: '待配送',
  picked: '已取货',
  en_route: '配送中',
  arrived: '已到达',
  delivered: '已签收'
};

export const monthlySettlement: MonthlySettlement = {
  month: '2026-06',
  totalOrders: 86,
  totalRevenue: 286500,
  totalRefund: 3200,
  netRevenue: 283300,
  byCategory: [
    { category: 'wreath', count: 38, revenue: 42180 },
    { category: 'basket', count: 24, revenue: 21520 },
    { category: 'stand', count: 12, revenue: 18360 },
    { category: 'bouquet', count: 45, revenue: 15820 },
    { category: 'arrangement', count: 8, revenue: 46400 }
  ],
  byFuneralHome: [
    { name: '市第一殡仪馆', count: 35, revenue: 128500 },
    { name: '市第二殡仪馆', count: 26, revenue: 86200 },
    { name: '安福园殡仪服务中心', count: 15, revenue: 42800 },
    { name: '天堂殡仪服务站', count: 10, revenue: 29000 }
  ],
  dailyStats: [
    { date: '06-09', orderCount: 8, revenue: 22400, deliveredCount: 7, cancelledCount: 0, urgentCount: 2 },
    { date: '06-10', orderCount: 10, revenue: 31200, deliveredCount: 9, cancelledCount: 1, urgentCount: 3 },
    { date: '06-11', orderCount: 12, revenue: 38600, deliveredCount: 11, cancelledCount: 0, urgentCount: 4 },
    { date: '06-12', orderCount: 9, revenue: 28500, deliveredCount: 8, cancelledCount: 1, urgentCount: 2 },
    { date: '06-13', orderCount: 11, revenue: 35800, deliveredCount: 10, cancelledCount: 1, urgentCount: 3 },
    { date: '06-14', orderCount: 14, revenue: 48200, deliveredCount: 13, cancelledCount: 0, urgentCount: 5 },
    { date: '06-15', orderCount: 8, revenue: 24800, deliveredCount: 4, cancelledCount: 0, urgentCount: 4 }
  ]
};
