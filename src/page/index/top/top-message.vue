<template>
  <div>
    <el-badge :value="msgList.length" :max="99" :hidden="msgList.length === 0">
      <el-popover
        placement="bottom"
        width="260"
        transition="el-zoom-in-top"
        trigger="click">
         <el-tabs 
          class="msg-tabs" 
          v-model="activeName" 
          @tab-click="handleTabClick"
          stretch>
          <el-tab-pane label="通知消息" name="first">
            <div class="msg-abstract" v-for="item in subMsgList" :key="item.id">
              <el-row class="msg-title">
                <div @click="showMsgDetail(item)">{{item.title}}</div>
              </el-row>
              <el-row class="msg-date">
                <el-col :span="24">{{item.createDate}}</el-col>
              </el-row>
            </div>
            <el-button plain @click="toMsgCenter">查看更多</el-button>
          </el-tab-pane>
        </el-tabs>
        <i class="el-icon-message-solid" slot="reference"></i>
      </el-popover>
    </el-badge>
    <msg-content ref="msgContentRef" :contentType="type"></msg-content>
  </div>  
</template>

<script>
import moment from "moment";
import MsgContent from "@/components/msgContent/MsgContent";
import { getMyMessage, setMessageRead } from "@/api/admin/message";
import { mapState, mapGetters } from 'vuex';
export default {
  components: {
    MsgContent
  },
  data() {
    return {
      activeName: 'first',
      type: 'notice',
      msgList: [],
      queryCondition: {
        current: 1,
        size: 100,
        readFlag: '0',
        descs: 'create_date'
      }      
    }
  },
  
  computed: {
    subMsgList() {
      return this.msgList.length > 3 ? this.msgList.slice(0, 3) : this.msgList
    },
    ...mapState({
      newMsg: state => state.common.newMsg
    }),
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    newMsg(newVal, oldVal) {
      if (newVal) {
        this._getMyMessage(this.queryCondition)
      }
    }
  },
  created() {
    // 获取未读消息列表
    this.setQueryCondition()
    this._getMyMessage(this.queryCondition)
  },
  methods: {
    _getMyMessage(params) {
      console.log(this.userInfo, '用户信息');
      getMyMessage(params).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data
          this.msgList = data.records
          // if (res.data.code === 0) {
          //   data.records.sort(function(a, b) {
          //     let aCreateDate = new Date(a.createDate).getTime(), 
          //         bcreateDate = new Date(b.createDate).getTime()
          //     return bcreateDate - aCreateDate
          //   })
            
          // }
        }
      })
    },
    handleTabClick(tab, event) {
      console.log(tab, event);
    },
    showMsgDetail(val) {
      let dataObj = {}
      dataObj.id = val.id
      this.$refs.msgContentRef.getContent(val.id, this.type)
      setMessageRead(dataObj).then(res => {
          if (res.data.code === 0) {
            this._getMyMessage(this.queryCondition)
          }
        })
    },
    toMsgCenter() {
      if (this.$route.path !== '/admin/message/index') {
        this.$router.push({ path: '/admin/message/index' })
      }     
    },
    setQueryCondition() {
      this.queryCondition.userId = this.userInfo.userId
    }
  }
}
</script>

<style lang="scss" scoped>
  .msg-tabs {
    .el-button--medium {
    width: 100%;
    }
    .msg-abstract {
      padding: 10px 10px 5px 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid #dedede;
      .msg-title {
        font-size: 16px;
        margin-bottom: 10px;
        color: #409EFF;
        cursor: pointer;
      }
    }
  } 
</style>