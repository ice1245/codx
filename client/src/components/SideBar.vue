<template>
  <div
    class="bg-black-300 lg:px-3 md:px-12 px-3.5 lg:py-5 py-2 lg:h-full lg:w-20 w-full flex lg:flex-col lg:justify-between items-center fixed lg:relative bottom-0 z-50"
  >
    <img
      src="@/assets/logo.svg"
      class="w-8 cursor-pointer hidden lg:block"
      alt=""
    />
    <div
      id="nav"
      class="lg:space-y-4 flex lg:flex-col items-center lg:justify-center justify-between w-full lg:w-auto"
    >
      <a
        class="router-link-exact-active group hover:text-primary lg:w-14 w-11 lg:h-14 h-11 flex items-center justify-center rounded-lg"
        @click="$emit('sideBar', 'chats')"
      >
        <ChatAltIcon
          class="cursor-pointer lg:w-6 w-5 group-hover:text-primary"
        />
      </a>
      <router-link
        to="/s"
        class="group hover:text-primary lg:w-14 w-11 lg:h-14 h-11 flex items-center justify-center rounded-lg"
      >
        <UsersIcon class="cursor-pointer lg:w-6 w-5 group-hover:text-primary" />
      </router-link>
      <router-link
        to="/d"
        class="group hover:text-primary lg:w-14 w-11 lg:h-14 h-11 flex items-center justify-center rounded-lg"
      >
        <UsersIcon class="cursor-pointer lg:w-6 w-5 group-hover:text-primary" />
      </router-link>
      <router-link
        to="/about"
        class="group hover:text-primary lg:w-14 w-11 lg:h-14 h-11 flex items-center justify-center rounded-lg"
      >
        <CogIcon class="cursor-pointer lg:w-6 w-5 group-hover:text-primary" />
      </router-link>
    </div>
    <div
      class="lg:space-y-8 lg:flex hidden lg:flex-col justify-center items-center"
    >
      <SunIcon class="text-gray-200 cursor-pointer w-7 hidden lg:block" />
      <Dropdown
        menuItemClass="-left-3.5 bottom-12"
        imgClass="h-8 w-8 rounded-full"
        :src="$storex.auth.user.avatar"
        @option="opt => $emit('sideBar', opt)"
      />
    </div>
  </div>
</template>

<script>
import {
  SunIcon,
  CogIcon,
  UsersIcon,
  ChatAltIcon,
} from "@heroicons/vue/outline";
import Dropdown from "./Dropdown.vue";
export default {
  components: {
    SunIcon,
    CogIcon,
    UsersIcon,
    ChatAltIcon,
    Dropdown,
  },
};
</script>
<style>
#nav a {
  color: #abb4d2;
}
#nav a.router-link-exact-active {
  color: #7169ef !important;
  background: #3e4a56;
}
</style>
