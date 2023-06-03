// 购物车模块

import { findGoodsStock } from '@/api/product'
import {
  reqMemberCart,
  reqMemberCartM,
  findMemberCart,
  deleteCart,
  setMemberCart,
  checkAllCart
} from '@/api/cart'

export default {
  namespaced: true,
  state() {
    return {
      // 购物车商品列表
      list: []
    }
  },
  mutations: {
    // 添加购物车商品
    insertCart(state, goods) {
      const sameIndex = state.list.findIndex(
        (item) => item.skuId === goods.skuId
      )
      if (sameIndex >= 0) {
        goods.count = state.list[sameIndex].count + goods.count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(goods)
    },
    // 修改购物车商品
    updateCart(state, goods) {
      // goods中字段有可能不完整，goods有的信息才去修改。
      // 1. goods中必需又skuId，才能找到对应的商品信息
      const updateGoods = state.list.find(
        (item) => item.skuId === goods.skuId || item.skuId === goods.oldSkuId
      )
      for (const key in goods) {
        if (
          goods[key] !== null &&
          goods[key] !== undefined &&
          goods[key] !== ''
        ) {
          updateGoods[key] = goods[key]
        }
      }
    },

    // 删除购物车商品
    deleteCart(state, skuId) {
      const goodsId = state.list.findIndex((item) => item.skuId === skuId)
      console.log(goodsId)
      state.list.splice(goodsId, 1)
    },

    // 设置购物车列表
    setCartList(state, list) {
      state.list = list
    }
  },
  actions: {
    // 添加购物车商品
    insertCart(ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 加入购物车api
          reqMemberCart(goods.skuId, goods.count).then((data) => {
            ctx.commit('insertCart', goods)
            resolve()
          })
        } else {
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },

    // 获取购物车商品
    findCart(ctx, params) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录状态
          findMemberCart().then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          console.log(ctx.state.list)
          const promiseArr = ctx.state.list.map((item) =>
            findGoodsStock(item.skuId)
          )
          Promise.all(promiseArr)
            .then((dataArr) => {
              dataArr.forEach((data, i) => {
                ctx.commit('updateCart', {
                  skuId: ctx.state.list[i].skuId,
                  ...data.result
                })
              })
              resolve()
            })
            .catch((e) => {
              reject(e)
            })
        }
      })
    },

    // 修改购物车商品信息
    updateCart(ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录后
          setMemberCart(goods.skuId, goods.count, goods.selected)
            .then(() => {
              return findMemberCart()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          console.log(goods)
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    },

    // 删除购物车商品
    deleteCart(ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录状态
          deleteCart([skuId]).then((data) => {
            if (data.result) {
              ctx.commit('deleteCart', skuId)
            }
          })
          resolve()
        } else {
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },

    // 批量删除
    batchDeleteCart(ctx, params) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录状态
          const ids = ctx.getters.validSelected.map((item) => item.skuId)
          deleteCart(ids).then((data) => {
            if (data.result) {
              ctx.state.list.forEach((item) => {
                if (item.selected === true) {
                  ctx.commit('deleteCart', item.skuId)
                }
              })
            }
          })
          resolve()
        } else {
          ctx.state.list.forEach((item) => {
            if (item.selected === true) {
              ctx.commit('deleteCart', item.skuId)
            }
          })
          resolve()
        }
      })
    },

    // 全选按钮
    allSelected(ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录逻辑
          const ids = ctx.getters.validList.map((item) => item.skuId)
          checkAllCart({ selected, ids })
            .then(() => {
              return findMemberCart()
            })
            .then((data) => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
        } else {
          console.log('111')
          ctx.getters.validList.forEach((item) => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },

    // 合并购物车

    async mergeLocalCart(ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.getters.validList.map(
        ({ skuId, selected, count }) => {
          return { skuId, selected, count }
        }
      )
      await reqMemberCartM(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      return state.list.filter((item) => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      return (
        getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) /
        100
      )
    },
    // 计算选中商品
    validSelected(state, getters) {
      return state.list.filter((item) => item.selected === true)
    },
    // 计算被选中商品的数量
    validSelectCount(state, getters) {
      return getters.validSelected.length
    },
    // 计算购物车商品是否全选
    validAllSelect(state, getters) {
      return state.list.length === getters.validSelectCount
    },
    // 计算失效商品
    validStock(state, getters) {
      return state.list.filter(
        (item) => item.stock === 0 || item.isEffective === false
      )
    },
    // 计算被选中商品总金额
    validSelectedAmount(state, getters) {
      return getters.validSelected.reduce((p, c) => {
        return p + c.nowPrice * c.count
      }, 0)
    }
  }
}
