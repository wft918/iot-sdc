import request from '@/router/axios'

export function getSdcDeviceModeTable(params) {
  return request({
    url: '/site-sdc/sdcdevicemode/page',
    method: 'get',
    params
  })
}


export function addSdcDeviceMode( obj ) {
  return request({
    url: '/site-sdc/sdcdevicemode',
    method: 'post',
    data: obj
  })
}


export function sdcDeviceModeAction(params,urlParams,action) {
  return request({
    url: '/site-sdc/sdcdevicemode' + urlParams,
    method: action,
    data: params
  })
}

export function getSystemList() {
  return request({
    url: '/admin/dict/type/sys_type',
    method: 'get',
  })
}

export function sdcBrandExport() {
  return request({
    url: '/site-sdc/sdcdevicemode/export',
    responseType: 'blob',
    method: 'get',
  })
}

export function sdcBrandImport(formData) {
  return request.post(
    '/site-sdc/sdcdevicemode/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}