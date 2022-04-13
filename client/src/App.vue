<template>
  <div class="h-screen overflow-y-auto">
    <Notifications />
    <router-view />
  </div>
</template>
<script>
import { themeChange } from 'theme-change'
import Notifications from '@/components/Notifications.vue'
export default {
  components: {
    Notifications
  },
  data () {
    return {
      doLogin: false,
      currentTheme: localStorage.getItem("theme")
    }
  },
  mounted () {
    themeChange(false)
  },
  computed: {
    isMobile () {
      return this.$isMobile()
    }
  },
  methods: {
    login () {
      const { authenticated } = this.$storex.user
      !authenticated && this.$router.push("/login")
      return authenticated
    },
    isDarkMode () {
      const darkThemes = ['dark', 'halloween', 'black', 'luxury', 'dracula', 'forest']
      return darkThemes.indexOf(this.currentTheme) !== -1
    },
    setTheme (theme) {
      this.currentTheme = theme
    }
  }
}
</script>