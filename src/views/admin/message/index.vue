<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="6" :offset="1">
          <span>标题：</span>
          <el-input placeholder="请输入标题" v-model="searchTitle" clearable style="width: 80%"></el-input>
        </el-col>
        <el-col :span="4">
          <span>状态：</span>
          <el-select v-model="searchReadFlag" style="width:60%">
              <el-option
                v-for="item in this.$dictUtils.getDictList('ann_read_status')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-col>
        <el-col :span="6" :offset="1">
            <el-button type="primary" @click="queryInfoClick">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-delete"></i> 重置
            </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableInfo"
            border
            style="margin:0.75rem 0"
          >
            <el-table-column 
              type="index"
              label="序号"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column 
              label="消息标题"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.title" placement="top">
                  <span>{{scope.row.title.slice(0, 15)}}</span>
                </el-tooltip>           
              </template>
            </el-table-column>
            <el-table-column
              prop="createBy"
              label="发布人"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="createDate"
              label="消息时间"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column
              :formatter="readFlag"
              label="查看状态"
              align="center"
            ></el-table-column>
            <el-table-column 
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <span class="table-action" @click="tableAction(scope.row, 1)">查看</span>
                <span class="table-action" @click="tableAction(scope.row, 2)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
        </el-col>
      </el-row>
      <!-- 公告内容对话框 -->
      <msg-content ref="msgContentRef" :contentType="type"></msg-content>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import MsgContent from "@/components/msgContent/MsgContent";
import { getMyMessage, setMessageRead, deleteMessageById } from "@/api/admin/message";
export default {
  components: {
    Pagination,
    MsgContent
  },
  data() {
    return {
      // 分页相关
      pageKey: Math.random().toString(36).slice(-6),
      page:1,
      size: 10,
      total: 0,
      // 查询条件
      searchTitle: '',
      searchReadFlag: '',
      dueDate: '',
      queryCondition: {
        current: 1,
        size: 10,
        descs: 'create_date'
      },
      tableInfo: [],
      type: 'notice'
    }
  },
  created() {
    this._getMyMessage(this.queryCondition)
  },
  methods: {
    /**
     * 网络请求
     */
    _getMyMessage(params) {
      getMyMessage(params).then(res => {
        console.log(res, '消息列表');
        if (res.data.code === 0) {
          let data = res.data.data
          if (res.data.code === 0) {
            this.tableInfo = data.records
            this.total = data.total
            this.page = data.current
          }
        }
      })
    },
    /**
     * 方法
     */ 
    setQueryCondition() {
      this.queryCondition = {
        current:this.page,
        size: this.size,
        descs: 'create_date'
      }
      this.searchTitle ? this.queryCondition.title = this.searchTitle : null
      this.searchReadFlag ? this.queryCondition.readFlag = this.searchReadFlag : null
    },   
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this._getMyMessage(this.queryCondition)
    },
    queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this._getMyMessage(this.queryCondition)
    },
    clearCondition() {
      this.searchReadFlag = ''
      this.searchTitle = ''
      this.setQueryCondition()
      this._getMyMessage(this.queryCondition)
    },
    tableAction(data, type) {
      let dataObj = {}
      dataObj.id = data.id
      if (type === 1) {
        // 查看
        this.$refs.msgContentRef.getContent(data.id, 'notice')
        if (data.readFlag === '0') {
          setMessageRead(dataObj).then(res => {
            if (res.data.code === 0) {
              this.$store.commit('UNSHIFT_NEWMSG', data)
              this._getMyMessage(this.queryCondition)
            }
          })
        }
      } 
      if (type === 2) {
        // 删除
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMessageById(data.id).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this._getMyMessage(this.queryCondition)
            }
          })
        }).catch(() => {})
      }      
    },
    // 获取数据词典值
    readFlag(val) {
      let readFlagMap = this.$dictUtils.getDictList('ann_read_status'),
          text = ''
      for (let index = 0; index < readFlagMap.length; index++) {
        const el = readFlagMap[index];
        if (el.value === val.readFlag) {
          text = el.label
          break;
        }
      }
      return text
    }
  }
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-top: 20px;
}
.box-card {
  .header-title {
    margin: 10px;
    font-size: 18px;
  }
  .header-info {
    margin-left: 10px;
    span {
      margin-right: 5px;
    }
  }
  .ad-msgContent {
    margin-left: 10px;
    font-size: 16px;
  }
}
</style>