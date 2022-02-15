<template>
  <div class="lsd-container" >
    <el-dialog :visible.sync="dialogVisible" v-dialogDrag ref="lsd">
      <HeaderNavBar></HeaderNavBar>
      <AppMain></AppMain>
    </el-dialog>
  </div>
</template>

<script>
//导入全屏模块
import { fullscreenToggel} from '@/util/util'
import HeaderNavBar from './components/HeaderNavBar'
import AppMain from "./components/AppMain"
import eventBus from "@/util/eventBus";

export default {
  name: 'layout',
  components: {
    HeaderNavBar,
    AppMain
  },
  data() {
    return {
      dialogVisible: true,
    }
  },
  mounted() {
    this.handleScreen()
    eventBus.$on('closeLsd',(res) => {
        this.dialogVisible = false
        this.handleScreen()
      })
  },
  methods: {
    handleScreen() {
      fullscreenToggel()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
