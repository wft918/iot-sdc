<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="6">
          <!-- <el-upload
            class="upload-demo"
            action="/site-sdc/sdc-file/upload"
            :headers="headers"
            :show-file-list="false"
            multiple
          >
            <el-button size="small" type="primary">上传</el-button>
          </el-upload> -->
          <el-row :gutter="15">
            <el-col :span="24">
              <el-divider content-position="left">
                <span style="font-size: 20px">设备类</span>
              </el-divider>
            </el-col>
            <el-col :span="6" v-for="(item, index) in devEditInfo" :key="index">
              <div style="height: 82px; text-align: center">
                <div>
                  <img
                    :src="item.url"
                    :id="index"
                    alt=""
                    :draggable="true"
                    @dragstart="dragStart($event)"
                    @dragend="dragEnd($event,item)"
                    @mousedown="onMouseDown($event)"
                  />
                </div>
                <div>{{ item.name }}</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="18">
          <el-row :gutter="15">
            <!-- <el-col :span="10">
              <span>区域：</span>
              <el-cascader
                ref="siteChoose"
                :options="condition"
                style="width: 80%"
                v-model="address"
                clearable
                filterable
                @change="changeAddress"
                :props="{
                  checkStrictly: true,
                  value: 'id',
                  label: 'name',
                  children: 'children',
                }"
              >
              </el-cascader>
            </el-col> -->
            <el-col :span="20" v-if="action === 1">
              
            </el-col>
            <el-col :span="2">
              <!-- <el-upload
                class="upload-demo"
                action="/site-sdc/sdc-file/upload"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleDeviceAvatarSuccess"
                :disabled="isdisabled"
              >
                <el-button size="small" type="primary" :disabled="isdisabled"
                  >上传</el-button
                >
              </el-upload> -->
            </el-col>
            <el-col :span="2">
              <!-- <el-button size="small" type="primary" @click="saveInfo"
                >保存</el-button
              > -->
              <el-button size="small" type="primary" @click="changeComponent"
                >返回</el-button
              >
            </el-col>
            
          </el-row>
          <div
            id="canvas"
            ref="canvas"
            style="position: relative; overflow: auto; height: 740px"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
          >
            <img
              ref="roomImg"
              id="roomImg"
              :src="plateImg"
              :draggable="false"
              style="width: 1609px; height: auto"
            />
            <template v-for="(item, index) in deviceInfo">
              <TopoEdit
                :key="index"
                :deviceData="item"
                :width="120"
                :height="80"
                :id="index"
                :type="'dev'"
                @refreshTopo="init"
                @changePos="changePos"
              ></TopoEdit>
            </template>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import TopoEdit from "../../../components/DrawCanvas/TopoEdit.vue";

import store from "@/store";

import { sdcSiteAction } from "@/api/sdc/addressInfo";
import { modifyData } from "@/util/domainFilter";

import { getSdcTopoComponentTable,getSdcTopoDevTable,querySdcTopoComponent, sdcTopoDevAction } from "../../../api/sdc/topoInfo";

import { tree } from "d3-hierarchy";

let startx = 0,
  startY = 0;

