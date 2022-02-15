import request from '@/router/axios'
import qs from 'qs'
const https = 'http://192.168.28.14:8861/light'
const local = 'http://192.168.5.112:8900'

// 查询所有广播媒体资源数据/分页
export function fetchList(data) {
  return request({
    url: https + '/broadcast/queryAudioResources2',
    method: 'get',
    params: data
  })
}

// 删除广播资源
export function delSubmitApi(delData) {
  const data = qs.stringify(delData)
  return request({
    url: https + '/broadcast/deleteFtpResourcesById',
    method: 'post',
    data
  })
}
