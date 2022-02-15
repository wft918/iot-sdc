<template>
  <div>
      <!-- <div slot="title" class="dialog-title">
        <span class="title-text">{{
          dialogData.actionType | addressTitleTypeMapFilter(dialogData.addType)
        }}</span>
      </div> -->
      <el-form
        :model="inputForm"
        label-width="150px"
        :rules="rules"
        ref="addressForm" :disabled="isdisabled"
      >
        <el-form-item label="编号" prop="code">
          <el-input v-model="inputForm.code" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="地点名称" prop="name">
          <el-input v-model="inputForm.name" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item
          label="行政区域"
          prop="areaId"
          v-if="dialogData.addType === 'P00'"
        >
          <SelectTree  
              ref="parentTree"
              :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
              v-if="true"
              :url="`/admin/area/treeData`"
              :value="inputForm.areaId"
              :clearable="true" 
              :accordion="true"
              @getValue="(value) => {inputForm.areaId=value}"/> 
        </el-form-item>
        <el-form-item label="上级地点" prop="parentId" v-if="dialogData.addType !== 'P00'">
          <SelectTree  disabled
              ref="sdcsiteTree"
              :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
              v-if="true"
              :url="`/site-sdc/sdcsite/tree`"
              :value="inputForm.parentId"
              :clearable="true" 
              :accordion="true"
            @getValue="(value) => {inputForm.parentId=value}"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="inputForm.type" :disabled="isTypeDisabled" @change="typeChange">
            <el-option
              v-for="item in siteTypeMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogData.addType === 'R00'" label="面积" prop="siteArea">
          <el-input v-model="inputForm.siteArea"  @input="areaChange" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogData.addType === 'P00'" label="面积" prop="">
          <el-input v-model="inputForm.siteArea" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogData.addType === 'R00'" label="设计电力容量(kWh)" prop="capacityPower">
          <el-input v-model="inputForm.capacityPower" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogData.addType === 'R00'" label="可容纳机柜数量" prop="capacityRack">
          <el-input v-model="inputForm.capacityRack" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogData.addType === 'R00'" label="设计需要冷量(kWh)" prop="capacityCool">
          <el-input v-model="inputForm.capacityCool" @input="coolChange" style="width:70%"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number  v-model="inputForm.sort" :min="1" :max="9999" :step="1" ></el-input-number>
        </el-form-item>
        <el-form-item
          label="局站特征"
          prop="nodeFeatures"
          v-if="dialogData.addType === 'P00'"
        >
          <el-select v-model="inputForm.nodeFeatures" >
            <el-option
              v-for="item in nodeTypeMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="局站类型"
          prop="stationType"
          v-if="dialogData.addType === 'P00'"
        >
          <el-select v-model="inputForm.stationType" >
            <el-option
              v-for="item in stationTypeMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纬度" v-if="dialogData.addType === 'P00'">
          <el-col :span="8">
            <el-input v-model="inputForm.longitude" ></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="inputForm.latitude" ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="openBMap(1)">经纬度选择</el-button>
          </el-col>
        </el-form-item>
            <!-- <el-form-item label="实际长度" prop="areaLength"
                :rules="[
                  {validator: validatorxps.isFloatGteZero, trigger:'blur'},
                 ]">
              <el-input v-model="inputForm.areaLength" style="width:70%" placeholder="请填写实际长度(厘米)" ></el-input>
           </el-form-item>
            <el-form-item label="实际宽度" prop="areaWidth"
                :rules="[
                  {validator: validatorxps.isFloatGteZero, trigger:'blur'},
                 ]">
              <el-input v-model="inputForm.areaWidth" style="width:70%" placeholder="请填写实际宽度(厘米)" ></el-input>
           </el-form-item>
            <el-form-item label="像素长度（px）" prop="pixelLength"
                :rules="[
                  {validator: validatorxps.isFloatGteZero, trigger:'blur'},
                 ]">
              <el-input v-model="inputForm.pixelLength" style="width:70%" placeholder="请填写平面图像素长度（px）" ></el-input>
           </el-form-item>
            <el-form-item label="像素宽度（px）" prop="pixelWidth"
                :rules="[
                  {validator: validatorxps.isFloatGteZero, trigger:'blur'},  
                 ]">
              <el-input v-model="inputForm.pixelWidth" style="width:70%" placeholder="请填写平面图像素宽度（px）" ></el-input>
           </el-form-item> -->
        <el-form-item label="平面图">
          <el-upload
            class="avatar-uploader"
            action="/site-sdc/sdc-file/upload"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :key="imgKey"
          >
            <img
              v-if="inputForm.siteImg"
              :src="siteImgURL"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="管理人员"
          prop="managerUsers"
          v-if="dialogData.addType === 'R00'"
        >
          <el-select v-model="inputForm.managerUsers" multiple no-data-text="加载中">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="管理人员"
          prop=""
          v-else
        >
          <el-select v-model="inputForm.managerUsers" multiple no-data-text="加载中">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注信息"
          prop="siteDesc"
        >
          <el-input type="textarea" :rows="2" v-model="inputForm.siteDesc" style="width:70%"></el-input>
        </el-form-item>
      </el-form>
    <el-dialog :visible.sync="bmapVisible" width="80%" title="经纬度选择" ref="bmapDialog" append-to-body v-dialogDrag>
      <el-form
        :model="mapForm"
        label-width="100px"
        ref="mapForm"
      >
        <el-form-item label="经纬度" v-if="mapFlag === 1">
          <el-row :gutter="15">
            <el-col :span="4">
              <el-input v-model="mapForm.longitude"></el-input>
            </el-col>
            <el-col :span="4">
              <el-input v-model="mapForm.latitude"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="saveLngAndLat">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div id="baidumap2" ref="tianditumap" class="bmap2"></div>
    </el-dialog>
  </div>
