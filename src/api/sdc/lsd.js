import request from '@/router/axios'

/**
 * 大屏界面综合态势
 */

//运行状况
export function getRunStatusInfo(siteId) {
  return request({
    url: '/stats/dashboard/runStatus/',
    method: 'get',
    params: {
      siteId
    }
  })
}

//设备概况
export function getDeviceInfo(siteId) {
  return request({
    url: '/stats/dashboard/deviceOverview/',
    method: 'get',
    params: {
      siteId
    }
  })
}

//停车位分析
// export function getPSAnalysis(params) {
//   return request({
//     url: '/stats/dashboard/parkingSpaceAnalysis',
//     method: 'post',
//     data: params
//   })
// }

// 今日容量分析
export function getCapacityAnalysis(siteId) {
  return request({
    url: '/stats/dashboard/capacityAnalyse/',
    method: 'get',
    params: {
      siteId
    }
  })
}

//照明设备分类统计
// export function getLDDetail(params) {
//   return request({
//     url: '/stats/dashboard/lightingDeviceTypeStatistics',
//     method: 'post',
//     data: params
//   })
// }

//环境信息
export function getEnvironmentalInfo(params) {
  return request({
    url: '/stats/dashboard/roomEnv',
    method: 'get',
    params
  })
}

//主要污染物
export function getMainPollutants(params) {
  return request({
    url: '/stats/dashboard/mainPollutants',
    method: 'post',
    data: params
  })
}

//告警状态统计
export function getAlarmStatusStatistics(params) {
  return request({
    url: '/stats/dashboard/alarmStatusStatistics',
    method: 'post',
    data: params
  })
}

// 告警设备数量排行
export function getDeviceAlarmNumRank(params) {
  return request({
    url: '/stats/powerring/deviceAlarmNumRank/',
    method: 'get',
    params
  })
}

// 告警设备时长排行
export function getDeviceAlarmDurRank(params) {
  return request({
    url: '/stats/powerring/deviceAlarmDurRank/',
    method: 'get',
    params
  })
}

//数据中心能效趋势
export function getDataCenterPueTrends(params) {
  return request({
    url: '/stats/dashboard/dataCenterPueTrends',
    method: 'post',
    data: params
  })
}


/**
 * 大屏界面动环系统
 */

//资产统计
// export function getAssetStatistics(params) {
//   return request({
//     url: '/stats/powerring/assetStatistics',
//     method: 'post',
//     data: params
//   })
// }

// 设备类型统计
export function getDeviceTypeStatistics(siteId) {
  return request({
    url: '/stats/powerring/deviceTypeStatistic/',
    method: 'get',
    params: {
      siteId
    }
  })
}

// 设备运行状态
export function getDeviceStatusStatistic(siteId) {
  return request({
    url: '/stats/powerring/deviceStatusStatistic/',
    method: 'get',
    params: {
      siteId
    }
  })
}

// 告警数量趋势
export function getAlarmNunsTrend(params) {
  return request({
    url: '/stats/powerring/alarmTrend/',
    method: 'get',
    params
  })
}

// 机房告警数量排行
export function getRoomAlarmNumRank(params) {
  return request({
    url: '/stats/powerring/roomAlarmNumRank/',
    method: 'get',
    params
  })
}

// 机房告警数量趋势
export function getRoomAlarmNumTrend(params) {
  return request({
    url: '/stats/powerring/roomAlarmTrend/',
    method: 'get',
    params
  })
}

//中部头信息
export function getPowerRingSignInfo(params) {
  return request({
    url: '/stats/dashboard/roomEnv',
    method: 'get',
    params
  })
}

//资产运行状态
export function getAssetOperationStatus(params) {
  return request({
    url: '/stats/powerring/assetOperationStatus',
    method: 'post',
    data: params
  })
}

//设备故障率
export function getDeviceFailureRateTrend(params) {
  return request({
    url: '/stats/powerring/deviceFailureRateTrend',
    method: 'post',
    data: params
  })
}

//告警处理统计
export function getAlarmProcessingStatistics(params) {
  return request({
    url: '/stats/powerring/alarmProcessingStatistics',
    method: 'post',
    data: params
  })
}

