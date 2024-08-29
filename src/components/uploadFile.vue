<template>
  <div class="uploadFile" @paste="pasting" ref="drag">
    <!-- 内容区域 -->
    <div class="up" v-show="!checkIfObject(fileOrigin)">
      <i class="iconfont icon-shangchuan"></i>
      <span class="up-title">拖拽到此处也可上传( 支持 ctrl + v )</span>
      <div class="up-select" @click="showFilePicker">上传文件</div>
      <div class="up-correct">
        <p>当前审核队列</p>
        <span>快速</span>
      </div>
      <!-- 隐藏的 input type="file" 元素 -->
      <input ref="fileInput" type="file" @change="onFileSelected" style="display: none" />
    </div>
    <!-- 选择文件的回显区域 -->
    <div class="up-show" v-show="checkIfObject(fileOrigin)">
      <div class="edit" @click="showFilePicker"><i class="iconfont icon-xiugai"></i></div>
      <!-- 根据文件类型,显示对象的图片对象 -->
      <!-- 0-图片  1-视频  2-音乐 3-压缩包 4-安装包 5-代码文本 6-记事本 7-office文件 8-其他文件 -->
      <img v-if="uploadFileType == 0" :src="previewUrl" alt="该图片格式,暂不支持显示" />
      <video v-else-if="uploadFileType == 1" :src="previewUrl" muted autoplay loop></video>
      <img v-else-if="uploadFileType == 2" src="../assets/imgs/2.gif" alt="该图片格式,暂不支持显示" />
      <img v-else-if="uploadFileType == 3" src="../assets/imgs/3.gif" alt="该图片格式,暂不支持显示" />
      <img v-else-if="uploadFileType == 4" src="../assets/imgs/4.gif" alt="该图片格式,暂不支持显示" />
      <img v-else-if="uploadFileType == 5" src="../assets/imgs/5.gif" alt="该图片格式,暂不支持显示" />
      <img v-else-if="uploadFileType == 6" src="../assets/imgs/6.gif" alt="该图片格式,暂不支持显示" />
      <img v-else-if="uploadFileType == 7" src="../assets/imgs/7.gif" alt="该图片格式,暂不支持显示" />
      <img v-else-if="uploadFileType == 8" src="../assets/imgs/8.gif" alt="该图片格式,暂不支持显示" style="transform: translateY(20%)" />
    </div>
    <!-- 进度条区域 -->
    <div class="progress">
      <a-progress stroke-linecap="square" size="small" :percent="+processValue" />
    </div>
    <!-- 下方显示区域 -->
    <div class="showinfo">
      <a-card>
        <p style="font-size: 18px; color: rgba(0, 0, 0, 0.85); margin-bottom: 16px; font-weight: 500; display: flex; align-items: center; letter-spacing: 0.02em">
          <span style="margin-right: 10px">基本设置</span>
          <a-tag color="#2db7f5" v-show="checkIfObject(fileOrigin)">大小：{{ formatBytes(fileOrigin?.size) }}</a-tag>
          <a-tag color="#87d068" v-show="checkIfObject(fileOrigin)">类型：{{ fileOrigin?.type || "未知" }}</a-tag>
        </p>
        <a-divider />
        <div class="setting-item">
          <span><i style="color: red">*</i>文件名称</span>
          <a-input ref="inputNameFile" v-model:value="selectFileName" placeholder="文件名称..." class="file_name" />
          <a-select v-model:value="selectTimeNow" style="width: 120px" @change="handleChange">
            <a-select-option value="true">添加时间戳</a-select-option>
            <a-select-option value="false">取消时间戳</a-select-option>
          </a-select>
          <a-input v-model:value="selectFileSuffix" placeholder="后缀名" style="width: 60px" />
        </div>
        <div class="setting-item">
          <span><i style="color: red">*</i>存储区域</span>
          <a-select v-model:value="storeArea" style="width: 150px">
            <a-select-option value="cookies">cookies</a-select-option>
            <a-select-option value="common">common</a-select-option>
          </a-select>
        </div>
        <div class="setting-item">
          <span><i style="color: #fff">*</i>备注信息</span>
          <a-textarea @blur="areaBlur" @focus="areaFocus" v-model:value="fileRemark" placeholder="文件备注信息..." :auto-size="{ minRows: 2, maxRows: 5 }" />
        </div>
        <div class="btn">
          <a-button type="primary" class="gradient-animation" size="large" style="width: 50%; margin-right: 20px" @click="pcToSendFile">确认上传</a-button>
          <a-button type="primary" size="large" style="width: 30%; background: linear-gradient(45deg, rgb(58, 123, 213), rgb(0, 161, 214))" @click="resetFile">重置上传状态</a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script setup>
