import request from '@/router/axios'

export function getSdcDeviceTypeTable(params) {
  return request({
    url: '/site-sdc/sdcdevicetype/page',
    method: 'get',
    params
  })
}


export function addSdcDeviceType(obj) {
  return request({
    url: '/site-sdc/sdcsite',
    method: 'post',
    data: obj
  })
}


export function sdcDeviceTypeAction(params, urlParams, action) {
  return request({
    url: '/site-sdc/sdcdevicetype' + urlParams,
    method: action,
    data: params

  })
}

export function getSdcDeviceTypeTree(sysCode) {
  return request({
    url: '/site-sdc/sdcdevicetype/tree/' + sysCode,
    method: 'get',
  })
}

export function getSystemList() {
  return request({
    url: '/admin/dict/type/sys_type',
    method: 'get',
  })
}


export function getDataTypeList() {
  return request({
    url: '/admin/dict/type/data_type',
    method: 'get',
  })
}

export function sdcDeviceTypeExport() {
  return request({
    url: '/site-sdc/sdcdevicetype/export',
    responseType: 'blob',
    method: 'get',
  })
}

export function sdcDeviceTypeImport(formData) {
  return request.post(
    '/site-sdc/sdcdevicetype/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
// 查询一个对象
export function getDeviceTypeById(id) {
  return request({
    url: '/site-sdc/sdcdevicetype/' + id,
    method: 'get',
  })
}