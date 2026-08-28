Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '/images/tabbar/home.png', active: '/images/tabbar/home-active.png' },
      { pagePath: '/pages/category/index', text: '分类', icon: '/images/tabbar/cate.png', active: '/images/tabbar/cate-active.png' },
      { pagePath: '/pages/cart/index', text: '购物车', icon: '/images/tabbar/cart.png', active: '/images/tabbar/cart-active.png' },
      { pagePath: '/pages/mine/index', text: '我的', icon: '/images/tabbar/mine.png', active: '/images/tabbar/mine-active.png' }
    ]
  },
  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset
      wx.switchTab({ url: path })
      this.setData({ selected: index })
    }
  }
})
