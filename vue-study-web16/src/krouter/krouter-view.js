export default {
  render(h) {
    // 获取path对应的组件
    const { routerMap, current } = this.$router
    const component = routerMap[current].component || null
    return h(component)
  }
}