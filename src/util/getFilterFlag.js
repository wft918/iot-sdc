export function getFilterFlag(value, data, node) {
  if (!value) {
    return true
  } else {
    let flagArr = [],
        result = false
    getfilterNode(node, flagArr, value)
    flagArr.forEach(item => {
      result = item || result
    }) 
    return result
  }
}
// 获取符合过滤条件的选项（包括其子节点）
function getfilterNode(node, arr, value) {
  let flag = node.data && node.data.name && node.data.name.indexOf(value) !== -1
  flag ? arr.push(flag) : ''
  if (!flag && node.level !== 1 && node.parent) {
    getfilterNode(node.parent, arr, value)
  }
}
