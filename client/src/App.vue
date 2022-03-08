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
      doLogin: false
    }
  },
  mounted () {
    themeChange(false)
  },
  methods: {
    login () {
      const { authenticated } = this.$storex.user
      !authenticated && this.$router.push("/login")
      return authenticated
    }
  }
}
</script>