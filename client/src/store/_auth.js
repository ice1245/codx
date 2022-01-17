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
      state.auth = payload.auth;
      state.token = payload.token;
      state.user = payload.user;
    },
    verify(state, payload) {
      state.auth = payload;
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
          this.app.$toast.open({
            message: "Sign Up Successfully!!",
            type: "success",
            duration: 1000,
            dismissible: true,
            position: "top-right",
          });
          return res;
        })
        .catch((e) => {
          this.app.$toast.open({
            message: e.response?.data?.error?.message,
            type: "error",
            duration: 1000,
            dismissible: true,
            position: "top-right",
          });
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
          this.app.$toast.open({
            message: "Login Successfully!",
            type: "success",
            duration: 1000,
            dismissible: true,
            position: "top-right",
          });
          return payload;
        })
        .catch((e) => {
          this.app.$toast.open({
            message: e.response?.data?.error?.message,
            type: "error",
            duration: 1000,
            dismissible: true,
            position: "top-right",
          });
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
