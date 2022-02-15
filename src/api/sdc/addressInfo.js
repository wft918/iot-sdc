import request from '@/router/axios'

export function getSdcSiteTable(current,size,id) {
  return request({
    url: '/site-sdc/sdcsite/page',
    method: 'get',
    params: {
      current,
        size,
        id
    }
  })
}


export function addSdcSite( obj ) {
  return request({
    url: '/site-sdc/sdcsite',
    method: 'post',
    data: obj
  })
}


export function sdcSiteAction(params,urlParams,action) {
  return request({
    url: '/site-sdc/sdcsite' + urlParams,
    method: action,
    data: params
  })
}

export function getAddressList() {
  return request({
    url: '/admin/dict/type/site_type',
    method: 'get',
  })
}

export function getNodeList() {
  return request({
    url: '/admin/dict/type/node_type',
    method: 'get',
  })
}

export function getStationList() {
  return request({
    url: '/admin/dict/type/station_type',
    method: 'get',
  })
}
// 查询一个站点
export function getSiteById(id) {
  return request({
    url: '/site-sdc/sdcsite/' + id,
    method: 'get',
  })
}
