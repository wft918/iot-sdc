<template>
  <div>
    <basic-container>
      <component 
        v-bind:is="currentComponent" 
        :systemFlag="systemFlag" 
        :siteId="siteId"
        :siteImg="siteImg"
        :siteName="siteName"
        :addressId="addressId"
        :typeId="typeId"
        :siteInfo="siteInfo"
        @changeComponent="changeComponent"
      ></component>
    </basic-container>
    
  </div>
</template>

<script>
import RoomOverview from "../monitorDomain/RoomOverview";
import RoomList from "../monitorDomain/RoomList";

export default {
  components: {
    RoomOverview,
    RoomList
  },
  data() {
    return {
      currentComponent: 'RoomOverview',
      systemFlag: '3',
      siteId: null,
      siteImg: null,
      siteName: null,
      addressId: null,
      siteInfo: null,
      typeId: null
    }
  },
  destroyed() {
    this.currentComponent = 'RoomOverview'
  },
  methods: {
    changeComponent(data) {
      console.log(data);
      this.siteId = data.roomInfo.id ? data.roomInfo.id : null
      this.siteImg = data.roomInfo.siteImg ? data.roomInfo.siteImg : null
      this.siteName = data.roomInfo.name ? data.roomInfo.name : null
      this.addressId = data.addressId ? data.addressId : null
      this.typeId = data.typeId ? data.typeId : null
      this.siteInfo = data.siteInfo ? data.siteInfo : null
      console.log(this.addressId);
      this.currentComponent = data.currentComponent
    }
  }
}
</script>

<style>

</style>