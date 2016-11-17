<template>
  <div class="qcw-init-config">

    <div class="qcw-header">
      Set Widget Configuration
      <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
    </div>

    <div class="qcw-config-form">
      <label>email</label>
      <input type="email" v-model="email">

      <label>password</label>
      <input type="password" v-model="key">

      <label>username </label>
      <input type="text" v-model="username">

      <label>description</label>
      <textarea v-model="description"></textarea>

      <button @click="activateChat">Activate Chat</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InitConfig',
    data() {
      return {
        email: 'fikri@qiscus.com',
        key: 'password',
        username: 'fikri',
        description: 'A lunatic Web Developer'
      }
    },
    methods: {
      toggleChatWindow() {
        this.$store.dispatch('toggleChatWindow');
      },
      activateChat() {
        qiscus.setUser(this.email, this.key, this.username);
        qiscus.init({
          AppId: 'dragonfly',
          options: { description: this.description },
          newMessagesCallback: function(Data){
            
          }
        });
        this.$store.dispatch('toggleInit');
        this.toggleChatWindow();
      }
    }
  }
</script>

<style lang="scss">
  .qcw-init-config { 
    label {
      display: block;
      font-size: 14px;
    } 
    input, button, textarea {
      display: inline-block;
      width: 100%;
      padding: 5px 7px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin: 5px 0 15px 0;
    }
    button {
      background: #8bc;
      cursor: pointer;
      color: #FFF; border: 0;
      padding: 15px;
      font-weight: bold;
      text-shadow: 0 -1px 0 rgba(0,0,0,.3);
    }
  }
  .qcw-config-form {
    padding: 20px;
  }
</style>