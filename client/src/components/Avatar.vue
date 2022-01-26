<template>
  <div :class="['avatar', online ? 'online' : '' ]">
  <div :class="[`bg-primary rounded-full w-${size || 12} h-${size || 12}`, (ring ? `ring ring-primary ring-offset-base-${ring} ring-offset-2` : '')]">
    <img :src="url">
  </div>
</div> 
</template>
<script>
export default {
  props: ['url', 'size', 'ring', 'online']
}
</script>