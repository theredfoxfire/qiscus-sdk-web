<template>
  <div class="qcw-container" :class="{'qcw-container--open': windowStatus}">
    <init-config v-if="!selected && !init"></init-config>
    <div v-if="init && !selected">
      <div class="qcw-header">
        Welcome, <strong>{{ userdata.username }}</strong>
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <h3 style="padding: 20px; text-align: center;">No Active Chat, please select participant to chat to</h3>
    </div>
    <div v-if="init && selected">
      <div class="qcw-header">
        {{ selected.name }}
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <ul id="messages__comments">
        <!-- <li v-if="selected.comments.length >= 10" class="load-more-button"
          @click="loadComments(selected_topic_id, comments[0].id)">
          <i class="fa fa-loading" v-if="isLoadingComment"></i> Load more comments
        </li> -->
        <li v-if="selected.comments.length > 0" v-for="comment in selected.comments" :key="comment.id">
          <comment :comment="comment" :onupdate="scrollToBottom" :userdata="userdata"></comment>
        </li>
        <li v-if="uploads.length > 0" v-for="upload in uploads">
          <div class="qcw-upload-info">Uploading {{ upload }} ...</div>
        </li>
        <li v-if="mqttData.typing != ''" class="isTypingText">
          {{ mqttData.typing }} is typing ...
        </li>
      </ul>
      <div class="qcw-comment-form">
        <textarea placeholder="type your comment here ..."
          @focus="publishTyping"
          @keyup="publishTyping"
          @keyup.enter="trySubmitComment($event)" 
          v-model="commentInput">
        </textarea>
        <div class="uploader">
          <i class="fa fa-paper-plane" v-if="commentInput.length > 0" @click="trySubmitComment($event)"></i>
          <i class="fa fa-paperclip" v-if="commentInput.length <= 0"></i>
          <input class="uploader__input" name="file" type="file" @change="uploadFile" v-if="commentInput.length <= 0">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from './Comment.vue'
import {chatTarget,toggleChatWindow, backToHome, submitComment, loadComments} from '../vuex/actions'
import ChatParticipants from './ChatParticipants.vue'
import InitConfig from './InitConfig.vue'
import mqtt from 'mqtt'
import MqttAdapter from '../../MqttAdapter.js'

export default {
  components: {ChatParticipants, Comment, InitConfig},
  computed: {
    windowStatus: function(){ return this.$store.state.windowStatus },
    selected: function() { return this.$store.state.qiscus.selected},
    userdata: function() { return this.$store.state.qiscus.userData },
    mqtt: function() { return this.$store.state.mqtt },
    mqttData: function() { return this.$store.state.mqttData },
    init: function() { return this.$store.state.init }
  },
  data() {
    return {
      commentInput: '',
      uploads: []
    }
  },
  created() {
    let self = this;
    // setInterval(function(){
    //   if(qiscus.selected) qiscus.sync()
    // }, 5000);
  },
  methods: {
    publishTyping() {
      if(this.commentInput.length > 0){
        this.mqtt.publish(`r/${this.selected.id}/${this.selected.last_comment_topic_id}/${this.userdata.email}/t`, 1);
      } else {
        this.mqtt.publish(`r/${this.selected.id}/${this.selected.last_comment_topic_id}/${this.userdata.email}/t`, 0);
      } 
    },
    backToHome() {
      this.$store.dispatch('backToHome')
    },
    subscribeTopic(room_id, topic_id) {
      this.mqtt.subscribe(`r/${room_id}/${topic_id}/t`)
      this.mqtt.subscribe(`${qiscus.userData.token}/c`)
    },
    unsubscribeTopic(room_id, topic_id) {
      this.mqtt.unsubscribe(`r/${room_id}/${topic_id}/t`)
    },
    trySubmitComment(e) {
      if(!e.shiftKey){
        e.preventDefault();
        e.stopPropagation();
        if(this.commentInput.length < 1) return;
        this.submitComment(this.selected.last_comment_topic_id, this.commentInput.trim());
        this.commentInput = ''
        this.mqtt.publish(`r/${this.selected.id}/${this.selected.last_comment_topic_id}/fikri@qiscus.com/t`, 0);
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
      vm.uploads.push(files[0].name);
      formData.append('file', files[0]);
      formData.append('token', qiscus.userData.token);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${qiscus.baseURL}/api/v2/sdk/upload`, true);
      xhr.onload = function() {
        if(xhr.status === 200) {
          // file(s) uploaded), let's post to comment
          var url = JSON.parse(xhr.response).results.file.url
          vm.uploads.splice(vm.uploads.indexOf(files[0].name),1)
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

<style lang="scss">
.qcw-container {
  width: 400px;
  height: 500px;
  position: fixed;
  bottom: 50px; right: 5px;
  border-radius: 5px;
  background: #FFF;
  box-shadow: 0 3px 15px rgba(0,0,0,.3);
  transform: translateY(150%);
  transition: transform 0.32s ease;
  font-family: sans-serif;
  &--open {
    transform: translateY(0);
  }
}
.qcw-header {
  background: #8bc;
  color: #ecf0f1;
  padding: 15px;
  border-radius: 5px 5px 0 0;
  text-shadow: 0 -1px 0 rgba(0,0,0,.3);
  font-weight: bold;
  text-align: center;
}
.qcw-container i.fa {
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
.qcw-container .messages {
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
ul#messages__comments::-webkit-scrollbar {
 width: 9px; background-color: #ddd;
 opacity: 0.3;
 &:hover {
   transition: opacity 0.32s ease;
   opacity: 1;
 }
}
ul#messages__comments::-webkit-scrollbar-thumb {
 border-radius: 10px; -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);	background-color: #8bc;
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
    font-size: 20px; margin: 5px 0 0 15px; color: #444;
    padding: 4px 7px 0 5px;
    color: #eee;
    cursor: pointer;
    background: #8bc;
    border-radius: 50%;
    width: 30px; height: 30px;
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
  border: 1px solid #ddd;
  font-size: 12px; padding: 7px 10px;
  max-height: 30px;
  resize: none;
  outline: none;
}
.qcw-upload-info {
  padding: 7px 10px;
  border-radius: 10px;
  background: lighten(#8bc, 19);
  color: #444;
  font-size: 10px;
  text-align: center;
  max-width: 200px;
  margin: 0 auto;
}
.isTypingText {
  position: absolute;
  text-align: left;
  bottom: 12px;
  font-size: 10px;
}
</style>
