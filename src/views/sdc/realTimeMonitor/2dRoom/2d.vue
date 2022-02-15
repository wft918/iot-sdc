<template>
  <div>
    <el-button class="room-btn" type="primary" @click="backToUp">
      <i class="fa fa-mail-reply"></i>返回
    </el-button>
    <div id="svgTemplate" ref="svg"></div>
    <div class="list">
      <p></p>
      input框<el-input v-model="name"></el-input>
      <el-button @click="change()" type="primary"
        >我的按钮点击修改内容</el-button
      >
    </div>
  </div>
</template>
<script>
import Vue from "vue/dist/vue.esm.js";

// window.handleClick = () => {
// 原本的 handleClick 事件是 window 的
// };

export default {
  name: "svg-drawing",
  props: ["systemFlag", "siteId", "siteImg", "siteName", "addressId", "typeId"],
  data () {
    return {
      name: '',
      /* 全局 */
      svgUrl: "", // svg的url
      svgDom: null, // 获取到的svg元素
      /* svg的变量 */
      photoResult: {
        resultVal: 0, // 测试结果 - 值
        resultMsg: "未检测", // 测试结果 - 字段
        resultColor: "#dcdee2" // 测试结果 - 字段背景色
      }
    };
  },
  async mounted () {
    // 将takePhoto方法绑定到window下面，提供给外部调用
    window["handleClick"] = () => {
      this.takePhoto();
    };
  },
  created () {
    this.getSvg();
  },
  methods: {
    // 初始化svg
    getSvg () {
      /* 创建xhr对象 */
      const xhr = new XMLHttpRequest();
      this.svgUrl = this.baseUrl + "svg/" + "test.svg";
      xhr.open("GET", this.svgUrl, true);
      xhr.send();

      /* 监听xhr对象 */
      xhr.addEventListener("load", () => {
        /* 1. 获取 dom */
        const resXML = xhr.responseXML;
        // const resXML = stringToXml(xhr.response)
        console.log(resXML, 'resXML')
        this.svgDom = resXML.documentElement.cloneNode(true);

        /* 2.SVG对象添加click事件 */
        let btnTakePhotoDom = this.svgDom.getElementById("63");
        this.svgDom.style.width = '100%';
        this.svgDom.style.height = '700px';
        console.log('up2', btnTakePhotoDom.childNodes[0])

        btnTakePhotoDom.childNodes[0].attributes.fill.value = '#ccc';
        btnTakePhotoDom.childNodes[0].innerHTML = '添加值';




        var para = document.createElement("p");//创建需要增加的元素节点
        var node = document.createTextNode("这是新段落。");//创建文本节点
        para.appendChild(node);//将文本节点增加至创建的元素中




        btnTakePhotoDom.setAttribute("v-on:click", "this.handleClick()");

        /* 3. 修改 dom */
        this.svgDom.getElementById("63").childNodes[0].nodeValue = '111';
        // console.log('63111', btnTakePhotoDom.childNodes[0].nodeValue)

        // this.svgDom.getElementById("63").setAttribute("style",
        //   `....; fill:${this.photoResult.resultColor}; ...`);
        // this.svgDom.getElementById("63").style.backgroundColor = 'green'
        /* 4.将svgDom对象转换成vue的虚拟dom */
        var oSerializer = new XMLSerializer();
        var sXML = oSerializer.serializeToString(this.svgDom);
        var Profile = Vue.extend({
          template: "<div id='svgTemplate'>" + sXML + "</div>"
        });
        // 创建实例，并挂载到元素上
        new Profile().$mount("#svgTemplate");
      });
    },
    // 事件
    takePhoto () {
      this.name = 'kepan'
    },
    change () {
      // var a = new Array("日", "一", "二", "三", "四", "五", "六");
      // var mydate = new Date();
      // var week = mydate.getDay();
      // var year = mydate.getFullYear();
      // var month = mydate.getUTCMonth() + 1;
      // var day = mydate.getUTCDate();
      // var hour = mydate.getHours();
      // var minutes = mydate.getMinutes();
      // var section = (hour > 12) ? "下午" : "上午";
      // var shift = "晚班";
      // if ((hour == 8 && minutes >= 30) || (hour == 20 && minutes <= 30) || (hour <= 19 && hour >= 9)) {
      //   shift = "白班";
      // }
      // var ctime = year + "-" + month + "-" + day + " 星期" + a[week] + " " + section + " " + shift;
      const dom = document.getElementById('99').childNodes[1].childNodes[0].getElementsByTagName('font')[0]
      console.log('dom', dom)
      dom.innerHTML = '<div style="color:red">这是新的内容，样式为红色</div>';
    },
    backToUp() {
      this.$emit("changeComponent", {
        currentComponent: "RoomOverview",
        roomInfo: {},
        addressId: this.addressId,
        typeId: this.typeId,
      });
    }
  },
  
  beforeDestroy () {
    this.svgDom = null;
  },
  watch: {
    photoResult: {
      handler (newVal, oldVal) {
        this.getSvg();
      },
      deep: true
    }
  }
};
</script>

