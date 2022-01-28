<template>
  <div class="dropdown dropdown-left">
    <div tabindex="0" class="">
      <UserAddIcon :class="`hidden md:block cursor-pointer w-${size || 5}`" />
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
      return this.$storex.network.onlineFriends
    }
  }
}
</script>