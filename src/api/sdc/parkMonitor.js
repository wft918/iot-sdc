import request from '@/router/axios'

/***********************************出入记录****************************************/
export function getSdcParkuselogTable(condition) {
  return request({
    url: '/park-sdc/sdccarparkuselog/page',
    method: 'get',
    params: condition
  })
}

/***********************************收费记录****************************************/
export function getSdcParkuselogPayTable(condition) {
  return request({
    url: '/park-sdc/sdccarparkuselog/pagePay',
    method: 'get',
    params: condition
  })
}
/***********************************充电记录****************************************/
export function getSdcChargeuselogTable(condition) {
  return request({
    url: '/park-sdc/sdccarchargeruselog/page',
    method: 'get',
    params: condition
  })
}


/***********************************在场车辆记录****************************************/
export function getSdcChargeuselogInternalTable(condition) {
  return request({
    url: '/park-sdc/sdccarparkuselog/pageInternal',
    method: 'get',
    params: condition
  })
}

/***********************************实时监控统计****************************************/
export function getSdcCountInOut(parkId) {
  return request({
    url: '/park-sdc/sdccarmonitor/countInOut/'+parkId,
    method: 'get',
  })
}

export function getSdcVideoInfo(url,port,params) {
  return request.get(
    'http://'+url+ ':' + port+ '/api/v1/stream/start',
    params
  )
}
