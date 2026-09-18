const api = require('../../utils/api')
const util = require('../../utils/util')
const mock = require('../../utils/mock')
const app = getApp()
const cdnBehavior = require('../../behaviors/cdn')

Page({
  behaviors: [cdnBehavior],
  data: {
    statusBarHeight: 20,
    navBarHeight: 64,
    groups: [],
    guess: [],
    managing: false,
    allChecked: false,
    total: '0.00',
    count: 0,
    itemCount: 0,
    address: {}
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        cartCount: getApp().globalData.cartCount || 0
      })
    }
    this.setData({ address: util.resolveAddress() })
    this.loadCart()
  },

  onLoad() {
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      navBarHeight: app.globalData.navBarHeight,
      address: util.resolveAddress()
    })
  },

  syncCartCount(groups) {
    let qtySum = 0
    ;(groups || []).forEach((g) => {
      (g.items || []).forEach((it) => { qtySum += Number(it.qty) || 0 })
    })
    getApp().globalData.cartCount = qtySum
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ cartCount: qtySum })
    }
  },

  loadCart() {
    // TODO: 接口联调 getCart
    api.getCart().then((res) => {
      const groups = (res.groups || []).map((g) => ({
        ...g,
        items: g.items.map((it) => ({
          ...it,
          x: this.data.managing ? this.actionX() : 0,
          anim: true
        }))
      }))
      this.setData({
        groups,
        guess: ['p-powerbank', 'p-luxihe', 'p-franzzi', 'p-chicken']
          .map((id) => mock.products.find((p) => p.id === id))
          .filter(Boolean)
      })
      this.syncCartCount(groups)
      this.recalc()
    })
  },

  recalc() {
    let total = 0
    let count = 0
    let itemCount = 0
    let all = this.data.groups.length > 0
    this.data.groups.forEach((g) => {
      g.items.forEach((it) => {
        itemCount += 1
        if (it.checked) {
          total += it.price * it.qty
          count += 1
        } else all = false
      })
    })
    if (!this.data.groups.length) all = false
    this.setData({ total: total.toFixed(2), count, itemCount, allChecked: all })
  },

  toggleItem(e) {
    const { gi, ii } = e.currentTarget.dataset
    const key = `groups[${gi}].items[${ii}].checked`
    const checked = !this.data.groups[gi].items[ii].checked
    this.setData({ [key]: checked })
    const g = this.data.groups[gi]
    this.setData({
      [`groups[${gi}].checked`]: g.items.every((it) => it.checked)
    })
    this.recalc()
  },

  toggleShop(e) {
    const gi = e.currentTarget.dataset.gi
    const checked = !this.data.groups[gi].checked
    const patch = { [`groups[${gi}].checked`]: checked }
    this.data.groups[gi].items.forEach((_, i) => {
      patch[`groups[${gi}].items[${i}].checked`] = checked
    })
    this.setData(patch)
    this.recalc()
  },

  toggleAll() {
    const all = !this.data.allChecked
    const groups = this.data.groups.map((g) => ({
      ...g,
      checked: all,
      items: g.items.map((it) => ({ ...it, checked: all }))
    }))
    this.setData({ groups, allChecked: all })
    this.recalc()
  },

  actionX() {
    const w = wx.getSystemInfoSync().windowWidth
    return -Math.round((w / 750) * 240)
  },

  mapItemsX(x, anim) {
    return this.data.groups.map((g) => ({
      ...g,
      items: g.items.map((it) => ({ ...it, x, anim }))
    }))
  },

  lockMove(ms) {
    this._ignoreMove = true
    clearTimeout(this._unlockMove)
    this._unlockMove = setTimeout(() => {
      this._ignoreMove = false
    }, ms || 80)
  },

  toggleManage() {
    const managing = !this.data.managing
    const x = managing ? this.actionX() : 0
    this.lockMove(120)
    const groups = this.data.groups.map((g) => ({
      ...g,
      items: g.items.map((it) => {
        const cur = Number(it.x) || 0
        const nudge = cur + (x < cur ? -0.1 : 0.1)
        return { ...it, x: nudge, anim: true }
      })
    }))
    this.setData({ managing, groups })
    setTimeout(() => {
      this.setData({ groups: this.mapItemsX(x, true) })
    }, 30)
  },

  onChange(e) {
    if (this._ignoreMove) return
    const src = e.detail.source
    const { gi, ii } = e.currentTarget.dataset
    if (src === 'touch' || src === 'touch-out-of-bounds') {
      this._liveX = this._liveX || {}
      this._liveX[gi + '_' + ii] = e.detail.x
      return
    }
    if (this._swipe && !src) {
      this.onMoveEnd({ currentTarget: e.currentTarget, changedTouches: [] })
    }
  },

  onMoveStart(e) {
    const { gi, ii } = e.currentTarget.dataset
    const t = e.changedTouches && e.changedTouches[0]
    if (!t) return
    const item = this.data.groups[gi].items[ii]
    this._swipe = {
      gi,
      ii,
      x0: t.clientX,
      t0: Date.now(),
      opened: (Number(item.x) || 0) < this.actionX() / 2
    }
  },

  onMoveEnd(e) {
    const s = this._swipe
    this._swipe = null
    if (!s) return
    const { gi, ii } = e.currentTarget.dataset
    if (gi !== s.gi || ii !== s.ii) return
    const t = e.changedTouches && e.changedTouches[0]
    const openX = this.actionX()
    const live = this._liveX && this._liveX[gi + '_' + ii]
    const dx = t ? t.clientX - s.x0 : 0
    const dt = Math.max(16, Date.now() - s.t0)
    const vx = dx / dt
    let next
    if (vx < -0.2 || dx < -16) next = openX
    else if (vx > 0.2 || dx > 16) next = 0
    else if (!t && live != null) next = live < openX * 0.2 ? openX : 0
    else next = s.opened ? openX : 0
    this.snapItem(gi, ii, next)
  },

  snapItem(gi, ii, x) {
    const xKey = `groups[${gi}].items[${ii}].x`
    const aKey = `groups[${gi}].items[${ii}].anim`
    const cur = Number(this.data.groups[gi].items[ii].x) || 0
    const live = this._liveX && this._liveX[gi + '_' + ii]
    this.lockMove()
    const apply = () => {
      this.setData({ [xKey]: x, [aKey]: true })
      this._liveX = this._liveX || {}
      this._liveX[gi + '_' + ii] = x
    }
    if (live != null && Math.abs(live - cur) > 1) {
      this.setData({ [xKey]: live, [aKey]: false })
      setTimeout(apply, 16)
      return
    }
    if (Math.abs(cur - x) < 0.5) {
      this.setData({ [xKey]: x === 0 ? 0.1 : x + 0.1, [aKey]: false })
      setTimeout(apply, 16)
      return
    }
    apply()
  },

  changeQty(e) {
    const { gi, ii, delta } = e.currentTarget.dataset
    const item = this.data.groups[gi].items[ii]
    const next = (item.qty || 1) + Number(delta)
    if (next < 1) return
    api.updateCart({ id: item.id, qty: next }).then(() => {
      this.setData({ [`groups[${gi}].items[${ii}].qty`]: next })
      getApp().bumpCartCount(Number(delta))
      this.recalc()
    })
  },

  delItem(e) {
    const { gi, ii } = e.currentTarget.dataset
    const item = this.data.groups[gi].items[ii]
    wx.showModal({
      title: '确认删除',
      content: '确定从购物车删除该商品？',
      success: (res) => {
        if (!res.confirm) return
        // TODO: 接口联调 deleteCart
        api.deleteCart({ id: item.id }).then(() => {
          const groups = this.data.groups.slice()
          groups[gi].items.splice(ii, 1)
          if (!groups[gi].items.length) groups.splice(gi, 1)
          this.setData({ groups, managing: groups.length ? this.data.managing : false })
          this.recalc()
          getApp().bumpCartCount(-(item.qty || 1))
          wx.showToast({ title: '已删除', icon: 'none' })
        })
      }
    })
  },

  favItem() {
    wx.showToast({ title: '收藏待接口联调', icon: 'none' })
  },

  onBarPrimary() {
    if (this.data.managing) this.deleteChecked()
    else this.checkout()
  },

  deleteChecked() {
    if (!this.data.count) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    const ids = []
    let qtyRemoved = 0
    this.data.groups.forEach((g) => {
      g.items.forEach((it) => {
        if (it.checked) {
          ids.push(it.id)
          qtyRemoved += it.qty || 1
        }
      })
    })
    wx.showModal({
      title: '确认删除',
      content: '确定删除已选商品？',
      success: (res) => {
        if (!res.confirm) return
        api.deleteCart({ ids }).then(() => {
          const groups = this.data.groups
            .map((g) => ({
              ...g,
              items: g.items.filter((it) => !it.checked)
            }))
            .filter((g) => g.items.length)
          this.setData({ groups, managing: groups.length ? this.data.managing : false })
          this.recalc()
          getApp().bumpCartCount(-qtyRemoved)
          wx.showToast({ title: '已删除', icon: 'none' })
        })
      }
    })
  },

  checkout() {
    if (!this.data.count) {
      wx.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    if (!getApp().globalData.loggedIn) {
      wx.navigateTo({ url: '/pages/login/index' })
      return
    }
    const items = []
    this.data.groups.forEach((g) => {
      g.items.forEach((it) => {
        if (it.checked) {
          items.push({
            title: it.title,
            spec: it.spec,
            price: it.price,
            qty: it.qty,
            image: it.image,
            tag: '超市'
          })
        }
      })
    })
    wx.setStorageSync('checkoutItems', items)
    wx.navigateTo({ url: '/pages/order/index?from=cart' })
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/index' })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/index?id=' + e.currentTarget.dataset.id })
  },

  addCart(e) {
    api.addCart({ productId: e.currentTarget.dataset.id, qty: 1 }).then(() => {
      getApp().bumpCartCount(1)
      wx.showToast({ title: '已加入购物车', icon: 'success' })
      this.loadCart()
    })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
