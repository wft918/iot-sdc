<template>
  <div>
    <basic-container class="fullscreen-wrapper">
      <component 
        v-bind:is="currentComponent" 
        :systemFlag="systemFlag" 
        :siteId="siteId"
        :siteImg="siteImg"
        :siteName="siteName"
        :addressId="addressId"
        :typeId="typeId"
        :isfullscreen="isfullscreen"
        @changeComponent="changeComponent"
        @toggle="toggle"
      ></component>
    </basic-container>
    
  </div>
</template>

<script>
import RoomOverview from "./RoomOverview";
import RoomList from "./RoomList";

export default {
  components: {
    RoomOverview,
    RoomList
  },
  data() {
    return {
      currentComponent: 'RoomOverview',
      systemFlag: '1',
      siteId: null,
      siteImg: null,
      siteName: null,
      addressId: null,
      typeId: null,
      isfullscreen: false
    }
  },
  created() {
    this.init()
  },
  destroyed() {
    this.currentComponent = 'RoomOverview'
  },
  methods: {
    init() {
      this.siteId = this.$route.params.siteId ? this.$route.params.siteId : null
      this.siteImg = this.$route.params.siteImg ? this.$route.params.siteImg : null
      this.siteName = this.$route.params.siteName ? this.$route.params.siteName : null
      this.addressId = this.$route.params.addressId ? this.$route.params.addressId : null
      this.typeId = this.$route.params.typeId ? this.$route.params.typeId : null
      this.currentComponent = this.$route.params.currentComponent ? this.$route.params.currentComponent : 'RoomOverview'
    },
    changeComponent(data) {
      this.siteId = data.roomInfo.id ? data.roomInfo.id : null
      this.siteImg = data.roomInfo.siteImg ? data.roomInfo.siteImg : null
      this.siteName = data.roomInfo.name ? data.roomInfo.name : null
      this.addressId = data.addressId ? data.addressId : null
      this.typeId = data.typeId ? data.typeId : null
      this.currentComponent = data.currentComponent
    },
    async toggle() {
      await this.$fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
        teleport: false,
        callback: (isFullscreen) => {
          this.isfullscreen = this.$fullscreen.isFullscreen
        },
      })
      // 唤起全屏的动作是异步的,在调用方法后无法立即获取预期的结果
      // this.isfullscreen = this.$fullscreen.isFullscreen
    },
  }
}
</script>

<style>

</style>