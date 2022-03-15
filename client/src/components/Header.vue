<template>
  <div
      class="text-primary pt-3 pb-2 px-4 flex flex-row space-x-5 border-b border-slate-600/50 w-full"
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
        <div class="dropdown"
          :title="`@${user.username}`"
          v-for="(user, ix) in chatUsers" :key="ix">
          <UserAvatar
          :tabindex="ix"
          :user="user"
          class="mr-2 cursor-pointer"
        />
          <ul :tabindex="ix" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
            <li><a @click="$emit('user-profile', user)" >{{ `@${user.username}` }} </a></li>
            <li v-if="user.id !== me.id" @click="$emit('remove-user', user)" ><a><BanIcon class="w-5 mr-2"/>Remove</a></li>
          </ul>
        </div>
        <UserAdd class="ml-2 w-18 h18" :ignoreUsers="chatUsers" @user="user => addUser(user)" />
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

      <div class="dropdown">
        <label tabindex="0"
          :class="['m-1 btn btn-sm',
          liveClinic ? 'online  btn-accent rounded-md' : 'btn-ghost']"
          @click="liveClinic && $emit('leave-clinic')"
        >
          <TerminalIcon class="w-6" />
          <div class="mx-2" v-if="liveClinic">{{ liveClinic.name }}</div>
           <StopIcon v-if="liveClinic" class="w-6" />
        </label>
        <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52" v-if="!liveClinic">
          <li class="group relative" v-for="(clinic, ix) in clinics" :key="ix"
            @click="$emit('join-clinic', clinic)"
          >
            <a>{{ clinic.name }}</a>
            <div class="group-hover:visible invisible ml-4 pt-1 absolute right-2 top-1 cursor-pointer">
              <TrashIcon class="w-5" @click.stop="$emit('delete-clinic', clinic)" />
            </div>
          </li>
          <li @click="$emit('new-clinic')"><a>New...</a></li>
        </ul>
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
  PhoneMissedCallIcon,
  TrashIcon,
  StopIcon,
  BanIcon
} from "@heroicons/vue/outline"
import UserAdd from '@/components/UserAdd.vue'
import UserAvatar from '@/components/UserAvatar.vue'
export default {
  components: {
    SearchIcon,
    VideoCameraIcon,
    MicrophoneIcon,
    ChevronLeftIcon,
    TerminalIcon,
    MenuIcon,
    ChatAltIcon,
    PhoneMissedCallIcon,
    TrashIcon,
    StopIcon,
    BanIcon,
    UserAdd,
    UserAvatar
  },
  props: ['chat', 'explorerVisible', 'chatVisible'],
  data () {
    return {
      newCodingClinic: false
    }
  },
  computed: {
    liveClinic () {
      return this.$storex.clinic.currentClinic
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
    },
    clinics () {
      const { clinics } = this.$storex.clinic
      const { chat: openedChat } = this
      if (openedChat) {
        return clinics.filter(({ chat }) => !chat || chat.id === openedChat.id)
      }
      return clinics
    },
    me () {
      return this.$storex.user.user
    }
  },
  watch: {
    micOn () {
      if (this.call && !this.micOn && !this.camOn) {
        this.onEndCall()
      }
    },
    camOn () {
      if (this.call && !this.micOn && !this.camOn) {
        this.onEndCall()
      }
    },
    chat () {
      if (this.call) {
        this.onEndCall()
      }
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
      const { chat: { id, roomId, users } = { roomId: new Date(), users: [] }} = this
      const { user: { username } } = this.$storex.user

      await this.$storex.call.createNewCall({ roomId, type, users })
      id && this.$storex.chat.sendMessage({
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