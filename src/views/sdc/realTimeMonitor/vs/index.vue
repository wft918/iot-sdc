<template>
  <div>
    <basic-container>
      视频监控
      <component v-bind:is="currentComponent" :systemFlag="systemFlag" @changeComponent="changeComponent"></component>
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
      currentComponent: 'RoomList',
      systemFlag: '8'
    }
  },
  methods: {
    changeComponent(data) {
      this.currentComponent = data.currentComponent
    }
  }
}
</script>

<style>

</style>