<template>
  <div class="qcw-comment-container" :id="comment.id">
    <!-- comment data -->
    <div class="qcw-comment-date" v-if="showDate">
      - {{ dateToday }} - 
    </div>
    <!-- CommentType: "system_event" -->
    <div v-if="comment.type == 'system_event'" class="qcw-comment--system-event">
      {{ comment.message }}
    </div>
    <!-- for text type comment -->
    <div class="qcw-comment" 
      v-if="comment.type != 'system_event'"
      :class="{
        'comment--me': comment.username_real == myemail,
        'comment--parent': isParent,
        'comment--mid': isMid,
        'comment--last': isLast
      }">
      <avatar :src="comment.avatar" v-if="options.avatar && !isMe" :class="{'qcw-avatar--hide': !isParent}"></avatar> 
      <div class="qcw-comment__message">
        <!-- Comment Time -->
        <div class="qcw-comment__info" v-if="isParent">
          <span class="qcw-comment__username">{{comment.username_as}}</span>
          <span class="qcw-comment__time" v-if="isParent">{{comment.time}}</span>
        </div>
        <i class="fa fa-reply reply-btn" @click="replyHandler(comment)" :class="{'reply-btn--me': isMe}"></i>
        <!-- CommentType: "TEXT" -->
        <div v-if="comment.type == 'text' || comment.type == 'reply'">
          <image-loader v-if="comment.isAttachment(comment.message)"
            :comment="comment"
            :message="comment.message"
            :on-click-image="onClickImage"
            :callback="onupdate">
          </image-loader>
          <comment-reply v-if="comment.type =='reply'"
            :comment="comment"
            :isMe="isMe"
            :clickHandler="gotoComment"
            :repliedCommentSender="replied_comment_sender"
            :repliedCommentMessage="replied_comment_message"
            :repliedCommentText="replied_comment_text"
            :onClickImage="onClickImage"
            :callback="onupdate"
          ></comment-reply>
          <!--<div v-if="comment.type == 'reply'">
            <div class="reply-wrapper" :class="{'reply-wrapper--me': isMe }" @click="gotoComment">
              <div v-html="replied_comment_sender" class="reply-sender"></div>
              <image-loader v-if="comment.isAttachment(comment.payload.replied_comment_message)"
                :comment="comment"
                :message="comment.payload.replied_comment_message"
                :on-click-image="onClickImage"
                :callback="onupdate">
              </image-loader>
              <div v-html="replied_comment_message" v-if="!comment.isAttachment(comment.payload.replied_comment_message)"></div>
            </div>
            <image-loader v-if="comment.isAttachment(comment.payload.text)"
              :comment="comment"
              :message="comment.payload.text"
              :on-click-image="onClickImage"
              :callback="onupdate">
            </image-loader>
            <div v-html="replied_comment_text" 
              class="qcw-comment__content"
              v-if="!comment.isAttachment(comment.payload.text)"
            ></div>
          </div>-->
          <div v-html="message" v-if="!comment.isAttachment(comment.message) && comment.type=='text'" class="qcw-comment__content"></div>
          <span class="qcw-comment__time qcw-comment__time--children" 
            v-if="!isParent"
            :class="{'qcw-comment__time--attachment': comment.isAttachment(comment.message)}">
            {{comment.time}}
          </span>
          <div v-if="isMe">
            <i class="qcw-comment__state fa fa-clock-o" v-if="comment.isPending"></i>
            <i class="qcw-comment__state fa fa-check" v-if="comment.isSent && !comment.isDelivered"></i>
            <i class="qcw-comment__state fa fa-times-circle" v-if="comment.isFailed" @click="resend(comment)"></i>
            <div class="qcw-comment__state qcw-comment__state--delivered" v-if="comment.isDelivered && !comment.isRead">
              <i class="fa fa-check"></i><i class="fa fa-check"></i>
            </div>
            <div class="qcw-comment__state qcw-comment__state--read" v-if="comment.isRead">
              <i class="fa fa-check"></i><i class="fa fa-check"></i>
            </div>
          </div> <!-- end of comment icons -->
        </div>
        <!-- CommentType: "ACCOUNT_LINKING" -->
        <div v-if="comment.type == 'account_linking'">
          <div class="qcw-comment__content" v-html="message"></div>
          <div class="action_buttons">
            <button @click="openAccountBox">{{ comment.payload.params.button_text }} &rang;</button>
          </div>
        </div>
        <!-- CommentType: "BUTTON" -->
        <div v-if="comment.type == 'buttons'">
          <div class="qcw-comment__content" v-html="comment.payload.text || message"></div>
          <div class="action_buttons" v-for="button in comment.payload.buttons">
            <button @click="postbackSubmit(button)" v-if="button.type == 'postback'">
              {{ button.label }}
            </button>
          </div>
        </div>
      </div>
      <avatar :src="comment.avatar" v-if="options.avatar && isMe" :class="{'qcw-avatar--hide': !isParent}"></avatar> 
    </div>
  </div>
