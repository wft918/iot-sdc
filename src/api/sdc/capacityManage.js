import request from '@/router/axios'

//获取机柜容量列表
export function getCabinetList(current, size, siteId) {
  return request({
    url: '/site-sdc/sdccapacityracklog/page',
    method: 'GET',
    params: {
      current,
      size,
      siteId
    }
  })
}
// 获取u位使用情况列表
export function getUnitList(params) {
  return request({
    url: '/site-sdc/sdccapacityunit/page',
    method: 'GET',
    params
  })
}
// 获取机柜列表
export function getRackList(current, size, siteId, topTypeCode) {
  return request({
    url: '/site-sdc/sdcdevice/pageByTopType',
    method: 'GET',
    params: {
      current, 
      size, 
      siteId, 
      topTypeCode
    }
  })
}
// 获取机柜的u位数
export function getUnum(rackId, dataDate) {
  return request({
    url: '/site-sdc/sdccapacityunitlog/getFreeIndex',
    method: 'GET',
    params: {
      rackId,
      dataDate
    }
  })
}
// 新增u位使用情况
// export function addUnitUsage(dataObj) {
//   return request({
//     url: '/site-sdc/sdccapacityunitlog',
//     method: 'POST',
//     data: dataObj
//   })
// }
// 修改u位使用情况
export function editUnitUsage(dataObj) {
  return request({
    url: '/site-sdc/sdccapacityunit/',
    method: 'PUT',
    data: dataObj
  })
}
// 删除u位使用情况
// export function deleteUnitUsage(id) {
//   return request({
//     url: '/site-sdc/sdccapacityunitlog/' + id,
//     method: 'DELETE'
//   })
// }
// 获取客户列表
export function getClientList(data) {
  return request({
    url: '/site-sdc/sdccapacityclient/page',
    method: 'GET',
    params: data
  })
}
// 新增客户
export function addClient(data) {
  return request({
    url: '/site-sdc/sdccapacityclient',
    method: 'POST',
    data
  })
}
// 修改客户
export function editClient(data) {
  return request({
    url: '/site-sdc/sdccapacityclient',
    method: 'PUT',
    data
  })
}
// 删除客户
export function deleteClient(id) {
  return request({
    url: '/site-sdc/sdccapacityclient/' + id,
    method: 'DELETE'
  })
}

// 获取机房可用容量列表
export function getAvaliableList(current, size, siteId) {
  return request({
    url: '/site-sdc/sdccapacityindicator/page',
    method: 'GET',
    params: {
      current,
      size,
      siteId
    }
  })
}

// 机房U位使用率
export function getUnitUseRate(siteId) {
  return request({
    url: '/site-sdc/sdccapacity/percent',
    method: 'GET',
    params: {
      siteId
    }
  })
}
// 机房U位客户使用排行
export function getClientRank(siteId) {
  return request({
    url: '/site-sdc/sdccapacity/rank',
    method: 'GET',
    params: {
      siteId
    }
  })
}
// 获取机房容量趋势列表数据
// export function getTrendList(current, size, siteId) {
//   return request({
//     url: '/site-sdc/sdccapacityroomlog/page',
//     method: 'GET',
//     params: {
//       current, 
//       size, 
//       siteId
//     }
//   })
// }
// 获取机房容量趋势图表数据
// export function getCapacityTrend(siteId) {
//   return request({
//     url: '/site-sdc/sdccapacity/trend',
//     method: 'GET',
//     params: {
//       siteId
//     }
//   })
// }

// 容量记录
export function getCapacityLog(params) {
  return request({
    url: '/site-sdc/sdccapacitylog/page',
    method: 'GET',
    params
  })
}
// 容量记录(机柜)
export function getCapacityRackLog(params) {
  return request({
    url: '/site-sdc/sdccapacitylog/getCapacityOfRack',
    method: 'GET',
    params
  })
}
// 容量记录（U位）
export function getCapacityUnitLog(params) {
  return request({
    url: '/site-sdc/sdccapacityunitlog/calculateRackCapacity',
    method: 'GET',
    params
  })
}
// 容量记录（电力）
export function getCapacityPowerLog(params) {
  return request({
    url: '/site-sdc/sdccapacitylog/getCapacityOfPower',
    method: 'GET',
    params
  })
}
// 容量记录（制冷）
export function getCapacityCoolLog(params) {
  return request({
    url: '/site-sdc/sdccapacitylog/getCapacityOfCool',
    method: 'GET',
    params
  })
}
// 实时获取机房容量
export function getRealTimeCapacity(params) {
  return request({
    url: '/site-sdc/sdccapacitylog/getRealTimeCapacity',
    method: 'GET',
    params
  })
}
// 容量趋势
export function getTrendList(params) {
  return request({
    url: '/site-sdc/sdccapacitylog/getCapacityTrend',
    method: 'GET',
    params
  })
}
// 获取机房容量趋势图表数据
export function getCapacityTrend(params) {
  return request({
    url: '/site-sdc/sdccapacitylog/trendLogLineChart',
    method: 'GET',
    params
  })
}
// 预警规则分页查询
export function getRuleList(params) {
  return request({
    url: '/site-sdc/sdccapacityrule/page',
    method: 'GET',
    params
  })
}
// 新增预警规则
export function addRule(data) {
  return request({
    url: '/site-sdc/sdccapacityrule',
    method: 'POST',
    data
  })
}
// 修改规则
export function editRule(data) {
  return request({
    url: '/site-sdc/sdccapacityrule',
    method: 'PUT',
    data
  })
}
// 删除规则
export function removeRule(id) {
  return request({
    url: '/site-sdc/sdccapacityrule/' + id,
    method: 'DELETE'
  })
}
// 切换规则启用状态
export function switchStatus(data) {
  return request({
    url: '/site-sdc/sdccapacityrule/changeStatus',
    method: 'PUT',
    data
  })
}
// 预警规则关联区域
export function reTarget(data) {
  return request({
    url: '/site-sdc/sdccapacityruletarget/',
    method: 'POST',
    data
  })
}