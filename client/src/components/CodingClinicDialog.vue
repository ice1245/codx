<template>
  <Dialog :title="'New coding clininc'">
      <template v-slot:icon>
        <CogIcon class="h-6 w-6 text-neutral-600" aria-hidden="true" />
      </template>
      <template v-slot:actions>
        <button :class="['btn shadow-sm px-4 py-2',
          loading ? 'loading' : '',
          template ? '' : 'opacity-20 cursor-not-allowed']"
          @click="template && onOk()">Create</button>
        <button class="btn shadow-sm px-4 py-2 mr-3" @click="$emit('cancel')">Cancel</button>
      </template>
      <div class="">
        <label class="label">
          Choose a clinic template:
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
      </div>
    </Dialog>
</template>
<script>
import { CogIcon, PlusIcon } from '@heroicons/vue/outline'
import Dialog from '@/components/Dialog.vue'
export default {
  components: {
    CogIcon,
    PlusIcon,
    Dialog
  },
  data () {
    return {
      loading: false,
      template: 0,
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
  methods: {
    onOk () {
      this.loading = true
      this.$emit('ok', {
        name: this.template,
        ...this.templates[this.template]
      })
    }
  }
}
</script>