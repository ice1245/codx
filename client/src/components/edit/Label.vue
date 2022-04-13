<template>
  <div class="cursor-pointer" @click="editing = true && (newLabel = label)">
    <input type="text"
      v-model="newLabel"
      class="input w-full max-w-xs"
      v-if="editing"
      @keypress.enter="newLabel !== label && $emit('change', newLabel)"
      @keypress.esc="editing = false"
      @blur="editing = false"
    >
    <div v-else>{{ label }}</div>
  </div>
</template>
<script>
export default {
  props: ['label'],
  data () {
    return {
      editing: false,
      newLabel: null
    }
  }
}
</script>