<template>
  <div class="qcw-container">
    <div class="qcw-header">
      {{ selected.name }}
    </div>
    {{ windowStatus }}
  </div>
</template>

<script>
import {getWindowStatus, getSelected} from '../vuex/getters'
export default {
  props: [],
  vuex: {
    getters: {
      windowStatus: getWindowStatus,
      selected: getSelected
    },
  }
}
</script>

<style scoped lang="scss">
</style>
