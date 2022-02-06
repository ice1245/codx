<template>
  <div
      class="text-primary md:p-6 p-4 flex flex-row space-x-5 border-b border-slate-600/50 w-full"
    >
    <div class="flex flex-row grow">
      <MenuIcon 
        :class="['cursor-pointer w-7 ml-2 mr-5', liveClinic ? 'lg:hidde' : '']"
        v-if="!explorerVisible && liveClinic"
        @click="$emit('open-explorer')"
      />
      <ChevronLeftIcon
        :class="['cursor-pointer w-7 ml-2 mr-5', liveClinic ? '' : 'lg:hidde']"
        v-if="explorerVisible && liveClinic"
        @click="$emit('close-explorer')"
      />
      <div class="flex flex-row">
        <Avatar
          v-for="(user, ix) in chatUsers" :key="ix"
          :url="user.avatar" :video="user.video"
        />
      </div>
    </div>
    <div class="flex items-center space-x-6">
      <div
        :class="['avatar', micOn ? 'online btn btn-sm btn-accent rounded-md' : '']"
         @click="onMic"
      >
        <MicrophoneIcon class="hidden md:block cursor-pointer w-5 "/>
      </div>
      
      <div
        :class="['avatar', camOn ? 'online btn btn-sm btn-accent rounded-md' : '']"
         @click="onMic"
      >
        <VideoCameraIcon class="hidden md:block cursor-pointer w-5 "/>
      </div>
      <UserAdd @user="user => addUser(user)" v-if="false" />
      <div
        :class="['avatar', liveClinic ? 'online btn btn-sm btn-accent rounded-md' : '']"
         @click="liveClinic ? $emit('leave-clinic') : $emit('coding-clinic')"
      >
        <TerminalIcon class="inline-block w-5 mr-2 stroke-current cursor-pointer online" />
      </div>
      <div
        :class="['avatar', chatVisible ? 'btn btn-sm btn-accent rounded-md' : '']"
         @click="$emit('toggle-chat')"
         v-if="showChatToggle"
      >
        <ChatAltIcon class="inline-block w-5 mr-2 stroke-current cursor-pointer online" />
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
  MicrophoneIcon,
  ChevronLeftIcon,
  TerminalIcon,
  MenuIcon,
  ChatAltIcon
} from "@heroicons/vue/outline"
import UserAdd from '@/components/UserAdd.vue'
import Avatar from '@/components/Avatar.vue'
export default {
  components: {
    SearchIcon,
    VideoCameraIcon,
    MicrophoneIcon,
    ChevronLeftIcon,
    UserAdd,
    Avatar,
    TerminalIcon,
    MenuIcon,
    ChatAltIcon
  },
  props: ['chat', 'explorerVisible', 'chatVisible'],
  data () {
    return {
      newCodingClinic: false
    }
  },
  computed: {
    liveClinic () {
      return !!this.$storex.clinic.currentClinic
    },
    call () {
      return this.$storex.call.currentCall
    },
    calleeVideo () {
      return this.call ? this.call.streams[this.call.callee.id] : null
    },
    micOn () {
      return this.call && !this.calleeVideo.muted
    },
    camOn () {
      return this.call && !this.calleeVideo.paused
    },
    chatUsers () {
      return (this.chat||{ users: []}).users.map(u => ({
        ...u,
        video: this.call ? this.call.streams[u.id] : null
      }))
    },
    showChatToggle () {
      return this.liveClinic
    }
  },
  methods: {
    addUser (user) {
      const { chat } = this
      this.$storex.chat.addUser({ chat, user })
    },
    onMic () {
      if (!this.call) {
        return this.newCall('voice')
      }
    },
    onCam () {
      if (!this.call) {
        return this.newCall('video')
      }
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
  },
  beforeUnmount () {
    if (this.call) {
      this.$storex.call.endCurrentCall()
    }
  }
}
</script>