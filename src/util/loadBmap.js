// // 加载百度地图资源
// export default function loadBMap(ak) {
//     return new Promise(function(resolve, reject) {
//       if (typeof T !== 'undefined') {
//         resolve(T)
//         return true
//       }
//       window.onBMapCallback = function() {
//         resolve(T)
//       }
//       let script = document.createElement('script')
//       script.type = 'text/javascript'
//       script.src =
//         'http://api.tianditu.gov.cn/api?v=4.0&tk=' + ak + '&callback=onBMapCallback'
//       script.onerror = reject
//       document.body.appendChild(script)
//     })
//   }
  