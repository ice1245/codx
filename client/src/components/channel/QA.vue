<template>
  <div class="border-l qa flex flex-col justify-between">
    <div class="flex flex-row mb-4 h-1/6">
      <div class="flex flex-col m-2 text-center justify-between bg-base-300 p-2 rounded h-full">
        <div class="text-secondary">
          <h2>{{ qa.votes || 0 }}</h2>
          <h3 class="-mt-2"><small>votes</small></h3>
        </div>
        <button class="btn btn-sm btn-accent mt-2 ">
          <HeartIcon class="w-5 mr-1" />
              Vote
        </button> 
      </div>
      <div class="flex flex-col pt-2 h-full justify-between">
        <div class="text-primary prose">
          <h3><strong>{{ question.content }}</strong></h3>
        </div>
        <div>
          <div class="badge badge-outline"
            v-for="(tag, tix) in qa.tags" :key="tix">
            {{ tag }}
          </div>
        </div>
        <strong><small>Asked on: 10/10/2022</small></strong>
      </div>
    </div>

    <ChatBox :chat="chat" />
  </div>
</template>
<script>
import {
  HeartIcon,
  EmojiHappyIcon,
  PaperClipIcon,
  ChatAltIcon
   } from "@heroicons/vue/outline"
import Avatar from '@/components/Avatar.vue'
import ChatBox from '@/components/chat/ChatBox.vue'
export default {
  components: {
    HeartIcon,
    EmojiHappyIcon,
    PaperClipIcon,
    ChatAltIcon,
    Avatar,
    ChatBox
  },
  props: ['qa'],
  computed: {
    question () {
      return this.qa.chat_message
    },
    chat () {
      return this.qa.chat_message.chat
    }
  }
}
</script>