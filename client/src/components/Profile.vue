<template>
  <div
    class="
      grid
      items-center
      gap-4
      p-4
      py-8
      place-items-center
      flex-shrink-0
      col-span-3
      row-span-3
      mx-2
      xl:mx-0
      w-72
      xl:w-auto
      place-self-start
      xl:w-full
    "
  >
    <div class="dropdown">
      <div tabindex="0">
        <div class="avatar online">
          <div
            class="
              w-24
              h-24
              p-px
              mask mask-squircle
              bg-base-content bg-opacity-10
            "
          >
            <img
              :src="user.avatar"
              width="94"
              height="94"
              alt="Avatar Tailwind CSS Component"
              class="mask mask-squircle"
            />
          </div>
        </div>
      </div>
      <div tabindex="0" class="py-2 dropdown-content">
        <div
          class="
            shadow-xl
            w-72
            card
            compact
            bg-neutral-focus
            text-neutral-content
            rounded-box
          "
        >
          <div class="card-body">
            <h2 class="font-extrabold capitalize card-title">
              avatar component
            </h2>
            <p class="text-sm text-neutral-content text-opacity-80">
              Use avatar component with any size
            </p>
            <div class="flex justify-end mt-4">
              <a
                href="/components/avatar"
                class="btn btn-primary btn-sm xl:btn-md"
              >
                See component
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="dropdown w-full">
        <div tabindex="0">
          <div class="text-center">
            <div class="text-lg font-extrabold">Betsy Braddock</div>
            <div class="my-3 text-sm text-base-content text-opacity-60">
              Strategic Art Manager
              <br />Global Illustration Observer <br />Business Alignment
              Developer
            </div>
          </div>
        </div>
        <div tabindex="0" class="py-2 dropdown-content">
          <div
            class="
              shadow-xl
              w-72
              card
              compact
              bg-neutral-focus
              text-neutral-content
              rounded-box
            "
          >
            <div class="card-body">
              <h2 class="font-extrabold capitalize card-title">
                card component
              </h2>
              <p class="text-sm text-neutral-content text-opacity-80">
                Card component is used to show products, features and more.
              </p>
              <div class="flex justify-end mt-4">
                <a
                  href="/components/card"
                  class="btn btn-primary btn-sm xl:btn-md"
                >
                  See component
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown w-full">
        <div tabindex="0">
          <div class="mt-2 text-center">
            <div class="badge badge-ghost">Design</div>
            <div class="badge badge-ghost">Art</div>
            <div class="badge badge-ghost">Illustration</div>
          </div>
        </div>
        <div tabindex="0" class="py-2 dropdown-content">
          <div
            class="
              shadow-xl
              w-72
              card
              compact
              bg-neutral-focus
              text-neutral-content
              rounded-box
            "
          >
            <div class="card-body">
              <h2 class="font-extrabold capitalize card-title">
                badge component
              </h2>
              <p class="text-sm text-neutral-content text-opacity-80">
                Use badge component to highlight small inline items
              </p>
              <div class="flex justify-end mt-4">
                <a
                  href="/components/badge"
                  class="btn btn-primary btn-sm xl:btn-md"
                >
                  See component
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dropdown dropdown-top">
      <div tabindex="0">
        <div class="btn-group">
          <button class="btn btn-accent btn-sm">Follow</button>
          <button
            aria-label="button component"
            class="btn btn-accent btn-sm btn-square"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="w-6 h-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div tabindex="0" class="py-2 dropdown-content">
        <div
          class="
            shadow-xl
            w-72
            card
            compact
            bg-neutral-focus
            text-neutral-content
            rounded-box
          "
        >
          <div class="card-body">
            <h2 class="font-extrabold capitalize card-title">
              button group component
            </h2>
            <p class="text-sm text-neutral-content text-opacity-80">
              Use it to group multiple buttons together
            </p>
            <div class="flex justify-end mt-4">
              <a
                href="/components/button-group"
                class="btn btn-primary btn-sm xl:btn-md"
              >
                See component
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ThemeSelector />
  </div>
</template>
<script>
import ThemeSelector from './ThemeSelector.vue'
export default {
  components: {
    ThemeSelector
  },
  props: ['user']
};
</script>
<style scoped></style>
