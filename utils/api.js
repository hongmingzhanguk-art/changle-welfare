/**
 * 接口层
 * 当前全部走本地 mock，联调时只需：
 * 1. 将 BASE_URL 改为真实网关
 * 2. 打开 request() 内 wx.request 实现
 * 3. 去掉各方法中的 mock 返回
 */
const mock = require('./mock')

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

function searchProducts(keyword) {
  return request('/product/search', { keyword }).then((res) => {
    if (res) return res
    const k = (keyword || '').trim()
    if (!k) return { list: [] }
    const list = mock.products.filter((p) => p.title.indexOf(k) > -1)
    return { list }
  })
}

const CART_KEY = 'cartGroups'

function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

function loadCartGroups() {
  try {
    const stored = wx.getStorageSync(CART_KEY)
    if (Array.isArray(stored)) return stored
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
    const p = mock.products.find((x) => x.id === productId) || {}
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
    if (res) return res
    const last = wx.getStorageSync('lastOrder')
    if (last && (!id || last.id === id)) return last
    const list = wx.getStorageSync('localOrders') || []
    const found = list.find((o) => o.id === id)
    return found || mock.orders[0]
  })
}

function getOrders(payload) {
  return request('/order/list', payload).then((res) => {
    if (res) return res
    const local = wx.getStorageSync('localOrders') || []
    const map = {}
    const list = []
    local.concat(mock.orders).forEach((o) => {
      if (!map[o.id]) {
        map[o.id] = true
        list.push(o)
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

module.exports = {
  BASE_URL,
  request,
  getHomeData,
  getCategoryTree,
  getCategoryProducts,
  getProductDetail,
  searchProducts,
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
  getAddressList
}
