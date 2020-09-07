function defineReactive(obj, key, val) {
  // 递归
  observe(val)

  // 创建一个Dep和当前key值一一对应
  const dep = new Dep()

  // 对传入的obj进行访问的拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key)
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set', key, newVal)
        // 如果传入的newVal是object 需要响应化处理
        observe(newVal)
        val = newVal

        // watchers.forEach(w => w.upadte())
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return
  }

  // 创建Observer 分辨数据是对象还是数组
  new Observer(obj)
}

// 代理函数 方便用户直接访问$data
function proxy(vm, sourcekey) {
  Object.keys(vm[sourcekey]).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[sourcekey][key]
      },
      set(newVal) {
        vm[sourcekey][key] = newVal
      }
    })
  })
}

// 创建kvue 构造函数
class KVue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = options.data

    // 响应化处理
    observe(this.$data)

    // 数据代理
    proxy(this, '$data')

    // 创建编译器实例
    new Compile(options.el, this)
  }
  
}

// 根据对象的类型决定如何做响应化处理
class Observer {
  constructor(value) {
    this.value = value
    // 判断类型
    if (typeof value === 'object') {
      this.walk(value)
    }
  }
  // 对象数据的响应化
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key])
    })
  }
  // 数组数据的响应化 
}

// 观察者：保存更新函数,值发生变化调用更新函数
// const watchers = []
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm

    this.key = key

    this.updateFn = updateFn
    // watchers.push(this)

    // 在Dep.target静态实例上设置为当前watcher实例
    Dep.target = this
    this.vm[this.key] // 读取触发getter
    Dep.target = null // 收集完就置空
  }

  upadte() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// Dep：以来管理某个key相关的所有的Watcher实例
class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.upadte())
  }
}