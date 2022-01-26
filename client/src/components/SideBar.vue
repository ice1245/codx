<template>
  <div
    class="lg:py-4 py-3 lg:h-full lg:px-2 flex lg:flex-col lg:justify-between items-center fixed lg:relative bottom-0 z-50"
  >
    <img
      :src="logos[logoIx]"
      class="w-10 cursor-pointer hidden lg:block"
      alt=""
      @click="logoClick"
    />
    <div
      id="nav"
      class="lg:space-y-4 flex lg:flex-col items-center lg:justify-center justify-between w-full lg:w-auto"
      v-if="false"
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
      <UserMenu
        menuItemClass="-left-3.5 bottom-12"
        imgClass="h-8 w-8 rounded-full"
        :src="$storex.user.user.avatar"
        @option="opt => $emit('sideBar', opt)"
      />
    </div>
  </div>
</template>

<script>
import {
  CogIcon,
  UsersIcon,
  ChatAltIcon,
} from "@heroicons/vue/outline";
import UserMenu from "./UserMenu.vue";
export default {
  components: {
    CogIcon,
    UsersIcon,
    ChatAltIcon,
    UserMenu,
  },
  data () {
    return {
      logos: [
        'codx-A_logo.png',
        'codx-B_logo.png',
        'codx-C_logo.png',
        'codx-C_logo_white.png',
        'codx-C_logo_blues.png',
        'codx-D_logo.png',
      ],
      logoIx: 0
    }
  },
  methods: {
    logoClick () {
      const { logos, logoIx } = this
      this.logoIx = (logoIx + 1 >= logos.length ? 0 : logoIx + 1)
      this.$emit('sideBar', 'explorer')
    }
  }
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
.no-text {
    height: 22px;
    background-size: 32px 32px;
}
</style>
