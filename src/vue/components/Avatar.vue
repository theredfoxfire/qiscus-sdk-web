<template>
  <div class="avatar">
    <img :src="src.avatar.url" />
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['src']
}
</script>
