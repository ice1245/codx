<template>
  <div class="qa flex flex-col">
    <div class="flex flex-row mb-4">
      <div class="flex flex-col m-2 text-center justify-between bg-base-300 p-2 rounded">
        <div class="">
          <div>{{ qa.votes }}</div>
          <div class="-mt-2"><small>votes</small></div>
        </div>
        <button class="btn btn-sm btn-accent mt-2 ">
          <HeartIcon class="w-5 mr-1" />
              Vote
        </button> 
      </div>
      <div class="flex flex-col mt-2">
        <div class="text-primary">
          <h3><strong>{{ qa.title }}</strong></h3>
        </div>
        <div>
          <div class="badge badge-outline"
            v-for="(tag, tix) in qa.tags" :key="tix">
            {{ tag }}
          </div>
          <div class="mt-6">
            <strong><small>Asked on: 10/10/2022</small></strong>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full ml-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div v-for="(entry, eix) in qa.answers" :key="eix">
        <div class="flex flex-row w-full">
          <div class="flex flex-col">
            <Avatar :url="entry.user.avatar" class="mb-2" />
            <small><strong>@{{ entry.user.username }}</strong></small>
          </div>
          <div class="grow qa-body ml-4 mr-10 mb-6">
            <div class="px-4 py-3 bg-neutral-focus text-neutral-content mb-2 rounded">{{ entry.text }}</div>
            <div class="flex flex-row justify-end">
              <button class="btn btn-xs btn-info gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 stroke-current">   
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>                       
                </svg>
                    Tiny
              </button> 
              <button class="btn btn-xs btn-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 stroke-current">   
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>                       
                </svg>
                    Tiny
              </button> 
              <button class="btn btn-xs">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 stroke-current">   
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>                       
                </svg>
                    Tiny
              </button>  
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t gap-2 border-slate-600/50 h-1/3 w-full pt-4">
      <div class="flex flex-row items-center w-full gap-6 px-4">
        <input
          type="text"
          id="search"
          class="input block focus:outline-none text-sm border-gray-300 rounded grow"
          placeholder="Type messages"
          v-model="message"
          @keydown.enter="sendMessage"
        />
        <EmojiHappyIcon class="cursor-pointer w-5 h-5 text-primary" />
        <PaperClipIcon class="cursor-pointer w-5 h-5  text-primary" />
        <div>
          <button
            class="bg-primary text-neutral-content md:w-14 w-10 md:h-12 h-10 flex items-center justify-center rounded-lg"
          >
            <ChatAltIcon class="cursor-pointer md:w-6 w-5 t" @click="sendMessage" />
          </button>
        </div>
      </div>
    </div>
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
export default {
  components: {
    HeartIcon,
    EmojiHappyIcon,
    PaperClipIcon,
    ChatAltIcon,
    Avatar
  },
  props: ['qa']
}
</script>