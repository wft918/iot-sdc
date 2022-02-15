<template>
  <el-dialog
    title="详情"
    :visible.sync="contentDialogVisible"
    width="40%"
    center>
    <el-card class="box-card">
      <div slot="header">
        <div class="header-title">
          <span>{{msgDetail.title}}</span>
        </div>
        <div class="header-info" v-if="contentType === 'annt'">
          <span>发布人：{{msgDetail.sender}}</span>
          <span>发布时间：{{msgDetail.sendTime}}</span>
        </div>
        <div class="header-info" v-if="contentType === 'notice'">
          <span>发布人：{{msgDetail.createBy}}</span>
          <span>消息时间：{{msgDetail.createDate}}</span>
        </div>          
      </div>
      <div class="ad-msgContent" v-if="contentType === 'annt'">
        <div v-html="msgDetail.msgContent" class="ql-editor">
        </div>        
      </div>
      <div class="ad-msgContent" v-if="contentType === 'notice'">
        <div v-html="msgDetail.content" class="ql-editor">
        </div>        
      </div>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="contentDialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { getAnnouncementById } from "@/api/sdc/announcementManage";
import { getMessageById } from "@/api/admin/message";
export default {
  props: {
    contentType: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      contentDialogVisible: false,
      msgDetail: {}
    }
  },
  created() {
    
  },
  methods: {
    getContent(msgId, type) {
      if (type === 'annt') {
        getAnnouncementById(msgId).then(res => {
          if (res.data.code === 0) {
            this.msgDetail = res.data.data[0]
            this.contentDialogVisible = true
          }
        })
      }
      if (type === 'notice') {
        getMessageById(msgId).then(res => {
          if (res.data.code === 0) {
            this.msgDetail = res.data.data[0]
            this.contentDialogVisible = true
          }
        })
      }
    }     
  }
}
</script>

<style lang="scss" scoped>
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