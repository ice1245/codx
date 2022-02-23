<template>
  <div class="h-full relative">
    <div class="flex flex-col justify-between absolute top-0 left-0 right-0 bottom-0">
      <div ref="messageWindow"
        class="h-full overflow-y-auto md:p-6 p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100"
        @scroll="onMessageWindowScroll"
      >
        <div class="chat-date"
          v-for="(dayMessages, dix) in dayMessages" :key="dix"
        >
          <div class="divider mb-6"><span class="bg-neutral text-accent border rounded-lg px-3 py-1">{{ dayMessages.displayDate }}</span></div>
          <div
            class="mb-4"
            v-for="(message, ix) in groupedMessages(dayMessages.messages)" :key="ix"
          >
            <ChatEvent
              :message="message"
              @cancel="onCancelEvent(message)"
              @ok="onConfirmEvent(message)"
              :isMe="me.id === message.from.id"
              v-if="message.event" />
            <ChatEntry
              :isMe="me.id === message.from.id"
              :message="message"
              @edit-message="onEditMessage"
              v-else/>
          </div>
        </div>
      </div>
      <div
        class="md:p-6 p-4 flex items-center md:space-x-5 space-x-3 border-t border-slate-600/50 w-full"
      >
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text" v-if="editing">Editing, press Esc. to cancel</span>
          </label>
          <input type="text" placeholder="Type messages"
            :class="['input block w-full md:px-4 px-3 md:py-3 py-2 focus:outline-none sm:text-base text-sm border-gray-300 rounded',
              editing ? 'border-error' : '']"
            v-model="message"
            @keydown.enter="sendMessage"
            @keydown.esc="abortEditing"
          >
        </div>
        <EmojiHappyIcon class="cursor-pointer md:w-5 w-7 text-primary" />
        <PaperClipIcon class="cursor-pointer md:w-5 w-7 text-primary" />
        <div>
          <button
            class="bg-accent text-accent-content md:w-14 w-10 md:h-12 h-10 flex items-center justify-center rounded-lg"
          >
            <ChatAltIcon class="cursor-pointer md:w-6 w-5 t" @click="sendMessage" />
          </button>
        </div>
        <EyeOffIcon class="cursor-pointer md:w-14 text-error btn btn-outline"
          v-if="closeMe"
          @click="$emit('hide-chat')" />
        
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  ChatAltIcon,
  EmojiHappyIcon,
  PaperClipIcon,
  EyeOffIcon
} from "@heroicons/vue/outline";
import ChatEntry from './ChatEntry.vue'
import ChatEvent from './ChatEvent.vue'
export default {
  components: {
    ChatAltIcon,
    EmojiHappyIcon,
    PaperClipIcon,
    ChatEntry,
    ChatEvent,
    EyeOffIcon
  },
  props: ['show', 'chat', 'closeMe'],
  data() {
    return {
      message: '',
      hasScrolled: false,
      editing: null
    }
  },
  computed: {
    me () {
      return this.$storex.user.user
    },
    dayMessages () {
      !this.hasScrolled && requestAnimationFrame(this.scrollToBottom.bind(this))
      return this.chat.messages
        .filter(m => m.content)
        .reduce((acc, m) => {
          const { createdAt: ts } = m
          const createdAt = moment(ts)
          const displayDate = createdAt.fromNow()
          if (acc.length) {
            const { createdAt: ldd, messages } = acc[acc.length-1]
            const sameDay = createdAt.format("DD-MM-YYYY") === ldd.format("DD-MM-YYYY")
            const closeInTime = createdAt.diff(ldd, 'minutes') < 20
            if (sameDay && closeInTime) {
              messages.push(m)
              return acc
            }
          }
          acc.push({
            createdAt,
            displayDate,
            messages: [m]
          })
          return acc
        }, [])
    }
  },
  mounted () {
    this.scrollToBottom()
  },
  methods: {
    async sendMessage () {
      await this.$storex.chat.sendMessage({
        chat: this.chat,
        ...this.editing,
        content: this.message
      })
      this.abortEditing()
    },
    groupedMessages (messages) {
      const { users } = this.chat
      const grouped = messages
        .reduce((acc, m) => {
          const { id, from, content, createdAt: ts, edited } = m
          const extra = m.extra || {}
          const { event } = extra
          const createdAt = moment(ts)
          if (!event && acc.length) {
            const { id: mid } = from
            const { from: { id: lid }, entries, createdAtFormat: lcatf } = acc[acc.length-1]
            if (lid === mid) {
              const nots = createdAt.diff(lcatf, 'minutes') < 2
              entries.push({
                id,
                content,
                createdAt: nots ? null : m.createdAt,
                edited,
                from: { id: from.id }
              })
              return acc
            }
          }
          acc.push({
            createdAt,
            from: users.filter(u => u.id === from.id)[0],
            entries: [{ id, content, createdAt, extra, from: { id: from.id }, edited }],
            event: event ? extra : null
          })
          return acc
        }, [])
      return grouped
    },
    onCancelEvent (message) {
    },
    async onConfirmEvent (message) {
      this.$emit('on-event-click', message)
    },
    scrollToBottom () {
      const element = this.$refs.messageWindow
      element.scrollTop = element.scrollHeight
    },
    onMessageWindowScroll () {
      const element = this.$refs.messageWindow
      this.hasScrolled =
        Math.abs(element.scrollTop + element.clientHeight - element.scrollHeight) > 10
    },
    onEditMessage (message) {
      this.message = message.content
      this.editing = message
    },
    abortEditing () {
      this.message = null
      this.editing = null
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
