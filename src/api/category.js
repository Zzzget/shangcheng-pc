// 定义分类相关API接口函数
import request from '@/utils/request'

/*
 * 获取所有分类
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/*
 * 获取一级类目商品
 */
export const findCategory = (id) => {
  return request('/category', 'get', { id })
}

/*
 * 获取二级类目筛选
 */
export const findfilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

/*
 * 获取商品列表
 */
export const findCategoryGoods = (params) => {
  return request('/category/goods', 'post', { params })
}
