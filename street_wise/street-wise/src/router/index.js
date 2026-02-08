import { createRouter, createWebHistory } from "vue-router";

import Home from "../Home.vue";
import Main from "../Main.vue";

const routes = [
  { path: "/home", name: "home", component: Home },
  { path: "/application", name: "application", component: Main }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
