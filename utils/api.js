/**
 * 接口层
 * 当前全部走本地 mock，联调时只需：
 * 1. 将 BASE_URL 改为真实网关
 * 2. 打开 request() 内 wx.request 实现
 * 3. 去掉各方法中的 mock 返回
 */
const mock = require('./mock')
const { resolve } = require('./cdn')

const BASE_URL = '' // TODO: 替换为真实接口地址，例如 https://api.changle.com

function request(path, data = {}, method = 'GET') {
  // TODO: 接口联调
  // return new Promise((resolve, reject) => {
  //   wx.request({
  //     url: BASE_URL + path,
  //     method,
  //     data,
  //     header: {
  //       'content-type': 'application/json',
  //       Authorization: wx.getStorageSync('token') || ''
  //     },
  //     success(res) {
  //       if (res.statusCode === 200 && res.data && res.data.code === 0) {
  //         resolve(res.data.data)
  //       } else {
  //         reject(res.data || res)
  //       }
  //     },
  //     fail: reject
  //   })
  // })
  console.log('[API placeholder]', method, path, data)
  return Promise.resolve(null)
}

function getHomeData() {
  return request('/home/index').then((res) => res || {
    banners: mock.banners,
    categories: mock.categories,
    movies: mock.movies,
    brands: mock.brands,
    popular: mock.popular,
    tabs: mock.homeTabs,
    products: mock.products.filter((p) => p.tab === 'hot' || !p.tab).slice(0, 6)
  })
}

function getCategoryTree() {
  return request('/category/tree').then((res) => res || {
    categories: mock.categories,
    subCategories: mock.subCategories
  })
}

function getCategoryProducts(payload) {
  return request('/product/list', payload).then((res) => {
    if (res) return res
    const { categoryId, subCate, sort } = payload || {}
    let list = mock.products.filter((p) => !categoryId || categoryId === 'all' || p.categoryId === categoryId)
    if (subCate) list = list.filter((p) => p.subCate === subCate)
    if (sort === 'sales') list = list.slice().reverse()
    return { list }
  })
}

function getProductDetail(id) {
  return request('/product/detail', { id }).then((res) => {
    if (res) return res
    const p = mock.products.find((x) => x.id === id) || mock.products[0]
    const rec = (p.recIds || ['p-n1', 'p-n2', 'p-n3', 'p-n4', 'p-franzzi', 'p-powerbank'])
      .map((rid) => mock.products.find((x) => x.id === rid))
      .filter(Boolean)
    const sku = p.sku || { specs: [{ name: '规格', values: ['默认'] }] }
    return { ...p, rec, sku }
  })
}

function searchProducts(keyword, payload) {
  const channel = (payload && payload.channel) || ''
  return request('/product/search', { keyword, channel }).then((res) => {
    if (res) return res
    const k = (keyword || '').trim()
    if (!k) return { list: [] }
    const source = channel === 'cake' ? (mock.cakeProducts || []) : mock.products
    const list = source.filter((p) => p.title.indexOf(k) > -1)
    return { list: channel === 'cake' ? mapCdnFields(list, ['image']) : list }
  })
}

const CART_KEY = 'cartGroups'

/** 压包时 png→jpg 的旧路径，本地缓存可能仍持有 */
const IMAGE_ALIASES = {
  '/images/products/watch.png': '/images/products/watch.jpg',
  '/images/products/airpods-black.png': '/images/products/airpods-black.jpg',
  '/images/products/airpods-star.png': '/images/products/airpods-star.jpg',
  '/images/banner/festival.png': '/images/banner/festival.jpg'
}

function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

function resolveLocalImage(src, productId) {
  if (productId) {
    const p = mock.products.find((x) => x.id === productId)
      || (mock.cakeProducts || []).find((x) => x.id === productId)
    if (p && p.image) return p.image
  }
  if (!src || typeof src !== 'string') return src || ''
  return resolve(IMAGE_ALIASES[src] || src)
}

function hydrateItems(items) {
  if (!Array.isArray(items)) return []
  return items.map((it) => {
    const image = resolveLocalImage(it.image, it.productId)
    return image === it.image ? it : { ...it, image }
  })
}

