<template>
  <div class="hero min-h-screen relative">
    <iframe class="w-full h-full" :src="url" frameborder="0" @unload="onClose" ref="landing" >
    </iframe>
  </div>
</template>
<script>
export default {
  computed: {
    url () {
      const { CMS_DOMAIN } = process.env
      return CMS_DOMAIN ? `https://${CMS_DOMAIN}` : '/landing/index.html'
    }
  }
}
</script>