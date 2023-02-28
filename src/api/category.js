// 定义分类相关API接口函数
import request from '@/utils/request'

/*
 * 获取所有分类
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
