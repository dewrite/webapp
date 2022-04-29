import request from './request'

// 初始化站点
export function init(id, overwrite = false) {
  return request({
    url: '/api/site/init/' + id,
    params: { overwrite }
  })
}

// 更新站点
export function update(id) {
  return request({
    url: '/api/site/update/' + id,
  })
}

// 发布站定
export function publish(id) {
  return request({
    url: '/api/site/publish/' + id,
  })
}

// 部署站点
export function deploy(id) {
  return request({
    url: '/api/site/deploy/' + id,
  })
}

// 发布IPFS
export function ipfs(id) {
  return request({
    url: '/api/articles/ipfs/' + id,
  })
}

// 发布文章
export function article(id) {
  return request({
    url: '/api/articles/build/' + id,
  })
}