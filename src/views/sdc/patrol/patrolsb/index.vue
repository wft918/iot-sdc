<template>
  <div>
    <basic-container>
      
      <component 
        v-bind:is="currentComponent" 
        :patrolData="patrolData"
        @changeComponent="changeComponent"
      ></component>
    </basic-container>
    
  </div>
</template>

<script>
import patrolDetail from "./patrolDetail.vue";
import patrolInfo from "./patrolInfo.vue";


export default {
  components: {
    patrolInfo,
    patrolDetail,
  },
  data() {
    return {
      currentComponent: 'patrolInfo',
      patrolData: null
    }
  },
  beforeDestroy() {
    this.currentComponent = 'patrolInfo'
  },
  methods: {
    changeComponent(data) {
      console.log(data);
      this.patrolData = data.patrolData ? data.patrolData : null
      this.currentComponent = data.currentComponent
    }
  }
}
</script>

<style>

</style>