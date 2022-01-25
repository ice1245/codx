<template>
  <div class="space-y-4">
    <h1
      class="pt-8 font-semibold md:text-4xl text-3xl text-gray-100 text-center"
    >
      Sign in
    </h1>
    <h3
      class="md:pt-1 text-center px-3 md:px-0 md:text-xl text-lg font-medium text-gray-900"
    >
      Sign in to continue
    </h3>

    <div
      class="flex flex-col justify-center sm:px-6 lg:px-8 pt-6 sm:mx-auto w-full max-w-xl"
    >
      <div
        class="bg-black-600 w-full md:py-10 py-6 px-3 shadow sm:rounded sm:px-8"
      >
        <div
          class="space-y-3 md:py-4 pb-4 px-4"
        >
          <label
            htmlFor="identifier"
            class="block md:text-lg text-md font-medium text-gray-900"
          >
            identifier
          </label>
          <div
            class="flex items-center w-full bg-black-700 rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="bg-gray-300 md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <MailIcon class="cursor-pointer w-5 text-gray-900" />
            </div>
            <input
              v-model="identifier"
              type="email"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="example@gmail.com"
            />
          </div>
          <span
            v-if="errorIdentifier"
            class="pt-1 block text-sm text-red-400"
            >{{ errorIdentifier }}</span
          >
          <div class="flex items-center justify-between pt-2">
            <label
              htmlFor="password"
              class="block md:text-lg text-md font-medium text-gray-900"
            >
              Password
            </label>
            <div class="md:text-base text-md">
              <router-link to="/reset" class="font-medium text-gray-900">
                Forgot your password?
              </router-link>
            </div>
          </div>
          <div
            class="flex items-center w-full bg-black-700 rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="bg-gray-300 md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <LockClosedIcon class="cursor-pointer w-5 text-gray-900" />
            </div>
            <input
              v-model="password"
              type="password"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="Enter your password"
            />
          </div>
          <span v-if="errorPassword" class="pt-1 block text-sm text-red-400">{{
            errorPassword
          }}</span>
          <div class="pt-5">
            <button
              @click="submit"
              type="submit"
              class="capitalize w-full flex justify-center md:py-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-info-600/90 focus:outline-none"
            >
              Sign in
            </button>
          </div>
        </div>
        <br/>
        <label
          htmlFor="password"
          class="block md:text-lg text-md font-medium text-gray-900"
        >
           Don't have an account yet? 
          <router-link to="/signup" class="font-medium text-primary">
            Register...
          </router-link>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { MailIcon, LockClosedIcon } from "@heroicons/vue/outline";

export default {
  components: {
    MailIcon,
    LockClosedIcon,
  },
  data () {
    return {
      identifier: null,
      password: null,
      errorIdentifier: null,
      errorPassword: null
    }
  },
  methods: {
    async submit () {
      const { identifier, password } = this
      await this.$storex.user.login({ identifier, password })
      return this.$router.push("/")
    }
  }
};
</script>

<style></style>