export default {
  components: {
    TopoEdit,
  },
  props: ["action",'topoInfo'],
  data() {
    return {
      plateImg: null,
      deviceInfo: [],
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      condition: [],
      address: null,
      isdisabled: true,
      devEditInfo: [],
      initX: 0,
      initY: 0,
      initOffsetX: 0,
      initOffsetY: 0,
      editForm: {
        name: null,
        siteId: null,
        url: null,
        type: null
      },
      editFormRules:{
        type: [
          { required: true, message: "请选择所属系统", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入拓扑图名称", trigger: "blur" },
        ],
        siteId: [{ required: true, message: "请选择所属位置", trigger: "change" }],
       
      },
    };
  },
  created() {
    this.init();
  },
  mounted() {
    if(this.action === 3) {
      this.isdisabled = true
    } else {
      this.isdisabled = false
    }
    this.plateImg = this.topoInfo.url
    console.log(this.topoInfo, 'topoInfo');
  },
  methods: {
    //初始化获取数据
    async init() {
      console.log("000");
      this.devEditInfo = []
      //获取初始区域查询条件数据
      let data = await sdcSiteAction("", "/tree", "get");
      this.condition = modifyData(data.data.data);

      //获取组件库
      let componentInfo = await getSdcTopoComponentTable({
        current: 1,
        size: 200,
      });
      console.log("11111");
      console.log(componentInfo);
      for (
        let index = 0;
        index < componentInfo.data.data.records.length;
        index++
      ) {
        const el = componentInfo.data.data.records[index];
        this.devEditInfo.push({
          id: el.id,
          type: el.type,
          name: el.name,
          url: el.url,
        });
      }

      //获取拓扑图组件内容
      this.getTopoDevInfo()

      //初始化获取拓扑图的坐标
      let canvas = document.getElementById("canvas");
      let X = canvas.offsetLeft;
      let Y = canvas.offsetTop;
      while ((canvas = canvas.offsetParent)) {
        X += canvas.offsetLeft;
        Y += canvas.offsetTop;
      }
      this.initX = X;
      this.initY = Y;
    },
    async getTopoDevInfo() {
      this.deviceInfo = []
      let componentData = await getSdcTopoDevTable({
        current: 1,
        size: 200,
        topoId: this.topoInfo.id
      });
      for (
        let index = 0;
        index < componentData.data.data.records.length;
        index++
      ) {
        const el = componentData.data.data.records[index];
        querySdcTopoComponent(el.componentId).then( res => {
          console.log(res,22222222222);
          this.deviceInfo.push({
            id: el.id,
            topoId: el.topoId,
            deviceId: el.deviceId,
            componentId: el.componentId,
            componnetX: el.componnetX,
            componnetY: el.componnetY,
            url: res.data.data.url,
            type: "old",
          });
        })
        
      }
    },
    //释放设备原型
    drop(e) {
      e.preventDefault();
    },
    allowDrop(e) {
      e.preventDefault();
    },
    dragStart(e) {},
    //计算设备原型拖动结束时在拓扑图中的相对位置
    dragEnd(e,item) {
      console.log(item);
      e.preventDefault();
      //初始化获取拓扑图的坐标
      let canvas = this.$refs.canvas;
      console.log(this.$refs, window.scrollLeft);
      let X = canvas.scrollLeft;
      let Y = canvas.scrollTop;
      while ((canvas = canvas.scrollParent)) {
        X += canvas.scrollLeft;
        Y += canvas.scrollTop;
      }
      console.log(X, Y,e.target.src,e);
      if (this.initX <= e.x && this.initY <= e.y) {
        let x = e.x - this.initX - this.initOffsetX + X;
        let y = e.y - this.initY - this.initOffsetY + Y;
        this.deviceInfo.push({
          topoId: this.topoInfo.id,
          componentId: item.id,
          componnetX: x,
          componnetY: y,
          url: e.target.src,
          type: "new",
        });
      }
    },
    //计算初始时鼠标与设备原型坐标的距离
    onMouseDown(e) {
      this.initOffsetX = e.x - e.target.x;
      this.initOffsetY = e.y - e.target.y;
    },
    changePos(data) {
      console.log(data,'changePos');
      sdcTopoDevAction(data, '', 'put')
    },
    async changeAddress(val) {
      console.log(val, "val");
      //清空界面
      if (val.length === 0) {
        this.deviceData = this.deviceInfo = [];
        this.img = null;
        this.address = null;
      } else {
        if (val.length === 1) {
          let devData = await getSdcTableBy({
            current: 1,
            size: 200,
            topTypeCode: "light",
          });
          this.deviceInfo = this.deviceData = devData.data.data.records;
        } else {
          //获取房间设备信息
          let queryData = await getSdcDeviceList(1, 100, val[val.length - 1]);
          //deviceInfo作为缓存比对数据
          this.deviceInfo = this.deviceData = queryData.data.data.records;
        }
        //获取房间图片信息
        let siteData = await sdcSiteAction(
          "",
          "/" + val[val.length - 1],
          "get"
        );
        this.img = siteData.data.data.siteImg;
      }
      this.deviceKey = new Date().toString();
    },
    changeComponent() {
      this.$emit("changeComponent", {
        currentComponent: "topomaptable",
      });
    },
    handleDeviceAvatarSuccess(res,file) {
      this.editForm.url = this.plateImg = res.data.url;
      
    },
    saveInfo() {

    }
  },
};
</script>

<style lang="scss">
// #canvas {
/*css主要部分的样式*/
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 10px; /*对垂直流动条有效*/
  height: 10px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  display: none;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 7px;
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #e8e8e8;
}

/*定义两端按钮的样式*/
::-webkit-scrollbar-button {
  display: none;
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
  // background:khaki;
  display: none;
}
// }
</style>