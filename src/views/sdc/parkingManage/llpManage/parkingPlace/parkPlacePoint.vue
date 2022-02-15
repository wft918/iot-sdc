<template>
  <el-row :gutter="20">
    <el-col>
      <div class="title">{{ title }}</div>
    </el-col>
    <el-col :span="8">
      <el-form
        :model="inputForm"
        label-width="120px"
        :rules="rules"
        ref="parkPlaceForm"
        :disabled="isdisabled"
      >
        <el-form-item label="车位编号" prop="code">
          <el-input v-model="inputForm.code"></el-input>
        </el-form-item>
        <!-- <el-form-item label="车位名称" prop="name">
          <el-input v-model="inputForm.name"></el-input>
        </el-form-item> -->
        <el-form-item label="停车场名称" prop="parkId">
          <el-select
            v-model="inputForm.parkId"
            style="width: 50%"
            :disabled="psDisabled"
            @change="getPlateInfo"
          >
            <el-option
              v-for="item in parkingNameMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="车位状态" prop="status">
          <el-select v-model="inputForm.status" style="width: 50%">
            <el-option
              v-for="item in this.$dictUtils.getDictList('park_space_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="面积" prop="area">
          <el-input v-model="inputForm.area"></el-input>
        </el-form-item>
        <!-- <el-form-item label="到期时间" prop="expiryEnd">
          <el-date-picker
            v-model="inputForm.expiryEnd"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="备注：" prop="remarks">
          <el-input
            type="textarea"
            rows="2"
            v-model="inputForm.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn">
        <template v-if="actionType === 3">
          <el-button type="primary" @click="toIndex" size="small"
            >关闭</el-button
          >
        </template>
        <template v-else>
          <el-button @click="toIndex" size="small">取消</el-button>
          <el-button type="primary" @click="submitForm" size="small"
            >保存</el-button
          >
        </template>
      </div>
    </el-col>
    <!-- <el-col :span="15">
      <div id="canvas" style="position: relative">
        <img
          ref="roomImg"
          :src="plateImg"
          style="width: 100%; height: 100%"
          v-if="plateImg"
        /> 
        <template v-for="(item, index) in deviceInfo">
          <parkImg
            :key="deviceKey + index"
            :deviceData="item"
            :width="120"
            :height="80"
            :plateWidth="plateWidth"
            :plateHeight="plateHeight"
            :id="index"
            :isShow="textShow"
            :isDraggable="isDraggable"
            @updatePlatePointMsg="updatePlatePointMsg"
          ></parkImg>
        </template>
      </div>
    </el-col> -->
    <el-col>
      
    </el-col>
  </el-row>
</template>

<script>
import { sdcParkPlaceAction } from "@/api/sdc/parkManage";
import parkImg from "@/components/DrawCanvas/parkImg";
import parkImgUrl from "../../../../../assets/img/park.jpg";
import { getDevInfoBySiteIdAndSys } from "@/api/sdc/deviceInfo";

import moment from "moment";

import eventBus from "@/util/eventBus";

export default {
  props: [
    "parkPlaceCodeMap",
    "inputFormData",
    "parkingNameMap",
    "psDisabled",
    "isdisabled",
    "title",
    "actionType",
    "parkingLotData",
    'pqCondition'
  ],
  components: {
    parkImg,
  },
  data() {
    return {
      inputForm: {
        code: null, //车位编号
        name: null, //车位名称
        parkId: null, //停车场名称
        area: null,
        // expiryEnd: null,
        // status: null,
        remarks: null,
        x: null,
        y: null,
        width: null,
        height: null,
        deg: null,
      },
      rules: {
        code: [{ required: true, message: "请输入车位编号", trigger: "blur" }],
        // name: [{ required: true, message: "请输入车位名称", trigger: "blur" }],
        parkId: [
          { required: true, message: "请选择停车场名称", trigger: "change" },
        ],
        // status: [
        //   { required: true, message: "请选择车位状态", trigger: "change" },
        // ],
        area: [{ required: true, message: "请输入面积", trigger: "blur" }],
        // expiryEnd: [
        //   { required: true, message: "请选择到期时间", trigger: "blur" },
        // ],
      },
      textShow: false,
      isDraggable: true,
      deviceInfo:[],
      plateImg: null,
      deviceKey: Math.random().toString(36).slice(-6),
      plateWidth: 18,
      plateHeight: 26
    };
  },
  created() {
    this.init();
  },
  mounted() {
    
  },
  methods: {
    init() {
      this.actionType !== 1 ? (this.inputForm = this.inputFormData) : null;
      if(this.actionType !== 1) {
        console.log(this.inputFormData,'this.inputFormData');
        this.deviceInfo.push(this.inputFormData)
        this.inputForm = this.inputFormData
        this.isDraggable = false
        this.plateWidth = this.inputForm.expand.width
        this.plateHeight = this.inputForm.expand.height
        this.getPlateInfo()
      }
    },
    submitForm() {
      this.$refs.parkPlaceForm.validate((valid) => {
        if (valid) {
          this.inputForm.expiryEnd = moment(this.inputForm.expiryEnd).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.inputForm.name = this.inputForm.code
          if (this.actionType === 1) {
            this.inputForm.createDate = moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            sdcParkPlaceAction(this.inputForm, "", "post").then((res) => {
              if (res.data.code === 0) {
                this.$message.success('新增成功')
                this.toIndex();
              }
              
            });
          } else {
            this.inputForm.updateDate = moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            sdcParkPlaceAction(this.inputForm, "", "put").then((res) => { 
              if (res.data.code === 0) {
                this.$message.success('修改成功')
                this.toIndex();
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toIndex() {
      this.changeComponent(null, null, null, null, null,this.inputForm.parkId,this.pqCondition);
    },
    changeComponent(psDisabled, isdisabled, title, actionType, inputFormData,parkId,queryCondition) {
      this.$emit("changeCurrentCompent", {
        currentCompent: "parkpPlace",
        psDisabled,
        isdisabled,
        title,
        actionType,
        inputFormData,
        parkId,
        queryCondition
      });
    },
    updatePlatePointMsg(data) {
      this.inputForm.x = data.x
      this.inputForm.y = data.y
      this.inputForm.width = data.width
      this.inputForm.height = data.height
      this.inputForm.deg = data.deg

      console.log(this.inputForm,'this.inputForm');
    },
    async getPlateInfo() {
      this.parkingLotData.forEach(el => {
        if(el.id === this.inputForm.parkId) {
          getDevInfoBySiteIdAndSys(el.siteId,'6','').then( res => {
            console.log(res,'plateInfo');
            this.plateImg = res.data.data[0].roomInfos[0].siteImg
          })
        }
      });
      if(this.deviceInfo.length === 0) {
        this.deviceInfo.push({
          x:0,
          y:0,
          deg:0
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  margin: 16px;
}
.btn {
  text-align: center;
}
</style>