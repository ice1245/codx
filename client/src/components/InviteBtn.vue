<template>
  <div class="alert bg-accent shadow-lg" v-if="!copied">
    <div class="flex-col">
      <div class="flex flex-row">
        <SpeakerphoneIcon class="w-6 mr-2" />
        <div>
          Invite a friend!
          <i> And get extra minutes...</i>
        </div>
      </div>
      <button class="btn btn-info drop-shadow text-accent-content mt-2" @click="copyLink">
        <ClipboardCopyIcon class="w-6 mr-2" />
        <strong>{{ shareLInk }}</strong>
      </button>
    </div>
  </div>
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
    shareLInk () {
      return `${window.location.origin}/join/@gbrian`
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