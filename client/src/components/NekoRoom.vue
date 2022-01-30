<template>
  <iframe class="w-full h-full" :src="url" frameborder="0" ref="nekoFrame" @load="onLoad">
  </iframe>
</template>
<script>
export default {
  props: ['room'],
  computed: {
    url () {
      const { url, user_pass } = this.room.room
      const { user: { username } } = this.$storex.user
      return `${url}?pwd=${user_pass}&displayName=${username}`
    },
    document () {
      const { nekoFrame: { contentWindow: { document } } } = this.$refs
      return document
    },
    $client () {
      const { nekoFrame: { contentWindow: { $client } } } = this.$refs
      return $client
    },
    neko () {
      const { $vue: { $accessor: neko } } = this.$client
      return neko
    },
    overlay () {
      return this.document.getElementsByClassName('overlay')[0]
    }
  },
  methods: {
    onLoad () {
      const style = `
        <style>
          .room-container,
          .header-container,
          .video-menu.bottom {
            display: none !important;
          }
        </style>`
      this.document.head.insertAdjacentHTML("beforeend", style)
      this.overlay.addEventListener('click', ev => {
        this.neko.remote.request()
      })
    }
  }
}
</script>