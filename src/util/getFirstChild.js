export function getFirstChild(data, firstChild, type) {
  if (firstChild.length !== 0) {
    return
  } else {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === type) {
        firstChild.push(data[i])
      } else if (!data[i].children) {
        break
      } else {
        getFirstChild(data[i].children, firstChild, type)
      }
    }
  }
}