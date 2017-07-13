<template>
  <div class="reply-preview">
    <div class="reply-wrapper">
      <div v-html="replied_comment.username" class="reply-sender"></div>
      <div v-if="commentType == 'attachment'" class="reply-image-preview">
        <img :src="imageSrc" :alt="imageSrc">
        <span v-html="imageSrc"></span>
      </div>
      <div v-html="replied_comment.message" v-else></div>
      <i class="fa fa-times reply-preview__close-btn" @click="onDismiss"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReplyPreview',
  props: ['replied_comment','onDismiss'],
  data() {
    return {
      commentType: 'text',
      imageSrc: null
    }
  },
  created() {
    this.processText()
  },
  methods: {
    processText() {
      if((this.replied_comment.message.substring(0, '[file]'.length) == '[file]')) {
        this.commentType = 'attachment'
        // check if this is image attachment
        if(this.isImageAttachment) {
          this.imageSrc = this.getAttachmentURI()
        }
      }
    },
    isImageAttachment() {
      return (this.commentType == 'attachment' && this.replied_comment.message.match(/\.(jpg|jpeg|gif|png)/i) != null)
    },
    getAttachmentURI () {
      if (this.commentType != 'attachment') return
      const messageLength = this.replied_comment.message.length
      const beginIndex = '[file]'.length
      const endIndex = messageLength - '[/file]'.length
      return this.replied_comment.message.substring(beginIndex, endIndex).trim()
    }
  }
}
</script>