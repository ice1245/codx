<template>
  <div class="flex flex-col items-center">
    <div class="prose text-primary">
      <h3 class="m-5">
        {{ call.callee.username }}
      </h3>
    </div>
    <video
      autoplay
      :muted="calleeVideo.type === 'local'"
      :src-object.prop.camel="calleeVideo.stream"
      v-if="calleeVideo"
      class="rounded-md object-fill"
    ></video>
    <Avatar
      class="animate-pulse"
      :size="24"
      :url="call.callee.avatar"
      :ring="100"
      v-else
    />
    <div class="prose text-primary">
      <h6 class="m-5">
        {{ call.rtc.roomId }}
      </h6>
    </div>
    <div class="flex flex-row px-10 w-full justify-between items-center">
      <div class="rounded-full border p-2">
        <MicrophoneIcon
          :class="['hidden md:block cursor-pointer w-10 h-10', micOff ? 'fill-error' : '' ] "
          @click="toggleAudio"
        />
      </div>
      <div :class="['rounded-full border p-2']">
        <VideoCameraIcon
          :class="['hidden md:block cursor-pointer w-10 h-10', camOff ? 'fill-error' : '' ] "
          @click="toggleVideo"
        />
      </div>
      <div class="rounded-full border p-2 bg-error">
        <PhoneMissedCallIcon
          class="rounded-full hidden md:block cursor-pointer w-10 fill-white"
          @click="$storex.call.endCurrentCall()"
        />
      </div>
    </div>
    <div class="mt-10 fex flex-row">
      <div v-for="(stream, six) in call.streams" :key="six">
        <video
          v-if="stream.type !== 'local'"
          autoplay
          :src-object.prop.camel="stream.stream"
          class="rounded-md object-fill"
        ></video>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar.vue'
import {
  MicrophoneIcon,
  VideoCameraIcon,
  PhoneMissedCallIcon
} from '@heroicons/vue/solid'
export default {
  components: {
    Avatar,
    MicrophoneIcon,
    VideoCameraIcon,
    PhoneMissedCallIcon
  },
  props: ["call"],
  computed: {
    calleeVideo () {
      return this.call.streams[this.call.callee.id]
    },
    micOff () {
      return this.calleeVideo.muted
    },
    camOff () {
      return this.calleeVideo.paused
    }
  },
  methods: {
    toggleVideo () {
      this.$storex.call.toggleVideo(this.call)
    },
    toggleAudio () {
      this.$storex.call.toggleAudio(this.call)
    }
  }
};
</script>