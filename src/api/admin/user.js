import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: '/admin/user/details/' + obj,
    method: 'get'
  })
}

// //获取最大磁盘容量值
// export function getMaxData(obj) {
//   return request({
//     url: '/admin/user/getAvailableData/' + obj,
//     method: 'get'
//   })
// }
