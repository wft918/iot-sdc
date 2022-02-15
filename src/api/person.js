import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/demo1/person/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/demo1/person',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/demo1/person/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/demo1/person/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/demo1/person',
    method: 'put',
    data: obj
  })
}
