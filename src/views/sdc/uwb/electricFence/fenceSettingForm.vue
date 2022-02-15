<template>
<div class="fenceSettingFormClass">
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag  :show-close='false'
    :visible.sync="visible">
    <div class="bodyClass" style="position: relative;">
      <!-- <div v-if="this.typeNow=='view'" style="width:100%;height:100%;position: absolute;z-index: 10;"></div> -->
      <div class="itemClass">
        <div class="titleClass">围栏名称：</div>
        <el-input size="small"  style="width:90%;"  :disabled="this.typeNow==='view'?true:false" v-model="fenceName" placeholder="请输入名称"></el-input>
      </div>
      <div class="itemClass" style="margin-top:10px;">
        <!-- <div class="titleClass">围栏类型：</div>
        <el-select size="small" style="width:40%;" v-model="typeData" placeholder="请选择区域">
          <el-option
            v-for="item in $dictUtils.getDictList('fence_type')" 
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <div class="titleClass">管控规则：</div>
        <el-select size="small"  style="width:40%;" v-model="ruleData" placeholder="请选择区域" :disabled="this.typeNow==='view'?true:false">
          <el-option 
            v-for="item in $dictUtils.getDictList('rule_type')" 
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="itemClass" style="margin-top:10px;" >
        <div class="titleClass">生效时间：</div>
        <el-time-picker  :disabled="this.typeNow==='view'?true:false"
          is-range size="small" style="width:90%;"
          v-model="timeData"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </div>
       <div class="itemClass" style="margin-top:8px;">
        <div class="titleClass"></div>
        <el-checkbox  :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="this.typeNow==='view'?true:false">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedDates" @change="handleCheckedCitiesChange" :disabled="this.typeNow==='view'?true:false">
          <el-checkbox  v-for="dateData in dates" :label="dateData" :key="dateData" >{{dateData}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="itemClass" style="margin-top:10px;">
        <div class="titleClass">报警：</div>
        <el-switch :disabled="this.typeNow==='view'?true:false"
          v-model="ifAlert"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </div>
      <div class="itemClass" style="margin-top:15px;">
        <div class="titleClass" style="margin-top:-150px;">绑定摄像头：</div>
        <el-table  ref="fenceSettingFormTable" 
          :data="cameraData"
          border height="220"
          style="width: 90%" @selection-change="handleSelectionChange">
          <el-table-column  :selectable="checkSelectable"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column 
            prop="name"
            show-overflow-tooltip
            sortable="custom"
            label="设备名称">
          </el-table-column>
          <el-table-column
            prop="code"
            show-overflow-tooltip
            sortable="custom"
            label="编号">
          </el-table-column>
          <!-- <el-table-column width="150"
            prop="type"
            show-overflow-tooltip
            sortable="custom"
            label="设备类型">
            <template slot-scope="scope">
                  {{ $dictUtils.getDictLabel("camera_type", scope.row.type, '-') }}
            </template>
          </el-table-column>
          <el-table-column width="150"
              prop="mcode"
              show-overflow-tooltip
              sortable="custom"
              label="设备厂商">
              <template slot-scope="scope">
                    {{ $dictUtils.getDictLabel("camera_brand", scope.row.mcode, '-') }}
              </template>
            </el-table-column> -->
          <el-table-column width="150"
              prop="ip"
              show-overflow-tooltip
              sortable="custom"
              label="IP地址">
            </el-table-column>
        </el-table>
      </div>
      <div class="itemClass" style="margin-top:15px;">
        <div class="titleClass">作用对象：</div>
        <el-radio-group v-model="targetRadio" style="width: 90%" :disabled="this.typeNow==='view'?true:false">
          <el-radio v-for="(item, index) in $dictUtils.getDictList('alart_target_type')" :key="index" :label="item.value" >{{item.label}}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="itemClass" style="margin-top:10px;">
        <div class="titleClass"></div>
        <el-table v-if="targetRadio=='1'"
          :data="roleList" ref="fenceSettingFormRoleTable"
          border height="220"
          style="width: 90%" @selection-change="handleSelectionChangeRole">
          <el-table-column :selectable="checkSelectable" 
            type="selection"
            width="55">
          </el-table-column>
         <el-table-column
            prop="roleName"
            min-width="150px"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            min-width="150px"
            label="角色描述">
          </el-table-column>
        </el-table>
        <el-table v-else-if="targetRadio=='2'"
          :data="userList" ref="fenceSettingFormUserTable"
          border height="220" 
          style="width: 90%" @selection-change="handleSelectionChangeUser">
          <el-table-column :selectable="checkSelectable" 
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="username"
            min-width="100"
            show-overflow-tooltip
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="phone"
            min-width="120"
            show-overflow-tooltip
            label="电话">
          </el-table-column>
          <el-table-column
            prop="lockFlag"
            label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.lockFlag === '9'" size="small" type="success">禁用</el-tag>
              <el-tag v-else-if="scope.row.lockFlag === '0'" size="small" type="danger">有效</el-tag>
            </template>
          </el-table-column>
        </el-table>
         <el-table v-else-if="targetRadio=='3'"
          :data="officeList" ref="fenceSettingFormOfficeTable"
          border height="220"
          style="width: 90%" @selection-change="handleSelectionChangeOffice">
          <el-table-column 
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="名称">
          </el-table-column>
          <el-table-column
            prop="useable"
            label="是否可用">
            <template slot-scope="scope">
              <el-tag :type="scope.row.useable == '0' ? 'danger' : 'success'">
                {{ scope.row.useable == '0' ? '否' : '是' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFun">取消</el-button>
      <el-button type="primary" v-if="this.typeNow != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
  const dateOptions = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        fenceName:'',
        //类型
        typeData:'0',
        //管控规则
        ruleData:'0',
        timeData: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        checkAll: false,
        checkedDates: ['星期一', '星期二'],
        dates: dateOptions,
        isIndeterminate: true,
        cameraData: [],
        targetRadio: '0',
        roleList:[],
        userList:[],
        officeList:[],
        tempOfficeName:new Array(),
        ifAlert:true,
        mapId:0,
        cameraChooseList:[],
        roleChooseList:[],
        userChooseList:[],
        officeChooseList:[],
        xList:'',
        yList:'',
        roofPoints:[],
        fenceId:0,
        typeNow:'add'
      }
    },
    components: {
    },
    mounted(){
      this.getRoleData()
      this.getUserData()
      this.getOfficeData()
    },
    methods: {
      checkSelectable(){ 
        return this.typeNow !='view'
      },
      handleCheckAllChange(val) {
        this.checkedDates = val ? dateOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.dates.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dates.length;
      },
      //勾选摄像机
      handleSelectionChange(val) {
        this.cameraChooseList = []
        val.forEach(item=>{
          let temp = {'ipcId':item.id}
          this.cameraChooseList.push(temp)
        })
      },
      //勾选角色
      handleSelectionChangeRole(val){
        this.roleChooseList = []
        val.forEach(item=>{
          let temp = {'alartTargetId':item.roleId}
          this.roleChooseList.push(temp)
        })
      },
      //勾选用户
      handleSelectionChangeUser(val){
        this.userChooseList = []
        val.forEach(item=>{
          let temp = {'alartTargetId':item.userId}
          this.userChooseList.push(temp)
        })
      },
      //勾选部门
      handleSelectionChangeOffice(val){
        this.officeChooseList = []
        val.forEach(item=>{
          let temp = {'alartTargetId':item.id}
          this.officeChooseList.push(temp)
        })
      },
      //关闭触发刷新数据
      closeFun(){
        this.$nextTick(() => {
          this.$refs.fenceSettingFormTable.clearSelection();
          switch(this.targetRadio){
              case '1'://角色
                this.$refs.fenceSettingFormRoleTable.clearSelection();
                break;
              case '2'://用户
                this.$refs.fenceSettingFormUserTable.clearSelection();
                break;
              case '3'://部门 officeList
                this.$refs.fenceSettingFormOfficeTable.clearSelection();
                break;
            }
        });
        this.visible = false
        // this.$emit('refreshList');
      },
      initData(mapId,xList,yList,roofPoints){
        this.roofPoints = roofPoints
        this.xList = xList
        this.yList = yList
        this.mapId = mapId
        this.visible = true
        this.initDefaultData()
        this.title = `新建电子围栏信息`
        this.$http({
          url: '/site-sdc/sdcdevice/page',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 50000,
            'orderBy': '',
            'siteId':mapId,
            'videoType': '1'
          }
        }).then(({data}) => {
          if (data && data.code == 0) {
            this.cameraData = data.data.records;
          }
        })
      },
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建电子围栏信息`
        } else if (method === 'edit') {
          this.title = '修改电子围栏信息'
        } else if (method === 'view') {
          this.title = '查看电子围栏信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/uwb/ips/uwbelectronicfence/uwbElectronicFence/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.uwbElectronicFence)
              this.loading = false
            })
          }
        })
      },
      listInit(method, row){
        this.visible = true
        this.initDefaultData()
        this.typeNow = method
        if (method === 'add') {
          this.title = `新建电子围栏信息`
        } else if (method === 'edit') {
          this.title = '修改电子围栏信息'
        } else if (method === 'view') {
          this.title = '查看电子围栏信息'
        }
        console.log('row',row);
        this.fenceId = row.id
        this.fenceName = row.fenceName
        this.typeData = row.fenceType
        this.ruleData = row.ruleType
        let startTime = row.startTime.split(':')
        let endTime = row.endTime.split(':')
        this.timeData = [new Date(2016, 9, 10,parseInt(startTime[0]),parseInt(startTime[1]),parseInt(startTime[2])),
        new Date(2016, 9, 10,parseInt(endTime[0]),parseInt(endTime[1]),parseInt(endTime[2]))]
        this.checkedDates = row.enableWeeks.split(',')
        this.targetRadio = row.alartTargetType
        
        this.xList = row.coordinateXlist
        this.yList = row.coordinateYlist
        this.ifAlert = row.isopen=='0'
        this.mapId = row.areaId;

        //绑定摄像头
        let cameraChooseList = []
        this.cameraData = []
        row.uwbIpcFences.forEach(item=>{
          cameraChooseList.push(item.ipcId)
        })
        this.$http({
          url: '/site-sdc/sdcdevice/page',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 50000,
            'orderBy': '',
            'siteId':row.areaId,
            'videoType': '1'
          }
        }).then(({data}) => {
          if (data && data.code == 0) {
            this.cameraData = data.data.records;
            this.$nextTick(() => {
              this.cameraData.forEach(item=>{
                if(cameraChooseList.indexOf(item.id)>-1){
                  this.$refs.fenceSettingFormTable.toggleRowSelection(item);
                }
              })
            });
          }
        })
        
        //作用对象列表
        this.$http({
          url: '/uwb/ips/uwbelectronicfence/uwbElectronicFence/getFenceTargetList',
          method: 'get',
          params: {
            'id': row.id,
          }
        }).then(({data}) => {
          if (data && data.success) {
            let alartTargetIdList = []
            
            switch(row.alartTargetType){
              case '1'://角色
                data.data.list.forEach(item=>{
                  alartTargetIdList.push(item)
                })
                this.$nextTick(() => {
                  this.roleList.forEach(item=>{
                    if(alartTargetIdList.indexOf(item.roleId  + "")>-1){
                      this.$refs.fenceSettingFormRoleTable.toggleRowSelection(item);
                    }
                  })
                });
                this.roleChooseList = alartTargetIdList
                break;
              case '2'://用户
                data.data.list.forEach(item=>{
                  alartTargetIdList.push(item)
                })
                this.$nextTick(() => {
                  this.userList.forEach(item=>{
                    if(alartTargetIdList.indexOf(item.userId + "")>-1){
                      this.$refs.fenceSettingFormUserTable.toggleRowSelection(item);
                    }
                  })
                });
                this.userChooseList = alartTargetIdList
                break;
              case '3'://部门 officeList
                data.data.list.forEach(item=>{
                  alartTargetIdList.push(item)
                })
                this.$nextTick(() => {
                  this.officeList.forEach(item=>{
                    if(alartTargetIdList.indexOf(item.deptId + "")>-1){
                      this.$refs.fenceSettingFormOfficeTable.toggleRowSelection(item);
                    }
                  })
                });
                this.officeChooseList = alartTargetIdList
                break;
            }
          }
        })
      },
      //初始化默认数据
      initDefaultData(){
        this.fenceName = ''
        this.typeData = '0'
        this.ruleData = '0'
        this.timeData = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
        this.checkedDates = ['星期一', '星期二']
        this.targetRadio = '0'
        this.ifAlert = true 
        this.cameraData = []
      },
      // 表单提交
      doSubmit () {
        let alartTargetIdList = []
        switch(this.targetRadio){
          case '1'://角色
            alartTargetIdList = this.roleChooseList
            break;
          case '2'://用户
            alartTargetIdList = this.userChooseList
            break;
          case '3'://部门
            alartTargetIdList = this.officeChooseList
            break;
        }
        let startTime = (this.timeData[0].getHours()<10?('0'+this.timeData[0].getHours()):this.timeData[0].getHours()) 
        + ':' + (this.timeData[0].getMinutes()<10?('0'+this.timeData[0].getMinutes()):this.timeData[0].getMinutes()) 
        + ':' + (this.timeData[0].getSeconds()<10?('0'+this.timeData[0].getSeconds()):this.timeData[0].getSeconds());
        let endTime = (this.timeData[1].getHours()<10?('0'+this.timeData[1].getHours()):this.timeData[1].getHours()) 
        + ':' + (this.timeData[1].getMinutes()<10?('0'+this.timeData[1].getMinutes()):this.timeData[1].getMinutes()) 
        + ':' + (this.timeData[1].getSeconds()<10?('0'+this.timeData[1].getSeconds()):this.timeData[1].getSeconds());
        let enableWeeks = ''
        this.checkedDates.forEach(item=>{
          enableWeeks = enableWeeks==''?item:(enableWeeks+','+item)
        })
        let dataForm = {
          'areaId':this.mapId,// 区域id
          'coordinateXlist':this.xList,// x坐标集合
          'coordinateYlist':this.yList,// y坐标集合
          'enableWeeks':enableWeeks,// 生效时间-星期
          'startTime':startTime,// 开始生效时间
          'endTime':endTime,// 结束生效时间
          'fenceName':this.fenceName,// 围栏名称
          'fenceType':this.typeData,// 围栏类型
          'isopen':this.ifAlert?'0':'1',// 是否报警
          'ruleType':this.ruleData,// 管控规则
          'uwbIpcFences':this.cameraChooseList,// 摄像头(id)
          'alartTargetType':this.targetRadio,// 告警作用对象
          'alartTargetIdList':alartTargetIdList,// 告警作用列表(id)
          'polygonShowPoints':JSON.stringify(this.roofPoints)//展示所用点数组 暂时无用
        }
        if(this.fenceId!=0){
          dataForm = {
            'id':this.fenceId,
            'areaId':this.mapId,// 区域id
            'coordinateXlist':this.xList,// x坐标集合
            'coordinateYlist':this.yList,// y坐标集合
            'enableWeeks':enableWeeks,// 生效时间-星期
            'startTime':startTime,// 开始生效时间
            'endTime':endTime,// 结束生效时间
            'fenceName':this.fenceName,// 围栏名称
            'fenceType':this.typeData,// 围栏类型
            'isopen':this.ifAlert?'0':'1',// 是否报警
            'ruleType':this.ruleData,// 管控规则
            'uwbIpcFences':this.cameraChooseList,// 摄像头(id)
            'alartTargetType':this.targetRadio,// 告警作用对象
            'alartTargetIdList':alartTargetIdList,// 告警作用列表(id)
            'polygonShowPoints':JSON.stringify(this.roofPoints)//展示所用点数组 暂时无用
          }
        }
        this.$http({
          url: `/uwb/ips/uwbelectronicfence/uwbElectronicFence/save`,
          method: 'post',
          data: dataForm
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.$emit('refreshList')
          }
          this.$nextTick(() => {
            this.$refs.fenceSettingFormTable.clearSelection();
            switch(this.targetRadio){
                case '1'://角色
                  this.$refs.fenceSettingFormRoleTable.clearSelection();
                  break;
                case '2'://用户
                  this.$refs.fenceSettingFormUserTable.clearSelection();
                  break;
                case '3'://部门 officeList
                  this.$refs.fenceSettingFormOfficeTable.clearSelection();
                  break;
              }
          });
          this.visible = false
        })
      },
      //获取全部角色
      getRoleData(){
        this.$http({
          url: '/admin/role/list',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 50000,
          }
        }).then(({data}) => {
          if (data && data.data) {
            this.roleList = data.data
          }
        })
      },
      //获取全部用户
      getUserData(){
        this.$http({
          url: '/admin/user/page',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 50000,
            'orderBy': '',
          }
        }).then(({data}) => {
          if (data && data.data) {
            this.userList = data.data.records
          }
        })
      },
      //获取全部部门数据
      getOfficeData(){
        // this.tempOfficeName = new Array()
        // this.$http({
        // url: '/admin/dept/page',
        // method: 'get',
        // params: {
        //   'pageNo': 1,
        //   'pageSize': 50000,
        //   'orderBy': '',
        //   }
        // }).then(({data}) => {
        //   if (data && data.data) {
        //     data.data.data.forEach(item => {
        //       if(item.type!='2'){
        //         this.tempOfficeName[item.id] = item.name
        //       }
        //     });
        //     data.data.data.forEach(item => {
        //       if(item.type=='2'){
        //         let ids = item.parentIds.split(',')
        //         let tempName = ''
        //         ids.forEach(id =>{
        //           if(id!=0&&id!='0'&&id!=''&&id!=null){
        //             tempName =  tempName==''?(this.tempOfficeName[id]):(tempName+'-'+this.tempOfficeName[id])
        //           }
        //         })
        //         item.name = tempName==''?item.name:(tempName+'-'+item.name)
        //         this.officeList.push(item)
        //       }
        //     });
        //     console.log('执行完')
        //   }
        // })
      }
    }
  }
</script>
<style lang="scss">
.fenceSettingFormClass{
  .bodyClass{
    // align-items: center; /*  子元素相对父元素垂直居中 */
    // display:flex;
    width: 100%;
  }
  .itemClass{
    width: 100%;
    flex-direction: row;  /* 子元素横向排列 */
    /*justify-content: center;  相对父元素水平居中 */
    align-items: center; /*  子元素相对父元素垂直居中 */
    display:flex;
  }

  .titleClass{
    width: 10%;
    display:flex;
    justify-content: center;
  }

  .el-checkbox:last-of-type{
    margin-right: 30px;
  }
}
</style>