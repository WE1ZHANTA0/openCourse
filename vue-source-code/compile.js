// 编译器
// 递归遍历dom熟
// 判断节点类型 如果是文本判断是否绑定
// 如果是元素 则遍历属性

class Compile {
  // el 宿主元素
  // vm是kvue实例
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    if (this.$el) {
      // 执行编译
      this.compile(this.$el)
    }
  }

  compile(el) {
    // 遍历el树
    const childrens = el.childNodes
    Array.from(childrens).forEach(node => {
      // 判断是否是元素
      if (this.isElement(node)) {
        console.log('正在变异元素'+node.nodeName)
        this.compileElement(node)
      } else if(this.isInter(node)) {
        console.log('编译插值绑定' + node.textContent)
        this.compileText(node)
      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length >0){
        this.compile(node)
      }
    })
  }

  isElement(node) {
    return node.nodeType === 1
  }

  isInter(node) {
    // 首先是文本 其次内容是{{xxx}}形式
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  compileText(node) {
    // node.textContent = this.$vm[RegExp.$1] 
    this.update(node, RegExp.$1, 'text')
  }

  compileElement(node) {
    // 节点是元素 遍历当前节点属性
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach((attr) => {
      // 规定为k-xxx为绑定指令
      const attrName = attr.name // k-model
      const exp = attr.value // 绑定的表达式
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2)
        // 执行指令
        this[dir] && this[dir](node, exp)
      }
    })
  }
  // 判断是否是指令 
  isDirective(attr) {
    return attr.indexOf('k-') === 0
  }
  // 公共更新函数 
  // node - 节点 exp - 更新的字段 dir - 指令名称
  update(node, exp, dir) {
    // 初始化
    // 指令对应的更新函数 xxUpdater
    const fn = this[dir+'Updater']
    fn && fn(node, this.$vm[exp])

    // 创建watcher实例 --- 更新   封装一个更新函数可以更新dom元素
    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val)
    })
  }
  // k-text
  textUpdater(node, value) {
    node.textContent = value
  }
  // k-html
  htmlUpdater(node, value) {
    node.innerHTML = value
  }

  // k-text
  text(node, exp) {
    // node.textContent = this.$vm[exp]
    this.update(node, exp, 'text')
  }
  // k-html
  html(node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.update(node, exp, 'html')
  }
}