import request from '@/router/axios'

// 获取我的消息
export function getMyMessage(params) {
  return request({
    url: '/admin/sysnoticesend/page',
    method: 'GET',
    params
  })
}
// 查询一条消息
export function getMessageById(id) {
  return request({
    url: '/admin/sysnoticesend/' + id,
    method: 'GET'
  })
}
// 将一条消息设置为已读
export function setMessageRead(data) {
  return request({
    url: '/admin/sysnoticesend/read',
    method: 'PUT',
    data
  })
}
// 删除一条消息
export function deleteMessageById(id) {
  return request({
    url: '/admin/sysnoticesend/' + id,
    method: 'DELETE'
  })
}