<template>
  <div :class="['avatar indicator not-prose',
      user.online && !video ? 'online' : ''
    ]"
    :title="'@' + user.username">
  <div class="absolute z-10">
    <slot name="badges" />
  </div>
  <div :class="[avatarClass]">
    <div :class="['indicator-item badge', muted ? 'badge-error text-black' : 'badge-secondary']" v-if="video">
      <MicrophoneIcon :class="['w-2', muted ? '' : 'animate-pulse']" />
    </div>
    <video
      autoplay
      :muted="video.type === 'local'"
      :src-object.prop.camel="paused ? null : video.stream"
      :poster="paused ? 'https://cdn.dribbble.com/users/2208826/screenshots/6286951/guanxian.gif' : ''"
      v-if="video"
      class="rounded-md object-fill z-0"
    ></video>
    <img :src="user.avatar" :width="size || 12" :height="size || 12" :class="user.online ? '' : 'grayscale'" v-else>
  </div>
</div> 
</template>
<script>
import {
  MicrophoneIcon
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
      const { user, video, size, ring } = this
      return video ? 'rounded-btn w-24 h-12' :
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