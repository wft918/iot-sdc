<template>
    <div ref="rmiframeRef" style="width:100%;height:100vh;" class="rmiframe-container">
      <el-dialog :visible.sync="dialogVisible" v-dialogDrag ref="lsd" @close="dialogClose">
        <iframe id="rmiframe" ref="iframe" name="rmiframe3D" :src="iframeUrl" style="width:100%;height:100%;" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
         <div class="rmiframe-close-btn" @click="exitRmIframe">
          <el-tooltip effect="dark" content="退出" placement="bottom">
            <i class="el-icon-switch-button"></i>
          </el-tooltip>
        </div>
      </el-dialog>
     
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      dialogVisible: true,
      iframeUrl: this.$dictUtils.getDictValue('robot_iframe_url','robot_iframe_url', '')
    }
  },
  created() {
  },
  mounted() {
  },
  activated() {
    
  },
  deactivated() {
  },
  beforeDestroy() {
  },
  computed: {
      ...mapGetters(['tagWel','tagList'])
    },
  methods: {
    exitRmIframe() {
      this.dialogVisible = false
      this.dialogClose()
    },
    dialogClose() {
      this.$refs.rmiframeRef.innerHTML = ''
      let currentTagIndex = this.tagList.length - 1
      this.$store.commit('DEL_TAG', this.tagList[currentTagIndex])
      if (this.tagList.length === 0) {
        this.closeAllTags()
      } else {
        this.openTag(this.tagList[currentTagIndex - 1])
      }
    },
    openTag(item) {
        let tag
        if (item.name) {
          tag = this.findTag(item.name).tag
        } else {
          tag = item
        }
        this.$router.push({
          path: this.$router.$avueRouter.getPath({
            name: tag.label,
            src: tag.value
          }),
          query: tag.query
        }).catch(() => {})
    },
    closeAllTags() {
      clearInterval(this.$store.state.user.realTimer)
      this.contextmenuFlag = false
      this.$store.commit('DEL_ALL_TAG')
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      })
    },
    findTag(value) {
      let tag, key
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item
          key = index
        }
      })
      return { tag: tag, key: key }
    },
  }
}
</script>

<style lang="scss">
.rmiframe-container {
  // background-image: url('../img/lsdbg.jpg');
  background-size: 100% 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  .container-header {
    width: 100%;
    height: 10%;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    // background: url('../assets/img/header1.png');
    // background-position: center;
    // background-size: 100% 100%;
    background-position: inherit;
    background-size: 100% 230%;
  }
  .container-body {
    width: 100%;
    height: 90%;
  }


  .el-dialog__wrapper {
    background-size: 1920px 1080px;
    box-shadow: 0 0 3px blue;
  }

  .el-dialog {
    //background-image: url('../assets/img/lsdbg.jpg');
    background-color: #FFF;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    width: 1920px;
    height: 1080px;
    // left: 956.638px;
    // top: 0px;
    max-width: 100%;
    max-height: 100%;
    margin: 0px !important;;
  }

  .el-dialog__header{
    border: 0;
    height: 0;
    padding: 0;
      
    i {
      visibility: hidden;
    }
  }
  .el-dialog__body{
    padding: 0;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }
  

}
.rmiframe-close-btn {
  position: absolute;
  right: 50%;
  top: 10px;
  font-size: 30px;
  cursor: pointer;
  color:#000;
  z-index: 999;
}
.rmiframe-close-btn:hover {
  color:#F56C6C;
}
</style>