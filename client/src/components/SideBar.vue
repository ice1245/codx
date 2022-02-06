<template>
  <div
    class="lg:py-4 py-3 lg:h-full lg:px-2 flex lg:flex-col lg:justify-between items-center fixed lg:relative bottom-0 z-50"
  >
    <img
      :src="logos[logoIx]"
      class="w-10 cursor-pointer mb-4"
      alt=""
      @click="logoClick"
    />
    <div class="flex flex-col grow justify-start">
      <div
        v-for="(company, cix) in companies" :key="cix"
      >
        <div class="avatar ring ring-neutral-content rounded-btn cursor-pointer"
        @click="$emit('switch-company', company)">
          <div class="rounded-btn w-12 h-12">
            <img :src="company.avatar">
          </div>
      </div>
      </div>
      <div class="avatar ring ring-accent rounded-full cursor-pointer mt-3 w-8 ml-2"
        @click="$emit('add-company')">
        <PlusIcon class="h-8 w-8" />
      </div>
    </div>
    <div
      class="lg:space-y-8 lg:flex hidden lg:flex-col justify-center items-center"
    >
      <UserMenu
        menuItemClass="-left-3.5 bottom-12"
        imgClass="h-8 w-8 rounded-full"
        @option="opt => $emit('sideBar', opt)"
      />
    </div>
  </div>
</template>

<script>
import {
  PlusIcon
} from "@heroicons/vue/outline";
import UserMenu from "./UserMenu.vue";
export default {
  components: {
    PlusIcon,
    UserMenu,
  },
  data () {
    return {
      logos: [
        'codx-C_logo_white.png',
        'codx-A_logo.png',
        'codx-B_logo.png',
        'codx-C_logo.png',
        'codx-C_logo_blues.png',
        'codx-D_logo.png',
      ],
      logoIx: 0
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    companies () {
      return this.user.companies
    }
  },
  methods: {
    logoClick () {
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
