<template>
  <div class="dropdown dropdown-left">
    <div class="avatar ring rounded-full p-2" tabindex="0">
      <div class="w-8 h-8 rounded-full">
        <UserAddIcon :class="`hidden md:block cursor-pointer w-${size || 8}`" />
      </div>
    </div>
    <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
      <li v-for="(user, ix) in onlineFriends" :key="ix"
        class="cursor-pointer"
        @click="$emit('user', user)"
      >
        <Avatar size="8" :url="user.avatar" online class="float-left" />
        <strong>{{ `@${user.username}` }}</strong>
      </li> 
    </ul>
  </div>
</template>
<script>
import { 
  UserAddIcon
} from "@heroicons/vue/outline"
import Avatar from '@/components/Avatar.vue'
export default {
  props: ['size'],
  components: {
    UserAddIcon,
    Avatar
  },
  computed: {
    onlineFriends () {
      return this.$storex.network.friends
    },
    visible () {
      return this.onlineFriends.length !== 0
    }
  }
}
</script>