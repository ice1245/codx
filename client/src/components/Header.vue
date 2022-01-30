<template>
  <div
      class="text-primary md:p-6 p-4 flex justify-between items-center space-x-5 border-b border-slate-600/50 w-full"
    >
    <div class="flex items-center -space-x-6">
      <div class="flex justify-left items-center"
        v-for="(user, ix) in (chat||{}).users" :key="ix"
      >
        <ChevronLeftIcon
          class="cursor-pointer w-7 ml-2 mr-5 lg:hidden"
        />
        <div class="h-9 w-14 relative">
          <Avatar :url="user.avatar" />
        </div>
        <div class="ml-3 w-full space-x-2 flex items-center" v-if="false">
          <p class="md:text-md text-sm font-semibold ">
            {{ user.username }}
          </p>
          <p
            class="h-0.5 w-0.5 rounded-full ring-4 ring-green-400 "
          />
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-6">
      
      <PhoneIcon class="hidden md:block cursor-pointer w-5 "
        @click="newCall('voice')"
        v-if="!$storex.call.currentCall"
      />
      <VideoCameraIcon
        class="hidden md:block cursor-pointer w-5 "
        @click="newCall('video')"
        v-if="!$storex.call.currentCall"
      />
      <UserAdd @user="user => addUser(user)" />
      <div
        :class="['avatar', liveClinic ? 'online btn btn-sm btn-accent rounded-md' : '']"
         @click="liveClinic ? $emit('leave-clinic') : $emit('coding-clinic')"
      >
        <TerminalIcon class="inline-block w-5 mr-2 stroke-current cursor-pointer online" />
      </div>
      <div class="form-control">
        <div class="relative">
          <input type="text" placeholder="Search" class="w-full pr-16 input input-sm input-primary input-bordered"> 
          <SearchIcon class="absolute top-1 right-2 cursor-pointer w-5 " />
        </div>
      </div> 
    </div>
  </div>
</template>
<script>
import {
  SearchIcon,
  VideoCameraIcon,
  PhoneIcon,
  ChevronLeftIcon,
  TerminalIcon
} from "@heroicons/vue/outline"
import UserAdd from '@/components/UserAdd.vue'
import Avatar from '@/components/Avatar.vue'
export default {
  components: {
    SearchIcon,
    VideoCameraIcon,
    PhoneIcon,
    ChevronLeftIcon,
    UserAdd,
    Avatar,
    TerminalIcon
  },
  props: ['chat'],
  data () {
    return {
      newCodingClinic: false
    }
  },
  computed: {
    liveClinic () {
      return !!this.$storex.clinic.currentClinic
    }
  },
  methods: {
    addUser (user) {
      const { chat } = this
      this.$storex.chat.addUser({ chat, user })
    },
    async newCall (type) {
      const { chat: { roomId, users }} = this
      const { user: { username } } = this.$storex.user

      await this.$storex.call.createNewCall({ roomId, type, users })
      this.$storex.chat.sendMessage({
        chat: this.chat,
        content: `@${username} started new call.`,
        extra: {
          event: 'call',
          type,
          roomId
        }
      })
    }
  }
}
</script>