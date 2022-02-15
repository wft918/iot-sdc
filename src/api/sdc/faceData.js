import request from '@/router/axios'
// 获取人脸库分页列表
export function getFaceDataList(current, size) {
  return request({
    url: '/facedetect-sdc/sdcfdlocallib/page',
    method: 'GET',
    params: {
      current, 
      size
    }
  })
}
// 添加人脸库
export function addFaceData(name, status, siteId, remarks) {
  return request({
    url: '/facedetect-sdc/sdcfdlocallib',
    method: 'POST',
    data: {
      name,
      status,
      siteId,
      remarks
    }
  })
}
// 通过所属园区id获取分页列表
export function getListBySiteId(current, size, siteId) {
  return request({
    url: '/facedetect-sdc/sdcfdlocallib/page',
    method: 'GET',
    params: {
      current,
      size,
      siteId
    }
  })
}
// 修改人脸库
export function editFaceData(id, name, status, siteId,remarks) {
  return request({
    url: '/facedetect-sdc/sdcfdlocallib',
    method: 'PUT',
    data: {
      id,
      name,
      status,
      siteId,
      remarks
    }
  })
}
// 删除人脸库
export function deleteFaceData(id) {
  return request({
    url: '/facedetect-sdc/sdcfdlocallib/' + id,
    method: 'DELETE',
  })
}
// 获取人脸库和人员关系表
export function getPersonReList(libId) {
  return request({
    url: '/facedetect-sdc/sdcfdlibpersonrela/page',
    method: 'GET',
    params: {
      libId
    }
  })
}
// 批量新增关联
export function addPersonReLists(dataObj) {
  return request({
    url: '/facedetect-sdc/sdcfdlibpersonrela',
    method: 'POST',
    data: dataObj
  })
}