function itemsDirty(before, after) {
  if (!before || before.length !== after.length) return true
  for (let i = 0; i < after.length; i++) {
    if (after[i] !== before[i]) return true
  }
  return false
}

function hydrateOrder(order) {
  if (!order || !Array.isArray(order.items)) return order
  const items = hydrateItems(order.items)
  return itemsDirty(order.items, items) ? { ...order, items } : order
}

function loadCartGroups() {
  try {
    const stored = wx.getStorageSync(CART_KEY)
    if (Array.isArray(stored)) {
      let dirty = false
      const groups = stored.map((g) => {
        const items = hydrateItems(g.items)
        const changed = itemsDirty(g.items, items)
        if (changed) dirty = true
        return changed ? { ...g, items } : g
      })
      if (dirty) wx.setStorageSync(CART_KEY, groups)
      return groups
    }
  } catch (e) { /* ignore */ }
  const seed = clone(mock.cartGroups || [])
  wx.setStorageSync(CART_KEY, seed)
  return seed
}

function saveCartGroups(groups) {
  wx.setStorageSync(CART_KEY, groups)
}

function specFromPayload(payload) {
  if (payload && payload.spec) return payload.spec
  if (payload && payload.selected && typeof payload.selected === 'object') {
    const vals = Object.values(payload.selected).filter(Boolean)
    if (vals.length) return vals.join(' | ')
  }
  return '默认规格'
}

function getCart() {
  return request('/cart/list').then((res) => {
    if (res) return res
    return { groups: clone(loadCartGroups()) }
  })
}

function addCart(payload) {
  return request('/cart/add', payload, 'POST').then((res) => {
    if (res) return res
    const productId = payload && payload.productId
    const qty = Number((payload && payload.qty) || 1) || 1
    const spec = specFromPayload(payload)
    const p = mock.products.find((x) => x.id === productId)
      || (mock.cakeProducts || []).find((x) => x.id === productId)
      || {}
    const shop = p.shop || '满满京选'
    const groups = loadCartGroups()
    for (let i = 0; i < groups.length; i++) {
      const item = (groups[i].items || []).find((it) => it.productId === productId && it.spec === spec)
      if (item) {
        item.qty = (item.qty || 0) + qty
        saveCartGroups(groups)
        return { ok: true, groups }
      }
    }
    let g = groups.find((x) => x.shop === shop)
    if (!g) {
      g = { shop, shopId: 's-' + shop, checked: true, items: [] }
      groups.push(g)
    }
    g.items.push({
      id: 'c-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      productId,
      title: p.title || '',
      spec,
      price: p.price || 0,
      qty,
      image: p.image || '',
      checked: true
    })
    saveCartGroups(groups)
    return { ok: true, groups }
  })
}

function updateCart(payload) {
  return request('/cart/update', payload, 'POST').then((res) => {
    if (res) return res
    const id = payload && payload.id
    const qty = Math.max(1, Number(payload && payload.qty) || 1)
    const groups = loadCartGroups()
    groups.forEach((g) => {
      (g.items || []).forEach((it) => {
        if (it.id === id) it.qty = qty
      })
    })
    saveCartGroups(groups)
    return { ok: true, groups }
  })
}

function deleteCart(payload) {
  return request('/cart/delete', payload, 'POST').then((res) => {
    if (res) return res
    const ids = (payload && payload.ids) || (payload && payload.id ? [payload.id] : [])
    const set = {}
    ids.forEach((id) => { set[id] = true })
    const groups = loadCartGroups()
      .map((g) => ({ ...g, items: (g.items || []).filter((it) => !set[it.id]) }))
      .filter((g) => g.items.length)
    saveCartGroups(groups)
    return { ok: true, groups }
  })
}

