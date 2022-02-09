<template>
  <div :class="['avatar', user.online ? 'online' : '' ]">
  <div :class="avatarClass">
    <video
      autoplay
      :muted="video.type === 'local'"
      :src-object.prop.camel="video.stream"
      v-if="video"
      class="rounded-md object-fill z-0"
    ></video>
    <img :src="user.avatar" v-else>
  </div>
</div> 
</template>
<script>
export default {
  props: ['user', 'size', 'ring'],
  computed: {
    avatarClass () {
      const { user: { video },size, ring } = this
      return video ? 'rounded-btn w-24 h-12' :
        [`bg-primary rounded-full w-${size || 12} h-${size || 12}`, (ring ? `ring ring-primary ring-offset-base-${ring} ring-offset-2` : '')]
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