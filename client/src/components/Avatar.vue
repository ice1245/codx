<template>
  <div class="avatar">
    <div class="w-16 h-16">
      <img :src="url">
    </div>
  </div> 
</template>
<script>
export default {
  props: ['url']
}
</script>
<style>
.avatar {
    border-radius: 30px;
    overflow: hidden;
    width: 36px;
    height: 36px;
    border: 1px solid;
    background-color: #36404a;
}
.avatar img {
  width: 36px;
  height: 36px;
}
</style>