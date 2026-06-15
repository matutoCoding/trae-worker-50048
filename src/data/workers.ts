import { Worker, DeliveryStaff, FuneralHome } from '@/types';

export const workers: Worker[] = [
  {
    id: 'w001',
    name: '张师傅',
    avatar: 'https://picsum.photos/id/64/200/200',
    skillLevel: 'senior',
    specialty: ['wreath', 'stand', 'arrangement'],
    todayTasks: 3,
    phone: '138****1234',
    status: 'working'
  },
  {
    id: 'w002',
    name: '李师傅',
    avatar: 'https://picsum.photos/id/91/200/200',
    skillLevel: 'senior',
    specialty: ['wreath', 'basket'],
    todayTasks: 2,
    phone: '139****5678',
    status: 'working'
  },
  {
    id: 'w003',
    name: '王师傅',
    avatar: 'https://picsum.photos/id/177/200/200',
    skillLevel: 'intermediate',
    specialty: ['basket', 'bouquet'],
    todayTasks: 4,
    phone: '137****9012',
    status: 'working'
  },
  {
    id: 'w004',
    name: '赵师傅',
    avatar: 'https://picsum.photos/id/338/200/200',
    skillLevel: 'intermediate',
    specialty: ['wreath', 'arrangement'],
    todayTasks: 1,
    phone: '136****3456',
    status: 'idle'
  },
  {
    id: 'w005',
    name: '陈师傅',
    avatar: 'https://picsum.photos/id/1027/200/200',
    skillLevel: 'junior',
    specialty: ['bouquet'],
    todayTasks: 2,
    phone: '135****7890',
    status: 'working'
  },
  {
    id: 'w006',
    name: '刘师傅',
    avatar: 'https://picsum.photos/id/237/200/200',
    skillLevel: 'junior',
    specialty: ['basket', 'bouquet'],
    todayTasks: 0,
    phone: '134****2345',
    status: 'idle'
  }
];

export const deliveryStaffs: DeliveryStaff[] = [
  {
    id: 'd001',
    name: '周师傅',
    phone: '138****6666',
    vehicleType: '面包车',
    status: 'delivering',
    todayDeliveries: 5
  },
  {
    id: 'd002',
    name: '吴师傅',
    phone: '139****7777',
    vehicleType: '商务车',
    status: 'idle',
    todayDeliveries: 3
  },
  {
    id: 'd003',
    name: '郑师傅',
    phone: '137****8888',
    vehicleType: '面包车',
    status: 'delivering',
    todayDeliveries: 4
  },
  {
    id: 'd004',
    name: '孙师傅',
    phone: '136****9999',
    vehicleType: '小货车',
    status: 'idle',
    todayDeliveries: 2
  }
];

export const funeralHomes: FuneralHome[] = [
  {
    id: 'fh001',
    name: '市第一殡仪馆',
    address: '城北区安宁路888号',
    contactPerson: '王主任',
    contactPhone: '0571-8888****',
    cooperationLevel: 'strategic'
  },
  {
    id: 'fh002',
    name: '市第二殡仪馆',
    address: '城西区福寿街168号',
    contactPerson: '李主任',
    contactPhone: '0571-8666****',
    cooperationLevel: 'strategic'
  },
  {
    id: 'fh003',
    name: '安福园殡仪服务中心',
    address: '城南区祥和大道256号',
    contactPerson: '张经理',
    contactPhone: '0571-8555****',
    cooperationLevel: 'standard'
  },
  {
    id: 'fh004',
    name: '天堂殡仪服务站',
    address: '城东区永乐路100号',
    contactPerson: '陈站长',
    contactPhone: '0571-8444****',
    cooperationLevel: 'standard'
  }
];

export const skillLevelNames: Record<string, string> = {
  senior: '高级技师',
  intermediate: '中级技师',
  junior: '初级技师'
};

export const cooperationNames: Record<string, string> = {
  strategic: '战略合作',
  standard: '标准合作',
  temporary: '临时合作'
};

export const workerStatusNames: Record<string, string> = {
  idle: '空闲',
  working: '工作中',
  offline: '离线'
};
