<template>
  <img :src="logoUrl" />
</template>
<script>
export default {
  computed: {
    logoUrl () {
      const isDark = this.$root.isDarkMode()
      return isDark ? '/logo.png' : '/logo-light.png'
    }
  }
}
</script>