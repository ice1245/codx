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
router.beforeEach((to, from, next) => {
  $storex.auth.fetchAccessToken()
  if (to.fullPath === "/") {
    if (!$storex.auth.authenticated) {
      next("/login");
    }
  }
  if (to.fullPath === "/login") {
    if ($storex.auth.authenticated) {
      next("/");
    }
  }
  next();
});
export default router;