import * as OSS from "../utils/tool"; // 引入oss.js
import * as qiniu from "qiniu-js";
import { VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import { formatBytes } from "../utils/tool";
import { ref, onUnmounted, onMounted, onBeforeUnmount } from "vue";
import { getQiNiuTokenApi, pcInsertfileApi } from "../api/index";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import CONFIG from "../config/index";

import { notification } from "ant-design-vue";

const selectTimeNow = ref("true"); //是否添加时间戳
const selectFileName = ref(""); //文件名称显示 123
const selectFileSuffix = ref(""); //文件后缀名 .jpg
const storeArea = ref("cookies"); //文件存储区域 默认为 cookies
const fileRemark = ref(""); //文件备注信息的填写
const fileAddress = ref(""); //上传文件时候的地理位置信息

const fileInput = ref(null); // 创建一个引用（ref）来指向 input 元素

const fileOrigin = ref(""); // 选择的文件对象
const previewUrl = ref(null); // 用于存储文件的临时 URL
const uploadLink = ref(null); //上传到七牛云的永久链接url
const processValue = ref(0); //上传到七牛云的进度条

let uploadFileType = ref(""); //上传的文件类型 0 图片 1 视频 ...

const btnSendFlag = ref(false); //上传按钮是否可以上传文件
const drag = ref(null); //是否可以拖动文件

const areaFlag = ref(true); //失去焦点的函数 文本域 是否取用回车

const userObj = JSON.parse(localStorage.getItem("userObj")); //本地保存的用户信息

const inputNameFile = ref(null); //文件名输入框 聚焦

// **********************************************************
// 聚焦事件 文本域
function areaFocus() {
  areaFlag.value = false;
  // console.log("焦点:", areaFlag.value);
}

// 失去焦点的函数 文本域
function areaBlur() {
  areaFlag.value = true;
  // console.log("失去焦点:", areaFlag.value);
}

// 页面渲染加载函数
onMounted(() => {
  getCurrentCity(); //获取地理位置信息

  // 绑定拖拽事件
  drag.value.addEventListener("drop", handleDrop);
  drag.value.addEventListener("dragleave", (e) => {
    e.preventDefault();
  });
  drag.value.addEventListener("dragenter", (e) => {
    e.preventDefault();
  });
  drag.value.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  // 当组件挂载后，给 document 添加事件监听器
  document.addEventListener("keypress", handleKeyPress);
});

//组件销毁的时候
onBeforeUnmount(() => {
  // 在组件卸载前，移除事件监听器
  document.removeEventListener("keypress", handleKeyPress);
});

// 监听上传组件的回车事件
function handleKeyPress(event) {
  if (event.key === "Enter") {
    // 判断备注框有没有值
    if (areaFlag.value == true) {
      pcToSendFile(); //执行确认上传文件函数
    }
  }
}

//粘贴板上传图片 在监听事件里，判断是文本就粘贴文本，是图片就走上传方法
function pasting(event) {
  // 根据进度条判断是否应该上传文件。
  if (processValue.value > 0 && processValue.value < 100) {
    return message.warning("已有文件在上传，请等待上传完毕", 3);
  }

  let file = null; //要上传的文件
  // 获取粘贴的数据
  const clipboardData = event.clipboardData || window.clipboardData;
  if (!clipboardData) return;

  // 检查是否有图片数据
  if (clipboardData.items) {
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.indexOf("image") !== -1 || item.type.indexOf("video") !== -1 || item.type.indexOf("zip") !== -1) {
        const file = item.getAsFile();
        fileOrigin.value = file;
        // 用户有选择文件的时候
        if (checkIfObject(fileOrigin.value)) {
          //进行文件的赋值
          selectFileName.value = fileNameDetail(fileOrigin.value.name)[0]; //名字
          selectFileSuffix.value = "." + fileNameDetail(fileOrigin.value.name)[1]; //后缀

          // 根据后缀名获取文件类型
          isSFXtoTYPE(selectFileSuffix.value);

          previewUrl.value = URL.createObjectURL(file) || ""; // 创建一个临时 URL

          // 文件名输入框聚焦
          inputNameFile.value.focus();
        } else {
          // 清空文件对象
          selectFileName.value = "";
          selectFileSuffix.value = "";
          fileRemark.value = "";
        }
      } else {
        return message.warning("剪切板仅支持图片、视频、压缩包", 3);
      }
    }
  }
}

