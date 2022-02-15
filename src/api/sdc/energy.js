import request from '@/router/axios'

/**
 * 能耗分析
 * 园区PUE
 */

// 获取方案
export function getEnergyPlanList(siteId) {
  return request({
    url: '/site-sdc/sdcpueconfig/getConfig/',
    method: 'get',
    params: {
      siteId
    }
  })
}

export function getCurrentPueValue(planId) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/getPueRightNow/',
    method: 'get',
    params: {
      planId
    }
  })
}

export function getPueCurve(planId) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/getPueIn24Hour/',
    method: 'get',
    params: {
      planId
    }
  })
}

// 7日能耗占比
export function getDeviceEnergyConsum(planId) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/get7daysEnergyConsume/',
    method: 'get',
    params: {
      planId
    }
  })
}
// 当日能耗占比
export function getDayDeviceEnergyConsum(planId) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/getEnergyConsumeRightNow/',
    method: 'get',
    params: {
      planId
    }
  })
}
// 机房it能耗排行
// export function getItDevEncRank(siteId) {
//   return request({
//     url: '/site-sdc/sdcdevicepowerlog/getItEnergyConsumeRank/',
//     method: 'get',
//     params: {
//       siteId
//     }
//   })
// }

// it设备24小时能耗曲线
export function getItDevEnergyConsum(planId) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/getDeviceEnergyConsumeIn24Hour/',
    method: 'get',
    params: {
      planId
    }
  })
}

// it设备能耗明细表
export function getItDevEnergyDetail(planId, current, size) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/getItEnergyConsumeDetail/',
    method: 'get',
    params: {
      planId,
      current,
      size
    }
  })
}

/**
 * 能耗分析
 * 机房PUE
 */

// pue排行
export function getPueRank(siteId) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/getPueRank/',
    method: 'get',
    params: {
      siteId
    }
  })
}
// 机房两日pue值
export function getTwoDaysPue(siteId) {
  return request({
    url: '/site-sdc/sdcdevicepowerlog/getTwoDaysPue/',
    method: 'get',
    params: {
      siteId
    }
  })
}

/**
 * 电表公式配置
 */
// 获取带公式标志的站点tree
export function getFlagSiteTree() {
  return request({
    url: '/site-sdc/sdcpueconfig/tree',
    method: 'get'
  })
}
// 获取方案列表
export function getPlanList(params) {
  return request({
    url: '/site-sdc/sdcpueconfig/page',
    method: 'get',
    params
  })
}
// 获取所有电表数据
export function getElectricList(id) {
  return request({
    url: '/site-sdc/sdcpueconfig/getElectric/' + id,
    method: 'get'
  })
}
// 获取it电表数据
// export function getItElectricList(id) {
//   return request({
//     url: '/site-sdc/sdcpueconfig/getElectricForIT/' + id,
//     method: 'get'
//   })
// }
// 保存方案
export function postFormula(data) {
  return request({
    url: '/site-sdc/sdcpueconfig',
    method: 'post',
    data
  })
}
// 修改方案
export function putFormula(data) {
  return request({
    url: '/site-sdc/sdcpueconfig',
    method: 'put',
    data
  })
}
// 删除方案
export function deleteFormula(id) {
  return request({
    url: '/site-sdc/sdcpueconfig/' + id,
    method: 'delete'
  })
}

