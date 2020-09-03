export default {
  // <router-link to='/'></router-link>
  props: {
    to: {
      type: String,
      required: true
    }
  },
  render(h) {
    // h(tag, data, children)
    return h('a', {attrs: {href: '#' + this.to}}, this.$slots.default)
    // jsx写法
    // return <a href={'#' + this.to}>{this.$slots.default}</a>
  }
}