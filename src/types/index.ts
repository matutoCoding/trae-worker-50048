export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'making'
  | 'completed'
  | 'delivering'
  | 'delivered'
  | 'cancelled'
  | 'refunding'
  | 'refunded';

export type StyleCategory = 'wreath' | 'basket' | 'bouquet' | 'stand' | 'arrangement';

export type UrgencyLevel = 'normal' | 'urgent' | 'super_urgent';

export interface FuneralStyle {
  id: string;
  name: string;
  category: StyleCategory;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  specifications: string[];
  suitable: string;
  isHot?: boolean;
  isNew?: boolean;
  stock: number;
  makeTime: string;
}

export interface CoupletContent {
  upper: string;
  lower: string;
  horizontal?: string;
  decedentsName: string;
  senderName: string;
  senderRelation: string;
  fontStyle: 'standard' | 'elegant' | 'solemn';
}

export interface OrderAddress {
  funeralHome: string;
  funeralHall: string;
  address: string;
  contactName: string;
  contactPhone: string;
  deliveryDate: string;
  deliveryTime: string;
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  skillLevel: 'senior' | 'intermediate' | 'junior';
  specialty: StyleCategory[];
  todayTasks: number;
  phone: string;
  status: 'idle' | 'working' | 'offline';
}

export interface DispatchTask {
  workerId: string;
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  status: 'assigned' | 'in_progress' | 'completed';
  notes?: string;
}

export interface DeliveryStaff {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: 'idle' | 'delivering';
  todayDeliveries: number;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  staffId: string;
  route: string[];
  estimatedArrival: string;
  actualArrival?: string;
  status: 'pending' | 'picked' | 'en_route' | 'arrived' | 'delivered';
  signedBy?: string;
  signedAt?: string;
  photos?: string[];
  notes?: string;
}

export interface ArrangementRecord {
  id: string;
  orderId: string;
  items: { name: string; quantity: number; position?: string }[];
  photos: string[];
  staff: string;
  funeralHomeContact: string;
  createdAt: string;
  completedAt?: string;
  remarks?: string;
}

export interface FuneralHome {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  cooperationLevel: 'strategic' | 'standard' | 'temporary';
}

export interface RefundOrder {
  id: string;
  orderId: string;
  reason: string;
  type: 'full' | 'partial' | 'exchange';
  refundAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  applyAt: string;
  approvedAt?: string;
  processedBy?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  createdAt: string;
  status: OrderStatus;
  urgency: UrgencyLevel;
  styles: {
    styleId: string;
    styleName: string;
    styleImage: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  couplet?: CoupletContent;
  address: OrderAddress;
  arrangementRequired: boolean;
  dispatchTasks: DispatchTask[];
  delivery?: DeliveryOrder;
  arrangement?: ArrangementRecord;
  subtotal: number;
  arrangementFee: number;
  deliveryFee: number;
  urgentFee: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: 'wechat' | 'alipay' | 'cash' | 'bank';
  customerName: string;
  customerPhone: string;
  customerRemark?: string;
  internalRemark?: string;
  refund?: RefundOrder;
}

export interface DailyStat {
  date: string;
  orderCount: number;
  revenue: number;
  deliveredCount: number;
  cancelledCount: number;
  urgentCount: number;
}

export interface MonthlySettlement {
  month: string;
  totalOrders: number;
  totalRevenue: number;
  totalRefund: number;
  netRevenue: number;
  byCategory: { category: StyleCategory; count: number; revenue: number }[];
  byFuneralHome: { name: string; count: number; revenue: number }[];
  dailyStats: DailyStat[];
}

export type TabKey = 'all' | OrderStatus;

export interface FilterOption {
  key: string;
  label: string;
}