</template>

<script>
import { addressTitleTypeMapFilter } from "@/util/domainFilter";
import { sdcSiteAction } from "@/api/sdc/addressInfo";
import store from "@/store";
import { getStore } from "@/util/store";
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import _ from "lodash"

export default {
  props: ["dialogData",'siteTypeMap','nodeTypeMap','stationTypeMap','isdisabled'],
  filters: {
    addressTitleTypeMapFilter,
  },
  data() {
    return {
      mapForm: {
        longitude: null,
        latitude: null,
      },
      bmapVisible: false,
      imgKey: Math.random().toString(36).slice(-6),
      siteImgURL: null,
      mapFlag: 1,
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      inputForm: {
        map: null,
        code: null,
        name: null,
        areaId: '',
        parentId: null,
        parentAddress: null,
        type: null,
        sort: '',
        nodeFeatures: '',
        stationType: '',
        longitude: null,
        latitude: null,
        siteImg: null,
        siteDesc:null,
        areaLength: null,
        areaWidth: '',
        pixelLength: '',
        pixelWidth: '',
        managerUsers: ''
      },
      userList: [],
      userListLoading: true,
      rules: {
        code: [{ required: true, message: "请输入编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入地点名称", trigger: "blur" }],
        areaId: [
          { required: true, message: "请输入行政区域", trigger: "blur" },
        ],
        nodeFeatures: [
          { required: true, message: "请输入局站特征", trigger: "blur" },
        ],
        stationType: [
          { required: true, message: "请输入局站类型", trigger: "blur" },
        ],
        capacityPower: [
          { required: true, message: "请输入设计电力容量", trigger: "blur" }
        ],
        capacityRack: [
          { required: true, message: "请输入可容纳机柜数量", trigger: "blur" }
        ],
        capacityCool: [
          { required: true, message: "请输入设计需要冷量", trigger: "blur" }
        ],
        siteArea: [
          { required: true, message: "请输入面积", trigger: "blur" }
        ],
        areaId: [
          { required: true, message: "请输入行政区域", trigger: "change" },
        ],
        nodeFeatures: [
          { required: true, message: "请输入局站特征", trigger: "change" },
        ],
        stationType: [
          { required: true, message: "请输入局站类型", trigger: "change" },
        ],
        longitude: [{ required: true, message: "请选择经度", trigger: "blur" }],
        latitude: [{ required: true, message: "请选择纬度", trigger: "blur" }],
        managerUsers: [
          { required: true, message: "请选择管理人员", trigger: "change" },
        ],
      },
      isTypeDisabled: true
    };
  },
  created() {
    this.initDialog();
    this.getuserList()
  },
  mounted() {
    // this.initDialog()
  },
    activated () {
      this.initDialog()
    },
  // updated() {
  //   this.initDialog();
  // },
  components: {
    SelectTree
  },
  methods: {
    initDialog() {
        // if(this.dialogData.actionType == 1){
          this.$nextTick(() => {
            
            this.$refs.addressForm.resetFields()
            this.inputForm = this.dialogData;
            if(this.dialogData.actionType === 1) {
              this.isTypeDisabled = false
            }
            this.inputForm.type = this.dialogData.addType;
            this.inputForm.parentAddress = this.dialogData.parentAddress;
            this.siteImgURL = this.inputForm.siteImg
          })
        // }
    },
    // 获取人员列表
      getuserList() {
        this.$http({
          url:"/admin/user/page",
          method:"get",
          params:{
            pageNo:1,
            size:-1
          }
        }).then(({data}) => {
          if(data && data.code == '0') {
            this.userList = data.data.records
            this.userListLoading = false
            if (this.dialogData.managerUsers) {
              let userArr = this.dialogData.managerUsers.split(',');
              for(let i = 0;i < userArr.length;i++) {
                userArr[i] = parseInt(userArr[i])
              }
              this.inputForm.managerUsers = userArr
            }
          }
        })
      },
    areaChange(val) {
      this.inputForm.capacityCool = val * 0.15
    },
    coolChange(val) {
      this.inputForm.capacityCool = val > this.inputForm.siteArea * 0.15 ? val : this.inputForm.siteArea * 0.15
      this.$forceUpdate()
    },
    submitForm() {
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          let dataForm = _.cloneDeep(this.inputForm)
          if (this.inputForm.managerUsers) {
            dataForm.managerUsers = this.inputForm.managerUsers.join(',')
          } 
          // this.inputForm.tenantId = getStore({ name: "tenantId" });
          if(this.inputForm.actionType === 1){
            sdcSiteAction(dataForm, "", "post").then((res) => {
              if (res.data.code === 0) {
                this.$emit('close')
                this.$emit('refreshDataList')
                this.$message.success('新增成功')
              }
            })
          }else{
            sdcSiteAction(dataForm, "", "put").then((res) => {
              if (res.data.code === 0) {
                this.$emit('close')
                this.$emit('refreshDataList')
                this.$message.success('编辑成功')
              }
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //处理图片上传成功后的数据
    handleAvatarSuccess(val,file) {
      this.siteImgURL = URL.createObjectURL(file.raw)
      this.inputForm.siteImg = val.data.url;
      this.imgKey = (new Date()).toString()
    },
    openBMap(flag) {
      this.mapFlag = flag
      this.bmapVisible = true;
       this.$nextTick(() => {
        this.initBMap();
      })
    },
    initBMap() {
      let map;
      let zoom = 10;
      this.$refs.tianditumap.innerHTML="",
        map = new T.Map("baidumap2", {
          projection: "EPSG:4326"
        })
      if(this.inputForm.longitude == null && this.inputForm.latitude == null) {
        map.centerAndZoom(new T.LngLat(116.385297,39.925338), zoom)
      }else {
        //设置显示地图的中心点和级别
        map.centerAndZoom(new T.LngLat(this.inputForm.longitude, this.inputForm.latitude), zoom);

        //创建标注对象
        let marker = new T.Marker(new T.LngLat(this.inputForm.longitude, this.inputForm.latitude));
        //向地图上添加标注
        map.addOverLay(marker);
      }
      let cp = new T.CoordinatePickup(map, { callback: (lnglat) => {
            this.mapForm.longitude = lnglat.lng.toFixed(6)
            this.mapForm.latitude = lnglat.lat.toFixed(6)
          } 
        })
        cp.addEvent() 
    },
    saveLngAndLat() {
      this.inputForm.longitude = this.mapForm.longitude
      this.inputForm.latitude = this.mapForm.latitude
      this.bmapVisible = false;
    },
    closeDialog(){
      this.$emit('closeDialog')
    },
    getValue(data) {
      // (value) => {inputForm.areaId=value}
      console.log(data);
    },
    typeChange(data) {
      // 选择类型后强制刷新
      this.$forceUpdate()
    }
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.bmap2 {
  min-height: 600px;
  height: 100%;
  width: 100%;
  z-index: 1000;
}
.filter-tree{
  margin-top: 15px;
}
</style>
