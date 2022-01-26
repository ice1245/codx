<template>
  <div class="h-screen overflow-y-auto">
    <Notifications />
    <router-view />
  </div>
</template>
<script>
import Notifications from '@/components/Notifications.vue'
import { themeChange } from 'theme-change'
export default {
  components: {
    Notifications
  },
  mounted () {
    themeChange(false)
  }
}
</script>