//机房告警数据统计
export function getAlarmDataRanking(params) {
  return request({
    url: '/stats/powerring/alarmDataRanking',
    method: 'post',
    data: params
  })
}

//工单总数统计
export function getTotalWorkOrdersStatistics(params) {
  return request({
    url: '/stats/powerring/totalWorkOrdersStatistics',
    method: 'post',
    data: params
  })
}

//工单情况统计
export function getWorkOrderStatistics(params) {
  return request({
    url: '/stats/powerring/workOrderStatistics',
    method: 'post',
    data: params
  })
}

/**
 * 大屏界面安防系统
 */

//月度人流量统计
export function getMonthlyTrafficStatistics(params) {
  return request({
    url: '/stats/securitysystem/monthlyTrafficStatistics',
    method: 'post',
    data: params
  })
}

//设备运行状态
export function getDeviceOperationStatus(params) {
  return request({
    url: '/stats/securitysystem/deviceOperationStatus',
    method: 'post',
    data: params
  })
}

//安防设备类型统计
export function getSecurityDeviceTypeStatistics(params) {
  return request({
    url: '/stats/securitysystem/securityDeviceTypeStatistics',
    method: 'post',
    data: params
  })
}

//安防标识信息
export function getSecuritySignInformation(params) {
  return request({
    url: '/stats/securitysystem/securitySignInformation',
    method: 'post',
    data: params
  })
}

//安防告警处理统计
export function getSecurityAlarmProcessingStatistics(params) {
  return request({
    url: '/stats/securitysystem/alarmProcessingStatistics',
    method: 'post',
    data: params
  })
}

//安防告警数量趋势统计
export function getSecurityQuantityTrendStatistics(params) {
  return request({
    url: '/stats/securitysystem/securityQuantityTrendStatistics',
    method: 'post',
    data: params
  })
}

//安防处理情况统计
export function getStatisticsOfAlarmProcessing(params) {
  return request({
    url: '/stats/securitysystem/statisticsOfAlarmProcessing',
    method: 'post',
    data: params
  })
}

/**
 * 大屏界面停车系统
 */

//停车场分区统计
export function getParkingLotZoningStatistics(params) {
  return request({
    url: '/stats/parkingsystem/parkingLotZoningStatistics',
    method: 'post',
    data: params
  })
}

//停车位统计
export function getParkingSpaceAnalysis(params) {
  return request({
    url: '/stats/parkingsystem/parkingSpaceAnalysis',
    method: 'post',
    data: params
  })
}


//车辆收费统计
export function getVehicleChargeStatistics(params) {
  return request({
    url: '/stats/parkingsystem/vehicleChargeStatistics',
    method: 'post',
    data: params
  })
}

//实时进场统计
export function getRealTimeApproachInformation(params) {
  return request({
    url: '/stats/parkingsystem/realTimeApproachInformation',
    method: 'post',
    data: params
  })
}

//车辆平均停留时长
export function getAverageVehicleDwellTime(params) {
  return request({
    url: '/stats/parkingsystem/averageVehicleDwellTime',
    method: 'post',
    data: params
  })
}


//车辆类别统计
export function getVehicleCategoryStatistics(params) {
  return request({
    url: '/stats/parkingsystem/vehicleCategoryStatistics',
    method: 'post',
    data: params
  })
}

//停车系统标识信息
export function getParkingSystemSignInformation(params) {
  return request({
    url: '/stats/parkingsystem/parkingSystemSignInformation',
    method: 'post',
    data: params
  })
}

//停车量趋势
export function getParkingTrend(params) {
  return request({
    url: '/stats/parkingsystem/parkingTrend',
    method: 'post',
    data: params
  })
}

/**
 * 大屏界面照明系统
 */

//照明状态运行分析
export function getLightingOperStateAnalysis(params) {
  return request({
    url: '/stats/lightingsystem/lightingOperStateAnalysis',
    method: 'post',
    data: params
  })
}

//园区环境监控
export function getParkEnviroMonitorInfo(params) {
  return request({
    url: '/stats/lightingsystem/parkEnviroMonitorInfo',
    method: 'post',
    data: params
  })
}

