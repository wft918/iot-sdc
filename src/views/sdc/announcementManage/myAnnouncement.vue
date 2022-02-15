<template>
  <div>
    <basic-container>
      <el-row :gutter="15">
        <el-col :span="6" :offset="1">
          <span>标题：</span>
          <el-input placeholder="请输入标题" v-model="searchTitle" clearable style="width: 80%"></el-input>
        </el-col>
        <el-col :span="4">
          <span>发布人：</span>
          <el-input placeholder="请输入发布人" v-model="searchSender" clearable style="width: 70%"></el-input>
        </el-col>
        <el-col :span="6" :offset="1">
            <el-button type="primary" @click="queryInfoClick">
              <i class="el-icon-search"></i> 查询
            </el-button>
            <el-button type="primary" @click="clearCondition">
              <i class="el-icon-refresh"></i> 重置
            </el-button>
        </el-col>
      </el-row>
      <el-row class="announcement-list">
        <el-col class="announcement-item" :span="24" v-for="item in tableInfo" :key="item.id"> 
          <div>
            <span class="item-title" @click="tableAction(item)">{{item.expand.announcementTitle | ellipsis(45)}}</span>
            <span class="item-author">{{item.createBy}}</span>
            <span class="item-date">{{item.createDate}}</span>
            <el-button class="item-button" type="text" @click="tableAction(item)">详情<i class="el-icon-d-arrow-right el-icon--right"></i></el-button>
          </div>
          <!-- <div>
            <span>{{item.createBy}}</span>
            <span>{{item.createDate}}</span>
          </div> -->
          
        </el-col>
      </el-row>
      <Pagination :page="page" :size="size" :total="total" :key="pageKey" @pagination="queryByPage"></Pagination>
      <!-- 公告内容对话框 -->
      <msg-content ref="msgContentRef" :contentType="type"></msg-content>
    </basic-container>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import MsgContent from "@/components/msgContent/MsgContent";
import { getMyAnnouncement, getAnnouncementById, setAnnouncementRead } from "@/api/sdc/announcementManage";
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
      searchSender: '',
      dueDate: '',
      queryCondition: {
        current: 1,
        size: 10,
        msgCategory: '1'
      },
      tableInfo: [],
      type: 'annt'
    }
  },
  created() {
    this._getMyAnnouncement(this.queryCondition)
  },
  methods: {
    /**
     * 网络请求
     */
    _getMyAnnouncement(params) {
      getMyAnnouncement(params).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data
          if (res.data.code === 0) {
            this.tableInfo = data.records
            console.log(data);
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
        current:1,
        size: this.size
      }
      this.searchTitle ? this.queryCondition['expand.announcementTitle'] = this.searchTitle : null
      this.searchSender ? this.queryCondition.createBy = this.searchSender : null
    },   
    queryInfoClick() {
      this.setQueryCondition()
      this.queryCondition.current = 1
      this._getMyAnnouncement(this.queryCondition)
    },
    queryByPage(data) {
      this.page = data.page
      this.size = data.size
      this.queryCondition.current = this.page
      this.queryCondition.size = this.size
      this._getMyAnnouncement(this.queryCondition)
    },
    clearCondition() {
      this.searchSender = ''
      this.searchTitle = ''
      this.dueDate = ''
      this.setQueryCondition()
      this._getMyAnnouncement(this.queryCondition)
    },
    tableAction(data) {
      let dataObj = {}
      dataObj.id = data.id
      this.$refs.msgContentRef.getContent(data.anntId, 'annt')
      if (data.readFlag === '0') {
        setAnnouncementRead(dataObj).then(res => {
          if (res.data.code === 0) {
            this._getMyAnnouncement(this.queryCondition)
          }
        })
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
.announcement-list {
  margin:30px 100px;
  .announcement-item {
    border-bottom: 1px dashed #eee;
    .item-title {
    margin-right: 40px;
    color: #333;
    cursor: pointer;
  }
  .item-title:hover {
    color: #409EFF;
  }
  .item-author {
    margin-right: 15px;
    color: #999;
  }
  .item-date {
    color: #999;
  }
  .item-button {
    margin-left: 8px;
  }
  }
  
}
</style>