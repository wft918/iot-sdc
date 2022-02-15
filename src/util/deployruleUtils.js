// 格式化布防时间
export function formatTime(seconds) {
  let h = parseInt(seconds / 3600),
      m = parseInt((seconds % 3600) / 60);
  if (h < 10) {
    h = '0' + h
  }
  if (m < 10) {
    m = '0' + m
  }
  return h + ':' + m
}