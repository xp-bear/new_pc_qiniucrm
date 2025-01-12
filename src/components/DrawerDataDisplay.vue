<template>
  <div class="DrawerDataDisplay">
    <!-- 左侧内容展示 -->
    <div class="dar-left">
      <!-- 左边按钮 -->
      <div class="lft" @click="changeItem(-1)"><LeftOutlined style="color: #fff; font-size: 26px" /></div>

      <!-- 右边按钮 -->
      <div class="rft" @click="changeItem(1)"><RightOutlined style="color: #fff; font-size: 26px" /></div>

      <!-- 主体区域 -->
      <!-- 0 图片 -->
      <div v-if="DrawerDataItem.file_type == 0" class="box inner-slider" :style="imgShowDisplayFlag ? imgShowDisplay : ''">
        <img ref="imageRef" @load="onImageLoad" :src="DrawerDataItem.file_link" alt="该格式图片暂不支持显示" />
      </div>
      <!-- 1 视频 -->
      <div style="justify-content: center" v-else-if="DrawerDataItem.file_type == 1" class="box inner-slider" :style="!videoShowDisplayFlag ? '' : imgShowDisplay">
        <video :style="videoShowDisplayFlag ? 'width:100%' : 'display: block; height: 100%; margin: 0 auto;'" ref="videoRef" :src="DrawerDataItem.file_link" autoplay loop controls></video>
      </div>
      <!-- 2 音乐 -->
      <div v-else-if="DrawerDataItem.file_type == 2" class="box inner-slider">
        <!-- 音乐播放 -->
        <audio ref="audioRef" :src="DrawerDataItem.file_link" controls autoplay loop style="display: none"></audio>
        <!-- 内容区域 -->
        <div class="audio-box">
          <!-- 内容区域 -->
          <div class="audio-center">
            <!-- 唱片 -->
            <div class="song">
              <img src="../assets/img/music.png" alt="" />
            </div>

            <div class="head">
              <span>{{ DrawerDataItem.file_name.split("-")[0] }}</span>
              <div>
                <div style="display: flex; justify-content: space-between; height: 20px; font-size: 16px; color: #e26a8d">
                  <i>{{ currentTime }}</i>
                  <i>{{ duration }}</i>
                </div>
                <div class="progress" ref="progressDiv" @click="handleClick">
                  <div class="schedule" :style="'width:' + progress + '%;'"></div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <i class="iconfont icon-jiantouyou" @click="changeMusic"></i>
              <i class="iconfont" @click="togglePlayPause" :class="playing ? 'icon-bofang' : 'icon-zanting'"></i>
              <i class="iconfont icon-jiantouyou" @click="changeMusic"></i>
            </div>
          </div>
        </div>
      </div>
      <!-- 3 压缩包 -->
      <div v-else-if="DrawerDataItem.file_type == 3" class="box inner-slider">
        <div class="yasuo-box">
          <div class="yasuo-content" :style="'background-image: linear-gradient(' + rangeAngel + 'deg, #ceabff80, #e7c4ff80, #ffddff80, #fff6ff80, #b592f580, #9c79dc80, #8380c380)'">
            <div>
              <img src="../assets/types/3.png" alt="" />
              <span>压缩包内容，暂不支持预览</span>
            </div>
            <p class="grad-text">后面有时间与精力，会开放在线预览，敬请期待！</p>
          </div>
        </div>
      </div>
      <!-- 4 安装包 -->
      <div v-else-if="DrawerDataItem.file_type == 4" class="box inner-slider">
        <div class="yasuo-box">
          <div class="yasuo-content" :style="'background-image: linear-gradient(' + rangeAngel + 'deg, #ceabff80, #e7c4ff80, #ffddff80, #fff6ff80, #b592f580, #9c79dc80, #8380c380)'">
            <div>
              <img src="../assets/types/4.png" alt="" />
              <span>安装包内容，暂不支持预览</span>
            </div>
            <p class="grad-text">后面有时间与精力，会开放在线预览，敬请期待！</p>
          </div>
        </div>
      </div>
      <!-- 5-代码文本 -->
      <div v-else-if="DrawerDataItem.file_type == 5" class="box inner-slider">
        <div class="daima-box">
          <pre class="inner-slider inner-slider-h"><div ref="codeElement" class="daima-content inner-slider">{{ code }}</div></pre>
        </div>
      </div>
      <!-- 6 记事本 -->
      <div v-else-if="DrawerDataItem.file_type == 6" class="box inner-slider">
        <div class="daima-box">
          <pre><div ref="codeElement" class="daima-content">{{ code }}</div></pre>
        </div>
      </div>
      <!-- 7-office文件 -->
      <div v-else-if="DrawerDataItem.file_type == 7" class="box inner-slider">
        <div v-if="DrawerDataItem.file_suffix != '.pdf'" class="office-box">
          <iframe style="width: 100%; height: 100%" :src="'http://www.pfile.com.cn/api/profile/onlinePreview?url=' + DrawerDataItem.file_link" frameborder="0"></iframe>
        </div>
        <div v-else-if="DrawerDataItem.file_suffix == '.pdf'" class="office-box">
          <iframe :src="DrawerDataItem.file_link" style="width: 100%; height: 100%"></iframe>
        </div>
      </div>
      <!--  8-其他文件 -->
      <div v-else-if="DrawerDataItem.file_type == 8" class="box inner-slider">
        <div class="yasuo-box">
          <div class="yasuo-content" :style="'background-image: linear-gradient(' + rangeAngel + 'deg, #ceabff80, #e7c4ff80, #ffddff80, #fff6ff80, #b592f580, #9c79dc80, #8380c380)'">
            <div>
              <img src="../assets/types/8.png" alt="" />
              <span>其他文件内容，暂不支持预览</span>
            </div>
            <p class="grad-text">这个是兜底项目，如果有预览会及时同步滴！</p>
          </div>
        </div>
      </div>
    </div>
    <div class="dar-right" @contextmenu.prevent="handleRightClick">
      <!-- 上方是内容信息展示 -->
      <div class="content">
        <div class="item">
          <a-badge-ribbon :text="DrawerDataItem.file_suffix" color="pink" @click="copyText(DrawerDataItem.file_name + DrawerDataItem.file_suffix)">
            <a-card :title="'文件名称：' + DrawerDataItem.file_name + DrawerDataItem.file_suffix" size="small"></a-card>
          </a-badge-ribbon>
        </div>
        <div class="item" @click="copyText(imageSize.width + '×' + imageSize.height)">
          <a-badge-ribbon text="尺寸">
            <a-card :title="'文件尺寸：宽：' + imageSize.width + 'px ✖ 高：' + imageSize.height + 'px'" size="small"></a-card>
          </a-badge-ribbon>
        </div>
        <div class="item" @click="copyText(formatBytes(DrawerDataItem.file_size))">
          <a-badge-ribbon text="大小" color="#42cafc">
            <a-card :title="'文件大小：' + formatBytes(DrawerDataItem.file_size)" size="small"></a-card>
          </a-badge-ribbon>
        </div>
        <div class="item" @click="copyText(DrawerDataItem.file_user_name)">
          <a-badge-ribbon text="作者" color="#fa541c">
            <a-card :title="'上传作者：' + DrawerDataItem.file_user_name" size="small"></a-card>
          </a-badge-ribbon>
        </div>
        <div class="item" @click="copyText(dayjs(DrawerDataItem.file_createtime).format('YYYY年/MM月/DD日 HH点:mm分'))">
          <a-badge-ribbon text="时间" color="#f5222d">
            <a-card :title="'上传时间：' + dayjs(DrawerDataItem.file_createtime).format('YYYY年/MM月/DD日 HH点:mm分')" size="small"></a-card>
          </a-badge-ribbon>
        </div>
        <div class="item" @click="copyText(DrawerDataItem.file_address)">
          <a-badge-ribbon text="位置" color="#13c2c2">
            <a-card :title="'地理位置：' + DrawerDataItem.file_address" size="small"></a-card>
          </a-badge-ribbon>
        </div>
        <div class="item" @click="copyText(DrawerDataItem.file_link)">
          <a-badge-ribbon text="链接" color="#52c41a">
            <a-card :title="'文件链接：' + DrawerDataItem.file_link" size="small"></a-card>
          </a-badge-ribbon>
        </div>
        <div class="item" @click="copyText(DrawerDataItem.file_remark)">
          <a-badge-ribbon text="备注" color="#722ed1">
            <a-card size="small" title="文件备注信息" style="white-space: pre-wrap">{{ DrawerDataItem.file_remark || "暂无备注信息" }}</a-card>
          </a-badge-ribbon>
        </div>
        <div class="item">
          <a-badge-ribbon text="收藏与点赞" color="#eb2f96">
            <a-card size="small" title="收藏、浏览基本信息">
              <div class="ani">
                <div class="ani-item">
                  <span>浏览量：</span><i class="iconfont icon-in_zhengyan_fill"></i><span>{{ DrawerDataItem.file_views }}</span>
                </div>
                <div class="ani-item" @click="tolike()">
                  <span>收藏量：</span><i :style="likeStyle" class="iconfont icon-mn_shoucang_fill"></i><span :style="likeStyle">{{ DrawerDataItem.file_likes }}</span>
                </div>
                <div class="ani-item"><span>分享量：</span><i class="iconfont icon-arrow-"></i><span>56</span></div>
              </div>
            </a-card>
          </a-badge-ribbon>
        </div>
        <div class="item">
          <a-badge-ribbon text="文件共享" color="#375064">
            <a-card size="small" title="是否共享该资源">
              <a-switch v-model:checked="filePublic" @change="changePublicFlag" :disabled="userObj.id != DrawerDataItem.file_user_id ? true : false" />
            </a-card>
          </a-badge-ribbon>
        </div>
        <div class="item">
          <a-badge-ribbon text="操作功能选项" color="#f11566">
            <a-card size="small" title="下载与删除信息">
              <div class="options">
                <a-button type="primary" style="width: 48%" @click="downloadFile">下载资源</a-button>
                <a-popconfirm v-if="userObj.id == DrawerDataItem.file_user_id ? true : false" title="是否要删除该资源?" ok-text="确认" cancel-text="取消" @confirm="confirm" @cancel="cancel">
                  <a-button type="primary" danger style="width: 48%">删除文件</a-button>
                </a-popconfirm>
              </div>
              <a-progress :percent="downloadPercent" status="active" size="small" />
            </a-card>
          </a-badge-ribbon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as OSS from "../utils/tool"; // 引入oss.js
