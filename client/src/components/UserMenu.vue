<template>
  <div class="dropdown dropdown-right dropdown-end">
    <Avatar tabindex="0" class="cursor-pointer" :url="src" />
    <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
      <li>
        <a
          :class="[
            active ? '' : '',
            'group flex items-center justify-between transition-all font-medium hover:px-6 py-1 text-md',
          ]"
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
          :class="[
            active ? '' : '',
            'group flex items-center justify-between transition-all font-medium hover:px-6 py-1 text-md',
          ]"
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

  <!--Menu as="div" class="relative text-left flex items-center">
    <div>
      <MenuButton
        class="flex items-center justify-center w-full text-sm font-medium focus:outline-none"
      >
        <Avatar :url="src" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        :class="menuItemClass"
        class="origin-bottom-left z-50 absolute border border-gray-300 w-36 rounded-md shadow-lg focus:outline-none"
      >
        <div class="py-2">
          <MenuItem v-slot="{ active }">
            <a
              :class="[
                active ? '' : '',
                'group flex items-center justify-between transition-all font-medium hover:px-6 py-1 text-md',
              ]"
              @click="$emit('option', 'profile')"
            >
              Profile
              <PencilAltIcon
                class="ml-3 h-4 w-4 group-hover:"
                aria-hidden="true"
              />
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              :class="[
                active ? '' : '',
                'group flex items-center justify-between transition-all font-medium hover:px-6 py-1 text-md',
              ]"
              @click="$router.push('/logout')"
            >
              Logout
              <LogoutIcon
                class="ml-3 h-4 w-4 group-hover:"
                aria-hidden="true"
              />
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu-->
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
};
</script>
