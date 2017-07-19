<template>
  <div class="qcw-avatar">
    <img :src="src" />
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['src']
}
</script>
