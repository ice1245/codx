<template>
  <div class="h-screen overflow-y-auto">
    <Notifications />
    <router-view />
  </div>
</template>
<script>
import Notifications from '@/components/Notifications.vue'
export default {
  components: {
    Notifications
  }
}
</script>