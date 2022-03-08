<template>
  <div v-html="markdown"></div>
</template>
<script>
import { marked } from 'marked'
export default {
  props: ['source'],
  computed: {
    markdown () {
      return marked.parse(this.source)
    }
  }
}
</script>