<template>
  <div class="qcw-modal-overlay" :class="{'qvc-modal-overlay--on': imageModalOn }" @click="closeHandler">
    <div class="qcw-image-modal">
      <img :src="imageModalLink" :alt="imageModalLink">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ImageModal',
    props: ['imageModalLink', 'imageModalOn', 'closeHandler'],
  }
</script>

<style lang="scss">
  .qcw-modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    display: none;
  }
  .qcw-modal-overlay--on {
    display: block;
  }
  .qcw-image-modal {
    max-width: 80%;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }
</style>