function createOrder(payload) {
  return request('/order/create', payload, 'POST').then((res) => {
    if (res) return res
    const now = new Date()
    const pad = (n) => (n < 10 ? '0' + n : '' + n)
    const no = now.getFullYear().toString()
      + pad(now.getMonth() + 1) + pad(now.getDate())
      + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds())
      + '0001'
    const payType = payload.payType === 'points' ? '积分支付' : '微信支付'
    const order = {
      id: 'o-' + no,
      no,
      status: '待发货',
      statusTip: '包裹正在准备中，请耐心等待',
      createdAt: now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())
        + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()),
      payType,
      amount: Number(payload.amount || 0),
      address: payload.address || mock.address,
      items: payload.items || []
    }
    wx.setStorageSync('lastOrder', order)
    const list = wx.getStorageSync('localOrders') || []
    list.unshift(order)
    wx.setStorageSync('localOrders', list.slice(0, 20))
    return { orderId: order.id, no: order.no }
  })
}

function payOrder(payload) {
  return request('/order/pay', payload, 'POST').then((res) => res || { ok: true })
}

function getOrderDetail(id) {
  return request('/order/detail', { id }).then((res) => {
    if (res) return hydrateOrder(res)
    const rawLast = wx.getStorageSync('lastOrder')
    const last = hydrateOrder(rawLast)
    if (last && last !== rawLast) wx.setStorageSync('lastOrder', last)
    if (last && (!id || last.id === id)) return last
    const list = wx.getStorageSync('localOrders') || []
    const found = list.find((o) => o.id === id)
    return hydrateOrder(found) || mock.orders[0]
  })
}

function getOrders(payload) {
  return request('/order/list', payload).then((res) => {
    if (res) {
      return { list: (res.list || []).map(hydrateOrder) }
    }
    const local = wx.getStorageSync('localOrders') || []
    let dirty = false
    const hydratedLocal = local.map((o) => {
      const next = hydrateOrder(o)
      if (next !== o) dirty = true
      return next
    })
    if (dirty) wx.setStorageSync('localOrders', hydratedLocal)
    const map = {}
    const list = []
    hydratedLocal.concat(mock.orders).forEach((o) => {
      if (!map[o.id]) {
        map[o.id] = true
        list.push(hydrateOrder(o))
      }
    })
    return { list }
  })
}

function getUserInfo() {
  return request('/user/info').then((res) => res || getApp().globalData.userInfo)
}

function loginByPhone(payload) {
  return request('/auth/login', payload, 'POST').then((res) => res || {
    token: 'mock-token',
    userInfo: getApp().globalData.userInfo
  })
}

function getWelfare() {
  return request('/welfare/list').then((res) => res || {
    cards: mock.welfareCards,
    rules: '1、本卡可用于线上电影频道、生日汇频道、演出频道、旅游玩乐频道、优选购物频道、健康商城频道、图书、常乐超市、保险、节日礼包、福鲜生、美食汇（除三方服务以外）、乐象亲子'
  })
}

function convertCard(payload) {
  return request('/welfare/convert', payload, 'POST').then((res) => res || { ok: true })
}

function bindCard(payload) {
  return request('/welfare/bind', payload, 'POST').then((res) => res || { ok: true })
}

function submitFeedback(payload) {
  return request('/feedback/submit', payload, 'POST').then((res) => res || { ok: true })
}

function getAddressList() {
  return request('/address/list').then((res) => res || { list: mock.addresses })
}

function mapCdnFields(list, keys) {
  return (list || []).map((it) => {
    const o = { ...it }
    keys.forEach((k) => {
      if (o[k]) o[k] = resolve(o[k])
    })
    return o
  })
}

function getBirthdayHome() {
  return request('/cake/birthday').then((res) => res || {
    cats: mapCdnFields(mock.birthdayCats, ['icon']),
    brands: mapCdnFields(mock.birthdayPreviewBrands, ['icon']),
    products: mapCdnFields(mock.cakeProducts.filter((p) => p.id !== 'c-yuni'), ['image']),
    tabs: [
      { id: 'rec', name: '为你推荐' },
      { id: 'new', name: '新品上市' },
      { id: 'pastry', name: '面包糕点' },
      { id: 'cream', name: '奶油蛋糕' }
    ]
  })
}

