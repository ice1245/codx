<template>
  <div class="task-manager flex flex-col p-4">
    <div class="flex flex-col"
      v-for="(tasks, category, cix) in tasksByCategory" :key="cix"
    >
      <div class="card lg:card-side card-bordered mb-4 bg-gray-50">
        <div class="card-body">
          <h2 class="card-title">{{ category }}</h2>
          <div class="border rounded-lg p-4 cursor-pointer bg-base-200"
            @click="$emit('task-chat', task.chat)"
            v-for="(task, tix) in tasks" :key="tix">
            {{ task.entryLine.content }}
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" @click="$storex.company.createTask(key)" ><PlusIcon class="w-8" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  PlusIcon,
  MapIcon
} from '@heroicons/vue/outline'
export default {
  components: {
    PlusIcon,
    MapIcon
  },
  computed: {
    currentCompany () {
      return this.$storex.company.currentCompany
    },
    tasksByCategory () {
      return this.currentCompany.tasks
    }
  }
}
</script>