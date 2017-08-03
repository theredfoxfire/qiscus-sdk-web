<template>
  <div>
    <div class="reply-wrapper" :class="{'reply-wrapper--me': isMe }" @click="clickHandler">
      <div class="reply-sender">{{ repliedCommentSender }}</div>
      <image-loader v-if="comment.isAttachment(comment.payload.replied_comment_message)"
        :comment="comment"
        :message="comment.payload.replied_comment_message"
        :on-click-image="onClickImage"
        :callback="callback">
      </image-loader>
      <div v-if="!comment.isAttachment(comment.payload.replied_comment_message)" 
        v-html="escapeHTML(repliedCommentMessage)">
      </div>
    </div>
    <image-loader v-if="comment.isAttachment(comment.payload.text)"
      :comment="comment"
      :message="comment.payload.text"
      :on-click-image="onClickImage"
      :callback="callback">
    </image-loader>
    <div class="qcw-comment__content"
      v-if="!comment.isAttachment(comment.payload.text)"
      v-html="escapeHTML(repliedCommentText)"
    >
    </div>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader.vue';
export default {
  name: 'CommentReply',
  components: {ImageLoader},
  props: ['comment', 'isMe', 'clickHandler', 'repliedCommentSender', 'onClickImage', 'callback', 'repliedCommentMessage', 'repliedCommentText'],
  methods: {
    searchAndReplace(str, find, replace) {
      return str.split(find).join(replace);
    },
    escapeHTML(text) {
      let comment;
      comment = this.searchAndReplace(text, '<', '&lt;');
      comment = this.searchAndReplace(comment, '>', '&gt;');
      return comment;
    },
  },
}
</script>

