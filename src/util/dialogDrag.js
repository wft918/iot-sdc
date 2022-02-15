const directive = Vue => {
  Vue.directive('dialogDrag', {
      inserted: (el) => {
        const headerElement = el.querySelector('.el-dialog__header')
        const dragDialog = el.querySelector('.el-dialog')
        headerElement.style.cursor = 'move'
        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDialog.currentStyle || window.getComputedStyle(dragDialog, null)
        headerElement.onmousedown = (e) => {
            const disX = e.clientX - headerElement.offsetLeft
            const disY = e.clientY - headerElement.offsetTop
            // 获取到的值带px 正则匹配替换
            let styL, styT
            // ie中第一次获取到的值为组件自带50% 移动之后赋值为px
            if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
            } else {
                styL = +sty.left.replace(/\px/g, '')
                styT = +sty.top.replace(/\px/g, '')
            }
            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                const moveLeft = e.clientX - disX
                const moveTop = e.clientY - disY
                // 移动当前元素
                dragDialog.style.left = `${moveLeft + styL}px`
                dragDialog.style.top = `${moveTop + styT}px`
            }
            document.onmouseup = function (e) {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
      }
  });
};
export default directive;