function getBrandHall(payload) {
  return request('/cake/brands', payload).then((res) => {
    if (res) return res
    const k = ((payload && payload.keyword) || '').trim()
    let list = mock.cakeBrands.slice()
    if (k) list = list.filter((b) => b.name.toLowerCase().indexOf(k.toLowerCase()) > -1)
    return { list: mapCdnFields(list, ['icon']) }
  })
}

function getCakeList(payload) {
  return request('/cake/list', payload).then((res) => {
    if (res) return res
    const cat = (payload && payload.cat) || 'birthday'
    const delivery = (payload && payload.delivery) || 'sameCity'
    let list = mock.cakeProducts.filter((p) => p.id !== 'c-yuni')
    if (delivery === 'nextDay') list = list.filter((p) => p.nextDay)
    else list = list.filter((p) => p.sameCity)
    return {
      cats: mapCdnFields(mock.cakeListCats, ['icon']),
      list: mapCdnFields(list, ['image']),
      cat,
      delivery
    }
  })
}

function getBrandShop(payload) {
  return request('/cake/shop', payload).then((res) => {
    if (res) return res
    const brandId = (payload && payload.brandId) || 'ganso'
    const brand = mock.cakeBrands.find((b) => b.id === brandId) || { id: 'ganso', name: '元祖' }
    const sort = (payload && payload.sort) || 'new'
    let list = mock.cakeProducts.filter((p) => p.id !== 'c-yuni')
    if (sort === 'sales') list = list.slice().sort((a, b) => (b.shopSold || 0) - (a.shopSold || 0))
    if (sort === 'price') list = list.slice().sort((a, b) => a.price - b.price)
    if (sort === 'hot') list = list.slice().sort((a, b) => (b.sold || 0) - (a.sold || 0))
    return { brand, list: mapCdnFields(list, ['image']), sort }
  })
}

function getCakeDetail(id) {
  return request('/cake/detail', { id }).then((res) => {
    if (res) return res
    const p = mock.cakeProducts.find((x) => x.id === id) || mock.cakeProducts.find((x) => x.id === 'c-yuni')
    const sku = (p && p.sku) || { specs: [{ name: '规格', values: ['1磅', '2磅', '3磅'] }] }
    return {
      ...p,
      image: resolve(p.image || '/images/cake/product-hero.png'),
      images: (p.images || [p.image || '/images/cake/product-hero.png']).map(resolve),
      promo: resolve(p.promo || '/images/cake/detail-promo.png'),
      shopLogo: resolve(p.shopLogo || '/images/cake/shop-ganso.png'),
      delivery: p.delivery || '蛋糕配送原则单笔订单满100元，骑行距离附近门店0-7公里以内免运费7-9公里20元9-11公里30元11-13公里40元13-15公里50元15公里以外不配送 亲可选择自提。',
      sku
    }
  })
}

function getCakeStores(payload) {
  return request('/cake/stores', payload).then((res) => {
    if (res) return res
    const k = ((payload && payload.keyword) || '').trim()
    let list = mock.cakeStores.slice()
    if (k) list = list.filter((s) => (s.name + s.addr).indexOf(k) > -1)
    return { list }
  })
}

function getMovieChannel(payload) {
  return request('/movie/channel', payload).then((res) => {
    if (res) return res
    return {
      cinemas: mock.movieCinemas,
      districts: mock.movieDistricts,
      brands: mock.movieBrands,
      movies: mapCdnFields(mock.movies, ['poster']),
      banner: resolve('/images/cake/movie-banner.png')
    }
  })
}

module.exports = {
  BASE_URL,
  request,
  getHomeData,
  getCategoryTree,
  getCategoryProducts,
  getProductDetail,
  searchProducts,
  getBirthdayHome,
  getBrandHall,
  getCakeList,
  getBrandShop,
  getCakeDetail,
  getCakeStores,
  getMovieChannel,
  getCart,
  addCart,
  updateCart,
  deleteCart,
  createOrder,
  payOrder,
  getOrderDetail,
  getOrders,
  getUserInfo,
  loginByPhone,
  getWelfare,
  convertCard,
  bindCard,
  submitFeedback,
  getAddressList,
  hydrateItems
}
