<template>
  <div class="Search">
    <a-select @change="changeType" v-model:value="selectType" allowClear style="width: 150px; margin-right: 10px" placeholder="选择文件类型">
      <a-select-option value="0">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/0.png" alt="" style="height: 12px; margin-right: 5px" />图片</span>
      </a-select-option>
      <a-select-option value="1">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/1.png" alt="" style="height: 12px; margin-right: 5px" />视频</span>
      </a-select-option>
      <a-select-option value="2">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/2.png" alt="" style="height: 12px; margin-right: 5px" />音乐</span>
      </a-select-option>
      <a-select-option value="3">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/3.png" alt="" style="height: 12px; margin-right: 5px" />压缩包</span>
      </a-select-option>
      <a-select-option value="4">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/4.png" alt="" style="height: 12px; margin-right: 5px" />安装包</span>
      </a-select-option>
      <a-select-option value="5">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/5.png" alt="" style="height: 12px; margin-right: 5px" />代码文件</span>
      </a-select-option>
      <a-select-option value="6">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/6.png" alt="" style="height: 12px; margin-right: 5px" />记事本</span>
      </a-select-option>
      <a-select-option value="7">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/7.png" alt="" style="height: 12px; margin-right: 5px" />office文件</span>
      </a-select-option>
      <a-select-option value="8">
        <span style="display: flex; align-items: center; vertical-align: bottom"><img src="../assets/types/8.png" alt="" style="height: 12px; margin-right: 5px" />其他文件</span>
      </a-select-option>
    </a-select>
    <a-input v-model:value="userValue" placeholder="按文件名搜索" allow-clear style="width: 200px; margin-right: 10px" />
    <a-input v-model:value="remarkValue" placeholder="按文件备注搜索" allow-clear style="width: 200px; margin-right: 10px" />
    <a-range-picker v-model:value="dateValue" :locale="locale" style="margin-right: 10px" />
    <a-button type="primary" style="margin-right: 10px" @click="searchData">
      <template #icon> <SearchOutlined /> </template>搜索一下
    </a-button>
    <a-button type="primary" danger @click="reset">
      <template #icon> <SyncOutlined /> </template>重置状态
    </a-button>
  </div>
</template>
<script setup>
import { SearchOutlined, SyncOutlined } from "@ant-design/icons-vue";
import { pcsearchfileApi } from "../api/index";
import { ref, computed, onBeforeUnmount, onMounted, watch } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
dayjs.locale("zh-cn");

import { useStore } from "../stores/index";
import { storeToRefs } from "pinia";
const store = useStore();
let { cardDataArray, pageCount, pageTotal, pageIndex } = storeToRefs(store); //在Pinia结构的值 查询到的数据数组

const selectType = ref(undefined); //文件类型
const userValue = ref(""); //文件名
const remarkValue = ref(""); //文件备注
const dateValue = ref(); //查询文件日期

// ----------------------------------------------------------
// 多选框选择对应文件查询
function changeType(value) {
  getData(); //获取数据函数
}

// 重置状态
function reset() {
  selectType.value = undefined;
  userValue.value = "";
  remarkValue.value = "";
  dateValue.value = undefined;
  getData(); //获取数据函数
}

// 搜索按钮点击的事件
function searchData() {
  getData(); //获取数据函数
}

// 监听搜索组件的回车事件
function handleKeyPress(event) {
  if (event.key === "Enter") {
    getData(); //获取数据函数
  }
}

// 获取数据函数
function getData() {
  // 处理时间数组
  let time_array = [];
  if (Boolean(dateValue.value)) {
    time_array[0] = dayjs(dateValue.value[0].$d).format("YYYY-MM-DD");
    time_array[1] = dayjs(dateValue.value[1].$d).format("YYYY-MM-DD");
  }

  // 在这里执行你的业务逻辑
  let data = {
    pageIndex: (pageIndex.value - 1) * pageTotal.value, //页面索引
    pageTotal: pageTotal.value, //页面总条数
    file_name: userValue.value, //搜索关键字
    file_remark: remarkValue.value, //搜索文件备注
    file_type: +selectType.value, //文件类型
    file_user_id: JSON.parse(localStorage.getItem("userObj")).id,
    time_range: time_array,
  };
  // console.log("search 组件", pageIndex.value, pageTotal.value);
  pcsearchfileApi(data).then((res) => {
    cardDataArray.value = res.msg; //赋值到pinia
  });

  // 获取符合条件的所有数据总条数。
  let countData = {
    pageIndex: 0, //页面索引
    pageTotal: 0, //页面总条数
    file_name: userValue.value, //搜索关键字
    file_remark: remarkValue.value, //搜索文件备注
    file_type: +selectType.value, //文件类型
    file_user_id: JSON.parse(localStorage.getItem("userObj")).id,
    time_range: time_array,
  };
  pcsearchfileApi(countData).then((res) => {
    pageCount.value = res.msg.length; // //pinia 所有符合条件的条数
  });
}

// 监听 pageIndex 的变化
watch(pageIndex, (newValue, oldValue) => {
  // 数据不相等，表示切换了页码。
  if (newValue != oldValue) {
    getData(); //获取数据函数
  }
});

onMounted(() => {
  // 当组件挂载后，给 document 添加事件监听器
  document.addEventListener("keypress", handleKeyPress);

  getData(); //获取数据函数
});
onBeforeUnmount(() => {
  // 在组件卸载前，移除事件监听器
  document.removeEventListener("keypress", handleKeyPress);
});
</script>
<style scoped lang="scss">
.Search {
  width: 1360px;
  margin: 0 auto;
  padding: 10px;
  padding-left: 20px;
  box-sizing: border-box;
}
</style>
