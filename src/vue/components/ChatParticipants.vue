<template>
  <ul class="qcw-participants">
    <li v-for="user in users" @click="handleClick(user.email)">
      <strong>{{ user.username }}</strong>
      <small>{{user.email}}</small>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['users', 'clickHandler'],
  methods: {
    handleClick(email) {
      if(!this.clickHandler) return;
      this.clickHandler(email);
    }
  }
}
</script>

<style lang="scss">
.qcw-participants {
  list-style: none;
  margin: 0; padding: 0;
  li {
    line-height: 1.9em;
    border-bottom: 1px dotted #ccc;
    margin: 0 0 0 0;
    padding: 15px 10px 15px 10px;
  }
  li:hover {
    cursor: pointer;
    background: rgba(0,0,0,.1);
  }
  strong, small {
    display: block;
  }
}
</style>
