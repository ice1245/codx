<template>
  <div class="space-y-4">
    <h1
      class="pt-8 font-semibold md:text-4xl text-3xl text-gray-100 text-center"
    >
      Sign up
    </h1>
    <h3
      class="md:pt-1 text-center px-3 md:px-0 md:text-xl text-lg font-medium text-gray-900"
    >
      Get your account now.
    </h3>

    <div
      class="flex flex-col justify-center sm:px-6 lg:px-8 pt-6 sm:mx-auto w-full max-w-xl"
    >
      <div
        class="bg-black-600 w-full md:py-10 py-6 px-3 shadow sm:rounded sm:px-8"
      >
        <form
          @submit="onSubmit"
          class="space-y-3 md:py-4 pb-4 px-4"
          action="{action}"
          method=""
        >
          <label
            htmlFor="username"
            class="block md:text-lg text-md font-medium text-gray-900"
          >
            Username
          </label>
          <div
            class="flex items-center w-full bg-black-700 rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="bg-gray-300 md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <UserIcon class="cursor-pointer w-5 text-gray-900" />
            </div>
            <input
              :ref="username.ref"
              v-model="username.value"
              type="text"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="Enter username"
            />
          </div>
          <span v-if="username.error" class="pt-1 block text-sm text-red-400">{{
            username.error.message
          }}</span>
          <label
            htmlFor="email"
            class="pt-1.5 block md:text-lg text-md font-medium text-gray-900"
          >
            Email
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
              :ref="email.ref"
              v-model="email.value"
              type="email"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="Enter your email"
            />
          </div>
          <span v-if="email.error" class="pt-1 block text-sm text-red-400">{{
            email.error.message
          }}</span>
          <label
            class="pt-1.5 block md:text-lg text-md font-medium text-gray-900"
          >
            Password
          </label>

          <div
            class="flex items-center w-full bg-black-700 rounded-lg overflow-hidden border border-gray-300"
          >
            <div
              class="bg-gray-300 md:w-14 w-10 md:h-12 h-10 px-3 flex items-center justify-center"
            >
              <LockClosedIcon class="cursor-pointer w-5 text-gray-900" />
            </div>
            <input
              :ref="password.ref"
              v-model="password.value"
              type="password"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="Enter your password"
            />
          </div>
          <span v-if="password.error" class="pt-1 block text-sm text-red-400">{{
            password.error.message
          }}</span>
          <div class="pt-5">
            <button
              type="submit"
              class="capitalize w-full flex justify-center md:py-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-info-600/90 focus:outline-none"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { MailIcon, LockClosedIcon, UserIcon } from "@heroicons/vue/outline";
import { useForm } from "vue-hooks-form";
import { $storex } from '@/store'
import { useRouter } from "vue-router";

export default {
  components: {
    MailIcon,
    LockClosedIcon,
    UserIcon,
  },
  setup() {
    const router = useRouter();

    const { useField, handleSubmit } = useForm({
      defaultValues: {},
      shouldUnregister: true,
      validateMode: "change",
    });
    const username = useField("username", {
      rule: { required: true },
    });
    const email = useField("email", {
      rule: { required: true },
    });
    const password = useField("password", {
      rule: {
        required: true,
        min: 6,
        max: 10,
      },
    });

    const onSubmit = async (data) => {
      await $storex.user.signup(data)
      return router.push("/");
    };
    return {
      username,
      email,
      password,
      onSubmit: handleSubmit(onSubmit),
    };
  },
};
</script>

<style></style>
