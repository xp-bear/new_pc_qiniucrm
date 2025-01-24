<template>
  <div class="likeFile">
    <!-- 弹出层 -浮动不占位置 -->
    <transition name="slide-right" mode="out-in">
      <div class="drawer" @contextmenu.prevent="handleRightClick" v-if="DrawerDataFlag">
        <DrawerDataDisplay></DrawerDataDisplay>
      </div>
    </transition>

    <!-- 列表数据展示 -->
    <DataShow></DataShow>
  </div>
</template>
<script setup>
import { mSearchShareFileApi } from "../api/index";
import DataShow from "../components/DataShow.vue";
import { onMounted, ref } from "vue";

import { useStore } from "../stores/index";
import { storeToRefs } from "pinia";
const store = useStore();
let { pageTotal, pageIndex, activeCount, DrawerDataFlag, DrawerDataItem, cardDataArray } = storeToRefs(store); //在Pinia结构的值 查询到的数据数组

// 右键点击抽屉
const handleRightClick = (event) => {
  event.preventDefault(); // 阻止默认的上下文菜单弹出
  //修改抽屉状态为隐藏
  DrawerDataFlag.value = false;
};

// 请求共享数据
onMounted(() => {
  // 请求共享的文件和数据
  mSearchShareFileApi({ page_index: (pageIndex.value - 1) * pageTotal.value, page_total: pageTotal.value }).then((res) => {
    cardDataArray.value = res.msg;
  });
});
</script>

<style scoped lang="scss">
.likeFile {
  position: relative;
  height: 100vh;
  .drawer {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    /* left: 220px; */
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
