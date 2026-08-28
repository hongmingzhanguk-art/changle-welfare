Component({
  properties: {
    show: { type: Boolean, value: false },
    product: { type: Object, value: {} }
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
    minus() {
      if (this.data.qty > 1) this.setData({ qty: this.data.qty - 1 })
    },
    plus() {
      this.setData({ qty: this.data.qty + 1 })
    },
    buy() {
      this.triggerEvent('confirm', {
        qty: this.data.qty,
        selected: this.data.selected
      })
    }
  }
})
