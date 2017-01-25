<template>
  <div>
    <button class="qcw-trigger-btn" @click="toggleChatWindow" v-if="init">
      <Loader v-if="loading"></Loader>
      <i class="fa fa-comments" v-if="!loading"></i>
      {{ label || 'Chat' }}
      <i class="fa fa-chevron-up"></i>
    </button>
    <button class="qcw-trigger-btn" @click="toggleChatWindow" v-if="!init">
      <i class="fa fa-gear"></i>
      Chat Config
    </button>
  </div>
</template>

<script>
import Loader from './Loader.vue'

export default {
  props: ['label', 'loading'],
  name: 'QiscusWidgetTrigger',
  components: { Loader },
  computed: {
    init: function() { return this.$store.state.qiscus.isInit; }
  },
  methods: { 
    toggleChatWindow() {
      if(this.init && this.loading) return false;
      this.$store.dispatch('toggleChatWindow');
    } 
  }
}
</script>