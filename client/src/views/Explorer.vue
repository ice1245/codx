<template>
  <div>
    <h4 class="chat-list text-gray-100 text-2xl font-semibold px-3.5 mb-4">EXPLORER</h4>

    <div class="search-box relative rounded-md shadow-sm m-3.5 mt-5" v-if="true">
      <div
        class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"
      >
        <SearchIcon class="text-gray-200 h-5 w-5" />
      </div>
      <input
        type="text"
        id="search"
        class="block w-full px-14 py-3.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-sm border-gray-300 rounded-lg bg-black-300"
        placeholder="Search messages or users"
      />
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <UserAddIcon class="text-gray-200 h-5 w-5" />
      </div>
    </div>

    <div :class="['text-gray-100 text-base pl-3 cursor-pointer', liveClinics.length ? 'font-bold' : '']"><FireIcon class="text-gray-200 h-5 w-5 float-left mr-2" />Live sessions</div>
    <div class="text-gray-100 text-base pl-3 cursor-pointer"><ChatAltIcon class="text-gray-200 h-5 w-5 float-left mr-2" />Recent</div>
    <div class="text-gray-100 text-base pl-3 cursor-pointer"><StarIcon class="text-gray-200 h-5 w-5 float-left mr-2" />Starred messaged</div>

    <div
      class="online-users grid grid-cols-4 nowrap items-center pb-2 mx-3.5 space-x-2.5 overflow-x-auto px-3 pt-6"
      v-if="false"
    >
      <div
        class="flex flex-col items-center justify-end bg-black-300 p-3.5 rounded-lg h-12 cursor-pointer"
        v-for="n in 4"
        :key="n"
      >
        <div class="h-9 w-9 inline-block relative">
          <img
            class="h-9 w-9 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <span
            class="absolute bottom-0.5 right-0.5 block h-1.5 w-1.5 rounded-full ring-1 ring-black-400 bg-green-400"
          />
        </div>
        <p class="text-xs font-semibold text-center pt-0.5 text-gray-100">
          Patrick
        </p>
      </div>
    </div>

    <div class="text-gray-100 text-base pl-3 mt-3 cursor-pointer"
      @click="channelsOpen = !channelsOpen"
    >
      <ChevronDownIcon class="text-gray-200 h-5 w-5 float-left mr-2" v-if="channelsOpen" />
      <ChevronUpIcon class="text-gray-200 h-5 w-5 float-left mr-2" v-else />
      Channels
    </div>
    <div class="text-gray-100 text-base pl-3"></div>

    <div
      class="space-y-1.5 overflow-y-auto pb-12 lg:pb-0"
      style="max-height: calc(100vh - 280px)"
      v-if="channelsOpen"
    >
      <div class="text-gray-100 text-base pl-3 cursor-pointer ml-3 mt-2"
        v-for="(channel, ix) in $storex.chat.channels" :key="ix"
      >
        <HashtagIcon class="text-gray-200 h-5 w-5 float-left mr-2" />{{ channel.name }}
      </div>
      <div class="text-gray-100 text-base pl-3 cursor-pointer ml-3 mt-2">
        <PlusIcon class="text-gray-200 h-5 w-5 float-left mr-2" /> New channel
      </div>
    </div>

    <div class="text-gray-100 text-base pl-3 mt-3 cursor-pointer"
      @click="directMessagesOpen = !directMessagesOpen"
    >
      <ChevronDownIcon class="text-gray-200 h-5 w-5 float-left mr-2" v-if="directMessagesOpen" />
      <ChevronUpIcon class="text-gray-200 h-5 w-5 float-left mr-2" v-else />
      Direct messages
    </div>
    <div
      class="space-y-1.5 overflow-y-auto pb-12 lg:pb-0"
      style="max-height: calc(100vh - 280px)"
      v-if="directMessagesOpen"
    >
      <div
        v-for="(chat, ix) in $storex.chat.chats" :key="ix"
        :class="['text-gray-100 text-base pl-3 cursor-pointer ml-3 mt-2', chat.id === session.lastOpenChat ? 'font-bold' : '']"
        @click="$storex.user.setOpenedChat(chat.id)"
      >
        <AtSymbolIcon :class="['text-gray-200 h-5 w-5 float-left mr-2']" />
          <span :data-id="chat.id">{{ chat.users.map(u => u.username).join(" - ") }}</span>
      </div>
      <div class="text-gray-100 text-base pl-3 cursor-pointer ml-3 mt-2">
        <PlusIcon class="text-gray-200 h-5 w-5 float-left mr-2" /> New chat
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
