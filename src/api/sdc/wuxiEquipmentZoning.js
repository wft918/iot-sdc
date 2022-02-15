import request from '@/router/axios'
import qs from 'qs'
const https = 'http://192.168.28.14:8861/light'
const local = 'http://192.168.5.112:8900'
// 查询所有设备分区/分页
export function fetchList(data) {
  return request({
    url: https + '/broadcast/getDeviceGroup',
    method: 'get',
    params: data
  })
}

// 返回分区编号
export function fetchGroupId() {
  return request({
    url: https + '/broadcast/getDeviceGroupId',
    method: 'post'
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

// 添加广播终端分区
export function addSubmitApi(addData) {
  const data = qs.stringify(addData)
  return request({
    url: https + '/broadcast/controlDeviceGroup',
    method: 'post',
    data
  })
}

// 更新广播终端分区
export function editSubmitApi(editData) {
  const data = qs.stringify(editData)
  return request({
    url: https + '/broadcast/modifyDeviceGroup',
    method: 'post',
    data
  })
}

// 删除广播分区
export function delSubmitApi(delData) {
  const data = qs.stringify(delData)
  return request({
    url: https + '/broadcast/controlDelGroup',
    method: 'post',
    data
  })
}
