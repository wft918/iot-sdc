import request from '@/router/axios'

//获取公告列表列表
export function getAnnouncementList(params) {
  return request({
    url: '/announcement-sdc/sdcannouncement/page',
    method: 'GET',
    params
  })
}
// 查询一条公告
export function getAnnouncementById(id) {
  return request({
    url: '/announcement-sdc/sdcannouncement/' + id,
    method: 'GET'
  })
}
// 修改一条公告
export function editAnnouncementById(data) {
  return request({
    url: '/announcement-sdc/sdcannouncement/',
    method: 'PUT',
    data
  })
}
// 删除一条公告
export function removeAnnouncementById(id) {
  return request({
    url: '/announcement-sdc/sdcannouncement/' + id,
    method: 'DELETE'
  })
}
// 根据部门id查询用户
export function getUsersByDeptIds(params, ids) {
  console.log(params, ids);
  return request({
    url: '/admin/user/pageByDeptIds',
    method: 'POST',
    params,
    data: {
      deptIds: ids
    }
  })
}
// 新增一条公告
export function addAnnouncement(data) {
  return request({
    url: '/announcement-sdc/sdcannouncement/',
    method: 'POST',
    data
  })
}
// 发布一条公告
export function publishAnnouncement(data) {
  return request({
    url: '/announcement-sdc/sdcannouncement/publish',
    method: 'PUT',
    data
  })
}
// 撤销一条公告
export function rollbackAnnouncement(data) {
  return request({
    url: '/announcement-sdc/sdcannouncement/rollback',
    method: 'PUT',
    data
  })
}
// 获取我的公告
export function getMyAnnouncement(params) {
  return request({
    url: '/announcement-sdc/sdcannouncementsend/page',
    method: 'GET',
    params
  })
}
// 将公告设置为已读
export function setAnnouncementRead(data) {
  return request({
    url: '/announcement-sdc/sdcannouncementsend/read',
    method: 'PUT',
    data
  })
}