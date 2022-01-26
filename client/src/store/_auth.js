import { createStore, createLogger } from "vuex";
import { useFetch } from "@/api/useFetch";
export default createStore({
  plugins: [
    createLogger({
      logActions: true,
      logMutations: true,
    }),
  ],
  state: {
    auth: false,
    token: localStorage.getItem("token") || "",
    user: null,
  },
  mutations: {
    onSignup: (state, payload) => {
      state.user = payload.user;
      state.token = payload.token;
      state.user = payload.user;
    },
    verify(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    fetchAccessToken(ctx) {
      const token = localStorage.getItem("token");
      if (token) {
        return ctx.commit("verify", true);
      }
      return ctx.commit("verify", false);
    },
    signup(ctx, payload) {
      return useFetch
        .post("api/auth/local/register", {
          ...payload,
        })
        .then((res) => {
          const payload = {
            token: res?.data?.jwt,
            user: res?.data?.user,
            auth: true,
          };
          localStorage.setItem("token", res?.data?.jwt);
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          ctx.commit("onSignup", payload);
          this.app.$notify({
            text: "Sign Up Successfully!!",
            group: "success"
          }, 2000);
          return res;
        })
        .catch((e) => {
          this.app.$notify({
            text: e.response?.data?.error?.message,
            group: "error"
          }, 2000);
          return null;
        });
    },
    login(ctx, payload) {
      return useFetch
        .post("api/auth/local", {
          ...payload,
        })
        .then((res) => {
          console.log("response", res);
          const payload = {
            token: res?.data?.jwt,
            user: res?.data?.user,
            auth: true,
          };
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          localStorage.setItem("token", res?.data?.jwt);
          ctx.commit("onSignup", payload);
          this.app.$notify({
            text: "Login success",
            group: "success"
          }, 2000);
          return payload;
        })
        .catch((e) => {
          this.app.$notify({
            text: e.response?.data?.error?.message,
            group: "error"
          }, 2000);
          return null;
        });
    },
  },
  modules: {},
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
});
