// 分类模块

import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state() {
    return {
      // 分类信息集合, 默认数据依赖于topCategory数据，防止出现空白
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  // 修改分类函数
  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    // 定义show和hide函数，控制当前分类的二级分类显示和隐藏
    show(state, id) {
      const currCategory = state.list.find((item) => item.id === id)
      currCategory.open = true
    },
    hide(state, id) {
      const currCategory = state.list.find((item) => item.id === id)
      currCategory.open = false
    }
  },
  // 获取分类函数
  actions: {
    async getList(ctx) {
      // 获取分类数据
      const data = await findAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的数据
      data.result.forEach((top) => {
        top.open = false
      })
      // console.log(data)
      // 修改分类数据
      ctx.commit('setList', data.result)
    }
  }
}