<template>
  <div class="hero min-h-screen relative">
    <iframe class="w-full h-full" src="/landing/index.html" frameborder="0" @unload="onClose" ref="landing" >
    </iframe>
    <button class="btn btn-warning absolute bottom-4 drop-shadow-lg left-2 right-2" @click="onClose"> Let's go!</button>
  </div>
</template>
<script>
export default {
  mounted () {
    const { landing: { contentWindow: { document: idocument } } } = this.$refs
    const closeEls = [...idocument.getElementsByClassName("close-me")]
    closeEls.forEach(e => e.addEventListener('click', console.log))
  },
  methods: {
    async onClose () {
      await this.$storex.search.academyCourses()
      this.$emit('close')
    }
  }
}
</script>