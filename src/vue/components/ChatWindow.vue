<template>
  <div class="qcw-container" :class="{'qcw-container--open': windowStatus}">
    <div v-if="!selected">
      <div class="qcw-header">
        Select Chat Participant
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <h3 style="padding: 20px; text-align: center;">No Active Chat, please select participant to chat to</h3>
    </div>
    <div v-if="selected">
      <div class="qcw-header">
        <i class="fa fa-chevron-left" @click="backToHome"></i>
        {{ selected.name }}
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <ul id="messages__comments">
        <!-- <li v-if="selected.comments.length >= 10" class="load-more-button"
          @click="loadComments(selected_topic_id, comments[0].id)">
          <i class="fa fa-loading" v-if="isLoadingComment"></i> Load more comments
        </li> -->
        <li v-if="selected.comments.length > 0" v-for="comment in selected.comments">
          <comment :comment="comment" :onupdate="scrollToBottom" :userdata="userdata"></comment>
        </li>
      </ul>
      <div class="qcw-comment-form">
        <textarea placeholder="type your comment here ..." @keyup.enter="trySubmitComment($event)" v-model="commentInput"></textarea>
        <div class="uploader">
          <i class="fa fa-paperclip"></i>
          <input class="uploader__input" name="file" type="file" @change="uploadFile">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from './Comment.vue'
import {chatTarget,toggleChatWindow, backToHome, submitComment, loadComments} from '../vuex/actions'
import ChatParticipants from './ChatParticipants.vue'
export default {
  components: {ChatParticipants, Comment},
  computed: {
    windowStatus: function(){ return this.$store.state.windowStatus },
    selected: function() { return this.$store.state.selected },
    userdata: function() { return this.$store.state.userdata },
    users: function() { return this.$store.state.users },
  },
  data() {
    return {
      commentInput: null,
    }
  },
  created() {
    let self = this;
    setInterval(function(){
      qiscus.sync()
    }, 5000);
  },
  methods: {
    backToHome() {
      this.$store.dispatch('backToHome')
    },
    trySubmitComment(e) {
      if(!e.shiftKey){
        e.preventDefault();
        e.stopPropagation();
        if(this.commentInput.length < 1) return;
        this.submitComment(this.selected.last_comment_topic_id, this.commentInput.trim());
        this.commentInput = null
      }
    },
    submitComment(topic_id, comment) {
      this.$store.dispatch('submitComment', {topic_id, comment})
    },
    toggleChatWindow() {
      this.$store.dispatch('toggleChatWindow')
    },
    sync(){
      if(this.selected) this.loadComments(this.selected.last_comment_topic_id);
    },
    loadComments() {
      this.$store.dispatch('loadComments', this.selected.last_comment_topic_id)
    },
    chatTarget(id) {
      this.$store.dispatch('chatTarget', id)
    },
    scrollToBottom: function() {
      var element = document.getElementById('messages__comments');
      element.scrollTop = (element.scrollHeight - element.clientHeight) + 7000;
    },
    uploadFile(e) {
      var vm       = this;
      var files    = e.target.files || e.dataTransfer.files;
      var formData = new FormData();
      var reader   = new FileReader();
      formData.append('file', files[0]);
      formData.append('token', qiscus.getUserToken());
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${qiscus.baseURL}/api/v2/mobile/upload`, true);
      xhr.onload = function() {
        if(xhr.status === 200) {
          // file(s) uploaded), let's post to comment
          var url = JSON.parse(xhr.response).results.file.url
          vm.submitComment(vm.selected.last_comment_topic_id, `[file] ${url} [/file]`);
        }
      }
      xhr.send(formData);

      // reader.onload = (e) => { vm.uploadedFiles.push(e.target.result) };
      // reader.readAsDataURL(files[0]);
    },
  }
}
</script>

<style scoped lang="scss">
.qcw-container {
  width: 400px;
  height: 500px;
  position: fixed;
  bottom: 70px; right: 5px;
  border-radius: 5px;
  background: #FFF;
  box-shadow: 0 15px 17px rgba(0,0,0,.3);
  transform: translateY(150%);
  transition: transform 0.32s ease;
  font-family: sans-serif;
  &--open {
    transform: translateY(0);
  }
}
.qcw-header {
  background: #1abc9c;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 5px 5px 0 0;
  font-weight: bold;
  text-align: center;
}
i.fa {
  position: absolute;
  cursor: pointer;
  &.fa-chevron-down {
    right: 10px; top: 15px;
  }
  &.fa-chevron-left {
    left: 10px; top: 15px;
  }
}
.load-more-button {
  background: #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  font-size: 12px;
  border-radius: 30px;
  width: 170px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}
.messages {
  flex: 3;
  display: flex;
  flex-flow: column nowrap;
  background: #FFF;
}
ul#messages__comments {
  list-style: none;
  background: #FFF;
  margin:0;
  height: 380px;
  overflow: hidden;
  overflow-y: auto;
  padding: 10px 20px;
}
.qcw-comment-form {
  display: flex;
  flex-flow: row nowrap;
  height: 50px;
  padding: 10px;
  * {
    box-sizing: border-box;
  }
  i {
    font-size: 24px; margin-left: 15px; color: #444;
    cursor: pointer;
  }
  .uploader {
    flex-basis: 80%;
    flex: 2.5;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    bottom: 7px; right: 7px;
    input {
      opacity: 0; width: 100%; height: 100%;
      position: absolute;
      top: 0; left: 0; cursor: pointer;
    }
  }
}
.qcw-comment-form textarea {
  width: 330px;
  border-radius: 5px;
  font-size: 12px; padding: 7px 10px;
  max-height: 30px;
  resize: none;
  border: 0;
  border-bottom: 1px solid #ddd;
}
</style>
