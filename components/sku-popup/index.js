Component({
  properties: {
    show: { type: Boolean, value: false },
    product: { type: Object, value: {} },
    mode: { type: String, value: 'buy' }
  },
  data: {
    qty: 1,
    selected: {},
    preview: ''
  },
  observers: {
    show(v) {
      if (v) {
        const p = this.data.product || {}
        const selected = {}
        const specs = (p.sku && p.sku.specs) || []
        specs.forEach((s) => {
          selected[s.name] = s.values[0]
        })
        this.setData({ qty: 1, selected, preview: p.image })
      }
    }
  },
  methods: {
    noop() {},
    onClose() {
      this.triggerEvent('close')
    },
    pick(e) {
      const { name, value } = e.currentTarget.dataset
      const patch = { [`selected.${name}`]: value }
      const colorMap = {
        '午夜色': '/images/products/airpods-black.png',
        '星光色': '/images/products/airpods-star.png',
        '蓝色': '/images/products/airpods-blue.jpg',
        '橙色': '/images/products/airpods-orange.jpg',
        '紫色': '/images/products/airpods-purple.jpg'
      }
      if (name === '颜色' && colorMap[value]) {
        patch.preview = colorMap[value]
      }
      this.setData(patch)
    },
    stockCap() {
      const stock = this.data.product && this.data.product.stock
      if (typeof stock === 'number' && !Number.isNaN(stock)) return stock
      return 99
    },
    minus() {
      if (this.data.qty > 1) this.setData({ qty: this.data.qty - 1 })
    },
    plus() {
      const cap = this.stockCap()
      if (this.data.qty >= cap) {
        wx.showToast({ title: '已达库存上限', icon: 'none' })
        return
      }
      this.setData({ qty: this.data.qty + 1 })
    },
    emit(action) {
      this.triggerEvent('confirm', {
        qty: this.data.qty,
        selected: this.data.selected,
        action
      })
    },
    buy() {
      this.emit('buy')
    },
    addCart() {
      this.emit('cart')
    }
  }
})
