import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js"; // 引入你的路由
import { createPinia } from "pinia"; //创建pinia

import "./styles/global.scss";

const app = createApp(App);
const pinia = createPinia();

app.use(router); // 使用路由
app.use(pinia);

app.mount("#app");
