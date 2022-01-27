<template>
  <div class="alert">
    <div class="flex-1">
      <label class="mx-3">{{ message.entries[0].content }}</label>
    </div> 
    <div class="flex-none">
      <button class="btn btn-sm btn-ghost mr-2" @click="$emit('cancel')">Cancel</button> 
      <button class="btn btn-sm btn-primary" @click="$emit('ok')">Apply</button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['isMe', 'message']
}
</script>