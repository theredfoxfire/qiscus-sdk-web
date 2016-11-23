<template>
  <div>
    {{ init }}
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

<style lang="scss">
.qcw-trigger-btn {
  position: fixed;
  bottom: 5px;
  right: 5px;
  border: 0;
  border-radius: 15px;
  background: #8bc;
  color: #ecf0f1;
  font-weight: bold;
  padding: 10px 25px;
  cursor: pointer;
  transition: all .12s ease;
  box-shadow: 0 3px 7px rgba(0,0,0,.3);
  text-shadow: 0 -1px 0 rgba(0,0,0,.3);
  outline: none;
  &:hover {
    transform: translateY(-3px);
  }
  i.fa.fa-comments {
    font-size: 15px;
    margin-right: 10px;
  }
  i.fa.fa-chevron-up {
    font-size: 15px;
    margin-left: 10px;
  }
}
</style>
