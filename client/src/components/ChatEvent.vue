<template>
  <div class="alert w-1/3 flex flex-row justify-between mx-auto">
    <Avatar :url="message.from.avatar" />
    <div class="mx-3 grow">
      <label>{{ content }}</label>
    </div>
    <button class="btn btn-sm btn-primary" @click="$emit('ok')">
        <CameraIcon class="w-6" v-if="event === 'call'" />
        <TerminalIcon class="w-6" v-if="event === 'clinic'" />
        <span class="ml-2">Join</span>
      </button>
  </div>
</template>
<script>
import {
  CameraIcon,
  TerminalIcon
} from '@heroicons/vue/solid'
import Avatar from '@/components/Avatar.vue'
export default {
  components: {
    CameraIcon,
    TerminalIcon,
    Avatar
  },
  props: ['isMe', 'message', 'user'],
  computed: {
    content () {
      return this.message.entries[0].content
    },
    event () {
      return this.message.entries[0].extra.event
    }
  }
}
</script>