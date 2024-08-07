<template>
  <!-- 路由占位符 -->
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "./stores/index";
import { storeToRefs } from "pinia";
const store = useStore();
let { count, doubleCount } = storeToRefs(store);
// ************************************************

import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

const locale = ref(zhCN);
</script>

<style lang="scss">
#app {
  font-family: "consolas";
}
</style>
