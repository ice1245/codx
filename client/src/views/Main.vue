<template>
  <div class="lg:flex h-screen overflow-hidden">
    <SideBar @sideBar="toggleSideBar" />
    <div class="bg-black-400 text-white md:p-3 p-2 py-5 h-full lg:w-96 w-full">
      <ChatList :click="showChat" v-if="sideBar === 'chats'" />
      <Explorer :click="showExplorer" v-if="sideBar === 'explorer'" />
      <Profile v-if="sideBar === 'profile'" />
    </div>
    <div
      v-if="show === true"
      class="bg-black-500 lg:w-auto flex-1 lg:flex absolute lg:relative top-0 left-0 w-full h-full z-50"
    >
      <ChatBox :click="showChat" />
    </div>
    <div
      v-else
      class="bg-black-500 lg:w-auto flex-1 lg:flex hidden w-full h-full z-50"
    >
      <ChatBox />
    </div>
  </div>
</template>
<script>
import SideBar from "@/components/SideBar";
import ChatBox from "@/components/ChatBox";
import Profile from "@/components/Profile";
import ChatList from "@/views/ChatList";
import Explorer from "@/views/Explorer";
export default {
  components: {
    SideBar,
    ChatBox,
    ChatList,
    Profile,
    Explorer
  },
  data() {
    return {
      show: false,
      list: [{}, {}],
      sideBar: 'explorer'
    };
  },
  methods: {
    showChat() {
      this.show = !this.show;
    },
    toggleSideBar (view) {
      this.sideBar = view
    }
  },
};
</script>