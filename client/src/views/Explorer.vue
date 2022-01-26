<template>
  <div>
    <div class="mt-2 mb-6 w-full">
      <label class="input-group input-group-sm w-full">
        <input type="text" placeholder="Search..." class="input input-bordered input-sm w-full"> 
        <span class="cursor-pointer">Go</span>
      </label>
    </div>

    <div
      :class="['text-base pl-3 cursor-pointer mb-2', liveClinics.length ? 'font-bold' : '']"
      @click="$emit('coding-clinics')"
    >
      <FireIcon class="h-5 w-5 float-left mr-2" v-if="false"/>
      <img src="https://www.meetnav.com/logo.png" class="w-6 h-6 float-left mr-1" />
      Coding clinics
    </div>
    <div class="text-base pl-3 cursor-pointer mb-2"><ChatAltIcon class="h-5 w-5 float-left mr-2" />Recent</div>
    <div class="text-base pl-3 cursor-pointer mb-2"><StarIcon class="h-5 w-5 float-left mr-2" />Starred messaged</div>

    <div class="text-base pl-3 mt-3 cursor-pointer"
      @click="channelsOpen = !channelsOpen"
    >
      <ChevronDownIcon class="h-5 w-5 float-left mr-2" v-if="channelsOpen" />
      <ChevronUpIcon class="h-5 w-5 float-left mr-2" v-else />
      Channels
    </div>
    <div class="text-base pl-3"></div>

    <div
      class="space-y-1.5 overflow-y-auto pb-12 lg:pb-0"
      style="max-height: calc(100vh - 280px)"
      v-if="channelsOpen"
    >
      <div class="text-base pl-3 cursor-pointer ml-3 mt-2"
        v-for="(channel, ix) in $storex.chat.channels" :key="ix"
      >
        <HashtagIcon class="h-5 w-5 float-left mr-2" />{{ channel.name }}
      </div>
      <div class="text-base pl-3 cursor-pointer ml-3 mt-2">
        <PlusIcon class="h-5 w-5 float-left mr-2" /> New channel
      </div>
    </div>

    <div class="text-base pl-3 mt-3 cursor-pointer"
      @click="directMessagesOpen = !directMessagesOpen"
    >
      <ChevronDownIcon class="h-5 w-5 float-left mr-2" v-if="directMessagesOpen" />
      <ChevronUpIcon class="h-5 w-5 float-left mr-2" v-else />
      Direct messages
    </div>
    <div
      class="space-y-1.5 overflow-y-auto pb-12 lg:pb-0"
      style="max-height: calc(100vh - 280px)"
      v-if="directMessagesOpen"
    >
      <div
        v-for="(chat, ix) in $storex.chat.chats" :key="ix"
        :class="['text-base pl-3 cursor-pointer ml-3 mt-2', chat.id === session.lastOpenChat ? 'font-bold' : '']"
        @click="$emit('open-chat', chat)"
      >
        <AtSymbolIcon :class="['h-5 w-5 float-left mr-2']" />
          <span :data-id="chat.id">{{ chat.users.map(u => u.username).join(" - ") }}</span>
      </div>
      <div class="text-base pl-3 cursor-pointer ml-3 mt-2" @click="$emit('new-chat')">
        <PlusIcon class="h-5 w-5 float-left mr-2" /> New chat
      </div>
    </div>
  </div>
</template>

<script>
import * as Heroicons from '@heroicons/vue/outline'
export default {
  components: {
    ...Heroicons
  },
  data() {
    return {
      channelsOpen: true,
      directMessagesOpen: true
    }
  },
  computed: {
    liveClinics () {
      const { clinics } = this.$storex.clinic
      return clinics || []
    },
    session () {
      return this.$storex.user.session
    }
  }
};
</script>
