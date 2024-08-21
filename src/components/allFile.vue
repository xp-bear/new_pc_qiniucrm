<template>
  <div class="allFile">
    <!-- 抽屉 组件 -->
    <transition name="slide-right" mode="out-in">
      <div class="drawer" @contextmenu.prevent="handleRightClick" v-if="DrawerDataFlag">
        <DrawerDataDisplay></DrawerDataDisplay>
      </div>
    </transition>

    
    <a-dropdown :trigger="['contextmenu']">
      <div :style="{ background: 'transparent', height: '100vh' }">
        <!-- 搜索组件 -->
        <Search></Search>
        <!-- 数据展示组件 -->
        <DataShow></DataShow>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item key="1" style="display: flex; align-items: center; vertical-align: bottom" @click="changeUpload">
            <VerticalAlignTopOutlined style="margin-right: 5px" />
            <span>选择文件</span>
          </a-menu-item>
          <a-menu-item key="2">熊仔开发中...</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import { VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import Search from "../components/Search.vue";
import DataShow from "../components/DataShow.vue";
import { onMounted, ref } from "vue";

import { useStore } from "../stores/index";
import { storeToRefs } from "pinia";
const store = useStore();

import { useRouter } from "vue-router";
const router = useRouter();

let { pageTotal, pageIndex, activeCount, DrawerDataFlag, DrawerDataItem } = storeToRefs(store); //在Pinia结构的值 查询到的数据数组

// ----------------------------------------------------------
// 右键点击抽屉
const handleRightClick = (event) => {
  event.preventDefault(); // 阻止默认的上下文菜单弹出
  //修改抽屉状态为隐藏
  DrawerDataFlag.value = false;
};

// 右键上传文件
function changeUpload(value) {
  activeCount.value = 1; //上传文件属性值
  router.push("/list/uploadFile");
}

// 重新切换到全部文件组件,重新赋值页码
onMounted(() => {
  pageIndex.value = 1;
  pageTotal.value = 24;
});
</script>
<style scoped lang="scss">
.allFile {
  position: relative;
  .drawer {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 220px;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.8);
  }
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.3s ease;
    z-index: 2;
  }

  .slide-right-enter-from,
  .slide-right-leave-to {
    transform: translateX(100%);
  }
}
</style>
