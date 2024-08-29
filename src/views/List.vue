<template>
  <div class="List">
    <!-- 左侧栏目 -->
    <div class="left" @click="DrawerDataFlag = false">
      <img class="logo" src="../assets/img/logo.png" alt="" />

      <div @click="changeItem(0)" class="item" :style="activeCount == 0 ? avtiveStyle : ''">
        <FolderOpenOutlined :style="{ fontSize: '24px' }" />
        <span>全部文件</span>
      </div>
      <div @click="changeItem(1)" class="item" :style="activeCount == 1 ? avtiveStyle : ''">
        <UploadOutlined :style="{ fontSize: '24px' }" />
        <span>上传资源</span>
      </div>
      <!-- <div @click="changeItem(2)" class="item" :style="activeCount == 2 ? avtiveStyle : ''">
        <HeartOutlined :style="{ fontSize: '24px' }" />
        <span>我的收藏</span>
      </div> -->
      <div @click="changeItem(3)" class="item" :style="activeCount == 3 ? avtiveStyle : ''">
        <TeamOutlined :style="{ fontSize: '24px' }" />
        <span>共享星球</span>
      </div>

      <a-tooltip placement="top">
        <template #title>
          <span>前往个人中心页面</span>
        </template>
        <div class="user" @click="changeItem(4)" :style="activeCount == 4 ? avtiveStyle : ''">
          <img :src="userObj.avatar" alt="" />
          <span>{{ userObj.username }}</span>
        </div>
      </a-tooltip>
    </div>
    <div class="right">
      <!-- 子路由的加载函数 -->
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { FolderOpenOutlined, PictureOutlined, HeartOutlined, UploadOutlined, TeamOutlined } from "@ant-design/icons-vue";

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useStore } from "../stores/index";
import { storeToRefs } from "pinia";
const store = useStore();

let { activeCount, DrawerDataFlag } = storeToRefs(store); //在Pinia结构的值 查询到的数据数组

const userObj = JSON.parse(localStorage.getItem("userObj")); //本地保存的用户信息

// const activeCount = ref(1); //当前选中的标签页面
// 计算属性用于动态内联样式
const avtiveStyle = computed(() => ({
  backgroundColor: "#cccccc80", //"#f5f5f6"
  color: "#fb5a46",
  fontWeight: 600,
}));

// --------------------------------------------

// 跳转子路由函数
function changeRoute() {
  if (activeCount.value == 0) {
    router.push("/list/allfile");
  } else if (activeCount.value == 1) {
    router.push("/list/uploadfile");
  } else if (activeCount.value == 2) {
    router.push("/list/likefile");
  } else if (activeCount.value == 3) {
    router.push("/list/sharefile");
  } else if (activeCount.value == 4) {
    router.push("/list/userfile");
  }
}

// 开始的加载函数
onMounted(() => {
  changeRoute(); //跳转子路由

  // 当组件挂载后，给 document 添加事件监听器
  document.addEventListener("keydown", handlekeydown);
});

//组件销毁的时候
onBeforeUnmount(() => {
  // 在组件卸载前，移除事件监听器
  document.removeEventListener("keydown", handlekeydown);
});

// 监听上传组件的回车事件
function handlekeydown(event) {
  if (event.key === "Escape") {
    DrawerDataFlag.value = false;
  }
}

// 左侧边栏 切换进行路由跳转
function changeItem(value) {
  activeCount.value = value;
  changeRoute(); //跳转子路由
}
</script>
<style scoped lang="scss">
.List {
  display: flex;
  box-sizing: border-box;
  .left {
    position: relative;
    width: 220px;
    min-height: 100vh;
    border-right: 1px solid rgba(132, 133, 141, 0.2);
    border-left: 1px solid rgba(132, 133, 141, 0.2);
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
    .logo {
      display: block;
      width: 200px;
      margin: 20px auto 20px;
      box-sizing: border-box;
    }
    .item {
      cursor: pointer;
      display: flex;
      align-items: center;
      /* justify-content: center; */
      border-radius: 10px;
      height: 40px;
      vertical-align: middle;
      margin: 0 15px;
      box-sizing: border-box;
      color: #505155;
      margin-bottom: 10px;
      &:hover {
        background-color: #cccccc30;
      }
      span {
        font-size: 16px;
        margin-left: 10px;
      }
    }
    .user {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 70px;
      padding: 15px 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        height: 100%;
        border-radius: 50%;
        margin-right: 10px;
      }
      span {
        color: #25262b;
      }
    }
  }
  .right {
    flex: 1;
    /* background-color: pink; */
  }
}
</style>
