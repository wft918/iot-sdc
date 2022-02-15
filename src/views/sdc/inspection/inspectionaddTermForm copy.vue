<!-- 添加检查项 -->
<template>
  <div>
    <el-dialog :title="title" width="48%" :visible.sync="dialogVisible" :close-on-click-modal="false" v-dialogDrag>
      <el-form :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
          <div style="margin-left: 10%;margin-bottom: 2%;font-weight: 600;">
            <span>类型</span>
            <span style="margin-left: 10px;">{{inputForm.typeName}}</span>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="margin-left: 8.5%;margin-bottom: 2%;font-weight: 600;">
            <span>风险点</span>
            <span style="margin-left: 10px;">{{inputForm.pointName}}</span>
          </div>
        </el-col>
        <el-col :span="24">
          <div style="margin-left: 8.5%;margin-bottom: 2%;font-weight: 600;">
            <span>风险源</span>
            <span style="margin-left: 10px;">{{inputForm.sourceName}}</span>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="检查项" prop="itemName" :rules="[{required: true, message:'检查项不能为空', trigger:'blur'}]">
            <el-input maxlength="300" type="textarea" v-model="inputForm.itemName" placeholder="请填写检查项" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item  label="是否必填" prop="required" :rules="[{required: true, message:'是否不能为空', trigger:'blur'}]">
            <el-radio-group v-model="inputForm.required">
              <el-radio v-for="item in requiredList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item  label="顺序" prop="sort" :rules="[{required: true, message:'顺序不能为空', trigger:'blur'}]">
            <el-input-number v-model="inputForm.sort" :step="1" controls-position="left" :min="0" label="顺序"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item  label="类型" prop="itemType" :rules="[{required: true, message:'类型不能为空', trigger:'blur'}]">
            <el-radio-group v-model="inputForm.itemType">
              <el-radio v-for="item in itemTypeList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- 选择项 -->
        <el-col :span="24" v-if="inputForm.itemType == '1'">
          <el-form-item  label="选项类型" prop="optionType" :rules="inputForm.itemType == '1'?[{required: true, message:'选项类型不能为空', trigger:'blur'}]:[]">
            <el-radio-group v-model="inputForm.optionType">
              <el-radio v-for="item in optionTypeList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="inputForm.itemType == '1'&&inputForm.optionType == '1'">
          <el-form-item  label="选项关系" prop="optionRelation" :rules="inputForm.itemType == '1'&&inputForm.optionType == '1'?[{required: true, message:'选项类型不能为空', trigger:'blur'}]:[]">
            <el-select style="width: 100%;" v-model="inputForm.optionRelation" placeholder="选项是否合格">
              <el-option
                v-for="item in optionRelationList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')">
          <!-- <div style="width: 8%;float: left;height: 50px;line-height: 40px;font-weight: 600;"><span style="margin-left: 30px;">选项</span></div> -->
          <div v-for="(item,index) in inputForm.optionItemList" :key="index" :style="{'margin-left':index>0?'8%':''}" style="width: 100%;height: 50px;float: right;position: relative;">
            <el-row>
              <el-col :span="24">
                <el-form-item :label="'选项' + (index+1)" :required="inputForm.itemType == '1'?true:false">
                  <el-row>
                    <el-col :span="5">
                      <el-form-item style="float: left" :prop="'optionItemList.' + index + '.optionName'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'选项名称不能为空', trigger:'blur'},{validator: validator.stringCheck, trigger:'blur'}]:[]">
                        <el-input style="width: 100%;" v-model="item.optionName" placeholder="选项名称" ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'optionItemList.' + index + '.qualified'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'选项是否合格不能为空', trigger:'blur'}]:[]">
                        <el-select clearable style="width: 100%;" v-model="item.qualified" placeholder="选项是否合格">
                          <el-option
                            v-for="item in qualifiedList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'optionItemList.' + index + '.selected'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'选项是否默认选中不能为空', trigger:'blur'}]:[]">
                        <el-select clearable style="width: 100%;" v-model="item.selected" placeholder="是否默认选中">
                          <el-option
                            v-for="item in selectedList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'optionItemList.' + index + '.sort'" :rules="inputForm.itemType == '1'&&(inputForm.optionType == '0' || inputForm.optionType == '1')?[{required: true, message:'排序号不能为空', trigger:'blur'}]:[]">
                        <el-input-number style="width: 100%;" v-model="item.sort" :min="0" label=""></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button v-if="index == 0 && method != 'view'" @click="addoption()" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-plus"></el-button>
            <el-button v-if="index > 0 && method != 'view'" @click="deloption(index)" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-minus"></el-button>
          </div>
        </el-col>

        <!-- 数字项 -->
        <el-col :span="12" v-if="inputForm.itemType == '2'">
          <el-form-item label="小数点后位数" prop="numberItem.decimalNum" :rules="inputForm.itemType == '2'?[{required: true, message:'小数点后位数不能为空', trigger:'blur'},{validator: validator.isIntGteZero, trigger:'blur'}]:[]">
            <el-input-number style="width: 100%;" v-model="inputForm.numberItem.decimalNum" :step="1" controls-position="left" :min="0" label="小数点后位数"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.itemType == '2'">
          <el-form-item label="默认输入值" prop="numberItem.defaultValue" :rules="inputForm.itemType == '2'?[{required: true, message:'默认输入值不能为空', trigger:'blur'},{validator: validator.isNumber, trigger:'blur'}]:[]">
            <el-input v-model="inputForm.numberItem.defaultValue" placeholder="请填写默认输入值" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.itemType == '2'">
          <el-form-item label="合格值上限" prop="numberItem.upperLimit" :rules="[]">
            <el-input v-model="inputForm.numberItem.upperLimit" placeholder="请填写合格值上限" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.itemType == '2'">
          <el-form-item label="合格值下限" prop="numberItem.lowerLimit" :rules="[]">
            <el-input v-model="inputForm.numberItem.lowerLimit" placeholder="请填写合格值下限" ></el-input>
          </el-form-item>
        </el-col>
        <!-- 文本项 -->
        <el-col :span="24" v-if="inputForm.itemType == '3'">
          <el-form-item  label="是否允许多行" prop="textItem.multipleLines" :rules="inputForm.itemType == '3'?[{required: true, message:'是否允许多行不能为空', trigger:'blur'}]:[]">
            <el-radio-group v-model="inputForm.textItem.multipleLines">
              <el-radio v-for="item in multipleLinesList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="inputForm.itemType == '3'">
          <el-form-item label="默认输入值" prop="textItem.defaultValue" :rules="inputForm.itemType == '3'?[{required: true, message:'默认输入值不能为空', trigger:'blur'}]:[]">
            <el-input type="textarea" v-model="inputForm.textItem.defaultValue" placeholder="默认输入值"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.itemType == '3'">
          <el-form-item label="合格选项名称" prop="textItem.qualifiedName" :rules="inputForm.itemType == '3'?[{required: true, message:'合格选项不能为空', trigger:'blur'}]:[]">
            <el-input v-model="inputForm.textItem.qualifiedName" placeholder="请填写合格选项名称" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.itemType == '3'">
          <el-form-item label="不合格选项名称" prop="textItem.unqualifiedName" :rules="inputForm.itemType == '3'?[{required: true, message:'不合格选项不能为空', trigger:'blur'}]:[]">
            <el-input v-model="inputForm.textItem.unqualifiedName" placeholder="请填写不合格选项名称" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="inputForm.itemType == '3'">
          <el-form-item  label="默认选择" prop="textItem.selected" :rules="inputForm.itemType == '3'?[{required: true, message:'默认选择不能为空', trigger:'blur'}]:[]">
            <el-radio-group v-model="inputForm.textItem.selected">
              <el-radio v-for="item in selecteddataList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 拍照项 -->
        <el-col :span="24" v-if="inputForm.itemType == '4'">
          <!-- <div style="width: 10%;float: left;height: 50px;line-height: 40px;font-weight: 600;"><span>拍照点配置</span></div> -->
          <div v-for="(item,index) in inputForm.photoItemList" :key="index" :style="{'margin-left':index>0?'8%':''}" style="width: 100%;height: 50px;float: right;position: relative;">
            <el-row>
              <el-col :span="24">
                <el-form-item :label="'拍照点配置' + (index + 1)" :required="inputForm.itemType == '4'?true:false">
                  <el-form-item style="float: left;margin-left: 10px;" :prop="'photoItemList.' + index + '.placeName'" :rules="inputForm.itemType == '4'?[{required: true, message:'拍照点名称不能为空', trigger:'blur'}]:[]">
                    <el-input style="width: 150px;" v-model="item.placeName" placeholder="拍照点名称" ></el-input>
                  </el-form-item>
                  <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'photoItemList.' + index + '.mustPhoto'" :rules="inputForm.itemType == '4'?[{required: true, message:'是否必须拍照不能为空', trigger:'blur'}]:[]">
                    <el-select style="width: 150px;" v-model="item.mustPhoto" placeholder="是否必须拍照">
                      <el-option
                        v-for="item in mustPhotoList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="float: left;margin-left: 10px;" label="" :prop="'photoItemList.' + index + '.num'" :rules="inputForm.itemType == '4'?[{required: true, message:'拍照张数不能为空', trigger:'blur'},{validator: validator.isIntGtZero, trigger:'blur'}]:[]">
                    <el-input style="width: 150px;" v-model="item.num" placeholder="拍照张数" ></el-input>
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button v-if="index == 0 && method != 'view'" @click="addphoto()" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-plus"></el-button>
            <el-button v-if="index > 0 && method != 'view'" @click="delphoto(index)" style="position: absolute;top: 3px;right: 0px;" size="mini" type="primary" icon="el-icon-minus"></el-button>
          </div>
        </el-col>
        <el-col :span="12" v-if="inputForm.itemType == '4'">
          <el-form-item label="合格选项名称" prop="photoQualifiedName" :rules="inputForm.itemType == '4'?[{required: true, message:'合格选项名称不能为空', trigger:'blur'}]:[]">
            <el-input v-model="inputForm.photoQualifiedName" placeholder="请填写合格选项名称" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="inputForm.itemType == '4'">
          <el-form-item label="不合格选项名称" prop="photoUnqualifiedName" :rules="inputForm.itemType == '4'?[{required: true, message:'不合格选项不能为空', trigger:'blur'}]:[]">
            <el-input v-model="inputForm.photoUnqualifiedName" placeholder="请填写不合格选项名称" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="inputForm.itemType == '4'">
          <el-form-item  label="默认选择" prop="photoSelected" :rules="inputForm.itemType == '4'?[{required: true, message:'默认选择不能为空', trigger:'blur'}]:[]">
            <el-radio-group v-model="inputForm.photoSelected">
              <el-radio v-for="item in selecteddataList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- 备注 -->
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remarks" :rules="[]">
            <el-input
              type="textarea"
              v-model="inputForm.remarks"
              placeholder="请填写备注信息"
              
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title:"",
        dialogVisible:false,
        loading:false,
        method:"",
        name:"",//类型名称
        spot:"",//风险点
        source:"",//风险源
        requiredList:[
          {
            label:'是',
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        itemTypeList:[
          {
            label:"选择项",
            value:1
          },
          {
            label:"数字项",
            value:2
          },
          {
            label:"文本项",
            value:3
          },
          {
            label:"拍照项",
            value:4
          }
        ],
        optionTypeList:[
          {
            label:"单选",
            value:0
          },
          {
            label:"多选",
            value:1
          }
        ],
        // 是否合格
        qualifiedList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        // 是否合格
        selectedList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        optionRelationList:[
          {
            label:"全为合格项才算合格",
            value:0
          },
          {
            label:"只要包含合格项即为合格",
            value:1
          }
        ],
        multipleLinesList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        selecteddataList:[
          {
            label:"合格选项",
            value:0
          },
          {
            label:"不合格选项",
            value:1
          }
        ],
        // 是否必须拍照
        mustPhotoList:[
          {
            label:"是",
            value:1
          },
          {
            label:"否",
            value:0
          }
        ],
        inputForm: {
          treeId:"",
          parentId:"",
          typeName:"", //风险类型名称
          pointName:"",  //风险点名称
          sourceName:"", //风险源名称
          itemName:"",
          required:"",
          sort:"",
          itemType:"",
          optionType:"",//选项类型
          optionRelation:"",// 选项关系 0-全合格才合格；1-只要包含合格项就合格
          photoQualifiedName:"",//合格项名称
          photoUnqualifiedName:"",//不合格项名称
          photoSelected:"",//默认选择
          optionItemList:[
            {
              optionName:"",
              qualified:"",
              selected:"",
              checkId:"",
              sort:0
            }
          ],
          numberItem:{
            decimalNum:"",// 小数点后位数
            defaultValue:"", // 默认输入值
            upperLimit:"",// 合格值上限
            lowerLimit:"",// 合格值下限
            checkId:""
          },
          textItem:{
            multipleLines:"",
            defaultValue:"",
            qualifiedName:"",
            unqualifiedName:"",
            selected:"",
            checkId:""
          },
          photoItemList:[
            {
              checkId:"",//拍照项表id
              placeName:"",
              mustPhoto:"",
              num:""
            }
          ],
          remarks:""
        },
        timeout:null
      }
    },
    watch: {
      'inputForm.numberItem.upperLimit':{
        handler() {
          if(this.inputForm.numberItem.lowerLimit != '') {
            if(Number(this.inputForm.numberItem.upperLimit) <= Number(this.inputForm.numberItem.lowerLimit)) {
              this.$message.warning('合格值上限值需大于合格值下限值')
              this.inputForm.numberItem.upperLimit = ''
            }
          }
        },
        deep:true
      },
      'inputForm.numberItem.lowerLimit':{
        handler() {
          if(this.inputForm.numberItem.upperLimit != '') {
            if(Number(this.inputForm.numberItem.upperLimit) <= Number(this.inputForm.numberItem.lowerLimit)) {
              this.$message.warning('合格值下限值需小于合格值上限值')
              this.inputForm.numberItem.lowerLimit = ''
            }
          }
        },
        deep:true
      },
      'inputForm.numberItem.defaultValue':{
        handler() {
          if(this.inputForm.numberItem.defaultValue != '') {
            if(this.timeout) clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              if(this.inputForm.numberItem.decimalNum == 0) {
                if(this.inputForm.numberItem.defaultValue.indexOf('.') != -1){
                  this.$message.warning('默认输入值不能含有小数点')
                  this.inputForm.numberItem.defaultValue = ''
                }
              }else{
                if(this.inputForm.numberItem.defaultValue.indexOf('.') == -1) {
                  this.$message.warning('默认输入值必须含有小数点')
                  this.inputForm.numberItem.defaultValue = ''
                }else {
                  if((this.inputForm.numberItem.defaultValue.length - (this.inputForm.numberItem.defaultValue.indexOf('.') + 1)) != this.inputForm.numberItem.decimalNum) {
                    this.$message.warning(`小鼠点后位数必须为${this.inputForm.numberItem.decimalNum}位`)
                    this.inputForm.numberItem.defaultValue = ''
                  }
                }
              }
            },2000)
          }
        },
        deep:true
      },
      'inputForm.numberItem.decimalNum':{
        handler() {
          this.inputForm.numberItem.defaultValue = ''
        },
        deep:true
      }
    },
    methods: {
      init(method,id,...data) {
        this.method = method
        this.inputForm.treeId = id
        this.inputForm.parentId = data[1]
        this.inputForm.typeName = data[0]
        this.inputForm.pointName = data[2]
        this.inputForm.sourceName = data[3]
        if(method == 'add') {
          this.title = '添加检查项'
          if(this.inputForm.id) {
            this.inputForm.id = ''
          }
        }else if(method == 'edit') {
          this.title = '修改检查项'
        }else if(method == 'view') {
          this.title = '检查项详情'
        }
        this.dialogVisible = true
        this.loading = false
        this.$nextTick(() => {
          this.initialization()//初始化
          if(method == 'edit' || method == 'view') {
            // 修改或查看
            this.loading = true
            this.$http({
              url:`/check/inspect/checkItem/queryByTreeid?treeId=${this.inputForm.treeId}`,
              method:"get",
            }).then(({data}) => {
              if(data && data.success) {
                // this.inputForm = this.recover(this.inputForm, data.checkItem)
                this.inputForm = Object.assign(this.inputForm,data.checkItem)
                this.loading = false
              }
            })
          }
        })
        console.log(this.inputForm)
      },
      // 添加选项
      addoption() {
        this.inputForm.optionItemList.push({
          optionName:"",
          qualified:"",
          selected:"",
          checkId:"",
          sort:""
        })
      },
      // 移除选型
      deloption(index) {
        this.inputForm.optionItemList.splice(index,1)
      },
      // 添加拍照点
      addphoto() {
        this.inputForm.photoItemList.push(
          {
            checkId:"",
            placeName:"",
            mustPhoto:"",
            num:""
          }
        )
      },
      // 移除拍照点
      delphoto(index) {
        this.inputForm.photoItemList.splice(index,1)
      },
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url:"/check/inspect/checkItem/save",
              method:"post",
              data:this.inputForm
            }).then(({data}) => {
              if(data && data.success) {
                this.dialogVisible = false;
                this.$message.success(data.msg)
                this.$emit('refreshList')
              }
              this.loading = false
            })
          }
        })
      },
      initialization() {
        this.inputForm.itemName="",
        this.inputForm.required="",
        this.inputForm.sort="",
        this.inputForm.itemType="",
        this.inputForm.optionType="",//选项类型
        this.inputForm.optionRelation="",// 选项关系 0-全合格才合格；1-只要包含合格项就合格
        this.inputForm.photoQualifiedName="",//合格项名称
        this.inputForm.photoUnqualifiedName="",//不合格项名称
        this.inputForm.photoSelected="",//默认选择
        this.inputForm.optionItemList = [
          {
            optionName:"",
            qualified:"",
            selected:"",
            checkId:"",
            sort:0
          }
        ],
        this.inputForm.numberItem = {
          decimalNum:"",// 小数点后位数
          defaultValue:"", // 默认输入值
          upperLimit:"",// 合格值上限
          lowerLimit:"",// 合格值下限
          checkId:""
        },
        this.inputForm.textItem={
          multipleLines:"",
          defaultValue:"",
          qualifiedName:"",
          unqualifiedName:"",
          selected:"",
          checkId:""
        },
        this.inputForm.photoItemList=[
          {
            checkId:"",//拍照项表id
            placeName:"",
            mustPhoto:"",
            num:""
          }
        ],
        this.inputForm.remarks = ""
      }
    },
  }
</script>
<style>
  .el-input-number__decrease, .el-input-number__increase{
    background: none!important;
  }
</style>