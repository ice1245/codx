<template>
  <div class="dropdown dropdown-right">
    <div class="avatar ring rounded-full p-2" tabindex="0">
      <div class="w-8 h-8 rounded-full">
        <UserAddIcon :class="`hidden md:block cursor-pointer w-${size || 8}`" />
      </div>
    </div>
    <ul tabindex="0" class="ml-4 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
      <li>
        <div class="mt-2 mb-6 w-full">
          <label class="input-group input-group-sm w-full">
            <input type="text"
              placeholder="Search..." class="input input-bordered input-sm w-full" @keypress.enter="doUserSearch"> 
            <span class="cursor-pointer text-base-content" @click="doUserSearch">Go</span>
          </label>
        </div>
      </li>
      <li v-for="(user, ix) in onlineFriends" :key="ix"
        :class="['cursor-pointer', showUser(user) ? '' : 'hidden' ]"
        @click="$emit('user', user)"
      >
        <a class="flex gap-2">
          <Avatar size="8" :url="user.avatar" online class="float-left" />
          <div><strong>{{ `@${user.username}` }}</strong></div>
        </a>
      </li> 
      <hr/>
      <li @click="$emit('invite-user')">
        <a class="flex gap-2">
          <ShareIcon class="w-6" />
          <strong>Invite user</strong>
        </a>
      </li> 
    </ul>
  </div>
</template>
<script>
import { 
  UserAddIcon,
  ShareIcon
} from "@heroicons/vue/outline"
import Avatar from '@/components/Avatar.vue'
export default {
  props: ['size', 'ignoreUsers'],
  components: {
    UserAddIcon,
    ShareIcon,
    Avatar
  },
  computed: {
    onlineFriends () {
      return this.$storex.network.friends
    },
    visible () {
      return this.onlineFriends.length !== 0
    }
  },
  methods: {
    showUser (user) {
      return (this.ignoreUsers||[]).map(u => u.id).indexOf(user.id) === -1
    },
    doUserSearch () {
    }
  }
}
</script>