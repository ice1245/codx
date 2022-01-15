import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import store from "./store";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import Vuex from 'vuex'
const app = createApp(App)
  .use(store)
  .use(router)
  .use(VueToast)
  .use(Vuex)
  .mount("#app");
store.app = app;
