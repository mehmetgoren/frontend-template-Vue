import Vue from "vue";
import Router from "vue-router";


import AppUserPage from "@/views/admin-panel/AppUserPage.vue";
import AppSettingsPage from "@/views/admin-panel/AppSettingsPage.vue";
import SocketDemoPage from "@/views/admin-panel/SocketDemoPage.vue";
import MenuPage from "@/views/admin-panel/MenuPage.vue";
import QueryLogPage from "@/views/admin-panel/QueryLogPage.vue";
import RoleActionPage from "@/views/admin-panel/RoleActionPage.vue";
import RoleMenuPage from "@/views/admin-panel/RoleMenuPage.vue";
import RolePage from "@/views/admin-panel/RolePage.vue";
import ServerDashboardPage from "@/views/admin-panel/ServerDashboardPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/AppUsers",
      name: "AppUsers",
      component: AppUserPage
    },
    {
      path: "/AppSettings",
      name: "AppSettings",
      component: AppSettingsPage
    },
    {
      path: "/SocketDemo",
      name: "SocketDemo",
      component: SocketDemoPage
    },
    {
      path: "/Menus",
      name: "Menus",
      component: MenuPage
    },
    {
      path: "/Logs",
      name: "Logs",
      component: QueryLogPage
    },
    {
      path: "/RoleActions",
      name: "RoleActions",
      component: RoleActionPage
    },
    {
      path: "/RolesMenus",
      name: "RolesMenus",
      component: RoleMenuPage
    },
    {
      path: "/Roles",
      name: "Roles",
      component: RolePage
    },
    {
      path: "/ServerInfo",
      name: "ServerInfo",
      component: ServerDashboardPage
    }
  ]
});
