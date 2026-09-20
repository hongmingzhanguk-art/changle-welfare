/** 静态 mock 数据，接口联调后由 utils/api.js 替换 */
const { resolve } = require('./cdn')

function rewriteImages(node) {
  if (typeof node === 'string') return resolve(node)
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = rewriteImages(node[i])
    return node
  }
  if (node && typeof node === 'object') {
    Object.keys(node).forEach((k) => {
      node[k] = rewriteImages(node[k])
    })
    return node
  }
  return node
}

const banners = [
  {
    id: 'b1',
    image: '/images/banner/festival.jpg',
    title: '全民购物节',
    productId: 'p-airpods',
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
  { id: 'm1', name: '奥德赛', poster: '/images/movies/odyssey.jpg' },
  { id: 'm2', name: '怒之杀', poster: '/images/movies/mutiny.jpg' },
  { id: 'm3', name: '数到三', poster: '/images/movies/countdown.jpg' },
  { id: 'm4', name: '密档', poster: '/images/movies/secret.jpg' },
  { id: 'm5', name: '肖申', poster: '/images/movies/xiao.jpg' }
]

const brands = [
  { id: 'bw', name: '霸王茶姬', icon: '/images/brands/bawang.png' },
  { id: 'lk', name: '瑞幸', icon: '/images/brands/luckin.png' },
  { id: 'ny', name: '奈雪', icon: '/images/brands/nayuki.png' },
  { id: 'md', name: '麦当劳', icon: '/images/brands/mcd.png' },
  { id: 'kf', name: '肯德基', icon: '/images/brands/kfc.png' }
]

const popular = [
  { id: 'p-vida', name: '维达抽纸', image: '/images/products/vida.png' },
  { id: 'p-dettol', name: '滴露消毒液', image: '/images/products/dettol-small.png' },
  { id: 'p-dove', name: '多芬沐浴露', image: '/images/products/dove.png' }
]

const products = [
  {
    id: 'p-airpods',
    title: 'Apple AirPods Max 2-午夜暗色',
    price: 2209,
    image: '/images/products/airpods-black.jpg',
    images: [
      '/images/products/airpods-black.jpg',
      '/images/products/airpods-star.jpg',
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
    recIds: ['p-n1', 'p-n2', 'p-n3', 'p-n4', 'p-franzzi', 'p-powerbank'],
    descImage: '/images/products/airpods-lineup.jpg',
    desc: 'AirPods Max 2，主动降噪效果比前代最高提升至 1.5 倍，高保真音质更出色，这款超赞的包耳式耳机，给你非同凡响的聆听体验。'
  },
  {
    id: 'p-airpods-star',
    title: '苹果 AirPods Max 2 星光色',
    price: 3599,
    image: '/images/products/airpods-star.jpg',
    tag: '超市',
    shop: '特惠严选',
    categoryId: 'digital'
  },
  {
    id: 'p-watch',
    title: '苹果 Watch S11 智能手表 GPS 款',
    price: 2209,
    image: '/images/products/watch.jpg',
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
    id: 'p-vida',
    title: '维达抽纸 超韧3层100抽',
    price: 29.9,
    image: '/images/products/vida.png',
    categoryId: 'tissue'
  },
  {
    id: 'p-dove',
    title: '多芬沐浴露 深层营润',
    price: 39.9,
    image: '/images/products/dove.png',
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
    id: 'p-powerbank',
    title: '20000mAh 双向快充移动电源',
    price: 89,
    image: '/images/products/powerbank.jpg',
    categoryId: 'digital',
    tab: 'digital'
  },
  {
    id: 'p-luxihe',
    title: '泸溪河云朵八珍鸡蛋糕400g 松软绵密面包',
    price: 32.9,
    image: '/images/products/luxihe.jpg',
    categoryId: 'snack'
  },
  {
    id: 'p-chicken',
    title: '鲜嫩多汁鸡小胸不干不柴，一口爱上',
    price: 18.9,
    image: '/images/products/chicken.jpg',
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
        image: '/images/products/watch.jpg',
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
        image: '/images/products/airpods-star.jpg',
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
    statusTip: '包裹正在准备中，请耐心等待',
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
        image: '/images/products/airpods-black.jpg',
        tag: '超市'
      }
    ]
  },
  {
    id: 'o2',
    no: '20260818121000000001',
    status: '待付款',
    statusTip: '请尽快完成支付',
    createdAt: '2026-08-18 12:10:00',
    payType: '微信支付',
    amount: 126.8,
    address,
    items: [
      {
        title: '滴露（Dettol）消毒液衣物消毒水 洗衣除菌液',
        spec: '默认规格',
        price: 126.8,
        qty: 1,
        image: '/images/products/dettol.png',
        tag: '超市'
      }
    ]
  },
  {
    id: 'o3',
    no: '20260810153000000002',
    status: '已完成',
    statusTip: '交易已完成',
    createdAt: '2026-08-10 15:30:00',
    payType: '积分支付',
    amount: 32.9,
    address,
    items: [
      {
        title: '泸溪河云朵八珍鸡蛋糕400g 松软绵密面包',
        spec: '默认规格',
        price: 32.9,
        qty: 1,
        image: '/images/products/luxihe.jpg',
        tag: '超市'
      }
    ]
  },
  {
    id: 'o4',
    no: '20260812101800000003',
    status: '待收货',
    statusTip: '包裹正在配送中',
    createdAt: '2026-08-12 10:18:00',
    payType: '微信支付',
    amount: 39.9,
    address,
    items: [
      {
        title: '多芬沐浴露 深层营润',
        spec: '默认规格',
        price: 39.9,
        qty: 1,
        image: '/images/products/dove.png',
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

const cakeBrands = [
  { id: 'weiernasi', name: '维尔纳斯', icon: '/images/cake/brand-134.png' },
  { id: 'xingfu', name: '幸福西饼', icon: '/images/cake/brand-135.png' },
  { id: 'ganso', name: '元祖', icon: '/images/cake/brand-136.png' },
  { id: 'tianyueji', name: '甜悦纪', icon: '/images/cake/brand-137.png' },
  { id: 'liumang', name: '榴芒一刻', icon: '/images/cake/brand-164.png' },
  { id: 'lecake', name: '诺心', icon: '/images/cake/brand-139.png' },
  { id: 'lexiang', name: '乐享烘焙', icon: '/images/cake/brand-140.png' },
  { id: 'yingyue', name: '映悦', icon: '/images/cake/brand-141.png' },
  { id: 'aicake', name: 'Aicake', icon: '/images/cake/brand-142.png' },
  { id: 'zaoanchengyu', name: '早安橙语', icon: '/images/cake/brand-143.png' },
  { id: 'yanyu', name: '颜予甜社', icon: '/images/cake/brand-144.png' },
  { id: 'waffleboy', name: '窝夫小子', icon: '/images/cake/brand-145.png' },
  { id: 'bedream', name: 'BeDream', icon: '/images/cake/brand-146.png' },
  { id: 'peipindao', name: '焙品道', icon: '/images/cake/brand-147.png' },
  { id: 'haagen', name: '哈根达斯', icon: '/images/cake/brand-148.png' },
  { id: 'beikeer', name: '贝客尔蛋糕', icon: '/images/cake/brand-149.png' },
  { id: 'weizhichu', name: '味之初', icon: '/images/cake/brand-150.png' },
  { id: 'sijiliulian', name: '四季榴莲', icon: '/images/cake/brand-151.png' },
  { id: 'qianmo', name: '阡陌', icon: '/images/cake/brand-152.png' },
  { id: 'guaihou', name: '怪兽不厌食', icon: '/images/cake/brand-153.png' },
  { id: 'kaoai', name: '烤爱', icon: '/images/cake/brand-154.png' },
  { id: 'zaoanbali', name: '早安巴黎', icon: '/images/cake/brand-155.png' },
  { id: 'xifulai', name: '喜芙来', icon: '/images/cake/brand-156.png' },
  { id: 'mai5', name: '麦5', icon: '/images/cake/brand-157.png' },
  { id: 'maiwulaoke', name: '麦物酪客', icon: '/images/cake/brand-158.png' },
  { id: 'musangking', name: 'Musangking', icon: '/images/cake/brand-159.png' },
  { id: 'shengtian', name: '圣田烘焙', icon: '/images/cake/brand-160.png' },
  { id: 'wojia', name: '窝家甜品', icon: '/images/cake/brand-161.png' },
  { id: 'shouyingmen', name: '寿盈门', icon: '/images/cake/brand-162.png' },
  { id: 'cake36', name: '36cake', icon: '/images/cake/brand-163.png' }
]

const birthdayCats = [
  { id: 'pastry', name: '面包甜点', icon: '/images/cake/cat-b-pastry.png' },
  { id: 'cookie', name: '饼干糕点', icon: '/images/cake/cat-b-cookie.png' },
  { id: 'flower', name: '鲜花', icon: '/images/cake/cat-b-flower.png' },
  { id: 'snack', name: '休闲零食', icon: '/images/cake/cat-b-snack.png' },
  { id: 'drink', name: '饮品', icon: '/images/cake/cat-b-drink.png' }
]

const cakeListCats = [
  { id: 'birthday', name: '生日蛋糕', icon: '/images/cake/cat-l-birthday.png' },
  { id: 'pastry', name: '面包甜点', icon: '/images/cake/cat-l-pastry.png' },
  { id: 'cookie', name: '饼干糕点', icon: '/images/cake/cat-l-cookie.png' },
  { id: 'choco', name: '巧克力', icon: '/images/cake/cat-l-choco.png' },
  { id: 'drink', name: '饮品饮料', icon: '/images/cake/cat-l-drink.png' },
  { id: 'snack', name: '休闲零食', icon: '/images/cake/cat-b-snack.png' }
]

const birthdayPreviewBrands = [
  { id: 'ganso', name: '元祖食品', icon: '/images/cake/logo-ganso-sm.png' },
  { id: 'haagen', name: '哈根达斯', icon: '/images/cake/logo-haagen-sm.png' },
  { id: 'liumang', name: '榴芒一刻', icon: '/images/cake/logo-liumang-sm.png' },
  { id: 'weiernasi', name: '维尔纳斯', icon: '/images/cake/logo-weiernasi-sm.png' }
]

const cakeProducts = [
  {
    id: 'c-taotao',
    title: '桃桃碎碎念',
    price: 198,
    originPrice: 318,
    image: '/images/cake/p-taotao.png',
    sold: 560,
    shopSold: 368,
    tags: ['同城配送'],
    sameCity: true,
    nextDay: false,
    brandId: 'ganso',
    shop: '元祖蛋糕',
    cat: 'birthday',
    tab: 'rec',
    storage: '冷藏',
    shelfLife: '1',
    reason: '新鲜现做'
  },
  {
    id: 'c-tianjing',
    title: '甜境回响',
    price: 168,
    originPrice: 318,
    image: '/images/cake/p-tianjing.png',
    sold: 340,
    shopSold: 112,
    tags: ['同城配送', '当日达'],
    sameCity: true,
    nextDay: true,
    brandId: 'ganso',
    shop: '元祖蛋糕',
    cat: 'birthday',
    tab: 'rec',
    storage: '冷藏',
    shelfLife: '1',
    reason: '新鲜现做'
  },
  {
    id: 'c-xingxu',
    title: '星絮漫糕',
    price: 198,
    originPrice: 318,
    image: '/images/cake/p-xingxu.png',
    sold: 560,
    shopSold: 26,
    tags: ['同城配送'],
    sameCity: true,
    nextDay: false,
    brandId: 'ganso',
    shop: '元祖蛋糕',
    cat: 'birthday',
    tab: 'rec',
    storage: '冷藏',
    shelfLife: '1',
    reason: '新鲜现做'
  },
  {
    id: 'c-tiannuo',
    title: '甜糯小星球',
    price: 168,
    originPrice: 318,
    image: '/images/cake/p-tiannuo.png',
    sold: 340,
    shopSold: 10,
    tags: ['同城配送', '当日达'],
    sameCity: true,
    nextDay: true,
    brandId: 'ganso',
    shop: '元祖蛋糕',
    cat: 'birthday',
    tab: 'rec',
    storage: '冷藏',
    shelfLife: '1',
    reason: '新鲜现做'
  },
  {
    id: 'c-yuni',
    title: '芋泥在一起奶油蛋糕',
    price: 168,
    skuPrice: 198,
    originPrice: 318,
    image: '/images/cake/product-hero.png',
    images: ['/images/cake/product-hero.png'],
    promo: '/images/cake/detail-promo.png',
    sold: 112,
    shopSold: 112,
    tags: ['同城配送'],
    sameCity: true,
    nextDay: false,
    brandId: 'ganso',
    shop: '元祖',
    shopLogo: '/images/cake/shop-ganso.png',
    cat: 'birthday',
    tab: 'new',
    storage: '冷藏',
    shelfLife: '1',
    reason: '新鲜现做',
    delivery: '蛋糕配送原则单笔订单满100元，骑行距离附近门店0-7公里以内免运费7-9公里20元9-11公里30元11-13公里40元13-15公里50元15公里以外不配送 亲可选择自提。',
    sku: {
      specs: [{ name: '规格', values: ['1磅', '2磅', '3磅'] }]
    }
  }
]

const cakeStores = [
  {
    id: 's-jintan',
    name: '金坛店J',
    addr: '金坛市金城镇北门大街1号(华润大厦...',
    dist: '约4.87Km',
    distKm: 4.87
  },
  {
    id: 's-baolong',
    name: '宝龙城市广场店',
    addr: '常州市钟楼区宝龙国际花园33-3',
    dist: '约26.23Km',
    distKm: 26.23
  },
  {
    id: 's-qinye',
    name: '勤业路店',
    addr: '勤业路金地花苑3-147、3-148',
    dist: '约29.32Km',
    distKm: 29.32
  },
  {
    id: 's-wenchang',
    name: '文昌店',
    addr: '常州市天宁区文昌路',
    dist: '约8.20Km',
    distKm: 8.2
  }
]

const movieDistricts = [
  { id: 'all', name: '全部', count: 281 },
  { id: 'xuanwu', name: '玄武区', count: 62 },
  { id: 'qinhuai', name: '秦淮区', count: 21 },
  { id: 'jianye', name: '建邺区', count: 19 },
  { id: 'gulou', name: '鼓楼区', count: 17 },
  { id: 'pukou', name: '浦口区', count: 13 },
  { id: 'qixia', name: '栖霞区', count: 12 },
  { id: 'yuhuatai', name: '雨花台区', count: 11 },
  { id: 'jiangning', name: '江宁区', count: 10 },
  { id: 'liuhe', name: '六合区', count: 10 }
]

const movieBrands = [
  { id: 'dadi', name: '大地影院' },
  { id: 'zhongying', name: '中影国际' },
  { id: 'hengdian', name: '横店影视' },
  { id: 'wanda', name: '万达影视' },
  { id: 'jinyi', name: '金逸' },
  { id: 'perfect', name: '完美世界' },
  { id: 'suning', name: '苏宁影城' },
  { id: 'broadway', name: '百老汇' },
  { id: 'huayi', name: '华谊兄弟' },
  { id: 'bona', name: '博纳影城' },
  { id: 'zhichao', name: '至潮影城' },
  { id: 'xingyi', name: '星轶' }
]

const movieCinemas = [
  {
    id: 'cin-1',
    name: '幸福蓝海影城白马店',
    addr: '溧水区白马镇康居路3号3楼',
    dist: '600m',
    distKm: 0.6,
    price: 28,
    district: 'lishui',
    brand: 'xingfu'
  },
  {
    id: 'cin-2',
    name: '万达影城(溧水万达广场XLAND店)',
    addr: '溧水区高平大街55号万达广场4楼',
    dist: '1.6km',
    distKm: 1.6,
    price: 28,
    district: 'lishui',
    brand: 'wanda'
  },
  {
    id: 'cin-3',
    name: '金逸影城(溧水时代广场IMAX店)',
    addr: '溧水区天生桥大道388号时代国际广场3楼',
    dist: '1.8km',
    distKm: 1.8,
    price: 28,
    district: 'lishui',
    brand: 'jinyi'
  }
]

;[
  banners, categories, movies, brands, popular, products, cartGroups, orders,
  cakeBrands, birthdayCats, cakeListCats, birthdayPreviewBrands, cakeProducts
].forEach(rewriteImages)

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
  homeTabs,
  cakeBrands,
  birthdayCats,
  cakeListCats,
  birthdayPreviewBrands,
  cakeProducts,
  cakeStores,
  movieDistricts,
  movieBrands,
  movieCinemas
}
