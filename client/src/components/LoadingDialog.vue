<template>
  <Dialog
    :btns="[]"
    @close="$emit('close')"
  >
    <template v-slot:icon>
      <div/>
    </template>
    <button class="btn btn-xs btn-accent loading">loading...</button>
  </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog.vue'
export default {
  components: {
    Dialog
  }
}
</script>