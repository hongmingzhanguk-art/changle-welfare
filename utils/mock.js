/** 静态 mock 数据，接口联调后由 utils/api.js 替换 */

const banners = [
  {
    id: 'b1',
    image: '/images/banner/festival.png',
    title: '全民购物节',
    url: ''
  }
]

const categories = [
  { id: 'grain', name: '米面粮油', icon: '/images/category/grain.png' },
  { id: 'flower', name: '浪漫鲜花', icon: '/images/category/flower.png' },
  { id: 'snack', name: '休闲零食', icon: '/images/category/snack.png' },
  { id: 'outdoor', name: '户外运动', icon: '/images/category/outdoor.png' },
  { id: 'travel', name: '景点旅游', icon: '/images/category/travel.png' },
  { id: 'care', name: '个护清洁', icon: '/images/category/care.png' },
  { id: 'coupon', name: '生活卡券', icon: '/images/category/coupon.png' },
  { id: 'digital', name: '数码家电', icon: '/images/category/digital.png' },
  { id: 'cake', name: '生日蛋糕', icon: '/images/category/cake.png' },
  { id: 'home', name: '家居家纺', icon: '/images/category/home.png' },
  { id: 'vip', name: '视听会员', icon: '/images/category/vip.png' },
  { id: 'movie', name: '电影频道', icon: '/images/category/movie.png' },
  { id: 'office', name: '办公用品', icon: '/images/category/office.png' },
  { id: 'tissue', name: '纸品家清', icon: '/images/category/tissue.png' },
  { id: 'all', name: '全部分类', icon: '/images/category/all.png' }
]

const subCategories = {
  grain: ['大米', '面粉', '食用油', '粮油组合', '杂粮', '南北干货', '调味品', '面条'],
  flower: ['玫瑰', '百合', '混搭花束', '永生花'],
  snack: ['膨化', '饼干', '坚果', '糖果'],
  outdoor: ['背包', '帐篷', '防晒'],
  travel: ['周边游', '门票', '酒店'],
  care: ['洗发', '沐浴', '口腔'],
  coupon: ['商超卡', '加油卡'],
  digital: ['手机', '耳机', '家电'],
  cake: ['生日蛋糕', '蛋糕卡'],
  home: ['床品', '毛巾', '收纳'],
  vip: ['视频会员', '音乐会员'],
  movie: ['在线选座', '点播'],
  office: ['文具', '打印纸'],
  tissue: ['抽纸', '卷纸', '湿巾']
}

const movies = [
  { id: 'm1', name: '奥德赛', poster: '/images/movies/odyssey.png' },
  { id: 'm2', name: '怒之杀', poster: '/images/movies/mutiny.png' },
  { id: 'm3', name: '数到三', poster: '/images/movies/countdown.png' },
  { id: 'm4', name: '密档', poster: '/images/movies/secret.png' },
  { id: 'm5', name: '肖申', poster: '/images/movies/xiao.png' }
]

const brands = [
  { id: 'bw', name: '霸王茶姬', icon: '/images/brands/bawang.png' },
  { id: 'lk', name: '瑞幸', icon: '/images/brands/luckin.png' },
  { id: 'ny', name: '奈雪', icon: '/images/brands/nayuki.png' },
  { id: 'md', name: '麦当劳', icon: '/images/brands/mcd.png' },
  { id: 'kf', name: '肯德基', icon: '/images/brands/kfc.png' }
]

const popular = [
  { id: 'vida', name: '维达抽纸', image: '/images/products/vida.png' },
  { id: 'dettol-s', name: '滴露消毒液', image: '/images/products/dettol-small.png' },
  { id: 'dove', name: '多芬沐浴露', image: '/images/products/dove.png' }
]

