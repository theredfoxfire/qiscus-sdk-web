<template>
  <div class="qcw-container" 
    :class="{
      'qcw-container--open': windowStatus, 
      'qcw-container--not-init': !init
    }">
    <init-config v-if="!selected && !init"></init-config>
    <div v-if="init && !selected">
      <div class="qcw-header">
        Welcome, <strong>{{ userdata.username }}</strong>
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <h3 style="padding: 20px; text-align: center;">No Active Chat, please select participant to chat to</h3>
    </div>
    <div v-if="init && selected">
      <div class="qcw-header" @click="onHeaderClicked">
        {{ selected.name }} 
        <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
      </div>
      <ul id="messages__comments">
        <load-more v-if="haveMoreComments" :isLoadingComments="isLoadingComments" :clickHandler="loadMoreComments"></load-more> 
        <li v-if="selected.comments.length > 0" v-for="(comment, index) in selected.comments" :key="comment.id">
          <comment :comment="comment" 
            :onupdate="scrollToBottom"
            :on-click-image="openImageModal" 
            :comment-before="(index-1 < 0) ? null : selected.comments[index-1]"
            :comment-after="(index+1 <= selected.comments.length-1) ? selected.comments[index+1] : null"
            :userdata="userdata">
          </comment>
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
// import {chatTarget,toggleChatWindow, backToHome, submitComment, loadComments} from '../vuex/actions'
import ChatParticipants from './ChatParticipants.vue'
import InitConfig from './InitConfig.vue'
import LoadMore from './LoadMore.vue'

export default {
  components: {ChatParticipants, Comment, InitConfig, LoadMore},
  computed: {
    windowStatus: function(){ return this.$store.state.windowStatus },
    selected: function() { return this.$store.state.qiscus.selected},
    userdata: function() { return this.$store.state.qiscus.userData },
    mqtt: function() { return this.$store.state.mqtt },
    mqttData: function() { return this.$store.state.mqttData },
    init: function() { return this.$store.state.qiscus.isInit },
    haveMoreComments: function() { return this.selected.comments.length > 0 && this.selected.comments[0].before_id > 0 },
    isLoadingComments: function() { return this.$store.state.isLoadingComments }
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
      const self = this;
      if(self.commentInput.length > 0){
        self.mqtt.publish(`r/${self.selected.id}/${self.selected.last_comment_topic_id}/${self.userdata.username}/t`, 1);
      } else {
        self.mqtt.publish(`r/${self.selected.id}/${self.selected.last_comment_topic_id}/${self.userdata.username}/t`, 0);
      } 
    },
    openImageModal(link) {
      this.$store.dispatch('openImageModal', link)
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
      this.mqtt.unsubscribe(`/${qiscus.userData.token}/c`)
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
    loadMoreComments() {
      const payload = {
        topic_id: this.selected.last_comment_topic_id,
        last_comment_id: this.selected.comments[0].id
      }
      this.$store.dispatch('loadComments', payload);
    },
    chatTarget(id) {
      this.$store.dispatch('chatTarget', id)
    },
    scrollToBottom: function() {
      var element = document.getElementById('messages__comments');
      element.scrollTop = (element.scrollHeight - element.clientHeight) + 7000;
    },
    onHeaderClicked() {
      if(qiscus) qiscus.emit('header-clicked', 'hohohoho');
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