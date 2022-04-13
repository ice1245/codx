import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import store, { $storex } from "./store";
import Vuex from 'vuex'
import Notifications from 'notiwind'
import VueMobileDetection from "vue-mobile-detection"

const app = createApp(App)
  .use(Vuex)
  .use(store)
  .use(router)
  .use(Notifications)
  .use(VueMobileDetection)
  .mount("#app");

store.app = app;
app.$.appContext.config.globalProperties.$storex = $storex
$storex.init()
