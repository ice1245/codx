<template>
  <Dialog :btns="['ok']">
    <template v-slot:icon>
      <ShareIcon class="w-8" />
    </template>
    Share
  </Dialog>
</template>
<script>
import {
  ShareIcon
} from '@heroicons/vue/solid'
import Dialog from '@/components/Dialog.vue'
export default {
  components: {
    Dialog
  }
}
</script>