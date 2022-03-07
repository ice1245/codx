<template>
  <div class="channel flex flex-col relative bg-base-800">
    <div class="navbar mb-2 shadow-lg bg-neutral-focus">
      <div class="flex-1 px-2 mx-2">
        <span class="text-lg font-bold"># {{ channel.name }}</span>
      </div>
      <div class="flex-none hidden px-2 mx-2 lg:flex">
        <div class="flex items-stretch">
          <a class="btn btn-ghost btn-sm rounded-btn" @click="newEntry = true">
            <PlusCircleIcon class="inline-block w-5 mr-2 stroke-current" />
                New...
          </a> 
          <a class="btn btn-ghost btn-sm rounded-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 mr-2 stroke-current">              
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>            
            </svg>
                  Likes
          </a> 
          <a class="btn btn-ghost btn-sm rounded-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 mr-2 stroke-current">     
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>                     
            </svg>
                  Notifications
          </a> 
          <a class="btn btn-ghost btn-sm rounded-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 mr-2 stroke-current">          
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>                
            </svg>
                  Files
          </a>
        </div>
      </div> 
      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">           
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>               
          </svg>
        </button>
      </div>
    </div>

    <div class="popup absolute top-10 w-full z-10 drop-shadow-lg" v-if="newEntry">
      <div class="alert shadow-lg w-2/3 m-auto mt-10 flex flex-col gap-4">
        <div>
          <FireIcon class="w-12 mr-2" />
          <span>{{ channel.description }}</span>
        </div>
        <ChatInputArea @send-message="createEntry" editing="true"
          placeholder="What's on your mind?"
          @abort-editing="newEntry = false"
        />
      </div>
    </div>
    <div class="channel-body flex h-full flew-col">
      <div class="channel-results pl-2 pr-4 w-1/3 grow">
          <QAList
            class="w-full h-full"
            :results="channel.entries"
            @show-qa="openQA"
          />
      </div>
      <QA class="w-5/6 bg-info-focus text-info-content"
        :qa="currentQA"
        v-if="currentQA">
      </QA>
    </div>
  </div>
</template>
<script>
import { FireIcon, PlusCircleIcon } from '@heroicons/vue/solid'
import QAList from './QAList.vue'
import QA from './QA.vue'
import ChatInputArea from '@/components/chat/ChatInputArea.vue'
export default {
  components: {
    PlusCircleIcon,
    FireIcon,
    QAList,
    QA,
    ChatInputArea
  },
  props: ['channel'],
  data () {
    return {
      currentQA: null,
      newEntry: true
    }
  },
  created () {
    this.newEntry = this.isEmptyChannel
  },
  computed: {
    isEmptyChannel () {
      const { channel } = this
      return !channel.entries || channel.entries.length === 0
    }
  },
  methods: {
    createEntry (entry) {
      this.newEntry = false
      const { channel } = this
      this.$storex.channel.newEntry({ channel, entry })
    },
    async openQA (qa) {
      const { chat_message: { chat: { id } } } = qa
      qa.chat_message.chat = await this.$storex.chat.refreshChat({ id, isChannel: true })
      // Skip QA message
      qa.chat_message.chat.messages.splice(0, 1)
      this.currentQA = qa
    }
  }
}
</script>