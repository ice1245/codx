<template>
  <div class="clinic-list">
    <div class="flex flex-row gap-4 mt-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
      <div class="relative grow h-32 px-2 py-1 border rounded-md flex flex-col justify-between bg-base-100 border-accent-focus drop-shadow-lg"
        v-for="(clinic, cix) in orderedClinics" :key="cix"
      >
        <div class="grow">
          <div class="flex gap-2">
            <h3 class="cursor-pointer" @click="canEdit(clinic) && (clinic.nameEdit = clinic.name)" v-if="!clinic.nameEdit">{{ clinic.name }}</h3>
            <input v-model="clinic.nameEdit" type="text"
              class="input input-bordered input-sm w-full max-w-xs"
              @keypress.enter="() => [(clinic.nameEdit = null), $emit('update-clinic', { ...clinic, name: clinic.nameEdit })]"
              v-else
            >
            <XCircleIcon class="w-4 cursor-pointer text-error" @click="clinic.nameEdit = null" v-if="clinic.nameEdit" />
          </div>
          <div class="w-full prose"><small>{{ clinicCreationData(clinic) }}</small></div>
        </div>
        <div class="">
          <UserAvatar v-for="(user, uix) in clinicUsers(clinic)" :key="uix"
            :user="user" size="6"
          />
        </div>
        <div class="flex gap-2 justify-end">
          <button class="btn btn-xs btn-outline btn-warning gap-2"
            @click.prevent.stop="$emit('join-clinic', clinic)">
            <TerminalIcon class="w-4" /> Join
          </button>
          <button class="btn btn-xs btn-outline btn-error gap-2"
            @click="$emit('delete-clinic', clinic)"
            v-if="clinic.user.id === me.id"
          >
            <TrashIcon class="w-4" />
          </button>
        </div>
        <small>{{ clinic.provider }}</small>
      </div>
    </div>
  </div>
</template>
<script>
import {
  TerminalIcon,
  TrashIcon,
  PencilIcon,
  XCircleIcon,
  SaveIcon
} from "@heroicons/vue/outline"
import moment from 'moment'
import UserAvatar from '@/components/UserAvatar.vue'
export default {
  components: {
    TerminalIcon,
    TrashIcon,
    PencilIcon,
    XCircleIcon,
    SaveIcon,
    UserAvatar
  },
  data () {
    return {
      editClinic: false
    }
  },
  computed: {
    clinics () {
      return this.$storex.clinic.clinics
    },
    me () {
      return this.$storex.user.user
    },
    orderedClinics () {
      return this.clinics.sort((a, b) => a.createdAt > b.createdAt ? -1 : 0)
    }
  },
  methods: {
    clinicChat ({ chat: { id } = {}}) {
      const { chats } = this.$storex.chat
      return chats[id]
    },
    clinicUsers (clinic) {
      const chat = this.clinicChat(clinic)
      return chat?.users
    },
    canEdit ({ user: id }) {
      return id === this.me.id
    },
    clinicCreationData (clinic) {
      return moment(clinic.createdAt).fromNow()
    }
  }
}
</script>