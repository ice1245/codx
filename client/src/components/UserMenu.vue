<template>
  <div class="dropdown dropdown-right dropdown-end text-primary">
    <Avatar tabindex="0" class="cursor-pointer" :url="src" :online="online" />
    <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-40">
      <li>
        <a
          @click="$emit('option', 'profile')"
        >
          Profile
          <PencilAltIcon
            class="ml-3 h-4 w-4 group-hover:"
            aria-hidden="true"
          />
        </a>
      </li> 
      <li>
        <a
          @click="$router.push('/logout')"
        >
          Logout
          <LogoutIcon
            class="ml-3 h-4 w-4 group-hover:"
            aria-hidden="true"
          />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { PencilAltIcon, LogoutIcon } from "@heroicons/vue/solid"
import Avatar from './Avatar.vue'

export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    PencilAltIcon,
    LogoutIcon,
    Avatar
  },
  props: {
    imgClass: { type: String, default: "h-8 w-8 rounded-full" },
    src: { type: String, default: "../../assets/dots.svg" },
    menuItemClass: { type: String, default: "" },
  },
  computed: {
    online () {
      return this.$storex.session.isOnline
    }
  }
};
</script>
