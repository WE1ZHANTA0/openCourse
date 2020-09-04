let Vue 
class Store{
  constructor(options) {
    this._mutations = options.mutations
    this._actions = options.actions
    // this.state = new Vue({
    //   data: options.state
    // })
    this._vm = new Vue({
      data: {
        // 加两个$ vue 不会去做代理  意味着vm里访问不大this._vm.data.$$store   只能this._vm._data.$$store访问
        $$store: options.state
      }
    })

    // 绑定commit 和 dispatch上下文为store实例
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state() {
    console.log(this._vm)
    return this._vm._data.$$store
  }

  set state(v) {
    console.error('gun')
  }


  // type mutation的类型
  // payload 载荷： 参数
  commit(type, payload) {
    const entry = this._mutations[type]
    if (entry) {
      entry(this.state, payload)
    }
  }

  dispatch(type, payload) {
    const entry = this._actions[type]
    if (entry) {
      entry(this, payload)
    }
  }
}

function install(_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate() {
      // 当前的this指向个个组件    根组件挂载$store方法
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

// Vuex
export default {
  Store,
  install
}