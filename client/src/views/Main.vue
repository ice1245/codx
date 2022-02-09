<template>
  <div class="lg:flex h-screen overflow-hidden">
    <SideBar @sideBar="toggleSideBar" class="bg-neutral-focus text-neutral-content" />
    <div class="bg-neutral text-neutral-content tmd:p-3 p-2 py-5 h-full lg:w-96 w-full"
      v-if="showLeftBar"
    >
      <Explorer v-if="explorerVisible"
        @coding-clinics="onCodingClinics"
        @open-chat="chat => onOpenChat(chat)"
        @open-channel="onOpenChannel"
        @new-chat="onNewChat"
      />
      <Profile v-if="profileVisible" :user="$storex.user.user"/>
    </div>
    <div class="lg:flex w-full h-full grow">
      <div class="lg:flex flex-col h-full w-full">
        <SearchResults
          v-if="showCodingClinics"
          class="h-full w-full"
          @new-clinic="onResultsNewCodingClinic"
        />
        <Channel
          v-if="showChannel"
          class="h-full w-full"
          :channel="$storex.channel.currentChannel"
        />  
        <Header
          :chat="$storex.chat.openedChat"
          :explorerVisible="explorerVisible"
          :chatVisible="chatVisible"
          @coding-clinic="clinicList = true"
          @leave-clinic="leaveClinic"
          @close-explorer="sideBar = ''"
          @open-explorer="sideBar = 'explorer'"
          @toggle-chat="toggleChatHidden"
          v-if="showHeader"
        />
        <div class="lg:flex flex-row hidden h-full w-full">
          <div class="grow" v-if="currentClinic">
            <NekoRoom
              :room="currentClinic"
            />
          </div>
          <ChatBox class="grow"
            :chat="$storex.chat.openedChat" v-if="chatVisible"
            :closeMe="!!currentClinic"
            @on-event-click="onEventClick"
            @hide-chat="toggleChatHidden"
          />
          <VideoCall
            class="tflex-none w-1/6 m-5 rounded-md"
            :call="$storex.call.currentCall"
            v-if="$storex.call.currentCall && $storex.call.currentCall.streams"
          />
          <ClinicList
            class="bg-neutral text-neutral-content tflex-none w-1/5 m-5 rounded-md"
            v-if="clinicList"
            @join-clinic="joinClinic"
            @leave-clinic="leaveClinic"
            @new-clinic="onNewCodingClinic"
            @close="clinicList = false"
          />
        </div>
      </div>
    </div>
    <LoadingDialog v-if="loading" />
    <div class="avatar absolute bottom-2 right-4 cursor-pointer"
      v-if="chatHidden"
      @click="toggleChatHidden"
    >
      <div class="mb-8 rounded-full w-12 h-12 ring ring-primary ring-offset-base-100 ring-offset-2 p-2">
        <ChatAltIcon class="" />
      </div>
    </div>
  </div>
</template>
<script>
import SideBar from "@/components/SideBar.vue"
import ChatBox from "@/components/ChatBox.vue"
import Profile from "@/components/Profile.vue"
import ChatList from "@/views/ChatList.vue"
import Explorer from "@/views/Explorer.vue"
import VideoCall from "@/views/VideoCall.vue"
import Header from "@/components/Header.vue"
import SearchResults from "@/components/SearchResults.vue"
import ClinicList from '@/components/ClinicList.vue'
import NekoRoom from '@/components/NekoRoom.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import Channel from '@/components/channel/Channel.vue'
import { ChatAltIcon } from "@heroicons/vue/outline"
export default {
  components: {
    SideBar,
    ChatBox,
    ChatList,
    Profile,
    Explorer,
    VideoCall,
    Header,
    SearchResults,
    ClinicList,
    NekoRoom,
    LoadingDialog,
    Channel,
    ChatAltIcon
  },
  data() {
    return {
      clinicList: false,
      show: 1,
      list: [{}, {}],
      sideBar: 'explorer',
      showCodingClinics: !this.$storex.chat.openedChat,
      chatHidden: false,
      loading: false
    };
  },
  computed: {
    openChat () {
      const { openedChat } = this.$storex.chat
      return openedChat
    },
    currentClinic () {
      return this.$storex.clinic.currentClinic
    },
    chatVisible () {
      return this.openChat && (!this.currentClinic || !this.chatHidden)
    },
    explorerVisible () {
      return this.sideBar === 'explorer'
    },
    profileVisible () {
      return this.sideBar === 'profile'
    },
    showLeftBar () {
      return this.sideBar !== ''
    },
    showChannel () {
      return this.$storex.channel.currentChannel
    },
    showHeader () {
      return !this.showCodingClinics && !this.showChannel
    }
  },
  methods: {
    showChat() {
      this.show = !this.show;
    },
    toggleSideBar (view) {
      this.sideBar = view
    },
    onOpenChat (chat) {
      this.showCodingClinics = false
      this.$storex.user.setOpenedChat(chat.id)
      this.$storex.channel.setCurrentChannel(null)
    },
    async onOpenChannel (channel) {
      this.showCodingClinics = false
      this.$storex.channel.openChannel(channel)
    },
    async onCodingClinics () {
      if (this.showCodingClinics) {
        return
      }
      await this.$storex.search.doSearch()
      this.showCodingClinics = true
    },
    async onNewChat () {
      const chat = await this.$storex.chat.newChat()
      this.onOpenChat(chat)
    },
    async onResultsNewCodingClinic (settings) {
      await this.onNewCodingClinic(settings)
      this.showCodingClinics = false
    },
    async onNewCodingClinic (settings) {
      this.loading = true
      try {
        const chat = this.$storex.chat.openedChat
        const clinic = await this.$storex.clinic.newCodingClinic({ chat, settings })
        const { user: { username } } = this.$storex.user
        if (chat) {
          this.$storex.chat.sendMessage({
            chat,
            content: `@${username} started new clinic.`,
            extra: {
              event: 'clinic',
              clinic
            }
          })
        }
        this.joinClinic(clinic.id)
      } catch{}
      this.loading = false
    },
    joinClinic (id, alreadyNotified) {
      this.clinicList = false
      this.$storex.clinic.setCurrentClinic(id)
      if (!alreadyNotified) {
        const chat = this.$storex.chat.openedChat
        const { user: { username } } = this.$storex.user
        if (chat) {
          this.$storex.chat.sendMessage({
            chat,
            content: `@${username} joined clinic.`,
            extra: {
              event: 'clinic',
              clinic: this.$storex.clinic.currentClinic
            }
          })
        }
      }
    },
    leaveClinic () {
      this.clinicList = false
      this.$storex.clinic.setCurrentClinic()
    },
    toggleChatHidden () {
      this.chatHidden = !this.chatHidden
    },
    onEventClick ({ event: eventSettings }) {
      const { event, clinic, type, roomId } = eventSettings
      if (event === 'call') {
        this.$storex.call.joinCall({ type, roomId })
      }
      if (event === 'clinic') {
        this.joinClinic(clinic.id, true)
      }
    }
  }
};
</script>