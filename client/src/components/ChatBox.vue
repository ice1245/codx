<template>
  <div class="h-full relative">
    <div class="flex flex-col justify-between absolute top-0 left-0 right-0 bottom-0">
      <div class="h-full overflow-y-auto md:p-6 p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
        <div class="chat-date"
          v-for="(dayMessages, dix) in dayMessages" :key="dix"
        >
          <div class="divider"><span class="text-accent border rounded-lg px-3 py-1">{{ dayMessages.displayDate }}</span></div>
          <ChatEntry
            v-for="(message, ix) in groupedMessages(dayMessages.messages)" :key="ix"
            :left="me.id !== message.from.id"
            :message="message"/>
        </div>
      </div>
      <div
        class="md:p-6 p-4 flex items-center md:space-x-5 space-x-3 border-t border-slate-600/50 w-full"
      >
        <input
          type="text"
          id="search"
          class="input block w-full md:px-4 px-3 md:py-3 py-2 focus:outline-none sm:text-base text-sm border-gray-300 rounded "
          placeholder="Type messages"
          v-model="message"
          @keydown.enter="sendMessage"
        />
        <EmojiHappyIcon class="cursor-pointer md:w-5 w-7 text-primary" />
        <PaperClipIcon class="cursor-pointer md:w-5 w-7 text-primary" />
        <div>
          <button
            class="bg-primary text-primary-content md:w-14 w-10 md:h-12 h-10 flex items-center justify-center rounded-lg"
          >
            <ChatAltIcon class="cursor-pointer md:w-6 w-5 t" @click="sendMessage" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
      message: ''
    }
  },
  computed: {
    me () {
      return this.$storex.user.user
    },
    dayMessages () {
      return this.chat.messages
        .filter(m => m.content)
        .reduce((acc, m) => {
          const { createdAt: ts } = m
          const displayDate = moment(ts).fromNow()
          if (acc.length) {
            const { displayDate: ldd, messages } = acc[acc.length-1]
            if (ldd === displayDate) {
              messages.push(m)
              return acc
            }
          }
          acc.push({
            displayDate,
            messages: [m]
          })
          return acc
        }, [])
    }
  },
  methods: {
    async sendMessage () {
      await this.$storex.chat.sendMessage({
        chat: this.chat,
        content: this.message
      })
      this.message = null
    },
    groupedMessages (messages) {
      const { users } = this.chat
      const grouped = messages
        .reduce((acc, m) => {
          const { from, content, createdAt: ts } = m
          const createdAt = moment(ts)
          if (acc.length) {
            const { id: mid } = from
            const { from: { id: lid }, entries, createdAtFormat: lcatf } = acc[acc.length-1]
            if (lid === mid) {
              const nots = createdAt.diff(lcatf, 'minutes') < 2
              entries.push({
                content,
                createdAt: nots ? null : m.createdAt
              })
              return acc
            }
          }
          acc.push({
            createdAt,
            from: users.filter(u => u.id === from.id)[0],
            entries: [{ content, createdAt }]
          })
          return acc
        }, [])
      return grouped
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
