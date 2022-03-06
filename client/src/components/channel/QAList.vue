<template>
  <div class="qa-list flex flex-col scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100">
    <div class="flex flex-row mb-2 mr-4 cursor-pointer bg-base-300 px-1 rounded"
      v-for="(result, rix) in results" :key="rix"
      @click="$emit('show-qa', result)"
    >
      <div class="flex flex-col m-1 text-center">
        <div class="">
          <div>{{ result.votes || 0 }}</div>
          <div class="-mt-2"><small>votes</small></div>
        </div>
        <div class="border mt-1 px-2 pt-1 bg-secondary text-secondary-content">
          <div>{{ result.answers || 0 }}</div>
          <div class="-mt-2"><small>answers</small></div>
        </div>
      </div>
      <div class="flex flex-col py-2 ml-2 justify-between grow">
        <div class="text-accent">
          <h3><strong>{{ result.chat_message.content }}</strong></h3>
        </div>
        <div>
          <div class="badge badge-outline"
            v-for="(tag, tix) in result.tags" :key="tix">
            {{ tag }}
          </div>
        </div>
      </div>
      <div class="pr-2 h-full">
        <UserAvatar v-for="(user, uix) in users(result)" :key="uix" :user="user" />
      </div>
    </div>
  </div>
</template>
<script>
import UserAvatar from '@/components/UserAvatar.vue'
export default {
  components: {
    UserAvatar
  },
  props: ['results'],
  computed: {
    me () {
      return this.$storex.user.user
    }
  },
  methods: {
    users ({ chat_message: { chat: { id } } }) {
      return this.$storex.chat.chats[id].users
    }
  }
}
</script>