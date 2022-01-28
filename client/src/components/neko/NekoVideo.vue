<template>
  <div class="neko-video">
    <NekoVideo style="            
          border: none;
          width: 100%;
          height: 100%;
        " ref="nekoVideo"
      />
  </div>
</template>
<script>
import { user, neko } from "@/views/mixins"
import nekoExport from './neko'
const { NekoVideo } = nekoExport

export default {
  mixins: [user, neko],
  props: ["nekoId"],
  components: {
    NekoVideo
  },
  data () {
    return {
      roomId: this.$props.nekoId || "roomId-0"
    }
  },
  mounted () {
    this._onOverlayClick = this.overlayClick.bind(this)
    const { overlay } = this.$refs.nekoVideo.$refs
    overlay.addEventListener('click', this._onOverlayClick)
  },
  beforeUnmount () {
    const { overlay } = this.$refs.nekoVideo.$refs
    overlay.removeEventListener('click', this._onOverlayClick)
  },
  methods: {
    overlayClick () {
      this.requestControl()
    },
    requestControl () {
      this.$neko.requestControl(this.roomId)
    }
  }
} 
</script>
<style lang="sass">
.neko-video
  .player-container
    margin: auto
    position: relative
  .player-aspect,
  .emotes,
  .video-menu
    display: none
  video
    width: 100%
  .overlay
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    height: 100%
    &:focus-visible
      outline: none
</style>
