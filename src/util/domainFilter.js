// import moment from "moment";

//设备新建Title参照表
export const addressTypeMap = [
  {
    value: 'P00',
    label: '园区'
  },
  {
    value: 'B00',
    label: '楼宇'
  },
  {
    value: 'F00',
    label: '楼层'
  },
  {
    value: 'R00',
    label: '房间'
  },
]

export const addressTypeObj = [
  {
    'P00': '园区',
    'B00': '楼宇',
    'F00': '楼层',
    'R00': '房间'
  },
]
// 设备新建Title过滤器
export const addressTypeMapFilter = (addressType) => {
  return addressTypeObj[addressType]
}

//设备新建Title参照表
export const addressTitleTypeMap = {
  '1': {
    "P00": "新建园区",
    'B00': "新建楼宇",
    'F00': "新建楼层",
    'R00': "新建房间",
  },
  '2': {
    'P00': "编辑园区",
    'B00': "编辑楼宇",
    'F00': "编辑楼层",
    'R00': "编辑房间",
  },
  '3': {
    'P00': "查看园区",
    'B00': "查看楼宇",
    'F00': "查看楼层",
    'R00': "查看房间",
  },

}

//设备新建Title过滤器
export const addressTitleTypeMapFilter = (actionType, addressTitleType) => {
  
  return addressTitleTypeMap[actionType][addressTitleType]
}

//设备新建Title参照表
export const brandTypeMap = [
  {
    value: '1',
    label: '品牌'
  },
  {
    value: '2',
    label: '型号'
  }
]
//设备新建Title过滤器
// export const addressTypeMapFilter = (addressType) => {
//   return addressTypeMap[addressType]
// }

//设备新建Title参照表
export const brandTitleTypeMap = {
  '1': {
    1: "新建品牌",
    2: "新建型号"
  },
  '2': {
    1: "编辑品牌",
    2: "编辑型号"
  },
  '3': {
    1: "查看品牌",
    2: "查看型号"
  },

}

//设备新建Title过滤器
export const brandTitleTypeMapFilter = (actionType, brandTitleType) => {
  return brandTitleTypeMap[actionType][brandTitleType]
}

//设备新建Title参照表
export const deviceTypeMap = [
  {
    value: 1,
    label: '品牌'
  },
  {
    value: 2,
    label: '型号'
  }
]

//设备新建Title参照表
export const deviceTypeTitleTypeMap = {
  '1': {
    1: "新建设备",
    2: "新建设备"
  },
  '2': {
    1: "编辑设备",
    2: "编辑设备",
  },
  '3': {
    1: "查看设备",
    2: "查看设备",
  },

}

//设备新建Title过滤器
export const deviceTitleTypeMapFilter = (actionType, deviceTypeTitleType) => {
  return deviceTypeTitleTypeMap[actionType][deviceTypeTitleType]
}

export const nodeTypeMap = [
  {
    value: '0',
    label: 'M-GSM900M'
  },
  {
    value: '1',
    label: 'D-DCS1800M'
  },
  {
    value: '2',
    label: 'T-DSCDMA'
  },
  {
    value: '3',
    label: 'LTE'
  }
]


export const siteTypeMap = [
  {
    value: '1',
    label: '数据中心'
  },
  {
    value: '2',
    label: '通信机楼'
  },
  {
    value: '3',
    label: '传输节点'
  },
  {
    value: '4',
    label: '通信基站'
  },
]

//递归遍历数据,去掉空children
export function modifyData (data) {
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if(element.children.length === 0) {
      element.children = undefined
    } else {
      modifyData(element.children)
    }
  }
  return data
}

//去掉已有数据
export function clearData (data,params) {
  if(params && params.length !== 0) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      for (let j = 0; j < params.length; j++) {
        const el = params[j];
        if(element.id === el) {
          data.splice(index,1)
          clearData (data,params)
        }
      }
    }
  }
  return data
}

export function modifySite (data) {
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    element.children = undefined
  }
  return data
}


export const dataTypeMap = [
  {
    value: 'int',
    label: '整型'
  },
  {
    value: 'string',
    label: '字符串类型'
  },
  {
    value: 'double',
    label: '双精度浮点型'
  }
]

export const nvrTypeMap = [
  {
    value: '0',
    label: '网络视频录像机'
  },
  {
    value: '1',
    label: '摄像头'
  }
]

export const levelFilter = (level) => {
  const levelMap = {
    '1': '一般',
    '2': '严重'
  }
  return levelMap[level]
}

export const handleStatusFilter = (status) => {
  const statusMap = {
    '1': '未派单',
    '2': '已派人工单',
    '3': '已处理完成'
  }
  return statusMap[status]
}


//人脸库类型过滤器
export const faceTypeFilter = (unit) => {
  const faceTypeMap = {
      1: '白名单',
      2: '黑名单',
      3: '红名单',
      4: '灰名单',
      5: '陌生人',
  }
  return faceTypeMap[unit]
}

//系统类型过滤器
export const sysTypeFilter = (unit) => {
  const sysTypeMap = {
      1: '动力系统',
      2: '环境系统',
      3: '暖通系统',
      4: '安防系统',
      5: '消防系统',
      6: '停车系统',
      7: '视频监控',
      8: '灯杆系统',
  }
  return sysTypeMap[unit]
}
