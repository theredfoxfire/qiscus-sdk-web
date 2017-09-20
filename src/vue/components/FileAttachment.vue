<template>
  <div>
    <image-loader 
      :comment="comment"
      :message="comment.message"
      :on-click-image="onClickImage"
      :callback="scrollToBottom">
    </image-loader>
    <comment-render :text="comment.payload.caption"></comment-render>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader.vue';
import CommentRender from './CommentRender.vue';

export default {
  name: 'FileAttachment',
  components: { ImageLoader, CommentRender },
  props: ['comment', 'onClickImage'],
  methods: {
    scrollToBottom: function() {
      // var element = document.getElementById('messages__comments');
      // element.scrollTop = (element.scrollHeight - element.clientHeight) + 7000;
      // get id of latest comment from selected room
      const latestCommentId = qiscus.selected.comments[qiscus.selected.comments.length-1].id
      const element = document.getElementById(latestCommentId)
      if(element) {
        element.scrollIntoView({block: 'end', behaviour: 'smooth'})
      }
    },
  }
}
</script>
