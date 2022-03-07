<template>
  <div class="neko-room w-full h-full relative p-2">
    <iframe :class="['w-full h-full', loading ? 'opacity-0' : '']" :src="pageReady ? `${url}&ts=${ts}` : ''" frameborder="0" ref="nekoFrame" @load="onLoad()" v-if="pageReady">
    </iframe>
    <div class="absolute top-0 left-0 right-0 bottom-0 place-content-center prose" v-if="loading">
      <h2>Setting up room</h2>
      <div class="loading">
        <div class="p-6 space-y-2 artboard phone animate-pulse">
          <progress class="progress progress-accent" :value="checkCount" max="100"></progress> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: ['room'],
  data () {
    return {
      pageReady: false,
      loading: true,
      checkCount: 1,
      ts: new Date().getTime(),
      checkTout: null
    }
  },
  computed: {
    url () {
      const { url, nekoPassword } = this.room
      const { user: { username } } = this.$storex.user
      return `${url}/?pwd=${nekoPassword}&displayName=${username}`
    },
    testUrl () {
      const { url, nekoPassword } = this.room
      const { user: { username } } = this.$storex.user
      return `${url}/emoji.json?pwd=${nekoPassword}&displayName=${username}`
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
  created () {
    this.checkPage()
  },
  destroyed () {
    clearInterval(this.checkTout)
  },
  methods: {
    async checkPage () {
      this.checkCount = this.checkCount + 1
      try {
        await axios.get(this.testUrl)
        this.checkCount = 100
        setTimeout(() => this.pageReady = true, 300)
      } catch {
        this.checkTout = setTimeout(() => this.checkPage(), 5000)
      }
    },
    onLoad () {
      if (!this.overlay) {
        this.ts = new Date().getTime()
        setTimeout(() => this.onLoad(), 1000)
        return
      }
      const style = `
        <style>
          body p,
          .room-container,
          .header-container,
          .video-menu.bottom,
          .video-menu.top .fa-expand,
          .neko-menu
          {
            display: none !important;
          }
          html,
          body,
          .video-container,
          .video .player {
            background-color: transparent !important;
          }
        </style>`
      this.document.head.insertAdjacentHTML("beforeend", style)
      this.overlay.addEventListener('click', ev => {
        this.neko.remote.request()
      })
      this.room.neko = this.neko
      this.loading = false
    }
  }
}
</script>