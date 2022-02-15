<template>
  <div>
    <basic-container>
      <component 
        v-bind:is="currentComponent" 
        :action="action"
        :topoInfo="topoInfo"
        @changeComponent="changeComponent"
      ></component>
    </basic-container>
    
  </div>
</template>

<script>
import topomapimg from "./topomapimg.vue";
import topomaptable from "./topomaptable.vue";

export default {
  components: {
    topomapimg,
    topomaptable
  },
  data() {
    return {
      currentComponent: 'topomaptable',
      action: 1,
      topoInfo: null,
    }
  },
  destroyed() {
    this.currentComponent = 'topomaptable'
  },
  methods: {
    changeComponent(data) {
      console.log(data);
      this.currentComponent = data.currentComponent
      this.action = data.action
      data.topoInfo ? this.topoInfo = data.topoInfo : null
    }
  }
}
</script>

<style>

</style>