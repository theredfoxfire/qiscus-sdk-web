<template>
  <div class="qcw-comment" :class="{
    'comment--me': comment.username_real == myemail,
    'comment--parent': isParent,
    'comment--mid': isMid,
    'comment--last': isLast
  }">
    <!-- <avatar :src="comment.avatar"></avatar> -->
    <div class="qcw-comment__message">
      <div class="qcw-comment__info" v-if="isParent">
        <span class="qcw-comment__username">{{comment.username_as}}</span>
        <span class="qcw-comment__time">{{comment.time}}</span>
      </div>
      <image-loader v-if="comment.isAttachment()" 
        :comment="comment" 
        :on-click-image="onClickImage"
        :callback="onupdate">
      </image-loader>
      <div v-html="message" v-if="!comment.isAttachment()"></div>
      <div v-if="comment.username_real == myemail">
        <i class="qcw-comment__state fa fa-clock-o" v-if="comment.isPending"></i>
        <i class="qcw-comment__state fa fa-check" v-if="comment.isSent && !comment.isDelivered"></i>
        <div class="qcw-comment__state qcw-comment__state--delivered" v-if="comment.isDelivered && !comment.isRead">
          <i class="fa fa-check"></i><i class="fa fa-check"></i>
        </div>
        <div class="qcw-comment__state qcw-comment__state--read" v-if="comment.isRead">
          <i class="fa fa-check"></i><i class="fa fa-check"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmbedJS from 'embed-js';
import marked from 'marked';
import ImageLoader from './ImageLoader.vue';
// import highlight from 'highlight.js';
// import Avatar from './Avatar';

export default {
  // components: { Avatar },
  props: ['comment','onupdate', 'onClickImage', 'commentBefore', 'commentAfter'],
  components: { ImageLoader },
  mounted(){
    this.onupdate();
  },
  computed: {
    myemail() { return qiscus.email },
    isParent() { return this.commentBefore == null || this.commentBefore.username_real != this.comment.username_real; },
    isMid() { return this.commentAfter != null && !this.isParent && this.commentAfter.username_real == this.comment.username_real; },
    isLast() { return this.commentAfter == null || this.commentAfter.username_real != this.comment.username_real; }
  },
  created() {
    const comment = this.comment;
    if(!comment.isAttachment()) {
      this.x.text((data) => {
        this.message = data;
        this.onupdate();
      });
    }
  },
  data () {
    return {
      message: '',
      me: qiscus.email,
      x: new EmbedJS({
        input: this.comment.message,
        openGraphEndpoint: '//opengraph.io/api/1.0/site/${url}',
        onOpenGraphFetch: function(data) {
          if( !data.hybridGraph ) return data;
          data.hybridGraph.success = data.error ? false : true;
          return data.hybridGraph;
        },
        // highlightCode: true,
        marked: true,
        // emoji: true,
        plugins: {
          marked: marked,
          // highlightjs: highlight
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.qcw-comment .avatar {
  border: 2px solid #3EC4AF;
  min-width: 30px;
  margin-right: 15px;
  position: relative;
  z-index: 2;
  width: 50px !important; height: 50px !important;
}
.qcw-comment .avatar img {
  width: 50px !important; height: 50px !important;
}
.qcw-comment {
  display: flex;
  position: relative;
  font-size: 12px;
  &.welcome:before{
      border: 0;
  }
  &.comment--me {
    justify-content: flex-end;
  }
}
.qcw-comment__message {
  line-height: 1.7em;
  min-height: 30px;
  margin-bottom: 1px;
  background: lighten(#8bc, 20);
  padding: 3px 15px;
  position: relative;
  word-break: break-word;
  a {
    transition: all .32s ease;
    font-weight: bold;
    color: #444;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .comment--me & {
    background: #8bc;
    color: #FFF;
  }
  .comment--parent & {
    border-radius: 10px 10px 10px 0;
    margin-top: 9px;
    min-width: 200px;
    padding: 10px;
  }
  .comment--parent.comment--me & {
    border-radius: 10px 10px 0 10px;
  }
  .comment--mid & {
    border-radius: 0 10px 10px 0;
  }
  .comment--mid.comment--me & {
    border-radius: 10px 0 0 10px;
  }
  .comment--last & {
    border-radius: 0 10px 10px 10px;
  }
  .comment--last.comment--me & {
    border-radius: 10px 0 10px 10px;
  }
  .comment--parent.comment--last & {
    border-radius: 10px 10px 10px 10px;
  }
  /*.comment--parent.comment--me &:after{
    left: 100%;
    top: 0;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(238, 238, 238, 0);
    border-left-color: #8bc;
    border-width: 15px;
    margin-top: -15px;
    margin-left: -23px;
    transform: rotate(-135deg);
  }
  .comment--parent &:after{
    left: -10px;
    top: 0;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(238, 238, 238, 0);
    border-left-color: lighten(#8bc, 20);
    border-width: 15px;
    margin-top: -15px;
    transform: rotate(-45deg);
  }*/
}
.welcome__message {
  padding-top: 5px;
  line-height: 1.7em;
  min-height: 68px;
  padding-bottom: 15px;
  margin-bottom: 15px;
  width: 100%;
  background: #F4F4F4;
  padding: 10px;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 3px 5px rgba(0,0,0,.15);
}
.qcw-comment__message p {
  margin: 0;
}
.qcw-comment__info {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dotted #ccc;
  margin-bottom: 7px;
}
.qcw-comment__username {
  font-weight: bold; line-height: 1;
  color: #444;
  .comment--me & {
    color: #FFF;
  }
}
.qcw-comment__time {
  font-size: 10px;
  color: #444;
  .comment--me & {
    color: #FFF;
  }
}
.qcw-image-container {
  height: 100px; overflow: hidden;
  margin: -8px -10px -10px -10px;
  border-radius: 0 0 5px 5px;
  img {
    min-width: 200px;
    min-height: 110px;
    // transform: translate3d(-50%, -50%, 0);
    cursor: -webkit-zoom-in;
    &:hover {
      opacity: 1;
    }
  }
}
.qcw-file-container{
  a{
      display: flex;
      color: #2c3e50;
  }
  i.fa{
    position: relative;
    font-size: 3em;
    color: #2c3e50;
    float: left;
    .ft{
      position: absolute;
      top: 10px;
      margin-left: 5px;
      font-size: 12px;
      background: transparent;
      font-family: sans-serif;
    }
    .fe{
      font-size: 16px;
      background: #2c3e50;
      color: #fff;
      padding: 2px 6px 4px 4px;
      margin-top: -12px;
      margin-left: 10px;
      border-radius: 2px;
      font-family: sans-serif;
    }
  }
  .file-name{
    word-break: break-word;
    line-height: 1.4;
    float: left;
    padding-top: 5px;
    padding-left: 5px;
  }
}
.qcw-comment__state {
  font-size: 9px;
  position: absolute;
  top: 7px; left: -7px;
  color: #ccc;
  text-indent: -5px;
  transition: opacity .32s ease;
  opacity: .3;
  .qcw-comment__message:hover & {
    opacity: 1;
  }
  &--read {
    color: #3498db;
  }
}
// let's style the link thumbnail thingy
.ejs-embed {
  overflow: hidden;
  margin-top: 15px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 5px;
  .ejs-ogp-thumb {
    width: 50px; height: 50px;
    float: left;
    margin-right: 10px;
  }
}
</style>