// 拖拽事件处理函数
function handleDrop(e) {
  e.preventDefault();
  // 根据进度条判断是否应该上传文件。
  if (processValue.value > 0 && processValue.value < 100) {
    return message.warning("已有文件在上传，请等待上传完毕", 3);
  }

  fileOrigin.value = e.dataTransfer.files[0];
  // 用户有选择文件的时候
  if (checkIfObject(fileOrigin.value)) {
    //进行文件的赋值
    selectFileName.value = fileNameDetail(fileOrigin.value.name)[0]; //名字
    selectFileSuffix.value = "." + fileNameDetail(fileOrigin.value.name)[1]; //后缀

    // 根据后缀名获取文件类型
    isSFXtoTYPE(selectFileSuffix.value);

    previewUrl.value = URL.createObjectURL(e.dataTransfer.files[0]) || ""; // 创建一个临时 URL

    // 文件名输入框聚焦
    inputNameFile.value.focus();
  } else {
    // 清空文件对象
    selectFileName.value = "";
    selectFileSuffix.value = "";
    fileRemark.value = "";
  }
}

// 利用百度地图API,获取用户定位
function getCurrentCity() {
  //根据用户IP 返回城市级别的定位结果
  let native = new BMap.LocalCity();
  native.get((res) => {
    // console.log(res);
    let gc = new BMap.Geocoder();
    let pointAdd = new BMap.Point(res.center.lng, res.center.lat);
    gc.getLocation(pointAdd, (rs) => {
      // console.log(rs);
      // 百度地图解析城市名
      fileAddress.value = rs.addressComponents.province + "、" + rs.addressComponents.city + "、" + rs.addressComponents.district;
      // console.log(fileAddress.value);
    });
  });
}

// 重置上传状态
function resetFile() {
  fileOrigin.value = "";
  previewUrl.value = "";
  uploadLink.value = "";
  processValue.value = 0;
  btnSendFlag.value = false;

  fileRemark.value = "";
  selectFileName.value = "";
  selectFileSuffix.value = "";
  storeArea.value = "cookies";
  selectTimeNow.value = "true";
}