import axios from "axios";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import { formatBytes } from "../utils/tool";
import { deleteQiNiuFileApi, deletefileApi, isPublicChangeApi, minsertviewApi, minsertlikeApi, minsertlikefileApi, msearchlikefileApi } from "../api/index";

import { useStore } from "../stores/index";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
const store = useStore();

import { useRouter } from "vue-router";
const router = useRouter();

import { ref, onMounted, reactive, computed, watch, onBeforeUnmount } from "vue";
import { RightOutlined, LeftOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const imageRef = ref(null); //图片的ref
const videoRef = ref(null); // 定义一个 ref 用于保存 video 元素
const audioRef = ref(null); // 定义一个 ref 用于保存 audio 元素
const playing = ref(false); // 播放状态
const progress = ref(0); // 进度百分比
const currentTime = ref("00:00"); // 当前时间
const duration = ref("00:00"); // 总时长

const progressDiv = ref(null); //进度条div
const lastClickPosition = ref({ x: null, y: null }); //点击的坐标

const rangeAngel = ref(0); // 1-360的角度

const code = ref(""); //代码
const codeElement = ref(null); //代码ref

const imageSize = reactive({
  width: "",
  height: "",
}); //图片的宽度尺寸

const imgShowDisplayFlag = ref(false); //是否让图片宽高正常显示
const videoShowDisplayFlag = ref(false); //是否让视频宽高正常显示

// img 根据宽高 让图片居中显示
const imgShowDisplay = computed(() => ({
  display: "flex",
  alignItems: "center",
}));

// video 根据宽高 让视频居中显示
const videoShowDisplay = computed(() => ({
  width: "100%",
}));

const filePublic = ref(false); //是否共享该资源

const downloadPercent = ref(0); // 下载文件的进度条

let { DrawerDataFlag, DrawerDataItem, DrawerDataIndex, cardDataArray } = storeToRefs(store); //在Pinia结构的值 查询到的数据数组

const userObj = JSON.parse(localStorage.getItem("userObj")); //本地保存的用户信息

const likeColor = ref(false); //点击红心的状态
// 收藏红心样式
const likeStyle = computed(() => ({
  color: likeColor.value ? "red" : "#1f1f1f",
  "margin-right": "4px",
}));

// ---------------------------------------------------
// 右键点击抽屉
const handleRightClick = (event) => {
  event.preventDefault(); // 阻止默认的上下文菜单弹出
  //修改抽屉状态为隐藏
  DrawerDataFlag.value = false;
};

// 收藏文件函数
// 点赞+1   // 当前打开的共享文件
function tolike() {
  if (userObj.id == DrawerDataItem.value.file_user_id) {
    return message.warning("不可对自己文件收藏", 1);
  }
  // 判断用户有没有对该文件收藏
  msearchlikefileApi({ favorite_user_id: userObj.id, favorite_file_id: DrawerDataItem.value.file_id }).then((rs) => {
    if (rs.msg.length == 0) {
      // 没有收藏过  先修改对应的file表的likes记录
      minsertlikeApi({ file_id: DrawerDataItem.value.file_id }).then((res) => {
        DrawerDataItem.value.file_likes += 1;
        likeColor.value = true; // 切换收藏红心状态
        message.success("收藏成功", 1);
      });

      // 在favorite表格添加一条收藏记录
      minsertlikefileApi({ favorite_user_id: userObj.id, favorite_file_id: DrawerDataItem.value.file_id, favorite_createtime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss") });
    }
  });
}

// 改变文件共享状态。
function changePublicFlag(checked) {
  // 修改文件隐私状态函数
  isPublicChangeApi({
    is_public: checked ? 1 : 0,
    file_id: DrawerDataItem.value.file_id,
  }).then((res) => {
    message.info("文件隐私状态改变成功", 2);
    // 改变当前卡片数组对应的索引文件状态。
    cardDataArray.value[DrawerDataIndex.value].file_public = checked ? 1 : 0;
  });
}

// 下载资源
function downloadFile() {
  // 根据下载文件进度条,做判断
  if (downloadPercent.value > 0 && downloadPercent.value < 100) {
    return message.info("该文件已经在下载中", 2);
  } else if (downloadPercent.value == 100) {
    return message.success("文件已经下载完成", 2);
  }
  //下载文件进度条
  downloadFileProcess(DrawerDataItem.value.file_link, DrawerDataItem.value.file_name + DrawerDataItem.value.file_suffix);
  console.log(DrawerDataItem.value.file_name);
}

// 下载文件三部曲
const downloadFileProcess = async function (fileUrl, fileName) {
  let blob = await getBlob(fileUrl);
  saveFile(blob, fileName);
};
function getBlob(fileUrl) {
  let that = this;
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", fileUrl, true);
    //监听进度事件
    xhr.addEventListener(
      "progress",
      function (evt) {
        if (evt.lengthComputable) {
          let percentComplete = evt.loaded / evt.total;
          // percentage是当前下载进度，可根据自己的需求自行处理
          let percentage = percentComplete * 100;
          // console.log(percentage);
          downloadPercent.value = parseFloat(percentage.toFixed(2));
        }
      },
      false
    );
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}
function saveFile(blob, fileName) {
  // ie的下载
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    // 非ie的下载
    const link = document.createElement("a");
    link.classList.add("download_link");
    const body = document.querySelector("body");

    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // fix Firefox
    link.style.display = "none";
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
}

// 确认删除资源
const confirm = (e) => {
  // 阿里云删除文件
  OSS.client()
    .delete(DrawerDataItem.value.file_region + "/" + DrawerDataItem.value.file_name + DrawerDataItem.value.file_suffix)
    .then((res) => {
      if (res.res.status == 204) {
        deletefileApi({ file_id: DrawerDataItem.value.file_id }).then((result) => {
          cardDataArray.value = cardDataArray.value.filter((item) => item.file_id !== DrawerDataItem.value.file_id);
          DrawerDataFlag.value = false;
          message.success("删除成功!", 2);
        });
      } else {
        message.error("删除失败!", 2);
      }
    });

  // 七牛云文件删除
  // let data = {
  //   file_name: DrawerDataItem.value.file_name + DrawerDataItem.value.file_suffix,
  //   space: DrawerDataItem.value.file_region,
  // };

  // deleteQiNiuFileApi(data).then((res) => {
  //   if (res.code == 200) {
  //     deletefileApi({ file_id: DrawerDataItem.value.file_id }).then((result) => {
  //       cardDataArray.value = cardDataArray.value.filter((item) => item.file_id !== DrawerDataItem.value.file_id);
  //       DrawerDataFlag.value = false;
  //       message.success("删除成功!", 2);
  //     });
  //   } else {
  //     message.error("删除失败!", 2);
  //   }
  // });
};
// 取消删除资源
const cancel = (e) => {
  console.log("已经取消");
};

// 左右按钮 切换数据
function changeItem(index) {
  if (DrawerDataIndex.value + index < 0) {
    return message.warning("当前是第一个元素", 1);
  }
  if (DrawerDataIndex.value + index == cardDataArray.value.length) {
    return message.warning("当前是最后一个元素", 1);
  }
  // 切换元素
  DrawerDataIndex.value = DrawerDataIndex.value + index; //索引加1
  DrawerDataItem.value = cardDataArray.value[DrawerDataIndex.value];

  // 判断用户有没有对该文件收藏,渲染红心状态
  msearchlikefileApi({ favorite_user_id: userObj.id, favorite_file_id: DrawerDataItem.value.file_id }).then((rs) => {
    // 有收藏过
    if (rs.msg.length != 0) {
      likeColor.value = true; //收藏过就是红心
    } else {
      likeColor.value = false;
    }
  });

  //确保加载的是视频 成功渲染尺寸
  setTimeout(() => {
    if (videoRef.value) {
      getVideoDimensions();
    }
  }, 500);
}

// 代码高亮显示函数
const fetchAndHighlight = (value) => {
  try {
    axios
      .get(value, {
        responseType: "text",
        headers: {
          Accept: "text/plain; charset=utf-8", // 设置接受的字符集
        },
      })
      .then((res) => {
        code.value = res.data; // 初始化
        if (codeElement.value) {
          Prism.highlightAll();
          Prism.highlightElement(codeElement.value); //高亮代码
        }
      });
  } catch (error) {
    console.error("Error fetching the file:", error);
  }
};

// 生成随机数
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  rangeAngel.value = Math.floor(Math.random() * (max - min + 1)) + min;
}

// 点击复制文本
const copyText = async (value) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      message.success("复制成功", 1);
    } else {
      // 创建text area
      const textArea = document.createElement("textarea");
      textArea.value = value;
      // 使text area不在viewport，同时设置不可见
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve, reject) => {
        // 执行复制命令并移除文本框
        document.execCommand("copy") ? resolve() : reject(new Error("出错了"));
        textArea.remove();
      }).then(() => {
        message.success("复制成功", 1);
      });
    }
  } catch (err) {
    message.error("复制失败", 1);
    console.error("Failed to copy text: ", err);
  }
};

