import { createRouter, createWebHistory } from "vue-router";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import allFile from "../components/allFile.vue";
import uploadFile from "../components/uploadFile.vue";
import likeFile from "../components/likeFile.vue";
import shareFile from "../components/shareFile.vue";
const routes = [
  {
    path: "/",
    redirect: "/list",
    meta: { requiresAuth: true }, // 添加此行来标记需要认证
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"), // 使用异步组件加载
  },
  {
    path: "/list",
    name: "List",
    meta: { requiresAuth: true }, // 添加此行来标记需要认证
    component: () => import("../views/List.vue"), // 使用异步组件加载
    children: [
      {
        path: "allfile",
        name: "allFile",
        component: allFile,
      },
      {
        path: "uploadfile",
        name: "uploadFile",
        component: uploadFile,
      },
      {
        path: "likefile",
        name: "likeFile",
        component: likeFile,
      },
      {
        path: "sharefile",
        name: "shareFile",
        component: shareFile,
      },
    ], //子路由
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否登录
  let isLoggedIn = null;
  // token 没有过期
  if (+localStorage.getItem("token") > Date.now() && localStorage.getItem("token") != null) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }
  // 检查目标路由是否需要认证
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    // 如果未登录且目标路由需要认证，则重定向到登录页
    Modal.confirm({
      title: "熊仔提示",
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode(
        "div",
        {
          style: "color:red;",
        },
        "认证过期,请重新登录"
      ),
      onOk() {
        next("/login");
      },
      onCancel() {
        next("/login");
      },
      class: "test",
    });
  } else {
    // 允许导航继续
    next();
  }
});

export default router;
