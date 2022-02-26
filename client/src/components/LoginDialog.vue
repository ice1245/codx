<template>
  <Dialog @close="$emit('close')">
    <Login />
  </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog.vue'
import Login from '@/views/SignIn.vue'
export default {
  components: {
    Dialog,
    Login
  }
}
</script>