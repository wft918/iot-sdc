<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" v-dialogDrag width="45%">
      <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method === 'view' ? 'readonly' : ''"
        :disabled="isDisabled" label-width="110px">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="基本信息" name="first">
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="名称" prop="siteName" :rules="[
                { required: true, message: '名称不能为空', trigger: 'blur' },
              ]">
                  <el-input style="width: 100%;" v-model="inputForm.siteName" placeholder="请填写名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属位置" prop="projectId" :rules="[
                 {required: true, message:'所属位置不能为空', trigger:'blur'}
                  ]">
                  <SelectTree
                  ref="sdcsiteTree"
                  :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                  v-if="true"
                  :url="'/site-sdc/sdcsite/tree'"
                  :value="inputForm.projectId"
                  :clearable="true" 
                  :accordion="true"
                  @getValue="(value) => {inputForm.projectId=value}"/>
                  <!-- <el-select style="width: 100%;" v-model="inputForm.projectId" placeholder="请选择">
                    <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                      :value="item.projectId">
                    </el-option>
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="是否启用" prop="enable" :rules="[
              {required: true, message:'是否启用不能为空', trigger:'blur'}
              ]">
                  <!-- <el-radio-group v-model="inputForm.enable">
                    <el-radio v-for="item in ynEnableList" :label="item.value">{{item.label}}</el-radio>
                  </el-radio-group> -->
                  <el-switch
                    v-model="inputForm.enable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="3"><span style="float: right;font-weight: 600;margin-right: 20%;">检查项</span></el-col> -->
              <el-col :span="22">
                <!-- 使用树形穿梭狂组件 -->
                <tree-transfer style="margin-left: 5%;" v-loading="loading1" :title="treeTitle" :from_data='fromData' :to_data='toData'
                  :defaultProps="{label:'name',children: 'children'}" :mode='mode' height='400px' pid="parentId"
                  :filter="method != 'view'" openAll>
                </tree-transfer>
              </el-col>
              
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="定位" name="second">
            <el-row :gutter="15">
              <el-col :span="24">
                <el-form-item label="是否启用定位" prop="located" :rules="[
                  {required: true, message:'是否启用定位不能为空', trigger:'blur'}
                ]">
                  <!-- <el-radio-group v-model="inputForm.located">
                    <el-radio v-for="item in ynLocationList" :label="item.value">{{item.label}}</el-radio>
                  </el-radio-group> -->
                  <el-switch
                    v-model="inputForm.located"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="1"
                    inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="inputForm.located == '1'">
               <el-form-item label="有效距离" prop="distance" :rules="[]">
                  <el-input style="width: 100%;" v-model="inputForm.distance" placeholder="请填写有效距离"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="inputForm.located == '1'">
                <el-form-item label="经度" prop="longitude"
                  :rules="inputForm.located == '1'?[{ validator: validatorxps.isFloat, trigger: 'blur' }]:[]">
                  <el-input style="width: 100%;" v-model="inputForm.longitude" placeholder="请填写经度" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="inputForm.located == '1'">
                <el-form-item label="纬度" prop="latitude"
                  :rules="inputForm.located == '1'?[{ validator: validatorxps.isFloat, trigger: 'blur' }]:[]">
                  <el-input style="width: 100%;" v-model="inputForm.latitude" placeholder="请填写纬度" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="inputForm.located == '1'">
                <template>
                  <!-- <div id="allmap"></div> -->
                  <baidu-map style="height: 300px" class="bm-view" ak="YPk5EjDFGNnD4egw1QjgdI72yMQoQt74" :scroll-wheel-zoom="true"
                    :center="{ lng: inputForm.longitude, lat: inputForm.latitude }" :zoom="zoom"
                    @ready="handler" @click="getClickInfo" @moving="syncCenterAndZoom" @moveend="syncCenterAndZoom"
                    @zoomend="syncCenterAndZoom">
                    <bm-marker :position="{
                    lng: inputForm.longitude,
                    lat: inputForm.latitude,
                  }"></bm-marker>
                    <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
                  </baidu-map>
                </template>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="method === 'view'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="btnType === 1" type="primary" @click="enableEdit">编 辑</el-button>
        <el-button v-if="btnType === 2" type="primary" @click="doSubmit()">确 定</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import treeTransfer from 'el-tree-transfer'    // 引入树形穿梭框
  import BaiduMap from "vue-baidu-map/components/map/Map.vue";
  import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
  import BmCityList from "vue-baidu-map/components/controls/CityList.vue";
  import CityPicker from "@/components/cityPicker";
  import SelectTree from "@/components/treeSelect/treeSelect.vue"
  export default {
    watch: {
      'inputForm.enable': {
        handler() {
          // console.log(this.inputForm.enable)
        },
        deep:true
      }
    },
    data() {
      return {
        activeName:'first',
        title: "",
        treeTitle: ['未选检查项', '已选检查项'],
        mode: "transfer", //设置模式，字段可选值为transfer|addressList 类型：String 必填：false 补充：mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人
        dialogVisible: false,
        method: "",
        loading: false,
        loading1: false,
        projectList: [],//所属项目列表
        fromData: [],//左边所有检查项列表
        toData: [],//右边已选检查项列表
        // ynEnableList: [
        //   {
        //     label: "是",
        //     value: "1"
        //   },
        //   {
        //     label: "否",
        //     value: "0"
        //   }
        // ],
        ynLocationList: [
          {
            label: "是",
            value: "1"
          },
          {
            label: "否",
            value: "0"
          }
        ],
        zoom: 15,
        inputForm: {
          id: "",
          siteName: "",//名称
          projectId: "",//所属项目ID
          projectName: "",
          enable: "",//是否启用
          located: "",//是否启用定位
          distance: "",//有效距离
          longitude: "",//经度
          latitude: "",//维度
          itemList: []
        },
        loadingisShow1: false,
        loadingisShow2: false,
        btnType: 1,
        isDisabled: false
      }
    },
    components: {
      treeTransfer,
      BaiduMap,
      BmMarker,
      BmCityList,
      CityPicker,
      SelectTree
    },
    methods: {
      enableEdit() {
        this.title = '编辑巡检点'
        this.isDisabled = false
        this.btnType = 2
      },
      init(method, id) {
        this.method = method
        this.inputForm.id = id
        if (method == 'add') {
          this.title = '新增巡检点'
          this.isDisabled = false
        } else if (method == 'edit') {
          this.title = '编辑巡检点'
          this.isDisabled = false
        } else if (method == 'view') {
          this.title = '查看巡检点'
          this.isDisabled = true
          this.btnType = 1
        }
        this.fromData = []
        this.toData = []
        this.projectList = []
        this.getinspectItemSiteTreeData()// 获取未选检查项列表
        // this.getprojectInfolist()//获取所属项目列表
        this.dialogVisible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.itemList = []
          if (method == 'edit' || method == 'view') {
            // 修改或查看
            this.loadingisShow1 = false
            this.loadingisShow2 = false
            this.loading = true
            this.$http({
              url: `/check/inspect/inspectSite/selected/tree?siteId=${this.inputForm.id}`,
              method: "get"
            }).then(({ data }) => {
              if (data && data.success) {
                data.treeData.forEach(item => {
                  item.parentId = 0
                })
                this.toData = data.treeData
                this.loadingisShow1 = true
                this.loadingShow()
              }
            })
            this.$http({
              url: `/check/inspect/inspectSite/queryById?id=${this.inputForm.id}`,
              method: "get",
            }).then(({ data }) => {
              if (data && data.success) {
                console.info(1111)
                console.info(data)
                this.inputForm = this.recover(this.inputForm, data.inspectSite)
                // this.inputForm = Object.assign(this.inputForm, data.inspectSite)
                console.info(this.inputForm)
                this.loadingisShow2 = true
                console.info(222)
                this.loadingShow()
              }
            })
          }
        })
      },
      loadingShow() {
        if (this.loadingisShow1 && this.loadingisShow2) {
          this.loading = false
        }
      },
      // 获取未选检查项列表
      getinspectItemSiteTreeData() {
        this.loading1 = true
        this.$http({
          url: `/check/inspect/inspectItemSite/tree?siteId=${this.inputForm.id}`,
          method: "get",
        }).then(({ data }) => {
          if (data && data.success) {
            data.treeData.forEach(item => {
              item.parentId = 0
            })
            this.fromData = data.treeData
            this.loading1 = false
          }
        })
      },
      // 获取所属项目列表
      getprojectInfolist() {
        this.$http({
          url:"/check/iot/tsg/projectInfo/listByUser",
          method:"get",
        }).then(({data}) => {
          if(data && data.success) {
            this.projectList = data.projects
          }
        })
      },
      //地图
      handler({ BMap, map }) {
        map.enableScrollWheelZoom(true);
        map.centerAndZoom(new T.LngLat(this.inputForm.longitude,this.inputForm.latitude), 13)
        map.centerAndZoom("北京", 13);
        // let mapStyle = { style: "midnight" };
        // map.setMapStyle(mapStyle);
        this.BMap = BMap;
        this.map = map;
      },
      syncCenterAndZoom(e) {
        const { lng, lat } = e.target.getCenter();
        // this.inputForm.longitude = lng;
        // this.inputForm.latitude = lat;

        this.zoom = e.target.getZoom();
      },
      getClickInfo(e) {
        this.inputForm.longitude = e.point.lng;
        this.inputForm.latitude = e.point.lat;
      },
      doSubmit() {
        this.inputForm.itemList = []
        if (this.toData.length > 0) {
          this.toData.forEach(item => {
            if (item.children) {
              item.children.forEach(arr => {
                if (arr.children) {
                  arr.children.forEach(sour => {
                    if (sour.children) {
                      sour.children.forEach(option => {
                        var idsStr = ''
                        idsStr = option.parentIds.concat(option.id)
                        this.inputForm.itemList.push(idsStr)
                        // this.inputForm.itemList.push(option.id)
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          this.$message.warning('已选检查项不能为空')
          return
        }
        if (this.inputForm.distance == '' || this.inputForm.distance == null || this.inputForm.distance == undefined) {
          this.inputForm.distance = 0
        }
        this.projectList.forEach(item => {
          if (item.projectId == this.inputForm.projectId) {
            this.inputForm.projectName = item.projectName
          }
        })
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/check/inspect/inspectSite/save`,
              method: 'post',
              data: this.inputForm
            }).then(({ data }) => {
              if (data && data.success) {
                this.dialogVisible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
              this.loading = false
            })
          }
        })
      }
    },
  }
</script>
