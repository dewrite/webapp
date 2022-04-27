import request from './request'

export function init(id, overwrite = false) {
  return request({
    url: '/api/site/init/' + id,
    params: { overwrite }
  })
}

export function update(id) {
  return request({
    url: '/api/site/update/' + id,
  })
}

export function publish(id) {
  return request({
    url: '/api/site/publish/' + id,
  })
}

export function deploy(id) {
  return request({
    url: '/api/site/deploy/' + id,
  })
}

export function article(id) {
  return request({
    url: '/api/articles/build/' + id,
  })
}