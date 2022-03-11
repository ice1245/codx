<template>
  <div class="flex flex-col items-center relative">
    <EyeOffIcon class="w-14 btn absolute bottom-4 right-2 z-10" @click="$emit('close')" v-if="false"/>
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
import { EyeOffIcon } from '@heroicons/vue/solid'
import Avatar from '@/components/Avatar.vue'
export default {
  components: {
    EyeOffIcon,
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