// 确认上传文件
function pcToSendFile() {
  // 非空校验判断
  if (!checkIfObject(fileOrigin.value)) {
    return message.error("请先选择需要上传的文件", 3);
  }

  // 开始上传之前,一定要防止用户重复上传相同文件
  if (btnSendFlag.value == true) {
    return message.info("该文件正在上传中，请勿重复点击", 3);
  }

  let file_name = selectFileName.value + selectFileSuffix.value; //文件名 123.jpg

  // 上传到阿里OSS
  OSS.client()
    .multipartUpload(storeArea.value + "/" + file_name, fileOrigin.value, {
      progress: function (p) {
        btnSendFlag.value = true;
        processValue.value = (+p * 100).toFixed(0);
      },
    })
    .then((res) => {
      let base_url = "https://xp-cdn-oss.oss-cn-wuhan-lr.aliyuncs.com/" + res.name;
      // console.log("上传资源链接:", base_url);
      uploadLink.value = base_url + "?" + Date.now();

      // 在数据库插入一条数据
      let datas = {
        file_createtime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), //new Date(),
        file_type: uploadFileType.value, //上传文件类型
        file_name: selectFileName.value, //文件名称  123
        file_suffix: selectFileSuffix.value, // 文件后缀名 .jpg
        file_link: uploadLink.value, //文件链接
        file_size: "" + fileOrigin.value.size, //文件大小
        file_region: storeArea.value, //文件存储区域 cookies
        file_user_id: userObj.id, //文件用户id
        file_user_name: userObj.username, //文件用户名,
        file_likes: 1, //点赞用户
        file_views: 1, //浏览量
        file_remark: fileRemark.value,
        file_address: fileAddress.value,
        file_public: 0, //文件是否公开
      };
      pcInsertfileApi(datas).then((res) => {
        setTimeout(() => {
          // 重置上传状态
          resetFile();
        }, 3000);
        // 反馈气泡提醒框
        notification.success({
          message: `熊仔网盘提示您`,
          description: "您提交的资源已经上传成功，快去 全部文件 中查看一下吧！",
          placement: "topRight",
          duration: 3,
        });
      });
    });

  /**
  // 上传文件到七牛云
  getQiNiuTokenApi({ space: storeArea.value, name: file_name }).then((res) => {
    let qiniu_token = res.uploadToken; //上传的token

    // 这里要进行文件的上传操作,加上一些配置选项
    const putExtra = {
      mimeType: null,
    };
    const config = {
      useCdnDomain: true,
      region: qiniu.region.z2,
    };
    let observable = qiniu.upload(fileOrigin.value, file_name, qiniu_token, putExtra, config);
    let observer = {
      next(res) {
        btnSendFlag.value = true;
        processValue.value = res.total.percent.toFixed(0);
      },
      error(err) {
        console.log(err);
      },
      complete(res) {
        let key = encodeURIComponent(res.key);

        let base_url;
        if (storeArea.value == "mkdown-picture") {
          base_url = "http://mk.xxoutman.cn/";
        } else if (storeArea.value == "cookies") {
          base_url = "http://cdn.xxoutman.cn/";
        }

        uploadLink.value = base_url + key + "?" + Date.now();
        // console.log("上传成功: ", uploadLink.value);

        // 在数据库插入一条数据
        let datas = {
          file_createtime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"), //new Date(),
          file_type: uploadFileType.value, //上传文件类型
          file_name: selectFileName.value, //文件名称  123
          file_suffix: selectFileSuffix.value, // 文件后缀名 .jpg
          file_link: uploadLink.value, //文件链接
          file_size: "" + fileOrigin.value.size, //文件大小
          file_region: storeArea.value, //文件存储区域 cookies
          file_user_id: userObj.id, //文件用户id
          file_user_name: userObj.username, //文件用户名,
          file_likes: 1, //点赞用户
          file_views: 1, //浏览量
          file_remark: fileRemark.value,
          file_address: fileAddress.value,
          file_public: 0, //文件是否公开
        };
        pcInsertfileApi(datas).then((res) => {
          setTimeout(() => {
            // 重置上传状态
            resetFile();
          }, 3000);
          // 反馈气泡提醒框
          notification.success({
            message: `熊仔网盘提示您`,
            description: "您提交的资源已经上传成功，快去 全部文件 中查看一下吧！",
            placement: "topRight",
            duration: 3,
          });
        });
      },
    };

    observable.subscribe(observer); // 上传over
  });
*/
}

// 你也可以使用一个方法来进行判断,是不是一个对象
function checkIfObject(value) {
  return value instanceof Object;
}

// 当点击 div 时触发的方法
function showFilePicker() {
  // 先清空进度条状态
  processValue.value = 0;
  btnSendFlag.value = false;
  // 触发文件输入框的点击事件
  fileInput.value.click();
}

// 根据文件后缀名判断文件类型
function isSFXtoTYPE(suffix) {
  CONFIG.FILE_TYPE.some((item, index) => {
    uploadFileType.value = index; //赋值
    if (item.includes(suffix.toLowerCase())) {
      return true;
    }
  });
}

