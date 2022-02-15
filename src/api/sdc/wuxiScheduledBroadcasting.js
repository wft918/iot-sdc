import request from '@/router/axios'
import qs from 'qs'
const https = 'http://192.168.28.14:8861/light'
const local = 'http://192.168.5.112:8900'
// 查询所有任务计划数据/分页
export function BroadfetchList(data) {
  return request({
    url: https + '/broadcast/showAudioTask',
    method: 'get',
    params: data
  })
}

// 启动计划任务
export function runTaskApi(runData) {
  const data = qs.stringify(runData)
  return request({
    url: https + '/broadcast/runAudioTask',
    method: 'post',
    data
  })
}

// 停止计划任务
export function closeTaskApi(closeData) {
  const data = qs.stringify(closeData)
  return request({
    url: https + '/broadcast/stopAudioTask2',
    method: 'post',
    data
  })
}

// 查询所有广播媒体资源数据/分页
export function fetchAudioList(data) {
  return request({
    url: https + '/broadcast/queryAudioResources2',
    method: 'get',
    params: data
  })
}

// 查询所有广播终端数据/分页
export function fetchDeviceList(data) {
  return request({
    url: https + '/broadcast/getAudioDevice',
    method: 'get',
    params: data
  })
}

// 添加任务计划
export function addSubmitApi(addData) {
  const data = qs.stringify(addData)
  return request({
    url: https + '/broadcast/addAudioTask2',
    method: 'post',
    data
  })
}

// 更新任务计划
export function editSubmitApi(editData) {
  const data = qs.stringify(editData)
  return request({
    url: https + '/broadcast/modifyAudioTask',
    method: 'post',
    data
  })
}

// 删除任务计划
export function delSubmitApi(delData) {
  const data = qs.stringify(delData)
  return request({
    url: https + '/broadcast/delAudioTask',
    method: 'post',
    data
  })
}
