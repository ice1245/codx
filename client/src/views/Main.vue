<template>
  <div class="lg:flex h-screen overflow-hidden">
    <SideBar @sideBar="toggleSideBar" class="bg-neutral-focus text-neutral-content" />
    <div class="bg-neutral text-neutral-content tmd:p-3 p-2 py-5 h-full lg:w-96 w-full">
      <Explorer v-if="sideBar === 'explorer'"
        @coding-clinics="onCodingClinics"
        @open-chat="chat => onOpenChat(chat)"
        @new-chat="onNewChat"
      />
      <Profile v-if="sideBar === 'profile'" :user="$storex.user.user"/>
    </div>
    <div class="container w-full h-full">
      <SearchResults
        v-if="showCodingClinics"
        class="grow h-full w-full"
        :search="currentSearch"
      />
      <div class="lg:flex flex-col h-full w-full" v-else>
        <Header
          :chat="$storex.chat.openedChat" />
        <div class="lg:flex flex-row hidden h-full w-full">
          <ChatBox class="grow" :chat="$storex.chat.openedChat" v-if="chatVisible" />
          <VideoCall
            class="bg-neutral text-neutral-content tflex-none w-1/5 m-5 p-5 rounded-md"
            :call="$storex.call.currentCall"
            v-if="$storex.call.currentCall"
          />
        </div>
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
export default {
  components: {
    SideBar,
    ChatBox,
    ChatList,
    Profile,
    Explorer,
    VideoCall,
    Header,
    SearchResults
  },
  data() {
    return {
      show: 1,
      list: [{}, {}],
      sideBar: 'explorer',
      showCodingClinics: !this.$storex.chat.openedChat,
      currentSearch: {
        topic: '#coding-clinic',
        description: 'Find developers to connect and work together in an online development environment. A coding clinic is a timeboxed session where two or more participants will collaborate to solve a problem',
        banner: {
          bgImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8&w=1000&q=80',
          image: 'https://careertraining.ed2go.com/common/images/2/22516/GES375-agnesscott-Full-Stack-Software-Developer-935x572.jpg'
        },
        showWelcome: true,
        tags: [{ label: 'nodejs', count: 300 },{ label: 'vuejs', count: 230 },{ label: 'tailwind', count: 150 },{ label: 'daisyui', count: 100 }],
        results: [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6]
      }
    };
  },
  computed: {
    openChat () {
      const { chats, openedChat } = this.$storex.chat
      return chats.filter(c => c.id === openedChat)[0]
    },
    chatVisible () {
      return !this.showCodingClinics
        && this.$storex.chat.openedChat
        && (!this.$storex.call.currentCall ||
        !this.$storex.clinic.currentClinic)
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
    },
    onCodingClinics () {
      if (this.showCodingClinics) {
        return
      }
      this.showCodingClinics = true
      this.$storex.user.setOpenedChat()
    },
    async onNewChat () {
      const chat = await this.$storex.chat.newChat()
      this.onOpenChat(chat)
    }
  }
};
</script>