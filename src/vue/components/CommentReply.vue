<template>
  <div>
    <div class="reply-wrapper" :class="{'reply-wrapper--me': isMe }" @click="clickHandler">
      <div v-html="repliedCommentSender" class="reply-sender"></div>
      <image-loader v-if="comment.isAttachment(comment.payload.replied_comment_message)"
        :comment="comment"
        :message="comment.payload.replied_comment_message"
        :on-click-image="onClickImage"
        :callback="callback">
      </image-loader>
      <div v-html="repliedCommentMessage" v-if="!comment.isAttachment(comment.payload.replied_comment_message)"></div>
    </div>
    <image-loader v-if="comment.isAttachment(comment.payload.text)"
      :comment="comment"
      :message="comment.payload.text"
      :on-click-image="onClickImage"
      :callback="callback">
    </image-loader>
    <div v-html="repliedCommentText" 
      class="qcw-comment__content"
      v-if="!comment.isAttachment(comment.payload.text)"
    ></div>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader.vue';
export default {
  name: 'CommentReply',
  components: {ImageLoader},
  props: ['comment', 'isMe', 'clickHandler', 'repliedCommentSender', 'onClickImage', 'callback', 'repliedCommentMessage', 'repliedCommentText'],
}
</script>

