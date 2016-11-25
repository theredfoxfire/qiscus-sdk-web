<template>
  <div class="qcw-modal-overlay" :class="{'qcw-modal-overlay--on': imageModalOn }">
    <div class="qcw-image-modal">
      <img :src="imageModalLink" :alt="imageModalLink">
      <a :href="imageModalLink" target="_blank">Open in New Tab</a>
      <i class="fa fa-times" @click="closeHandler"></i>
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
    z-index: 9999;
    background: rgba(0,0,0,.7);
  }
  .qcw-modal-overlay--on {
    display: block;
  }
  .qcw-image-modal {
    max-width: 80%;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 0 0 17px rgba(0,0,0,.5);
    img {
      max-width: 80%;
      margin: 10px auto;
      display: block;
    }
    i.fa.fa-times {
      position: absolute;
      top: -15px; right: -15px;
      background: #FFF;
      border-radius: 50%;
      font-size: 20px;
      width: 35px; height: 35px;
      padding: 7px 0 0 10px;
      cursor: pointer;
      box-shadow: 0 0 17px rgba(0,0,0,.5);
    }
    a {
      display: block;
      width: 100%;
      padding: 10px;
      cursor: pointer;
      background: #8bc;
      text-align: center;
      color: #444;
      text-decoration: none;
      border: 0;
      text-shadow: 0 1px 0 rgba(255,255,255,.5);
    }
  }
</style>