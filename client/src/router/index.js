import { createRouter, createWebHistory } from "vue-router";
import { $storex } from "@/store";
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../views/SignUp.vue"),
  },
  {
    path: "/reset",
    name: "ResetPassword",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/",
    name: "Main",
    component: () => import("../views/Main.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes,
});
router.beforeEach(async (to, from, next) => {
  let { fullPath, path, query } = to
  if (path.startsWith('/auth/')) {
    const provider = path.split("/").reverse()[0]
    await $storex.user.loginWithProvider({ ...query, provider })
    return next("/")
  }
  if (fullPath === "/logout") {
    await $storex.user.logout()
    fullPath = '/'
  } else {
    await $storex.user.fetchAccessToken()
  }
  if (!$storex.user.authenticated && fullPath !== '/login') {
    fullPath !== '/' && next("/login");
  }
  next();
});
export default router;
