<template>
  <div>
    <div id="canvas">
      <img :src="img" style="width: 1060px; height: 560px" />
      <template v-for="(item,index) in deviceData.devListInfo" >
        <deviceImg :key="index" :top="item.y" :left="item.x" :width="80" :height="80" :id="index" :imgurl="item.devImg"></deviceImg>
      </template>
    </div>
    <div ref="devCanvas">
      <canvas ref="map" width="100%" height="auto"></canvas>
    </div>
  </div>
  
</template>

<script>
import deviceImg from "./deviceImg";
let canvas,
  ctx,
  canvas2,
  ctx2,
  image = new Image();
import imageUrl from "@/assets/img/room02.png";
import airimgUrl01 from "@/assets/img/air01.png";
import airimgUrl02 from "@/assets/img/air02.png";
import airimgUrl03 from "@/assets/img/air03.png";
import airimgUrl04 from "@/assets/img/air04.png";

//创建canvas拖动使用变量
let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let lengthX = 0;
let lengthY = 0;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

let imgX = 50;
let imgY = 50;
let pos = {},
  posl = {},
  dragging = false;

export default {
  name: "DrawCanvas",
  props: ["deviceData"],
  components: {
    deviceImg
  },
  data() {
    return {
      airImg: new Image(),
      img: imageUrl,
    };
  },
  mounted() {
    // this.initCanvas();
    // this.loadImage();
  },
  methods: {
    //初始化Canvas
    initCanvas() {
      //canvas定义
      canvas = this.$refs.map;
      //ctx定义
      ctx = canvas.getContext("2d");
      //canvas绘图窗口大小
      canvas.width = 900;
      canvas.height = 700;
    },
    windowToCanvas(x, y) {
      let box = canvas.getBoundingClientRect(); //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
      return {
        x: x - box.left - (box.width - canvas.width) / 2,
        y: y - box.top - (box.height - canvas.height) / 2,
      };
    },
    //加载图片
    loadImage() {
      //加载楼层地图
      image.src = imageUrl;
      image.onload = (res) => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.draw();
      };
      image.onerror = (data) => {
        image.src = imageUrl;
        image.onload = (res) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height); //清除之前的绘画
          ctx.save();
          ctx.drawImage(image, image.width, image.height); // 0, 0参数画布上的坐标点，图片将会拷贝到这个地方
        };
      };
    },
    draw() {
      this.deviceData.devListInfo.forEach((el) => {
        let airImg = new Image();
        airImg.src = airimgUrl01;
        airImg.onload = () => {
          ctx.drawImage(airImg, el.x, el.y);
          this.addEvent(airImg);
        };
      });
    },
    addEvent(airImg) {
      canvas.onmousedown = (e) => {
        let item = this.getPonit(e, airImg)
        lengthX = 0;
        lengthY = 0;
        x1 = e.clientX;
        y1 = e.clientY;
        canvas.onmousemove = (e) => {
          ctx.clearRect(item.x, item.y, airImg.width, airImg.height) //清除之前的绘画
          x2 = e.clientX;
          y2 = e.clientY;
          lengthX = x2 - x1; //计算canvas拖动x
          lengthY = y2 - y1; //计算canvas拖动y
          ctx.save()
          ctx.drawImage(airImg,item.x+lengthX, item.y+lengthY,airImg.width, airImg.height)// 0, 0参数画布上的坐标点，图片将会拷贝到这个地方
          // this.getPonit(e, airImg);
          // ctx.drawImage(airImg,imgX+lengthX,imgY+lengthY)
        };
      };
      canvas.onmouseup = (e) => {
        ctx.clearRect(item.x, item.y, airImg.width, airImg.height); //清除之前的绘画
        ctx.save();
        ctx.drawImage(airImg, item.x+lengthX, item.y+lengthY, airImg.width, airImg.height); // 0, 0参数画布上的坐标点，图片将会拷贝到这个地方
        //重置canvas鼠标事件
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        this.getPonit(e, airImg);
        this.draw();
        ctx.restore();
      };
    },
    getPonit(e, airImg) {
      let p = this.getEventPosition(e);
      if (
        this.deviceData.devListInfo !== null &&
        this.deviceData.devListInfo !== undefined
      ) {
        if (this.deviceData.devListInfo.length !== 0) {
          for (let i = 0; i < this.deviceData.devListInfo.length; i++) {
            const el = this.deviceData.devListInfo[i];
            //计算点击位置是否在设备图标范围内部
            if (
              0 <= p.x - el.x &&
              p.x - el.x <= airImg.width &&
              0 <= p.y - el.y &&
              p.y - el.y <= airImg.height
            ) {
              return el
            }
          }
        }
      }
    },
    createMap() {
      //监听canvas点击事件，显示设备信息
      // canvas.addEventListener("click", (e) => {
      //   //获取鼠标点击位置的X、Y
      //   let p = this.getEventPosition(e);
      //   if(this.deviceData.devListInfo !== null && this.deviceData.devListInfo !== undefined) {
      //     if (this.deviceData.devListInfo.length !== 0) {
      //       this.deviceData.devListInfo.forEach((el) => {
      //         //计算点击位置是否在设备图标范围内部
      //         if (
      //           -40  <=
      //             (el.x)  - p.x &&
      //           (el.x)  - p.x <= 0 &&
      //           -70  <=
      //             (el.y)  - p.y &&
      //           (el.y)  - p.y <= 0
      //         ) {
      //           //判断此次点击为显示/隐藏设备信息
      //           if (el.flag === undefined || el.flag === 0) {
      //             ctx.save();
      //             ctx.translate(el.x-5, el.y-29);
      //             ctx.beginPath(0);
      //             //从右下角顺时针绘制，弧度从0到1/2PI
      //             ctx.arc(100, 30 , 10, 0, Math.PI / 2);
      //             //矩形下边线
      //             ctx.lineTo(10, 40);
      //             //左下角圆弧，弧度从1/2PI到PI
      //             ctx.arc(10, 30 , 10, Math.PI / 2, Math.PI);
      //             //矩形左边线
      //             ctx.lineTo(0, 10);
      //             //左上角圆弧，弧度从PI到3/2PI
      //             ctx.arc(10, 10, 10, Math.PI, Math.PI * 3 / 2);
      //             //上边线
      //             ctx.lineTo(100 , 0);
      //             //右上角圆弧
      //             ctx.arc(100, 10, 10, Math.PI * 3 / 2, Math.PI * 2);
      //             //右边线
      //             ctx.lineTo(110, 30);
      //             ctx.closePath();
      //             // ctx.lineWidth =  2; //若是给定了值就用给定的值否则给予默认值2
      //             // ctx.strokeStyle = "#409EFF";
      //             // ctx.stroke();
      //             ctx.fillStyle =  "#409EFF"; //若是给定了值就用给定的值否则给予默认值
      //             ctx.fill();
      //             ctx.restore();
      //             ctx.save()
      //             ctx.fillStyle =  "#ffffff";
      //             ctx.font = "24px MicrosoftYaHei";
      //             ctx.fillText(
      //               el.devName,
      //               (el.x) ,
      //               (el.y)
      //             );
      //             ctx.restore();
      //             el.flag = 1; //更改设备显示/隐藏标志
      //           } else if (el.flag === 1) {
      //             el.flag = 0; //更改设备显示/隐藏标志
      //             ctx.clearRect(0, 0, canvas.width, canvas.height); //清除之前的绘画
      //       ctx.translate(endX, endY)
      //         ctx.save();
      //         ctx.drawImage(image, endX, endY, canvas.width, canvas.height); // 0, 0参数画布上的坐标点，图片将会拷贝到这个地方
      //         // ctx.drawImage(image, endX, endY,   image.width, image.height); // 0, 0参数画布上的坐标点，图片将会拷贝到这个地方
      //         ctx.restore();
      //             // this.drawRoomImg();
      //           }
      //         }
      //       });
      //     }
      //   }
      // });
    },
    //获取点击位置信息
    getEventPosition(ev) {
      let clickx, clicky;
      if (ev.layerX || ev.layerX == 0) {
        clickx = ev.layerX;
        clicky = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) {
        // Opera
        clickx = ev.offsetX;
        clicky = ev.offsetY;
      }
      console.log({ x: clickx, y: clicky });
      return { x: clickx, y: clicky };
    },
  },
};
</script>

<style>
</style>