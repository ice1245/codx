<template>
  <div class="hero min-h-screen relative">
    <iframe class="w-full h-full" src="/landing/index.html" frameborder="0" @unload="onClose" ref="landing" >
    </iframe>
    <div class="absolute bottom-4 left-2 right-6 flex gap-4">
      <button class="btn btn-primary grow" @click="$router.push('/signup')"> Register!</button>
      <button class="btn btn-warning grow" @click="onClose"> Show me more!</button>
    </div>
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