// changeMusic 切换歌曲
function changeMusic() {
  message.info("当前暂不支持切换歌曲", 3);
}

// 获取鼠标点击 距离div 的 距离
function handleClick(event) {
  if (progressDiv.value) {
    const rect = progressDiv.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    lastClickPosition.value = { x, y };
  }
  progress.value = Math.round((lastClickPosition.value.x / 280) * 100);
  const newTime = (progress.value / 100) * audioRef.value.duration;
  audioRef.value.currentTime = newTime;
}

// 更新进度条和时间
const updateProgress = (e) => {
  const percent = Math.round((e.target.currentTime / e.target.duration) * 100);
  progress.value = percent;
  currentTime.value = formatTime(e.target.currentTime);
  duration.value = formatTime(e.target.duration);
};

// 时间格式化
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
};

// 切换播放/暂停
const togglePlayPause = () => {
  playing.value = !playing.value;
  if (playing.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
  }
};

// 获取视频尺寸函数
function getVideoDimensions() {
  if (videoRef.value) {
    const { videoWidth, videoHeight } = videoRef.value;

    imageSize.width = videoWidth;
    imageSize.height = videoHeight;
    if (imageSize.width > imageSize.height) {
      videoShowDisplayFlag.value = true;
    } else {
      videoShowDisplayFlag.value = false;
    }
  }
}

