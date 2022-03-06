<template>
  <div class="flex flex-row h-screen overflow-hidden w-full">
    <SideBar
      @sideBar="toggleSideBar"
      @switch-company="onSwitchCompany"
      class="bg-neutral-focus text-neutral-content" />
    <div :class="[
      'detail-bar bg-neutral-focus text-neutral-content drop-shadow-md my-4',
      'w-2/6 lg:px-4 relative ml-0',
      'flex flex-col justify-between',
      '']"
      v-if="explorerVisible || profileVisible">
      <Explorer class="explorer w-full"
        v-if="explorerVisible"
        @coding-clinics="onCodingClinics"
        @open-chat="chat => onOpenChat(chat)"
        @open-channel="onOpenChannel"
        @new-chat="onNewChat"
        @task-manager="onTaskManager"
      />
      <Profile v-if="profileVisible" :user="$storex.user.user"/>
      <InviteBtn />
    </div>
    <TaskManager class="w-1/3"
      v-if="taskManager"
      @task-chat="onOpenChat"
    />
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
    <div class="lg:flex flex-col w-full" v-if="splittedView">
      <Header
          :chat="$storex.chat.openedChat"
          :explorerVisible="explorerVisible"
          :chatVisible="chatVisible"
          @leave-clinic="leaveClinic"
          @delete-clinic="deleteClinic"
          @join-clinic="joinClinic"
          @new-clinic="showCodingClinicDialog = true"
          @close-explorer="sideBar = ''"
          @open-explorer="sideBar = 'explorer'"
          @toggle-chat="toggleChatHidden"
          @remove-user="removeUser"
          v-if="showHeader"
        />
      <div class="lg:flex flex-row hidden h-full w-full">
        <div :class="[chatVisible ? 'w-2/3' : 'grow']" v-if="currentClinic">
          <NekoRoom
            :room="currentClinic"
          />
        </div>
        <ChatBox class="chat-box grow border-l border-slate-500"
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
    <CodingClinicDialog
      v-if="showCodingClinicDialog"
      @close="showCodingClinicDialog = false"
      @ok="onNewCodingClinic"
      />
  </div>
</template>
<script>
import SideBar from "@/components/SideBar.vue"
import ChatBox from "@/components/chat/ChatBox.vue"
import Profile from "@/components/Profile.vue"
import ChatList from "@/views/ChatList.vue"
import Explorer from "@/views/Explorer.vue"
import VideoCall from "@/views/VideoCall.vue"
import Header from "@/components/Header.vue"
import SearchResults from "@/components/SearchResults.vue"
import CodingClinicDialog from '@/components/CodingClinicDialog.vue'
import NekoRoom from '@/components/NekoRoom.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import Channel from '@/components/channel/Channel.vue'
import Sprint from '@/components/Sprint.vue'
import { ChatAltIcon } from "@heroicons/vue/outline"
import TaskManager from '@/components/TaskManager.vue'
import InviteBtn from '@/components/InviteBtn.vue'
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
    CodingClinicDialog,
    NekoRoom,
    LoadingDialog,
    Channel,
    Sprint,
    ChatAltIcon,
    TaskManager,
    InviteBtn
  },
  data() {
    return {
      clinicList: false,
      show: 1,
      list: [{}, {}],
      sideBar: 'explorer',
      showCodingClinics: true,
      showCodingClinicDialog: false,
      chatHidden: false,
      loading: false,
      taskManager: null
    };
  },
  created () {
    this.$storex.search.doSearch()
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
      return !this.showCodingClinics && !this.showChannel && (!this.taskManager || this.chatVisible) 
    },
    currentCompnay () {
      return this.$storex.company.currentCompnay
    },
    splittedView () {
      return !this.showCodingClinics && !this.showChannel && (!this.taskManager || this.chatVisible) 
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
      this.leaveClinic ()
      this.$storex.user.setOpenedChat(chat.id)
      this.$storex.channel.setCurrentChannel(null)
    },
    async onOpenChannel (channel) {
      this.showCodingClinics = false
      this.$storex.channel.openChannel(channel)
    },
    async onCodingClinics () {
      await this.$storex.search.doSearch()
      this.showCodingClinics = true
    },
    async onNewChat () {
      if (!this.$root.login()) return
      const chat = await this.$storex.chat.newChat()
      this.onOpenChat(chat)
    },
    async onResultsNewCodingClinic (settings) {
      await this.onNewCodingClinic(settings)
      this.showCodingClinics = false
    },
    async onNewCodingClinic (settings) {
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
        this.showCodingClinicDialog = false
      } catch{}
    },
    deleteClinic (clinic) {
      $storex.clinic.deleteClinic(clinic)
    },
    joinClinic (id, alreadyNotified) {
      this.clinicList = false
      this.$storex.clinic.setCurrentClinic(id)
      if (!alreadyNotified) {
        const chat = this.$storex.chat.openedChat
        const { user: { username } } = this.$storex.user
        if (false && chat) {
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
    },
    onSwitchCompany (company) {
      this.$storex.company.setCurrentCompany(company)
      if (this.taskManager && this.taskManager !== company) {
        this.taskManager = null
        this.$storex.chat.setOpenedChat()
        this.clinicList = true
      }
    },
    onTaskManager () {
      this.clinicList = false
      this.showHeader = false
      this.showCodingClinics = false
      this.$storex.clinic.setCurrentClinic()
      this.$storex.chat.setOpenedChat()
      this.taskManager = this.currentCompnay
    },
    removeUser (user) {
      const chat = this.$storex.chat.openedChat
      this.$storex.chat.removeUser({ user, chat })
    }
  }
};
</script>