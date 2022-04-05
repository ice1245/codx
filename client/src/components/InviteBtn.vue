<template>
    <button class="btn btn-info drop-shadow text-accent-content mt-2" @click="copyLink" v-if="me">
      <ClipboardCopyIcon class="w-6 mr-2" />
      <strong>{{ shareLInk }}</strong>
    </button>
</template>
<script>
import {
  SpeakerphoneIcon,
  ClipboardCopyIcon
} from "@heroicons/vue/outline"
export default {
  components: {
    SpeakerphoneIcon,
    ClipboardCopyIcon
  },
  data () {
    return {
      copied: false
    }
  },
  computed: {
    me () {
      return this.$storex.user.user
    },
    shareLInk () {
      return `${window.location.origin}/join/@${this.me?.username}`
    }
  },
  methods: {
    copyLink () {
      const clipboardData =
        window.clipboardData ||
        navigator.clipboard;
      clipboardData.writeText(this.shareLInk)
      this.$storex.user.notify("Copied!")
      this.copied = true
    }
  }
}
</script>