//照明设备分类统计
export function getLightingClassifiInfo(params) {
  return request({
    url: '/stats/lightingsystem/lightingClassifiInfo',
    method: 'post',
    data: params
  })
}

//照明系统标识信息
export function getLightingSystemSignInfo(params) {
  return request({
    url: '/stats/lightingsystem/lightingSystemSignInfo',
    method: 'post',
    data: params
  })
}

//今日告警处理数
export function getLightingAlarmsProcessedNumber(params) {
  return request({
    url: '/stats/lightingsystem/lightingAlarmsProcessedNumber',
    method: 'post',
    data: params
  })
}

//照明设备告警趋势
export function getLightingAlarmTrend(params) {
  return request({
    url: '/stats/lightingsystem/lightingAlarmTrend',
    method: 'post',
    data: params
  })
}

//照明设备告警状态统计
export function getLightingDeviceAlarmStatus(params) {
  return request({
    url: '/stats/lightingsystem/lightingDeviceAlarmStatus',
    method: 'post',
    data: params
  })
}

//耗电量趋势
export function getLightingPowerConsumTrend(params) {
  return request({
    url: '/stats/lightingsystem/lightingPowerConsumTrend',
    method: 'post',
    data: params
  })
}

/**
 * 大屏界面能耗系统
 */

// 获取能耗方案列表
export function getEnergyPlanList(siteId) {
  return request({
    url: '/site-sdc/sdcpueconfig/getConfig/',
    method: 'get',
    params: {
      siteId
    }
  })
}

// 方案能耗
export function getPueAndConsume(planId) {
  return request({
    url: '/stats/sdcdevicepowerlog/getPueAndConsume/',
    method: 'get',
    params: {
      planId
    }
  })
}

// 方案PUE趋势
export function getPueTrend(params) {
  return request({
    url: '/stats/sdcdevicepowerlog/getPueTrend',
    method: 'get',
    params
  })
}

// 能耗趋势曲线
export function getPowerTrend(params) {
  return request({
    url: '/stats/sdcdevicepowerlog/powerTrend',
    method: 'get',
    params
  })
}

// 耗电量月对比
export function getConsumeInMonth(params) {
  return request({
    url: '/stats/sdcdevicepowerlog/getConsumeInMonth/',
    method: 'get',
    params
  })
}

// 方案PUE排行
export function getPlanPueRank(params) {
  return request({
    url: '/stats/sdcdevicepowerlog/getPueRank/',
    method: 'get',
    params
  })
}
// 方案能耗排行
export function getPlanEncRank(params) {
  return request({
    url: '/stats/sdcdevicepowerlog/getPowerRank',
    method: 'get',
    params
  })
}

//设备运行状况
export function getEnergyDeviceState(params) {
  return request({
    url: '/stats/energyConsume/deviceState',
    method: 'post',
    data: params
  })
}

//能耗分析
export function getEnergyConsumeAnalysis(params) {
  return request({
    url: '/stats/energyConsume/energyConsumeAnalysis',
    method: 'post',
    data: params
  })
}

//年月日总能耗分析
export function getStageTotalEnergyConsume(params) {
  return request({
    url: '/stats/energyConsume/stageTotalEnergyConsume',
    method: 'post',
    data: params
  })
}

//能耗使用情况分析
export function getEnergyConsumeUse(params) {
  return request({
    url: '/stats/energyConsume/energyConsumeUse',
    method: 'post',
    data: params
  })
}

//机房PUE值排行
export function getEnergyPueValueRank(params) {
  return request({
    url: '/stats/energyConsume/pueValueRank',
    method: 'post',
    data: params
  })
}

//PUE趋势
export function getEnergyPueTrend(params) {
  return request({
    url: '/stats/energyConsume/pueTrend',
    method: 'post',
    data: params
  })
}

//季度平均PUE统计
export function getEnergyQuarterlyAverPue(params) {
  return request({
    url: '/stats/energyConsume/quarterlyAverPue',
    method: 'post',
    data: params
  })
}

//能耗系统标志信息
export function getEnergySignInfo(params) {
  return request({
    url: '/stats/energyConsume/energySignInfo',
    method: 'post',
    data: params
  })
}