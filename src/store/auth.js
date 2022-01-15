import { getterTree, mutationTree, actionTree } from 'typed-vuex'
// import { accessor } from '~/store'

export const namespaced = true

import { useFetch } from "@/api/useFetch";

export const state = () => ({
  authenticated: false,
  token: localStorage.getItem("token") || "",
  user: null,
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  onSignup (state, payload) {
    state.authenticated = payload.authenticated;
    state.token = payload.token;
    state.user = payload.user;
  },
  verify (state, payload) {
    state.authenticated = payload;
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    fetchAccessToken(ctx) {
      const token = localStorage.getItem("token");
      if (token) {
        return ctx.commit("verify", true);
      }
      return ctx.commit("verify", false);
    },
    async signup(ctx, signload) {
      try {
        const res = await  useFetch
          .post("api/auth/local/register", {
            ...signload,
          })
        const payload = {
          token: res?.data?.jwt,
          user: res?.data?.user,
          authenticated: true,
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
        })
        } catch (e) {
          this.app.$toast.open({
            message: e.response?.data?.error?.message,
            type: "error",
            duration: 1000,
            dismissible: true,
            position: "top-right",
          })
        }
    },
    login(ctx, loginload) {
      try {
        const res = useFetch
          .post("api/auth/local", {
            ...loginload,
          })
          const payload = {
            token: res?.data?.jwt,
            user: res?.data?.user,
            authenticated: true,
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
        } catch(e) {
          this.app.$toast.open({
            message: e.response?.data?.error?.message,
            type: "error",
            duration: 1000,
            dismissible: true,
            position: "top-right",
          })
        }
    }
  },
)