// 获取图片尺寸大小函数
const onImageLoad = () => {
  const imgElement = imageRef.value;
  imageSize.width = imgElement.naturalWidth; // 自然宽度
  imageSize.height = imgElement.naturalHeight; // 自然高度
  //根据图片宽高做判断
  if (imageSize.width > imageSize.height) {
    imgShowDisplayFlag.value = true;
  } else {
    imgShowDisplayFlag.value = false;
  }
};

watch(DrawerDataIndex, (newValue, oldValue) => {
  // 数据不相等，表示切换左右按钮的数据
  if (newValue != oldValue) {
    formatData(); //数据格式处理函数

    setTimeout(() => {
      formatData(); //数据格式处理函数
    }, 500);
  }
});
// 初始化函数
onMounted(() => {
  formatData(); //数据格式处理函数

  // 当组件挂载后，给 document 添加事件监听器
  document.addEventListener("keydown", handlekeydown);

  // 判断用户有没有对该文件收藏,渲染红心状态
  msearchlikefileApi({ favorite_user_id: userObj.id, favorite_file_id: DrawerDataItem.value.file_id }).then((rs) => {
    // 有收藏过
    if (rs.msg.length != 0) {
      likeColor.value = true; //收藏过就是红心
    }
  });
});
//组件销毁的时候
onBeforeUnmount(() => {
  // 在组件卸载前，移除事件监听器
  document.removeEventListener("keydown", handlekeydown);

  likeColor.value = false; //消除红心状态
});

