<template>
  <div class="max-w-md py-2 h-full">
    <div class="flex items-center justify-between pt-4 md:px-8 px-6">
      <p class="font-medium text-2xl lg:text-3xl text-gray-100 text-center">
        My Profile
      </p>
    </div>
    <div class="flex flex-col items-center justify-center space-y-3 pt-4">
      <div class="mt-3 relative flex">
        <img
          class="inline-block h-26 w-26 rounded-full ring-white"
          src="https://w7.pngwing.com/pngs/524/696/png-transparent-computer-icons-user-symbol-symbol-miscellaneous-black-computer-icons.png"
          alt="avatar"
        />
        <t-tag
          tag-name="span"
          variant="badge"
          class="bg-black-300 h-11 w-11 rounded-full absolute -bottom-1 -right-1 flex items-center justify-center"
        >
          <PencilIcon
            class="cursor-pointer w-5 text-gray-900 flex items-center text-center justify-center"
          />
        </t-tag>
      </div>
      <p
        class="font-semibold tracking-tight text-xl text-gray-100 text-center pt-4"
      >
        Patricia Smith
      </p>
      <div class="flex items-center space-x-3 pb-7">
        <div class="ring-4 rounded-full ring-green-500 h-0.5 w-0.5"></div>
        <p class="font-medium text-lg text-gray-200">Active</p>
      </div>
      <hr class="border-gray-300 w-full" />
      <p
        class="font-medium text-lg tracking-tight text-gray-900 md:pt-6 pt-3 md:px-8 px-6"
      >
        If several languages coalesce, the grammer of the resulting language is
        more simple and regular than that of the individual.
      </p>
    </div>
    <div
      class="my-6 md:mx-8 mx-6 bg-black-600 rounded-md overflow-hidden border border-gray-400"
    >
      <div class="tab__header">
        <a
          href="#"
          class="tab__link p-4 bg-gray-400 hover:bg-blue-darker no-underline text-gray-200 flex items-center justify-between"
          @click.prevent="active = !active"
        >
          <div class="flex items-center space-x-3">
            <UserIcon class="cursor-pointer w-4 text-gray-100" />
            <strong class="text-gray-100 font-medium">About</strong>
          </div>

          <span class="down-Arrow" v-show="!active">
            <ChevronDownIcon class="cursor-pointer w-4 text-gray-100" />
          </span>
          <span class="up-Arrow" v-show="active">
            <ChevronUpIcon class="cursor-pointer w-4 text-gray-100" />
          </span>
        </a>
      </div>
      <div class="tab__content p-6" v-show="active">
        <p class="font-medium text-lg text-gray-200 pb-0.5">Name</p>
        <p class="font-medium text-lg text-gray-100">Patricia Smith</p>
        <p class="font-medium text-lg text-gray-200 pb-0.5 pt-7">Email</p>
        <p class="font-medium text-lg text-gray-100">Patriciasmith@1.co</p>
        <p class="font-medium text-lg text-gray-200 pb-0.5 pt-7">Time</p>
        <p class="font-medium text-lg text-gray-100">11:00 AM</p>
        <p class="font-medium text-lg text-gray-200 pb-0.5 pt-7">Location</p>
        <p class="font-medium text-lg text-gray-100">USA</p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/vue/outline";
import { PencilIcon } from "@heroicons/vue/solid";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  components: {
    UserIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PencilIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const logout = () => {
      localStorage.clear();
      store.dispatch("fetchAccessToken");
      return router.push("/login");
    };
    return {
      logout,
    };
  },
  data() {
    return {
      active: true,
    };
  },
};
</script>
<style scoped></style>
