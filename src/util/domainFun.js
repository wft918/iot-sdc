export const clone = (obj) => {
  let newObj = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      if(key !== 'lightDev') {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj
}