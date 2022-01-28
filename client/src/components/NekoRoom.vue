<template>
  <iframe class="w-full h-full" :src="url" frameborder="0">
  </iframe>
</template>
<script>
export default {
  props: ['room'],
  computed: {
    url () {
      const { url, user_pass } = this.room.room
      const { user: { username } } = this.$storex.user
      return `${url}?pwd=${user_pass}&name=${username}`
    }
  }
}
</script>