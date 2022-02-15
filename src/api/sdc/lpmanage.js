import request from '@/router/axios'

export function getSdcLightTaskTable(params) {
  return request({
    url: '/light-sdc/sdclighttask/page',
    method: 'get',
    params
  })
}

export function sdcLightTaskAction(params,action) {
  return request({
    url: '/light-sdc/sdclighttask',
    method: action,
    data: params
  })
}

export function deleteSdcLightTask(params) {
  return request({
    url: '/light-sdc/sdclighttask/' + params,
    method: 'delete',
  })
}

export function sdcLightTaskTargetAction(params,action) {
  return request({
    url: '/light-sdc/sdclighttasktarget',
    method: action,
    data: params
  })
}

export function getSdcLightFileTable(params) {
  return request({
    url: '/light-sdc/sdclightfile/page',
    method: 'get',
    params
  })
}

export function sdcLightFileAction(params,action) {
  return request({
    url: '/light-sdc/sdclightfile',
    method: action,
    data: params
  })
}

export function getSdcLightProgrameTable(params) {
  return request({
    url: '/light-sdc/sdclightprograme/page',
    method: 'get',
    params
  })
}

export function sdcLightProgrameAction(params,action) {
  return request({
    url: '/light-sdc/sdclightprograme',
    method: action,
    data: params
  })
}

export function sdcLightProgrameLEDAction(params,action) {
  return request({
    url: '/light-sdc/sdclightprogrameled',
    method: action,
    data: params
  })
}

export function getSdcLightLampTotalLog(params) {
  return request({
    url: '/light-sdc/sdclightlamplog/getTotalPower',
    method: 'get',
    params
  })
}

export function getSdcLightLampLog(params) {
  return request({
    url: '/light-sdc/sdclightlamplog/getLampPower',
    method: 'get',
    params
  })
}

export function getSdcLightLampOneLog(params) {
  return request({
    url: '/light-sdc/sdclightlamplog/getOneLampPower',
    method: 'get',
    params
  })
}
