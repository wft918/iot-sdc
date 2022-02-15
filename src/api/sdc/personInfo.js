import request from '@/router/axios'

// 获取人员信息表
export function getPersonList(current, size) {
  return request({
    url: '/facedetect-sdc/sdcfdlocalperson/page',
    method: 'GET',
    params: {
      current,
      size
    }
  })
}
// 新增人员
export function addPerson(addInfo) {
  return request({
    url: '/facedetect-sdc/sdcfdlocalperson',
    method: 'POST',
    data: addInfo
  })
}
// 修改人员
export function editPerson(editInfo) {
  return request({
    url: '/facedetect-sdc/sdcfdlocalperson',
    method: 'PUT',
    data: editInfo
  })
}
// 删除人员
export function deletePerson(id) {
  return request({
    url: '/facedetect-sdc/sdcfdlocalperson/' + id,
    method: 'DELETE' 
  })
}
// 根据园区id查找人员
export function getPersonBySiteId(current, size, siteId) {
  return request({
    url: '/facedetect-sdc/sdcfdlocalperson/page',
    method: 'GET',
    params: {
      current, 
      size, 
      siteId
    }
  })
}