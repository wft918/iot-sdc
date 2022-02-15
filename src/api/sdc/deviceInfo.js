import request from '@/router/axios'
// 获取设备分页列表
export function getSdcDeviceTable(params) {
  return request({
    url: '/site-sdc/sdcdevice/page',
    method: 'get',
    params
  })
}
// 查询当前房间的所有设备
export function getSdcDeviceTableBy(current,size,id,siteId,sysCode,type) {
  return request({
    url: '/site-sdc/sdcdevice/page',
    method: 'get',
    params: {
      current,
        size,
        id,
        siteId,
        sysCode,
        type
    }
  })
}

export function getSdcDeviceList(current,size,siteId) {
  return request({
    url: '/site-sdc/sdcdevice/page',
    method: 'get',
    params: {
      current,
        size,
        siteId
    }
  })
}

export function getSdcDeviceByType(current,size,type) {
  return request({
    url: '/site-sdc/sdcdevice/page',
    method: 'get',
    params: {
      current,
        size,
        type
    }
  })
}

export function getSdcNVR(current,size,videoType) {
  return request({
    url: '/site-sdc/sdcdevice/page',
    method: 'get',
    params: {
      current,
        size,
        videoType
    }
  })
}

export function getSdcDeviceByModel(current,size,id,modelId) {
  return request({
    url: '/site-sdc/sdcdevice/pageByModel/'+modelId+'/',
    method: 'get',
    params: {
      current,
        size,
        id
    }
  })
}

export function addSdcDevice( obj ) {
  return request({
    url: '/site-sdc/sdcdevice',
    method: 'post',
    data: obj
  })
}


export function sdcDeviceAction(params,urlParams,action) {
  return request({
    url: '/site-sdc/sdcdevice' + urlParams,
    method: action,
    data: params
  })
}

export function getDevStatusList() {
  return request({
    url: '/admin/dict/type/device_status',
    method: 'get',
  })
}

export function getDevTreeBySiteId(siteId) {
  return request({
    url: '/site-sdc/sdcproject/tree/'+siteId,
    method: 'get',
  })
}
// 根据id获取停车场地图信息
export function getParkDataBySiteId(siteId) {
  return request({
    url: '/site-sdc/sdcsite/' + siteId,
    method: 'get'
  })
}
export function getDevInfoBySiteIdAndSys(siteId,sysCode,typeId) {
  return request({
    url: '/epm-sdc/sdcsitemanage/getBySiteSys',
    method: 'get',
    params: {
      siteId,
      sysCode,
      typeId
    }
  })
}

//根据设备Id查询物模型属性(即指标)
export function getTeleInfoByDevice(deviceId) {
  return request({
    url: '/epm-sdc/sdcdeviceindicator/page',
    method: 'get',
    params: {
      current: 1,
      size: 200,
      deviceId
    }
  })
}

export function getSdcTableBy(params) {
  return request({
    url: '/site-sdc/sdcdevice/pageByTopType',
    method: 'get',
    params
  })
}

export function getSdcGateInfo(gateCode) {
  return request({
    url: '/site-sdc/sdcdevice/'+ gateCode,
    method: 'get'
  })
}

//根据Id获取设备信息
export function getSdcNVRInfo(id) {
  return request({
    url: '/site-sdc/sdcdevice/'+ id,
    method: 'get'
  })
}

export function sdcDeviceIndicatorAction(params) {
  return request({
    url: '/epm-sdc/sdcdeviceindicator',
    method: 'put',
    data:params
  })
}
// 查询设备历史事件
export function getDeviceEventLog(params) {
  return request({
    url: '/epm-sdc/sdcdeviceeventlog/page',
    method: 'get',
    params
  })
}
// 查询告警列表
export function getAlarmLog(params) {
  return request({
    url: '/api-sdc/sdcsimulatoralarm/page',
    method: 'get',
    params
  })
}

export function updateAlarmLog(params) {
  return request({
    url: '/api-sdc/sdcsimulatoralarm',
    method: 'put',
    data: params
  })
}

export function sdcDeviceExport() {
  return request({
    url: '/site-sdc/sdcdevice/export',
    responseType: 'blob',
    method: 'get',
  })
}

export function sdcDeviceImport(formData) {
  return request.post(
    '/site-sdc/sdcdevice/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

// 获取站点下所有设备信息
export function getAllDevInfoBySiteId(siteId,sysCode) {
  return request({
    url: '/epm-sdc/sdcdeviceindicator/loadDevice/',
    method: 'get',
    params: {
      siteId,
      sysCode
    }
  })
}
// 获取站点下所有设备指标信息
export function getAllIndicatorBySiteId(siteId,sysCode) {
  return request({
    url: '/epm-sdc/sdcdeviceindicator/loadIndicator/',
    method: 'get',
    params: {
      siteId,
      sysCode
    }
  })
}
// 根据设备id获取设备以及指标等信息
export function getAllInfoByDevIds(data) {
  return request({
    url: '/epm-sdc/sdcdeviceindicator/loadAllByDeviceIds/',
    method: 'post',
    data
  })
}

// 获取告警统计信息
export function getAlarmStatistics() {
  return request({
    url: 'api-sdc/sdcsimulatoralarm/alarmLevelInfo/',
    method: 'get'
  })
}

// 导出告警列表
export function AlarmExport(data) {
  return request({
    url: '/api-sdc/sdcsimulatoralarm/export/',
    responseType: 'blob',
    method: 'post',
    data
  })
}

// 获取活动告警列表
export function getActiveAlarmList(params) {
  return request({
    url: '/api-sdc/sdcsimulatoralarm/realTime/page/',
    method: 'get',
    params
  })
}

// 获取FSU关联的设备
export function getDeviceByFsu(code) {
  return request({
    url: '/site-sdc/sdcdevice/getDeviceByFsu/',
    method: 'get',
    params: {
      code
    }
  })
}
// 根据设备id获取FSU
export function getFsuByDevice(id) {
  return request({
    url: '/site-sdc/sdcdevice/getFsuByDevice/',
    method: 'get',
    params: {
      id
    }
  })
}