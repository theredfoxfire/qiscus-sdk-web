<template>
  <div class="comment" :class="{'comment--me': comment.username_real == myemail}">
    <!-- <avatar :src="comment.avatar"></avatar> -->
    <div class="comment__message">
      <div class="comment__info">
        <span class="comment__username">{{comment.username_as}}</span>
        <span class="comment__time"><i class="fa fa-check" v-if="comment.username_as == me"></i> {{comment.time}}</span>
      </div>
      <div>{{{ message }}}</div>
    </div>
  </div>
</template>

<script>
import EmbedJS from 'embed-js';
import marked from 'marked';
import highlight from 'highlight.js';
// import Avatar from './Avatar';

export default {
  // components: { Avatar },
  props: ['comment','onupdate', 'userdata'],
  ready(){
    this.onupdate();
  },
  computed: {
    myemail() {
      return qiscus.email
    }
  },
  created() {
    const comment = this.comment;
    if(comment.isAttachment()){
      const self = this;
      this.message = `<div class="image-container">Loading image ...</div>`;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
          const src = URL.createObjectURL(this.response);
          if (comment.isImageAttachment()) {
              self.message = `<div class="image-container"><a href="${src}" target="_blank"><img src="${src}" alt="${comment.getAttachmentURI()}" /></a></div>`
          }else {
              var uri = comment.getAttachmentURI();
              var filename = uri.split('/').pop().split('#')[0].split('?')[0];
              var ext = filename.split('.').pop();
              self.message = `<div class="file-container"><a href="${comment.getAttachmentURI()}" target="_blank"><i class="fa fa-file-o" aria-hidden="true"><div class="ft">File</div><div class="fe">${ext}</div></i><div class="file-name">${filename}</div></a></div>`
          }
          self.onupdate();
        }
      }
      xhr.open('GET', comment.getAttachmentURI());
      // xhr.setRequestHeader('Authorization', 'Token token='+window.doctortoken);
      xhr.responseType = 'blob';
      xhr.send();
    } else {
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
        highlightCode: true,
        marked: true,
        emoji: true,
        plugins: {
          marked: marked,
          highlightjs: highlight
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.comment .avatar {
  border: 2px solid #3EC4AF;
  min-width: 30px;
  margin-right: 15px;
  position: relative;
  z-index: 2;
  width: 50px !important; height: 50px !important;
}
.comment .avatar img {
  width: 50px !important; height: 50px !important;
}
.comment {
  display: flex;
  position: relative;
  font-size: 12px;
  &.welcome:before{
      border: 0;
  }
  &--me {
    justify-content: flex-end;
  }
}
.comment__message {
  padding-top: 5px;
  line-height: 1.7em;
  min-height: 30px;
  padding-bottom: 15px;
  margin-bottom: 5px;
  width: 100%;
  max-width: 200px;
  background: #2CA;
  padding: 10px;
  border-radius: 0 15px 15px 15px;
  position: relative;
  .comment--me & {
    background: #0AD;
    color: #FFF;
    border-radius: 15px 0 15px 15px;
  }
  .comment--me &:after{
    left: 100%;
    top: 0;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(238, 238, 238, 0);
    border-left-color: #0AD;
    border-width: 15px;
    margin-top: -15px;
    margin-left: -23px;
    transform: rotate(-135deg);
  }
  &:after{
    left: -10px;
    top: 0;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(238, 238, 238, 0);
    border-left-color: #2CA;
    border-width: 15px;
    margin-top: -15px;
    transform: rotate(-45deg);
  }
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
.comment__message p {
  margin: 0;
}
.comment__info {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dotted #ccc;
  margin-bottom: 7px;
}
.comment__username {
  font-weight: bold; line-height: 1;
  color: #444;
  .comment--me & {
    color: #FFF;
  }
}
.comment__time {
  font-size: 10px;
  color: #444;
  .comment--me & {
    color: #FFF;
  }
}
.image-container {
  width: 100px; height: 100px; overflow: hidden;
  padding: 10px;
  border: 1px solid #ccc; border-radius: 5px;
  img {
    width: 100%;
  }
}
.file-container{
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
        }
        .fe{
            font-size: 16px;
            background: #2c3e50;
            color: #fff;
            padding: 2px 6px 4px 4px;
            margin-top: -12px;
            margin-left: 10px;
            border-radius: 2px;
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
</style>