</template>

<script>
import EmbedJS from 'embed-js';
// import marked from 'marked';
import ImageLoader from './ImageLoader.vue';
// import highlight from 'highlight.js';
import Avatar from './Avatar';
import CommentReply from './CommentReply';

export default {
  props: ['comment','onupdate', 'onClickImage', 'commentBefore', 'commentAfter', 'replyHandler'],
  components: { Avatar, ImageLoader, CommentReply },
  updated(){
    // this.onupdate();
  },
  computed: {
    options() { return QiscusSDK.core.options },
    myemail() { return QiscusSDK.core.email },
    isParent() { return this.commentBefore == null || this.commentBefore.username_real != this.comment.username_real; },
    isMid() { return this.commentAfter != null && !this.isParent && this.commentAfter.username_real == this.comment.username_real; },
    isLast() { return this.commentAfter == null || this.commentAfter.username_real != this.comment.username_real; },
    isMe () { return this.comment.username_real == this.myemail },
    showDate() { return this.commentBefore === null || (this.commentBefore.date != this.comment.date) },
    renderedComment() { return (typeof emojione != "undefined") ? emojione.toShort(this.comment.message) : this.comment.message }
  },
  created() {
    if(!this.comment.isAttachment(this.comment.message)) {
      this.message = this.comment.message
      this.x.text((data) => {
        this.message = (typeof emojione != 'undefined') ? emojione.toImage(data) : data;
      });
    }
    if(this.comment.type == 'reply') {
      this.y.text((data) => {
        this.replied_comment_message = (typeof emojione != 'undefined') ? emojione.toImage(data) : data;
      })
      new EmbedJS({
        input: this.comment.payload.text,
        excludeEmbed: ['github','youtube'],
        emoji: false,
        inlineText: false,
        linkOptions: { target: '_blank' }
      }).text( data => {
        this.replied_comment_text = (typeof emojione != 'undefined') ? emojione.toImage(data) : data;
      })
    }
  },
  methods: {
    gotoComment() {
      let element = document.getElementById(this.comment.payload.replied_comment_id)
      if(!element) return
      element.scrollIntoView({block: 'end',  behaviour: 'smooth'})
    },
    openAccountBox() {
      window.open(this.comment.payload.url, 'AccountLinkingPopup', 'width=500,height=400,location=no,menubar=no,resizable=1,status=no,toolbar=no')
    },
    postbackSubmit(button) {
      const topicId = qiscus.selected.id
      qiscus.submitComment(topicId, button.label, null, 'button_postback_response', JSON.stringify(button.payload))
    },
    resend(comment){
      this.$store.dispatch('resendComment', comment)
    },
    isTypeOfEvent() {
      const event_type = ['create_room', 'add_member', 'join_room', 'remove_member', 'left_room', 'change_room_name', 'change_room_avatar'];
      return this.comment.type.indexOf(event_type) > -1;
    }
  },
  data () {
    return {
      message: '',
      replied_comment_message: '',
      replied_comment_text: '',
      replied_comment_sender: (this.comment.type=='reply') ? this.comment.payload.replied_comment_sender_username : '',
      dateToday: new Date(this.comment.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      me: qiscus.email,
      x: new EmbedJS({
        input: this.comment.message,
        // googleAuthKey: 'AIzaSyAO1Oui55SvTwdk4XCMzmAgr145urfQ9No',
        excludeEmbed: ['github','youtube'],
        emoji: false,
        inlineText: false,
        linkOptions: {
          target: '_blank'
        },
      }),
      y: new EmbedJS({
        input: (this.comment.type == 'reply') ? this.comment.payload.replied_comment_message : '.',
        excludeEmbed: ['github','youtube'],
        emoji: false,
        inlineText: false,
        linkOptions: { target: '_blank' }
      })
    }
  }
}
</script>