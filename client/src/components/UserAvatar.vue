<template>
  <div :class="['avatar indicator not-prose',
      user.online ? 'online' : ''
    ]"
    :title="'@' + user.username">
  <div :class="avatarClass">
    <span class="indicator-item badge badge-secondary" v-if="video && !muted">
      <MicrophoneIcon class="w-4 animate-pulse" />
    </span> 
    <video
      autoplay
      :muted="video.type === 'local'"
      :src-object.prop.camel="video.stream"
      v-if="video && !paused"
      class="rounded-md object-fill z-0"
    ></video>
    <img :src="user.avatar" :width="size || 12" :height="size || 12" :class="user.online ? '' : 'grayscale'" v-else>
  </div>
</div> 
</template>
<script>
import {
  MicrophoneIcon,
} from "@heroicons/vue/outline"
export default {
  components: {
    MicrophoneIcon
  },
  props: ['user', 'size', 'ring'],
  computed: {
    video () {
      const { video } = this.user
      return video
    },
    paused () {
      const { video } = this.user
      return video && video.paused
    },
    muted () {
      const { video } = this.user
      return video && video.muted
    },
    avatarClass () {
      const { user, video, paused, size, ring } = this
      return video && !paused ? 'rounded-btn w-24 h-12' :
        [`bg-neutral-focus rounded-full w-${size || 12} h-${size || 12}`, (ring ? `ring ring-primary ring-offset-base-${ring} ring-offset-2` : '')]
    }
  }
}
</script>
<style lang="scss">
  .avatar {
    video {
      height: 100%;
    }
  }
</style>