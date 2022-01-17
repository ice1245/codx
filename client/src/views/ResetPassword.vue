<template>
  <div class="space-y-4">
    <h1
      class="pt-8 font-semibold md:text-4xl text-3xl text-gray-100 text-center"
    >
      Reset Password
    </h1>
    <h3
      class="md:pt-1 text-center px-3 md:px-0 md:text-xl text-lg font-medium text-gray-900"
    >
      Reset Password
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
            htmlFor="email"
            class="block md:text-lg text-md font-medium text-gray-900"
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
              id="email"
              class="block w-full md:px-4 px-3 md:py-3 py-2.5 placeholder-gray-200 text-gray-200 focus:outline-none sm:text-base text-sm border-gray-300 bg-transparent font-medium"
              placeholder="Enter your email"
            />
          </div>

          <div class="pt-6">
            <button
              type="submit"
              class="capitalize w-full flex justify-center md:py-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-info-600/90 focus:outline-none"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { MailIcon } from "@heroicons/vue/outline";
import { useForm } from "vue-hooks-form";

export default {
  components: {
    MailIcon,
  },
  setup() {
    const { useField, handleSubmit } = useForm({
      defaultValues: {},
      shouldUnregister: true,
      validateMode: "change",
    });
    const email = useField("email", {
      rule: { required: true },
    });

    const onSubmit = (data) => console.log(data);
    return {
      email,
      onSubmit: handleSubmit(onSubmit),
    };
  },
};
</script>

<style></style>
