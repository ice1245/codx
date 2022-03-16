<template>
  <Dialog>
    <template v-slot:icon>
      <BellIcon class="w-8 text-error" />
    </template>
    <div class="prose">
      <h2>You are going to delete clinic: {{ clinic.name }}</h2>
      <input v-model="clinicName" type="text" :placeholder="`Type '${clinic.name}' here to continue`" class="input input-bordered input-error w-full max-w-xs">
      <div>
        <p>Remember to save all your work before proceed. This action cannot be undone.</p>
      </div>
    </div>
    <template v-slot:actions>
      <button class="btn btn-accent shadow-sm px-4 py-2"
        @click="$emit('ok')"
        v-if="isOk">Ok</button> 
      <button class="btn btn-error shadow-sm px-4 py-2"
        @click="$emit('cancel')">Cancel</button>
    </template>
  </Dialog>
</template>
<script>
import {
  BellIcon
} from '@heroicons/vue/solid'
import Dialog from '@/components/Dialog.vue'
export default {
  components: {
    BellIcon,
    Dialog
  },
  props: ['clinic'],
  data () {
    return {
      clinicName: null
    }
  },
  computed: {
    isOk () {
      return this.clinicName === this.clinic.name
    }
  }
}
</script>