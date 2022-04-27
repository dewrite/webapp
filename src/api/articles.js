import request from './request'
// ====================================
// ====================================
//  User api
// ====================================
// ====================================
/**
 * 获取对象列表
 */
export function fetch(query) {
  return request({
    url: '/api/articles',
    method: 'get',
    params: query
  })
}
/**
 * 获取登录用户的列表，JWT
 */
export function mine(query) {
  return request({
    url: '/api/articles/mine',
    method: 'get',
    params: query
  })
}
/**
 * 通过ID获取对象
 */
export function fetchId(id) {
  return request({
    url: '/api/articles/' + id,
    method: 'get'
  })
}
/**
 * 添加对象
 */
export function addModel(data) {
  return request({
    url: '/api/articles',
    method: 'post',
    data
  })
}
/**
 * 更新对象
 */
export function updateModel(id, data) {
  return request({
    url: `/api/articles/${id}`,
    method: 'put',
    data
  })
}
/**
 * 删除对象
 */
export function deleteModel(id) {
  return request({
    url: `/api/articles/${id}`,
    method: 'delete'
  })
}
