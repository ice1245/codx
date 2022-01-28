<template>
  <div class="flex flex-col items-center">
    <video
      autoplay
      :muted="calleeVideo.type === 'local'"
      :src-object.prop.camel="calleeVideo.stream"
      v-if="calleeVideo"
      class="rounded-md object-fill z-0"
    ></video>
    <Avatar
      class="animate-pulse"
      :size="24"
      :url="call.callee.avatar"
      :ring="100"
      v-else
    />
    <div class="flex flex-row px-10 w-full mt-2 z-3 justify-between items-center">
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
import {
  MicrophoneIcon,
  VideoCameraIcon,
  PhoneMissedCallIcon
} from '@heroicons/vue/solid'
import Avatar from '@/components/Avatar.vue'
export default {
  components: {
    MicrophoneIcon,
    VideoCameraIcon,
    PhoneMissedCallIcon,
    Avatar
  },
  props: ["call"],
  data () {
    return {
    }
  },
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