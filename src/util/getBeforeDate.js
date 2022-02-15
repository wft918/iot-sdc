export function getBeforeDate(num) {
  const nowDate = new Date();
  let year = nowDate.getFullYear();
  let mon = nowDate.getMonth() + 1;
  let day = nowDate.getDate();
  if (day <= num) {
      if (mon > 1) {
          mon = mon - 1;
      } else {
          year = year - 1;
          mon = 12;
      }
  }
  nowDate.setDate(nowDate.getDate() - num);
  year = nowDate.getFullYear();
  mon = nowDate.getMonth() + 1;
  day = nowDate.getDate();
  const beforedate = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day);
  return beforedate;
}