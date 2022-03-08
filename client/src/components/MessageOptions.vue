<template>
  <div class="flex flex-row group gap-2">
    <slot></slot>
    <PencilIcon class="group-hover:visible invisible w-6 cursor-pointer" @click="$emit('edit-message')" />
    <TrashIcon class="group-hover:visible invisible w-6 cursor-pointer text-error" @click="$emit('delete-message')" />
  </div>
</template>

<script>
import { PencilIcon, TrashIcon } from "@heroicons/vue/solid";

export default {
  components: {
    PencilIcon,
    TrashIcon
  },
};
</script>
