<template>
  <div>
    <div class="flex items-end justify-start" v-if="!isMe">
        <div>
          <div class="h-9 w-10">
            <Avatar :url="message.from.avatar" />
          </div>
        </div>
        <div class="flex items-start space-x-1 chat">
          <div class="ml-3 w-full flex flex-col items-start">
            <div
              class="bg-primary text-primary-content w-full rounded-lg rounded-bl-none text-right p-3 px-5 space-y-1"
            >
              <div
                v-for="(entry, ix) in message.entries" :key="ix"
              >
                <p class="text-2xs flex items-center justify-end" v-if="entry.createdAt">
                  <ClockIcon class="w-3 mr-0.5" />
                  {{ formatTime(entry) }}
                </p>
                <h3 class="ttext-md md:text-base prose lg:prose-lg xl:prose-xl">
                  <div v-html="formatMessage(entry)"></div>
                </h3>
              </div>
            </div>
            <div class="arrow_icon_left bg-primary text-primary-content w-3 h-3"></div>

            <p class="text-sm font-medium ">{{ message.from.username }}</p>
          </div>
          <div class="hidden md:block mt-2">
            <MessageOptions
              menuItemClass="-left-2 -mt-1"
              imgClass="w-6 transform rotate-90"
            />
          </div>
          <EmojiHappyIcon
            class="cursor-pointer md:w-7 w-5 mt-1.5 text-primary emojiicon"
          />
        </div>
      </div>
<!-- RIGHT -->
      <div class="flex items-end justify-end" v-else>
        <div class="flex space-x-1 items-start chat">
          <EmojiHappyIcon
            class="cursor-pointer md:w-6 w-4 mt-1.5 text-primary emojiicon"
          />
          <div class="hidden md:block mt-2">
            <MessageOptions
              menuItemClass="-left-2 -mt-1"
              imgClass="w-5 transform rotate-90"
            />
          </div>
          <div class="w-full flex flex-col items-end">
            <div
              class="bg-secondary text-secondary-content rounded-lg rounded-br-none text-left p-3 px-5 space-y-1"
            >
              <div
                v-for="(entry, ix) in message.entries" :key="ix"
              >
                <p class="text-2xs flex items-center" v-if="entry.createdAt">
                  <ClockIcon class="w-3 mr-0.5" />
                  {{ formatTime(entry) }}
                </p>
                <h3 class="ttext-md md:text-base">
                  <div v-html="formatMessage(entry)" class="prose"></div>
                </h3>
              </div>
            </div>
            <div class="arrow_icon_right w-3 h-3"></div>
            <p class="text-sm font-medium ">{{ message.from.username }}</p>
          </div>
        </div>
        <div class="">
          <div class="ml-3 h-9 w-10">
            <Avatar :url="message.from.avatar" />
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import moment from 'moment'
import {
  ClockIcon,
  EmojiHappyIcon
} from "@heroicons/vue/outline";
import MessageOptions from './MessageOptions.vue'
import Avatar from './Avatar.vue'

export default {
  components: {
    ClockIcon,
    EmojiHappyIcon,
    MessageOptions,
    Avatar
  },
  props: ['isMe', 'message'],
  methods: {
    formatMessage (message) {
      return message.content
    },
    formatTime (message) {
      return moment(message.createdAt).format("hh:mm")
    }
  }
}
</script>
