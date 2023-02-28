// 首页想过API接口

import request from '@/utils/request'
/*
 * 获取左侧弹层热门品牌
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/*
 * 获取轮播图广告
 */

export const findBanner = (distributionSite) => {
  return request('/home/banner', 'get', { distributionSite })
}

/*
 * 获取新鲜好物
 */
export const findNew = (limit) => {
  return request('/home/new', 'get', { limit })
}

/*
 * 获取人气推荐
 */
export const findHot = () => {
  return request('/home/hot', 'get')
}

/*
 * 获取商品
 */
export const findGoods = () => {
  return request('/home/goods', 'get')
}

/*
 * 获取最新专题
 */
export const findSpecial = () => {
  return request('/home/special', 'get')
}
