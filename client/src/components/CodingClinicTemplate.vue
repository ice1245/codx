<template>
  <Dialog
      @close="$emit('close')"
      @ok="$emit('ok')"
      :btns="['ok']"
    >
      <template v-slot:icon>
        <Avatar size="12" :url="template.user.avatar" />
      </template>
      <div class="h-96">
        <div class="tabs ml-4">
          <a :class="['tab tab-bordered', tabIndex === 0 ? 'tab-active': '']"
            @click="tabIndex = 0">Overview</a> 
          <a :class="['tab tab-bordered', tabIndex === 1 ? 'tab-active': '']"
            @click="tabIndex = 1" v-if="template.readme">README</a> 
        </div>
        <div v-if="tabIndex == 0">
          <div class="max-w-lg p-4 space-x-4 carousel carousel-center bg-neutral rounded-box h-1/3">
            <div class="w-full carousel-item"
              v-for="(mhtml, iix) in media" :key="iix"
              >
              <div v-html="mhtml" class="w-full"></div>
            </div>
          </div>
          <div class="flex flex-row w-full">
            <div class="ml-4 flex flex-col w-full">
              <div class="flex flex-row justify-between w-full">
                <strong>{{ `@${template.user.username}` }}</strong>
                <div class="flex flex-row mr-2">
                  <ThumbUpIcon class="w-4" /> {{ template.likeCount }}
                  <ThumbDownIcon class="ml-2 w-4" /> {{ template.dislikeCount }}
                </div>
              </div>
              <small>Category 4*</small>
            </div>
          </div>
          <p class="prose">
            <span>
              {{ template.description }}
            </span>
          </p>
        </div>
        <div v-if="tabIndex === 1" class="w-full h-full pt-2 pb-6 prose scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
          <VueMarkdown :source="templateInfo" class="w-full h-full p-5" />
        </div>
      </div>
    </Dialog>
</template>
<script>
import {
  ThumbUpIcon,
  ThumbDownIcon
} from '@heroicons/vue/outline'
import VueMarkdown from '@/components/VueMarkdown.vue'
import Dialog from '@/components/Dialog.vue'
import Avatar  from '@/components/Avatar.vue'
import axios from 'axios'
export default {
  components: {
    ThumbUpIcon,
    ThumbDownIcon,
    Dialog,
    Avatar,
    VueMarkdown
  },
  props: ['template', 'media'],
  data () {
    return {
      tabIndex: 0,
      templateInfo: `# Test`
    }
  },
  async created () {
    const { data: md } = await axios.get(this.template.readme)
    this.templateInfo = md
  }

}
</script>