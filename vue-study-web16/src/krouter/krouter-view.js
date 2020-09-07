export default {
  render(h) {
    // 标记当前routerView的深度

    this.$vnode.data.routerView = true

    let depth = 0

    let parent = this.$parent

    while(parent) {
      const vnodeData = parent.$vnode && parent.$vnode.data
      if (vnodeData) {
        if (vnodeData.routerView) {
          // 说明parent是个router-view
          depth ++ 
        }
      }
      parent = parent.$parent
    }


    // 获取path对应的组件
    // const { routerMap, current } = this.$router
    // const component = routerMap[current].component || null
    
    let component = null
    const route = this.$router.matched[depth]
    if (route) {
      component = route.component
    }
    return h(component)
  }
}