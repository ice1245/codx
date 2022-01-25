import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import store, { $storex } from "./store";
import Vuex from 'vuex'

const app = createApp(App)
  .use(Vuex)
  .use(store)
  .use(router)
  .mount("#app");

store.app = app;
app.$.appContext.config.globalProperties.$storex = $storex
