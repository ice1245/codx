<template>
  <div class="avatar">
  <div class="bg-primary mb-8 rounded-full w-12 h-12">
    <img :src="url">
  </div>
</div> 
</template>
<script>
export default {
  props: ['url']
}
</script>