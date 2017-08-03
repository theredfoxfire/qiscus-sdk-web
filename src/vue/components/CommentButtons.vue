<template>
  <div class="qcw-comment__buttons">
    <div class="action_buttons" v-for="button in buttons" :key="button.label">
      <button @click="postbackHandler(button)" v-if="button.type == 'postback'">
        {{ button.label }}
      </button>
      <a :href="button.payload.url" target="_blank" v-else>{{ button.label }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Qiscus Comment Buttons',
  props: ['buttons', 'postbackHandler'],
  methods: {
    handleClick(button) {
      if (button.type === 'postback') {
        this.postbackHandler(button);
      }
    }
  }
}
</script>

