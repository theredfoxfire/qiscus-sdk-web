<template>
  <div class="comment__card--container">
    <div class="comment__card--image" :style="{'background-image': 'url('+card.image+')'}"></div>
    <strong class="comment__card--title">{{ card.title }}</strong>
    <div class="comment__card--description">{{ card.description }}</div>
    <comment-buttons :buttons="card.buttons" :postbackHandler="postbackHandler"></comment-buttons>
  </div>
</template>

<script>
import CommentButtons from './CommentButtons';

export default {
  name: 'QiscusCardComment',
  components: { CommentButtons },
  props: ['comment', 'postbackHandler'],
  data() {
    return {
      card: this.comment.payload,
    }
  },
}
</script>

