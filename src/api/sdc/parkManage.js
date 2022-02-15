import request from '@/router/axios'

export function sdcParkingLotAction(params,urlParams,action) {
  return request({
    url: '/park-sdc/sdccarpark' + urlParams,
    method: action,
    data: params
  })
}

export function getSdcParkingLotTable(condition) {
  return request({
    url: '/park-sdc/sdccarpark/page',
    method: 'get',
    params: condition
  })
}

export function getSdcParkingLotBySiteId(siteId) {
  return request({
    url: '/park-sdc/sdccarpark/list/'+siteId,
    method: 'get',
  })
}

export function getSdcParkingLotSiteTree() {
  return request({
    url: '/site-sdc/sdcsite/tree',
    method: 'get',
  })
}


/***************************************************车位管理******************************* */

export function sdcParkPlaceAction(params,urlParams,action) {
  return request({
    url: '/park-sdc/sdccarparkspace' + urlParams,
    method: action,
    data: params
  })
}

//车位查询
export function getSdcParkPlaceTable(condition) {
  return request({
    url: '/park-sdc/sdccarparkspace/page',
    method: 'get',
    params: condition
  })
}

export function getSdcParkPlaceSiteTree() {
  return request({
    url: '/park-sdc/sdccarmonitor/siteTreeBySpace',
    method: 'get',
  })
}

export function getSdcParkPlaceBy(start,end) {
  return request({
    url: '/park-sdc/sdccarparkspace/range/'+start+'/'+end,
    method: 'get',
  })
}

export function batchUpdateSdcParkPlace(params) {
  return request({
    url: '/park-sdc/sdccarparkspace/batchUpdate',
    method: 'post',
    data: params
  })
}

/***************************************************车辆管理******************************* */

export function sdcCarAction(params,urlParams,action) {
  return request({
    url: '/park-sdc/sdccarcar' + urlParams,
    method: action,
    data: params
  })
}

export function getSdcCarTable(condition) {
  return request({
    url: '/park-sdc/sdccarcar/page',
    method: 'get',
    params: condition
  })
}

export function getSdcCarSiteTree() {
  return request({
    url: '/park-sdc/sdccarmonitor/siteTreeByCar',
    method: 'get',
  })
}

/***************************************************规则管理******************************* */

export function sdcBillRulesAction(params,urlParams,action) {
  return request({
    url: '/park-sdc/sdccarbillrules' + urlParams,
    method: action,
    data: params
  })
}

export function getSdcBillRulesTable(condition) {
  return request({
    url: '/park-sdc/sdccarbillrules/page',
    method: 'get',
    params: condition
  })
}

export function getSdcBillRulesSiteTree() {
  return request({
    url: '/park-sdc/sdccarmonitor/siteTreeByRules',
    method: 'get',
  })
}