/*
 ** 购物车接口
 */

import request from '@/utils/request'

/*
 * 加入购物车
 */
export const reqMemberCart = (skuId, count) => {
  return request('/member/cart', 'post', { skuId, count })
}

/*
 * 合并购物车
 */
export const reqMemberCartM = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

/*
 * 获取购物车
 */
export const findMemberCart = () => {
  return request('/member/cart', 'get')
}

/*
 * 修改购物车
 */
export const setMemberCart = (id, count, selected) => {
  return request(`/member/cart/${id}`, 'put', { count, selected })
}

/*
 * 删除购物车商品
 */
export const deleteCart = (ids, clearAll, clearInvalid) => {
  return request('/member/cart', 'delete', { ids, clearAll, clearInvalid })
}

/*
 * 全选反选
 */
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
