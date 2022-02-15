import request from '@/router/axios'

//布防规则
export function getSdcDeployRuleTable(params) {
  return request({
    url: '/facedetect-sdc/sdcfdarmingrule/page',
    method: 'get',
    params
  })
}

export function addSdcDeployRule( obj ) {
  return request({
    url: '/facedetect-sdc/sdcfdarmingrule',
    method: 'post',
    data: obj
  })
}


export function sdcDeployRuleAction(params,urlParams,action) {
  return request({
    url: '/facedetect-sdc/sdcfdarmingrule' + urlParams,
    method: action,
    data: params
  })
}

//关联目标
export function getSdcDeployRuleTargetRelaTable(params) {
  return request({
    url: '/facedetect-sdc/sdcfdarmingruletargetrela/page',
    method: 'get',
    params
  })
}

export function addSdcDeployRuleTargetRela( obj ) {
  return request({
    url: '/facedetect-sdc/sdcfdarmingruletargetrela',
    method: 'post',
    data: obj
  })
}

export function sdcDeployRuleTargetRelaAction(params,urlParams,action) {
  return request({
    url: '/facedetect-sdc/sdcfdarmingruletargetrela' + urlParams,
    method: action,
    data: params
  })
}

//人脸库
export function getSdcFDTable(params) {
  return request({
    url: '/facedetect-sdc/sdcfdlocallib/page',
    method: 'get',
    params
  })
}


//查询结果
export function getSdcPRTable(params) {
  return request({
    url: '/facedetect-sdc/sdcfdcomparisonresult/page',
    method: 'get',
    params
  })
}