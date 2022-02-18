<template>
  <div>
    <div class="mt-2 mb-6 w-full">
      <label class="input-group input-group-sm w-full">
        <input type="text" placeholder="Search..." class="input input-bordered input-sm w-full"> 
        <span class="cursor-pointer text-base-content">Go</span>
      </label>
    </div>

    <div
      :class="['text-base pl-3 cursor-pointer mb-2', liveClinics.length ? 'font-bold' : '']"
      @click="$emit('coding-clinics')"
    >
      <TerminalIcon class="h-5 w-5 float-left mr-2" />
      Coding clinics
    </div>
    <div class="text-base pl-3 cursor-pointer mb-2 flex flex-row group" v-if="showTasks" @click="$emit('task-manager')">
      <MapIcon class="h-5 w-5 float-left mr-2" />Tasks assigned <strong>(10)</strong>
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
        @click="$emit('open-channel', channel)"
      >
        <HashtagIcon class="h-5 w-5 float-left mr-2" />{{ channel.name }}
      </div>
      <div class="text-base pl-3 cursor-pointer ml-3 mt-2"
        @click="createNewChannel = true"
      >
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
        :class="['text-base pl-3 cursor-pointer ml-3 mt-2 flex felx-row group justify-between', chat.id === session.lastOpenChat ? 'font-bold' : '']"
        @click="$emit('open-chat', chat)"
      >
          <div class="grow">
            <AtSymbolIcon :class="['h-5 w-5 float-left mr-2']" />
            <span :data-id="chat.id">{{ chatName(chat)}}</span>
          </div>
          <div class="group-hover:visible invisible ml-4 pt-1">
            <TrashIcon class="w-5" @click.stop="confirmDeleteChat = chat" />
          </div>
      </div>
      <div class="text-base pl-3 cursor-pointer ml-3 mt-2" @click="$emit('new-chat')">
        <PlusIcon class="h-5 w-5 float-left mr-2" /> New chat
      </div>
    </div>
    <Dialog
      v-if="confirmDeleteChat"
      @close="confirmDeleteChat = null"
      @ok="deleteConfirmChat"
    >
      <div class="prose">
        <h3>Delete chat {{ chatName(confirmDeleteChat) }}</h3>
      </div>
    </Dialog>
    <LoadingDialog v-if="loading" />
    <ChannelCreateDialog v-if="createNewChannel" @close="createNewChannel = false" />
  </div>
</template>

<script>
import {
  TerminalIcon,
  AtSymbolIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  HashtagIcon,
  ChatAltIcon,
  StarIcon,
  MapIcon,
  TrashIcon
} from '@heroicons/vue/outline'
import Dialog from '@/components/Dialog.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import ChannelCreateDialog from '@/components/channel/ChannelCreateDialog.vue'
export default {
  components: {
    TerminalIcon,
    AtSymbolIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlusIcon,
    HashtagIcon,
    ChatAltIcon,
    StarIcon,
    MapIcon,
    TrashIcon,
    Dialog,
    LoadingDialog,
    ChannelCreateDialog
  },
  data() {
    return {
      channelsOpen: true,
      directMessagesOpen: true,
      confirmDeleteChat: null,
      loading: false,
      createNewChannel: false
    }
  },
  computed: {
    liveClinics () {
      const { clinics } = this.$storex.clinic
      return clinics || []
    },
    session () {
      return this.$storex.user.session
    },
    currentCompany () {
      return this.$storex.company.currentCompany || { settings: {} }
    },
    showTasks () {
      const { settings } = this.currentCompany
      return settings?.tasks
    }
  },
  methods: {
    async deleteConfirmChat () {
      this.loading = true
      if (this.$storex.chat.openedChat === this.confirmDeleteChat) {
        this.$emit('coding-clinics')
      }
      await this.$storex.chat.deleteChat(this.confirmDeleteChat)
      this.confirmDeleteChat = null
      this.loading = false
    },
    chatName (chat) {
      return chat.users.map(u => u.username).join(" - ") 
    }
  }
};
</script>
