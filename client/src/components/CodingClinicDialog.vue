<template>
  <Dialog :title="'New coding clininc'">
      <template v-slot:icon>
        <AvatarSelect
          class="w-32"
          selectedSize="12"
          :avatars="companies"
          :selected="companySelected"
          @change="ix => companySelected = ix"/>
      </template>
      <template v-slot:actions>
        <button :class="['btn shadow-sm px-4 py-2',
          loading ? 'loading' : '',
          (name && template) ? '' : 'opacity-20 cursor-not-allowed']"
          @click="template && onOk()">Create</button>
        <button class="btn shadow-sm px-4 py-2 mr-3" @click="$emit('cancel')">Cancel</button>
      </template>
      <div class="">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Name *</span>
          </label> 
          <input v-model="name" placeholder="name" class="input input-bordered" type="text">
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Description</span>
          </label> 
          <input v-model="description" placeholder="brief description" class="input input-bordered" type="text">
        </div>

        <label class="label">
          Choose a clinic template: *
        </label>
        <div class="flex flex-row gap-2">
          <div class="place-content-center text-center w-32 p-2 cursor-pointer"
            v-for="(card, ix) in templates" :key="ix"
            @click="template = ix"
          >
            <div class="w-32 h-24 border-dashed border-2 border-sky-500 rounded-lg">
              <div class="indicator-item badge badge-primary" v-if="template === ix">Selected</div> 
              <PlusIcon class="w-12 ml-10 mt-7" v-if="false" />
            </div>
            <h4 class="mt-1 text-info text-center"><strong>{{ card.title }}</strong></h4>
            <small>{{ card.description }}</small>
          </div>
        </div>

        <label class="label cursor-pointer" @click="powerSizeShown = !powerSizeShown">
          <u>Power size...</u>
        </label>
        <div class="border rounded-md p-2 h-40 flex flex-col" v-if="powerSizeShown">
          <ul class="w-full steps">
            <li v-for="(size, six) in powerSizes" :key="six"
              :data-content="size.id" :class="['step cursor-pointer', powerSize >= six ? 'step-' + powerStepColor : '']" @click="powerSize = six">{{ size.name }}</li> 
          </ul>
          <div :class="'grow flex flex-col justify-between prose text-center text-' + powerStepColor">
            <div><small>{{ powerSizes[powerSize].description }}</small></div>
            <div class="flex flex-row gap-2 justify-end">
              <div class="flex flex-row gap-2">
                <CogIcon class="w-6" />
                <small>{{ powerSizes[powerSize].type }}</small>
              </div>
              <div class="flex flex-row gap-2">
                <ClockIcon class="w-6" />
                <small>{{ powerSizes[powerSize].timeout }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
</template>
<script>
import { PlusIcon, CogIcon, ClockIcon } from '@heroicons/vue/outline'
import Dialog from '@/components/Dialog.vue'
import AvatarSelect from '@/components/AvatarSelect.vue'
export default {
  components: {
    PlusIcon,
    AvatarSelect,
    Dialog,
    CogIcon,
    ClockIcon
  },
  data () {
    return {
      loading: false,
      template: 0,
      name: null,
      description: null,
      companySelected: 0,
      powerSize: 0,
      powerSizeShown: false,
      templates: {
        "blank": {
          nekoImage: "m1k1o/neko:firefox",
          image: "",
          title: "Blank",
          description: "Empty project...",
          tags: ['nodejs', 'python', 'java']
        },
        "web": {
          nekoImage: "m1k1o/neko:firefox",
          image: "",
          title: "Web",
          description: "Web APP project.",
          tags: ['js', 'vue', 'react']
        },
        "data": {
          nekoImage: "m1k1o/neko:firefox",
          image: "",
          title: "Data ML/AI",
          description: "Data anlysis project.",
          tags: ['jupyter-lab', 'tensorflow', 'conda', 'pytorch']
        }
      }
    }
  },
  computed: {
    powerStepColor () {
      if (this.powerSize >= 3) {
        return 'error'
      }
      if (this.powerSize >= 2) {
        return 'accent'
      }
      if (this.powerSize >= 1) {
        return 'success'
      }
      return 'primary'
    },
    user () {
      return this.$storex.user.user
    },
    companies () {
      const { avatar, username } = this.user
      const { subscriptions } = this.user
      const validIds = subscriptions.map(({ company }) => company)
      return [
        { avatar, name: `@${username}` },
        ...this.user.companies.filter(c => validIds.indexOf(c.id) !== -1)
      ]
    },
    subscription () {
      const { companySelected } = this
      const { subscriptions } = this.user
      if (companySelected === 0) {
        return subscriptions.filter(({ personal }) => personal)[0].subscription
      }
      const companyInfo = this.companies[companySelected]
      const res = subscriptions.filter(({ company }) => company === companyInfo.id)[0]
      return res.subscription
    },
    powerSizes () {
      return this.subscription.powerSizes
    }
  },
  methods: {
    onOk () {
      this.loading = true
      this.$emit('ok', {
        name: this.name,
        description: this.description,
        ...this.templates[this.template],
        powerSize: this.powerSizes[this.powerSize]
      })
    }
  }
}
</script>