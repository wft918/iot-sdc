import request from '@/router/axios'
const https = 'http://192.168.28.14:8861/light'
const local = 'http://192.168.5.112:8900'
// 查询所有广播终端数据/分页
export function fetchList(data) {
  return request({
    url: https + '/broadcast/getAudioDevice',
    method: 'get',
    params: data
  })
}

// 查询所有灯杆编号
export function lampPoleNumber() {
  return request({
    url: https + '/lamp/readLampPole',
    method: 'post'
  })
}

// 添加广播终端
export function addSubmitApi(data) {
  return request({
    url: https + '/broadcast/newAudioDevice',
    method: 'post',
    params: data
  })
}

// 更新广播终端
export function editSubmitApi(data) {
  return request({
    url: https + '/broadcast/setAudioDevice',
    method: 'post',
    params: data
  })
}

// 删除广播终端
export function delSubmitApi(delData) {
  return request({
    url: https + '/broadcast/delAudioDevice',
    method: 'post',
    params: delData
  })
}
