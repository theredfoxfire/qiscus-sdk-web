<template>
  <div v-html="rendered_text" class="qcw-comment__content"></div>
</template>

<script>
import EmbedJS from 'embed-js';

export default {
  name: 'CommentRender',
  props: ['text'],
  data() {
    return {
      renderer: new EmbedJS({
        input: this.text,
        excludeEmbed: ['github','youtube'],
        locationEmbed: false,
        emoji: false,
        inlineText: false,
        linkOptions: { target: '_blank' }
      }),
      rendered_text: this.text
    };
  },
  created() {
    const self = this;
    self.renderer.text((data) => {
      self.rendered_text= (typeof emojione != 'undefined') ? emojione.toImage(data) : self.data;
    })
  }
}
</script>

