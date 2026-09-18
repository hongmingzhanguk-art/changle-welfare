const { resolve } = require('../utils/cdn')

Component({
  data: {
    selected: 0,
    cartCount: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: resolve('/images/tabbar/home.png'), active: resolve('/images/tabbar/home-active.png') },
      { pagePath: '/pages/category/index', text: '分类', icon: resolve('/images/tabbar/cate.png'), active: resolve('/images/tabbar/cate-active.png') },
      { pagePath: '/pages/cart/index', text: '购物车', icon: resolve('/images/tabbar/cart.png'), active: resolve('/images/tabbar/cart-active.png') },
      { pagePath: '/pages/mine/index', text: '我的', icon: resolve('/images/tabbar/mine.png'), active: resolve('/images/tabbar/mine-active.png') }
    ]
  },
  lifetimes: {
    attached() {
      this.setData({ cartCount: getApp().globalData.cartCount || 0 })
    }
  },
  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset
      wx.switchTab({ url: path })
      this.setData({ selected: index })
    }
  }
})
