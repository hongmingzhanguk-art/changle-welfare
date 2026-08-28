Component({
  properties: {
    show: { type: Boolean, value: false },
    title: { type: String, value: '' },
    cancelText: { type: String, value: '取消' },
    confirmText: { type: String, value: '确定' },
    showCancel: { type: Boolean, value: true }
  },
  methods: {
    noop() {},
    onMask() {
      this.triggerEvent('close')
    },
    onCancel() {
      this.triggerEvent('cancel')
    },
    onConfirm() {
      this.triggerEvent('confirm')
    }
  }
})
