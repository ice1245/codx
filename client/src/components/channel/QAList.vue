<template>
  <div class="qa-list flex flex-col scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
    <div class="flex flex-row mb-2 mr-4 cursor-pointer bg-base-300 px-1 rounded"
      v-for="(result, rix) in results" :key="rix"
      @click="$emit('show-qa', result)"
    >
      <div class="flex flex-col m-1 text-center">
        <div class="">
          <div>{{ result.votes }}</div>
          <div class="-mt-2"><small>votes</small></div>
        </div>
        <div class="border mt-1 px-2 pt-1 bg-secondary text-secondary-content">
          <div>{{ result.answers.length }}</div>
          <div class="-mt-2"><small>answers</small></div>
        </div>
      </div>
      <div class="flex flex-col pt-2 ml-2">
        <div class="text-accent">
          <h3><strong>{{ result.title }}</strong></h3>
        </div>
        <div>
          <div class="badge badge-outline"
            v-for="(tag, tix) in result.tags" :key="tix">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['results']
}
</script>