// 监听上传组件的回车事件
function handlekeydown(event) {
  if (event.key === "ArrowLeft") {
    changeItem(-1); //左切换
  }
  if (event.key === "ArrowRight") {
    changeItem(1); //右切换
  }

  // 监听空格按键
  if (event.key == " ") {
    if (DrawerDataItem.value.file_type == 2) {
      togglePlayPause(); //音乐播放与暂停。
    }
  }
}
// 获取数据格式处理函数
function formatData() {
  // 判断文件是否共享
  if (DrawerDataItem.value.file_public == 1) {
    filePublic.value = true;
  } else {
    filePublic.value = false;
  }

  // 确保图片已经加载完成  // 获取图片的宽高/或者视频宽高
  if (imageRef.value) {
    if (imageRef.value.complete) {
      onImageLoad();
    }
  }

  //确保加载的是视频
  if (videoRef.value) {
    videoRef.value.addEventListener("loadedmetadata", getVideoDimensions);
  }

  if (audioRef.value) {
    // 音乐挂载加载
    audioRef.value.addEventListener("timeupdate", updateProgress);
    audioRef.value.addEventListener("loadedmetadata", updateProgress);
    imageSize.width = 500;
    imageSize.height = 150;
  }
  if (DrawerDataItem.value.file_type == 3 || DrawerDataItem.value.file_type == 4 || DrawerDataItem.value.file_type == 8) {
    // 随机角度
    getRandomInt(1, 360);
    imageSize.width = 500;
    imageSize.height = 500;
  }
  if (DrawerDataItem.value.file_type == 5 || DrawerDataItem.value.file_type == 6) {
    // 代码渲染
    fetchAndHighlight(DrawerDataItem.value.file_link);
    imageSize.width = 960;
    imageSize.height = 1080;
  }

  // office 文件
  if (DrawerDataItem.value.file_type == 7) {
    imageSize.width = 970;
    imageSize.height = 810;
  }
}
// ************************************************************************************
</script>
<style scoped lang="scss">
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.DrawerDataDisplay {
  display: flex;
  background: rgba($color: #e5e5e5, $alpha: 0.5);

  .dar-left {
    flex: 1;
    position: relative;
    .lft {
      width: 56px;
      height: 56px;
      background: #94949480;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-sizing: border-box;
    }
    .rft {
      width: 56px;
      height: 56px;
      background: #94949470;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-sizing: border-box;
    }
    .lft,
    .rft {
      z-index: 2;
      &:hover {
        transition: all 0.3s;
        background: #949494;
      }
    }
    .box {
      width: 100%;
      height: 100vh;
      padding: 0 20px;
      overflow-y: auto;
      /* background-color: #f5f2f0; */
      box-sizing: border-box;
      .office-box {
        display: flex;
        justify-content: center;
        max-width: 958px;
        height: 100vh;
        margin: 0 auto;
      }
      /* .office-box {
        width: 970px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      } */
      .daima-box {
        display: flex;
        justify-content: center;
        max-width: 958px;
        height: 100vh;
        margin: 0 auto;
        overflow-x: auto;
      }
      /* .daima-box {
         width: 958px; 
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        box-sizing: border-box;
        pre {
          width: 100%;
          height: 100%;
          overflow: auto;
          overflow: auto;
          padding-top: 20px 0;
          box-sizing: border-box;
        }
      } */
      .yasuo-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .yasuo-content {
          width: 500px;
          height: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          border-radius: 20px;

          /* 设置背景渐变 */
          /* 设置背景大小，使其比容器稍大一点以便于动画效果 */
          background-size: 200% 100%;
          /* 开始动画 */
          animation: gradientAnimation 6s ease infinite;
          box-shadow: 0 0 20px #00000060;
          img {
            display: block;
            width: 200px;
            margin: 0 auto;
            margin-bottom: 20px;
          }
          span {
            font-size: 28px;
            font-family: "consolas";
          }
          p {
            font-family: "xp";
            font-size: 18px;
          }
        }
      }
      .audio-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .audio-center {
          width: 500px;
          height: 150px;
          position: relative;
          .song {
            width: 120px;
            height: 120px;
            position: absolute;
            top: 15px;
            left: 45px;
          }
          .head {
            width: 90%;
            height: 75px;
            margin: 0 auto;
            background-color: #fef7f5;
            box-shadow: 0 -1px 10px #00000060;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            padding-left: 150px;
            padding-right: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            span {
              text-align: left;
              margin-bottom: 5px;
              font-size: 18px;
              font-weight: 600;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .progress {
              width: 100%;
              height: 5px;
              background-color: #ccc;
              border-radius: 10px;
              cursor: pointer;
              .schedule {
                border-radius: 10px;
                height: 100%;
                background-color: #e26a8d;
              }
            }
          }
          .bottom {
            width: 100%;
            height: 75px;
            background-color: #ffffff;
            box-shadow: 0 3px 20px #00000060;
            border-radius: 10px;
            padding-left: 150px;
            padding-right: 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            i {
              color: #666666;
              font-size: 30px;
              &:nth-child(1) {
                transform: rotate(180deg);
              }
              &:nth-child(2) {
                font-size: 34px;
                font-weight: 600;
              }
            }
          }
        }
      }
      img {
        width: 100%;
      }
      video {
      }
    }
  }
  .dar-right {
    width: 700px;
    height: 100vh;
    z-index: 2;
    display: flex;
    align-items: center;
    /* box-shadow: 0 3px 10px #00000050 ; */
    overflow-y: auto;
    .content {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      .item {
        width: 66%;
        margin-bottom: 10px;
        cursor: pointer;
        .ani {
          display: flex;
          justify-content: space-evenly;
          .ani-item {
            height: 30px;
            font-size: 16px;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s;
            i {
              margin-right: 3px;
            }
            &:hover {
              /* color: #00aeec; */
            }
          }
        }
        .options {
          display: flex;
          justify-content: space-between;
          flex-direction: row-reverse;
        }
      }
    }
  }
}
</style>
