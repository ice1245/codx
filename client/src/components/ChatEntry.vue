<template>
  <div>
    <div class="flex items-end justify-start" v-if="left">
        <div>
          <div class="h-9 w-10">
            <Avatar :url="message.avatar" />
          </div>
        </div>
        <div class="flex items-start space-x-1 chat">
          <div class="ml-3 w-full flex flex-col items-start">
            <div
              class="bg-primary w-full rounded-lg rounded-bl-none text-right p-3 px-5 space-y-1"
            >
              <h3 class="text-white text-md md:text-base">{{ formatMessage(message) }}</h3>
              <p class="text-gray-200 text-2xs flex items-center justify-end">
                <ClockIcon class="w-3 mr-0.5" />
                {{ formatTime(message) }}
              </p>
            </div>
            <div class="arrow_icon_left bg-primary w-3 h-3"></div>

            <p class="text-sm font-medium text-gray-200">{{ message.username }}</p>
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
              class="bg-black-300 rounded-lg rounded-br-none text-left p-3 px-5 space-y-1"
            >
              <h3 class="text-white text-right text-md md:text-base">
                {{ formatMessage(message) }}
              </h3>
              <p class="text-gray-200 text-2xs flex items-center">
                <ClockIcon class="w-3 mr-0.5" />
                {{ formatTime(message) }}
              </p>
            </div>
            <div class="arrow_icon_right bg-black-300 w-3 h-3"></div>
            <p class="text-sm font-medium text-gray-200">{{ message.username }}</p>
          </div>
        </div>
        <div class="">
          <div class="ml-3 h-9 w-10">
            <Avatar :url="message.avatar" />
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
  props: ['left', 'message'],
  methods: {
    formatMessage (message) {
      return message.content.message
    },
    formatTime (message) {
      return moment(message.ts).fromNow()
    }
  }
}
</script>
