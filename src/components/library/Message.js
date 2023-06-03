import XtxMessage from './xtx-message'

import { h, render } from 'vue'

// 准备一个dom容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

// 定时器标识
let timer = null

export default ({ text, type }) => {
  // 渲染组件
  // 1.导入消息提示组件
  // 2.将消息提示组件编译为虚拟节点(dom节点)
  // createVNode(组件，属性对象（props）)
  const vnode = h(XtxMessage, { text, type })
  render(vnode, div)

  // 3s后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
