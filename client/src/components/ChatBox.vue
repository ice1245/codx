<template>
  <div class="flex flex-col justify-between text-gray-200 h-full">
    <div class="h-full overflow-y-auto md:p-6 p-4 space-y-6">
      <ChatEntry
        v-for="(message, ix) in chat.messages" :key="ix"
        :left="me.id !== message.from"
        :message="buildMessage(message)"/>
    </div>
    <div
      class="md:p-6 p-4 flex items-center md:space-x-5 space-x-3 border-t border-gray-900 border-opacity-20 w-full"
    >
      <input
        type="text"
        id="search"
        class="block w-full md:px-4 px-3 md:py-3 py-2 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 rounded bg-black-300"
        placeholder="Type messages"
      />
      <EmojiHappyIcon class="cursor-pointer md:w-5 w-7 text-primary" />
      <PaperClipIcon class="cursor-pointer md:w-5 w-7 text-primary" />
      <div>
        <button
          class="bg-primary md:w-14 w-10 md:h-12 h-10 flex items-center justify-center rounded-lg"
        >
          <ChatAltIcon class="cursor-pointer md:w-6 w-5 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChatAltIcon,
  EmojiHappyIcon,
  PaperClipIcon
} from "@heroicons/vue/outline";
import ChatEntry from './ChatEntry.vue'
export default {
  components: {
    ChatAltIcon,
    EmojiHappyIcon,
    PaperClipIcon,
    ChatEntry
  },
  props: ['show', 'chat'],
  data() {
    return {
    }
  },
  computed: {
    me () {
      return this.$storex.user.user
    }
  },
  methods: {
    buildMessage (message) {
      const { users } = this.chat
      const { from } = message
      const res = {
        ...message,
        ...users.filter(u => u.id === from)[0]
      }
      return res
    }
  }
};
</script>
<style>
.chat:hover .emojiicon {
  visibility: visible;
  transition: all;
}
.chat .emojiicon {
  visibility: hidden;
}
.arrow_icon_left {
  clip-path: polygon(100% 0, 0 0, 0 100%);
}
.arrow_icon_right {
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}
</style>
