const cdnBehavior = require('../../behaviors/cdn')

Component({
  behaviors: [cdnBehavior],
  properties: {
    show: { type: Boolean, value: false },
    product: { type: Object, value: {} }
  },
  data: {
    qty: 1,
    spec: '1磅',
    specs: ['1磅', '2磅', '3磅'],
    price: '198.00'
  },
  observers: {
    show(v) {
      if (v) {
        const p = this.data.product || {}
        const specs = ((p.sku && p.sku.specs && p.sku.specs[0] && p.sku.specs[0].values) || ['1磅', '2磅', '3磅'])
        const price = p.skuPrice || p.price || 198
        this.setData({
          qty: 1,
          spec: specs[0],
          specs,
          price: Number(price).toFixed(2)
        })
      }
    }
  },
  methods: {
    noop() {},
    onClose() {
      this.triggerEvent('close')
    },
    pick(e) {
      this.setData({ spec: e.currentTarget.dataset.v })
    },
    minus() {
      if (this.data.qty > 1) this.setData({ qty: this.data.qty - 1 })
    },
    plus() {
      this.setData({ qty: this.data.qty + 1 })
    },
    confirm() {
      this.triggerEvent('confirm', {
        qty: this.data.qty,
        spec: this.data.spec,
        price: this.data.price
      })
    }
  }
})
