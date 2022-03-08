<template>
  <Dialog title="Create new channel"
    @ok="onCreateChannel"
  >
    <div class="form-control w-2/3">
      <label class="label">
        <span class="label-text">Create new channel</span>
      </label> 
      <div class="relative">
        <input v-model="name" type="text" placeholder="channel name" class="input input-primary input-bordered w-full pl-8">
        <HashtagIcon class="w-8 absolute top-2 left-0" />
      </div>
    </div>
    <div class="">
      <label class="label">
        Company:
      </label>
      <div class="flex flex-row gap-2 overflow-auto w-5/6 rounded border border-slate-500">
        <div class="place-content-center text-center w-32 p-2 cursor-pointer"
          v-for="(card, ix) in companies" :key="ix"
          @click="companySelection = ix"
        >
          <div class="w-32 h-24 border-dashed border-2 border-sky-500 rounded-lg overflow-hidden">
            <div class="indicator-item badge badge-primary" v-if="companySelection === ix">Selected</div>
            <div class="avatar">
              <div class="mb-8 rounded-btn w-14 h-14">
                <img :src="card.avatar">
              </div>
            </div> 
          </div>
          <h4 class="mt-1 text-info text-center"><strong>{{ card.title }}</strong></h4>
          <small>{{ card.description }}</small>
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog.vue'
import { HashtagIcon } from '@heroicons/vue/outline'
export default {
  components: {
    Dialog,
    HashtagIcon
  },
  data () {
    return {
      companySelection: 0,
      name: null
    }
  },
  computed: {
    companies () {
      const { id, username, avatar, companies } = this.$storex.user.user
      return [
        {
          id,
          title: username,
          description: 'Your own channel',
          avatar,
          type: 'user' 
        },
        ...companies
      ]
    }
  },
  methods: {
    async onCreateChannel() {
      const { name, companySelection, companies } = this
      if (!name) {
        return
      }
      const settings = { name }
      const company = companies[companySelection]
      if (company.type !== 'user') {
        settings.company = company
      }
      await this.$storex.channel.createChannel(settings) 
      this.$emit('close')
    }
  }
}
</script>