import request from '@/router/axios'

export function getSdcLightGateWaysTable(params) {
  return request({
    url: '/light-sdc/sdclightgatewaystatus/page',
    method: 'get',
    params
  })
}

export function getSdcLightLampsTable(params) {
  return request({
    url: '/light-sdc/sdclightlampstatus/page',
    method: 'get',
    params
  })
}

export function getSdcLightBroadcastTable(params) {
  return request({
    url: '/light-sdc/sdclightplaystatus/broadcast/page',
    method: 'get',
    params
  })
}


export function getSdcLightLEDTable(params) {
  return request({
    url: '/light-sdc/sdclightplaystatus/led/page',
    method: 'get',
    params
  })
}

// export function getSdcLightGateWaysTable(params) {
//   return request({
//     url: '/light-sdc/sdclightgatewaystatus/page',
//     method: 'get',
//     params
//   })
// }

// export function getSdcLightGateWaysTable(params) {
//   return request({
//     url: '/light-sdc/sdclightgatewaystatus/page',
//     method: 'get',
//     params
//   })
// }



//网关
export function getSdcLightGateWays(params) {
  return request({
    url: '/light-sdc/sdclightgatewaystatus/'+ params,
    method: 'get',
  })
}

//杆体
export function getSdcLight(params) {
  return request({
    url: '/light-sdc/sdclightstatus/'+ params,
    method: 'get',
  })
}

//照明
export function getSdcLightLamp(params) {
  return request({
    url: '/light-sdc/sdclightlampstatus/'+ params,
    method: 'get',
  })
}

//照明
export function updateSdcLightLamp(params) {
  return request({
    url: '/light-sdc/sdclightlampstatus',
    method: 'put',
    data:params
  })
}

//广播和LED
export function getSdcLightPlays(params) {
  return request({
    url: '/light-sdc/sdclightplaystatus/'+ params,
    method: 'get',
  })
}

export function getSdcLightSensorTable(params) {
  return request({
    url: '/light-sdc/sdclightsensorstatus/page',
    method: 'get',
    params
  })
}