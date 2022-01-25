<template>
  <div
      class="md:p-6 p-4 flex justify-between items-center space-x-5 border-b border-gray-900 border-opacity-20 w-full"
    >
      <div class="flex items-center -space-x-6">
        <div class="flex justify-left items-center"
          v-for="(user, ix) in chat.users" :key="ix"
        >
          <ChevronLeftIcon
            class="cursor-pointer w-7 ml-2 text-gray-200 mr-5 lg:hidden"
          />
          <div class="h-9 w-14 relative">
            <Avatar :url="user.avatar" />
          </div>
          <div class="ml-3 w-full space-x-2 flex items-center" v-if="false">
            <p class="md:text-md text-sm font-semibold text-gray-100">
              {{ user.username }}
            </p>
            <p
              class="h-0.5 w-0.5 rounded-full ring-4 ring-green-400 bg-black-400"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-6">
        <SearchIcon class="cursor-pointer w-5 text-gray-200" />
        <PhoneIcon class="hidden md:block cursor-pointer w-5 text-gray-200" />
        <VideoCameraIcon
          class="hidden md:block cursor-pointer w-5 text-gray-200"
        />
        <UserIcon class="hidden md:block cursor-pointer w-5 text-gray-200" />
      </div>
    </div>
</template>
<script>
import {
  UserIcon,
  SearchIcon,
  VideoCameraIcon,
  PhoneIcon,
  ChevronLeftIcon
} from "@heroicons/vue/outline"
import Avatar from './Avatar.vue'
export default {
  components: {
    UserIcon,
    SearchIcon,
    VideoCameraIcon,
    PhoneIcon,
    ChevronLeftIcon,
    Avatar
  },
  props: ['chat']
}
</script>