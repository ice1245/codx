<template>
  <div class="clinic-list">
    <div class="flex flex-row gap-4 mt-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div class="relative w-1/6 h-24 px-4 py-1 border rounded-md flex flex-col justify-between bg-base-100 border-accent-focus"
        v-for="(clinic, cix) in clinics" :key="cix"
      >
        <div class="prose grow"><h3>{{ clinic.name }}</h3></div>
        <div class="">
          <UserAvatar v-for="(user, uix) in clinicUsers(clinic)" :key="uix"
            :user="user" size="6"
          />
        </div>
        <div class="flex justify-between">
          <div class="flex gap-2 align-end">
            <button class="btn btn-xs btn-outline btn-warning gap-2"
              @click="$emit('join-clinic', clinic)">
              <TerminalIcon class="w-4" /> Join
            </button>
            <button class="btn btn-xs btn-outline btn-error gap-2"
              @click="$emit('delete-clinic', clinic)"
              v-if="clinic.user.id === me.id"
            >
              <TrashIcon class="w-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  TerminalIcon,
  TrashIcon
} from "@heroicons/vue/outline"
import UserAvatar from '@/components/UserAvatar.vue'
export default {
  components: {
    TerminalIcon,
    TrashIcon,
    UserAvatar
  },
  computed: {
    clinics () {
      return this.$storex.clinic.clinics
    },
    me () {
      return this.$storex.user.user
    }
  },
  methods: {
    clinicChat ({ chat: { id } = {}}) {
      const { chats } = this.$storex.chat
      return chats[id]
    },
    clinicUsers (clinic) {
      const chat = this.clinicChat(clinic)
      return chat.users
    }
  }
}
</script>