<template>
  <div class="lg:flex h-screen overflow-hidden">
    <SideBar @sideBar="toggleSideBar" />
    <div class="bg-black-400 text-white md:p-3 p-2 py-5 h-full lg:w-96 w-full">
      <ChatList :click="showChat" v-if="sideBar === 'chats'" />
      <Explorer v-if="sideBar === 'explorer'" />
      <Profile v-if="sideBar === 'profile'" />
    </div>
    <div class="container w-full h-full">
      <div class="lg:flex flex-col h-full w-full">
        <Header class="bg-black-500"
          :chat="$storex.chat.openedChat" />
        <div class="bg-black-500 lg:flex flex-row hidden h-full w-full">
          <ChatBox class="grow" :chat="$storex.chat.openedChat" />
          <VideoCall class="flex-none w-14" />
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
export default {
  components: {
    SideBar,
    ChatBox,
    ChatList,
    Profile,
    Explorer,
    VideoCall,
    Header
  },
  data() {
    return {
      show: 1,
      list: [{}, {}],
      sideBar: 'explorer'
    };
  },
  computed: {
    openChat () {
      const { chats, openedChat } = this.$storex.chat
      return chats.filter(c => c.id === openedChat)[0]
    }
  },
  methods: {
    showChat() {
      this.show = !this.show;
    },
    toggleSideBar (view) {
      this.sideBar = view
    }
  }
};
</script>