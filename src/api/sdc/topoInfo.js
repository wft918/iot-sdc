import request from '@/router/axios'

//拓扑图组件表
//查询
export function getSdcTopoComponentTable(params) {
  return request({
    url: '/topo-sdc/sdctopocomponent/page',
    method: 'get',
    params: params
  })
}

//新增
export function addSdcTopoComponent(params) {
  return request({
    url: '/topo-sdc/sdctopocomponent',
    method: 'post',
    data: params
  })
}

//新增
export function querySdcTopoComponent(params) {
  return request({
    url: '/topo-sdc/sdctopocomponent/'+params,
    method: 'get',
  })
}

//修改或删除
export function sdcTopoComponentAction(params,urlParams,action) {
  return request({
    url: '/topo-sdc/sdctopocomponent' + urlParams,
    method: action,
    data: params
  })
}

//拓扑图主表
//查询
export function getSdcTopoTable(params) {
  return request({
    url: '/topo-sdc/sdctopoinfo/page',
    method: 'get',
    params: params
  })
}

//新增
export function addSdcTopo(params) {
  return request({
    url: '/topo-sdc/sdctopoinfo',
    method: 'post',
    data: params
  })
}

//修改或删除
export function sdcTopoAction(params,urlParams,action) {
  return request({
    url: '/topo-sdc/sdctopoinfo' + urlParams,
    method: action,
    data: params
  })
}

//拓扑图关系表
//查询
export function getSdcTopoDevTable(params) {
  return request({
    url: '/topo-sdc/sdctopodevicerela/page',
    method: 'get',
    params: params
  })
}

//新增
export function addSdcTopoDev(params) {
  return request({
    url: '/topo-sdc/sdctopodevicerela',
    method: 'post',
    data: params
  })
}

//修改
export function sdcTopoDevAction(params,urlParams,action) {
  return request({
    url: '/topo-sdc/sdctopodevicerela' + urlParams,
    method: action,
    data: params
  })
}
// 删除
export function deleteDevTopoRe(id) {
  return request({
    url: '/topo-sdc/sdctopodevicerela/' + id,
    method: 'delete'
  })
}