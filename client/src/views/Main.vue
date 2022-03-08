<template>
  <div class="flex flex-row h-screen overflow-hidden w-full bg-base-200">
    <SideBar
      class=""
      @sideBar="toggleSideBar"
      @switch-company="onSwitchCompany"
    />
    <div :class="[
      'detail-bar bg-neutral-focus text-neutral-content drop-shadow-md py-4',
      'w-2/6 lg:px-4 relative ml-0',
      'flex flex-col justify-between',
      '']"
      v-if="explorerVisible || profileVisible">
      <Explorer class="explorer w-full"
        v-if="explorerVisible"
        @academy-courses="onAcademyCourses"
        @coding-clinics="onCodingClinics"
        @open-chat="chat => onOpenChat(chat)"
        @open-channel="onOpenChannel"
        @new-chat="onNewChat"
        @task-manager="onTaskManager"
      />
      <Profile v-if="profileVisible" :user="profileVisible"/>
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
    <div class="lg:flex flex-col w-full bg-base-200" v-if="splittedView">
      <CodxAcademyHero v-if="hero === 'academy'" @close="hero = null" />
      <Header
          class="bg-neutral"
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
          @user-profile="showUserProfile"
          v-if="showHeader"
        />
      <div class="lg:flex flex-row hidden h-full w-full">
        <div :class="[chatVisible ? 'w-2/3' : 'grow']" v-if="currentClinic">
          <NekoRoom
            :room="currentClinic"
          />
        </div>
        <ChatBox class="chat-box grow border-l border-slate-500 bg-neutral-focus text-neutral-content"
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
import CodxAcademyHero from '@/components/hero/CodxAcademyHero.vue'
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
    InviteBtn,
    CodxAcademyHero
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
      taskManager: null,
      hero: 'academy',
      profileUser: null
    };
  },
  created () {
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
      return !this.showCodingClinics && !this.showChannel && (!this.taskManager || this.chatVisible) || this.hero
    }
  },
  methods: {
    showChat() {
      this.show = !this.show;
    },
    toggleSideBar (view) {
      this.sideBar = view
      if (view === 'profile') {
        this.profileUser = this.$storex.user.user
      }
    },
    onOpenChat (chat) {
      this.showCodingClinics = false
      this.leaveClinic ()
      this.$storex.chat.setOpenedChat({ id: chat.id, visible: true })
      this.$storex.channel.setCurrentChannel(null)
      this.hero = null
    },
    async onOpenChannel (channel) {
      this.showCodingClinics = false
      this.$storex.channel.openChannel(channel)
      this.hero = null
    },
    async onAcademyCourses () {
      this.$storex.channel.openChannel()
      this.showCodingClinics = await this.$storex.search.academyCourses()
      this.hero = null
    },
    async onCodingClinics () {
      this.$storex.channel.openChannel()
      this.showCodingClinics = await this.$storex.search.codingClinics()
      this.hero = null
    },
    async onNewChat () {
      if (!this.$root.login()) return
      const chat = await this.$storex.chat.newChat()
      this.onOpenChat(chat)
    },
    async onResultsNewCodingClinic (settings) {
      await this.onNewCodingClinic(settings)
      this.showCodingClinics = false
      this.hero = null
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
        this.hero = null
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
      this.hero = null
    },
    leaveClinic () {
      this.clinicList = false
      this.$storex.clinic.setCurrentClinic()
    },
    toggleChatHidden () {
      this.chatHidden = !this.chatHidden
      this.$storex.chat.openedChat.visible = !this.chatHidden 
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