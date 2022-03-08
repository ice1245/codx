<template>
  <div>
    <div tabindex="0" class="dropdown dropdown-right cursor-pointer">
      <div class="flex flex-col text-center">
        <div class="avatar rounded-md btn btn-ghost btn-transparent">
          <div :class="`mb-8 rounded-btn w-${selectedSize||24} h-${selectedSize||24}`">
            <img :src="avatars[selected].avatar">
          </div>
        </div> 
        <div class="mt-2 w-full text-center">
          <strong class="float-left">{{ avatars[selected].name }}</strong>
          <ChevronDownIcon class="w-4 h-4" />
        </div>
      </div>
      <ul tabindex="0" class="p-2 shadow drop-shadow-lg menu dropdown-content bg-base-100 rounded-box w-52" ref="dropDown">
        <li v-for="(avatar, avix) in avatars" :key="avix"
          class="cursor-pointer text-center my-2"
          @click="setSelection(avix)"
        >
          <div class="avatar flex flex-row">
            <div :class="`rounded-btn w-${thumbnailSize||12} h-${thumbnailSize||12}`">
              <img :src="avatar.avatar">
            </div>
            <div class="mt-[10%] ml-2"><strong>{{ avatar.name }}</strong></div>
          </div> 
        </li> 
      </ul>
  </div>
  </div>
</template>
<script>
import { ChevronDownIcon } from '@heroicons/vue/solid'
export default {
  components: {
    ChevronDownIcon
  },
  props: ['avatars', 'selected', 'selectedSize', 'thumbnailSize'],
  methods: {
    setSelection (ix) {
      this.$emit('change', ix)
      this.$refs.dropDown.blur()
    }
  }
}
</script>