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
      <div>
        <label class="label">
          Choose a clinic template:
        </label>
        <select
          v-model="template"
          class="select select-bordered select-sm w-full max-w-xs text-primary"
        >
          <option v-for="(tpl, key, tix) in templates" :key="tix">{{ key }}</option>
        </select>
        <div v-if="template">
          <label class="label">
            Select APPS to install
          </label>
          <small><strong>You can add them later</strong></small>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="(app, name, ix) in templates[template].apps" :key="ix">
              <div class="form-control">
                <label class="cursor-pointer label">
                  <span class="mr-2">{{ name }}</span> 
                  <input type="checkbox" :checked="app.install" @change="app.install = !app.install" class="toggle">
                </label>
              </div>
              <div v-if="app.install && false">
                <div v-for="(value, key, aix) in app" :key="aix">
                  <div class="form-control" v-if="key !== 'install'">
                    <label class="label">
                      <span class="label-text">{{ `${name}: ${key}` }}</span>
                    </label> 
                    <input type="text" :placeholder="value" class="input input-sm input-bordered">
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
</template>
<script>
import { CogIcon } from '@heroicons/vue/outline'
import Dialog from '@/components/Dialog.vue'
export default {
  components: {
    CogIcon,
    Dialog
  },
  data () {
    return {
      loading: false,
      template: 0,
      templates: {
        "code-server basic": {
          image: "m1k1o/neko:firefox",
          apps: {
            git: { repo: "" },
            nodejs: { version: "" },
            python: { version: "" },
            jupyter: { version: "" },
            ".NetCore": { version: "" },
            java: { version: "" },
            rust: { version: "" }
          }
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