const products = [
  {
    id: 'p-airpods',
    title: 'Apple AirPods Max 2-午夜暗色',
    price: 2209,
    image: '/images/products/airpods-black.png',
    images: [
      '/images/products/airpods-black.png',
      '/images/products/airpods-star.png',
      '/images/products/airpods-blue.jpg',
      '/images/products/airpods-orange.jpg',
      '/images/products/airpods-purple.jpg'
    ],
    tag: '超市',
    shop: '满满京选',
    shopLogo: '',
    postage: 0,
    stock: 86,
    categoryId: 'digital',
    subCate: '耳机',
    sku: {
      specs: [
        { name: '规格', values: ['AirPods Max 2', 'AirPods Pro 3', 'AirPods Pro 4'] },
        { name: '颜色', values: ['午夜色', '星光色', '蓝色', '橙色', '紫色'] }
      ]
    },
    recIds: ['p-n1', 'p-n2', 'p-n3', 'p-n4', 'p-franzzi', 'p-huawei'],
    descImage: '/images/products/airpods-lineup.jpg',
    desc: 'AirPods Max 2，主动降噪效果比前代最高提升至 1.5 倍，高保真音质更出色，这款超赞的包耳式耳机，给你非同凡响的聆听体验。'
  },
  {
    id: 'p-airpods-star',
    title: '苹果 AirPods Max 2 星光色',
    price: 3599,
    image: '/images/products/airpods-star.png',
    tag: '超市',
    shop: '特惠严选',
    categoryId: 'digital'
  },
  {
    id: 'p-watch',
    title: '苹果 Watch S11 智能手表 GPS 款',
    price: 2209,
    image: '/images/products/watch.png',
    tag: '超市',
    shop: '满满京选',
    spec: 'S11铝金属 *1件',
    categoryId: 'digital'
  },
  {
    id: 'p-yipin',
    title: '广州珠江花城饼糕点礼盒手信特产',
    price: 21.9,
    image: '/images/products/yipinyue.png',
    categoryId: 'snack',
    tab: 'hot'
  },
  {
    id: 'p-panpan',
    title: '盼盼水牛奶蛋糕1020g',
    price: 32.9,
    image: '/images/products/panpan.png',
    categoryId: 'snack',
    tab: 'hot'
  },
  {
    id: 'p-franzzi',
    title: '法丽兹王一博酸奶味夹心曲奇饼干休闲零食',
    price: 23.8,
    image: '/images/products/franzzi.png',
    categoryId: 'snack',
    tab: 'snack'
  },
  {
    id: 'p-haodi',
    title: '好迪柠檬香型空气清新剂320ML',
    price: 18.9,
    image: '/images/products/haodi.png',
    categoryId: 'care',
    tab: 'care'
  },
  {
    id: 'p-chooduo',
    title: '趣多多大块巧克力味曲奇饼干脏脏黑巧克力',
    price: 12.8,
    image: '/images/products/chooduo.png',
    categoryId: 'snack',
    tab: 'snack'
  },
  {
    id: 'p-dettol',
    title: '滴露（Dettol）消毒液衣物消毒水 洗衣除菌液',
    price: 126.8,
    image: '/images/products/dettol.png',
    categoryId: 'care',
    tab: 'care'
  },
  {
    id: 'p-n1',
    title: '湾琴河小米鸡蛋挂面 小米面条鸡蛋挂面',
    price: 22.96,
    image: '/images/products/noodle1.png',
    postage: true,
    categoryId: 'grain',
    subCate: '面条'
  },
  {
    id: 'p-n2',
    title: '湾琴河 手工竹升面独立包装面条',
    price: 37.62,
    image: '/images/products/noodle2.png',
    postage: true,
    categoryId: 'grain',
    subCate: '面条'
  },
  {
    id: 'p-n3',
    title: '纯手工空心面条热卖挂面非遗藁城特产拌面',
    price: 35.9,
    image: '/images/products/noodle3.png',
    postage: true,
    categoryId: 'grain',
    subCate: '面条'
  },
  {
    id: 'p-n4',
    title: '湾琴河 手工竹升面独立包装手工面条挂面',
    price: 26.69,
    image: '/images/products/noodle4.png',
    postage: true,
    categoryId: 'grain',
    subCate: '面条'
  },
  {
    id: 'p-huawei',
    title: 'HUWEI手机P80Pro5G全网通',
    price: 799,
    image: '/images/products/huawei.png',
    categoryId: 'digital',
    tab: 'digital'
  },
  {
    id: 'p-luxihe',
    title: '泸溪河云朵八珍鸡蛋糕400g 松软绵密面包',
    price: 32.9,
    image: '/images/products/luxihe.png',
    categoryId: 'snack'
  },
  {
    id: 'p-chicken',
    title: '鲜嫩多汁鸡小胸不干不柴，一口爱上',
    price: 18.9,
    image: '/images/products/chicken.png',
    categoryId: 'grain'
  }
]

const cartGroups = [
  {
    shop: '满满京选',
    shopId: 's1',
    checked: true,
    items: [
      {
        id: 'c1',
        productId: 'p-watch',
        title: '苹果 Watch S11 智能手表...',
        spec: 'S11铝金属 *1件',
        price: 2209,
        qty: 1,
        image: '/images/products/watch.png',
        checked: true
      }
    ]
  },
  {
    shop: '特惠严选',
    shopId: 's2',
    checked: false,
    items: [
      {
        id: 'c2',
        productId: 'p-airpods-star',
        title: '苹果 AirPods Max 2 星光色',
        spec: 'S11铝金属 *1件',
        price: 3599,
        qty: 1,
        image: '/images/products/airpods-star.png',
        checked: false
      }
    ]
  }
]

const address = {
  id: 'a1',
  name: '李晓阳',
  phone: '13856786789',
  full: '天津市天津西青区精武镇免交警567号',
  isDefault: true
}

const addresses = [
  address,
  {
    id: 'a2',
    name: '李晓阳',
    phone: '13856786789',
    full: '江苏省常州金坛区东城街道中兴路(双俊检)',
    isDefault: false
  }
]

const welfareCards = [
  {
    id: 'w1',
    name: '蛋糕卡',
    face: 200,
    balance: 200,
    no: '82387950',
    expire: '2029-01-31',
    theme: 'purple',
    convertible: false
  },
  {
    id: 'w2',
    name: '蛋糕次卡',
    face: 200,
    balance: 200,
    no: '82387950',
    expire: '2029-01-31',
    theme: 'pink',
    convertible: true,
    convertPoints: 400
  }
]

const orders = [
  {
    id: 'o1',
    no: '20260819164041995358',
    status: '待发货',
    statusTip: '包裹正在准备中，请耐性等待',
    createdAt: '2026-08-19 16:40:42',
    payType: '微信支付',
    amount: 2209,
    address,
    items: [
      {
        title: 'Apple AirPods Max 2-午夜暗...',
        spec: 'AirPods Max2 | 午夜色',
        price: 2209,
        qty: 1,
        image: '/images/products/airpods-black.png',
        tag: '超市'
      }
    ]
  }
]

const feedbackTypes = [
  '支付时卡券不可用',
  '商品质量问题',
  '物流配送问题',
  '页面体验问题',
  '其他建议'
]

const homeTabs = [
  { id: 'hot', name: '热门推荐' },
  { id: 'snack', name: '休闲零食' },
  { id: 'care', name: '洗护用品' },
  { id: 'digital', name: '电子产品' },
  { id: 'virtual', name: '虚拟商城' }
]

module.exports = {
  banners,
  categories,
  subCategories,
  movies,
  brands,
  popular,
  products,
  cartGroups,
  address,
  addresses,
  welfareCards,
  orders,
  feedbackTypes,
  homeTabs
}
