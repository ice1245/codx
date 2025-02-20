<template>
  <div class="flex flex-row h-screen overflow-hidden w-full bg-base-200">
    <SideBar
      class=""
      @sideBar="toggleSideBar"
      @home="goHome"
      @switch-company="onSwitchCompany"
    />
    <div :class="[
      'detail-bar bg-neutral-focus text-neutral-content drop-shadow-md py-4',
      'w-1/4 h-full px-2 relative ml-0',
      'flex flex-col justify-between',
      '']"
      v-if="explorerBarVisible">
      <Explorer class="explorer w-full text-sm"
        v-if="explorerVisible"
        @academy-courses="onAcademyCourses"
        @coding-clinics="onCodingClinics"
        @open-chat="chat => onOpenChat(chat)"
        @open-channel="onOpenChannel"
        @new-chat="onNewChat"
        @task-manager="onTaskManager"
        @calendar="() => toggleSideBar('calendar')"
      />
      <Profile v-if="profileVisible" :user="profileVisible"/>
      <UserCalendar class="w-full" v-if="calendarVisible"/>
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
      @join-clinic="joinClinic"
      @delete-clinic="deleteClinic"
    />
    <Channel
      v-if="showChannel"
      class="h-full w-full"
      :channel="$storex.channel.currentChannel"
    />
    <div class="lg:flex flex-col w-full bg-base-200" v-if="splittedView">
      <CodxAcademyHero v-if="hero === 'welcome'" @close="hero = null" />
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
        <div class="grow" v-if="currentClinic">
          <NekoRoom :room="currentClinic" />
        </div>
        <div :class="['flex',
            stackPanels ? 'flex-col-reverse' : 'flex-row',
            currentClinic ? (chatVisible ? 'w-1/3' : 'w-1/6') : 'grow'
          ]"
          v-if="chatVisible || videoCallVisible"
        >
          <ChatBox class="w-full chat-box grow border-l border-slate-500 bg-neutral-focus text-neutral-content"
            :chat="$storex.chat.openedChat" v-if="chatVisible"
            :closeMe="!!currentClinic"
            @on-event-click="onEventClick"
            @hide-chat="toggleChatHidden"
          />
          <VideoCall
            :class="['flex-none rounded-md p-2', chatVisible ? 'w-1/3' : 'w-full']"
            :call="$storex.call.currentCall"
            v-if="videoCallVisible"
            @close="toggleVideoHidden"
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
    <div class="avatar absolute bottom-20 right-4 cursor-pointer"
      v-if="videoCall && videoHidden"
      @click="toggleVideoHidden"
    >
      <div class="mb-8 rounded-full w-12 h-12 ring ring-primary ring-offset-base-100 ring-offset-2 p-2">
        <VideoCameraIcon class="" />
      </div>
    </div>
    <NewCodingClinicDialog
      v-if="showCodingClinicDialog"
      @cancel="showCodingClinicDialog = false"
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
import NewCodingClinicDialog from '@/components/NewCodingClinicDialog.vue'
import NekoRoom from '@/components/NekoRoom.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import Channel from '@/components/channel/Channel.vue'
import Sprint from '@/components/Sprint.vue'
import { ChatAltIcon, VideoCameraIcon } from "@heroicons/vue/outline"
import TaskManager from '@/components/TaskManager.vue'
import InviteBtn from '@/components/InviteBtn.vue'
import CodxAcademyHero from '@/components/hero/CodxAcademyHero.vue'
import UserCalendar from '@/components/UserCalendar.vue'
export default {
  components: {
    ChatAltIcon,
    VideoCameraIcon,
    SideBar,
    ChatBox,
    ChatList,
    Profile,
    Explorer,
    VideoCall,
    Header,
    SearchResults,
    NewCodingClinicDialog,
    NekoRoom,
    LoadingDialog,
    Channel,
    Sprint,
    TaskManager,
    InviteBtn,
    CodxAcademyHero,
    UserCalendar
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
      videoHidden: false,
      loading: false,
      taskManager: null,
      hero: 'welcome',
      profileUser: null
    };
  },
  mounted () {
    const { chat, channel } = this.$route.params
    if (chat) {
      this.onOpenChat({ id: parseInt(chat) })
    }
    if (channel) {
      this.onOpenChannel({ id: parseInt(channel) })
    }
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
      return this.openChat && !this.chatHidden
    },
    explorerVisible () {
      return this.sideBar === 'explorer'
    },
    profileVisible () {
      return this.sideBar === 'profile'
    },
    calendarVisible () {
      return this.sideBar === 'calendar'
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
    },
    videoCall () {
      return this.$storex.call.currentCall
    },
    videoCallVisible () {
      return (this.videoCall && this.$storex.call.currentCall.streams) && !this.videoHidden
    },
    stackPanels () {
      return this.chatVisible && this.videoCallVisible && this.currentClinic
    },
    explorerBarVisible () {
      return this.explorerVisible || this.profileVisible || this.calendarVisible
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
    async resetView (options) {
      const { keepChat } = options||{}
      this.hero = null
      this.leaveClinic ()
      if (!keepChat) {
        await this.$storex.chat.setOpenedChat()
      }
      await this.$storex.channel.setCurrentChannel()
      this.showCodingClinics = false
      this.$router.push('/')
    },
    goHome () {
      this.resetView()
      this.hero = 'welcome'
      this.sideBar = 'explorer'
    },
    async onOpenChat (chat) {
      if (this.$storex.chat.openedChat?.id === chat?.id) {
        return
      }
      await this.resetView()
      await this.$storex.chat.setOpenedChat({ id: chat.id, visible: true })
      this.$router.push(`/chat/${chat.id}`)
    },
    async onOpenChannel (channel) {
      this.resetView()
      this.$router.push(`/channel/${channel.id}`)
      this.$storex.channel.openChannel(channel)
    },
    async onAcademyCourses () {
      this.resetView()
      this.showCodingClinics = await this.$storex.search.academyCourses()
    },
    async onCodingClinics () {
      this.resetView()
      this.showCodingClinics = await this.$storex.search.codingClinics()
    },
    async onNewChat () {
      if (!this.$root.login()) return
      const chat = await this.$storex.chat.newChat()
      this.onOpenChat(chat)
    },
    async onResultsNewCodingClinic (settings) {
      this.resetView()
      await this.onNewCodingClinic(settings)
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
        this.joinClinic(clinic)
        this.showCodingClinicDialog = false
        this.hero = null
      } catch{}
    },
    deleteClinic (clinic) {
      $storex.clinic.deleteClinic(clinic)
    },
    async joinClinic ({ id, chat = {} }, alreadyNotified) {
      await this.resetView({ keepChat: true })
      const { openedChat = {} } = this.$storex.chat
      if (chat.id) {
        await this.onOpenChat(chat)
        if (chat.id !== openedChat.id) {
          this.chatHidden = true
        }
      }
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
      if (!this.chatVisible) {
        this.chatHidden = false
      }
    },
    toggleChatHidden () {
      this.chatHidden = !this.chatHidden
      this.$storex.chat.openedChat.visible = !this.chatHidden 
    },
    toggleVideoHidden () {
      this.videoHidden = !this.videoHidden
    },
    onEventClick ({ event: eventSettings }) {
      const { event, clinic, type, roomId } = eventSettings
      if (event === 'call') {
        this.$storex.call.joinCall({ type, roomId })
      }
      if (event === 'clinic') {
        this.joinClinic(clinic, true)
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