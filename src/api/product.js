// 商品详情API接口

import request from '@/utils/request'

/*
 * 获取商品详情
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/*
 * 商品信息-库存价格是否有效
 */
export const findGoodsStock = (id) => {
  return request(`/goods/stock/${id}`, 'get')
}

/*
 * 商品规格信息
 */
export const findGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}
