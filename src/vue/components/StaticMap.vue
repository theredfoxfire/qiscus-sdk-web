<template>
  <div>
    <div v-if="canBeRendered">
      <a :href="mapurl" target="_blank">
        <img :src="google_map_url" :alt="name">
      </a><br>
      <strong>{{ name }}</strong>
    </div>
    <div v-if="!canBeRendered">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'StaticMap',
  props: ['name','message','lat','lng','mapurl'],
  data() {
    return {
      google_map_url: null,
      canBeRendered: false,
    }
  },
  mounted() {
    if(qiscus.options.google_key) {
      this.canBeRendered = true;
      this.google_map_url = `https://maps.googleapis.com/maps/api/staticmap?center=${this.lat},${this.lng}&size=250x100&zoom=14&key=${qiscus.options.google_key}`;
    }
  }
}
</script>

