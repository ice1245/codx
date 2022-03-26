<template>
  <div class="flex flex-col p-5 justify-between prose relative">
    <h2 class="flex-none float-left">Clinics</h2>
    <XCircleIcon class="w-14 btn absolute top-4 right-2" @click="$emit('close')" />
    <div class="grow flex flex-col gap-1">
      <div class=""
        v-for="(clinic, ix) in $storex.clinic.clinics" :key="ix"
      >
        <div class="alert bg-accent text-accent-content cursor-pointer group"
          @click="$emit(`${currentId === clinic.id ? 'leave' : 'join'}-clinic`, clinic.id)">
          <StopIcon class="w-8 mr-2" v-if="currentId === clinic.id"/>
          <TerminalIcon class="w-8 mr-2" v-else/>
          <div class="flex flex-col">
            <div>{{ clinic.name }}</div>
          </div>
          <div class="group-hover:visible invisible ml-4 pt-1">
            <TrashIcon class="w-5" @click.stop="confirmDeleteClinic = clinic" />
          </div>
        </div>
      </div>
    </div>
    <button class="flex-none btn btn-info w-full" @click="newCodingClinic = true">
      <PlusIcon class="w-12 mr-2" /> Create clinic
    </button> 
    <NewCodingClinicDialog
      v-if="newCodingClinic"
      @ok="onNewCodingClinic"
      @cancel="newCodingClinic = false"
      @close="newCodingClinic = false"
    />
    <Dialog
      v-if="confirmDeleteClinic"
      @close="confirmDeleteClinic = null"
      @ok="deleteConfirmClinic"
    >
      <div class="prose">
        <h3>Delete {{ confirmDeleteClinic.name }}</h3>
      </div>
    </Dialog>
  </div>
</template>
<script>
import {
  TerminalIcon,
  StopIcon,
  PlusIcon,
  XCircleIcon,
  TrashIcon
} from '@heroicons/vue/outline'
import NewCodingClinicDialog from '@/components/NewCodingClinicDialog.vue'
import Dialog from '@/components/Dialog.vue'
export default {
  components: {
    TerminalIcon,
    StopIcon,
    PlusIcon,
    XCircleIcon,
    TrashIcon,
    NewCodingClinicDialog,
    Dialog
  },
  data () {
    return {
      newCodingClinic: false,
      confirmDeleteClinic: null
    }
  },
  computed: {
    currentId () {
      const current = this.$storex.clinic.currentClinic
      return current ? current.id : null
    }
  },
  methods: {
    async onNewCodingClinic (settigs) {
      this.$emit('new-clinic', settigs)
    },
    async deleteConfirmClinic () {
      await this.$storex.clinic.deleteClinic(this.confirmDeleteClinic)
      this.confirmDeleteClinic = null
    }
  }
}
</script>