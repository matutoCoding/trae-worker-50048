import { FuneralStyle } from '@/types';

export const funeralStyles: FuneralStyle[] = [
  {
    id: 's001',
    name: '高雅白花圈',
    category: 'wreath',
    price: 880,
    originalPrice: 1080,
    description: '以白色百合、菊花为主，搭配绿叶，庄严肃穆高雅大方',
    images: [
      'https://picsum.photos/id/225/600/600',
      'https://picsum.photos/id/230/600/600'
    ],
    specifications: ['直径约80cm', '白百合8枝', '白菊30枝', '配叶点缀'],
    suitable: '适用于各类追悼会、告别仪式',
    isHot: true,
    stock: 20,
    makeTime: '约3小时'
  },
  {
    id: 's002',
    name: '黄白菊花花圈',
    category: 'wreath',
    price: 680,
    description: '传统黄白菊花搭配，经典款式，表达深切哀思',
    images: [
      'https://picsum.photos/id/225/600/600',
      'https://picsum.photos/id/582/600/600'
    ],
    specifications: ['直径约70cm', '黄菊25枝', '白菊25枝', '绿叶适量'],
    suitable: '适用于亲友吊唁、单位敬献',
    stock: 35,
    makeTime: '约2小时'
  },
  {
    id: 's003',
    name: '双层豪华花圈',
    category: 'wreath',
    price: 1580,
    originalPrice: 1880,
    description: '双层设计，百合、玫瑰、菊花搭配，气派庄重',
    images: [
      'https://picsum.photos/id/598/600/600',
      'https://picsum.photos/id/225/600/600'
    ],
    specifications: ['直径约100cm', '白百合15枝', '白玫瑰20枝', '白菊40枝'],
    suitable: '适用于重要场合、单位领导敬献',
    isHot: true,
    isNew: true,
    stock: 8,
    makeTime: '约5小时'
  },
  {
    id: 's004',
    name: '典雅花篮',
    category: 'basket',
    price: 580,
    description: '精美藤编花篮，插花造型优美，摆放灵堂两侧',
    images: [
      'https://picsum.photos/id/582/600/600',
      'https://picsum.photos/id/230/600/600'
    ],
    specifications: ['高约80cm', '白百合6枝', '白菊15枝', '藤编花篮'],
    suitable: '适用于灵堂布置、追思会场',
    stock: 15,
    makeTime: '约2小时'
  },
  {
    id: 's005',
    name: '白色花篮一对',
    category: 'basket',
    price: 980,
    originalPrice: 1200,
    description: '一对白色花篮，成对摆放，更加庄严肃穆',
    images: [
      'https://picsum.photos/id/225/600/600',
      'https://picsum.photos/id/598/600/600'
    ],
    specifications: ['高约75cm x 2', '白百合12枝', '各色白菊50枝', '精美花篮一对'],
    suitable: '适用于灵堂正门两侧、追悼会入口',
    isHot: true,
    stock: 12,
    makeTime: '约3.5小时'
  },
  {
    id: 's006',
    name: '追思花束',
    category: 'bouquet',
    price: 280,
    description: '简约白色花束，手持敬献，表达诚挚追思',
    images: [
      'https://picsum.photos/id/230/600/600'
    ],
    specifications: ['高约40cm', '白玫瑰11枝', '满天星点缀', '白色包装'],
    suitable: '适用于个人追悼、告别仪式手持',
    stock: 50,
    makeTime: '约40分钟'
  },
  {
    id: 's007',
    name: '高档百合捧花',
    category: 'bouquet',
    price: 480,
    originalPrice: 580,
    description: '精选多头白百合，高端大气，深挚追思',
    images: [
      'https://picsum.photos/id/225/600/600'
    ],
    specifications: ['高约50cm', '香水百合10枝', '白色桔梗配花', '高档缎带包装'],
    suitable: '适用于重要亲属、挚友告别',
    isNew: true,
    stock: 18,
    makeTime: '约1小时'
  },
  {
    id: 's008',
    name: '三脚架立式花牌',
    category: 'stand',
    price: 1280,
    description: '立式三脚架花牌，挽联醒目，适合单位敬献',
    images: [
      'https://picsum.photos/id/598/600/800',
      'https://picsum.photos/id/582/600/800'
    ],
    specifications: ['高约180cm', '白菊80枝', '黄菊40枝', '三脚架架身'],
    suitable: '适用于单位、团体、机构敬献',
    isHot: true,
    stock: 10,
    makeTime: '约4小时'
  },
  {
    id: 's009',
    name: '豪华双立柱花牌',
    category: 'stand',
    price: 2680,
    originalPrice: 3200,
    description: '双立柱设计，气派非凡，挽联居中，规格最高',
    images: [
      'https://picsum.photos/id/225/600/900',
      'https://picsum.photos/id/230/600/900'
    ],
    specifications: ['高约200cm', '白百合30枝', '白菊150枝', '双立柱架构'],
    suitable: '适用于重要领导、重大场合',
    stock: 5,
    makeTime: '约6小时'
  },
  {
    id: 's010',
    name: '灵堂全套布置',
    category: 'arrangement',
    price: 5800,
    description: '专业灵堂布置服务，含花圈、花篮、背景、台面花艺全套',
    images: [
      'https://picsum.photos/id/582/800/600',
      'https://picsum.photos/id/598/800/600'
    ],
    specifications: ['花圈4个', '花篮6个', '台面花艺2组', '背景装饰1套'],
    suitable: '适用于整套灵堂装饰布置',
    stock: 3,
    makeTime: '约8小时'
  },
  {
    id: 's011',
    name: '棺盖花艺',
    category: 'arrangement',
    price: 1880,
    originalPrice: 2200,
    description: '覆盖棺盖的精美花艺，白色百合与玫瑰铺满',
    images: [
      'https://picsum.photos/id/225/800/400'
    ],
    specifications: ['长约180cm', '白百合50枝', '白玫瑰80枝', '满天星满铺'],
    suitable: '适用于盖棺仪式、最后送别',
    stock: 6,
    makeTime: '约5小时'
  },
  {
    id: 's012',
    name: '遗像花艺框',
    category: 'arrangement',
    price: 680,
    description: '遗像周围花艺装饰，白色花环绕，表达敬意',
    images: [
      'https://picsum.photos/id/230/600/600'
    ],
    specifications: ['适配A3遗像', '白菊环绕', '缎带装饰', '可固定相框'],
    suitable: '适用于遗像装饰、追思台布置',
    stock: 25,
    makeTime: '约1.5小时'
  }
];

export const categoryNames: Record<string, string> = {
  wreath: '花圈',
  basket: '花篮',
  bouquet: '花束',
  stand: '立式花牌',
  arrangement: '布置套装'
};
