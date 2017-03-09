<template>
  <div class="messages">
    <ul id="messages__comments">
      <li v-if="comments.length >= 10" class="load-more-button"
        @click="loadComments(selected_topic_id, comments[0].id)">
        <i class="fa fa-loading" v-if="isLoadingComment"></i> Load more comments
      </li>
      <li v-if="comments.length < 0">
          <div class="comment welcome">
              <div class="welcome__message">
                <div>Our staff is busy at the moment and may take a few minutes to respond.
                  You will get a notification on your screen once we are ready to serve you.
                  Thank you.</div>
              </div>
          </div>
      </li>
      <li v-if="comments.length > 0" v-for="comment in comments">
        <comment :comment="comment" :onupdate="scrollToBottom"></comment>
      </li>
    </ul>
    <div class="comment-form">
      <textarea placeholder="type your comment here ..." @keyup.enter="postComment($event)" v-model="comment_msg"></textarea>
      <div class="uploader">
        <i class="fa fa-paperclip"></i>
        <input class="uploader__input" name="file" type="file" @change="uploadFile">
      </div>
    </div>
  </div>
</template>

<script>
import Comment from './Comment';
import Pusher from 'pusher-js';
import Listener from '../libs/qiscus-listener';
import qiscus from '../libs/qiscus';
import lstore from 'store';
import { loadRooms, selectRoom, submitComment, loadComments } from '../vuex/actions';

export default {
  components: { Comment },
  vuex: {
    getters: {
      rooms: (state) => state.rooms,
      selected: (state) => state.selected,
      comments: (state) => (state.selected.topic) ? state.selected.topic.comments : [],
      selected_topic_id: (state) => (state.selected.topic) ? state.selected.topic.id : 0,
      user: (state) => state.user
    },
    actions: {
      submitComment,
      loadRooms,
      selectRoom,
      loadComments
    }
  },
  data () {
    return {
      // uploadUrl: `https://upload.qisc.us/upload.php?username=${this.user.username}&topic_id=${this.selected_topic_id}&hashing=ok`,
      comment_msg: '',
      uploadedFiles: [],
      fileProgress: 0,
      allFilesUploaded: false,
      pusher: {},
      listener: {},
      mlength: 0
    }
  },
  computed: {
    uploadUrl: function(){
      return `https://upload.qisc.us/upload.php?username=${this.user.username}&topic_id=${this.selected_topic_id}&hashing=ok`
    }
  },
  methods: {
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
      var xhr = new XMLHttpRequest();
      xhr.open('POST', vm.uploadUrl, true);
      xhr.onload = function() {
        if(xhr.status === 200) {
          // file(s) uploaded), let's post to comment
          var url = JSON.parse(xhr.response).url
          vm.submitComment(vm.selected_topic_id, `[file] ${url} [/file]`);

        }
      }
      xhr.send(formData);

      // reader.onload = (e) => { vm.uploadedFiles.push(e.target.result) };
      // reader.readAsDataURL(files[0]);
    },
    postComment(e) {
      if(!e.shiftKey){
        e.preventDefault();
        e.stopPropagation();
        const cmt = this.comment_msg.trim();
        if(cmt.length < 1) return;
        this.submitComment(this.selected_topic_id, this.comment_msg.trim());
        this.comment_msg = '';
      }
    }
  },
  created() {
      //////////////////// setting pusher ///////////////////////////
      this.pusher = new Pusher('986efaa30f7dacdaab14', {  encrypted: true });
      // call the listener
      const room_id = lstore.get('qcData').room_id;
      this.listener = new Listener(this.pusher, qiscus);
  },
  mounted() {
    this.loadRooms().then((response) => {
      this.scrollToBottom();
      // this.listener.listenUserEvent(lstore.get('qcData').token);
      this.listener.listenRoomEvent(qiscus.selected.room.code_en);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
.comment-form {
  display: flex;
  flex-flow: row nowrap;
  height: 50px;
  padding: 10px;
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
    input {
      opacity: 0; width: 100%; height: 100%;
      position: absolute;
      top: 0; left: 0; cursor: pointer;
    }
  }
}
.comment-form textarea {
  width: 100%;
  border-radius: 5px;
  font-size: 12px; padding: 7px 10px;
  resize: none;
}
</style>
