import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/tenant/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/tenant',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/tenant/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/tenant/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/tenant',
    method: 'put',
    data: obj
  })
}

//增加权限
// export function permissionUpd(roleId, menuIds) {
//   return request({
//     url: '/admin/menu/savetenantmenus',
//     method: 'post',
//     data: {
//       tenantId: roleId,
//       menuIds: menuIds
//     }
//   })
// }
export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/admin/menu/savetenantmenus?tenantId='+roleId,
    method: 'post',
    data: menuIds
  })
}

//权限回显
export function getPermissionShow(roleId, tenantId) {
  return request({
    url: '/admin/menu/treebyTenantId?roleId='+ roleId + '&tenantId='+ tenantId,
    method: 'get',
  })
}