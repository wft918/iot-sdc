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
import patrolProblemDetail from "./patrolProblemDetail.vue";
import problemInfo from "./problemInfo.vue";


export default {
  components: {
    patrolProblemDetail,
    problemInfo,
  },
  data() {
    return {
      currentComponent: 'problemInfo',
      patrolData: null
    }
  },
  beforeDestroy() {
    this.currentComponent = 'problemInfo'
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