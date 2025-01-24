<template>
  <div class="DataShow">
    <!-- 图片的列表展示 -->
    <div class="container">
      <template class="he" v-for="(cardData, index) in cardDataArray" :key="cardData.file_id">
        <!-- 0 图片 -->
        <div class="box" v-if="cardData.file_type == 0">
          <a-badge-ribbon :text="cardData.file_suffix" style="font-weight: 600; cursor: pointer">
            <div class="card" @click="showDrawer(index)">
              <img :src="cardData.file_link" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!-- 1 视频 -->
        <div class="box" v-else-if="cardData.file_type == 1">
          <a-badge-ribbon :text="cardData.file_suffix" color="pink" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <i class="iconfont icon-bofang"></i>
              <video :src="cardData.file_link"></video>
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!-- 2 音乐 -->
        <div class="box" v-else-if="cardData.file_type == 2">
          <a-badge-ribbon :text="cardData.file_suffix" color="cyan" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <img src="../assets/types/2.png" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!-- 3 压缩包 -->
        <div class="box" v-else-if="cardData.file_type == 3">
          <a-badge-ribbon :text="cardData.file_suffix" color="#52c41a" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <img src="../assets/types/3.png" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!-- 4 安装包 -->
        <div class="box" v-else-if="cardData.file_type == 4">
          <a-badge-ribbon :text="cardData.file_suffix" color="#722ed1" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <img src="../assets/types/4.png" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!-- 5-代码文本 -->
        <div class="box" v-else-if="cardData.file_type == 5">
          <a-badge-ribbon :text="cardData.file_suffix" color="#fa541c" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <img src="../assets/types/5.png" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!-- 6 记事本 -->
        <div class="box" v-else-if="cardData.file_type == 6">
          <a-badge-ribbon :text="cardData.file_suffix" color="#fc213f" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <img v-show="cardData.file_suffix == '.txt'" src="../assets/types/6.png" alt="" />
              <img v-show="cardData.file_suffix == '.md'" src="../assets/types/6-1.png" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!-- 7-office文件 -->
        <div class="box" v-else-if="cardData.file_type == 7">
          <a-badge-ribbon :text="cardData.file_suffix" color="#fe9843" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <img v-show="cardData.file_suffix == '.docx' || cardData.file_suffix == '.doc'" src="../assets/types/7-1.png" alt="" />
              <img v-show="cardData.file_suffix == '.xls' || cardData.file_suffix == '.xlsx'" src="../assets/types/7-2.png" alt="" />
              <img v-show="cardData.file_suffix == '.ppt' || cardData.file_suffix == '.pptx'" src="../assets/types/7-3.png" alt="" />
              <img v-show="cardData.file_suffix == '.pdf'" src="../assets/types/7-4.png" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
        <!--  8-其他文件 -->
        <div class="box" v-else-if="cardData.file_type == 8">
          <a-badge-ribbon :text="cardData.file_suffix" color="#b9c9d5" style="font-weight: 600">
            <div class="card" @click="showDrawer(index)">
              <img v-show="cardData.file_suffix == '.ttf'" src="../assets/types/8-1.png" alt="" />
              <img v-show="cardData.file_suffix != '.ttf'" src="../assets/types/8.png" alt="" />
              <span>
                <i>{{ detailName(cardData.file_name) }}</i>
              </span>
            </div>
          </a-badge-ribbon>
        </div>
      </template>
    </div>

    <!-- 分页标签-->
    <div class="paging">
      <a-pagination @change="changePage" :showQuickJumper="true" v-model:current="current" :total="pageCount" :locale="locale" :defaultPageSize="27" :pageSizeOptions="['27', '54', '81', '108']" />
    </div>
  </div>
</template>
<script setup>
import DrawerDataDisplay from "../components/DrawerDataDisplay.vue";
import { PlayCircleOutlined } from "@ant-design/icons-vue";
import { ref, computed, reactive, onMounted } from "vue";
import { useStore } from "../stores/index";
import { storeToRefs } from "pinia";
const store = useStore();
let { cardDataArray, pageCount, pageTotal, pageIndex, DrawerDataFlag, DrawerDataItem, DrawerDataIndex } = storeToRefs(store); //在Pinia结构的值 查询到的数据数组

import { pcsearchfileApi, minsertviewApi } from "../api/index";

import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
dayjs.locale("zh-cn");

const current = ref(1); //当前页码

// -------------------------------------------------------------

// 取消展示名字后面的时间戳后缀
function detailName(name) {
  // 定义一个时间戳的正则表达式
  const timestampRegex = /-\d{13}$/;
  // 使用 replace 方法去掉匹配到的时间戳
  return name.replace(timestampRegex, "...");
}

// 显示抽屉
function showDrawer(index) {
  DrawerDataFlag.value = true;
  DrawerDataItem.value = cardDataArray.value[index];
  DrawerDataIndex.value = index;

  // 增加浏览量接口
  minsertviewApi({ file_id: DrawerDataItem.value.file_id }).then((res) => {
    // console.log(res);
    DrawerDataItem.value.file_views += 1;
    // 卡片进行赋值
    cardDataArray.value[index] = DrawerDataItem.value;
  });
}

// 页码改变函数
function changePage(page, pageSize) {
  pageIndex.value = page; //pinia赋值页码
  pageTotal.value = pageSize; //pinia赋值页码
}

onMounted(() => {
  // 当组件挂载后，给 document 添加事件监听器
  // console.log(cardDataArray.value);
});
</script>
<style scoped lang="scss">
.DataShow {
  @keyframes scrollText {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  .container {
    width: 1360px;
    padding: 10px 20px 70px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .box {
      width: 120px;
      height: 170px;
      margin-right: 30px;
      margin-bottom: 30px;
      box-sizing: border-box;
      &:hover {
        .card {
          border: 2px solid #ff4d4f;
          box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.1), -3px -3px 15px rgba(255, 255, 255, 0.3);
          img {
            object-position: bottom center;
          }
          span {
            i {
              animation: scrollText 10s linear infinite;
            }
          }
        }
      }
      &:nth-child(9n) {
        margin-right: 0px;
      }
      .card {
        display: flex;
        width: 120px;
        height: 170px;
        position: relative;
        transition: all 0.3s;
        border: 2px solid #c0b7b760;
        background-color: #fff;
        border-radius: 5px;
        .iconfont {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-size: 36px;
          background-color: #00000030;
          text-align: center;
          line-height: 170px;
        }
        img {
          width: 100%;
          object-fit: cover;
          object-position: top center;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        video {
          width: 100%;
          object-fit: cover;
          object-position: top center;
          transition: all 0.3s;
        }

        span {
          position: absolute;
          width: 100%;
          height: 25px;
          background-color: rgba(0, 0, 0, 0.5);
          bottom: 0px;
          text-align: center;
          line-height: 25px;
          font-size: 10px;
          color: #fff;
          transition: all 0.3s;
          overflow: hidden;
          i {
            display: inline-block;
            white-space: nowrap;
            font-weight: 600;
            letter-spacing: 0.02em;
          }
        }
      }
    }
  }
  /* 分页 */
  .paging {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    width: 100%;
    height: 70px;
    bottom: 0px;

    background-color: #fff;
    box-shadow: 0 0 3px #ccc;
    :deep(.ant-pagination) {
      font-weight: 600;
      margin-right: 220px;
    }
  }
}
</style>