// 文件被选中后触发的方法
function onFileSelected(event) {
  const file = event.target.files[0]; //文件对象
  fileOrigin.value = file; //选择的文件

  // 用户有选择文件的时候
  if (checkIfObject(fileOrigin.value)) {
    //进行文件的赋值
    selectFileName.value = fileNameDetail(fileOrigin.value.name)[0]; //名字
    selectFileSuffix.value = "." + fileNameDetail(fileOrigin.value.name)[1]; //后缀

    // 根据后缀名获取文件类型
    isSFXtoTYPE(selectFileSuffix.value);

    previewUrl.value = URL.createObjectURL(file) || ""; // 创建一个临时 URL

    // 文件名输入框聚焦
    inputNameFile.value.focus();
  } else {
    // 清空文件对象
    selectFileName.value = "";
    selectFileSuffix.value = "";
    fileRemark.value = "";
  }
}

// 文件名字处理
function fileNameDetail(str) {
  // 使用 lastIndexOf 来找到最后一个 '.' 的位置
  const lastDotIndex = str.lastIndexOf(".");

  // 如果找到了点，则进行分割
  if (lastDotIndex !== -1) {
    let beforeLastDot = str.slice(0, lastDotIndex);
    let afterLastDot = str.slice(lastDotIndex + 1);

    // 根据当前的时间戳状态判断是否添加时间戳
    if (selectTimeNow.value == "true") {
      beforeLastDot = beforeLastDot + "-" + Date.now();
    }
    return [beforeLastDot, afterLastDot];
  } else {
    return [];
  }
}

//是否添加上时间戳的下拉选择器
const handleChange = (value) => {
  // 取消时间戳
  if (value == "false") {
    // 使用 lastIndexOf 来找到最后一个 '-' 的位置
    let lastLineIndex = selectFileName.value.lastIndexOf("-");
    if (lastLineIndex !== -1) {
      selectFileName.value = selectFileName.value.slice(0, lastLineIndex);
    }
  } else {
    selectFileName.value = selectFileName.value + "-" + Date.now();
  }
};

// 清除临时 URL
function clearPreview() {
  URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
}
// 监听组件销毁，确保释放临时 URL
onUnmounted(() => {
  if (previewUrl.value) {
    clearPreview();
  }
});
</script>
<style scoped lang="scss">
.uploadFile {
  .up {
    width: 830px;
    height: 300px;
    margin: 20px auto 0;
    border: 2px dashed #ccc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999999;
    box-sizing: border-box;
    background-color: #fff;
    i {
      font-size: 40px;
    }
    .up-title {
      font-size: 14px;
      margin-top: 10px;
    }
    .up-select {
      width: 200px;
      height: 44px;
      background-color: #00a1d6;
      color: #fff;
      text-align: center;
      line-height: 44px;
      margin: 20px 0;
      border-radius: 5px;
      cursor: pointer;
    }
    .up-correct {
      font-size: 14px;
      vertical-align: middle;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        box-sizing: border-box;
        background-color: #45818e;
        color: #fff;
        padding: 5px 8px;
        font-size: 12px;
        box-sizing: border-box;
        border-radius: 3px;
        margin-left: 5px;
      }
    }
  }
  .up-show {
    width: 830px;
    height: 300px;
    margin: 20px auto 0;
    border: 2px dashed #ccc;
    display: flex;
    justify-content: center;
    position: relative;
    padding: 2px 0;
    overflow: hidden;
    img {
      height: 100%;
    }
    .edit {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 10px;
      top: 10px;
      width: 50px;
      height: 50px;
      background-color: #e9e9e9;
      cursor: pointer;
      i {
        color: #666666;
        font-size: 26px;
      }
    }
  }
  .progress {
    width: 830px;
    margin: 0 auto;
  }
  .showinfo {
    width: 830px;
    margin: 0 auto;
    .setting-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span {
        width: 80px;
      }
      .file_name {
        flex: 1;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      .gradient-animation {
        background: linear-gradient(90deg, #606c88, #3f4c6b, #3f4c6b, #606c88);
        background-size: 200% 100%;
        animation: gradient 3s ease infinite;
      }

      @keyframes gradient {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }
    }
  }
}
</style>
