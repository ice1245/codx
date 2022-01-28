<template>
  <div class="flex flex-col p-5 justify-between prose">
    <h2 class="flex-none">Clinics</h2>
    <div class="grow flex flex-col gap-1">
      <div class=""
        v-for="(clinic, ix) in $storex.clinic.clinics" :key="ix"
      >
        <div class="alert bg-accent text-accent-content cursor-pointer"
          @click="$emit(`${currentId === clinic.id ? 'leave' : 'join'}-clinic`, clinic.id)">
          <StopIcon class="w-8 mr-2" v-if="currentId === clinic.id"/>
          <TerminalIcon class="w-8 mr-2" v-else/>
          <div class="flex-1">
            <div>{{ clinic.room.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <button class="flex-none btn btn-info w-full" @click="newCodingClinic = true">
      <PlusIcon class="w-10 mr-2" /> Create clinic
    </button> 
    <CodingClinicDialog
      v-if="newCodingClinic"
      @ok="onNewCodingClinic"
      @cancel="newCodingClinic = false"
    />
  </div>
</template>
<script>
import {
  TerminalIcon,
  StopIcon,
  PlusIcon
} from '@heroicons/vue/outline'
import CodingClinicDialog from '@/components/CodingClinicDialog.vue'
export default {
  components: {
    TerminalIcon,
    StopIcon,
    PlusIcon,
    CodingClinicDialog
  },
  data () {
    return {
      newCodingClinic: false
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
    }
  }
}
</script>