<template>
  <div>
    <div class="image-container" v-if="isLoading">Loading image ...</div>
    <div class="qcw-image-container" v-if="isImage && !isLoading && error==''" @click="onClickImage(imageSrc)">
      <img :src="imageSrc" :alt="imageSrc" />
    </div>
    <div v-if="error">
      <p><i class="fa fa-times fa-fw fa-2x"></i> {{ error }}</p>
      <button @click="loadImage" class="reload-image-btn">Reload Image</button>
    </div>
    <div class="qcw-image-container" v-if="!isImage && !isLoading">
      <a :href="uri" target="_blank">
        <i class="fa fa-file-o" aria-hidden="true"><div class="ft">File</div><div class="fe">{{ ext }}</div></i>
        <div class="file-name">{{ filename }}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ImageLoader',
    props: ['comment', 'callback', 'onClickImage'],
    data() {
      return {
        isLoading: true,
        isImage: false,
        imageSrc: '',
        uri: '',
        filename: '',
        ext: '',
        error: ''
      }
    },
    created() {
      this.loadImage();
      console.info('isi function', this.onClickImage)
    },
    methods: {
      loadImage() {
        const self    = this;
        const comment = this.comment;
        self.isImage  = (comment.isImageAttachment()) ? true: false;
        self.uri      = comment.getAttachmentURI();
        self.filename = self.uri.split('/').pop().split('#')[0].split('?')[0];
        self.ext      = self.filename.split('.').pop();
        self.isLoading = true;
        self.error   = '';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200){
            self.imageSrc  = URL.createObjectURL(this.response);
            self.isLoading = false;
            self.callback();
          } 
        }
        xhr.open('GET', self.uri, true);
        xhr.onerror = function() {
          self.isLoading = false;
          self.error = `Url ${self.uri} loading failed, please try again`
          console.error('error nih', this.response, self.uri);
          self.callback();
        }
        // xhr.setRequestHeader('Authorization', 'Token token='+window.doctortoken);
        xhr.responseType = 'blob';
        xhr.send();
      }
    }
  }
</script>

<style lang="scss">
  .reload-image-btn {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 7px 15px;
    text-align: center;
    cursor: pointer;
    background: #eee;
    color: #FFF;
    border: 2px solid #FFF;
    font-weight: bold;
    border-radius: 5px;
    color: #444;
  }
</style>