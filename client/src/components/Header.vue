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
        <UserAvatar
          v-for="(user, ix) in chatUsers" :key="ix"
          :user="user"
          class="mr-2"
        />
        <div class="avata  w-10 h10">
          <UserAdd class=" w-10 h10" @user="user => addUser(user)" />
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-6">
      <div
        :class="['avatar', micOn ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
         @click="onMic"
      >
        <MicrophoneIcon class="hidden md:block cursor-pointer w-5 "/>
      </div>
      
      <div
        :class="['avatar', camOn ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
         @click="onCam"
      >
        <VideoCameraIcon class="hidden md:block cursor-pointer w-5 "/>
      </div>
      <div
        :class="['avatar', 'btn btn-sm btn-error rounded-md text-white']"
          v-if="call"
         @click="onEndCall"
      >
        <PhoneMissedCallIcon class="hidden md:block cursor-pointer w-5 "/>
      </div>
      <div
        :class="['avatar', liveClinic ? 'online btn btn-sm btn-accent rounded-md' : 'btn btn-sm btn-ghost']"
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
  MicrophoneIcon,
  ChevronLeftIcon,
  TerminalIcon,
  MenuIcon,
  ChatAltIcon,
  PhoneMissedCallIcon
} from "@heroicons/vue/outline"
import UserAdd from '@/components/UserAdd.vue'
import UserAvatar from '@/components/UserAvatar.vue'
export default {
  components: {
    SearchIcon,
    VideoCameraIcon,
    MicrophoneIcon,
    ChevronLeftIcon,
    UserAdd,
    UserAvatar,
    TerminalIcon,
    MenuIcon,
    ChatAltIcon,
    PhoneMissedCallIcon
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
        this.newCall('voice')
      } else {
        this.$storex.call.toggleAudio(this.call)
      }
    },
    onCam () {
      if (!this.call) {
        this.newCall('video')
      } else {
        this.$storex.call.toggleVideo(this.call)
      }
    },
    onEndCall () {
      this.$storex.call.endCurrentCall()
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